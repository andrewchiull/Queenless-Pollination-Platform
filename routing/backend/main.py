from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import engine, create_db_and_tables, read_local_products, read_local_purchases
from .models import Item, Product, ProductCreate, ProductPublic, ProductUpdate, Purchase, Customer, PurchasePublic, PurchaseCreate, PurchaseUpdate

RESULT_LIMIT = 1000

@asynccontextmanager
async def lifespan(app: FastAPI):
    # See: [Lifespan Events - FastAPI](https://fastapi.tiangolo.com/advanced/events/#lifespan)
    # Startup events:
    create_db_and_tables()
    yield
    # Shutdown events:
    pass

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def read_root():
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

# Product CRUD methods

@app.post("/product/", response_model=ProductPublic)
async def create_product(*, session: Session = Depends(get_session), product: ProductCreate):
    try:
        is_existing = session.exec(
            select(Product)
            .where(Product.name == product.name)
        ).first() is not None

        if is_existing:
            error_msg = f"ERROR: product already exists:\n{product.name}"
            print(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)

        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

    except Exception as e:
        error_msg = f"ERROR: create_product:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/product/", response_model=list[ProductPublic])
async def read_products(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, le=100)
    ):
    try:
        products = session.exec(select(Product).offset(offset).limit(limit)).all()
        return products
    except Exception as e:
        error_msg = f"ERROR: read_products:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/product/{product_id}/", response_model=ProductPublic)
async def read_product_by_id(*, session: Session = Depends(get_session), product_id: int):
    try:
        product = session.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception as e:
        error_msg = f"ERROR: read_product_by_id:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.patch("/product/{product_id}/", response_model=ProductPublic)
async def update_product_by_id(*, session: Session = Depends(get_session), product_id: int, product: ProductUpdate):
    try:
        db_product = session.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        product_data = product.model_dump(exclude_unset=True)
        for key, value in product_data.items():
            setattr(db_product, key, value)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product
    except Exception as e:
        error_msg = f"ERROR: update_product_by_id:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)


@app.delete("/product/{product_id}/")
def delete_product(*, session: Session = Depends(get_session), product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}

# Purchase CRUD methods

@app.post("/purchase/", response_model=PurchasePublic)
async def create_purchase(req: PurchaseCreate, session: Session = Depends(get_session)):
    try:
        print(f"Received purchase data: {req}")

        # Check if customer exists by email
        # TODO: Maybe Customer should have a unique constraint on email
        #       and we could use get() instead of exec()
        # TODO: Maybe a customer with the same email but different name/address is valid?
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
        return db_purchase

    except Exception as e:
        error_msg = f"ERROR: create_purchase:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/purchase/", response_model=list[PurchasePublic])
async def read_purchases(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, le=100)
    ):
    try:
        purchases = session.exec(select(Purchase).offset(offset).limit(limit)).all()
        return purchases
    except Exception as e:
        error_msg = f"ERROR: read_purchases:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/purchase/{purchase_id}/", response_model=PurchasePublic)
async def read_purchase_by_id(*, session: Session = Depends(get_session), purchase_id: int):
    try:
        purchase = session.get(Purchase, purchase_id)
        if not purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
        return purchase
    except Exception as e:
        error_msg = f"ERROR: read_purchase_by_id:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.patch("/purchase/{purchase_id}/", response_model=PurchasePublic)
async def update_purchase_by_id(*, session: Session = Depends(get_session), purchase_id: int, purchase: PurchaseUpdate):
    try:
        db_purchase = session.get(Purchase, purchase_id)
        if not db_purchase:
            raise HTTPException(status_code=404, detail="Purchase not found")
        purchase_data = purchase.model_dump(exclude_unset=True)
        for key, value in purchase_data.items():
            setattr(db_purchase, key, value)
        session.add(db_purchase)
        session.commit()
        session.refresh(db_purchase)
        return db_purchase
    except Exception as e:
        error_msg = f"ERROR: update_purchase_by_id:\n{e}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.delete("/purchase/{purchase_id}/")
def delete_purchase(*, session: Session = Depends(get_session), purchase_id: int):
    purchase = session.get(Purchase, purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    session.delete(purchase)
    session.commit()
    return {"ok": True}

# Testing methods

@app.get("/testing/add_testing_product/")
async def add_testing_products(*, session: Session = Depends(get_session)):
    result: list[Product] = []
    products: list[dict] = await read_local_products()
    for product in products:
        res = await create_product(
            product=ProductCreate.model_validate(product),
            session=session
        )
        session.refresh(res)
        result.append(res.model_copy(deep=True))
    return result

@app.get("/testing/add_testing_purchase/")
async def add_testing_purchases(*, session: Session = Depends(get_session)):
    result: list[PurchasePublic] = []
    purchases: list[dict] = await read_local_purchases()
    for purchase in purchases:
        res = await create_purchase(
            PurchaseCreate.model_validate(purchase),
            session=session
        )
        session.refresh(res)
        result.append(res.model_copy(deep=True))
    return result
