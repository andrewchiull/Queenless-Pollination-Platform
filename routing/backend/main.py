from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Body, Depends, FastAPI, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .db import engine, create_db_and_tables, read_local_products, read_local_purchases, read_local_universities
from .models import (
    LatLon,
    Product,
    ProductCreate,
    ProductPublic,
    ProductUpdate,
    Item,
    Customer,
    Purchase,
    PurchaseCreate,
    PurchasePublic,
    PurchasePublicDetailed,
    PurchaseAddressPublic,
)

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

app = FastAPI(lifespan=lifespan,
              redirect_slashes=True
              )

# origins = [
#     "http://localhost:3000", # for local browser
#     "http://localhost:5001", # for handle_host to redirect from FE
#     "http://172.18.0.4:5001", # ip of the container running the FE on docker-compose
#     # "http://routing-backend:5001", # for docker-compose testing
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # [Solving Cross-Container Communication Issues Between Next.js and FastAPI in a Docker Environment | by Luke | Oct, 2024 | Medium](https://medium.com/@szz185/solving-cross-container-communication-issues-between-next-js-and-fastapi-in-a-docker-environment-7b218a270236)
# @app.middleware("http")
# async def handle_host(request: Request, call_next):
#     print(f"{request.headers.get('host') = }")
#     print(f"{request.scope['server'] = }")
#     if request.headers.get("host") == "routing-backend:5001":
#         request.scope["headers"] = [
#             (b"host", b"localhost:5001") if k == b"host" else (k, v)
#             for k, v in request.scope["headers"]
#         ]
#         request.scope["server"] = ("localhost", 5001)
#     print("after")
#     print(f"{request.headers.get('host') = }")
#     print(f"{request.scope['server'] = }")
#     response = await call_next(request)
#     return response

# # origins = [
# #     "http://localhost:3000",
# #     "http://shopping-frontend:3000",
# # ]

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,
# #     allow_credentials=True, 
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

@app.get("/")
async def read_root():
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

# Product CRUD methods

@app.post("/product", response_model=ProductPublic)
async def create_product(*, session: Session = Depends(get_session), product: ProductCreate):
    print(f"Received product data: {product}")
    is_existing = session.exec(
        select(Product)
        .where(Product.name == product.name)
    ).first() is not None

    if is_existing:
        error_msg = f"ERROR: product already exists: {product.name}"
        print(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

    db_product = Product.model_validate(product)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product

@app.get("/product", response_model=list[ProductPublic])
async def read_products(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, le=100)
    ):
    products = session.exec(select(Product).offset(offset).limit(limit).order_by(Product.id)).all()
    return products if products else []

@app.get("/product/{product_id}", response_model=ProductPublic)
async def read_product_by_id(*, session: Session = Depends(get_session), product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.patch("/product/{product_id}", response_model=ProductPublic)
async def update_product_by_id(*, session: Session = Depends(get_session), product_id: int, product: ProductUpdate):
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


@app.delete("/product/{product_id}")
def delete_product(*, session: Session = Depends(get_session), product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}

# Purchase methods

@app.post("/purchase", response_model=PurchasePublicDetailed)
async def create_purchase(req: PurchaseCreate, session: Session = Depends(get_session)):

    print(f"Received purchase data: {req}")

    # Check if customer exists by email
    # TODO: Maybe Customer should have a unique constraint on email
    #       and we could use get() instead of exec()
    # TODO: Maybe a customer with the same email but different name/address is valid?
    existing_customer = session.exec(
        select(Customer)
        .where(Customer.email == req.customer.email)
    ).first()

    # Add latlon to new customer
    # TODO: this is a temporary solution for testing
    if not existing_customer:
        new_customer = Customer.model_validate(req.customer)
        new_customer = await testing_add_latlon_to_customer(new_customer)

    db_purchase = Purchase(
        description=req.description,
        customer=existing_customer or new_customer,
        item=[Item.model_validate(i) for i in req.item]
    )

    session.add(db_purchase)
    session.commit()
    return db_purchase


@app.get("/purchase", response_model=list[PurchasePublicDetailed])
async def read_purchases(
        *,
        session: Session = Depends(get_session),
        offset: int = Query(default=0, description="Offset for pagination"),
        limit: int = Query(default=100, le=100, description="Limit for pagination")
    ):
    """ ## Get a list of purchases with pagination.
    """
    return session.exec(
        select(Purchase)
        .offset(offset)
        .limit(limit)
        .order_by(Purchase.id)
    ).all()

@app.get("/purchase/id", response_model=list[PurchasePublicDetailed | None])
async def read_purchase_by_id(q: Annotated[list[int] | None, Query(description="List of purchase IDs", gt=0)] = None, *, session: Session = Depends(get_session)):
    """ ## Get a list of purchases by their IDs.
    If a purchase is not found, it will be included in the response with `None`.
    """

    if q is None:
        raise HTTPException(status_code=400, detail=f"Purchase ID is required.")

    return [session.get(Purchase, id) for id in q]

@app.get("/purchase/id/address", response_model=list[PurchaseAddressPublic])
async def read_purchase_addresses_by_id(ids: Annotated[list[int] | None, Query(description="List of purchase IDs")] = None, *, session: Session = Depends(get_session)):
    """ ## Get a list of addresses of purchases by their IDs.
    If a purchase is not found, the corresponding address will be `None`.
    """
    result: list[PurchaseAddressPublic] = []
    for id in ids:
        purchase = session.get(Purchase, id)
        result.append(PurchaseAddressPublic(
            purchase_id=id,
            address=purchase.customer.address if purchase else None,
            latlon=None
        ))
    return result

# Testing methods
# Called by the frontend to populate the database with testing data

@app.get("/testing/add_testing_product")
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

@app.get("/testing/add_testing_purchase")
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

@app.post("/testing/address_to_latlon")
async def testing_add_latlon_to_customer(customer: Customer, *, session: Session = Depends(get_session)):
    universities: list[dict] = await read_local_universities()
    for university in universities:
        if customer.address == university["address"]:
            customer.lat = university["latlon"]["lat"]
            customer.lon = university["latlon"]["lon"]
            return customer
    # If no university is found, use the default latlon
    customer.lat = 23.456
    customer.lon = 123.456
    return customer

# get purchase id to latlon
@app.get("/testing/customer_from_purchase_id/")
async def testing_customer_from_purchase_id(q: Annotated[list[int] | None, Query(description="List of purchase IDs")] = None, *, session: Session = Depends(get_session)):
    purchases = await read_purchase_by_id(q, session=session)
    return [purchase.customer for purchase in purchases]
