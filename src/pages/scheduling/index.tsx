import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import './index.less';

export interface PersonList {
	type: number;
	name: string;
	username: string;
}

export interface RootObject {
	id: number;
	year: number;
	month: number;
	day: number;
	personList: PersonList[];
}

const getListData = (value: Moment) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Moment) => {
  if (value.month() === 8) {
    return 1394;
  }
};

export default () => {
  const [data, setData] = useState<RootObject[]>([]);


  useEffect(() => {
    axios.post('/scheduling/list', {})
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data);
        }
      })
  }, [])

  const monthCellRender = (value: Moment) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Moment) => {
    const listData = getListData(value);
    const personList = data.find(item => item.year === value.year() && item.month === value.month() + 1 && item.day === value.date())?.personList;
    console.log(value.year(), value.month() + 1, value.day(), personList)
    return (
      <ul className="events">
        {personList?.map(item => (
          <li key={item.username}>
            <Badge color='red' text={item.name} />
          </li>
        ))}

      </ul>
    );
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} mode='month'
        onChange={
          (date) => {
            console.log(date.year(), date.month() + 1, date.day(), date.date())
          }
        }
      />
      <a
        key="a"
        style={{
          position: 'absolute',
          top:90,
          right:350,
          zIndex: 9999
        }}
        onClick={() => {
          // action?.startEditable(row.username);
        }}
      >
        编辑
      </a>
    </>
  );
};

