import { Reducer, Effect, Subscription, history } from 'umi';
import {getHistoryOrder, getOrders, getOrderTrace, showTrace, traceHistoryOrder} from './service';

function setSymbol(trace) {
  // 设置树中节点的形状
  if (trace == null) {
    return;
  }
  if (trace.type == 'WI') {
    trace.symbol = 'circle';
  } else if (trace.type == 'STS_M') {
    trace.symbol = 'triangle';
  } else if (trace.type == 'STS_P') {
    trace.symbol = 'diamond';
  } else if (trace.type == 'AGV') {
    trace.symbol = 'rect';
  } else {
    trace.symbol = 'roundRect';
  }

  if (trace.children == undefined) {
    return;
  } else {
    for (let i = 0; i < trace.children.length; ++i) {
      setSymbol(trace.children[i]);
    }
  }
}

export default {
  namespace: 'orderTraceSource',
  state: {
    orders: [],
    modalVisible: false,
    trace: null,
    chartVisible: false,
    // 新添加 , 前面的是之前版本的变量
    historyOrder: null,
    orderTrace: null,
    eqDict: {},// 将设备映射到一个整形索引，作为纵坐标
    // 以下两个量应该根据用户的查询设置
    baseTime: '2020-04-01 03:05:00', // 起始时间, x轴的值为任务时间与起始时间的间隔
    totalInterval: 10800, // 查询间隔
  },
  reducers: {
    // 同步方法, 唯一修改state的方法
    // ...: 展开语法， 将元素展开为一个个的key-value形式
    getTableUpdate(state, { payload }) {
      state.orders = payload.orders;
      state.columns = payload.columns;
      return { ...state };
    },
    // 为trace中各个节点写入symbol属性，表示该节点可视化时的形状
    visionUpdate(state, { payload }) {
      var ori_trace = payload.trace;
      setSymbol(ori_trace);

      state.trace = ori_trace;
      return { ...state };
    },

    // 新添加
    // 一次性更新eqs和traces
    getChartUpdate(state, { payload }) {

      const eqs = payload.eqs, traces = payload.traces

      state.eqDict = {}
      let idx = 1
      for (let eq in eqs.list) {
        state.eqDict[eq] = idx
        idx++
      }

      state.historyOrder = eqs
      state.orderTrace = traces
      console.log(eqs)
      console.log(state.historyOrder)
      console.log(state.eqDict)

      return { ...state}
    },

    // 请求返回新的eq order list后更新
    updateOrderTrace(state, { payload }) {
      const eqs = payload.eqs, trace = payload.trace

      // 将新的eq信息写入
      // 这里默认了后续传入的order不会属于之前的eq
      for (let eq in eqs) {
        state.historyOrder.list[eq] = eqs[eq]
      }

      if (JSON.stringify(state.orderTrace.list) === "{}") {
        state.orderTrace.list['trace1'] = trace
      } else {
        for (let i in trace) {
          state.orderTrace.list['trace1'][i] = trace[i]
        }
      }

      state.eqDict = {}
      let idx = 1
      for (let eq in state.historyOrder.list) {
        state.eqDict[eq] = idx
        idx++
      }

      return { ...state }

    },

    // cleanHistoryOrders(state, { payload }) {
    //   historyOrder
    //   return { ...state }
    // },

    // 被使用了 但在IDE中可能显示未被使用
    getEqDictUpdate(state, { payload }) {
      state.eqDict[payload.key] = payload.value
      return { ...state}
    },

    handleChartVisible(state, { payload }) {
      state.chartVisible = payload;
      if (!payload) {
        state.trace = null;
      }
      return { ...state };
    },

    getTimeUpdate(state, { payload }) {
      // 接收查询时间段的
      // 为了方便调试注释掉了
      // state.baseTime = payload.start_time
      // state.totalInterval = parseInt((new Date(payload.end_time).getTime()- new Date(payload.start_time).getTime())/1000)
      return { ...state }
    },


    // 修改至此

    handleModalVisible(state, { payload }) {
      state.modalVisible = payload;
      if (!payload) {
        state.trace = null;
      }
      return { ...state };
    },

    handleWorktypeChange(state, { payload }) {
      state.worktype = payload;
      return { ...state };
    },
  },
  effects: {
    // 异步方法
    // 第二个参数包括；{select, call, put}
    // select 选择state中的数据 const a = yield select( s => s.a )
    // put 调用reducers/effects
    // call 调用异步函数 yield call (func, data)
    *updateTable({ payload: query }, { call, put }) {
      const rt = yield call(getOrders, query); // 调用接口
      // 新增，用以修改baseTime
      yield put({
        type: 'getTimeUpdate',
        payload: query
      })
      yield put({ // 调用reducers
        type: 'getTableUpdate',
        payload: rt,
      });
    },

    *updateModal({ payload: Info }, { call, put }) {
      yield put({
        type: 'handleModalVisible',
        payload: true,
      });
      const rt = yield call(showTrace, Info);
      yield put({
        type: 'visionUpdate',
        payload: rt,
      });
    },

    //新添加
    *updateChart({ payload: Info }, { call, put }) {
      const eqs = yield call(getHistoryOrder, Info);
      const traces = yield call(getOrderTrace, Info);
      yield put({
        type: 'getChartUpdate',
        payload: {
          eqs: eqs,
          traces: traces
        },
      });
      yield put({
        type: 'handleChartVisible',
        payload: true,
      });
    },

    *traceHistoryOrder({payload}, { call, put}){
      const orders = yield call(traceHistoryOrder, payload);
      yield put({
        type: 'updateOrderTrace',
        payload: {
          eqs: orders.eqs,
          trace: orders.trace
        },
      });
    }

  },
  subscriptions: {},
};
