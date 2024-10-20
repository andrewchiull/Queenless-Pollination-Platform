import os
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlmodel import Session, create_engine, Field, SQLModel, select

load_dotenv()
DB_HOST = os.getenv("DB_HOST") or "localhost"
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DB_URL, echo=True)

class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)

class Purchase(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)

class Purchase_Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id")

    product_id: int = Field(foreign_key="product.id")
    quantity: int

class PurchaseRequest(SQLModel):
    purchase: Purchase
    purchase_item: list[Purchase_Item]


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
