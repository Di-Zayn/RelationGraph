import { Reducer, Effect, Subscription, history } from 'umi';
import { showOrders } from '../mainPage/service';
import { getOrders } from './service';

export default {
  namespace: 'orderDiagnose',
  state: {
    orders: [],
    modalVisible: false,
    orderChart: null,
  },
  reducers: {
    getTableUpdate(state, { payload }) {
      //console.log(payload)
      state.orders = payload.orders;
      return { ...state };
    },

    getOrderChartUpdate(state, { payload }) {
      if (payload) {
        state.orderChart = {
          equipments: payload.equipments,
          orders: payload.orders,
        };
      } else {
        state.orderChart = null;
      }
      console.log('getOrderChartUpdate', payload);
      return { ...state };
    },
    handleModalVisible(state, { payload }) {
      console.log('handleModalVisible', payload);
      state.modalVisible = payload;
      if (!payload) {
        state.orderChart = null;
      }
      return { ...state };
    },

    // handleWorktypeChange(state, { payload }) {
    //   state.worktype = payload;
    //   //console.log('handle worktype change', state.worktype);
    //   return { ...state };
    // },
  },
  effects: {
    *updateTable({ payload: query }, { call, put }) {
      //console.log('effects hooked!');
      query.start_time = query.start_time;
      const rt = yield call(getOrders, query);
      yield put({
        type: 'getTableUpdate',
        payload: rt,
      });
    },
    // *onWorktypeChange({ payload: worktype }, { call, put }) {
    //   //console.log('on worktype change', worktype);
    //   yield put({
    //     type: 'handleWorktypeChange',
    //     payload: worktype,
    //   });
    // },
    *updateModal({ payload: info }, { call, put }) {
      if (info) {
        if (info.end_time == null) {
          info.end_time = info.start_time;
        }
        if (info.start_time == null) {
          info.start_time = info.end_time;
        }
        if (info.start_time == null && info.end_time == null) {
          return;
        }
        yield put({
          type: 'handleModalVisible',
          payload: true,
        });
        info.order_id_type = 'wi_id';
        const rt = yield call(showOrders, info);
        yield put({
          type: 'getOrderChartUpdate',
          payload: rt,
        });
      }
    },
  },
  subscriptions: {},
};
