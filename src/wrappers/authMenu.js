import { Redirect } from 'umi';
import { routes } from '@/config/menu';

export default (item, callback) => {
  const { authority } = JSON.parse(localStorage.getItem('user'));

  if (authority === 'SA' || authority === 'admin') {
    return callback();
  } else {
    if (item.authority === 'admin') {
      return null;
    } else {
      return callback();
    }
  }
};
