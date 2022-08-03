import { postAction, getAction } from '@/utils/httpUtils';

export function showOrders(Info, callback) {
  Info.start_time = Info.start_time.format('YYYY-MM-DD HH:mm:ss');
  Info.end_time = Info.end_time.format('YYYY-MM-DD HH:mm:ss');
  return postAction('/showOrders', Info, callback);
}
