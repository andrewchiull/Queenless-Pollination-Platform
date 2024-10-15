from enum import Enum
from typing import Union

from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from mysql.connector import cursor
from db import get_db

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None


@app.get("/")
async def read_root():
    # Redirect to /docs
    print("Hello! This is routing-backend. To use GUI, go to http://localhost:5001/docs")
    print("Redirecting to /docs")
    return RedirectResponse(url="/docs")

@app.get("/db")
async def read_db(db: cursor.MySQLCursor = Depends(get_db)):

    query = "SHOW DATABASES"
    db.execute(query)
    result = db.fetchall()
    if result:
        return {"databases": result}
    else:
        return {"error": "Database not found"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_price": item.price, "item_id": item_id}


@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}

# [Path Parameters - FastAPI](https://fastapi.tiangolo.com/tutorial/path-params/#predefined-values)

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    print(f"{model_name = }")
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residuals"}


# [Query Parameters - FastAPI](https://fastapi.tiangolo.com/tutorial/query-params/#multiple-path-and-query-parameters)

@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, item_id: str, q: str | None = None, short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

# [Query Parameters - FastAPI](https://fastapi.tiangolo.com/tutorial/query-params/#required-query-parameters)

@app.get("/items/{item_id}")
async def read_user_item(
    item_id: str, needy: str, skip: int = 0, limit: int | None = None
):
    item = {"item_id": item_id, "needy": needy, "skip": skip, "limit": limit}
    return item
