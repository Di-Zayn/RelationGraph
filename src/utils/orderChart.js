import React, { Component } from 'react';
import * as echarts from 'echarts';

// const icons = [
//   require('@/assets/ship.png'),
//   require('@/assets/bridge.png'),
//   require('@/assets/truck.png')
// ]

class OrderChart extends Component {
  myChart = null;

  async componentDidMount() {
    console.log(this.props);
    //初始化图形
    await this.initChart();
    //数据注入
    this.setOption();
  }

  componentDidUpdate() {
    //持续更新
    if (this.myChart) {
      this.myChart.resize();
    }
    this.setOption();
  }

  getOption() {
    //从props中获得数据，返回option供渲染
    const { equipments, orders } = this.props;
    console.log('@:', this.props)
    let nodes = [];
    let links = [];
    //let legendData = ["BPS",'STS','STS_TP',"AGV小车","ASC_S_TP","ASCS","YARD","ASCL","ASC_L_TP","TRUCK"];//图例
    let legendData = [
      {
        name:'船舶',
        //icon:'image://' + icons[0],//图片
        icon:'rect',
        itemStyle:{//可以定义颜色
          color:'#5470c6',
        },
        //以下为自定义的属性
        //方便对节点的分类属性进行操作
        symbolSize:120,//宽
        proportion:0.25,//宽：高
      },
      {
        name:'桥吊',
        icon:'rect',
        itemStyle:{
          color:'#91cc75',
        },
        symbolSize:30,
        proportion:0.5,
      },
      {
        name:'桥吊车位',
        icon:'rect',
        itemStyle:{
          color:'#fac858',
        },
        symbolSize:6,
        proportion:2.5,
      },
      {
        name:'AGV小车',
        icon:'rect',
        itemStyle:{
          color:'#ee6666',
        },
        symbolSize:5,
        proportion:1,
      },
      {
        name:'轨道吊海侧车位',
        icon:'rect',
        itemStyle:{
          color: '#73c0de',
        },
        symbolSize:6,
        proportion:2.5,
      },
      {
        name:'海侧轨道吊',
        icon:'rect',
        itemStyle:{
          color:'#3ba272',
        },
        symbolSize:10,
        proportion:0.5,
      },
      {
        name:'堆场',
        icon:'rect',
        itemStyle:{
          color:'#fc8452',
        },
        symbolSize:20,
        proportion:1,
      },
      {
        name:'陆侧轨道吊',
        icon:'rect',
        itemStyle:{
          color:'#9a60b4',
        },
        symbolSize:10,
        proportion:0.5,
      },
      {
        name:'轨道吊陆侧车位',
        icon:'rect',
        itemStyle:{
          color:'#ea7ccc',
        },
        symbolSize:6,
        proportion:2.5,
      },
      {
        name:'卡车',
        icon:'rect',
        itemStyle:{
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'black', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        symbolSize:20,
        proportion:0.5,
      }
    ];


    if (
      Object.keys(orders).length === 0 ||
      Object.keys(equipments).length === 0
    ) {
      return {};
    }

    for (let i = 0; i < orders['BPS'].length; i++) {
      let b = orders['BPS'].length;
      orders['BPS'][i].x = 200 + (i / b) * 1000;
      orders['BPS'][i].y = 0;
      orders['BPS'][i].category = 0;
      orders['BPS'][i].value =
        orders['BPS'][i].VESSEL_CNAME + '(' + orders['BPS'][i].node_id + ')';
      orders['BPS'][i].emphasis = {
        focus: 'adjacency',
      };
      orders['BPS'][i].label = {
        position:'inside',
        show:true,
        color:'black',
        fontSize:10,
        formatter: (params)=>{
          return params.data.VESSEL_CNAME;
          //return params.value//船名+编号
        }
      }
      orders['BPS'][i].name = orders['BPS'][i].node_id.toString();
      console.log(orders['BPS'][i])
      nodes.push(orders['BPS'][i]);
    }
    for (let i = 0; i < orders['STS'].length; i++) {
      orders['STS'][i].num = 0;
      for (let j = 0; j < orders['STS'].length; j++) {
        if (orders['STS'][i].node_id > orders['STS'][j].node_id) {
          orders['STS'][i].num = orders['STS'][i].num + 1;
        }
      }
    }
    for (let i = 0; i < orders['STS'].length; i++) {
      let b = orders['STS'].length;
      orders['STS'][i].x = 150 + (orders['STS'][i].num / b) * 1000;
      orders['STS'][i].y = 60;
      orders['STS'][i].category = 1;
      orders['STS'][i].value = 'STS';
      orders['STS'][i].emphasis = {
        focus: 'adjacency',
      };
      orders['STS'][i].name = orders['STS'][i].node_id;
      nodes.push(orders['STS'][i]);
      for (let j = 0; j < 8; j++) {
        nodes.push({
          name: orders['STS'][i].node_id + 'L' + `${j + 1}`,
          x: 150 + (orders['STS'][i].num / b) * 1000 + (j * 2 - 7) * 5,
          y: 100,
          category: 2,
          value: 'STS_TP',
          emphasis: {
            focus: 'adjacency',
          },
        });
      }
    }
    for (let i = 0; i < orders['AGV'].length; i++) {
      orders['AGV'][i].num = 0;
      for (let j = 0; j < orders['AGV'].length; j++) {
        if (orders['AGV'][i].node_id > orders['AGV'][j].node_id) {
          orders['AGV'][i].num = orders['AGV'][i].num + 1;
        }
      }
    }
    for (let i = 0; i < orders['AGV'].length; i++) {
      let b = orders['AGV'].length;
      orders['AGV'][i].x = 80 + (orders['AGV'][i].num / b) * 1000;
      orders['AGV'][i].y = 180;
      orders['AGV'][i].category = 3;
      orders['AGV'][i].value = 'AGV';
      orders['AGV'][i].name = orders['AGV'][i].node_id;
      (orders['AGV'][i].emphasis = {
        focus: 'adjacency',
      }),
        (orders['AGV'][i].itemStyle = {
          borderType: 'solid',
          borderWidth: 1,
        });
      nodes.push(orders['AGV'][i]);
    }
    for (let i = 0; i < orders['YARD'].length; i++) {
      orders['YARD'][i].num = 0;
      for (let j = 0; j < orders['YARD'].length; j++) {
        if (orders['YARD'][i].node_id > orders['YARD'][j].node_id) {
          orders['YARD'][i].num = orders['YARD'][i].num + 1;
        }
      }
    }
    for (let i = 0; i < orders['YARD'].length; i++) {
      let b = orders['YARD'].length;
      orders['YARD'][i].x = 100 + (orders['YARD'][i].num / b) * 1000;
      orders['YARD'][i].y = 320;
      orders['YARD'][i].category = 6;
      orders['YARD'][i].value = 'YARD';
      orders['YARD'][i].label = {
        position:'inside',
        show:true,
        color:'black'
      }
      orders['YARD'][i].name = orders['YARD'][i].node_id;
      orders['YARD'][i].itemStyle = {
        opacity:0.5,
      }
      nodes.push(orders['YARD'][i]);
      for (let j = 0; j < orders['ASCS'].length; j++) {
        if (
          orders['ASCS'][j].node_id ==
          '7' + orders['YARD'][i].node_id + 'S'
        ) {
          orders['ASCS'][j].x = 100 + (orders['YARD'][i].num / b) * 1000 - 10;
          orders['ASCS'][j].y = orders['YARD'][i].y - 12;
          orders['ASCS'][j].category = 5;
          orders['ASCS'][j].value = 'ASCS';
          orders['ASCS'][j].name = orders['ASCS'][j].node_id;
          orders['ASCS'][j].emphasis = {
            focus: 'adjacency',
          };
          nodes.push(orders['ASCS'][j]);
        }
      }
      for (let k = 0; k < orders['ASCL'].length; k++) {
        if (
          orders['ASCL'][k].node_id ==
          '7' + orders['YARD'][i].node_id + 'L'
        ) {
          orders['ASCL'][k].x = 100 + (orders['YARD'][i].num / b) * 1000 + 10;
          orders['ASCL'][k].y = orders['YARD'][i].y + 12;
          orders['ASCL'][k].value = 'ASCL';
          orders['ASCL'][k].category = 7;
          orders['ASCL'][k].name = orders['ASCL'][k].node_id;
          orders['ASCL'][k].emphasis = {
            focus: 'adjacency',
          };
          nodes.push(orders['ASCL'][k]);
        }
      }
      let ASC_S_TP_num = 0;
      for (let p = 0; p < orders['ASC_S_TP'].length; p++) {
        if (
          orders['ASC_S_TP'][p].node_id.slice(0, 2) == orders['YARD'][i].node_id
        ) {
          orders['ASC_S_TP'][p].x =
            100 + (orders['YARD'][i].num / b) * 1000 + 8 * ASC_S_TP_num;
          orders['ASC_S_TP'][p].y = 280 - (orders['YARD'][i].num % 3) * 12;
          orders['ASC_S_TP'][p].value = 'ASC_S_TP';
          orders['ASC_S_TP'][p].category = 4;
          orders['ASC_S_TP'][p].name = orders['ASC_S_TP'][p].node_id;
          orders['ASC_S_TP'][p].emphasis = {
            focus: 'adjacency',
          };
          nodes.push(orders['ASC_S_TP'][p]);
          ASC_S_TP_num = ASC_S_TP_num + 1;
        }
      }
      let ASC_L_TP_num = 0;
      for (let p = 0; p < orders['ASC_L_TP'].length; p++) {
        if (
          orders['ASC_L_TP'][p].node_id.slice(0, 2) == orders['YARD'][i].node_id
        ) {
          orders['ASC_L_TP'][p].x =
            100 + (orders['YARD'][i].num / b) * 1000 + 8 * ASC_L_TP_num;
          orders['ASC_L_TP'][p].y = 400 - (orders['YARD'][i].num % 3) * 12;
          orders['ASC_L_TP'][p].category = 8;
          orders['ASC_L_TP'][p].value = 'ASC_L_TP';
          orders['ASC_L_TP'][p].name = orders['ASC_L_TP'][p].node_id;
          orders['ASC_L_TP'][p].emphasis = {
            focus: 'adjacency',
          };
          nodes.push(orders['ASC_L_TP'][p]);
          ASC_L_TP_num = ASC_L_TP_num + 1;
        }
      }
    }
    for (let i = 0; i < orders['TRUCK'].length; i++) {
      orders['TRUCK'][i].sign = 0;
    }
    for (let i = 0; i < orders['TRUCK'].length - 1; i++) {
      for (let j = i + 1; j < orders['TRUCK'].length; j++) {
        if (orders['TRUCK'][i].node_id == orders['TRUCK'][j].node_id) {
          orders['TRUCK'][j].sign = 1;
        }
      }
    }
    let truck_num = 0;
    for (let i = 0; i < orders['TRUCK'].length; i++) {
      if (orders['TRUCK'][i].sign == 0) {
        let b = orders['TRUCK'].length;
        orders['TRUCK'][i].x =
          60 + (truck_num / b) * 1000 + ((5 - (truck_num % 5)) / b) * 1000;
        orders['TRUCK'][i].y = 480 + (truck_num % 5) * 16;
        orders['TRUCK'][i].category = 9;
        orders['TRUCK'][i].value = 'TRUCK';
        orders['TRUCK'][i].name = orders['TRUCK'][i].node_id;
        orders['TRUCK'][i].emphasis = {
          focus: 'adjacency',
        };
        nodes.push(orders['TRUCK'][i]);
        truck_num = truck_num + 1;
      }
    }
    for (let i = 0; i < equipments['STS-STS_TP'].length; i++) {
      links.push(equipments['STS-STS_TP'][i]);
    }
    for (let i = 0; i < equipments['STS_VES'].length; i++) {
      equipments['STS_VES'][i].source =
        equipments['STS_VES'][i].source.toString();
      equipments['STS_VES'][i].target =
        equipments['STS_VES'][i].target.toString();
      links.push(equipments['STS_VES'][i]);
    }
    for (let i = 0; i < equipments['AGV-STS_TP'].length; i++) {
      links.push(equipments['AGV-STS_TP'][i]);
    }
    for (let i = 0; i < equipments['AGV-ASC_S_TP'].length; i++) {
      links.push(equipments['AGV-ASC_S_TP'][i]);
    }
    for (let i = 0; i < equipments['ASC_S-ASC_S_TP'].length; i++) {
      links.push(equipments['ASC_S-ASC_S_TP'][i]);
    }
    for (let i = 0; i < equipments['ASC_L-YARD'].length; i++) {
      equipments['ASC_L-YARD'][i].lineStyle = {
        width: 3,
        color: 'black',
      };
      links.push(equipments['ASC_L-YARD'][i]);
    }
    for (let i = 0; i < equipments['ASC_S-YARD'].length; i++) {
      equipments['ASC_S-YARD'][i].lineStyle = {
        width: 3,
        color: 'black',
      };
      links.push(equipments['ASC_S-YARD'][i]);
    }
    for (let i = 0; i < equipments['ASC_L_TP-TRUCK'].length; i++) {
      links.push(equipments['ASC_L_TP-TRUCK'][i]);
    }
    for (let i = 0; i < equipments['ASC_L-ASC_L_TP'].length; i++) {
      links.push(equipments['ASC_L-ASC_L_TP'][i]);
    }
    for (let i = 0; i < equipments['ASC_L-ASC_S_TP'].length; i++) {
      links.push(equipments['ASC_L-ASC_S_TP'][i]);
    }

    let categories = [];
    for (let i of legendData) {
      categories.push({
         name: i.name,//与图例绑定
         symbol:i.icon,
         symbolSize:[i.symbolSize,i.symbolSize * i.proportion],
         itemStyle:{
           borderColor:'black',
           color:i.itemStyle.color,
         }
       });
    }

    links.forEach((el) => {
      (el.emphasis = {
        lineStyle: {
          color: 'black',
        },
      }),
        (el.tooltip = {
          show: true,
          formatter: function (params) {
            const data = params.data;
            let str = '';
            for (let key in data) {
              if (key == 'emphasis' || key == 'tooltip') continue;
              str += key + ':' + data[key] + '<br/>';
            }
            return str;
          },
        });
    });

    return {
      // title: {
      //   text: '首页'
      // },
      legend: [
        {
          data: legendData,
          top: '4%',
          textStyle: {
            color: '#1FC3CE',
            fontSize: 14,
          },
        },
      ],
      grid: {
        x: 50,
        y: 50,
        x2: 50,
        y2: 60,
      },
      tooltip: {},
      series: [
        {
          name: '设备',
          type: 'graph',
          layout: 'none',
          categories: categories,
          data: nodes,
          links: links,
          roam: true,
          label: {
            show: false,
            position: 'right',
            //formatter: '{a}'
          },
          labelLayout: {
            hideOverlap: true,
          },
          // selectedMode: "multiple",
          scaleLimit: {
            min: 0.4,
            max: 2,
          },
          lineStyle: {
            color: 'lightblue',
            width: 1,
            curveness: 0.3,
          },
          // emphasis: {
          //   focus: 'adjacency',
          //   itemStyle: {
          //   },
          //   lineStyle: {
          //       width: 3,
          //       color:'black'
          //   }
          // },
        },
      ],
    };
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
    //
    if (!this.myChart) {
      return;
    }
    const option = this.getOption();
    this.myChart.setOption(option);
  }

  render() {
    return <div id="main" style={{ minHeight: '550px' }}></div>;
  }
}

export default OrderChart;
