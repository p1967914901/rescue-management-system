import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
import { history } from 'umi';

interface LoginFormProps {
  onFinish: (values: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {

  const onFinish = async (values:any) => {
    // console.log(values)
    const res = await axios.post('/auth/login', values);
    // console.log(res);
    if (res.data.message === '登录成功') {
      console.log(res.data)
      localStorage.setItem('user', JSON.stringify(res.data.data));
      localStorage.setItem('role', String(res.data.data.grade));
      message.success('登录成功');
      history.push('/activityOrganization')
    } else {
      message.error(res.data.message);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ width: 300 }}
      >
        <p style={{ textAlign:'center', fontSize:'30px' }}>救援管理系统</p>
        <Form.Item
          name="username"

          rules={[{ required: true, message: '请输入您的用户名！！！' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码！！！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登陆
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
