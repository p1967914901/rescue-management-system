import { ProDescriptions } from '@ant-design/pro-components';
import { Select, message } from 'antd';
import axios from '../../utils/axios';
import { useState, useEffect } from 'react';


export interface PersonalInfoItem {
  id: number;
	name: string;
	username: string;
	gender: number;
	phone: string;
	birthday: string;
	idNo: string;
	workingSeniority: number;
	conditions: number;
	job: string;
	workPlace: string;
	skill: string;
	grade: number;
	state: number;
	isLeave: number;
	reason: string;
	password: string;
	createTime: string;
}

export default () => {

  const [data, setData] = useState<PersonalInfoItem>({
    name: '', //
    username: '', //
    id: 9,
    gender: 0, //
    phone: '', //
    birthday: '', //
    idNo: '', //
    workingSeniority: 0,
    conditions: 1,
    job: '',
    workPlace: '',
    skill: '',
    grade: 1,
    state: 1,
    isLeave: 0,
    reason: '',
    password: '',
    createTime: '',
  });
  // const [columns, setColumns] = useState([]);

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('user') as string));
  }, []);

  return (
    <ProDescriptions
      bordered
      dataSource={data}
      editable={{
        onSave: async (key, record) => {
          console.log(key, record);
          setData(record);
          localStorage.setItem('user', JSON.stringify(record));
          const res = await axios.post('/user/update', record)
          message.success('修改成功');
        }
      }}
      columns={[
        {
          title: '名字',
          key: 'name',
          dataIndex: 'name',
          copyable: false,
          ellipsis: true,
        },
        {
          title: '用户名',
          key: 'username',
          dataIndex: 'username',
          copyable: true,
          editable: false,
        },
        {
          title: '出生日期',
          key: 'birthday',
          dataIndex: 'birthday',
          valueType: 'date',
        },
        {
          title: '性别',
          key: 'gender',
          dataIndex: 'gender',
          copyable: false,
          renderText: (text) => (text === 1 ? '男' : '女'),
          renderFormItem: () => {
            return <Select options={[
              { value: 1, label: '男' },
              { value: 0, label: '女' },
            ]} />
          }
        },
        {
          title: '电话号码',
          key: 'phone',
          dataIndex: 'phone',
          copyable: true,
        },
        {
          title: '身份证号',
          key: 'idNo',
          dataIndex: 'idNo',
          copyable: true,
        },
        {
          title: '工作年限',
          key: 'workingSeniority',
          dataIndex: 'workingSeniority',
          copyable: false,
          valueType: 'digit'
        },
        {
          title: '身体状况',
          key: 'conditions',
          dataIndex: 'conditions',
          renderText: (text) => (text === 0 ? '一般' : ( text === 1 ? '健康' : '带伤')),
          renderFormItem: () => {
            return <Select options={[
              { value: 1, label: '健康' },
              { value: 0, label: '一般' },
              { value: 2, label: '带伤' },

            ]} />
          }
        },
        {
          title: '工作单位',
          key: 'workPlace',
          dataIndex: 'workPlace',
        },
        {
          title: '职业',
          key: 'job',
          dataIndex: 'job',
        },{
          title: '技能',
          key: 'skill',
          dataIndex: 'skill',
        },{
          title: '级别',
          key: 'grade',
          dataIndex: 'grade',
          renderText: (text) => (text === 0 ? '队长' : '队员'),
          editable: false,
        },{
          title: '状态',
          key: 'state',
          dataIndex: 'state',
          renderText: (text) => (text === 0 ? '在岗' : ( text === 1 ? '出任务' : '忙碌')),
          renderFormItem: () => {
            return <Select options={[
              { value: 1, label: '出任务' },
              { value: 0, label: '在岗' },
              { value: 2, label: '忙碌' },

            ]} />
          }
        },{
          title: '密码',
          key: 'password',
          dataIndex: 'password',
        },{
          title: '注册时间',
          key: 'createTime',
          dataIndex: 'createTime',
          editable: false,
        }
      ]}

    >
    </ProDescriptions>
  );
};
