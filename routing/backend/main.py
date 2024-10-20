import os
import json
from typing import List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select
import httpx

from .db import OrderCreate, OrderRequest, engine, Order, Product

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

@app.get("/order")
async def read_all_orders():
    try:
        with Session(engine) as session:
            orders = session.exec(select(Order)).all()
        return orders
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching orders")

@app.post("/order")
async def create_order(request: Request):
    try:
        # Log the incoming order data for debugging
        req = await request.json()
        print(f"Received order data: {req}")
        req = OrderRequest.model_validate(req)

        db_orders: list[Order] = list()
        with Session(engine) as session:
            for item in req.order_items:
                db_order = Order.model_validate(dict(name=req.name, email=req.email, address=req.address, product_id=item.product_id, quantity=item.quantity))
                session.add(db_order)
                session.commit()
                session.refresh(db_order)
                
                db_orders.append(db_order)
        return {"message": f"訂單已成功提交！姓名：{req.name}，電子郵件：{req.email}，地址：{req.address}，訂單內容：{', '.join([order.model_dump_json() for order in db_orders])}"}
    except Exception as e:
        print(e)
        # Return error message to frontend as error code 500
        raise HTTPException(status_code=500, detail=f"Error submitting order: {e}")
