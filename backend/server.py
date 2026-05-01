from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Naked Lure API")
api_router = APIRouter(prefix="/api")


# -------------------- Models --------------------
CATEGORIES = ["Fishing Shirts", "Patriotic Graphics", "Outdoor Lifestyle"]
DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"]


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    category: str
    price: float
    image_url: str
    sizes: List[str] = Field(default_factory=lambda: list(DEFAULT_SIZES))
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    category: str
    price: float
    image_url: str
    sizes: Optional[List[str]] = None
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    sizes: Optional[List[str]] = None
    featured: Optional[bool] = None


class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    size: str
    quantity: int


class ShippingInfo(BaseModel):
    full_name: str
    email: EmailStr
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"


class OrderCreate(BaseModel):
    items: List[CartItem]
    shipping: ShippingInfo
    payment_method: str = "mock"


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"NL-{uuid.uuid4().hex[:8].upper()}")
    items: List[CartItem]
    shipping: ShippingInfo
    payment_method: str = "mock"
    subtotal: float
    shipping_cost: float
    tax: float
    total: float
    status: str = "confirmed"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str = ""
    message: str


# -------------------- Seed Products --------------------
SEED_PRODUCTS = [
    {
        "name": "Eastern Sierra",
        "description": "Escape to the high country. Our Eastern Sierra tee captures the rugged beauty of California's alpine lakes, granite peaks, and pine-lined shores. Soft, heavyweight cotton built for the trail.",
        "category": "Fishing Shirts",
        "price": 34.99,
        "image_url": "https://customer-assets.emergentagent.com/job_34afdf14-6d91-4e00-af4a-38ae101f3446/artifacts/aljoxthz_Patriotic%20Graphic%20Shirt_Eastern%20Sierra.png",
        "featured": True,
    },
    {
        "name": "Trout Surfing",
        "description": "Stars, stripes, and one bold rainbow trout riding a wave. A patriotic nod to America's love for wild water and wilder fish.",
        "category": "Outdoor Lifestyle",
        "price": 34.99,
        "image_url": "https://customer-assets.emergentagent.com/job_34afdf14-6d91-4e00-af4a-38ae101f3446/artifacts/1jxpfgtl_Patriotic%20Graphic%20Shirt_Trout%20Surfing.png",
        "featured": True,
    },
    {
        "name": "America Loves Fishing",
        "description": "Uncle Sam and Lady Liberty hit the river. A freedom-loving graphic for the angler who bleeds red, white, and blue.",
        "category": "Patriotic Graphics",
        "price": 34.99,
        "image_url": "https://customer-assets.emergentagent.com/job_34afdf14-6d91-4e00-af4a-38ae101f3446/artifacts/90cjfdnb_Patriotic%20Graphic%20Shirt_America%20Loves%20FIshing.png",
        "featured": True,
    },
    {
        "name": "Grateful Dead Angler",
        "description": "A skeleton on the riverbank casting under cobalt skies. Timeless Americana meets alpine trout water.",
        "category": "Patriotic Graphics",
        "price": 34.99,
        "image_url": "https://customer-assets.emergentagent.com/job_34afdf14-6d91-4e00-af4a-38ae101f3446/artifacts/7qkhetdu_Patriotic%20Graphic%20Shirt_Grateful%20Dead.png",
        "featured": True,
    },
]


def _doc_to_product(doc: dict) -> dict:
    doc.pop("_id", None)
    if isinstance(doc.get("created_at"), str):
        try:
            doc["created_at"] = datetime.fromisoformat(doc["created_at"])
        except Exception:
            pass
    return doc


async def _ensure_seed():
    count = await db.products.count_documents({})
    if count == 0:
        for p in SEED_PRODUCTS:
            prod = Product(**p)
            doc = prod.model_dump()
            doc["created_at"] = doc["created_at"].isoformat()
            await db.products.insert_one(doc)


# -------------------- Routes --------------------
@api_router.get("/")
async def root():
    return {"message": "Naked Lure API", "status": "ok"}


@api_router.get("/categories")
async def get_categories():
    return {"categories": CATEGORIES, "sizes": DEFAULT_SIZES}


@api_router.post("/seed")
async def seed_db():
    await db.products.delete_many({})
    inserted = []
    for p in SEED_PRODUCTS:
        prod = Product(**p)
        doc = prod.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        await db.products.insert_one(doc)
        inserted.append(prod.id)
    return {"seeded": len(inserted), "ids": inserted}


@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    await _ensure_seed()
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    docs = await db.products.find(query, {"_id": 0}).to_list(1000)
    return [Product(**_doc_to_product(d)) for d in docs]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**_doc_to_product(doc))


@api_router.post("/products", response_model=Product)
async def create_product(payload: ProductCreate):
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of {CATEGORIES}")
    data = payload.model_dump()
    if not data.get("sizes"):
        data["sizes"] = list(DEFAULT_SIZES)
    prod = Product(**data)
    doc = prod.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.products.insert_one(doc)
    return prod


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, payload: ProductUpdate):
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "category" in update_data and update_data["category"] not in CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of {CATEGORIES}")
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**_doc_to_product(doc))


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True, "id": product_id}


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    subtotal = round(sum(i.price * i.quantity for i in payload.items), 2)
    shipping_cost = 0.0 if subtotal >= 75 else 7.99
    tax = round(subtotal * 0.08, 2)
    total = round(subtotal + shipping_cost + tax, 2)
    order = Order(
        items=payload.items,
        shipping=payload.shipping,
        payment_method=payload.payment_method,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        tax=tax,
        total=total,
    )
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.orders.insert_one(doc)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    orders = []
    for d in docs:
        if isinstance(d.get("created_at"), str):
            try:
                d["created_at"] = datetime.fromisoformat(d["created_at"])
            except Exception:
                pass
        orders.append(Order(**d))
    return orders


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await _ensure_seed()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
