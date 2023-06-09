import mockjs, { Random } from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'POST /ranking/list': mockjs.mock({
    'status': 1,
    'data|100': [{
      'id|+1': 0,
      'username': '@cname',
      'name': '@cname',
      'score|100-500': 1,
    }],
    // 'data|100': [{ name: '@cname', 'id|1-10000': 50, 'type|1': ['奖学金', '助学金', '基础建设'], 'createTime': "@date('yyyy-MM-dd')", 'num|10000-99999999': 1 }],
  }),
  'POST /api/updateUserInfo': (req:any, res:any) => {
    res.send({req, res})
  }

};


