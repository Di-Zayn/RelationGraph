import React, { useState, useEffect } from 'react';
import {
  Form,
  DatePicker,
  Button,
  Typography,
  Select,
  Table,
  Row,
  Col,
  Modal,
  Spin,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import { isPropertySignature } from 'typescript';
import { Component } from 'react';
import OrderChart from '@/utils/orderChart.js';
import moment from 'moment';

import style from './style.css';

const { Option } = Select;
const { Title, Text } = Typography;

const subOrderTableColumns = [
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

export const expandedRowRender = (record) => {
  return (
    <Table
      dataSource={record.item}
      columns={subOrderTableColumns}
      size="small"
      pagination={false}
    />
  );
};

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

const orderDiagnose = (props) => {
  const orderTableColumns = [
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
      title: '任务时段',
      dataIndex: 'period',
      key: 'period',
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
      title: '查看诊断图',
      dataIndex: '',
      key: 'graph',
      className: style.table,
      render: (text, record, index) => (
        <Button
          size="small"
          onClick={(e) => {
            props.dispatch({
              type: 'orderDiagnose/updateModal',
              payload: {
                order_id: record.WI_ID,
                start_time: record.RTA,
                end_time: record.RTD,
              },
            });
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ color: '#1890ff', paddingBottom: '10px' }}>
        任务异常诊断
      </Title>

      <Row>
        <Form
          name="time_query"
          layout="inline"
          style={{
            padding: '40px',
            boxShadow: '0 0 20px 0px rgb(0 0 0 / 8%)',
            backgroundColor: 'white',
          }}
          onFinish={(values) => {
            console.log('props', props);
            props.dispatch({
              type: 'orderDiagnose/updateTable',
              payload: values,
            });
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
        dataSource={props.orderDiagnose.orders}
        columns={orderTableColumns}
        rowKey={(record) => record.WI_ID}
        expandedRowRender={(record) => expandedRowRender(record)}
        size="small"
      />
      <Modal
        title="任务视图"
        footer={null}
        destroyOnClose
        // centered
        width={1000}
        visible={props.orderDiagnose.modalVisible}
        onCancel={() => {
          props.dispatch({
            type: 'orderDiagnose/handleModalVisible',
            payload: false,
          });
        }}
      >
        <div className={style.modal}>
          <Spin
            spinning={props.orderDiagnose.orderChart == null}
            style={{ height: '550px' }}
          >
            {props.orderDiagnose.orderChart == null ? (
              <></>
            ) : (
              <OrderChart
                orders={props.orderDiagnose.orderChart.equipments}
                equipments={props.orderDiagnose.orderChart.orders}
              />
            )}
          </Spin>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ orderDiagnose }) => ({ orderDiagnose }))(
  orderDiagnose,
);
