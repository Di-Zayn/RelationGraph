
from flask import Blueprint, request, session
from utils import *
from manager import user_manager

user = Blueprint('user_router', __name__)

apiPrefix = '/api/v2/'


@user.route(apiPrefix + 'checkUser', methods=['POST'])
def check_user():
    # user_info = request.json
    user_info = json.loads(request.get_data())
    status, rt = user_manager.get_user_id(user_info['username'], user_info['password'])

    if status:

        result = {
            "status": "success",
            "id": rt[0],
            "authority": rt[1],
            "username": user_info['username'],
            "password": user_info['password']
        }
        # if user_id >= 0:
        #     session['user_id'] = user_id
        return json.dumps(result)
    else:
        result = {"status": "fail", "msg":'用户名密码错误'}

@user.route(apiPrefix + 'getUser', methods=['POST'])
def get_user():
    user_info = json.loads(request.get_data())
    status, user_list = user_manager.get_user_list(user_info['authority'], user_info['id'])
    if status:
        new_list = []
        for user in user_list:
            new_list.append({
                'id': user[0],
                'username': user[1],
                'password': user[2],
                'authority': user[3]
            })
        result = {
            "status": "success",
            "users": new_list
        }
        return json.dumps(result)
    else:
        result = {"status": "fail", "msg": "error"}
        return json.dumps(result)


@user.route(apiPrefix + 'updateUser', methods=['POST'])
def update_user():
    user_info = json.loads(request.get_data())
    print(user_info)
    # 用户之前不存在
    if (user_info['id'] == None):
        status, msg = user_manager.add_user(user_info['username'], user_info['password'], user_info['authority'])
    # 已存在
    else:
        status, msg = user_manager.edit_user(user_info['id'], user_info['username'],
    user_info['password'], user_info['authority'])

    if status:
        result = {
            "status": "success",
            "msg": msg
        }
        return json.dumps(result)

    else:
        result = {
            "status": "fail",
            "msg": msg
        }
        return json.dumps(result)

@user.route(apiPrefix + 'removeUser', methods=['POST'])
def remove_user():
    user_id = json.loads(request.get_data())
    print(user_id)
    status, msg = user_manager.remove_user(user_id)
    if status:
        result = {
            "status": "success",
            "msg": msg
        }
        return json.dumps(result)
    else:
        result = {
            "status": "fail",
            "msg": msg
        }
        return json.dumps(result)
