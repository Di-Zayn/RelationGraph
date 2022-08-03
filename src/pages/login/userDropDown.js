import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { connect } from 'umi';
import style from './style.css';

const { Item } = Menu;

class UserDropDown extends React.Component {
  render() {
    let userName = 'null';
    if (localStorage.getItem('user')) {
      userName = JSON.parse(localStorage.getItem('user')).username;
    }
    return (
      <Dropdown
        overlay={
          <Menu>
            <Item
              onClick={() =>
                this.props.dispatch({ type: 'login_register/signOut' })
              }
            >
              退出登陆
            </Item>
          </Menu>
        }
        placement="bottomRight"
        className={style.user}
      >
        <Button>您好, {userName}</Button>
      </Dropdown>
    );
  }
}

export default connect((state) => {
  state.login_register;
})(UserDropDown);
