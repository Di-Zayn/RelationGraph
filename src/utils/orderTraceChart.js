import React, { Component } from 'react';
import * as echarts from 'echarts';
import {extractOrders, extractTraces} from './extractInfo'

// Date的深拷贝需自定义
Date.prototype.clone = function(){
  return new Date(this.valueOf())
}

// 由于在实现拖拽时，传入的参数是线段本身 所以设置一个全局的this作为临时解决方案
let _this = null

class OrderTraceChart extends Component {

  myChart = null;

  async componentDidMount() {
    console.log(this.props);
    console.log('mount');
    //初始化图形
    await this.initChart();
    _this = this
    //数据注入
    this.setOption();
  }

  componentDidUpdate() {
    console.log('update')
    //持续更新
    if (this.myChart) {
      this.myChart.resize();
    }
    this.setOption();
  }



  getOption() {

    const { orderTrace, historyOrder, eqDict, baseTime, totalInterval } = this.props;

    const orders = extractOrders(historyOrder, baseTime, eqDict)
    const traces = extractTraces(orders, orderTrace)

    console.log(orders, traces, eqDict)

    const series = [...traces, ...orders]
    const originTime = new Date(baseTime)

    let maxLength = 0 //记录最长设备名，统一mark point大小
    let equipmentsIdx = []
    for (let i in eqDict) {
      if (i.length > maxLength) maxLength = i.length
      equipmentsIdx.push(eqDict[i])
    }

    // 统一的endLabel和emphasis样式
    // 当鼠标悬停在任务条上时，填充endLabel
    const endLabel = {
      show: true,
      formatter: function () {
        return ""
      },
    }

    const emphasis = {
      focus: 'series',
      blurScope: 'coordinateSystem',
      endLabel: {
        show: true,
        formatter: function (params) {
          const info = params.data;
          let str = [];
          for (let key in info) {
            if (key == "value") continue;
            str.push(`{a|${key}:${info[key]}}`);
          }
          return str.join('\n');
        },
        backgroundColor: 'rgba(156, 168, 161, 0.2)',
        rich: {
          a: {
            align: 'left'
          }
        },
        align: 'center',
        verticalAlign: 'bottom'
      },
    }

    for (let i of series) {
      if (i.name == 'trace' || i.name == 'plan') continue // 只有task才具有endLabel和emphasis
      i.endLabel = endLabel
      i.emphasis = emphasis
    }

    for (let eq in eqDict) {
      series.push({
        name: "markPoint",
        type: 'line',
        markPoint: {
          data: [
            {
              x: 36.5, // 关于该值, 见graphicLines注释
              yAxis: eqDict[eq],
              name: `${eq}`,
              label: {
                formatter: `${eq}`,
                color: 'rgba(0, 0, 0, 1)'
              }
            },
          ],
          itemStyle: {
            color: 'green',
          },
          symbolSize: function (value, params) {
            return 15 * maxLength
          },
        },
      })
    }

    return {
      title: {
        text: '历史图'
      },
      legend: {
        data: ['plan', 'trace']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          type: 'inside',
          realtime: true,
          filterMode: 'none',
        }
      ],
      xAxis: {
        id: 'x',
        type: 'value',
        min: 0,
        max: totalInterval,
        minInterval: 1,
        axisLabel: { // 坐标轴标签样式设置
          formatter: function(value) {
            // 将value转为时间格式
            let temp = originTime.clone() // 深拷贝
            let time = new Date(temp.setSeconds(temp.getSeconds() + value));
            return time.toLocaleString('en-CA')
          },
        }
      },
      yAxis: {
        id: 'y',
        type: 'value',
        boundaryGap: false,
        // interval: 0.01,
        splitLine: false,
        axisLine: false,
        max: equipmentsIdx.length + 1,
        min: 0,
        axisLabel: {
          formatter: function(value) {
            return
          }
        }
      },
      series: series
    }
  }

  initChart() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.myChart = echarts.init(document.getElementById('main'));
        resolve();
      }, 0);
    });
  }

  setOption() {

    const { eqDict, totalInterval } = this.props;

    if (!this.myChart) {
      return;
    }
    const option = this.getOption();
    this.myChart.setOption(option);

    // 设置一个透明的线，实现拖拽
    let graphicLines = []
    for (let eq in eqDict) {
      graphicLines.push({
        id: `${eq}-rect`,
        name: `${eq}`,
        type: 'rect',
        z: 0,
        shape: {
          width: 875,
          height: 5
        },
        // 通过：this.myChart.convertToPixel({ xAxisId: 'x' }, 0)获得原点的像素横坐标，写死，这样缩放后再拖拽就不会出现消失的情况
        position: [36.5, this.myChart.convertToPixel({ yAxisId: 'y' }, eqDict[eq]) - 2],
        draggable: true,
        style: {
          fill: 'rgba(255, 0, 0, 0.0)',
          stroke: 'rgba(255, 0, 0, 0.2)',
          lineWidth: 2,
        },
        cursor: 'move',
        ondragend: this.onDragEnd
      },)
    }
    this.myChart.setOption({
      graphic: graphicLines
    })
    this.myChart.on('click', function(params) {
      console.log('@',params.data.id)
      console.log(this)
      _this.props.traceHistory({
        orderID: params.data.id
      })
    });
  }

  onDragEnd() {
    // this是线段
    let newValue = _this.myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);
    _this.props.updateEqDict({
      key: this.name.substring(this.name.len - 5),
      value: newValue
    })
    _this.setOption()
  }

  render() {
    return <div id="main" style={{minHeight: '550px'}}/>;
  }
}

export default OrderTraceChart
