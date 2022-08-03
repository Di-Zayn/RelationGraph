import { truncate } from 'fs';

const config = {
  apiUrl:'http://127.0.0.1:5000',
  apiPrefix: '/api/v2',
  proxy: true, //是否开启mock代理
};

// console.log(process.env.NODE_ENV)

export default config;
