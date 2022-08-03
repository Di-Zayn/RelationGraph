
from asyncio.windows_events import NULL
from flask import g
import logging


def get_user_id(user_name, pwd):
    ## 新增autority
    sql = 'select user_id, authority from USER_TABLE where user_name = "{}" and pass_word = "{}"'.format(user_name, pwd)
    try:
        g.rcursor.execute(sql)
        result = g.rcursor.fetchall()
        if len(result) > 0:
            logging.info('{} login in'.format(user_name))
            return True, result[0]
        else:
            return True, (-1, 'none')
    except BaseException as e:
        return False, str(e)

def get_user_list(authority, id):
    sql = ''
    if (authority == 'SA'):
        sql = 'select user_id, user_name, pass_word, authority from USER_TABLE'
    elif (authority == 'admin'):
        sql = f"select user_id, user_name, pass_word, authority from USER_TABLE where user_id = {id} or authority = 'normal'"
    else:
        sql = f'select user_id, user_name, pass_word, authority from USER_TABLE where user_id = {id}'
    try:
        g.rcursor.execute(sql)
        result = g.rcursor.fetchall()
        return True, result
    except BaseException as e:
        return False, str(e)


def edit_user(id, name, pwd, auth):
    try:
        update_sql = f"update USER_TABLE set user_name = '{name}', pass_word = '{pwd}', authority = '{auth}' where user_id = {id}"
        g.rcursor.execute(update_sql)
        g.rconn.commit()
        return True, "successfully update"
    except BaseException as e:
        return False, str(e)


def add_user(name, pwd, authority):
    try:
        add_sql = f"insert into USER_TABLE (user_name, pass_word, authority) values ('{name}', '{pwd}', '{authority}')"
        g.rcursor.execute(add_sql)
        g.rconn.commit()
        return True, "successfully add"
    except BaseException as e:
        return False, str(e)


def remove_user(id):
    try:
        remove_sql = f"delete from USER_TABLE where user_id = {id}"
        g.rcursor.execute(remove_sql)
        g.rconn.commit()
        return True, "successfully remove"
    except BaseException as e:
        return False, str(e)