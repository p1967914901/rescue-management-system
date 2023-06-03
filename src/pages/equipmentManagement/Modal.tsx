import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as echarts from 'echarts';
import { ModalForm } from '@ant-design/pro-components';



export default (props:any) => {
  const { data, pieModalVisit, setPieModalVisit } = props;

  useEffect(()=> {
    const tree = [{
      name: '在库',
      value: 0,
      children: [{ name: 0, value: 0}]
    }, {
      name: '使用中',
      value: 0,
      children: [{ name: 0, value: 0}]
    }, {
      name: '维修',
      value: 0,
      children: [{ name: 0, value: 0}]
    }];
    const status = ['在库', '使用中', '维修'];
    for(const item of data) {
      const ite = tree[status.indexOf(item.status)];
      ite['value'] ++;
      ite['children'][0]['name'] ++;
      ite['children'][0]['value'] ++;

    }

    type EChartsOption = echarts.EChartsOption;
    const chartDom = document.getElementById('pie');
    // console.log(chartDom)
    const myChart = echarts.init(chartDom as any);
    const option: EChartsOption = {
      series: {
        type: 'sunburst',
        data: tree,
        radius: [60, '90%'],
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2
        },
        levels: [{}, {
          r0: '45%',
          r: '75%',
          itemStyle: {
            borderWidth: 2
          },
          label: {
            // rotate: 'tangential'
          }
        },{
          r0: '75%',
          r: '75%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false
          },
          itemStyle: {
            borderWidth: 3
          }
        }]
        // label: {
        //   show: false
        // }
      }
    };
    option && myChart.setOption(option as any);
  }, []);

  return (
    <ModalForm
      title={'概览'}
      onOpenChange={setPieModalVisit}
      open={pieModalVisit}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
        width: 600,
        style: {
          // height: '300px'
          width: '300px'
        }
      }}
      submitTimeout={2000}
      submitter={false}
      style={{
        top: 0
      }}
    >
      <div id='pie' style={{
      // width: '300px',
      height: '500px',
      // backgroundColor: 'red'
      }}>

      </div>
    </ModalForm>
  )
}
