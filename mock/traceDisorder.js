export default {
  'POST /showTrace': (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');

    res.send({
      status: 'success',
      trace: {
        info: {
          预计结束时间: '2020-04-01 03:08:03',
          实际结束时间: '2020-04-01 04:14:08',
          任务创建时间: '2020-04-01 01:27:44',
          WI_ID: 55509159,
        },
        type: 'WI',
        name: 'WI_LOAD',
        status: 'disorder',
        children: [
          {
            info: {
              SOR_ID: 6960865,
              STS_ID: '118',
              起始位置W: '118L2',
              起始位置L: null,
              目的位置W: '581184',
              目的位置L: null,
              创建时间: '2020-04-01 04:12:00',
              到达起始位置时间: '2020-04-01 04:12:01',
              到达目的位置时间: '2020-04-01 04:14:08',
            },
            type: 'STS_M',
            name: 'STS_M_LOAD',
            edge: '接续任务',
            children: [
              {
                info: {
                  SOR_ID: 6960847,
                  STS_ID: '118',
                  起始位置W: '118W2',
                  起始位置L: null,
                  目的位置W: '580984',
                  目的位置L: null,
                  创建时间: '2020-04-01 04:10:01',
                  到达起始位置时间: '2020-04-01 04:10:02',
                  到达目的位置时间: '2020-04-01 04:11:59',
                  WSH_WI_ID: 55509158,
                  LSH_WI_ID: null,
                  WSL_WI_ID: null,
                  LSL_WI_ID: null,
                },
                type: 'STS_M',
                name: 'STS_M_LOAD',
                edge: '此前任务',
              },
              {
                info: {
                  SOR_ID: 6960846,
                  STS_ID: '118',
                  起始位置W: '118L2',
                  起始位置L: null,
                  目的位置W: '118L2',
                  目的位置L: null,
                  创建时间: '2020-04-01 04:09:45',
                  到达起始位置时间: '2020-04-01 04:09:47',
                  到达目的位置时间: '2020-04-01 04:11:19',
                },
                type: 'STS_P',
                name: 'STS_P_LOAD',
                edge: '接续任务',
                children: [
                  {
                    info: {
                      SOR_ID: 6960807,
                      STS_ID: '118',
                      起始位置W: '118L5',
                      起始位置L: null,
                      目的位置W: '118W2',
                      目的位置L: null,
                      创建时间: '2020-04-01 04:05:40',
                      到达起始位置时间: '2020-04-01 04:05:42',
                      到达目的位置时间: '2020-04-01 04:09:44',
                      WSH_WI_ID: 55509158,
                      LSH_WI_ID: null,
                      WSL_WI_ID: null,
                      LSL_WI_ID: null,
                    },
                    type: 'STS_P',
                    name: 'STS_P_LOAD',
                    edge: '此前任务',
                  },
                  {
                    info: {
                      AGO_ID: 87505967,
                      AGV_ID: '860',
                      WI_ID1: 55509159,
                      WI_ID2: null,
                      创建时间: '2020-04-01 04:03:09',
                      完成时间: '2020-04-01 04:10:24',
                      起点TP: '52CW074',
                      经过TP: 'PB330',
                    },
                    type: 'AGV',
                    name: 'AGV_DELIVER',
                    edge: '接续任务',
                    children: [
                      {
                        info: {
                          AGO_ID: 87505440,
                          AGV_ID: '860',
                          WI_ID1: 55509159,
                          WI_ID2: null,
                          创建时间: '2020-04-01 03:53:03',
                          完成时间: '2020-04-01 04:03:08',
                          起点TP: '119L6',
                          经过TP: '52CW074',
                        },
                        type: 'AGV',
                        name: 'AGV_RECEIVE',
                        edge: '此前任务',
                        children: [
                          {
                            info: {
                              AGO_ID: 87504738,
                              AGV_ID: '860',
                              WI_ID1: 55509654,
                              WI_ID2: 55509655,
                              创建时间: '2020-04-01 03:37:18',
                              完成时间: '2020-04-01 03:53:02',
                              起点TP: '42WSD3',
                              经过TP: 'PB330',
                            },
                            type: 'AGV',
                            name: 'AGV_DELIVER',
                            edge: '此前任务',
                          },
                        ],
                      },
                      {
                        info: {
                          AOR_ID: 23228968,
                          ASC_ID: '752L',
                          创建时间: '2020-04-01 03:59:50',
                          上锁时间: '2020-04-01 04:01:34',
                          解锁时间: '2020-04-01 04:03:07',
                        },
                        type: 'ASC',
                        name: 'ASC_DLVR',
                        edge: '接续任务',
                        children: [
                          {
                            info: {
                              AOR_ID: 23228933,
                              ASC_ID: '752L',
                              创建时间: '2020-04-01 03:55:54',
                              上锁时间: '2020-04-01 03:58:02',
                              解锁时间: '2020-04-01 03:59:48',
                              WI_ID: 55508893,
                              RESTOW_WI_ID: null,
                            },
                            type: 'ASC',
                            name: 'ASC_DLVR',
                            edge: '此前任务',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  },
};