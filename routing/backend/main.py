import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from sqlmodel import select

from .db import Order, Product, SessionDep

app = FastAPI()

# API_URL of shopping-backend
API_URL = os.getenv("API_URL") or "http://localhost:5000/api/"

@app.get("/")
async def read_root():
    # Redirect to /docs
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/products/")
def read_products(session: SessionDep) -> list[Product]:
    products = session.exec(select(Product)).all()
    return products

@app.get("/orders/")
def read_orders(session: SessionDep) -> list[Order]:
    orders = session.exec(select(Order)).all()
    return orders

@app.post("/orders/")
def create_order(order: Order, session: SessionDep) -> Order:
    session.add(order)
    session.commit()
    session.refresh(order)
    return order