from flask import Blueprint, request, session
from utils import *
from manager.order_manager import *

orders = Blueprint('get_orders', __name__)

apiPrefix = '/api/v2/'


@orders.route(apiPrefix + 'getOrders', methods=['POST'])
def get_orders():
    queries = json.loads(request.get_data())
    start_time = queries['start_time']
    end_time = queries['end_time']
    worktype = queries['work_type']
    status, result = get_selected_orders(start_time, end_time, worktype)
    if status:
        return json.dumps({"status": "success", "orders": result})
    else:
        return json.dumps({"status": 'fail', "msg": result})


