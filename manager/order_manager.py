from flask import g
import logging
import datetime

def agv_sql(start_time, end_time, worktype):
    '''
    WI表字段      key       数据库映射
    任务ID        WI_ID    H_WI_ID
    任务类型      type      H_WI_MOVE_KIND
    计划开始时间   ETA       H_WI_ETA_ORIG_MOVE
    计划结束时间   ETD       H_WI_ETD_DEST_MOVE
    实际开始时间   RTA       H_WI_RTA_ORIG_MOVE
    实际结束时间   RTD       H_WI_RTD_DEST_MOVE
    任务诊断情况   diagnose
    '''
    '''
    AGV_ORDERS字段映射：
    作业ID  ORDER_ID       H_AGO_ID
    执行阶段  move_stage    'AGV'
    执行设备  equipment     H_AGO_AGV_ID
    计划开始时间  ETA        暂无
    计划结束时间  ETD        H_AGO_PTA 计划到达时间
    实际开始时间  RTA        H_AGO_CREATEDT 创建时间
    实际结束时间  RTD        H_AGO_RTA AGV到达目的位置时间
    结束时间预测  RTD_pred
    任务诊断情况  diagnose
    '''

    sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AGO_ID, \'AGV\' as AGV_MOVE_STAGE, H_AGO_AGV_ID, H_AGO_PTA, H_AGO_CREATEDT, H_AGO_RTA ' \
          'from WORK_INSTRUCTION as wi inner join AGV_ORDERS as agv on (wi.H_WI_ID == agv.H_AGO_WI_ID1 or wi.H_WI_ID == agv.H_AGO_WI_ID2) ' \
          'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
          'and wi.H_WI_MOVE_KIND == \'{2}\' ' \
          'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time, worktype)

    if worktype == 'SHF':
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AGO_ID, \'AGV\' as AGV_MOVE_STAGE, H_AGO_AGV_ID, H_AGO_PTA, H_AGO_CREATEDT, H_AGO_RTA ' \
          'from WORK_INSTRUCTION as wi inner join AGV_ORDERS as agv on (wi.H_WI_ID == agv.H_AGO_WI_ID1 or wi.H_WI_ID == agv.H_AGO_WI_ID2) ' \
          'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
          'and ( wi.H_WI_MOVE_KIND == \'SHFI\' or wi.H_WI_MOVE_KIND == \'SHFO\') ' \
          'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)
    
    if not worktype:
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AGO_ID, \'AGV\' as AGV_MOVE_STAGE, H_AGO_AGV_ID, H_AGO_PTA, H_AGO_CREATEDT, H_AGO_RTA ' \
          'from WORK_INSTRUCTION as wi inner join AGV_ORDERS as agv on (wi.H_WI_ID == agv.H_AGO_WI_ID1 or wi.H_WI_ID == agv.H_AGO_WI_ID2) ' \
          'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
          'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
          'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)
    return sql

