import json
import os
import time
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.exc import OperationalError

load_dotenv()
DB_HOST = os.getenv("DB_HOST") or "localhost"
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
CHARSET = "utf8mb4"

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}?charset={CHARSET}"
engine = create_engine(DB_URL, echo=True, poolclass=NullPool)

NUM_RETRIES=5
RETRY_INTERVAL=5

# Retry
def retry_on_operational_error(func):
    def wrapper(*args, **kwargs):
        for _retry in range(NUM_RETRIES):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                print(e)
                print(f"{func.__name__} failed. {NUM_RETRIES - _retry} retries left...waiting {RETRY_INTERVAL} seconds...")
                time.sleep(RETRY_INTERVAL)
        raise Exception(f"{func.__name__} failed after {NUM_RETRIES} retries!")
    return wrapper

@retry_on_operational_error
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

async def read_local_universities():
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'universities.json')
    with open(file_path, 'r') as f:
        res = json.load(f)
        return res
