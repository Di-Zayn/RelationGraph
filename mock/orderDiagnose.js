import mockjs from 'mockjs';

export default {
  'POST /getOrders': (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');

    const orders = [
      {
        key: 0,
        WI_ID: '55524084',
        type: 'LOAD',
        period: '',
        ETA: '2020-04-02 08:44:54',
        ETD: '2020-04-02 08:52:14',
        RTA: '2020-04-02 09:01:34',
        RTD: '2020-04-02 09:21:18',
        diagnose: '延迟',
        item: [
          {
            ORDER_ID: '23246885',
            move_stage: 'ASC',
            equipment: '754S',
            ETA: '2020-04-02 09:00:44',
            ETD: '2020-04-02 09:03:09',
            RTA: '2020-04-02 09:01:06',
            RTD: '2020-04-02 09:03:15',
            RTD_pred: '',
            diagnose: '延迟',
          },
          {
            ORDER_ID: '87601979',
            move_stage: 'AGV',
            equipment: '805',
            ETA: '',
            ETD: '2020-04-02 09:08:28',
            RTA: '',
            RTD: '2020-04-02 09:08:37',
            RTD_pred: '',
            diagnose: '延迟',
          },
          {
            ORDER_ID: '87602240',
            move_stage: 'AGV',
            equipment: '805',
            ETA: '',
            ETD: '2020-04-02 09:11:50',
            RTA: '',
            RTD: '2020-04-02 09:13:29',
            RTD_pred: '',
            diagnose: '延迟',
          },
          {
            ORDER_ID: '6972595',
            move_stage: 'STS',
            equipment: '120L3',
            ETA: '2020-04-02 09:17:36',
            ETD: '',
            RTA: '2020-04-02 09:17:39',
            RTD: '2020-04-02 09:19:23',
            RTD_pred: '',
            diagnose: '',
          },
          {
            ORDER_ID: '6972608',
            move_stage: 'STS',
            equipment: '120W2',
            ETA: '2020-04-02 09:19:37',
            ETD: '',
            RTA: '2020-04-02 09:19:38',
            RTD: '2020-04-02 09:21:18',
            RTD_pred: '',
            diagnose: '',
          },
        ],
      },
      {
        key: 1,
        WI_ID: '55543178',
        type: 'DLVR',
        period: '',
        ETA: '2020-04-03 17:57:03',
        ETD: '2020-04-03 17:59:03',
        RTA: '2020-04-03 18:07:19',
        RTD: '2020-04-03 18:08:32',
        diagnose: '延迟',
        item: [
          {
            ORDER_ID: '23272045',
            move_stage: 'ASC',
            equipment: '757L',
            ETA: '2020-04-03 18:05:19',
            ETD: '2020-04-03 18:07:35',
            RTA: '2020-04-03 18:05:58',
            RTD: '2020-04-03 18:08:31',
            RTD_pred: '',
            diagnose: '延迟',
          },
        ],
      },
    ];

    res.send(
      mockjs.mock({
        status: 'success',
        orders: orders,
      }),
    );
  },
};
