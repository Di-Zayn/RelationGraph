import mockjs from 'mockjs';

export default {
  // 支持值为 Object 和 Array
  // 'GET /appservice/common/v1/getSomeData': responseData,

  // GET POST 可省略 比如：
  // 'POST /api/v2/checkUser':  {
  //     '/': mockjs.mock({
  //       'list|100': [{ name: '@citys123', 'value|1-100': 50, 'type|0-2': 1 }],
  //     }),
  //   }
  'POST /checkUser': (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    const { username, password } = req.body;
    if (username === 'admin' && password === 'ant.design') {
      res.send(
        mockjs.mock({
          status: 'success',
          id: 1,
          authority: 'admin',
          username: username,
          password: password,
        }),
      );
    } else if (username === 'guest' && password === 'ant.design') {
      res.send(
        mockjs.mock({
          status: 'success',
          id: 2,
          authority: 'normal',
          username: username,
          password: password,
        }),
      );
    } else {
      res.send({ status: 'fail', msg: '用户名密码错误' });
    }
  },
};
