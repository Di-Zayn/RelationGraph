// 新添加
export function extractOrders(eqs, baseTime, eqDict) {
  // 解析出任务列表(包括实际的和计划的)
  const list = eqs.list
  const base = new Date(baseTime).getTime()

  let historyOrder = []
  let plan = {
    name: 'plan',
    type: 'line',
    lineStyle: {
      width: 6,
    },
    data: [],
    symbol: 'none',
    color: 'blue'
  }

  for (let eq in list) {
    // 将每一个order都改写成线段的形式
    for (let order of list[eq]['orders']) {

      let start = parseInt((new Date(order.startTime).getTime()- base)/1000)
      let end = parseInt((new Date(order.endTime).getTime()- base)/1000)

      // 这里将startPoint的symbolSize调大 并将尾节点和plan线段的点的symbol都设为none， 目的是为了突出startPoint可被点击的效果
      let startPoint = {
        value: [start, eqDict[eq]],
        symbolSize: 10,
        id: order.id
      }

      order.value = [end, eqDict[eq]]
      order.symbol = 'none'
      historyOrder.push({
        name: eq,
        type: 'line', // 也可以在orderTraceChart中添加
        lineStyle: {
          width: 6,
        },
        data: [
          startPoint,
          order
        ]
      })

      if (order.plannedStartTime != null && order.plannedStartTime !== '' &&
        order.plannedEndTime != null && order.plannedEndTime !== '') {

        let plannedStart = parseInt((new Date(order.plannedStartTime).getTime()- base)/1000)
        let plannedEnd = parseInt((new Date(order.plannedEndTime).getTime()- base)/1000)

        plan.data.push([plannedStart, eqDict[eq] - 0.1])
        plan.data.push([plannedEnd, eqDict[eq] - 0.1])
        plan.data.push(['-', eqDict[eq] - 0.1])

      }
    }
  }

  historyOrder.push(plan)

  return historyOrder

}

// 新添加
export function extractTraces(orders, traces) {
  // 解析出任务轨迹
  const list = traces.list
  let orderTrace = []

  console.log('!!', list)
  for (let trace in list) {
    // items存储该轨迹中出现的所有任务
    let items = []
    for (let i in list[trace]) {
      items.push(i)
      items.push(list[trace][i])
    }

    let temp = [...items]

    // 假设trace涉及的任务数量要远少于总任务数
    // 先过滤
    let newOrders = orders.filter((el) => {
      for (let i = 0; i < temp.length; i++) {
        if (el.data[1].id == temp[i]) {
          temp.splice(i, 1) // 不断清空temp数组
          return true
        }
      }
      return false
    })

    let data = []
    let idx = -1
    for (let i = 0; i < items.length; i++) {
      idx = newOrders.findIndex((el) => {
        return el.data[1].id == items[i]
      })
      if (i % 2 === 0) {// 始任务 取结束时间
        data.push(newOrders[idx].data[1].value)
      } else {
        data.push(newOrders[idx].data[0])
        // 分段
        data.push(['-', 0]) //由于已经指定了'-', 纵坐标任意即可
      }
    }

    orderTrace.push({
      name: 'trace',
      type: 'line',
      lineStyle: {
        width: 4,
        type: 'dashed'
      },
      data: data,
    })
  }

  return orderTrace
}
