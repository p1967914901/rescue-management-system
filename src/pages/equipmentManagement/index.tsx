import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Tag, Affix, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from '../../utils/axios';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Form } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Random } from 'mockjs';
import getTimeFormat from '@/utils/getTimeFormat';
import { ModalForm, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { IRouteComponentProps, history, useLocation } from 'umi';
import Modal from './Modal';


export interface EquipInfoItemType {
	id: number;
	type: string;
	name: string;
  status: string;
	reason: string;
	createTime: string;
  key?: number;
}

type DataIndex = keyof EquipInfoItemType;

const equips = {
  '照明设备': ['照明车', '手电筒', '灯具及配件'],
  '通信设备': ['对讲机'],
  '医疗设备': ['担架', '酒精', '防护服', '夹板', '医疗口罩', '放毒面具', '医疗包', '急救药箱'],
  '水上救援设备': ['皮划艇', '马达', '发动机', '快艇', '救生衣'],
  '特殊设备': ['运输车', '探测仪', '无人机'],
  '消防设备': ['灭火器', '铁锹', '锤子', '消防栓扳手', '撬棍', '斧子'],
  '基础设备': ['五金工具箱', '安全梯', '便携雨衣', '喇叭', '水桶', '反光背心', '布手套', '一次性手套', '毛巾', '安全标志牌']
};

export default () => {
  const [data, setData] = useState<EquipInfoItemType[]>([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [pieModalVisit, setPieModalVisit] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [form] = Form.useForm<EquipInfoItemType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [equipDetail, setEquipDetail] = useState({
    id: 0,
    type: '',
    name: '',
    status: '',
    reason: '',
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<EquipInfoItemType> => ({
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

  const columns: ColumnsType<EquipInfoItemType> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      // render: (text) => <Tag color={ text === '收入' ? '#87d068' : '#f50' }>{ text }</Tag>,
      filterSearch: true,
      width: 120,
      filters: Object.keys(equips).map(v => ({value: v, text: v})),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '设备',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      filterSearch: true,
      filters: filteredInfo,
      onFilter: (value, record) => record.name === value,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (text) => <Tag color={ text === '在库' ? '#87d068' : (text === '维修' ? '#f50' : '#2db7f5' ) }>{ text }</Tag>,
      filterSearch: true,
      filters: [
        { value: '在库', text: '在库' },
        { value: '维修', text: '维修' },
        { value: '使用中', text: '使用中' },

      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ...getColumnSearchProps('reason') as any

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
              await setEquipDetail(record as any);
              setModalVisit(true);
            }
          }>编辑</a>
          <Popconfirm
            title="请确认是否删除"
            // description=""
            onConfirm={
              async() => {
                console.log(record)
                const res = await axios.post('/equip/delete', record);
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

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== 'login' && !localStorage.length) {
      history.push('/login')
    }
  }, []);
  useEffect(() => {
    axios.post('/equip/list', {})
      .then(res => {
        setData(res.data.data.map((v:EquipInfoItemType) => ({...v, key: v.id})).sort((a:EquipInfoItemType, b:EquipInfoItemType) => b.id - a.id));
      })
  }, []);

  useEffect(() => {
    const arr = [{ label: '在库', color: '#97ce74', value: 0 }, { label: '使用中', color: '#5bb4ef', value: 0 }, { label: '损坏', color: '#ec622b', value: 0 }];
    const labels = ['在库', '使用中', '维修'];
    for(const item of data) {
      arr[labels.indexOf(item.status)].value ++;
    }
    for(const item of arr) {
      item.value /= data.length;
      item.value *= 100;
      item.value = parseFloat(item.value.toFixed(2));
    }
    arr[2].value = 100 - arr[0].value - arr[1].value;
    arr[2].value = parseFloat(arr[2].value.toFixed(2))
    setStatistics(arr);
  }, [data]);
  const labels = ['在库', '使用中', '维修'];

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
            const record:EquipInfoItemType = {
              id: data[0].id + 1,
              type: '',
              name: '',
              reason: '',
              status: '',
              createTime: getTimeFormat(),
            }
            record.key = record.id;
            await setEquipDetail(record as any);
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
          statistics.map((item, index) => (
            <div style={{
              width: '300px',
              display: 'inline-block',
              marginRight: '30px'
            }}>
              { labels[index] }
              <Progress percent={item.value} format={(percent) => (percent! * data.length / 100).toFixed(0)} strokeColor={item.color}/>

            </div>
          ))
        }
      </div>
      <Table  columns={columns} dataSource={data}
        onChange={
          (pagination, filters) => {
            // console.log(filters);
            if (filters.type?.length) {
              setFilteredInfo((filters.type as any).map((name:string) => equips[name as '照明设备'].map(s => ({value: s, text: s}))).flat(Infinity) as any);
            }
          }
        }
      />
      <ModalForm<EquipInfoItemType>
        title={action}
        // form={form as any}
        initialValues={{
          ...equipDetail
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
          const record = {...values, id: equipDetail.id};
          if(typeof record.type !== 'string') {
            record.type = (record.type as any).value;
            record.name = (record.name as any).value;
            record.status = (record.status as any).value;
          }

          // const record.
          if (action === '新增') {
            const res = await axios.post('/equip/insert', record);
            if (res.status === 200) {
              console.log(res.data.data)
              res.data.data.key = res.data.data.id;
              await setData([res.data.data, ...data]);
              message.success('添加成功');
            }
          } else {
            record.id = equipDetail.id;
            const res = await axios.post('/equip/update', record);
            if (res.status === 200) {
              record.key = record.id;
              // console.log(record, data);
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
            ...equipDetail,
            // tag: {label: detailData['tag'], value: detailData['tag']}
          }}
          // onChange={(e) => console.log(e)}
          onValuesChange={(_, values) => {
            console.log(_);
            setEquipDetail(values as any);
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

            options={Object.keys(equips).map(s => ({value: s, label: s}))}
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          />
          <ProFormSelect
            width='sm'
            fieldProps={{
              labelInValue: true,
            }}
            dependencies={['type']}
            request={async (param) => {
              const { type } = param;
              return equips[type?.value as '基础设备'].map(s => ({value: s, label: s}))
            }}
            name="name"
            label="设备"
            rules={[{ required: true, message: '请选择设备' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}

            options={[
              {value: '在库', label: '在库'},
              {value: '损坏', label: '损坏'},
              {value: '使用中', label: '使用中'},
            ]}
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          />
          <ProFormDatePicker name="createTime" label="时间"
            rules={[{ required: true, message: '请填写时间' }]}
          />
        </ProForm.Group>
        <ProFormTextArea
          width="xl"
          label="原因"
          name="reason"
          fieldProps={{
            autoSize: true
          }}
          rules={[{ required: true, message: '请填写原因' }]}
        />
      </ModalForm>
      {pieModalVisit && <Modal data={data} pieModalVisit={pieModalVisit} setPieModalVisit={setPieModalVisit} />}

    </>
  )
}
