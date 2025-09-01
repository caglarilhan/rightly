from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum, Numeric, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class PlanType(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    AGENCY = "agency"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    UNPAID = "unpaid"
    TRIAL = "trial"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELED = "canceled"

class Plan(Base):
    """Abonelik planları"""
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum(PlanType), nullable=False)
    price_monthly = Column(Numeric(10, 2), nullable=False)
    price_yearly = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    
    # Özellikler
    max_dsar_requests = Column(Integer, nullable=False)
    max_users = Column(Integer, nullable=False)
    max_sources = Column(Integer, nullable=False)
    features = Column(Text, nullable=True)  # JSON string
    
    # Stripe bilgileri
    stripe_price_id_monthly = Column(String(100), nullable=True)
    stripe_price_id_yearly = Column(String(100), nullable=True)
    
    # Durum
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # İlişkiler
    subscriptions = relationship("Subscription", back_populates="plan")
    
    def __repr__(self):
        return f"<Plan(id={self.id}, name='{self.name}', type='{self.type.value}')>"

class Subscription(Base):
    """Kullanıcı abonelikleri"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    
    # Abonelik bilgileri
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    current_period_start = Column(DateTime(timezone=True), nullable=False)
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    cancel_at_period_end = Column(Boolean, default=False)
    
    # Fiyatlandırma
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    interval = Column(String(20), default="month")  # month, year
    
    # Stripe bilgileri
    stripe_subscription_id = Column(String(100), nullable=True)
    stripe_customer_id = Column(String(100), nullable=True)
    
    # Zaman bilgileri
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    canceled_at = Column(DateTime(timezone=True), nullable=True)
    
    # İlişkiler
    plan = relationship("Plan", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")
    
    def __repr__(self):
        return f"<Subscription(id={self.id}, user_id={self.user_id}, plan_id={self.plan_id}, status='{self.status.value}')>"

class Payment(Base):
    """Ödeme kayıtları"""
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    
    # Ödeme bilgileri
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # Stripe bilgileri
    stripe_payment_intent_id = Column(String(100), nullable=True)
    stripe_invoice_id = Column(String(100), nullable=True)
    
    # Zaman bilgileri
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # İlişkiler
    subscription = relationship("Subscription", back_populates="payments")
    
    def __repr__(self):
        return f"<Payment(id={self.id}, subscription_id={self.subscription_id}, amount={self.amount}, status='{self.status.value}')>"
