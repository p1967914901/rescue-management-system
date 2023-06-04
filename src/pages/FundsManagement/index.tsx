import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from '../../utils/axios';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Form, Progress } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Random } from 'mockjs';
import getTimeFormat from '@/utils/getTimeFormat';
import { ModalForm, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import Modal from './Modal';


export interface FundsInfoItemType {
	id: number;
	type: string;
	track: string;
  num: number;
	detail: string;
	createTime: string;
  key?: number;
}

type DataIndex = keyof FundsInfoItemType;


export default () => {
  const [data, setData] = useState<FundsInfoItemType[]>([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [form] = Form.useForm<FundsInfoItemType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [pieModalVisit, setPieModalVisit] = useState(false);
  const [fundDetail, setFundDetail] = useState({
    id: 0,
    type: '',
    track: '',
    num: 0,
    detail: '',
    createTime: getTimeFormat(),
    key: 0,
  })
  const [action, setAction] = useState<'新增' | '编辑'>('新增');
  const [statistics, setStatistics] = useState<{
    label: string;
    color: string;
    value: number;
  }[]>([]);
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<FundsInfoItemType> => ({
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

  const columns: ColumnsType<FundsInfoItemType> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <Tag color={ text === '收入' ? '#87d068' : '#f50' }>{ text }</Tag>,
      filterSearch: true,
      filters: [
        { value: '收入', text: '收入' },
        { value: '支出', text: '支出' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '来源/用途',
      dataIndex: 'track',
      key: 'track',
      width: 120,
      filterSearch: true,
      filters: ['政府下拨', '企业捐助', '个人自筹', '购买服务', '办公支出', '购买设备', '培训费用', '团建费用', '其他'].map(s => ({value: s, text: s})),
      onFilter: (value, record) => record.track === value,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      ...getColumnSearchProps('detail') as any

    },
    {
      title: '金额',
      key: 'num',
      dataIndex: 'num',
      width: 100,
      sorter: (a, b) => a.num - b.num,
    },
    {
      title: '时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 130,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={
            async () => {
              await setAction('编辑');
              await setFundDetail(record as any);
              setModalVisit(true);
            }
          }>编辑</a>
          <Popconfirm
            title="请确认是否删除"
            // description=""
            onConfirm={
              async() => {
                const res = await axios.post('/fund/delete', record);
                if (res.status === 200) {
                  message.success('删除成功');
                }
                setData(data.filter(item => item.id !== record.id))
              }
            }
            // onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  if (localStorage.getItem('role') !== '0') {
    columns.pop();
  }

  useEffect(() => {
    axios.post('/fund/list', {})
      .then(res => {
        setData(res.data.data.map((v:FundsInfoItemType) => ({...v, key: v.id})).sort((a:FundsInfoItemType, b:FundsInfoItemType) => b.id - a.id));
      })
  }, []);

  useEffect(() => {
    const arr = [{ label: '收入', color: '#87d068', value: 0 }, { label: '支出', color: '#f50', value: 0 }];
    const labels = ['收入', '支出'];
    for(const item of data) {
      arr[labels.indexOf(item.type)].value += item.num;
    }
    setStatistics(arr);
  }, [data]);

  return (
    <>
    <div style={{
        // backgroundColor: 'red'
      }}>
        {localStorage.getItem('role') === '0' && <Button type='primary' style={{
          float: 'right'

          // position: 'absolute',
          // top: 40,
          // right: 50,
        }} onClick={
          async () => {
            await setAction('新增');
            const record:FundsInfoItemType = {
              id: data[0].id + 1,
              type: '',
              track: '',
              num: 0,
              detail: '',
              createTime: getTimeFormat(),
            }
            record.key = record.id;
            await setFundDetail(record as any);
            setModalVisit(true);
            // axios.post('/fund/insert', record)
            //   .then(res => {
            //     if (res.status === 200) {
            //       message.success('新增成功');
            //     }
            //   })
          }
        }>
          新增
        </Button>}
        <Button type='primary' style={{
          float: 'right',
          marginRight: '10px'
        }} onClick={() => {
          setPieModalVisit(true);
        }}>
          概览
        </Button>
        {
          statistics.map(item => (
            <div style={{
              width: '300px',
              display: 'inline-block',
              marginRight: '70px'
            }}>
              <Progress percent={item.value / (statistics[0].value + statistics[1].value) * 100} format={(percent) => (percent! * (statistics[0].value + statistics[1].value)).toFixed(0)} strokeColor={item.color}/>

            </div>
          ))
        }
      </div>
      <Table  columns={columns} dataSource={data} />
      <ModalForm<FundsInfoItemType>
        title={action}
        // form={form as any}
        initialValues={{
          ...fundDetail
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
          const record = {...values, id: fundDetail.id};
          record.type = (record.type as any)?.value;
          record.track = (record.track as any)?.value;

          // const record.
          if (action === '新增') {
            const res = await axios.post('/fund/insert', record);
            if (res.status === 200) {
              console.log(res.data.data)
              res.data.data.key = res.data.data.id;
              await setData([res.data.data, ...data]);
              message.success('添加成功');
            }
          } else {
            record.id = fundDetail.id;
            const res = await axios.post('/fund/update', record);
            if (res.status === 200) {
              record.key = record.id;
              setData(data.map(item => item.id === record.id ? record : item));
              message.success('编辑成功');
            }
          }
          return true;
        }}
      >
        <ProForm
          submitter={false}
          initialValues={{
            ...fundDetail,
            // tag: {label: detailData['tag'], value: detailData['tag']}
          }}
          // onChange={(e) => console.log(e)}
          onValuesChange={(_, values) => {
            console.log(_);
            setFundDetail(values as any);
            // form.setFieldsValue(values);
          }}
          onFinish={async (value) => console.log(value)}
          form={form}

        ></ProForm>
        <ProForm.Group>
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}

            options={[
              { label: '收入', value: '收入' },
              { label: '支出', value: '支出' },
            ]}
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            dependencies={['type']}
            request={async (param) => {
              const { type } = param;
               return (typeof type === 'string' && type === '收入') || (type?.value === '收入') ?
               ['政府下拨', '企业捐助', '个人自筹', '其他'].map(s => ({value: s, text: s})) :
               ['购买服务', '办公支出', '购买设备', '培训费用', '团建费用', '其他'].map(s => ({value: s, text: s}))
            }}
            name="track"
            label="收入/来源"
            rules={[{ required: true, message: '请选择类型' }]}
          />
          <ProFormDigit label="金额" name="num" width='sm' min={0}
            rules={[{ required: true, message: '请填写金额' }]}
          />
          <ProFormDatePicker name="createTime" label="时间"
            rules={[{ required: true, message: '请填写时间' }]}
          />
        </ProForm.Group>
        <ProFormTextArea
          width="xl"
          label="详情"
          name="detail"
          fieldProps={{
            autoSize: true
          }}
          rules={[{ required: true, message: '请填写详情' }]}
        />
      </ModalForm>
      {pieModalVisit && <Modal data={data} pieModalVisit={pieModalVisit} setPieModalVisit={setPieModalVisit} />}
    </>
  )
}