def asc_sql(start_time, end_time, worktype):
    '''
    ASC_ORDERS字段映射：
    作业ID  ORDER_ID       H_AOR_ID
    执行阶段  move_stage    'ASC'
    执行设备  equipment     H_AOR_ASC_ID
    计划开始时间  ETA        暂无。不使用 H_AOR_PTA，原因：计划到达起始位置起升时间-晚于实际开始时间
    计划结束时间  ETD        H_AOR_PTC 计划完成时间
    实际开始时间  RTA        H_AOR_CREATEDDT 创建时间
    实际结束时间  RTD        H_AOR_UPDATEDDT 最后一次更新时间
    结束时间预测  RTD_pred
    任务诊断情况  diagnose
    '''
    sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AOR_ID, \'ASC\' as ASC_MOVE_STAGE, H_AOR_ASC_ID, H_AOR_PTC, H_AOR_CREATEDDT, H_AOR_UPDATEDDT '\
        'from WORK_INSTRUCTION as wi inner join ASC_ORDERS as asc on (wi.H_WI_ID == asc.H_AOR_WI_ID1 or wi.H_WI_ID == asc.H_AOR_WI_ID2) '\
        'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
        'and wi.H_WI_MOVE_KIND == \'{2}\' ' \
        'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time, worktype)

    if worktype == 'SHF':
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AOR_ID, \'ASC\' as ASC_MOVE_STAGE, H_AOR_ASC_ID, H_AOR_PTC, H_AOR_CREATEDDT, H_AOR_UPDATEDDT '\
            'from WORK_INSTRUCTION as wi inner join ASC_ORDERS as asc on (wi.H_WI_ID == asc.H_AOR_WI_ID1 or wi.H_WI_ID == asc.H_AOR_WI_ID2) '\
            'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
            'and ( wi.H_WI_MOVE_KIND == \'SHFI\' or wi.H_WI_MOVE_KIND == \'SHFO\') ' \
            'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)
    
    if not worktype:
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_AOR_ID, \'ASC\' as ASC_MOVE_STAGE, H_AOR_ASC_ID, H_AOR_PTC, H_AOR_CREATEDDT, H_AOR_UPDATEDDT '\
            'from WORK_INSTRUCTION as wi inner join ASC_ORDERS as asc on (wi.H_WI_ID == asc.H_AOR_WI_ID1 or wi.H_WI_ID == asc.H_AOR_WI_ID2) '\
            'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
            'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)

    return sql

def sts_sql(start_time, end_time, worktype):
    '''
    STS_ORDERS字段映射：
    作业ID  ORDER_ID       H_SOR_ID
    执行阶段  move_stage    'STS'
    执行设备  equipment     H_SOR_STS_ID + H_SOR_TROLLEYTYPE
    计划开始时间  ETA        H_SOR_ETA_MOVE 
    计划结束时间  ETD        H_SOR_ETD_MOVE 
    实际开始时间  RTA        H_SOR_RTA_MOVE 
    实际结束时间  RTD        H_SOR_RTD_MOVE
    结束时间预测  RTD_pred   
    任务诊断情况  diagnose
    '''

    'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_SOR_ID, \'STS\' as STS_MOVE_STAGE, H_SOR_STS_ID, H_SOR_TROLLEYTYPE, H_SOR_ETA_MOVE, H_SOR_ETD_MOVE, H_SOR_RTA_MOVE, H_SOR_RTD_MOVE, H_SOR_WI_ID_WSH, H_SOR_WI_ID_WSL, H_SOR_WI_ID_LSH, H_SOR_WI_ID_LSL '\
        'from WORK_INSTRUCTION as wi inner join STS_ORDERS as sts '\
        'where (wi.H_WI_ID == sts.H_SOR_WI_ID_WSH or wi.H_WI_ID == sts.H_SOR_WI_ID_WSL or wi.H_WI_ID == sts.H_SOR_WI_ID_LSH or wi.H_WI_ID == sts.H_SOR_WI_ID_LSL) '\
        'and (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
        'and wi.H_WI_MOVE_KIND == \'{2}\' ' \
        'and wi.H_WI_STATUS == \'COMPLETED\';'


    sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_SOR_ID, \'STS\' as STS_MOVE_STAGE, H_SOR_STS_ID, H_SOR_TROLLEYTYPE, H_SOR_ETA_MOVE, H_SOR_ETD_MOVE, H_SOR_RTA_MOVE, H_SOR_RTD_MOVE '\
        'from WORK_INSTRUCTION as wi inner join STS_ORDERS as sts on (wi.H_WI_ID == sts.H_SOR_WI_ID_WSH or wi.H_WI_ID == sts.H_SOR_WI_ID_WSL) '\
        'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
        'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
        'and wi.H_WI_MOVE_KIND == \'{2}\' ' \
        'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time, worktype)

    if worktype == 'SHF':
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_SOR_ID, \'STS\' as STS_MOVE_STAGE, H_SOR_STS_ID, H_SOR_TROLLEYTYPE, H_SOR_ETA_MOVE, H_SOR_ETD_MOVE, H_SOR_RTA_MOVE, H_SOR_RTD_MOVE '\
            'from WORK_INSTRUCTION as wi inner join STS_ORDERS as sts on (wi.H_WI_ID == sts.H_SOR_WI_ID_WSH or wi.H_WI_ID == sts.H_SOR_WI_ID_WSL) '\
            'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
            'and ( wi.H_WI_MOVE_KIND == \'SHFI\' or wi.H_WI_MOVE_KIND == \'SHFO\') ' \
            'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)
        
    
    if not worktype:
        sql = 'select H_WI_ID, H_WI_MOVE_KIND, H_WI_ETA_ORIG_MOVE, H_WI_ETD_DEST_MOVE, H_WI_RTA_ORIG_MOVE, H_WI_RTD_DEST_MOVE, H_SOR_ID, \'STS\' as STS_MOVE_STAGE, H_SOR_STS_ID, H_SOR_TROLLEYTYPE, H_SOR_ETA_MOVE, H_SOR_ETD_MOVE, H_SOR_RTA_MOVE, H_SOR_RTD_MOVE '\
            'from WORK_INSTRUCTION as wi inner join STS_ORDERS as sts on (wi.H_WI_ID == sts.H_SOR_WI_ID_WSH or wi.H_WI_ID == sts.H_SOR_WI_ID_WSL) '\
            'where (( wi.H_WI_ETA_ORIG_MOVE > \'{0}\' and wi.H_WI_ETA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_ETD_DEST_MOVE > \'{0}\' and wi.H_WI_ETD_DEST_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTA_ORIG_MOVE > \'{0}\' and wi.H_WI_RTA_ORIG_MOVE  < \'{1}\') ' \
            'or ( wi.H_WI_RTD_DEST_MOVE > \'{0}\' and wi.H_WI_RTD_DEST_MOVE  < \'{1}\')) ' \
            'and wi.H_WI_STATUS == \'COMPLETED\';'.format(start_time, end_time)

    return sql

