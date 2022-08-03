import { defineConfig } from 'umi';

const routes: String[] = require('./src/config/menu.js').routes;
// const auth=require('./src/wrappers/auth.js')

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '关联图谱管理系统',
  favicon: '@/assets/logo_rg.ico',
  routes: [
    { path: '/', exact: true, component: '@/pages/index', redirect: '/login' },

    {
      path: '/relationGraph',
      wrappers: ['@/wrappers/authRoute'],
      exact: false,
      component: '@/layouts/workSpace',
      routes: routes,
    },
    {
      exact: true,
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/login', component: '@/pages/login/login' },
        { exact: true, path: '/register', component: '@/pages/login/register' },
      ],
    },
  ],
  fastRefresh: {},
});
