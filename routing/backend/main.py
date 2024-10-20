import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from .db import engine, Purchase, Product, PurchaseRequest

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

@app.get("/purchase/all")
async def read_all_purchases():
    try:
        with Session(engine) as session:
            purchases = session.exec(select(Purchase).limit(1000)).all()
        return purchases
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching purchases")

@app.post("/purchase")
async def create_purchase(req: PurchaseRequest):
    try:
        # Log the incoming purchase data for debugging
        print(f"Received purchase data: {req.model_dump_json()}")

        with Session(engine) as session:
            session.add(req.customer)
            session.add(req.purchase)
            session.commit()
            session.refresh(req)

        return {"message": f"訂單已成功提交！姓名：{req.customer.name}，電子郵件：{req.customer.email}，地址：{req.customer.address}，訂單內容：{req.purchase.model_dump_json()}"}

    except Exception as e:
        print(e)
        # Return error message to frontend as error code 500
        raise HTTPException(status_code=500, detail=f"Error submitting purchase: {e}")

@app.get("/purchase/{purchase_id}")
async def read_purchase_with_detail(purchase_id: int):
    with Session(engine) as session:
        purchase = session.exec(select(Purchase).where(Purchase.id == purchase_id)).first()
        customer = purchase.customer
    return {"purchase": purchase, "customer": customer}