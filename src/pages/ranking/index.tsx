import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from '../../utils/axios';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Form } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';


export interface RankingItemType {
	id: number;
	name: string;
	username: string;
  score: number;
  grade: string;
  key?: number;
}

type DataIndex = keyof RankingItemType;


export default () => {
  const [data, setData] = useState<RankingItemType[]>([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<RankingItemType> => ({
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

  const grades = [
    '倔强青铜', '秩序白银', '荣耀黄金', '尊贵铂金', '永恒钻石', '至尊星耀', '最强王者', '无双王者', '荣耀王者', '传奇王者'
  ];

  const colors = [
    'geekblue', 'blue', 'purple', 'cyan', 'green', 'gold', 'orange', 'volcano', 'red', 'magenta'
  ]

  const columns: ColumnsType<RankingItemType> = [
    {
      title: '等级',
      dataIndex: 'grade',
      key: 'name',
      align: 'center',
      render: (text) => <Tag color={colors[grades.indexOf(text)]}>{text}</Tag>,
      filterSearch: true,
      filters: grades.map(v => ({ text: v, value: v })),
      onFilter: (value, record) => record.grade === value,
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      ...getColumnSearchProps('username'),
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      sorter: (a, b) => b.score - a.score
    },
  ];

  useEffect(() => {
    axios.post('/ranking/list', {})
      .then(res => {
        setData(res.data.data.map((v:RankingItemType) => ({...v, key: v.username})).sort((a:RankingItemType, b:RankingItemType) => b.score - a.score));
      })
  }, []);

  return (
    <>
      <Table  columns={columns} dataSource={data} />
    </>
  )
}
