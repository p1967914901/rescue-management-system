import { DownOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Badge, Dropdown, Space, Table, Tag, Modal, Rate } from 'antd';
import axios from '../../utils/axios';
import React, { useState, useEffect, useRef } from 'react';

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
import compareTime from '@/utils/compareTime';

const { confirm } = Modal;

export interface Participant {
	name: string;
	username: string;
	gender: number;
	phone: string;
	isSure: string;
  key?: React.Key;
}
interface EquipmentItemType {
  id: number;
  name: string;
}

export interface RootObject {
	id: number;
	activityType: string;
  status: string;
	reporterName: string;
	reporterPhone: string;
	reporterAddress: string;
	equipments: EquipmentItemType[];
	activityAddress: string;
	fund: number;
	duration: number;
	userNumRequired: number;
	skillRequired: string;
	createTime: string;
	endTime: string;
  detail: string;
	participants: Participant[];
  key?: React.Key;
}

type DataIndex = keyof RootObject;

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<RootObject[]>([]);
  const [action, setAction] = useState<'新增' | '编辑'>('新增');
  const [form] = Form.useForm<RootObject>();
  const [modalVisit, setModalVisit] = useState(false);
  const [detail, setDetail] = useState<RootObject>({
    "id": 99999,
    "activityType": "应急救援",
    "status": "进行中",
    "reporterName": "",
    "reporterPhone": "",
    "reporterAddress": "",
    "equipments": [],
    "activityAddress": "",
    "fund": 0,
    "duration": 1,
    "userNumRequired": 1,
    "skillRequired": "",
    "createTime": getTimeFormat('yyyy-MM-dd HH:mm'),
    "endTime": getTimeFormat('yyyy-MM-dd HH:mm'),
    'detail': '',
    "participants": []
  });
  // const [value, setValue] = useState(0);
  const rate = useRef<any>({});

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const expandedRowRender = (record:any) => {
    // console.log('record', record)
    const columns: TableColumnsType<Participant> = [
      { title: '救援人', dataIndex: 'name', key: 'name' },
      { title: '用户名', dataIndex: 'username', key: 'username' },
      { title: '性别', dataIndex: 'gender', key: 'gender', render: (text) => text === 1 ? '男' : '女' },
      { title: '电话号码', dataIndex: 'phone', key: 'phone' },
      { title: '是否确认', dataIndex: 'isSure', key: 'isSure', render: (text) => <Tag color={text === '确认' ? '#87d068' : '#f50'}>{text}</Tag> },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (value, r) => (
          <Space size="middle">
            <a onClick={
              async () => {
                console.log(value, record, r);
                const res = await axios.post('/activity/rematch', {...record, p: r});
                const newP = res.data.data;
                const newRecord = JSON.parse(JSON.stringify(record));
                newRecord.participants = record.participants.map((item:any) => {
                  return item.username === r.username ? newP : item;
                });
                console.log('res', newP)
                setDataSource(dataSource.map(item => item.id === newRecord.id ? newRecord : item));
              }
            }>
              重新匹配
            </a>
            <a onClick={
              async () => {
                console.log(value, record, r);
                if (r.isSure === '确认') {
                  message.warn('已确认，请勿重复确认');
                } else {
                  const res = await axios.post('/activity/sure', {...record, p: r});
                  r.isSure = '确认';
                  setDataSource([...dataSource]);
                }
              }
            }>
              确认
            </a>
          </Space>
        ),
      },
    ];

    if (localStorage.getItem('role') !== '0') {
      columns.pop();
    }

    return <Table columns={columns} dataSource={record.participants} pagination={false} />;
  };

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<RootObject> => ({
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

  const colors = [
    'geekblue', 'blue', 'purple', 'green', 'gold', 'orange', 'volcano', 'red', 'magenta'
  ];

  const types = ['应急救援', '社会救助', '社会培训', '宣讲演练', '其他'];
  const desc = ['非常糟糕', '差劲', '普通', '很好', '完美'];

  const columns: TableColumnsType<RootObject> = [
    {
      title: '类型',
      dataIndex: 'activityType',
      key: 'activityType',
      render: (text) => <Tag color={colors[types.indexOf(text)]}>{ text }</Tag>,
      filterSearch: true,
      width: 120,
      filters: ['应急救援', '社会救助', '社会培训', '宣讲演练', '其他'].map(v => ({value: v, text: v})),
      onFilter: (value, record) => record.activityType === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={text === '进行中' ? '#f50' : (text === '未开始' ? '#2db7f5' : '#87d068')}>{ text }</Tag>,
      filterSearch: true,
      width: 120,
      filters: ['进行中', '未开始', '已结束'].map(v => ({value: v, text: v})),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '求救人姓名',
      dataIndex: 'reporterName',
      key: 'reporterName',
      width: 120,
      ...getColumnSearchProps('reporterName') as any
    },
    {
      title: '求救人电话',
      dataIndex: 'reporterPhone',
      key: 'reporterPhone',
      width: 130,
      ...getColumnSearchProps('reporterPhone') as any
    },
    {
      title: '求救人地址',
      dataIndex: 'reporterAddress',
      key: 'reporterAddress',
      width: 180,
      ...getColumnSearchProps('reporterAddress') as any
    },
    {
      title: '所需设备',
      key: 'equipments',
      dataIndex: 'equipments',
      width: 180,
      render: (equipments) => {
        // console.log(equipments)
        return (
          <Space size={[0, 8]} wrap>
            {
              equipments.map((item:EquipmentItemType) => <Tag key={item.id} color='cyan' >{item.name}</Tag>)
            }
          </Space>
        )
      }
    },
    {
      title: '目的地',
      dataIndex: 'activityAddress',
      key: 'activityAddress',
      width: 180,
      ...getColumnSearchProps('activityAddress') as any
    },
    {
      title: '经费',
      dataIndex: 'fund',
      key: 'fund',
      width: 80,
      sorter: (a:RootObject, b:RootObject) => b.fund - a.fund,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      sorter: (a:RootObject, b:RootObject) => b.duration - a.duration,
    },
    {
      title: '所需人数',
      dataIndex: 'userNumRequired',
      key: 'userNumRequired',
      width: 120,
      sorter: (a:RootObject, b:RootObject) => b.userNumRequired - a.userNumRequired,
    },
    {
      title: '所需技能',
      dataIndex: 'skillRequired',
      key: 'skillRequired',
      width: 150,
      ...getColumnSearchProps('skillRequired') as any
    },
    {
      title: '开始时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 180,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      width: 180,
      sorter: (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={
            async () => {
              // await form.resetFields(Object.keys(detail));
              console.log(record)
              await setAction('编辑');
              const r = {...record};
              r.equipments = r.equipments.map(item => ({...item, value: item.id, label: item.name}))
              await setDetail(r);
              setModalVisit(true);
            }
          }>编辑</a>
          <Popconfirm
            title="请确认是否删除"
            // description=""
            onConfirm={
              async() => {
                const res = await axios.post('/activity/delete', record);
                if (res.status === 200) {
                  message.success('删除成功');
                }
                setDataSource(dataSource.filter(item => item.id !== record.id))
              }
            }
            // onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          {record.status === '进行中' && <a onClick={
            async () => {
              const { participants } = record;
              const arr = ['总体', ...participants.map(v => v.name)];
              rate.current = arr.reduce((pre, cur) => {
                (pre as any)[cur] = 0;
                return pre;
              }, {});
              confirm({
                title: '对本次任务完成情况的评价',
                // icon: <ExclamationCircleFilled />,
                content: <span>
                  {
                    arr.map(value => (
                      <div>
                        <span className="ant-rate-text">{value}： </span>
                        <Rate tooltips={desc} onChange={(v) => rate.current[value] = v}  />
                      </div>
                    ))
                  }

                </span>,
                onOk: async () => {
                  const res = await axios.post('/activity/finish', {...record, rate: rate.current});
                  if (res.status === 200) {
                    message.success('结项成功');
                  }
                  record.status = '已结束';
                  setDataSource(dataSource.map(item => item.id !== record.id ? item : record))
                },
                onCancel() {
                  console.log('Cancel');
                },
              });

            }
          }>
            结束
          </a>}
        </Space>
      ),
    },
  ];

  if (localStorage.getItem('role') !== '0') {
    columns.pop();
  }

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '.login' && !localStorage.length) {
      history.push('/login')
    }
  }, []);

  useEffect(() => {
    axios.post('/activity/list', {})
      .then(res => {
        if (res.status === 200) {
          setDataSource(res.data.data.map((v:any) => ({...v, key: v.id})).sort((a:RootObject, b:RootObject) => b.id - a.id));
        }
      })
  }, []);

  return (
    <>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        scroll={{ x: 1500, y: 520 }}

      />
      <Button type='primary' style={{
      position: 'absolute',
      top: 20,
      right: 40,
    }} onClick={
      async () => {
        setModalVisit(true);
        setAction('新增');
      }
    }>
      新增
    </Button>
    <ModalForm<RootObject>
        title={action}
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
          const record = values;
          // console.log('r', JSON.parse(JSON.stringify(record)))
          for(let i = 0; i < record.equipments.length; i++) {
            if(typeof record.equipments[i] !== 'string') {
              record.equipments[i] = {
                id: (record.equipments[i] as any).value,
                name: (record.equipments[i] as any).label
              }
            }
          }
          record.equipments = record.equipments.map(v => ({ id: v.id, name: v.name }));
          if(typeof record.activityType !== 'string') {
            record.activityType = (record.activityType as any).value;
          }
          const now = getTimeFormat('yyyy-MM-dd HH:mm');
          record.status = compareTime(record.createTime, now) <= 0 ? '进行中' : '未开始';
          console.log(record);
          // return;
          if (action === '新增') {
            const res = await axios.post('/activity/insert', record);
            if (res.status === 200) {
              console.log(res.data.data);
              res.data.data.key = res.data.data.id;
              await setDataSource([res.data.data, ...dataSource]);
              message.success('添加成功');
            }
          } else {
            record.id = detail.id;
            record.participants = detail.participants;
            console.log(record)
            const res = await axios.post('/activity/update', record);
            if (res.status === 200) {
              console.log(res.data.data);
              record.key = record.id;
              setDataSource(dataSource.map(item => item.id === record.id ? record : item));
              message.success('编辑成功');
            }
          }
          return true;
        }}
      >
        <ProForm
          submitter={false}
          initialValues={{
            ...detail,
            // tag: {label: detailData['tag'], value: detailData['tag']}
          }}
          // onChange={(e) => console.log(e)}
          onValuesChange={(_, values) => {
            console.log(_, values);
            setDetail(values as any);
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

              options={['应急救援', '社会救助', '社会培训', '宣讲演练', '其他'].map(s => ({value: s, label: s}))}
              name="activityType"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            />
            <ProFormText name='reporterName' label='求救人姓名' width="xs" rules={[{ required: true, message: '输入求救人姓名' }]}/>
            <ProFormText name='reporterPhone' label='求救人电话' rules={[{ required: true, message: '输入求人电话' }]}/>
            <ProFormText name='reporterAddress' label='求救人地址' rules={[{ required: true, message: '输入求救人地址' }]}/>
            <ProFormText name='activityAddress' label='目的地' rules={[{ required: true, message: '输入目的地' }]}/>
            <ProFormDigit label="经费" name="fund" width="xs" min={0} max={1000} />
            <ProFormDigit label="时长" name="duration" width="xs" min={1} max={24} />
            <ProFormDigit label="所需人数" name="userNumRequired" width="xs" min={1} max={10} />
            <ProFormText name='skillRequired' label='所需技能' />
            <ProFormDateTimePicker
              name="createTime"
              label="开始时间"
              fieldProps={{
                format: (value) => value.format('YYYY-MM-DD HH:mm'),
              }}
            />
            <ProFormDateTimePicker
              name="endTime"
              label="结束时间"
              fieldProps={{
                format: (value) => value.format('YYYY-MM-DD HH:mm'),
              }}
            />
            <ProFormSelect.SearchSelect
              width='xl'
              fieldProps={{
                labelInValue: true,
                mode: 'multiple'
              }}
              request={async () => {
                const res = await axios.post('/equip/list', {});
                return res.data.data.filter((item:any) => item.status === '在库').map((v:any) => ({...v, value: v.id, label: v.type + '/' + v.name}))
              }}
              name="equipments"
              label="所需设备"
            />
          </ProForm.Group>

          <ProFormTextArea
            width="xl"
            label="详情"
            name="detail"
            fieldProps={{
              autoSize: true
            }}
            rules={[{ required: true, message: '请填写原因' }]}
          />

      </ModalForm>

    </>
  );
};

export default App;
