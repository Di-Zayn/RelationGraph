export default {
  // 初始化时传入一个eq的orders
  'POST /getHistoryOrder': (req, res) => {
    res.send({
      status: 'success',
      list: {
        eq3: {
          eqInfo: {
            color: "rgba(0, 0, 0, 1)"
          },
          orders: [
            {
              id: 'O10',
              startTime: '2020-04-01 05:10:00',
              endTime: '2020-04-01 05:20:30',
              plannedStartTime: '2020-04-01 05:10:00',
              plannedEndTime: '2020-04-01 05:20:30'
            },
          ]
        },
      }
    })
  },
  //  前端传入当前选中任务的id， 返回相关任务
  'POST /traceHistoryOrder': (req, res) => {
    const { orderID } = req.body
    if (orderID === 'O10') {
      res.send({
        status: 'success',
        eqs: {
          AGV1024: {
            eqInfo: {
              color: "rgba(0, 0, 0, 1)"
            },
            orders: [
              {
                id: 'O6',
                startTime: '2020-04-01 04:40:00',
                endTime: '2020-04-01 04:50:00',
                plannedStartTime: '2020-04-01 04:40:00',
                plannedEndTime: ''
              },
              // {
              //   id: 'O7',
              //   startTime: '2020-04-01 04:55:03',
              //   endTime: '2020-04-01 05:00:00',
              //   plannedStartTime: '',
              //   plannedEndTime: '2020-04-01 03:08:03'
              // },
              // {
              //   id: 'O8',
              //   startTime: '2020-04-01 05:05:05',
              //   endTime: '2020-04-01 05:25:10',
              //   plannedStartTime: '2020-04-01 05:05:05',
              //   plannedEndTime: '2020-04-01 05:25:10'
              // },
              // {
              //   id: 'O9',
              //   startTime: '2020-04-01 05:30:10',
              //   endTime: '2020-04-01 05:40:10',
              //   plannedStartTime: '2020-04-01 05:30:00',
              //   plannedEndTime: '2020-04-01 05:40:00'
              // },
            ]
          },
        },
        trace: {
          'O6': 'O10'
        }
      })
    } else if (orderID === 'O6') {
      res.send({
        status: 'success',
        eqs: {
          eq1: {
            eqInfo: {
              color: "rgba(0, 0, 0, 1)"
            },
            orders: [
              {
                id: 'O1',
                startTime: '2020-04-01 03:08:03',
                endTime: '2020-04-01 03:18:03',
                plannedStartTime: '2020-04-01 03:08:03',
                plannedEndTime: '2020-04-01 03:15:00'
              },
              {
                id: 'O2',
                startTime: '2020-04-01 03:19:00',
                endTime: '2020-04-01 03:35:03',
                plannedStartTime: '2020-04-01 03:19:00',
                plannedEndTime: '2020-04-01 03:35:03'
              },
              {
                id: 'O3',
                startTime: '2020-04-01 04:00:15',
                endTime: '2020-04-01 04:30:40',
                plannedStartTime: '',
                plannedEndTime: ''
              },
              {
                id: 'O4',
                startTime: '2020-04-01 04:31:00',
                endTime: '2020-04-01 04:35:08',
                plannedStartTime: '',
                plannedEndTime: ''
              },
              // {
              //   id: 'O5',
              //   startTime: '2020-04-01 04:45:03',
              //   endTime: '2020-04-01 04:57:03',
              //   plannedStartTime: '2020-04-01 04:36:30',
              //   plannedEndTime: '2020-04-01 05:00:00'
              // },
            ]
          },
        },
        trace: {
          'O4': 'O6',
        }
      })
    }
  }
}
