import { postAction } from '@/utils/httpUtils';

export function getUserTable(info, callback) {
  return postAction('/getUser', info, callback);
}

export function updateUser(info, callback) {
  return postAction('/updateUser', info, callback)
}

export function removeUser(info, callback) {
  return postAction('/removeUser', info, callback)
}
