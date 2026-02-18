from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class ProductBase(BaseModel):
    title: str
    details: str
    price: Decimal
    offer_price: Decimal
    stock: int
    img_url: Optional[str] = None
    category: str
    sub_category: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    seller: Optional[str] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    order_type: str
    total_amount: Decimal
    currency: str = "SAR"

class OrderCreate(OrderBase):
    product_ids: List[int]

class OrderResponse(OrderBase):
    id: int
    order_number: str
    payment_status: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
