import os
from pathlib import Path

import mysql.connector

# python-dotenv is optional at runtime; if it's not installed
# we continue without loading a .env file so the module can
# run under the system Python as well as the project's venv.
try:
    from dotenv import load_dotenv
    BASE_DIR = Path(__file__).resolve().parent
    load_dotenv(BASE_DIR / ".env")
except Exception:
    BASE_DIR = Path(__file__).resolve().parent


def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "smart_parking")
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None