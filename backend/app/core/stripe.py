import os
import stripe
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal

# Stripe API key'ini ayarla
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")

class StripeService:
    """Stripe entegrasyonu için servis sınıfı"""
    
    @staticmethod
    def create_customer(email: str, name: str) -> str:
        """Yeni Stripe müşterisi oluştur"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata={
                    "source": "gdpr_hub_lite"
                }
            )
            return customer.id
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe customer creation failed: {str(e)}")
    
    @staticmethod
    def create_subscription(
        customer_id: str,
        price_id: str,
        trial_period_days: int = 7
    ) -> Dict[str, Any]:
        """Yeni abonelik oluştur"""
        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": price_id}],
                trial_period_days=trial_period_days,
                metadata={
                    "source": "gdpr_hub_lite"
                }
            )
            return {
                "id": subscription.id,
                "status": subscription.status,
                "current_period_start": datetime.fromtimestamp(subscription.current_period_start),
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end),
                "trial_end": datetime.fromtimestamp(subscription.trial_end) if subscription.trial_end else None
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe subscription creation failed: {str(e)}")
    
    @staticmethod
    def create_checkout_session(
        customer_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        mode: str = "subscription"
    ) -> Dict[str, Any]:
        """Checkout session oluştur"""
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode=mode,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "source": "gdpr_hub_lite"
                }
            )
            return {
                "id": session.id,
                "url": session.url
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe checkout session creation failed: {str(e)}")
    
    @staticmethod
    def create_customer_portal_session(
        customer_id: str,
        return_url: str
    ) -> str:
        """Customer portal session oluştur"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url
            )
            return session.url
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe customer portal session creation failed: {str(e)}")
    
    @staticmethod
    def cancel_subscription(subscription_id: str, at_period_end: bool = True) -> Dict[str, Any]:
        """Aboneliği iptal et"""
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = stripe.Subscription.cancel(subscription_id)
            
            return {
                "id": subscription.id,
                "status": subscription.status,
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe subscription cancellation failed: {str(e)}")
    
    @staticmethod
    def get_subscription(subscription_id: str) -> Dict[str, Any]:
        """Abonelik bilgilerini getir"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                "id": subscription.id,
                "status": subscription.status,
                "current_period_start": datetime.fromtimestamp(subscription.current_period_start),
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end),
                "cancel_at_period_end": subscription.cancel_at_period_end,
                "customer_id": subscription.customer
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe subscription retrieval failed: {str(e)}")
    
    @staticmethod
    def get_customer(customer_id: str) -> Dict[str, Any]:
        """Müşteri bilgilerini getir"""
        try:
            customer = stripe.Customer.retrieve(customer_id)
            return {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "created": datetime.fromtimestamp(customer.created)
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe customer retrieval failed: {str(e)}")
    
    @staticmethod
    def create_payment_intent(
        amount: int,  # Stripe uses cents
        currency: str = "usd",
        customer_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Payment intent oluştur"""
        try:
            intent_data = {
                "amount": amount,
                "currency": currency,
                "metadata": {
                    "source": "gdpr_hub_lite"
                }
            }
            
            if customer_id:
                intent_data["customer"] = customer_id
            
            intent = stripe.PaymentIntent.create(**intent_data)
            
            return {
                "id": intent.id,
                "client_secret": intent.client_secret,
                "status": intent.status
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe payment intent creation failed: {str(e)}")
    
    @staticmethod
    def verify_webhook_signature(payload: bytes, signature: str, endpoint_secret: str) -> Dict[str, Any]:
        """Webhook imzasını doğrula"""
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, endpoint_secret
            )
            return event
        except ValueError as e:
            raise Exception(f"Invalid payload: {str(e)}")
        except stripe.error.SignatureVerificationError as e:
            raise Exception(f"Invalid signature: {str(e)}")
    
    @staticmethod
    def format_amount(amount: Decimal) -> int:
        """Decimal tutarı Stripe için cent'e çevir"""
        return int(amount * 100)
    
    @staticmethod
    def parse_amount(amount_cents: int) -> Decimal:
        """Stripe cent tutarını Decimal'e çevir"""
        return Decimal(amount_cents) / 100


