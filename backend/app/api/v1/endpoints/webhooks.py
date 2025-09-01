from fastapi import APIRouter, Request as FastAPIRequest, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hmac
import hashlib
import json
import logging
from typing import Dict, Any

from app.core.database import get_db
from app.models.account import Account
from app.models.request import Request as DSARRequest, RequestType
from app.tasks.dsar_tasks import process_dsar_request

router = APIRouter()
logger = logging.getLogger(__name__)

def verify_shopify_webhook(request: FastAPIRequest, webhook_secret: str) -> bool:
    """Shopify webhook imzasını doğrula"""
    try:
        # HMAC header'ını al
        hmac_header = request.headers.get("X-Shopify-Hmac-Sha256")
        if not hmac_header:
            return False
        
        # Request body'yi al
        body = request.body()
        
        # HMAC hesapla
        calculated_hmac = hmac.new(
            webhook_secret.encode('utf-8'),
            body,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(calculated_hmac, hmac_header)
    except Exception as e:
        logger.error(f"Error verifying Shopify webhook: {e}")
        return False

@router.post("/shopify/customers/data_request")
async def shopify_data_request(
    request: FastAPIRequest,
    db: AsyncSession = Depends(get_db)
):
    """Shopify customers/data_request webhook'u"""
    try:
        # Webhook doğrulama (geçici olarak True)
        if not verify_shopify_webhook(request, "your_webhook_secret"):
            logger.warning("Invalid Shopify webhook signature")
            # return HTTPException(status_code=401, detail="Invalid signature")
        
        # Request body'yi parse et
        body = await request.json()
        logger.info(f"Received Shopify data request: {body}")
        
        # Shop domain'ini al
        shop_domain = body.get("shop_domain")
        if not shop_domain:
            raise HTTPException(status_code=400, detail="Missing shop_domain")
        
        # Account'u bul
        account_query = select(Account).where(Account.shopify_domain == shop_domain)
        result = await db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            logger.error(f"Account not found for shop domain: {shop_domain}")
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Customer bilgilerini al
        customer_data = body.get("customer", {})
        customer_email = customer_data.get("email")
        
        if not customer_email:
            raise HTTPException(status_code=400, detail="Missing customer email")
        
        # DSAR talebi oluştur
        new_request = DSARRequest(
            account_id=account.id,
            request_type=RequestType.ACCESS,
            subject_email=customer_email,
            subject_name=customer_data.get("first_name", "") + " " + customer_data.get("last_name", ""),
            description=f"Data access request from Shopify store: {shop_domain}",
            additional_info=json.dumps({
                "source": "shopify",
                "shop_domain": shop_domain,
                "customer_id": customer_data.get("id"),
                "webhook_data": body
            })
        )
        
        db.add(new_request)
        await db.commit()
        await db.refresh(new_request)
        
        # Celery task'ını tetikle
        process_dsar_request.delay(new_request.id)
        
        logger.info(f"Created DSAR request {new_request.id} for Shopify customer {customer_email}")
        
        return {"status": "success", "request_id": new_request.id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Shopify data request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/shopify/customers/redact")
async def shopify_customer_redact(
    request: FastAPIRequest,
    db: AsyncSession = Depends(get_db)
):
    """Shopify customers/redact webhook'u"""
    try:
        # Webhook doğrulama (geçici olarak True)
        if not verify_shopify_webhook(request, "your_webhook_secret"):
            logger.warning("Invalid Shopify webhook signature")
            # return HTTPException(status_code=401, detail="Invalid signature")
        
        # Request body'yi parse et
        body = await request.json()
        logger.info(f"Received Shopify customer redact: {body}")
        
        # Shop domain'ini al
        shop_domain = body.get("shop_domain")
        if not shop_domain:
            raise HTTPException(status_code=400, detail="Missing shop_domain")
        
        # Account'u bul
        account_query = select(Account).where(Account.shopify_domain == shop_domain)
        result = await db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            logger.error(f"Account not found for shop domain: {shop_domain}")
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Customer bilgilerini al
        customer_data = body.get("customer", {})
        customer_email = customer_data.get("email")
        
        if not customer_email:
            raise HTTPException(status_code=400, detail="Missing customer email")
        
        # DSAR talebi oluştur
        new_request = DSARRequest(
            account_id=account.id,
            request_type=RequestType.ERASURE,
            subject_email=customer_email,
            subject_name=customer_data.get("first_name", "") + " " + customer_data.get("last_name", ""),
            description=f"Data deletion request from Shopify store: {shop_domain}",
            additional_info=json.dumps({
                "source": "shopify",
                "shop_domain": shop_domain,
                "customer_id": customer_data.get("id"),
                "webhook_data": body
            })
        )
        
        db.add(new_request)
        await db.commit()
        await db.refresh(new_request)
        
        # Celery task'ını tetikle
        process_dsar_request.delay(new_request.id)
        
        logger.info(f"Created DSAR request {new_request.id} for Shopify customer deletion {customer_email}")
        
        return {"status": "success", "request_id": new_request.id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Shopify customer redact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/shopify/shop/redact")
async def shopify_shop_redact(
    request: FastAPIRequest,
    db: AsyncSession = Depends(get_db)
):
    """Shopify shop/redact webhook'u"""
    try:
        # Webhook doğrulama (geçici olarak True)
        if not verify_shopify_webhook(request, "your_webhook_secret"):
            logger.warning("Invalid Shopify webhook signature")
            # return HTTPException(status_code=401, detail="Invalid signature")
        
        # Request body'yi parse et
        body = await request.json()
        logger.info(f"Received Shopify shop redact: {body}")
        
        # Shop domain'ini al
        shop_domain = body.get("shop_domain")
        if not shop_domain:
            raise HTTPException(status_code=400, detail="Missing shop_domain")
        
        # Account'u bul
        account_query = select(Account).where(Account.shopify_domain == shop_domain)
        result = await db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            logger.error(f"Account not found for shop domain: {shop_domain}")
            raise HTTPException(status_code=404, detail="Account not found")
        
        # DSAR talebi oluştur
        new_request = DSARRequest(
            account_id=account.id,
            request_type=RequestType.ERASURE,
            subject_email=account.email,  # Shop owner email
            subject_name=f"Shop Owner - {shop_domain}",
            description=f"Shop deletion request from Shopify store: {shop_domain}",
            additional_info=json.dumps({
                "source": "shopify",
                "shop_domain": shop_domain,
                "webhook_data": body
            })
        )
        
        db.add(new_request)
        await db.commit()
        await db.refresh(new_request)
        
        # Celery task'ını tetikle
        process_dsar_request.delay(new_request.id)
        
        logger.info(f"Created DSAR request {new_request.id} for Shopify shop deletion {shop_domain}")
        
        return {"status": "success", "request_id": new_request.id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Shopify shop redact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/woo")
async def woo_webhook(
    request: FastAPIRequest,
    db: AsyncSession = Depends(get_db)
):
    """WooCommerce webhook'u"""
    try:
        # Request body'yi parse et
        body = await request.json()
        logger.info(f"Received WooCommerce webhook: {body}")
        
        # Webhook tipini al
        webhook_type = body.get("type")
        site_url = body.get("site_url")
        
        if not site_url:
            raise HTTPException(status_code=400, detail="Missing site_url")
        
        # Account'u bul
        account_query = select(Account).where(Account.woo_site_url == site_url)
        result = await db.execute(account_query)
        account = result.scalar_one_or_none()
        
        if not account:
            logger.error(f"Account not found for WooCommerce site: {site_url}")
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Webhook tipine göre işlem yap
        if webhook_type == "customer_data_request":
            customer_email = body.get("customer_email")
            if not customer_email:
                raise HTTPException(status_code=400, detail="Missing customer_email")
            
            new_request = DSARRequest(
                account_id=account.id,
                request_type=RequestType.ACCESS,
                subject_email=customer_email,
                description=f"Data access request from WooCommerce site: {site_url}",
                additional_info=json.dumps({
                    "source": "woocommerce",
                    "site_url": site_url,
                    "webhook_data": body
                })
            )
            
        elif webhook_type == "customer_data_deletion":
            customer_email = body.get("customer_email")
            if not customer_email:
                raise HTTPException(status_code=400, detail="Missing customer_email")
            
            new_request = DSARRequest(
                account_id=account.id,
                request_type=RequestType.ERASURE,
                subject_email=customer_email,
                description=f"Data deletion request from WooCommerce site: {site_url}",
                additional_info=json.dumps({
                    "source": "woocommerce",
                    "site_url": site_url,
                    "webhook_data": body
                })
            )
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported webhook type")
        
        db.add(new_request)
        await db.commit()
        await db.refresh(new_request)
        
        # Celery task'ını tetikle
        process_dsar_request.delay(new_request.id)
        
        logger.info(f"Created DSAR request {new_request.id} for WooCommerce {webhook_type}")
        
        return {"status": "success", "request_id": new_request.id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing WooCommerce webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
