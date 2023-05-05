import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProLayout, ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import defaultProps from './_defaultProps';
import { IRouteComponentProps, history, useLocation } from 'umi';


export default (props:IRouteComponentProps) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '.login' && !localStorage.length) {
      history.push('/login')
    }
  }, []);

  if (location.pathname === '/login') {
    return props.children;
  }

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        siderWidth={200}
        title='救援管理系统'
        logo={<></>}
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        {...defaultProps}
        location={{
          pathname: location.pathname,
        }}
        // menu={{
        //   type: 'group',
        // }}
        avatarProps={{
          render: () =>
            <Button type="link" size={'large'} onClick={
              () => {
                localStorage.clear();
                history.push('/login');
                message.success('您已退出登陆');
              }
            }>
              退出登陆
            </Button>

        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              history.push(item.path as string);
            }}
          >
            {dom}
          </div>
        )}
      >
        <PageContainer>
          {props.children}
        </PageContainer>
      </ProLayout>
    </div>
  );
};
