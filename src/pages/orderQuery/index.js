import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import {
  Form,
  Button,
  DatePicker,
  Row,
  Col,
  Input,
  Select,
  Space,
  Typography,
  Table,
  Empty,
  Spin,
} from 'antd';
import style from './style.css';
import { expandedRowRender } from '../orderDiagnose/index.js';
import OrderChart from '@/utils/orderChart.js';
import moment from 'moment';
const { Title } = Typography;

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
  },
];

const orderQuery = (props) => {
  const equipmentSelect = (
    <Select>
      <Select.Option value="STS">STS</Select.Option>
      <Select.Option value="AGV">AGV</Select.Option>
      <Select.Option value="ASC">ASC</Select.Option>
    </Select>
  );
  const orderIDSelect = (
    <Select>
      <Select.Option value="wi_id">WI_ID</Select.Option>
      <Select.Option value="sts_id">STS_ID</Select.Option>
      <Select.Option value="agv_id">AGV_ID</Select.Option>
      <Select.Option value="asc_id">ASC_ID</Select.Option>
    </Select>
  );
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
  const [form] = Form.useForm();

  return (
    <div>
      <Title level={4} style={{ color: '#1890ff', paddingBottom: '10px' }}>
        任务异常诊断
      </Title>

      <Row>
        <Col span={5}>
          <Form
            layout="vertical"
            className={style.orderForm}
            form={form}
            onFinish={(values) => {
              console.log(values);
              props.dispatch({
                type: 'orderQuery/queryOrders',
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
                    } else if (start_time.diff(end_time, 'hours') < -24) {
                      return Promise.reject(
                        new Error('起止时间区间不能大于24小时'),
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

            <Form.Item label="任务ID" name="order_id">
              <Input
                addonBefore={
                  <Form.Item
                    name="order_id_type"
                    noStyle
                    initialValue={'wi_id'}
                  >
                    {orderIDSelect}
                  </Form.Item>
                }
              />
            </Form.Item>

            <Form.Item label="装卸设备" name="equipment_id">
              <Input
                addonBefore={
                  <Form.Item name="equipment_type" noStyle initialValue={'AGV'}>
                    {equipmentSelect}
                  </Form.Item>
                }
              />
            </Form.Item>
            <Form.Item>
              <Space size="middle" wrap={true}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={19}>
          <div className={style.orderWindow}>
            <Spin spinning={props.orderQuery.loading} tip="加载中...">
              {Object.keys(props.orderQuery.orderChart.equipments).length ==
              0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <OrderChart
                  equipments={props.orderQuery.orderChart.orders}
                  orders={props.orderQuery.orderChart.equipments}
                />
              )}
            </Spin>
          </div>
        </Col>
      </Row>
      <div className={style.orderTable}>
        <Table
          // dataSource={props.order_diagnose.orders}
          columns={orderTableColumns}
          rowKey={(record) => record.WI_ID}
          expandedRowRender={(record) => expandedRowRender(record)}
          size="small"
        />
      </div>
    </div>
  );
};

export default connect(({ orderQuery }) => ({ orderQuery }))(orderQuery);
