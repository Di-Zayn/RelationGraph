import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

function formatterHover(params) {
  if (params.data.type == 'hidden') {
    return '';
  }
  var str = '';
  var keylist = Object.keys(params.data.info);

  for (let i = 0; i < keylist.length; ++i) {
    if (
      keylist[i].indexOf('WI') == -1 ||
      params.data.info[keylist[i]] == null
    ) {
      str +=
        '<div>' + keylist[i] + ': ' + params.data.info[keylist[i]] + '</div>';
    } else {
      str +=
        '<div>' +
        keylist[i] +
        ': <a onclick="">' +
        params.data.info[keylist[i]] +
        '</a></div>';
    }
  }
  return str;
}

class ErrorTree extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  getOption() {
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        enterable: true, //鼠标是否可进入提示框浮层中
        formatter: formatterHover, //修改鼠标悬停显示的内容
      },
      series: [
        {
          type: 'tree',
          orient: 'vertical',
          id: 0,
          name: 'tree1',
          data: [this.props.trace],

          top: '5%',
          left: '0%',
          bottom: '5%',
          right: '0%',

          symbolSize: 15,

          edgeShape: 'polyline',
          edgeForkPosition: '50%',
          initialTreeDepth: -1,

          lineStyle: {
            width: 2,
          },

          label: {
            backgroundColor: '#fff',
            position: 'right',
            verticalAlign: 'right',
            align: 'left',
          },

          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },

          emphasis: {
            focus: 'ancestor',
          },

          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };
  }

  render() {
    return (
      <ReactEcharts
        option={this.getOption()}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: '100%', height: '550px' }}
      />
    );
  }
}

export default ErrorTree;
