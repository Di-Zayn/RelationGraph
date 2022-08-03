import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Table,
  Row,
  Col,
  Modal,
  Spin,
  DatePicker,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import { isPropertySignature } from 'typescript';
import { Component } from 'react';
import style from './style.css';
import ErrorTree from '@/utils/errorTree';
import moment from 'moment';
import OrderTraceChart from "../../utils/orderTraceChart";

const { Title } = Typography;
const { Option } = Select;

const workTypeSelect = (
  <Select>
    <Option value={null}>所有类型</Option>
    <Option value="LOAD">装船</Option>
    <Option value="DSCH">卸船</Option>
    <Option value="SHIFT">转堆</Option>
    <Option value="PREP">归并</Option>
    <Option value="RESTOW">舱内翻</Option>
    <Option value="RECV">道口提箱</Option>
    <Option value="DLVR">道口进箱</Option>
  </Select>
);

const orderTraceSource = (props) => {
  // 嵌套子表
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: '作业ID',
        dataIndex: 'ORDER_ID',
        key: 'ORDER_ID',
        className: style.table,
      },
      {
        title: '执行阶段',
        dataIndex: 'move_stage',
        key: 'move_stage',
        className: style.table,
      },
      {
        title: '执行设备',
        dataIndex: 'equipment',
        key: 'equipment',
        className: style.table,
      },
      {
        title: '计划开始时间',
        dataIndex: 'ETA',
        key: 'ETA',
        className: style.table,
      },
      {
        title: '计划结束时间',
        dataIndex: 'ETD',
        key: 'ETD',
        className: style.table,
      },
      {
        title: '实际开始时间',
        dataIndex: 'RTA',
        key: 'RTA',
        className: style.table,
      },
      {
        title: '实际结束时间',
        dataIndex: 'RTD',
        key: 'RTD',
        className: style.table,
      },
      {
        title: '结束时间预测',
        dataIndex: 'RTD_pred',
        key: 'RTD_pred',
        className: style.table,
      },
      {
        title: '任务诊断情况',
        dataIndex: 'diagnose',
        key: 'diagnose',
        className: style.table,
      },
    ];

    return (
      <Table
        dataSource={record.item}
        columns={columns}
        size="small"
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'WI_ID',
      key: 'WI_ID',
      className: style.table,
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      className: style.table,
    },
    {
      title: '任务诊断情况',
      dataIndex: 'diagnose',
      key: 'diagnose',
      className: style.table,
      render: (text) =>
        text === '延迟' ? (
          <div className={style.diagnose}>{text}</div>
        ) : (
          <div>{text}</div>
        ),
    },
    {
      title: '查看溯源图',
      dataIndex: '',
      key: 'graph',
      className: style.table,
      render: (text, record, index) => (
        <Button
          size="small"
          onClick={(e) => {
            props.dispatch({
              type: 'orderTraceSource/updateModal',
              payload: { wi_id: record.WI_ID, work_type: record.type },
            });
          }}
        >
          查看
        </Button>
      ),
    },
    {
      title: '测试',
      dataIndex: '',
      key: 'test',
      className: style.table,
      render: (text, record, index) => (
        <Button
          size="small"
          onClick={(e) => {
            props.dispatch({ // 派发一个action, 通知state更新
              type: 'orderTraceSource/updateChart',
              payload: { wi_id: record.WI_ID, work_type: record.type },
            });
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    //<div style={{ width: '350px', position: 'relative', margin: 'auto' }}>
    <div>
      <Row>
        <Title level={4} style={{ color: '#1890ff', paddingBottom: '10px' }}>
          任务异常溯源
        </Title>
      </Row>

      <Row>
        <Form
          name="time_query"
          layout="inline"
          style={{
            padding: '40px',
            boxShadow: '0 0 20px 0px rgb(0 0 0 / 8%)',
            backgroundColor: 'white',
          }}
          // initialValues={this.getInitValues(oldUser)}

          onFinish={(values) => {
            props.dispatch({
              type: 'orderTraceSource/updateTable',
              payload: values,
            });
            //console.log('summit values', values)
            //console.log(props.worktype)
          }}
        >
          <Form.Item
            label="起始时间"
            name="start_time"
            initialValue={moment('2020-04-01 00:00:00')}
            rules={[
              {
                required: true,
                message: '起始时间不能为空',
              },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="结束时间"
            name="end_time"
            initialValue={moment('2020-04-01 00:10:00')}
            rules={[
              {
                required: true,
                message: '结束时间不能为空',
              },
              ({ getFieldValue }) => ({
                validator(_, end_time) {
                  let start_time = getFieldValue('start_time');
                  if (start_time.diff(end_time, 'seconds') > 0) {
                    return Promise.reject(
                      new Error('结束时间不得早于起始时间'),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="作业类型" name="work_type" initialValue={null}>
            {workTypeSelect}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Row>

      <Table
        dataSource={props.orderTraceSource.orders}
        columns={columns}
        rowKey={(record) => record.WI_ID}
        expandedRowRender={(record) => expandedRowRender(record)}
        size="small"
      />
      <Modal
        title="任务异常溯源图"
        footer={null}
        destroyOnClose
        // centered
        width={1000}
        visible={props.orderTraceSource.modalVisible}
        onCancel={() => {
          props.dispatch({
            type: 'orderTraceSource/handleModalVisible',
            payload: false,
          });
        }}
      >
        <div className={style.modal}>
          <Spin
            spinning={props.orderTraceSource.trace == null}
            style={{ height: '550px' }}
          >
            {props.orderTraceSource.trace == null ? (
              <></>
            ) : (
              <ErrorTree trace={props.orderTraceSource.trace} />
            )}
          </Spin>
        </div>
      </Modal>
      <Modal
        title="任务历史溯源图"
        footer={null}
        destroyOnClose
        // centered
        width={1000}
        visible={props.orderTraceSource.chartVisible}
        onCancel={() => {
          props.dispatch({
            type: 'orderTraceSource/handleChartVisible',
            payload: false,
          });
        }}
      >
        <div className={style.chart}>
          <Spin
            spinning={props.orderTraceSource.historyOrder == null || props.orderTraceSource.orderTrace == null}
            style={{ height: '550px' }}
          >
            {(props.orderTraceSource.historyOrder == null || props.orderTraceSource.orderTrace == null) ? (
              <></>
            ) : (
              <OrderTraceChart orderTrace={props.orderTraceSource.orderTrace}
                               historyOrder={props.orderTraceSource.historyOrder}
                               eqDict={props.orderTraceSource.eqDict}
                               baseTime={props.orderTraceSource.baseTime}
                               totalInterval={props.orderTraceSource.totalInterval}
                               updateEqDict={(payload) => {
                                 props.dispatch({
                                   type: 'orderTraceSource/getEqDictUpdate',
                                   payload: payload,
                                 })
                               }}
                               traceHistory={(payload) => {
                                 props.dispatch({
                                   type: 'orderTraceSource/traceHistoryOrder',
                                   payload: payload,
                                 })
                               }}/>
            )}
          </Spin>
        </div>
      </Modal>
    </div>
  );
};

/* export default connect((state) => {
  console.log('state', state)
  return state.order_diagnose;
})(orderDiagnose); */

// connect()(orderTraceSource): 将数据注入到orderTraceSource组件中, 数据即为orderTraceSource对应入参props
// props是一个obj, 具有很多属性 包括了整个组件树里的所有state
// 如果希望只保留部分state，new(new来自state), 修改connect
// connect(
//  (state) => { return {new : state.item}}
// )(orderTraceSource), 即可
// () => ({a}) 是 () => {return {a}} 的缩写. a是obj， 直接 () => {a} 会被当作函数体
export default connect(({ orderTraceSource }) => ({ orderTraceSource }))(
  orderTraceSource,
);
