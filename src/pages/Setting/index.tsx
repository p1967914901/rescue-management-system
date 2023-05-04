import React, { useState } from "react";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";

export interface PersonalInfoItem {
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

interface PersonalInfoTableProps {
  dataSource: PersonalInfoItem[];
  onSave: (data: PersonalInfoItem[]) => void;
}

const PersonalInfoTable: React.FC<PersonalInfoTableProps> = ({
  onSave,
}) => {
  const [editingKey, setEditingKey] = useState<string>("");

  const actionRef = React.useRef<ActionType>();
  const dataSource = [
    {"name":"陆洋","username":"610000201607163602","gender":0,"phone":"18963455859","birthday":"1988-10-19","idNo":"510000200001087731","workingSeniority":6,"conditions":1,"job":"工作","workPlace":"工作地点","skill":"技能","grade":1,"state":2,"isLeave":1,"reason":"原因","password":"123456","createTime":"1991-08-20"},
    {"name":"陆洋","username":"610000201607163602","gender":0,"phone":"18963455859","birthday":"1988-10-19","idNo":"510000200001087731","workingSeniority":6,"conditions":1,"job":"工作","workPlace":"工作地点","skill":"技能","grade":1,"state":2,"isLeave":1,"reason":"原因","password":"123456","createTime":"1991-08-20"},{"name":"陆洋","username":"610000201607163602","gender":0,"phone":"18963455859","birthday":"1988-10-19","idNo":"510000200001087731","workingSeniority":6,"conditions":1,"job":"工作","workPlace":"工作地点","skill":"技能","grade":1,"state":2,"isLeave":1,"reason":"原因","password":"123456","createTime":"1991-08-20"},{"name":"陆洋","username":"610000201607163602","gender":0,"phone":"18963455859","birthday":"1988-10-19","idNo":"510000200001087731","workingSeniority":6,"conditions":1,"job":"工作","workPlace":"工作地点","skill":"技能","grade":1,"state":2,"isLeave":1,"reason":"原因","password":"123456","createTime":"1991-08-20"},
    {"name":"陆洋","username":"610000201607163602","gender":0,"phone":"18963455859","birthday":"1988-10-19","idNo":"510000200001087731","workingSeniority":6,"conditions":1,"job":"工作","workPlace":"工作地点","skill":"技能","grade":1,"state":2,"isLeave":1,"reason":"原因","password":"123456","createTime":"1991-08-20"}
  ]

  const handleSave = (key: string, newData: PersonalInfoItem) => {
    const newDataList = dataSource.map((item) => {
      if (item.idNo === key) {
        return { ...item, ...newData };
      }
      return item;
    });
    onSave(newDataList);
    setEditingKey("");
  };

  const handleDelete = (key: string) => {
    const newDataList = dataSource.filter((item) => item.idNo !== key);
    onSave(newDataList);
  };

  const handleAdd = (newData: PersonalInfoItem) => {
    const newDataList = [...dataSource, newData];
    onSave(newDataList);
  };

  const columns: ProColumns<PersonalInfoItem>[] = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      search: true as any,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      // search: true,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      sorter: (a, b) => a.gender - b.gender,
      // search: true,
    },
    {
      title: "手机号码",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      // search: true,
    },
    {
      title: "出生日期",
      dataIndex: "birthday",
      key: "birthday",
      sorter: (a, b) => a.birthday.localeCompare(b.birthday),
      // search: true,
    },
    {
      title: "身份证号",
      dataIndex: "idNo",
      key: "idNo",
      sorter: (a, b) => a.idNo.localeCompare(b.idNo),
      // search: true,
    },
    {
      title: "工龄",
      dataIndex: "workingSeniority",
      key: "workingSeniority",
      sorter: (a, b) => a.workingSeniority - b.workingSeniority,
      // search: true,
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => a.state - b.state,
      // search: true,
    },
    {
      title: "是否离职",
      dataIndex: "isLeave",
      key: "isLeave",
      sorter: (a, b) => a.isLeave - b.isLeave,
      // search: true,
    },
    {
      title: "原因",
      dataIndex: "reason",
      key: "reason",
      sorter: (a, b) => a.reason.localeCompare(b.reason),
      // search: true,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        const editable = record.idNo === editingKey;
        return editable ? (
          <>
            <a
              onClick={() => handleSave(record.idNo, record)}
              style={{ marginRight: 8 }}
            >
              保存
            </a>
            <a onClick={() => setEditingKey("")}>取消</a>
          </>
        ) : (
          <>
            <a onClick={() => setEditingKey(record.idNo)}>编辑</a>
            <a onClick={() => handleDelete(record.idNo)} style={{marginLeft: 8}}>
              删除
            </a>
          </>
        );
      },
    },
  ];

  return (
    <ProTable<PersonalInfoItem>
      actionRef={actionRef}
      rowKey="idNo"
      search={{ filterType: "light" }}
      dataSource={dataSource}
      columns={columns}
      editable={{
        type: "single",
        onSave: handleSave as any,
        onDelete: handleDelete as any,
        actionRender: ((row:any, _:any, __:any, actions:any) => [
          <a onClick={() => actions.startEditable?.(row.idNo)}>编辑</a>,
        ]) as any,
      }}
      // recordCreatorProps={{
      //   position: "bottom",
      //   record: {
      //     name: "",
      //     username: "",
      //     gender: 0,
      //     phone: "",
      //     birthday: "",
      //     idNo: "",
      //     workingSeniority: 0,
      //     condition: 0,
      //     job: "",
      //     workPlace: "",
      //     skill: "",
      //     grade: 0,
      //     state: 0,
      //     isLeave: 0,
      //     reason: "",
      //     password: "",
      //     createTime: "",
      //   },
      //   creatorButtonText: "添加",
      //   onRecordCreated: handleAdd,
      // } as any}
    />
  );
};

export default PersonalInfoTable;
