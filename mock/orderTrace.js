export default {
  'POST /getOrderTrace': (req, res) => {
    res.send({
      status: 'success',
      list: {
        // 'trace1': {
        //   'O4': 'O6',
        //   'O6': 'O10'
        // },
        // 'trace2': {
        //   'O5': 'O9'
        // },
      }
    })
  }
}
