import { ChromeFilled, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/activityOrganization',
        name: '活动组织',
        icon: <SmileFilled />,
      },
      {
        path: '/scheduling',
        name: '部队排班',
        icon: <SmileFilled />,
      },
      {
        path: '/rating',
        name: '年度评比',
        icon: <SmileFilled />,
      },
      {
        path: '/fundsManagement',
        name: '经费管理',
        icon: <SmileFilled />,
      },
      {
        path: '/equipmentManagement',
        name: '设备管理',
        icon: <SmileFilled />,
      },
      {
        path: '/personnelManagement',
        name: '人员管理',
        icon: <SmileFilled />,
      },
    ],
  },
  location: {
    pathname: '/',
  }
};
