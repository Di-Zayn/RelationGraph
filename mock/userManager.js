export default {
  'POST /getUser': (req, res) => {
    res.send({
      status: 'success',
      users: [
        {
          id: 1,
          authority: 'SA',
          username: 'admin',
          password: 'ant.design',
        },
        {
          id: 2,
          authority: 'admin',
          username: '123',
          password: 'jdk',
        },
        {
          id: 3,
          authority: 'normal',
          username: 'xxx',
          password: 'pwd',
        },
      ]
    })
  },
  'POST /updateUser': (req, res) => {
    res.send({
      status: 'success'
    })
  }
}
