import { Reducer, Effect, Subscription, history } from 'umi';
import { showOrders } from './service';
import moment from 'moment';

export default {
  namespace: 'mainPage',
  state: {
    equipments: {},
    orders: {},
    showTime: moment('2020-04-01 11:39:55'),
    isTimeFixed: false,
    loading: true,
  },
  reducers: {
    visionUpdate(state, { payload }) {
      console.log('visionUpdate', payload);
      if (payload) {
        state.equipments = payload.equipments;
        state.orders = payload.orders;
        state.loading = false;
      }
      return { ...state };
    },
    handleTimeFixChange(state, { payload }) {
      state.isTimeFixed = payload;
      return { ...state };
    },
    handleShowTimeChange(state, { payload }) {
      console.log('handleshowTimeChange', payload);
      if (payload) state.showTime = payload;
      return { ...state };
    },
    handleLoadingChange(state, { payload }) {
      console.log('handleLoadingChange', payload);
      state.loading = payload;
      return { ...state };
    },
  },
  effects: {
    *showTimeUpdate({ payload: time }, { call, put }) {
      console.log('showTimeUpdate', time);
      yield put({
        type: 'handleShowTimeChange',
        payload: time,
      });
      yield put({
        type: 'handleLoadingChange',
        payload: true,
      });
      let timeString = time.format('YYYY-MM-DD HH:mm:ss');
      const rt = yield call(showOrders, {
        start_time: timeString,
        end_time: timeString,
      });
      yield put({
        type: 'visionUpdate',
        payload: rt,
      });
    },
    *showTimeAddOne({ payload: time }, { call, put }) {
      yield put({
        type: 'handleShowTimeChange',
        payload: moment(time.add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss')),
      });
      if (time.second() == 0) {
        yield put({
          type: 'handleLoadingChange',
          payload: true,
        });
        let timeString = time.format('YYYY-MM-DD HH:mm:ss');
        const rt = yield call(showOrders, {
          start_time: timeString,
          end_time: timeString,
        });
        yield put({
          type: 'visionUpdate',
          payload: rt,
        });
      }
    },
  },
  subscriptions: {},
};