# 获得agv平均运行时间，用于补计划开始时间
def get_avg_agv_worktime():
    # sqlite，当采用的数据库不同时进行修改
    sql = 'select avg(strftime(\'%s\', H_AGO_RTA) - strftime(\'%s\', H_AGO_CREATEDT)) from AGV_ORDERS;'
    g.pcursor.execute(sql)
    result = g.pcursor.fetchall()
    try:
        avgtime = int(result[0][0])
        return avgtime
    except:
        return 0

# 获得asc平均运行时间，用于补计划开始时间
def get_avg_asc_worktime():
    # sqlite，当采用的数据库不同时进行修改
    sql = 'select avg(strftime(\'%s\', H_AOR_UPDATEDDT) - strftime(\'%s\', H_AOR_CREATEDDT)) from ASC_ORDERS;'
    g.pcursor.execute(sql)
    result = g.pcursor.fetchall()
    try:
        avgtime = int(result[0][0])
        return avgtime
    except:
        return 0


def get_agv_orders(start_time, end_time, worktype, data):
    # return sql
    
    sql = agv_sql(start_time, end_time, worktype)
    avgtime = get_avg_agv_worktime()
    
    try:
        sttime = datetime.datetime.now()
        g.pcursor.execute(sql)
        result = g.pcursor.fetchall()
        edtime = datetime.datetime.now()
        logging.info(edtime - sttime)

        order_data = {}
        for i,n in enumerate(result):

            # order诊断
            etd = n[9]
            rta = n[10]
            rtd = n[11]
            if not (etd and rtd):
                order_diagnose = '未知'
                eta = None

            else: 
                etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                eta = etd - datetime.timedelta(seconds = avgtime)
                rta = datetime.datetime.strptime(rta, "%Y-%m-%d %H:%M:%S") 
                        
                if (eta < rta) and (etd < rtd):
                    order_diagnose = '开始延迟+结束延迟'
                elif etd < rtd:
                    order_diagnose = '结束延迟'
                elif etd < rtd:
                    order_diagnose = '开始延迟'
                else:
                    order_diagnose = '正常'
            
            order_data = {
                    "key": i,
                    "ORDER_ID": n[6],
                    "move_stage": n[7],
                    "equipment": n[8],
                    "ETA": str(eta),
                    "ETD": n[9],
                    "RTA": n[10],
                    "RTD": n[11],
                    "diagnose": order_diagnose
                }

            if n[0] in data.keys():
                data[n[0]]['item'].append(order_data)

            else:
                # wi诊断
                eta = n[2]
                etd = n[3]
                rta = n[4]
                rtd = n[5]
                if not (etd and rtd):
                    diagnose = '未知'
                elif not (eta and rta):
                    diagnose = '正常' if (etd > rtd) else '结束延迟'
                else: 
                    etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                    rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                    eta = datetime.datetime.strptime(eta, "%Y-%m-%d %H:%M:%S")
                    rta = datetime.datetime.strptime(rta, "%Y-%m-%d %H:%M:%S")
                            
                    if (eta < rta) and (etd < rtd):
                        diagnose = '开始延迟+结束延迟'
                    elif etd < rtd:
                        diagnose = '结束延迟'
                    elif etd < rtd:
                        diagnose = '开始延迟'
                    else:
                        diagnose = '正常'

                data[n[0]] = {
                    "key": i,
                    "WI_ID": n[0],
                    "type": n[1],
                    "ETA": n[2],
                    "ETD": n[3],
                    "RTA": n[4],
                    "RTD": n[5],
                    "diagnose": diagnose,
                    "item": [order_data]
                }

        if len(result) > 0:
            return 1, data
        else:
            return 0, data
    except BaseException as e:
        return -1, str(e)

