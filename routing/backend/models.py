from sqlmodel import SQLModel, Field, Relationship
from .models_link import PurchaseItemLink, PurchaseCustomerLink

# See: [Models with Relationships in FastAPI - SQLModel](https://sqlmodel.tiangolo.com/tutorial/fastapi/relationships/#models-with-relationships)

# Product classes
class ProductBase(SQLModel):
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)

class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    item: list["Item"] = Relationship(back_populates="product")

class ProductCreate(ProductBase):
    pass

class ProductPublic(ProductBase):
    id: int

class ProductUpdate(SQLModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None

# Customer classes
class CustomerBase(SQLModel):
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)

class Customer(CustomerBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    purchase: list["Purchase"] = Relationship(back_populates="customer", link_model=PurchaseCustomerLink)

class CustomerCreate(CustomerBase):
    pass

class CustomerPublic(CustomerBase):
    id: int

class CustomerUpdate(SQLModel):
    name: str | None = None
    email: str | None = None
    address: str | None = None

# Item classes
class ItemBase(SQLModel):
    quantity: int = Field(index=True)
    product_id: int = Field(index=True, foreign_key="product.id")

class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    product: Product = Relationship(back_populates="item")
    purchase: "Purchase" = Relationship(back_populates="item", link_model=PurchaseItemLink)

class ItemCreate(ItemBase):
    pass

class ItemPublic(ItemBase):
    id: int

class ItemPublicDetailed(ItemPublic):
    product: ProductPublic | None = None

class ItemUpdate(SQLModel):
    quantity: int | None = None
    product_id: int | None = None

# Purchase classes

class PurchaseBase(SQLModel):
    description: str = Field(index=True)

class Purchase(PurchaseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    customer: Customer = Relationship(back_populates="purchase", link_model=PurchaseCustomerLink)
    item: list["Item"] = Relationship(back_populates="purchase", link_model=PurchaseItemLink)

class PurchaseCreate(PurchaseBase):
    customer: CustomerCreate
    item: list[ItemCreate]

class PurchasePublic(PurchaseBase):
    id: int

class PurchasePublicDetailed(PurchasePublic):
    customer: CustomerPublic | None = None
    item: list[ItemPublicDetailed] | None = None

class PurchaseUpdate(SQLModel):
    description: str | None = None
    customer: CustomerCreate | None = None
    item: list[ItemCreate] | None = []

class PurchaseAddressPublic(SQLModel):
    purchase_id: int
    address: str
