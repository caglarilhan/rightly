from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import List, Optional
from decimal import Decimal

from app.models import Plan, Subscription, Payment, SubscriptionStatus, PaymentStatus, User
from app.schemas.billing import PlanCreate, PlanUpdate, SubscriptionCreate, PaymentCreate
from app.services.stripe_service import StripeService

class BillingService:
    """Billing işlemleri için servis sınıfı"""
    
    @staticmethod
    async def create_plan(db: AsyncSession, plan_data: PlanCreate) -> Plan:
        """Yeni plan oluştur"""
        plan = Plan(**plan_data.dict())
        db.add(plan)
        await db.commit()
        await db.refresh(plan)
        return plan
    
    @staticmethod
    async def get_plans(db: AsyncSession, active_only: bool = True) -> List[Plan]:
        """Planları getir"""
        query = select(Plan)
        if active_only:
            query = query.where(Plan.is_active == True)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_plan(db: AsyncSession, plan_id: int) -> Optional[Plan]:
        """Plan getir"""
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_plan(db: AsyncSession, plan_id: int, plan_data: PlanUpdate) -> Plan:
        """Plan güncelle"""
        plan = await BillingService.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        update_data = plan_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(plan, field, value)
        
        plan.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(plan)
        return plan
    
    @staticmethod
    async def create_subscription(
        db: AsyncSession,
        user_id: int,
        plan_id: int,
        interval: str = "month"
    ) -> Subscription:
        """Yeni abonelik oluştur"""
        # Kullanıcıyı kontrol et
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Planı kontrol et
        plan = await BillingService.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        # Aktif abonelik var mı kontrol et
        existing_sub = await BillingService.get_active_subscription(db, user_id)
        if existing_sub:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has an active subscription"
            )
        
        # Fiyatı belirle
        amount = plan.price_monthly if interval == "month" else plan.price_yearly
        
        # Abonelik oluştur
        subscription = Subscription(
            user_id=user_id,
            plan_id=plan_id,
            status=SubscriptionStatus.TRIAL,
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=7),  # 7 gün trial
            amount=amount,
            currency=plan.currency,
            interval=interval
        )
        
        db.add(subscription)
        await db.commit()
        await db.refresh(subscription)
        return subscription
    
    @staticmethod
    async def get_user_subscriptions(db: AsyncSession, user_id: int) -> List[Subscription]:
        """Kullanıcının aboneliklerini getir"""
        result = await db.execute(
            select(Subscription)
            .where(Subscription.user_id == user_id)
            .order_by(Subscription.created_at.desc())
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_active_subscription(db: AsyncSession, user_id: int) -> Optional[Subscription]:
        """Kullanıcının aktif aboneliğini getir"""
        result = await db.execute(
            select(Subscription)
            .where(
                and_(
                    Subscription.user_id == user_id,
                    Subscription.status.in_([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL])
                )
            )
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_subscription_status(
        db: AsyncSession,
        subscription_id: int,
        status: SubscriptionStatus
    ) -> Subscription:
        """Abonelik durumunu güncelle"""
        result = await db.execute(select(Subscription).where(Subscription.id == subscription_id))
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found"
            )
        
        subscription.status = status
        subscription.updated_at = datetime.utcnow()
        
        if status == SubscriptionStatus.CANCELED:
            subscription.canceled_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(subscription)
        return subscription
    
    @staticmethod
    async def create_checkout_session(
        db: AsyncSession,
        user_id: int,
        plan_id: int,
        interval: str,
        success_url: str,
        cancel_url: str
    ) -> dict:
        """Checkout session oluştur"""
        # Kullanıcıyı kontrol et
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Planı kontrol et
        plan = await BillingService.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        # Stripe price ID'yi belirle
        price_id = plan.stripe_price_id_monthly if interval == "month" else plan.stripe_price_id_yearly
        if not price_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Plan not configured with Stripe"
            )
        
        # Stripe customer oluştur veya mevcut olanı bul
        customer_id = None
        if user.stripe_customer_id:
            customer_id = user.stripe_customer_id
        else:
            customer_id = StripeService.create_customer(user.email, user.full_name or user.email)
            user.stripe_customer_id = customer_id
            await db.commit()
        
        # Checkout session oluştur
        session = StripeService.create_checkout_session(
            customer_id=customer_id,
            price_id=price_id,
            success_url=success_url,
            cancel_url=cancel_url
        )
        
        return session
    
    @staticmethod
    async def create_customer_portal_session(
        db: AsyncSession,
        user_id: int,
        return_url: str
    ) -> str:
        """Customer portal session oluştur"""
        # Kullanıcıyı kontrol et
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not user.stripe_customer_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User has no Stripe customer ID"
            )
        
        # Portal session oluştur
        portal_url = StripeService.create_customer_portal_session(
            customer_id=user.stripe_customer_id,
            return_url=return_url
        )
        
        return portal_url
    
    @staticmethod
    async def create_payment(
        db: AsyncSession,
        subscription_id: int,
        amount: Decimal,
        stripe_payment_intent_id: Optional[str] = None
    ) -> Payment:
        """Ödeme kaydı oluştur"""
        payment = Payment(
            subscription_id=subscription_id,
            amount=amount,
            stripe_payment_intent_id=stripe_payment_intent_id
        )
        
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        return payment
    
    @staticmethod
    async def update_payment_status(
        db: AsyncSession,
        payment_id: int,
        status: PaymentStatus,
        stripe_invoice_id: Optional[str] = None
    ) -> Payment:
        """Ödeme durumunu güncelle"""
        result = await db.execute(select(Payment).where(Payment.id == payment_id))
        payment = result.scalar_one_or_none()
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        payment.status = status
        payment.updated_at = datetime.utcnow()
        
        if stripe_invoice_id:
            payment.stripe_invoice_id = stripe_invoice_id
        
        if status == PaymentStatus.SUCCEEDED:
            payment.paid_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(payment)
        return payment
    
    @staticmethod
    async def get_user_payments(db: AsyncSession, user_id: int) -> List[Payment]:
        """Kullanıcının ödemelerini getir"""
        result = await db.execute(
            select(Payment)
            .join(Subscription)
            .where(Subscription.user_id == user_id)
            .order_by(Payment.created_at.desc())
        )
        return result.scalars().all()
