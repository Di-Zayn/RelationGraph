import { Reducer, Effect, Subscription, history } from 'umi';
import { signIn } from './service';

export default {
  namespace: 'login_register',
  state: {},
  reducers: {
    signInUpdate(state, { payload }) {
      console.log('@', payload);
      localStorage.setItem('user', JSON.stringify(payload));
      history.push({ pathname: '/relationGraph/mainPage', userInfo: payload });
      return { ...state };
    },
  },
  effects: {
    *signIn({ payload: userInfo }, { call, put }) {
      const rt = yield call(signIn, userInfo);
      yield put({
        type: 'signInUpdate',
        payload: rt,
      });
    },

    signOut() {
      localStorage.removeItem('user');
      history.push({ pathname: '/login' });
    },
  },
  subscriptions: {},
};
