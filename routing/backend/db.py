import json
import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine
from sqlalchemy.pool import NullPool

load_dotenv()
DB_HOST = os.getenv("DB_HOST") or "localhost"
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
CHARSET = "utf8mb4"

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}?charset={CHARSET}"
engine = create_engine(DB_URL, echo=True, poolclass=NullPool)

def create_db_and_tables():
    print(DB_URL)
    SQLModel.metadata.create_all(engine)


async def read_local_products():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res

async def read_local_purchases():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'purchases.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res