def get_asc_orders(start_time, end_time, worktype, data):
    # return sql
    
    sql = asc_sql(start_time, end_time, worktype)
    avgtime = get_avg_asc_worktime()

    try:
        sttime = datetime.datetime.now()
        g.pcursor.execute(sql)
        result = g.pcursor.fetchall()
        edtime = datetime.datetime.now()
        logging.info(edtime - sttime)

        order_data = {}
        for i,n in enumerate(result):

            # order诊断
            etd = n[9]
            rta = n[10]
            rtd = n[11]
            if not (etd and rtd):
                order_diagnose = '未知'
                eta = None

            else: 
                etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                eta = etd - datetime.timedelta(seconds = avgtime)
                rta = datetime.datetime.strptime(rta, "%Y-%m-%d %H:%M:%S") 
                        
                if (eta < rta) and (etd < rtd):
                    order_diagnose = '开始延迟+结束延迟'
                elif etd < rtd:
                    order_diagnose = '结束延迟'
                elif etd < rtd:
                    order_diagnose = '开始延迟'
                else:
                    order_diagnose = '正常'
            
            order_data = {
                    "key": i,
                    "ORDER_ID": n[6],
                    "move_stage": n[7],
                    "equipment": n[8],
                    "ETA": str(eta),
                    "ETD": n[9],
                    "RTA": n[10],
                    "RTD": n[11],
                    "diagnose": order_diagnose
                }

            if n[0] in data.keys():
                data[n[0]]['item'].append(order_data)

            else:
                # wi诊断
                eta = n[2]
                etd = n[3]
                rta = n[4]
                rtd = n[5]
                if not (etd and rtd):
                    diagnose = '未知'
                elif not (eta and rta):
                    diagnose = '正常' if (etd > rtd) else '结束延迟'
                else: 
                    etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                    rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                    eta = datetime.datetime.strptime(eta, "%Y-%m-%d %H:%M:%S")
                    rta = datetime.datetime.strptime(rta, "%Y-%m-%d %H:%M:%S")
                            
                    if (eta < rta) and (etd < rtd):
                        diagnose = '开始延迟+结束延迟'
                    elif etd < rtd:
                        diagnose = '结束延迟'
                    elif etd < rtd:
                        diagnose = '开始延迟'
                    else:
                        diagnose = '正常'

                data[n[0]] = {
                    "key": i,
                    "WI_ID": n[0],
                    "type": n[1],
                    "ETA": n[2],
                    "ETD": n[3],
                    "RTA": n[4],
                    "RTD": n[5],
                    "diagnose": diagnose,
                    "item": [order_data]
                }

        if len(result) > 0:
            return 1, data
        else:
            return 0, data
    except BaseException as e:
        return -1, str(e)

