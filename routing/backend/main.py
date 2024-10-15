import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import engine, Order, OrderCreate, OrderPublic, Product

app = FastAPI()

@app.get("/")
async def read_root():
    # Redirect to /docs
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/products/", response_model=list[Product])
def read_products():
    with Session(engine) as session:
        products = session.exec(select(Product)).all()
        return products

@app.get("/orders/", response_model=list[OrderPublic])
def read_orders():
    with Session(engine) as session:
        orders = session.exec(select(Order)).all()
        return orders

@app.post("/orders/", response_model=OrderPublic)
def create_order(order: OrderCreate):
    with Session(engine) as session:
        db_order = Order.model_validate(order)
        session.add(db_order)
        session.commit()
        session.refresh(db_order)
        return db_order

# Get all addresses from the orders
@app.get("/orders/addresses/", response_model=list[str])
def read_addresses():
    with Session(engine) as session:
        addresses = session.exec(select(Order.address)).all()
        # Remove duplicates
        addresses = list(set(addresses))
        return addresses
