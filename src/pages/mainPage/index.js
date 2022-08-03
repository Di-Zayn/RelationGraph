import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Typography, Row, Col, DatePicker, Space, Checkbox, Spin } from 'antd';
import OrderChart from '@/utils/orderChart.js';

const { Title } = Typography;
class MainPage extends React.Component {
  setTimer = () =>
    setInterval(() => {
      this.props.dispatch({
        type: 'mainPage/showTimeAddOne',
        payload: this.props.showTimeValue,
      });
    }, 1000);

  interval = null;
  componentDidMount() {
    this.interval = this.setTimer();
    this.props.dispatch({
      type: 'mainPage/showTimeUpdate',
      payload: this.props.showTimeValue,
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { equipments, orders, isTimeFixed, showTimeValue, loading } =
      this.props;
    return (
      <div>
        <Title level={4} style={{ color: '#1890ff', paddingBottom: '10px' }}>
          码头状态查询（带预测）
        </Title>
        <Row>
          {/* <Col span={4}>
            
          </Col> */}
          <Col>
            <Space align="center" size="large">
              <DatePicker
                showTime
                value={showTimeValue}
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'mainPage/showTimeUpdate',
                    payload: e,
                  });
                }}
              />
              <Checkbox
                checked={isTimeFixed}
                onChange={(e) => {
                  if (e.target.checked) {
                    clearInterval(this.interval);
                  } else {
                    this.interval = this.setTimer();
                  }
                  this.props.dispatch({
                    type: 'mainPage/handleTimeFixChange',
                    payload: e.target.checked,
                  });
                }}
              >
                锁定
              </Checkbox>
            </Space>
          </Col>
        </Row>

        <div>
          <Spin spinning={loading} tip="更新中...">
            <OrderChart equipments={orders} orders={equipments} />
          </Spin>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    equipments: state.mainPage.equipments,
    orders: state.mainPage.orders,
    showTimeValue: state.mainPage.showTime,
    isTimeFixed: state.mainPage.isTimeFixed,
    loading: state.mainPage.loading,
    dispatch: state.mainPage.dispatch,
  };
})(MainPage);
