import stripe
import os
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional

# Stripe Configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dev_key")

# Billing Models
class CreateCheckoutSession(BaseModel):
    plan: str  # "free", "starter", "pro", "agency"
    success_url: str
    cancel_url: str

class SubscriptionUpdate(BaseModel):
    subscription_id: str
    plan: str

# Plan configurations
PLANS = {
    "free": {
        "price_id": "price_free",
        "name": "Free",
        "price": 0,
        "features": ["1 DSAR/ay", "Tek kaynak"]
    },
    "starter": {
        "price_id": "price_starter", 
        "name": "Starter",
        "price": 19,
        "features": ["10 DSAR/ay", "Shopify veya WooCommerce"]
    },
    "pro": {
        "price_id": "price_pro",
        "name": "Pro", 
        "price": 49,
        "features": ["Sınırsız DSAR", "Tüm kaynaklar", "SLA takibi"]
    },
    "agency": {
        "price_id": "price_agency",
        "name": "Agency",
        "price": 99,
        "features": ["Çoklu mağaza", "5 koltuk", "Beyaz etiket"]
    }
}

# Billing functions (not endpoints)
async def create_checkout_session(data: CreateCheckoutSession):
    try:
        plan = PLANS.get(data.plan)
        if not plan:
            raise HTTPException(status_code=400, detail="Invalid plan")
        
        # For free plan, return success immediately
        if data.plan == "free":
            return {
                "success": True,
                "plan": data.plan,
                "message": "Free plan activated"
            }
        
        # Create Stripe checkout session for paid plans
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': f'GDPR Hub Lite - {plan["name"]}',
                        'description': ', '.join(plan["features"])
                    },
                    'unit_amount': plan["price"] * 100,  # Stripe uses cents
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=data.success_url,
            cancel_url=data.cancel_url,
        )
        
        return {
            "session_id": checkout_session.id,
            "url": checkout_session.url
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def stripe_webhook(request: dict):
    try:
        event = request
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Handle successful payment
            return {"status": "success", "message": "Payment completed"}
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            # Handle subscription cancellation
            return {"status": "success", "message": "Subscription cancelled"}
            
        return {"status": "success", "message": "Webhook processed"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_plans():
    return {
        "plans": PLANS,
        "currency": "EUR",
        "billing_cycle": "monthly"
    }

async def update_subscription(data: SubscriptionUpdate):
    try:
        # Update subscription in Stripe
        subscription = stripe.Subscription.modify(
            data.subscription_id,
            items=[{
                'id': 'subscription_item_id',  # You'll need to get this from the subscription
                'price': PLANS[data.plan]['price_id']
            }]
        )
        
        return {
            "success": True,
            "subscription_id": subscription.id,
            "plan": data.plan
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
