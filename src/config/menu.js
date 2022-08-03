const menu = [
  {
    key: 'mainPage',
    path: '/relationGraph/mainPage',
    component: '@/pages/mainPage/index',
    title: '码头状态查询',
    subMenu: [],
  },
  {
    key: 'orderDiagnose',
    path: '/relationGraph/orderDiagnose',
    component: '@/pages/orderDiagnose/index',
    title: '任务异常诊断',
    subMenu: [],
  },
  {
    key: 'orderTraceSource',
    path: '/relationGraph/orderTraceSource',
    component: '@/pages/orderTraceSource/index',
    title: '任务异常溯源',
    subMenu: [],
  },
  {
    key: 'orderQuery',
    path: '/relationGraph/orderQuery',
    component: '@/pages/orderQuery/index',
    title: '历史任务查询',
    subMenu: [],
  },
  {
    key: 'userManager',
    path: '/relationGraph/userManager',
    component: '@/pages/userManager/index',
    title: '用户管理',
    authority: 'admin',
    subMenu: [],
  },
];

const menuToRoute = (routes, menu) => {
  menu.map((item) => {
    routes.push({
      exact: true,
      path: item.path,
      component: item.component,
      authority: item.authority,
    });
    menuToRoute(routes, item.subMenu);
  });
};

const routes = [];
menuToRoute(routes, menu);
const routeDict = {};
routes.map((item) => (routeDict[item.path] = item));

export { menu, routes, routeDict };
