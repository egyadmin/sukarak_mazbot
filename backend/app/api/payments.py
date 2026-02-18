"""XPay Payment Gateway Integration - ported from old PHP system."""
import httpx
import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.ecommerce import Order, OrderItem
from app.models.membership import UserMembership, MembershipCard

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])

# XPay Configuration (from old system)
XPAY_COMMUNITY_ID = "JBeLZ25"
XPAY_API_KEY = "5FKuazKs.4pYS0s3Vep6rtPs896v16emdAyc9nwyK"
XPAY_BASE_URL = "https://staging.xpay.app/api/v1"
XPAY_VARIABLE_AMOUNT_ID = 2463


# Currency mapping (from old getServices.php)
COUNTRY_CURRENCY_MAP = {
    "EG": "EGP", "SA": "SAR", "AE": "AED", "KW": "KWD",
    "QA": "QAR", "BH": "BHD", "OM": "OMR", "JO": "JOD",
    "LY": "LYD", "SD": "SDG", "YE": "YER", "DZ": "DZD",
    "TN": "TND", "LB": "LBP", "MA": "MAD", "OTHER": "USD",
}


@router.post("/create")
async def create_payment(data: dict, db: Session = Depends(get_db)):
    """
    Create XPay payment session.
    
    Accepts:
    - order_id: existing order ID (for product orders)
    - OR amount + currency + user: direct payment (for subscriptions/memberships)
    - payment_type: 'order', 'membership', 'consultation'
    """
    payment_type = data.get("payment_type", "order")
    
    # Determine amount, currency, user info
    if payment_type == "order" and "order_id" in data:
        order_id = data["order_id"]
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order.payment_status == "paid":
            raise HTTPException(status_code=400, detail="Order already paid")
        amount = float(order.total_amount) if order.total_amount else 0
        currency = order.currency or "SAR"
        user_name = data.get("user", {}).get("name", "Customer")
        user_email = data.get("user", {}).get("email", "customer@app.com")
        user_phone = data.get("user", {}).get("phone", "0000000000")
        user_id = order.user_id or 1
    else:
        # Direct payment (membership, consultation, etc.)
        amount = data.get("amount", 0)
        currency = data.get("currency", "SAR")
        user = data.get("user", {})
        user_name = user.get("name", "Customer")
        user_email = user.get("email", "customer@app.com")
        user_phone = user.get("phone", "0000000000")
        user_id = user.get("id", 1)
        order_id = None

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    async with httpx.AsyncClient(timeout=15) as client:
        # ========== Step 1: Prepare Amount ==========
        prepare_resp = await client.post(
            f"{XPAY_BASE_URL}/payments/prepare-amount/",
            json={
                "community_id": XPAY_COMMUNITY_ID,
                "amount": amount,
                "currency": currency,
            },
            headers={"Content-Type": "application/json"}
        )
        prepare_data = prepare_resp.json()
        
        if not prepare_data or prepare_data.get("status", {}).get("code") != 200:
            logger.error(f"XPay prepare failed: {prepare_data}")
            raise HTTPException(status_code=502, detail="Payment preparation failed")
        
        total_amount = prepare_data["data"]["total_amount"]

        # ========== Step 2: Pay Request ==========
        custom_fields = [
            {"field_label": "customer_id", "field_value": str(user_id)},
        ]
        
        if order_id:
            custom_fields.append({"field_label": "order_id", "field_value": str(order_id)})
        
        if payment_type:
            custom_fields.append({"field_label": "payment_type", "field_value": payment_type})

        if data.get("card_type"):
            custom_fields.append({"field_label": "card_type", "field_value": data["card_type"]})

        pay_resp = await client.post(
            f"{XPAY_BASE_URL}/payments/pay/variable-amount",
            json={
                "community_id": XPAY_COMMUNITY_ID,
                "amount": total_amount,
                "original_amount": amount,
                "currency": currency,
                "pay_using": "card",
                "variable_amount_id": XPAY_VARIABLE_AMOUNT_ID,
                "billing_data": {
                    "name": user_name,
                    "email": user_email,
                    "phone_number": user_phone,
                },
                "custom_fields": custom_fields,
            },
            headers={
                "Content-Type": "application/json",
                "x-api-key": XPAY_API_KEY,
            }
        )
        pay_data = pay_resp.json()

        if pay_data and pay_data.get("status", {}).get("code") == 200 and "iframe_url" in pay_data.get("data", {}):
            transaction_uuid = pay_data["data"].get("transaction_uuid")
            
            # Update order with payment reference if order-based
            if order_id:
                order.payment_reference = transaction_uuid
                order.payment_method = "card"
                db.commit()
            
            return {
                "iframe_url": pay_data["data"]["iframe_url"],
                "payment_id": transaction_uuid,
                "order_id": order_id,
                "total_amount": total_amount,
            }
        else:
            logger.error(f"XPay pay request failed: {pay_data}")
            raise HTTPException(status_code=502, detail="Payment request failed")


