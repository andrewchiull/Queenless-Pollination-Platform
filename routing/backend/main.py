import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import engine, create_db_and_tables, read_local_products, read_local_purchases
from .models import Product, Purchase, Customer, PurchasePublic

@asynccontextmanager
async def lifespan(app: FastAPI):
    # See: [Lifespan Events - FastAPI](https://fastapi.tiangolo.com/advanced/events/#lifespan)
    # Startup events:
    create_db_and_tables()
    await add_initial_products()
    await add_initial_purchases()
    yield
    # Shutdown events:
    pass


app = FastAPI(lifespan=lifespan)

# Add initial products
async def add_initial_products():
    products: list[dict] = await read_local_products()
    for product in products:
        await create_product(Product(**product))

# Add initial purchases
async def add_initial_purchases():
    purchases: list[dict] = await read_local_purchases()
    for purchase in purchases:
        await create_purchase(PurchasePublic(**purchase))

@app.get("/")
async def read_root():
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/product/all", response_model=list[Product])
async def read_all_products():
    try:
        with Session(engine) as session:
            products = session.exec(select(Product)).all()
        res = [product.model_dump() for product in products]
        print(json.dumps(res, indent=2))
        return res
    except Exception as e:
        print(f"Error fetching products from database: {e}")
        try:
            print('Reading local products file instead...')
            local_products = await read_local_products()
            return local_products
        except Exception as local_error:
            print(f"Error reading local products file: {local_error}")
            raise HTTPException(status_code=500, detail="Error fetching products")

@app.post("/product", response_model=Product)
async def create_product(product: Product):
    with Session(engine) as session:
        is_existing = session.exec(select(Product).where(Product.name == product.name)).first() is not None
        if not is_existing:
            session.add(product)
            session.commit()
            session.refresh(product)
    return product

@app.get("/purchase/{purchase_id}", response_model=PurchasePublic)
async def read_purchase_with_detail(purchase_id: int):
    try:
        with Session(engine) as session:
            purchase = session.exec(select(Purchase).where(Purchase.id == purchase_id)).first()
            return PurchasePublic(purchase=purchase, customer=purchase.customer, item=purchase.item)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchase")

@app.get("/purchase/all", response_model=list[PurchasePublic])
async def read_all_purchases():
    try:
        with Session(engine) as session:
            purchases = session.exec(select(Purchase).limit(1000)).all()
        return purchases
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchases")

@app.post("/purchase", response_model=PurchasePublic)
async def create_purchase(req: PurchasePublic):
    try:
        print(f"Received purchase data: {req.model_dump_json()}")

        with Session(engine) as session:
            existing_customer = session.exec(select(Customer).where(Customer.email == req.customer.email)).first()

        if existing_customer:
            req.customer = existing_customer

        with Session(engine) as session:
            req.purchase.customer = req.customer
            req.purchase.item = req.item
            session.add(req.purchase)
            session.commit()
            session.refresh(req.purchase)
            session.refresh(req.customer)
            for item in req.item:
                session.refresh(item)

        return req

    except Exception as e:
        print(e)
        # Return error message to frontend as error code 500
        raise HTTPException(status_code=500, detail=f"Error submitting purchase: {e}")

# TODO: get address by purchase_id
# TODO: get multiple address by multiple purchase_id
# TODO: JOIN purchase and customer