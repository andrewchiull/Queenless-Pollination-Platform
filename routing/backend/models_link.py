from sqlmodel import SQLModel, Field

class PurchaseItemLink(SQLModel, table=True):
    __tablename__ = "purchase_item_link"
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id", primary_key=True)
    item_id: int | None = Field(default=None, foreign_key="item.id", primary_key=True)

class PurchaseCustomerLink(SQLModel, table=True):
    __tablename__ = "purchase_customer_link"
    purchase_id: int | None = Field(default=None, foreign_key="purchase.id", primary_key=True)
    customer_id: int | None = Field(default=None, foreign_key="customer.id", primary_key=True)
