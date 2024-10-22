from sqlmodel import SQLModel, Field, Relationship

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

class CustomerBase(SQLModel):
    name: str = Field(index=True)
    email: str = Field(index=True)
    address: str = Field(index=True)

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase, table=True):
    __tablename__ = "customer"
    id: int | None = Field(default=None, primary_key=True)
    purchase: list["Purchase"] = Relationship(back_populates="customer", link_model=PurchaseCustomerLink)

class PurchaseItemLink(SQLModel, table=True):
    __tablename__ = "purchase_item_link"
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id", primary_key=True)
    item_id: int | None = Field(default=None, foreign_key="item.id", primary_key=True)

class ItemBase(SQLModel):
    quantity: int = Field(index=True)
    product_id: int = Field(index=True, foreign_key="product.id")

class ItemCreate(ItemBase):
    pass

class Item(ItemBase, table=True):
    __tablename__ = "item"
    id: int | None = Field(default=None, primary_key=True)
    quantity: int = Field(index=True)
    product_id: int = Field(index=True, foreign_key="product.id")

    product: Product = Relationship(back_populates="item")
    purchase: "Purchase" = Relationship(back_populates="item", link_model=PurchaseItemLink)

class PurchaseBase(SQLModel):
    description: str = Field(index=True)

class PurchaseCreate(PurchaseBase):
    customer: CustomerCreate
    item: list[ItemCreate]

class Purchase(PurchaseBase, table=True):
    __tablename__ = "purchase"
    id: int | None = Field(default=None, primary_key=True)

    customer: Customer = Relationship(back_populates="purchase", link_model=PurchaseCustomerLink)
    item: list["Item"] = Relationship(back_populates="purchase", link_model=PurchaseItemLink)

class PurchasePublic(SQLModel):
    id: int
    description: str
    customer: Customer
    item: list[Item]
