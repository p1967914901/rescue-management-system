import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, message, Form } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from '../../utils/axios';
import { Random } from 'mockjs';
import getTimeFormat from '@/utils/getTimeFormat';
import { IRouteComponentProps, history, useLocation } from 'umi';
import { ModalForm, ProForm, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import validatePhone from '@/utils/validatePhone';
import validateIdCard from '@/utils/validateIdCard';


export interface PersonalInfoItem {
  id: number;
	name: string;
	username: string;
  advantage: string;
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
  const ref = useRef<ProFormInstance>();
  const [form] = Form.useForm<PersonalInfoItem>();
  const [action, setAction] = useState<'新增' | '编辑'>('新增');
  const [modalVisit, setModalVisit] = useState(false);
  const [detail, setDetail] = useState({
    id: 0,
    name: '',
    username: '',
    advantage: '',
    gender: 0,
    phone: '',
    birthday: getTimeFormat(),
    idNo: '',
    workingSeniority: 0,
    conditions: 0,
    job: '',
    workPlace: '',
    skill: '',
    grade: 0,
    state: 0,
    isLeave: 0,
    reason: '',
    password: '',
    createTime: getTimeFormat()
  })

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
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '.login' && !localStorage.length) {
      history.push('/login')
    }
  }, []);
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
          title: '优势',
          key: 'advantage',
          dataIndex: 'advantage',
          valueType: 'text',
          width: 100,
          readonly: true,
          ...getColumnSearchProps('advantage') as any
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
        localStorage.getItem('role') === '0' &&
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
                // console.log(row)
                setDetail(row);
                setModalVisit(true);
                setAction('编辑');
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
      // editable={false}
    />
    <ModalForm<PersonalInfoItem>
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
          onCancel: () => {
            form.resetFields();
            console.log(111)
          },
        }}

        submitTimeout={2000}
        onCanPlay={() => {
          form.resetFields();
          console.log(111)
          return true
        }}
        onFinish={async (values) => {
          console.log(values)
          const record = {...values, createTime: getTimeFormat()};

          // 检测手机号是否合法
          if (!validatePhone(record.phone)) {
            message.error('手机号不合法，请重新输入');
            return false;
          }
          // 检测身份证号是否合法
          if (!validateIdCard(record.idNo)) {
            message.error('身份证号不合法，请重新输入');
            return false;
          }

          for(const key of Object.keys(record)) {
            if (['gender', 'conditions', 'advantage', 'grade', 'state', 'isLeave'].includes(key) && !['number', 'string'].includes(typeof record[key as 'name'])) {
              record[key as 'name'] = (record[key as 'name'] as any).value;
            }
          }

          if (action === '新增') {
            const res = await axios.post('/user/insert', record);
            if (res.status === 200) {
              console.log(res.data.data)
              res.data.data.key = res.data.data.id;
              await setDataSource([res.data.data, ...dataSource]);
              message.success('添加成功');
            }
          } else {
            record.id = detail.id;
            console.log(record)
            const res = await axios.post('/user/update', record);
            if (res.status === 200) {
              record.key = record.id + '';
              // console.log(record, data);
              setDataSource(dataSource.map(item => item.id === record.id ? record : item));
              message.success('编辑成功');
            }
          }
          form.resetFields()
          return true;
        }}
      >
        {/* <ProForm
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

        > */}
        <ProForm.Group>
          <ProFormText
            width="xs"
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          />
          <ProFormText
            width="sm"
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={['应急救援', '社会救助', '社会培训', '宣讲演练', '其他'].map(s => ({value: s, label: s}))}
            name="advantage"
            label="优势"
            rules={[{ required: true, message: '请选择优势' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={[
              {value: 1, label: '男'},
              {value: 0, label: '女'},
            ]}
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          />


        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="phone"
            label="电话号码"
            rules={[{ required: true, message: '请输入电话号码' }]}
          />
          <ProFormDatePicker name="birthday" label="生日"
            rules={[{ required: true, message: '请填写生日' }]}
          />
          <ProFormText
            width="sm"
            name="idNo"
            label="身份证号"
            rules={[{ required: true, message: '请输入身份证号' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit name="workingSeniority" label="工作年限" width="xs" rules={[{ required: true, message: '请输入工作年限' }]}/>
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={[
              {value: 0, label: '一般'},
              {value: 1, label: '健康'},
              {value: 2, label: '带伤'},
            ]}
            name="conditions"
            label="身体状况"
            rules={[{ required: true, message: '请选择身体状况' }]}
          />
          <ProFormText
            width="xs"
            name="job"
            label="工作"
            rules={[{ required: true, message: '请输入工作' }]}
          />
          <ProFormText
            width="sm"
            name="workPlace"
            label="工作地点"
            rules={[{ required: true, message: '请输入工作地点' }]}
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="skill"
            label="技能"
            rules={[{ required: true, message: '请输入技能' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={[
              {value: 0, label: '队长'},
              {value: 1, label: '队员'},
            ]}
            name="grade"
            label="职级"
            rules={[{ required: true, message: '请选择职级' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={[
              {value: 0, label: '在岗'},
              {value: 1, label: '出任务'},
              {value: 2, label: '忙碌'},
            ]}
            name="state"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          />
          <ProFormSelect
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            options={[
              {value: 0, label: '否'},
              {value: 1, label: '是'},
            ]}
            name="isLeave"
            label="是否离队"
            rules={[{ required: true, message: '请选择是否离队' }]}
          />
        </ProForm.Group>
        <ProFormText.Password
            width="sm"
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
        <ProFormTextArea
          width="xl"
          label="原因"
          name="reason"
          fieldProps={{
            autoSize: true
          }}
          rules={[{ required: true, message: '请填写原因' }]}
        />
{/* </ProForm> */}
      </ModalForm>
    <Button type='primary' style={{
      position: 'absolute',
      top: 90,
      right: 170,
    }} onClick={
      async () => {
        setModalVisit(true);
        setAction('新增');
        // const record:PersonalInfoItem = {name: '', username: Random.id(), id: dataSource[0].id + 1,
        // advantage: '',
        //   gender: 0,
        //   phone: '',
        //   birthday: getTimeFormat(),
        //   idNo: '',
        //   workingSeniority: 0,
        //   conditions: 1,
        //   job: '',
        //   workPlace: '',
        //   skill: '',
        //   grade: 1,
        //   state: 1,
        //   isLeave: 0,
        //   reason: '',
        //   password: Random.id().slice(0, 6),
        //   createTime: getTimeFormat(),
        // }
        // record.key = record.username;
        // setDataSource([record, ...dataSource]);
      }
    }>
      新增
    </Button>
  </>
);

}
