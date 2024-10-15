from typing import Annotated

from sqlalchemy import Column, Integer, String
from sqlmodel import Field, SQLModel

class Order(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)
    product_id: int = Field(index=True)

