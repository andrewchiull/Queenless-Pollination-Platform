from sqlmodel import SQLModel, Field, Relationship
from .models_link import PurchaseItemLink, PurchaseCustomerLink

# Product classes
class ProductBase(SQLModel):
    name: str = Field(index=True)
    price: float = Field(index=True)
    description: str = Field(index=True)

class ProductCreate(ProductBase):
    pass

class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    item: list["Item"] = Relationship(back_populates="product")

# Customer classes
class CustomerBase(SQLModel):
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    purchase: list["Purchase"] = Relationship(back_populates="customer", link_model=PurchaseCustomerLink)


# Item classes
class ItemBase(SQLModel):
    quantity: int = Field(index=True)
    product_id: int = Field(index=True, foreign_key="product.id")

class ItemCreate(ItemBase):
    pass

class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    product: Product = Relationship(back_populates="item")
    purchase: "Purchase" = Relationship(back_populates="item", link_model=PurchaseItemLink)


# Purchase classes

class PurchaseBase(SQLModel):
    description: str = Field(index=True)

class PurchaseCreate(PurchaseBase):
    customer: CustomerCreate
    item: list[ItemCreate]

class Purchase(PurchaseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    customer: Customer = Relationship(back_populates="purchase", link_model=PurchaseCustomerLink)
    item: list["Item"] = Relationship(back_populates="purchase", link_model=PurchaseItemLink)

class PurchasePublic(SQLModel):
    id: int
    description: str
    customer: Customer
    item: list[Item]

# TODO: Add a purchase summary that includes the total price of the purchase