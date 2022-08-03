import { postAction, getAction } from '@/utils/httpUtils';

export function getOrders(query, callback) {
  query.start_time = query.start_time.format('YYYY-MM-DD HH:mm:ss');
  query.end_time = query.end_time.format('YYYY-MM-DD HH:mm:ss');
  return postAction('/getOrders', query, callback);
}

export function showTrace(Info, callback) {
  return postAction('/showTrace', Info, callback);
}

export function getHistoryOrder(query, callback) {
  return postAction('/getHistoryOrder', query, callback)
}

export function getOrderTrace(query, callback) {
  return postAction('/getOrderTrace', query, callback)
}

export function traceHistoryOrder(id, callback) {
  // id: 任务id
  return postAction('/traceHistoryOrder', id, callback)
}
