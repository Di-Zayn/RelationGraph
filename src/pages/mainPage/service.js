import { postAction, getAction } from '@/utils/httpUtils';

export function showOrders(Info, callback) {
  return postAction('/showOrders', Info, callback);
}
