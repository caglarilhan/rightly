from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import stripe
import os

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User
from app.schemas.billing import (
    Plan, PlanCreate, PlanUpdate,
    Subscription, SubscriptionCreate,
    Payment, CreateCheckoutSessionRequest, CreateCheckoutSessionResponse,
    CreateCustomerPortalRequest, CreateCustomerPortalResponse,
    WebhookEvent
)
from app.services.billing_service import BillingService
from app.services.stripe_service import StripeService

router = APIRouter()

# Plan endpoints
@router.get("/plans", response_model=List[Plan])
async def get_plans(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Aktif planları getir"""
    return await BillingService.get_plans(db, active_only)

@router.get("/plans/{plan_id}", response_model=Plan)
async def get_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Plan detayını getir"""
    plan = await BillingService.get_plan(db, plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return plan

@router.post("/plans", response_model=Plan)
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Yeni plan oluştur (sadece admin)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create plans"
        )
    return await BillingService.create_plan(db, plan_data)

@router.put("/plans/{plan_id}", response_model=Plan)
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Plan güncelle (sadece admin)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update plans"
        )
    return await BillingService.update_plan(db, plan_id, plan_data)

# Subscription endpoints
@router.get("/subscriptions", response_model=List[Subscription])
async def get_user_subscriptions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının aboneliklerini getir"""
    return await BillingService.get_user_subscriptions(db, current_user.id)

@router.get("/subscriptions/active", response_model=Subscription)
async def get_active_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının aktif aboneliğini getir"""
    subscription = await BillingService.get_active_subscription(db, current_user.id)
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    return subscription

@router.post("/subscriptions", response_model=Subscription)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Yeni abonelik oluştur"""
    return await BillingService.create_subscription(
        db, current_user.id, subscription_data.plan_id, subscription_data.interval
    )

# Checkout endpoints
@router.post("/checkout", response_model=CreateCheckoutSessionResponse)
async def create_checkout_session(
    checkout_data: CreateCheckoutSessionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Checkout session oluştur"""
    session = await BillingService.create_checkout_session(
        db=db,
        user_id=current_user.id,
        plan_id=checkout_data.plan_id,
        interval=checkout_data.interval,
        success_url=checkout_data.success_url,
        cancel_url=checkout_data.cancel_url
    )
    
    return CreateCheckoutSessionResponse(
        session_id=session["id"],
        url=session["url"]
    )

@router.post("/customer-portal", response_model=CreateCustomerPortalResponse)
async def create_customer_portal_session(
    portal_data: CreateCustomerPortalRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customer portal session oluştur"""
    portal_url = await BillingService.create_customer_portal_session(
        db=db,
        user_id=current_user.id,
        return_url=portal_data.return_url
    )
    
    return CreateCustomerPortalResponse(url=portal_url)

# Payment endpoints
@router.get("/payments", response_model=List[Payment])
async def get_user_payments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının ödemelerini getir"""
    return await BillingService.get_user_payments(db, current_user.id)

# Webhook endpoint
@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Stripe webhook'larını işle"""
    payload = await request.body()
    signature = request.headers.get("stripe-signature")
    
    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing stripe-signature header"
        )
    
    try:
        # Webhook imzasını doğrula
        event = StripeService.verify_webhook_signature(
            payload=payload,
            signature=signature,
            endpoint_secret=os.getenv("STRIPE_WEBHOOK_SECRET", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid signature: {str(e)}"
        )
    
    # Event tipine göre işle
    event_type = event["type"]
    
    if event_type == "checkout.session.completed":
        await handle_checkout_completed(db, event["data"]["object"])
    elif event_type == "invoice.payment_succeeded":
        await handle_invoice_payment_succeeded(db, event["data"]["object"])
    elif event_type == "invoice.payment_failed":
        await handle_invoice_payment_failed(db, event["data"]["object"])
    elif event_type == "customer.subscription.updated":
        await handle_subscription_updated(db, event["data"]["object"])
    elif event_type == "customer.subscription.deleted":
        await handle_subscription_deleted(db, event["data"]["object"])
    
    return {"status": "success"}

async def handle_checkout_completed(db: AsyncSession, session_data: dict):
    """Checkout tamamlandığında çalışır"""
    # Burada subscription'ı aktif hale getir
    # Stripe customer ID'yi kullanıcıya kaydet
    pass

async def handle_invoice_payment_succeeded(db: AsyncSession, invoice_data: dict):
    """Ödeme başarılı olduğunda çalışır"""
    # Ödeme kaydını güncelle
    pass

async def handle_invoice_payment_failed(db: AsyncSession, invoice_data: dict):
    """Ödeme başarısız olduğunda çalışır"""
    # Ödeme kaydını güncelle
    pass

async def handle_subscription_updated(db: AsyncSession, subscription_data: dict):
    """Abonelik güncellendiğinde çalışır"""
    # Abonelik durumunu güncelle
    pass

async def handle_subscription_deleted(db: AsyncSession, subscription_data: dict):
    """Abonelik silindiğinde çalışır"""
    # Abonelik durumunu iptal olarak işaretle
    pass