@router.post("/check-status")
async def check_payment_status(data: dict, db: Session = Depends(get_db)):
    """
    Check XPay transaction status and update order accordingly.
    """
    transaction_uuid = data.get("transaction_uuid")
    order_id = data.get("order_id")
    payment_type = data.get("payment_type", "order")
    
    if not transaction_uuid:
        raise HTTPException(status_code=400, detail="Missing transaction_uuid")
    
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{XPAY_BASE_URL}/communities/{XPAY_COMMUNITY_ID}/transactions/{transaction_uuid}/",
            headers={
                "Content-Type": "application/json",
                "x-api-key": XPAY_API_KEY,
            }
        )
        resp_data = resp.json()
    
    if not resp_data or resp_data.get("status", {}).get("code") != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch transaction status")
    
    transaction = resp_data["data"]
    xpay_status = transaction.get("status", "")
    
    # Map XPay status to our status
    if xpay_status in ("succeeded", "SUCCESSFUL"):
        payment_status = "paid"
        order_status = "confirmed"
    elif xpay_status in ("failed", "FAILED"):
        payment_status = "failed"
        order_status = "cancelled"
    else:
        payment_status = "pending"
        order_status = "pending"
    
    # Update order if order-based payment
    if order_id:
        order = db.query(Order).filter(Order.id == int(order_id)).first()
        if order:
            order.payment_status = payment_status
            order.status = order_status
            order.payment_reference = str(transaction_uuid)
            
            # If paid, update stock
            if payment_status == "paid":
                items = db.query(OrderItem).filter(OrderItem.order_id == int(order_id)).all()
                # Stock update logic can be added here
            
            db.commit()
    
    # Handle membership payment
    if payment_type == "membership" and payment_status == "paid":
        card_type = data.get("card_type")
        user_id = data.get("user_id", 1)
        if card_type:
            from datetime import datetime, timedelta
            card = db.query(MembershipCard).filter(MembershipCard.card_type == card_type).first()
            existing = db.query(UserMembership).filter(
                UserMembership.user_id == user_id,
                UserMembership.status == "active"
            ).first()
            if existing:
                existing.status = "upgraded"
            
            now = datetime.now()
            membership = UserMembership(
                user_id=user_id,
                card_type=card_type,
                start_date=now.strftime("%Y-%m-%d"),
                end_date=(now + timedelta(days=365)).strftime("%Y-%m-%d"),
                amount_paid=float(transaction.get("total_amount", 0)),
                currency=transaction.get("currency", "SAR"),
                payment_method="card",
                status="active"
            )
            db.add(membership)
            db.commit()
    
    return {
        "status": payment_status,
        "order_status": order_status,
        "transaction": transaction,
    }


@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """
    XPay webhook endpoint - receives payment notifications.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    logger.info(f"Payment webhook received: {body}")
    
    transaction_data = body.get("data", {})
    transaction_id = transaction_data.get("id")
    status = transaction_data.get("status")
    
    # Extract custom fields
    custom_fields = transaction_data.get("custom_fields", [])
    order_id = None
    customer_id = None
    payment_type = "order"
    card_type = None
    
    for field in custom_fields:
        if field.get("field_label") == "order_id":
            order_id = int(field["field_value"])
        if field.get("field_label") == "customer_id":
            customer_id = int(field["field_value"])
        if field.get("field_label") == "payment_type":
            payment_type = field["field_value"]
        if field.get("field_label") == "card_type":
            card_type = field["field_value"]
    
    # Map status
    if status in ("succeeded", "SUCCESSFUL"):
        payment_status = "paid"
        order_status = "confirmed"
    elif status in ("failed", "FAILED"):
        payment_status = "failed"
        order_status = "cancelled"
    else:
        payment_status = "pending"
        order_status = "pending"
    
    # Handle order payment
    if order_id:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            order.payment_status = payment_status
            order.status = order_status
            order.payment_reference = str(transaction_id)
            db.commit()
    
    # Handle membership payment
    if payment_type == "membership" and payment_status == "paid" and card_type and customer_id:
        from datetime import datetime, timedelta
        existing = db.query(UserMembership).filter(
            UserMembership.user_id == customer_id,
            UserMembership.status == "active"
        ).first()
        if existing:
            existing.status = "upgraded"
        
        now = datetime.now()
        membership = UserMembership(
            user_id=customer_id,
            card_type=card_type,
            start_date=now.strftime("%Y-%m-%d"),
            end_date=(now + timedelta(days=365)).strftime("%Y-%m-%d"),
            amount_paid=float(transaction_data.get("total_amount", 0)),
            currency=transaction_data.get("currency", "SAR"),
            payment_method="card",
            status="active"
        )
        db.add(membership)
        db.commit()
    
    logger.info(f"Webhook processed: order_id={order_id}, status={payment_status}")
    
    return {
        "status": "success",
        "order_id": order_id,
        "payment_status": payment_status,
    }
