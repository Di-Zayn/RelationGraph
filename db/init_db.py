import sys
import os
sys.path.append(os.path.dirname(__name__))
from utils import *
from db import rdb


def init_user_table(cursor, conn):
    table_name = 'USER_TABLE'
    cursor.execute('DROP TABLE IF EXISTS {}'.format(table_name))
    sql = 'create table {} (' \
          'user_id integer primary key ,' \
          'user_name string, ' \
          'pass_word string, ' \
          'authority string );'.format(table_name)
    cursor.execute(sql)
    conn.commit()


def init_project_table(cursor, conn):
    table_name = 'PROJECT_TABLE'
    cursor.execute('DROP TABLE IF EXISTS {}'.format(table_name))
    sql = 'create table {} (' \
          'project_id integer primary key, ' \
          'project_name string NOT NULL, ' \
          'owner_id integer, ' \
          'comment string, ' \
          'last_update_time DATE ); '.format(table_name)
    cursor.execute(sql)
    conn.commit()



def insert_admin_user(cursor, conn):
    sql = 'insert into USER_TABLE (user_name, pass_word, authority)' \
          'values ("{}", "{}", "{}")'.format('admin', 'ant.design', )
    cursor.execute(sql)
    conn.commit()


if __name__ == '__main__':
    rcursor, rconn = rdb.connect_sqlite_db(conf.get('App', 'path') + conf.get('Sqlite', 'path'))

    init_user_table(rcursor, rconn)
    insert_admin_user(rcursor, rconn)
    init_project_table(rcursor, rconn)
