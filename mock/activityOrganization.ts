import mockjs, { Random } from 'mockjs';
import r from './eq.json';
// 拓展mockjs
Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + mockjs.mock(/\d{8}/) //Number()
  }
});
const equips = {
  '照明设备': ['照明车', '手电筒', '灯具及配件'],
  '通信设备': ['对讲机'],
  '医疗设备': ['担架', '酒精', '防护服', '夹板', '医疗口罩', '放毒面具', '医疗包', '急救药箱'],
  '水上救援设备': ['皮划艇', '马达', '发动机', '快艇', '救生衣'],
  '特殊设备': ['运输车', '探测仪', '无人机'],
  '消防设备': ['灭火器', '铁锹', '锤子', '消防栓扳手', '撬棍', '斧子'],
  '基础设备': ['五金工具箱', '安全梯', '便携雨衣', '喇叭', '水桶', '反光背心', '布手套', '一次性手套', '毛巾', '安全标志牌']
};

export default {
  // 使用 mockjs 等三方库
  'POST /activity/list': async (req:any, res:any) => {
    const data = mockjs.mock({
      'status': 1,
      'data|100': [{
        'id|+1': 0,
        'activityType|1': ['应急救援', '社会救助', '社会培训', '宣讲演练', '其他'],
        'reporterName': '@cname',
        'reporterPhone': '@phone',
        'reporterAddress': '@county(true)',
        'equipments': [], //'', '手电筒', '灯具及配件'
        'activityAddress': '@county(true)',
        'fund|100-500': 1,
        'duration|1-5': 1,
        'userNumRequired|3-6': 1,
        'skillRequired': '需要的技能',
        'createTime': '@datetime("yyyy-MM-dd HH:mm")',
        'endTime': '@datetime("yyyy-MM-dd HH:mm")',
        'detail': '@cparagraph',
        'participants|3': [{
          'name': '@cname',
          'username': '@id',
          'gender|1': [0, 1],
          'phone': '@phone',
          'isSure|1': ['确认', '未确认']
        }]
      }]
    });
    const eq = r.data.filter((item:any) => item.status === '在库');
    for(const item of data.data) {
      let len = Random.integer(1, 3);
      while(len--) {
        const e = eq[Random.integer(0, eq.length - 1)];
        item.equipments.push({
          id: e.id,
          name: e.type + '/' + e.name
        });
      }
    }
    res.send(data);
    // 'data|100': [{ name: '@cname', 'id|1-10000': 50, 'type|1': ['奖学金', '助学金', '基础建设'], 'createTime': "@date('yyyy-MM-dd')", 'num|10000-99999999': 1 }],
  },
  'POST /api/updateUserInfo': (req:any, res:any) => {
    res.send({req, res})
  }

};


