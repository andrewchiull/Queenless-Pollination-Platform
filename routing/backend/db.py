import json
import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Field, Relationship, create_engine
from sqlalchemy.pool import NullPool

load_dotenv()
DB_HOST = os.getenv("DB_HOST") or "localhost"
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
CHARSET = "utf8mb4"

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}?charset={CHARSET}"
engine = create_engine(DB_URL, echo=True, poolclass=NullPool)

def create_db_and_tables():
    print(DB_URL)
    SQLModel.metadata.create_all(engine)


async def read_local_products():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res

async def read_local_purchases():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'purchases.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res

class Product(SQLModel, table=True):
    __tablename__ = "product"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)
    item: list["Item"] = Relationship(back_populates="product")

class PurchaseCustomerLink(SQLModel, table=True):
    __tablename__ = "purchase_customer_link"
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id", primary_key=True)
    customer_id: int | None = Field(default=None, foreign_key="customer.id", primary_key=True)

class Customer(SQLModel, table=True):
    __tablename__ = "customer"
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)

    purchase: list["Purchase"] = Relationship(back_populates="customer", link_model=PurchaseCustomerLink)

class PurchaseItemLink(SQLModel, table=True):
    __tablename__ = "purchase_item_link"
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id", primary_key=True)
    item_id: int | None = Field(default=None, foreign_key="item.id", primary_key=True)

class Item(SQLModel, table=True):
    __tablename__ = "item"
    id: int | None = Field(default=None, primary_key=True)
    quantity: int = Field(index=True)
    product_id: int = Field(index=True, foreign_key="product.id")

    product: Product = Relationship(back_populates="item")
    purchase: "Purchase" = Relationship(back_populates="item", link_model=PurchaseItemLink)

class Purchase(SQLModel, table=True):
    __tablename__ = "purchase"
    id: int | None = Field(default=None, primary_key=True)
    description: str = Field(default="XYZ", index=True)

    customer: Customer = Relationship(back_populates="purchase", link_model=PurchaseCustomerLink)
    item: list["Item"] = Relationship(back_populates="purchase", link_model=PurchaseItemLink)

class PurchasePublic(SQLModel):
    purchase: Purchase
    customer: Customer
    item: list[Item]
