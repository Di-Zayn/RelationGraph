
import sqlite3
from utils import conf


def connect_sqlite_db(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    return cursor, conn


def query_select_sql(select_sql, cursor):
    cursor.execute(select_sql)
    return cursor.fetchall()


