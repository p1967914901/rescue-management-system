import mockjs, { Random } from 'mockjs';

// 拓展mockjs
Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + mockjs.mock(/\d{8}/) //Number()
  }
});

export default {
  // 使用 mockjs 等三方库
  'POST /fund/list': mockjs.mock({
    'status': 1,
    'data|100': [{
      'id|+1': 0,
      'type|1': ['收入', '支出'],
      'num|1000-10000': 1,
      'track|1': ['政府下拨', '企业捐助', '个人自筹', '购买服务', '其他', '办公支出', '购买设备', '培训费用', '团建费用', '其他'],
      'detail': '@cparagraph',
      'createTime': '@date("yyyy-MM-dd")', // 时间
    }],
    // 'data|100': [{ name: '@cname', 'id|1-10000': 50, 'type|1': ['奖学金', '助学金', '基础建设'], 'createTime': "@date('yyyy-MM-dd')", 'num|10000-99999999': 1 }],
  }),
  'POST /api/updateUserInfo': (req:any, res:any) => {
    res.send({req, res})
  }

};


