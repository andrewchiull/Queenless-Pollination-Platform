import os
import json
from typing import List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import PurchaseCreate, PurchaseRequest, engine, Purchase, Product

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

@app.get("/product")
async def read_products():
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

@app.get("/purchase")
async def read_all_purchases():
    try:
        with Session(engine) as session:
            purchases = session.exec(select(Purchase)).all()
        return purchases
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchases")

@app.post("/purchase")
async def create_purchase(request: Request):
    try:
        # Log the incoming purchase data for debugging
        req = await request.json()
        print(f"Received purchase data: {req}")
        req = PurchaseRequest.model_validate(req)

        db_purchases: list[Purchase] = list()
        with Session(engine) as session:
            for item in req.purchase_items:
                db_purchase = Purchase.model_validate(dict(name=req.name, email=req.email, address=req.address, product_id=item.product_id, quantity=item.quantity))
                session.add(db_purchase)
                session.commit()
                session.refresh(db_purchase)
                
                db_purchases.append(db_purchase)
        return {"message": f"訂單已成功提交！姓名：{req.name}，電子郵件：{req.email}，地址：{req.address}，訂單內容：{', '.join([purchase.model_dump_json() for purchase in db_purchases])}"}
    except Exception as e:
        print(e)
        # Return error message to frontend as error code 500
        raise HTTPException(status_code=500, detail=f"Error submitting purchase: {e}")
