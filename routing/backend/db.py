import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import cursor

load_dotenv()
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Ref: https://juejin.cn/post/7223373957087936549

def get_db_connection():
    connection = mysql.connector.connect(
        host=DB_HOST,
        port=3306,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    return connection

def get_db():
    connection = get_db_connection()
    db = connection.cursor()

    try:
        yield db
    finally:
        db.close()
        connection.close()

def fetch_databases():
    db: cursor.MySQLCursor = get_db()
    query = "SHOW DATABASES"
    db.execute(query)
    result = db.fetchall()
    if result:
        return {"databases": result}
    else:
        return {"error": "Database not found"}


if __name__ == "__main__":
    print(fetch_databases())
