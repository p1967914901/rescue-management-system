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
  'POST /user/list': mockjs.mock({
    'status': 1,
    'data|100': [{
      'name': '@cname',
      'username': '@id',
      'gender|1': [0, 1],
      'phone': '@phone',
      'birthday': '@date("yyyy-MM-dd")',
      'idNo': '@id', // 身份证号
      'workingSeniority|1-10': 0, // 从业年限
      'conditions|1': [0, 1, 2], // 0-一般 1-健康 2-带伤
      'job': '工作',
      'workPlace': '工作地点',
      'skill': '技能',
      'grade|1': [0, 1], // 0-队长 1-队员
      'state|1': [0, 1, 2], // 0-在岗 1-出任务 2-忙碌
      'isLeave|1': [0, 1], // 0-在队 1-离队
      'reason': '原因',
      'password': '123456',
      'createTime': '@date("yyyy-MM-dd")', // 入队时间
    }],
    // 'data|100': [{ name: '@cname', 'id|1-10000': 50, 'type|1': ['奖学金', '助学金', '基础建设'], 'createTime': "@date('yyyy-MM-dd')", 'num|10000-99999999': 1 }],
  }),
  'POST /login': (req:any, res:any) => {
    res.send(mockjs.mock({
      'name': '@cname',
      'username': '@id',
      'gender|1': [0, 1],
      'phone': '@phone',
      'birthday': '@date("yyyy-MM-dd")',
      'idNo': '@id', // 身份证号
      'workingSeniority|1-10': 0, // 从业年限
      'conditions|1': [0, 1, 2], // 0-一般 1-健康 2-带伤
      'job': '工作',
      'workPlace': '工作地点',
      'skill': '技能',
      'grade|1': [0, 1], // 0-队长 1-队员
      'state|1': [0, 1, 2], // 0-在岗 1-出任务 2-忙碌
      'isLeave|1': [0, 1], // 0-在队 1-离队
      'reason': '原因',
      'password': '123456',
      'createTime': '@date("yyyy-MM-dd")', // 入队时间
    }))
  }

};


