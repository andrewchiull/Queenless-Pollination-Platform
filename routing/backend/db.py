import os
from datetime import datetime
from dotenv import load_dotenv
from sqlmodel import Relationship, Session, create_engine, Field, SQLModel, select

load_dotenv()
DB_HOST = os.getenv("DB_HOST") or "localhost"
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DB_URL, echo=True)

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

if __name__ == "__main__":
    print("Testing: read_products()")

    def read_products():
        with Session(engine) as session:
            results = session.exec(select(Product))
            if results:
                return {"products": results.all()}
            else:
                return {"error": "Database not found"}

    print(read_products())
