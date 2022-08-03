import { postAction, getAction } from '@/utils/httpUtils';

export function signIn(userInfo, callback) {
  return postAction('/checkUser', userInfo, callback);
}
