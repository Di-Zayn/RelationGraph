import {signIn} from "../login/service";
import {getUserTable, removeUser, updateUser} from "@/pages/userManager/service";
import React from "react";
import {getHistoryOrder} from "@/pages/orderTraceSource/service";
import {message} from "antd";

export default {
  namespace: 'userManager',
  state: {
    dataSource: [],
    modalVisible: false,
    editUserId: null,
  },
  reducers: {
    // 获取用户表格后更新前端
    updateUserTable(state, { payload }) {
      state.dataSource = payload.users
      return { ...state }
    },

    // 显示或隐藏modal
    handleModalVisible(state, { payload }) {
      state.modalVisible = payload
      return { ...state }
    },

    // 保存当前所编辑对象的id， 若id = null 则代表新建
    // 使用同一个modal作为接收者
    saveUserId(state, { payload }) {
      state.editUserId = payload
      return { ...state }
    }
  },
  effects: {
    // payload.a
    // {a} = payload
    // {payload: a}
    *getUserTable(payload, { call, put }) {
      const { id, authority } = JSON.parse(localStorage.getItem('user'));
      const info = {
        'id': id,
        'authority': authority
      }
      // payload: authority和id
      // 根据authority不同来返回不同的结果
      // SA 可以得到所有 admin只能得到自己的和其他普通用户的 normal只能得到自己的
      const rt = yield call(getUserTable, info);
      yield put({
        type: 'updateUserTable',
        payload: rt
      })
    },

    *removeUser({payload: payload}, { call, put }) {
      const { authority } = JSON.parse(localStorage.getItem('user'));
      // 考虑到后端只会返回个人信息以及下级用户信息，故只要不删除同级用户即可
      if (payload.authority === authority) {
        message.error("您不能删除自己").then(r => {})
        return
      }
      const rt = confirm("确定删除?")
      if (rt) {
        yield call(removeUser, payload.id, () => {
          message.info("删除成功").then(r => {});
        })
        yield put({
          type: 'getUserTable',
        })
      } else return
    },

    // 统一使用该函数新建用户和编辑用户信息
    *updateUser({payload: payload}, { select, call, put }) {
      const id = yield select( state => state.userManager.editUserId )
      let info = {...payload, id: id}
      // 如果不是SA， 返回的表单中不包括权限, 要自行获取
      if (!info.hasOwnProperty('authority')) {
        yield select( state => {
          for (let i of state.userManager.dataSource) {
            if (i.id === id) {
              info.authority = i.authority
              return 1
            }
          }
        })
      }
      yield call(updateUser, info, () => {
        message.info("更新成功").then(r => {});
      })
      yield put({
        type: 'getUserTable',
      })
    },

  },
  subscriptions: {},
};
