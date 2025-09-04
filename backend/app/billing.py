# Stripe Billing Integration

import os
import stripe
import requests
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter()

# Environment variables
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "sk_test_...")

# Subscription Plans
SUBSCRIPTION_PLANS = {
    "free": {
        "name": "Free",
        "price": 0,
        "dsar_limit": 1,
        "features": ["Basic DSAR processing", "Email support"]
    },
    "starter": {
        "name": "Starter",
        "price": 1900,  # €19.00
        "dsar_limit": 10,
        "features": ["10 DSAR/month", "Export reports", "Email support"]
    },
    "professional": {
        "name": "Professional", 
        "price": 4900,  # €49.00
        "dsar_limit": 50,
        "features": ["50 DSAR/month", "Priority support", "Audit logs"]
    },
    "enterprise": {
        "name": "Enterprise",
        "price": 9900,  # €99.00
        "dsar_limit": -1,  # Unlimited
        "features": ["Unlimited DSAR", "Phone support", "Custom integrations"]
    }
}

class CreateCheckoutSession(BaseModel):
    plan_id: str
    shop_domain: str
    return_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(data: CreateCheckoutSession):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {
                        "name": SUBSCRIPTION_PLANS[data.plan_id]["name"],
                    },
                    "unit_amount": SUBSCRIPTION_PLANS[data.plan_id]["price"],
                },
                "quantity": 1,
            }],
            mode="subscription",
            success_url=f"{data.return_url}?success=true",
            cancel_url=f"{data.return_url}?canceled=true",
            metadata={
                "shop_domain": data.shop_domain,
                "plan_id": data.plan_id
            }
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_...")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        shop_domain = session["metadata"]["shop_domain"]
        plan_id = session["metadata"]["plan_id"]
        
        # Update user subscription
        print(f"Subscription completed: {shop_domain} -> {plan_id}")
    
    return {"status": "success"}

class ShopifyBilling:
    def __init__(self, shop_domain: str, access_token: str):
        self.shop_domain = shop_domain
        self.access_token = access_token
        self.base_url = f"https://{shop_domain}/admin/api/2023-10"
    
    def create_recurring_charge(self, plan_id: str):
        """Create recurring application charge"""
        url = f"{self.base_url}/recurring_application_charges.json"
        
        data = {
            "recurring_application_charge": {
                "name": SUBSCRIPTION_PLANS[plan_id]["name"],
                "price": SUBSCRIPTION_PLANS[plan_id]["price"] / 100,
                "return_url": f"https://app.gdpr-hub-lite.com/billing/activate?shop={self.shop_domain}",
                "trial_days": 14,
                "test": True
            }
        }
        
        headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, json=data, headers=headers)
        return response.json()
