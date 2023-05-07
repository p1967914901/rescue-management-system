import mockjs, { Random } from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'POST /scheduling/list': (req:any, res:any) => {
    const data = mockjs.mock({
      'status': 1,
      'data|800': [{
        'id|+1': 0,
        'year': 0,
        'month': 0,
        'day': 0,
        'personList|2': [{
          'type|1': [0, 1],
          'name': '@cname',
          'username': '@id'
        }]
      }],
    });
    let i = 0;
    for(let year = 2022; year < 2024; year ++) {
      for(let month = 1; month < 13; month ++) {
        for(let day = 1; day < 32; day ++) {
          data.data[i].year = year;
          data.data[i].month = month;
          data.data[i].day = day;
          i ++;
        }
      }
    }
    res.send(data);
  },
  'POST /api/updateUserInfo': (req:any, res:any) => {
    res.send({req, res})
  }

};


