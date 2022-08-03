import { connect } from 'umi';
import React from "react";
import {Button, Dropdown, Form, Input, Menu, message, Modal, Select, Table} from "antd";
import { PlusOutlined, DownSquareOutlined } from '@ant-design/icons';
const { Option } = Select;

class UserManager extends React.Component {

  addable = 'SA' === JSON.parse(localStorage.getItem('user')).authority // 能否新建用户-只有SA可见
  changeable = 'SA' === JSON.parse(localStorage.getItem('user')).authority // 能否修改权限-只有SA可见

  editFormRef = React.createRef(); //form对象

  componentDidMount() {
    this.props.dispatch({
      type: 'userManager/getUserTable',
    })
  };

  updateForm(id) {
    // 传入当前编辑对象的id（若id = null 则代表新建）， 预先将其信息填在表格中
    if (id) {
      let user = null;
      // 获得当前对象的信息，预先填写在表单中
      this.props.userManager.dataSource.map(item => {
        if (item.id === id) {
          user = item;
        }
      });
      if (this.editFormRef.current){
        this.editFormRef.current.setFieldsValue(user);
      }
      else{
        setTimeout(
          ()=>{if (this.editFormRef.current){
            this.editFormRef.current.setFieldsValue(user);
          }
          }, 500)
      }
    }
    else{
      if (this.editFormRef.current)
        this.editFormRef.current.resetFields();
    }
  }

  render() {

    const userColumns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 60,
        // filters: this.props.userManager.dataSource.map(({id}) => ({
        //   text: id,
        //   value: id
        // })),
        // filterMode: 'tree',
        // filterSearch: true,
        // onFilter: (input, record) => {
        //   return record.id === input
        // }
      },
      {
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
        ellipsis: true,
        width: 200
      },
      {
        title: '权限',
        key: 'authority',
        dataIndex: 'authority',
        width: 200,
        render: (text) => {
          const values = {'SA': '超级管理员', 'admin': '管理员', 'normal': '普通用户'};
          return values[text];
        },
        filters: [
          {text: '超级管理员', value: 'SA'},
          {text: '管理员', value: 'admin'},
          {text: '普通用户', value: 'normal'},
        ],
        onFilter: (value, record) => {
          return record.authority === value
        }
      },
      {
        title: '修改用户信息',
        key: 'edit',
        width: 80,
        align: 'center',
        render: (text, record) => {
          // 自定义数据项
          // 可传入 text record index
          // 格子中原始数据（data） 这一行的item 行中索引
          return (
            <Button
              size="small"
              onClick={(e) => {
                this.props.dispatch({
                  type: 'userManager/handleModalVisible',
                  payload: true,
                });
                this.updateForm(record.id)
                this.props.dispatch({
                  type: 'userManager/saveUserId',
                  payload: record.id,
                });
              }}
            >
              编辑
            </Button>)
        },
      },
      {
        title: '注销用户',
        key: 'remove',
        width: 80,
        align: 'center',
        render: (text, record) => {
          return (
            <Button
              size="small"
              onClick={(e) => {
                this.props.dispatch({
                  type: 'userManager/removeUser',
                  payload: record,
                });
              }}
            >
              删除
            </Button>)
        },
      },
    ];

    return (
      <div>
        <Modal title="请输入用户信息"
               visible={this.props.userManager.modalVisible}
               onCancel={() => {
                 this.props.dispatch({
                   type: 'userManager/handleModalVisible',
                   payload: false
                 })
               }}
               onOk={() => {
                 this.props.dispatch({
                   type: 'userManager/handleModalVisible',
                   payload: false
                 })
                 // 获取表单信息
                 setTimeout(async () => {
                   try {
                     const values = await this.editFormRef.current.validateFields();
                     this.props.dispatch({
                       type: 'userManager/updateUser',
                       payload: values
                     })
                   } catch (errorInfo) {
                   }
                 });
               }}
               okText="ok"
               cancelText="cancel"
               width={700}
        >
          <Form ref={this.editFormRef} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input placeholder="username" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input placeholder="password" autoComplete="off"/>
            </Form.Item>
            {this.changeable? <Form.Item
              label="权限"
              name="authority"
              rules={[
                {
                  required: true,
                  message: '请选择用户权限',
                },
              ]}
            >
              <Select placeholder="authority">
                <Option value={'normal'}>普通用户</Option>
                <Option value={'admin'}>管理员</Option>
              </Select>
            </Form.Item>:null}
          </Form>
        </Modal>


        {this.addable? <Button
          onClick={()=> {
            this.props.dispatch({
              type: 'userManager/handleModalVisible',
              payload: true
            });
            this.updateForm(null)
            this.props.dispatch({
              type: 'userManager/saveUserId',
              payload: null, // 表示尚未编辑/新建用户
            });
          }} style={{ margin: '10px 0px' }} icon={<PlusOutlined />}>新建用户</Button>:null}

        <Table
          dataSource={this.props.userManager.dataSource}
          columns={userColumns}
          pagination={{
            position: 'bottomRight',
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} Users`}}
          scroll={{ x: 'calc(100%)', y: 'auto' }}
        />

      </div>
    );
  }
}

export default connect((state) => {
  return {
    userManager: state.userManager
  }
})(UserManager);

