import os
from typing import Annotated
from dotenv import load_dotenv

from fastapi import Depends
from sqlmodel import Session, create_engine, Field, SQLModel, select

load_dotenv()
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


# For SQLModels, use `__tablename__` to specify the actual table name in the database
# Otherwise, SQLModel will use the class name
# See https://github.com/fastapi/sqlmodel/issues/159
class Product(SQLModel, table=True):
    __tablename__: str = "products"

    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)

class Order(SQLModel, table=True):
    __tablename__: str = "orders"

    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)
    product_id: int = Field(index=True)


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
