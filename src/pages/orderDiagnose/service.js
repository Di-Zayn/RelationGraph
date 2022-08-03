import { postAction, getAction } from '@/utils/httpUtils';

export function getOrders(query, callback) {
  query.start_time = query.start_time.format('YYYY-MM-DD HH:mm:ss');
  query.end_time = query.end_time.format('YYYY-MM-DD HH:mm:ss');
  return postAction('/getOrders', query, callback);
}

export function showOrders(query, callback) {
  query.start_time = query.start_time.format('YYYY-MM-DD HH:mm:ss');
  query.end_time = query.end_time.format('YYYY-MM-DD HH:mm:ss');
  return postAction('/showOrders', query, callback);
}
