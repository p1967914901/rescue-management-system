import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from '../../utils/axios';
import { Random } from 'mockjs';
import getTimeFormat from '@/utils/getTimeFormat';

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
  key?: string;
}

type DataIndex = keyof PersonalInfoItem;

export default () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [dataSource, setDataSource] = useState<PersonalInfoItem[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const ref = useRef<ProFormInstance>();


  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ): void => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<PersonalInfoItem> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            过滤
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record:any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    axios.post('/user/list').then(res => {
      setDataSource(res.data.data.map((v:any) => ({...v, key: v.username})).sort((a:PersonalInfoItem, b:PersonalInfoItem) => b.id - a.id));
    })
  }, []);

  return(
  <>
    <ProTable<PersonalInfoItem>
      search={false}
      columns={[
        {
          title: '姓名',
          key: 'name',
          dataIndex: 'name',
          valueType: 'text',
          width:100,
          ...getColumnSearchProps('name') as any
        },
        {
          title: '用户名',
          key: 'username',
          dataIndex: 'username',
          valueType: 'text',
          width: 180,
          readonly: true,
          ...getColumnSearchProps('username') as any
        },
        {
          title: '性别',
          key: 'gender',
          dataIndex: 'gender',
          valueType: 'select',
          width: 120,
          valueEnum: [
            {value: 0, text: '女'},
            {value: 1, text: '男'},
          ],
          filterSearch: true,
          filters: [
            {
              text: '男',
              value: 1,
            },
            {
              text: '女',
              value: 0,
            },
          ],
          onFilter: (value, record) => record.gender === value,

        },
        {
          title: '电话号码',
          key: 'phone',
          dataIndex: 'phone',
          valueType: 'text',
          width: 150,
          ...getColumnSearchProps('username') as any
        },
        {
          title: '出生日期',
          key: 'birthday',
          dataIndex: 'birthday',
          valueType: 'date',
          width: 180,// new Date(dateStr).getTime() / 1000
          sorter: (a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime(),
        },
        {
          title: '身份证号',
          key: 'idNo',
          dataIndex: 'idNo',
          valueType: 'text',
          width: 180,
          ...getColumnSearchProps('idNo') as any

        },
        {
          title: '工作年限',
          key: 'workingSeniority',
          dataIndex: 'workingSeniority',
          width: 100,
          valueType: 'digit',
          sorter: (a, b) => a.workingSeniority - b.workingSeniority
        },
        {
          title: '身体状况',
          key: 'conditions',
          dataIndex: 'conditions',
          width: 120,
          valueEnum: [
            {value: 0, text: '一般'},
            {value: 1, text: '健康'},
            {value: 2, text: '带伤'},
          ],
          filterSearch: true,
          filters: [
            {value: 0, text: '一般'},
            {value: 1, text: '健康'},
            {value: 2, text: '带伤'},
          ],
          onFilter: (value, record) => record.conditions === value,
        },
        {
          title: '工作',
          key: 'job',
          dataIndex: 'job',
          valueType: 'text',
          width: 150,
          ...getColumnSearchProps('job') as any

        },
        {
          title: '工作地点',
          key: 'workPlace',
          dataIndex: 'workPlace',
          width: 150,
          ...getColumnSearchProps('workPlace') as any
        },
        {
          title: '技能',
          key: 'skill',
          dataIndex: 'skill',
          width: 150,
          ...getColumnSearchProps('skill') as any

        },
        {
          title: '职级',
          key: 'grade',
          dataIndex: 'grade',
          width: 150,
          valueEnum: [
            { value: 0, text: '队长' },
            { value: 1, text: '队员' },
          ],
          filterSearch: true,
          filters: [
            { value: 0, text: '队长' },
            { value: 1, text: '队员' },
          ],
          onFilter: (value, record) => record.grade === value,
        },
        {
          title: '状态',
          key: 'state',
          dataIndex: 'state',
          width: 150,
          valueEnum: [
            { value: 0, text: '在岗' },
            { value: 1, text: '出任务' },
            { value: 2, text: '忙碌' },
          ],
          filterSearch: true,
          filters: [
            { value: 0, text: '在岗' },
            { value: 1, text: '出任务' },
            { value: 2, text: '忙碌' },
          ],
          onFilter: (value, record) => record.state === value,
        },
        {
          title: '是否离队',
          key: 'isLeave',
          dataIndex: 'isLeave',
          width: 120,
          valueEnum: [
            { value: 0, text: '否' },
            { value: 1, text: '是' },
          ],
          filterSearch: true,
          filters: [
            { value: 0, text: '否' },
            { value: 1, text: '是' },
          ],
          onFilter: (value, record) => record.isLeave === value,
        },
        {
          title: '原因',
          key: 'reason',
          dataIndex: 'reason',
          width: 180,
          ...getColumnSearchProps('skill') as any
        },
        {
          title: '密码',
          key: 'password',
          dataIndex: 'password',
          width: 180,
          ...getColumnSearchProps('password') as any
        },
        // {
        //   title: '时间区间',
        //   key: 'dateTimeRange',
        //   dataIndex: 'createdAtRange',
        //   valueType: 'dateTimeRange',
        //   search: {
        //     transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
        //   },
        // },
        {
          title: '操作',
          key: 'option',
          width: 130,
          valueType: 'option',
          fixed: 'right',
          render: (_, row, index, action) => [
            <a
              key="a"
              onClick={() => {
                action?.startEditable(row.username);
              }}
            >
              编辑
            </a>,
          ],
        },
      ]}
      formRef={ref}
      dataSource={dataSource}
      rowKey="key"
      headerTitle="人员管理"
      scroll={{ x: 1500, y: 450 }}
      editable={{
        type: 'single',
        editableKeys,
        onSave: async (rowKey, data) => {
          // console.log(rowKey, data, row);
          axios.post('/user/update', data)
            .then(res => {
              if (res.status === 200) {
                message.success('修改成功');
              }
            })
          setDataSource(dataSource.map(v => v.username === rowKey ? data: v));
        },
        onChange: setEditableRowKeys,
        onDelete: async (rowKey) => {
          setDataSource(dataSource.filter(v => v.username !== rowKey));
        },

      }}
    />
    <Button type='primary' style={{
      position: 'absolute',
      top: 90,
      right: 170,
    }} onClick={
      async () => {
        const record:PersonalInfoItem = {name: '', username: Random.id(), id: dataSource[0].id + 1,
          gender: 0,
          phone: '',
          birthday: getTimeFormat(),
          idNo: '',
          workingSeniority: 0,
          conditions: 1,
          job: '',
          workPlace: '',
          skill: '',
          grade: 1,
          state: 1,
          isLeave: 0,
          reason: '',
          password: Random.id().slice(0, 6),
          createTime: getTimeFormat(),
        }
        record.key = record.username;
        setDataSource([record, ...dataSource]);
        axios.post('/user/insert', record)
          .then(res => {
            if (res.status === 200) {
              message.success('新增成功');
            }
          })
      }
    }>
      新增
    </Button>
  </>
);

}
