from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.billing import PlanType, SubscriptionStatus, PaymentStatus

class PlanBase(BaseModel):
    name: str
    type: PlanType
    price_monthly: Decimal = Field(..., ge=0)
    price_yearly: Decimal = Field(..., ge=0)
    currency: str = "USD"
    max_dsar_requests: int = Field(..., ge=0)
    max_users: int = Field(..., ge=0)
    max_sources: int = Field(..., ge=0)
    features: Optional[str] = None
    stripe_price_id_monthly: Optional[str] = None
    stripe_price_id_yearly: Optional[str] = None

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    price_monthly: Optional[Decimal] = None
    price_yearly: Optional[Decimal] = None
    max_dsar_requests: Optional[int] = None
    max_users: Optional[int] = None
    max_sources: Optional[int] = None
    features: Optional[str] = None
    is_active: Optional[bool] = None

class Plan(PlanBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SubscriptionBase(BaseModel):
    plan_id: int
    interval: str = "month"  # month, year

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    cancel_at_period_end: Optional[bool] = None

class Subscription(SubscriptionBase):
    id: int
    user_id: int
    status: SubscriptionStatus
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    amount: Decimal
    currency: str
    stripe_subscription_id: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    plan: Plan

    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    amount: Decimal = Field(..., ge=0)
    currency: str = "USD"

class PaymentCreate(PaymentBase):
    subscription_id: int

class Payment(PaymentBase):
    id: int
    subscription_id: int
    status: PaymentStatus
    stripe_payment_intent_id: Optional[str] = None
    stripe_invoice_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CreateCheckoutSessionRequest(BaseModel):
    plan_id: int
    interval: str = "month"  # month, year
    success_url: str
    cancel_url: str

class CreateCheckoutSessionResponse(BaseModel):
    session_id: str
    session_url: str

class CreateCustomerPortalRequest(BaseModel):
    return_url: str

class CreateCustomerPortalResponse(BaseModel):
    portal_url: str

class WebhookEvent(BaseModel):
    type: str
    data: dict



