import { Badge, Calendar, message, Form } from 'antd';
import type { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { ModalForm, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import axios from '../../utils/axios';
import './index.less';
import getTimeFormat from '@/utils/getTimeFormat';

export interface RootObject {
	id: number;
	year: number;
	month: number;
	day: number;
	name1: string;
	username1: string;
  name2: string;
	username2: string;
}

interface formType {
  time: string;
  name1: string;
	username1: string;
  name2: string;
	username2: string;
}

const getMonthData = (value: Moment) => {
  if (value.month() === 8) {
    return 1394;
  }
};

export default () => {
  const [data, setData] = useState<RootObject[]>([]);
  const [form] = Form.useForm<formType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [detail, setDetail] = useState({
    id: 0,
    time: getTimeFormat(),
    name1: '',
    username1: '',
    name2: '',
    username2: ''
  })

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
    const day = data.find(item => item.year === value.year() && item.month === value.month() + 1 && item.day === value.date());
    const personList = [{
      username: day?.username1,
      name: day?.name1,
    }, {
      username: day?.username2,
      name: day?.name2,
    }]
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
      <ModalForm<formType>
        style={{
          // zIndex: 99999999
        }}
        title={'编辑排班'}
        // form={form as any}
        initialValues={{
          ...detail
        }}
        autoFocusFirstInput
        onOpenChange={setModalVisit}
        open={modalVisit}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}

        submitTimeout={2000}
        onFinish={async (values) => {
          console.log(values);
          const [year, month, day] = values.time.split('-').map(v => parseInt(v));
          const info = { year, month, day };
          if (typeof values.name1 !== 'string') {
            (info as any).name1 = (values.name1 as any).value;
            (info as any).username1 = (values.name1 as any).username;
          } else {
            (info as any).name1 = values.name1;
            (info as any).username1 = detail.username1;
          }
          if (typeof values.name2 !== 'string') {
            (info as any).name2 = (values.name2 as any).value;
            (info as any).username2 = (values.name2 as any).username;
          } else {
            (info as any).name2 = values.name2;
            (info as any).username2 = detail.username2;
          }
          console.log(info)
          const res = await axios.post('/scheduling/update', info);
          if (res.status === 200) {
            message.success(res.data.message);
            // console.log(res.data.data)
            if(res.data.message === '编辑成功') {
              setData(data.map(item => item.year === info.year && item.month === info.month && item.day === info.day ? {...(info as any), id: item.id} : item));
            } else {
              setData([...data, res.data.data]);
            }
          }
          // const record = {...values, id: fundDetail.id};

          return true;
        }}
      >
        <ProForm
          submitter={false}
          initialValues={{
            // ...detail,
            // tag: {label: detailData['tag'], value: detailData['tag']}
          }}
          // onChange={(e) => console.log(e)}
          onValuesChange={(_, values) => {
            console.log(_, values);
            // setFundDetail(values as any);
            // form.setFieldsValue(values);
          }}
          onFinish={async (value) => console.log(value)}
          form={form}

        ></ProForm>
        <ProForm.Group>
          <ProFormDatePicker name="time" label="时间"
            rules={[{ required: true, message: '请填写时间' }]}
          />
          <ProFormSelect
            showSearch
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            request={async () => {
              const res = await axios.post('/user/list', {});
              return res.data.data.map((item:any) => ({ value: item.name, text: item.name, username: item.username }))
            }}
            name="name1"
            label="排班1"
            key='username1'
            rules={[{ required: true, message: '请选择类型' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            dependencies={['time']}
            request={async () => {
              const res = await axios.post('/user/list', {});
              return res.data.data.map((item:any) => ({ value: item.name, text: item.name, username: item.username }))
            }}
            name="name2"
            label="排班2"
            rules={[{ required: true, message: '请选择类型' }]}
          />

        </ProForm.Group>
      </ModalForm>
      {localStorage.getItem('role') === '0' && <a
        key="a"
        style={{
          position: 'absolute',
          top:90,
          right:350,
          zIndex: 9
        }}
        onClick={() => {
          setModalVisit(true);
          const [year, month, day] = getTimeFormat().split('-').map(v => parseInt(v));
          const de = {
            id: 0,
            time: getTimeFormat(),
            name1: '',
            username1: '',
            name2: '',
            username2: ''
          }
          for(const p of data) {
            if (p.year === year && p.month === month && p.day === day) {
              de.id = p.id;
              de.name1 = p.name1;
              de.username1 = p.username1;
              de.name2 = p.name2;
              de.username2 = p.username2;
              break;
            }
          }
          setDetail(de);
          // action?.startEditable(row.username);
        }}
      >
        编辑
      </a>}
    </>
  );
};

