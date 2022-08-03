# coding=utf-8

from flask import Flask, render_template, request, redirect, session, url_for, g, jsonify
from db import rdb, mdb
from utils import *

from flask_cors import *
from router.user_router import user
from router.get_orders import orders
# from wsgiref.simple_server import make_server



app = Flask(__name__)
CORS(app, resources=r'/*')
app.config["SECRET_KEY"] = os.urandom(24)

app.register_blueprint(user)
app.register_blueprint(orders)


@app.before_request
def before_request():
    g.rcursor, g.rconn = rdb.connect_sqlite_db(conf.get('App', 'path') + conf.get('Sqlite', 'path'))
    # g.pcursor, g.pconn = rdb.connect_sqlite_db(conf.get('Production DB', 'path'))
    # g.rcursor, g.rconn = rdb.connect_sqlite_db(conf.get('Sqlite', 'path'))


@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'rconn'):
        g.rconn.close()
    if hasattr(g, 'gconn'):
        g.gconn.close()


apiPrefix = '/api/v2/'


@app.route('/')
def hello_world():
    return 'Hello World!'



if __name__ == '__main__':
    # app.run(host='0.0.0.0', debug=True, threaded=True, port=5088)
    app.run(host='127.0.0.1', port=5000, debug= True)
    # server = make_server('', 64570, app)
    # server.serve_forever()
