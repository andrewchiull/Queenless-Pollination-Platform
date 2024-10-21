import os
import json
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import Customer, engine, Purchase, Product, PurchasePublic, PurchaseItemLink, PurchaseCustomerLink

app = FastAPI()

# Function to read local JSON file
async def read_local_products():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res

@app.get("/")
async def read_root():
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/product/all")
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

@app.get("/purchase/all", status_code=201)
async def read_all_purchases():
    try:
        with Session(engine) as session:
            purchases = session.exec(select(Purchase).limit(1000)).all()
        return purchases
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchases")

@app.post("/purchase", status_code=201)
async def create_purchase(req: PurchasePublic, res: Response):
    try:
        # Log the incoming purchase data for debugging
        print(f"Received purchase data: {req.model_dump_json()}")
        # Is this a new customer?
        with Session(engine) as session:
            existed_customer = session.exec(select(Customer).where(Customer.email == req.customer.email)).first()

        if not existed_customer: # New customer
            with Session(engine) as session:
                session.add(req.purchase)
                session.add(req.customer)
                session.add_all(req.item)
                session.commit()

                session.add(PurchaseCustomerLink(
                    purchase_id=req.purchase.id,
                    customer_id=req.customer.id
                ))
                for item in req.item:
                    session.add(PurchaseItemLink(
                        purchase_id=req.purchase.id,
                        item_id=item.id
                    ))
                session.commit()

                session.refresh(req.purchase)
                session.refresh(req.customer)
                for item in req.item:
                    session.refresh(item)

        else:
            with Session(engine) as session:
                session.add(req.purchase)
                session.add_all(req.item)
                req.customer.id = existed_customer.id
                session.commit()

                session.add(PurchaseCustomerLink(
                    purchase_id=req.purchase.id,
                    customer_id=existed_customer.id
                ))
                for item in req.item:
                    session.add(PurchaseItemLink(
                        purchase_id=req.purchase.id,
                        item_id=item.id
                    ))
                session.commit()

                session.refresh(req.purchase)
                for item in req.item:
                    session.refresh(item)
        return req

    except Exception as e:
        print(e)
        # Return error message to frontend as error code 500
        raise HTTPException(status_code=500, detail=f"Error submitting purchase: {e}")

@app.get("/purchase/{purchase_id}")
async def read_purchase_with_detail(purchase_id: int):
    try:
        with Session(engine) as session:
            purchase = session.exec(select(Purchase).where(Purchase.id == purchase_id)).first()
            print('purchase', purchase)
            print('customer', purchase.customer)
            print('item', purchase.item)
            return PurchasePublic(purchase=purchase, customer=purchase.customer, item=purchase.item)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchase")

# TODO: get address by purchase_id
# TODO: get multiple address by multiple purchase_id
# TODO: JOIN purchase and customer