def get_sts_orders(start_time, end_time, worktype, data):
    # return sql
    
    sql = sts_sql(start_time, end_time, worktype)
    
    try:
        sttime = datetime.datetime.now()
        g.pcursor.execute(sql)
        result = g.pcursor.fetchall()
        edtime = datetime.datetime.now()
        logging.info(edtime - sttime)

        order_data = {}
        for i,n in enumerate(result):

            # 诊断
            etd = n[9]
            rtd = n[11]
            if etd == None or rtd == None:
                order_diagnose = '未知'
            else: 
                etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                order_diagnose = '正常' if (etd > rtd) else '延迟'
            
            order_data = {
                    "key": i,
                    "ORDER_ID": n[6],
                    "move_stage": n[7],
                    "equipment": n[8]+n[9],
                    "ETA": n[10],
                    "ETD": n[11],
                    "RTA": n[12],
                    "RTD": n[13],
                    "diagnose": order_diagnose
                }

            if n[0] in data.keys():
                data[n[0]]['item'].append(order_data)

            else:
                # wi诊断
                eta = n[2]
                etd = n[3]
                rta = n[4]
                rtd = n[5]
                if not (etd and rtd):
                    diagnose = '未知'
                elif not (eta and rta):
                    diagnose = '正常' if (etd > rtd) else '结束延迟'
                else: 
                    etd = datetime.datetime.strptime(etd, "%Y-%m-%d %H:%M:%S")
                    rtd = datetime.datetime.strptime(rtd, "%Y-%m-%d %H:%M:%S")
                    eta = datetime.datetime.strptime(eta, "%Y-%m-%d %H:%M:%S")
                    rta = datetime.datetime.strptime(rta, "%Y-%m-%d %H:%M:%S")
                            
                    if (eta < rta) and (etd < rtd):
                        diagnose = '开始延迟+结束延迟'
                    elif etd < rtd:
                        diagnose = '结束延迟'
                    elif etd < rtd:
                        diagnose = '开始延迟'
                    else:
                        diagnose = '正常'

                data[n[0]] = {
                    "key": i,
                    "WI_ID": n[0],
                    "type": n[1],
                    "ETA": n[2],
                    "ETD": n[3],
                    "RTA": n[4],
                    "RTD": n[5],
                    "diagnose": diagnose,
                    "item": [order_data]
                }
        if len(result) > 0:
            return 1, data
        else:
            return 0, data
    except BaseException as e:
        return -1, str(e)

def get_selected_orders(start_time, end_time, worktype):
    sttime = datetime.datetime.now()
    data = {}
    _, data = get_agv_orders(start_time, end_time, worktype, data)
    _, data = get_asc_orders(start_time, end_time, worktype, data)
    _, data = get_sts_orders(start_time, end_time, worktype, data)
    if len(data) == 0:
        return 0, None
    edtime = datetime.datetime.now()
    logging.info(edtime - sttime)
    order_list = list(data.values())
    return 1, order_list