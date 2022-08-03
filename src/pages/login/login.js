import React from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  message,
  Typography,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';

const { Title } = Typography;

class LoginForm extends React.Component {
  render() {
    return (
      <div style={{ width: '350px', position: 'relative', margin: 'auto' }}>
        <Form
          name="normal_login"
          style={{
            padding: '40px',
            boxShadow: '0 0 20px 0px rgb(0 0 0 / 8%)',
            backgroundColor: 'white',
          }}
          // initialValues={this.getInitValues(oldUser)}
          onFinish={(values) =>
            this.props.dispatch({
              type: 'login_register/signIn',
              payload: values,
            })
          }
        >
          <Title level={4} style={{ color: '#1890ff', paddingBottom: '10px' }}>
            欢迎登陆
          </Title>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
            Or
            <Link to="/register"> register now!</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect((state) => {
  state.login_register;
})(LoginForm);
