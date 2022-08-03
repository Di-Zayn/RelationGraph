import os
import configparser
import json, logging
import uuid
import datetime
import os, shutil

conf = configparser.ConfigParser()
conf.read(os.path.dirname(os.path.realpath(__file__)) + '/static/app.conf', encoding='utf-8')

logging.basicConfig(level=logging.INFO)


def exec_os_cmd(cmd, log_file):
    if os.system(cmd) != 0:
        with open(log_file, 'r') as file:
            raise ValueError(cmd + ':' + file.read())

def remove_dir(path):
    if os.path.exists(path):
        try:
            shutil.rmtree(path)
        except NotADirectoryError as e:
            os.remove(path)


class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        else:
            return json.JSONEncoder.default(self, obj)
