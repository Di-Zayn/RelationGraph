import React from 'react';
import { Layout } from 'antd';

import style from './style.css';

const { Header, Footer, Content } = Layout;

export default (props) => {
  return (
    <Layout>
      <Header className={style.login_header}>
        <span className={style.title}>
          <img
            className={style.logo_img}
            src={require('@/assets/logo_rg.png')}
          />
          关联图谱管理系统
        </span>
      </Header>

      <Content className={style.login_content}>{props.children}</Content>

      <Footer className={style.login_footer}>
        Relation Graph ©2020 Created by TongJi
      </Footer>
    </Layout>
  );
};
