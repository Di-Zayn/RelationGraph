import { Redirect } from 'umi';
import { routeDict } from '@/config/menu';

export default (props) => {
  const { authority } = JSON.parse(localStorage.getItem('user'));
  console.log(authority, props, routeDict);
  if (authority === 'admin' || authority === 'SA') {
    return <div>{props.children}</div>;
  } else if (authority === 'normal') {
    if (routeDict[props.location.pathname].authority === 'admin') {
      return <Redirect to="/login" />;
    } else {
      return <div>{props.children}</div>;
    }
  } else {
    return <Redirect to="/login" />;
  }
};
