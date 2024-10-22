from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import engine, create_db_and_tables, read_local_products, read_local_purchases
from .models import Item, Product, Purchase, Customer, PurchasePublic, PurchaseCreate

RESULT_LIMIT = 1000

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
        await create_product(Product.model_validate(product))

# Add initial purchases
async def add_initial_purchases():
    purchases: list[dict] = await read_local_purchases()
    for purchase in purchases:
        await create_purchase(PurchaseCreate.model_validate(purchase))

@app.get("/")
async def read_root():
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/product/all", response_model=list[Product])
async def read_all_products():
    try:
        with Session(engine) as session:
            products = session.exec(
                select(Product)
                .order_by(Product.id)
                .limit(RESULT_LIMIT)
            ).all()
        return products
    except Exception as e:
        print("ERROR: fetching products")
        print(e)
        try:
            print('Reading local products file instead...')
            local_products = await read_local_products()
            return local_products
        except Exception as local_error:
            error_msg = f"ERROR: reading local products file:\n{local_error}"
            print(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)

@app.post("/product", response_model=Product)
async def create_product(product: Product):
    try:
        with Session(engine) as session:
            is_existing = session.exec(
            select(Product)
            .where(Product.name == product.name)
        ).first() is not None
        if not is_existing:
            session.add(product)
            session.commit()
            session.refresh(product)
        return product
    except Exception as e:
        error_msg = f"ERROR: creating product:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/purchase/{purchase_id}", response_model=PurchasePublic)
async def read_purchase(purchase_id: int):
    try:
        with Session(engine) as session:
            purchase = session.exec(
                select(Purchase)
                .where(Purchase.id == purchase_id)
            ).first()
            return PurchasePublic(purchase=purchase, customer=purchase.customer, item=purchase.item)
    except ValueError as ve:
        error_msg = f"ERROR: Invalid purchase ID format:\n{ve}"
        print(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        error_msg = f"ERROR: fetching purchase:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/purchase/brief/all", response_model=list[Purchase])
async def read_all_purchases_brief():
    try:
        with Session(engine) as session:
            purchases = session.exec(
                select(Purchase)
                .order_by(Purchase.id)
                .limit(RESULT_LIMIT)
            ).all()
        return purchases
    except Exception as e:
        error_msg = f"ERROR: fetching purchases:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

# Trailing slash is necessary for this endpoint to parse the query parameter correctly
@app.get("/purchase/ids/", response_model=list[PurchasePublic])
async def read_purchases_by_ids(q: Annotated[list[int] | None, Query()] = None):
    try:
        with Session(engine) as session:
            purchases = session.exec(
                select(Purchase)
                .where(Purchase.id.in_(q))
                .order_by(Purchase.id)
                .limit(RESULT_LIMIT)
            ).all()
            return [PurchasePublic(id=p.id, description=p.description, customer=p.customer, item=p.item) for p in purchases]
    except ValueError as ve:
        error_msg = f"ERROR: Invalid purchase ID format:\n{ve}"
        print(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        error_msg = f"ERROR: fetching purchases by IDs:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/purchase", response_model=PurchasePublic)
async def create_purchase(req: PurchaseCreate):
    try:
        print(f"Received purchase data: {req}")

        with Session(engine) as session:
            existing_customer = session.exec(
                select(Customer)
                .where(Customer.email == req.customer.email)
            ).first()

            db_purchase = Purchase(
                description=req.description,
                customer=existing_customer or Customer.model_validate(req.customer),
                item=[Item.model_validate(i) for i in req.item]
            )

            session.add(db_purchase)

            session.commit()
            session.refresh(db_purchase)
            session.refresh(db_purchase.customer)
            for item in db_purchase.item:
                session.refresh(item)

        return db_purchase

    except Exception as e:
        error_msg = f"ERROR: submitting purchase:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    