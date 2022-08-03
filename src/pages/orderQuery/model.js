import { showOrders } from './service';
import moment from 'moment';

export default {
  namespace: 'orderQuery',
  state: {
    orderChart: {
      equipments: {},
      orders: {},
    },
    orderTable: [],
    loading: false,
  },
  reducers: {
    visionUpdate(state, { payload }) {
      console.log('visionUpdate', payload);
      state.orderChart.equipments = payload.equipments;
      state.orderChart.orders = payload.orders;
      state.loading = false;
      return { ...state };
    },
    handleLoadingUpdate(state, { payload }) {
      state.loading = payload;
      return { ...state };
    },
  },
  effects: {
    *queryOrders({ payload: formValue }, { call, put }) {
      console.log('queryOrders', JSON.stringify(formValue));
      yield put({ type: 'handleLoadingUpdate', payload: true });
      const rt = yield call(showOrders, formValue);
      yield put({
        type: 'visionUpdate',
        payload: rt,
      });
    },
  },
  subscriptions: {},
};
