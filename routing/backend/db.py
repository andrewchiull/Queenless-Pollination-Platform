import os
from dotenv import load_dotenv

from sqlmodel import Session, create_engine
from sqlalchemy import text

load_dotenv()
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# mysql+pymysql://<username>:<password>@<host>/<dbname>[?<options>]
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session

def fetch_products():
    session = get_session()
    statement = text("SELECT * FROM `queenless-pollination-platform`.products;")
    results = session.exec(statement)
    if results:
        return {"products": results.all()}
    else:
        return {"error": "Database not found"}

if __name__ == "__main__":
    print("Testing: fetch_products()")
    print(fetch_products())
