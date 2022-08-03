import pymysql


def connect_mysql_db():
    conn = pymysql.connect(host="10.60.103.248", port=23306, db="SIPG_ECS_DB")
    cursor = conn.cursor()
    return cursor, conn


def close_mysql_db(conn):
    conn.close()