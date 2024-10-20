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


# For SQLModels, use `__tablename__` to specify the actual table name in the database
# Otherwise, SQLModel will use the class name
# See https://github.com/fastapi/sqlmodel/issues/159
class Product(SQLModel, table=True):
    __tablename__: str = "products"

    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)

class OrderBase(SQLModel):
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)
    product_id: int = Field(index=True, foreign_key="products.id")
    quantity: int = Field(index=True)

class Order(OrderBase, table=True):
    __tablename__: str = "orders"
    id: int | None = Field(default=None, primary_key=True)

class OrderCreate(OrderBase):
    pass

class OrderPublic(OrderBase):
    id: int

class OrderItem(BaseModel):
    product_id: int
    quantity: int

class OrderRequest(BaseModel):
    name: str
    email: str
    address: str
    order_items: list[OrderItem]


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
