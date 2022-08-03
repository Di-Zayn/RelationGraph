import React, { useRef, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import Loader from './loader';
import style from './style.css';
import { menu } from '@/config/menu';
import UserDropDown from '@/pages/login/userDropDown';
import { Link } from 'umi';
import useAuth from '@/wrappers/authMenu';

const { Header, Footer, Content, Sider } = Layout;

const { SubMenu, Item } = Menu;

function showMenu(menu) {
  return menu.map((item) =>
    useAuth(item, () =>
      item.subMenu.length == 0 || typeof item.subMenu === 'undefined' ? (
        <Item key={item.key}>
          <Link to={item.path}>{item.title}</Link>
        </Item>
      ) : (
        <SubMenu key={item.key} title={item.title}>
          {showMenu(item.subMenu)}
        </SubMenu>
      ),
    ),
  );
}

export default (props) => {
  const workSpaceRef = useRef();
  // props.children.workSpace = workSpaceRef.current;
  return (
    <>
      {console.log(props.children)}
      <Loader />
      <Layout>
        <Header className={style.work_space_header}>
          <span className={style.title}>
            <img
              className={style.logo_img}
              src={require('@/assets/logo_rg.png')}
            />
            关联图谱管理系统
          </span>
          <div>
            <UserDropDown />
          </div>
        </Header>
        <Layout>
          <Sider className={style.work_space_sider}>
            <Menu theme="light" defaultSelectedKeys="mainPage">
              {showMenu(menu)}
            </Menu>
          </Sider>
          <Content>
            <div
              className={style.work_space_content}
              ref={workSpaceRef}
              id="workSpace"
            >
              {props.children}
            </div>
          </Content>
        </Layout>
        <Footer className={style.work_space_footer}>
          Relation Graph ©2020 Created by TongJi
        </Footer>
      </Layout>
    </>
  );
};
