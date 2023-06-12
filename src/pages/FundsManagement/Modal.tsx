import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as echarts from 'echarts';
import { ModalForm } from '@ant-design/pro-components';



export default (props:any) => {
  const { data, pieModalVisit, setPieModalVisit } = props;

  useEffect(()=> {
    const tree = [{
      name: '收入',
      children: [
        { name: '政府下拨', value: 0 }, { name: '企业捐助', value: 0 }, { name: '个人自筹', value: 0 }, { name: '其他', value: 0 }
      ]
    }, {
      name: '支出',
      children: [
        { name: '办公支出', value: 0 }, { name: '购买设备', value: 0 }, { name: '培训费用', value: 0 },
        { name: '购买服务', value: 0 }, { name: '其他', value: 0 }
      ]
    }];
    for(const item of data) {
      const children = tree[item.type === '收入' ? 0 : 1].children;
      for(const child of children) {
        if (child.name === item.track) {
          child.value += item.num;
          break;
        }
      }
    }
    for(const tr of tree) {
      const children = tr['children'];
      for(const child of children) {
        (child as any)['children'] = [{ name: child.value, value: child.value }]
      }
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
          r0: '15%',
          r: '35%',
          itemStyle: {
            borderWidth: 2
          },
          label: {
            // rotate: 'tangential'
          }
        },{
          r0: '35%',
          r: '75%',
          itemStyle: {
            borderWidth: 2
          },
          label: {
            // rotate: 'tangential'
          }
        },{
          r0: '75%',
          r: '77%',
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
      title={'经费管理概览'}
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
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '70px',
        fontWeight: 'bold'
      }}>单位：元</div>
    </ModalForm>
  )
}
