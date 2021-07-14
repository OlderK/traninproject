import Mock from 'mockjs'
import qs from 'querystring'


// 验证码
Mock.mock(/\/api\/catpcha\/digitalCaptcha/, 'get', _ => {
  let code = Mock.mock({
    'code|4': /[0-9a-zA-Z]/
  }).code
  const data = Mock.mock({
    'data|1': [{
      [code]: `@image(85x34, #fff, #000, png, ${code})`,
    }]
  })

  return data.data
})

// 登录
Mock.mock(/\/api\/system\/login/, 'post', _ => {
  return {
    status: 200,
    success: '登录成功',
    token: 'token;'
  }
})

// 刷新token
Mock.mock(/\/api\/system\/refreshToken/, 'get', _ => {
  return {
    status: 200,
    success: '登录成功',
    token: 'token;'
  }
})

// 报错处理
Mock.mock(/\/sockjs-node\/info/, 'get', option => {
  console.log(option)
  return {
    status: 200,
  }
})

// 导航栏
Mock.mock(/\/api\/system\/cscpMenus/, 'get', _ => {
  return {
    status: 200,
    success: '登录成功',
    token: 'token;'
  }
})

// 获取当前用户信息
Mock.mock(/\/api\/system\/cscpCurrentUserDetails/, 'get', _ => {
  const data = Mock.mock({
    discDetail: '@sentence(10)',
    discTitle: '@ctitle()',
    email: '@email()',
    familyName: '@cfirst()',
    id: 0,
    imgPath: "https://z3.ax1x.com/2021/07/14/WVytUI.png",
    lastLogin: "@date(yyyy-MM-dd hh:mm:ss)",
    mobile: "@string('number', 11)",
    name: "@clast()",
    registerTime: "@date(yyyy-MM-dd hh:mm:ss)",
    roleIds: "@string('number', 2)",
    roleNames: "@cword()",
    roles: "@cword()",
    userId: "@string('number', 10)",
    username: "@cname()"
  })
  return {
    status: 200,
    data: data
  }
})

// 模拟用户数据
let searchDemoData = Mock.mock({
  'data|3': [{
    custId: '@increment',
    custName: '@cname(2,3)',
    custTel: "@string('number', 11)",
    custUpdateTime: '@date(yyyy-MM-dd hh:mm:ss)',
    custCreateTime: '@date(yyyy-MM-dd hh:mm:ss)',
    custCardType: "@ctitle(3, 4)",
    custCardNum: "@string('number', 18)",
    "custOrigin": /(拜访)|(电话)|(广告)/,
    "custLevel": /[A-E]/,
    custAddress: "@county(true)",
    custDetailAddress: "@city(true)",
    custRemark: '@sentence(20)',
    custCreatFounder: "@cname(2, 3)",
  }]
})

// 模拟用户跟进记录
let followRecords = Mock.mock({
  'data|3': [{
    custId: '',
    'recordList|5': [{
      followId: '@increment',
      followTime: '@date(yyyy-MM-dd hh:mm:ss)',
      followMethod: '@ctitle(3, 4)',
      followContent: '@cparagraph'
    }]
  }]
})

for (let i = 0, len = followRecords.data.length; i < len; ++i) {
  followRecords.data[i].custId = searchDemoData.data[i].custId
}

// 用户搜索
Mock.mock(/\/api\/cscpCusts/, 'get', option => {
  let data = qs.parse(option.url.slice(option.url.indexOf('?') + 1))
  let str = ""
  for (let i of Object.keys(data)) {
    str += data[i]
  }
  if (!str) {
    return {
      status: 200,
      data: searchDemoData.data
    }
  } else {
    let res = searchDemoData.data
    if (data.custName) {
      res = res.filter(v => v.custName.indexOf(data.custName) > -1)
    }
    if (data.custTel) {
      res = res.filter(v => v.custTel.indexOf(data.custTel) > -1)
    }
    if (data.custOrigin) {
      res = res.filter(v => v.custOrigin.indexOf(data.custOrigin) > -1)
    }
    if (data.custLevel) {
      res = res.filter(v => v.custLevel.indexOf(data.custLevel) > -1)
    }
    return {
      status: 200,
      data: res
    }
  }
})

// 新建用户
Mock.mock(/\/api\/cscpCusts/, 'post', option => {
  let data = JSON.parse(option.body)
  searchDemoData.data.unshift(data)
  return {
    status: 200,
    message: 'success'
  }
})

// 删除用户
Mock.mock(/\/api\/cscpCusts/, 'delete', option => {
  let id = option.url.match(/(?<=(cscpCusts\/)).*/)[0]
  let targetIndex = searchDemoData.data.findIndex(v => v.custId === parseInt(id))
  searchDemoData.data.splice(targetIndex, 1)
  return {
    status: 200,
    message: 'success'
  }
})

// 编辑用户
Mock.mock(/\/api\/cscpCusts/, 'put', option => {
  let data = JSON.parse(option.body)
  let targetIndex = searchDemoData.data.findIndex(v => v.custId === data.custId)
  for (let key of Object.keys(data)) {
    searchDemoData.data[targetIndex][key] = data[key]
  }
  return {
    status: 200,
    message: 'success'
  }
})

// 根据用户id获取用户跟进记录
Mock.mock(/\/api\/cscpCustRecord/, 'get', option => {
  let id = option.url.match(/(?<=Record\/).*/)[0]
  return {
    status: 200,
    data: followRecords.data.find(v => v.custId === parseInt(id))
  }
})

// 添加记录
Mock.mock(/\/api\/addNewRecord/, 'post', option => {
  console.log(option)
})

// 删除记录
Mock.mock(/\/api\/deleteRecord/, 'delete', option => {
  let params = option.url.match(/(?<=Record\?).*/)[0]
  let data = qs.parse(params)
  let target = followRecords.data.findIndex(v => v.custId === parseInt(data.custId))
  let del = followRecords.data[target].recordList.findIndex(v => v.followId === parseInt(data.followId))
  followRecords.data[target].recordList.splice(del, 1)
  return {
    status: 200,
    message: 'success'
  }
})


// 获取时间段创建的用户
Mock.mock(/\/api\/customerdto/, 'get', option => {
  return [{
      custId: 1,
      custCreateTime: "2021-07-14 17:50:03",
      custLevel: "A",
      custOrigin: "拜访"
    },
    {
      custId: 156,
      custCreateTime: "2021-07-15 18:16:59",
      custLevel: "A",
      custOrigin: "电话"
    },
    {
      custId: 89,
      custCreateTime: "2021-07-16 18:48:57",
      custLevel: "C",
      custOrigin: "广告"
    },
    {
      custId: 90,
      custCreateTime: "2021-07-17 18:49:03",
      custLevel: "C",
      custOrigin: "拜访"
    },
    {
      custId: 92,
      custCreateTime: "2021-07-18 18:49:18",
      custLevel: "C",
      custOrigin: "电话"
    },
    {
      custId: 93,
      custCreateTime: "2021-07-19 18:49:25",
      custLevel: "B",
      custOrigin: "拜访"
    },
    {
      custId: 114,
      custCreateTime: "2021-07-20 18:49:35",
      custLevel: "C",
      custOrigin: "拜访"
    },
    {
      custId: 115,
      custCreateTime: "2021-07-21 06:49:45",
      custLevel: "C",
      custOrigin: "广告"
    },
    {
      custId: 116,
      custCreateTime: "2021-07-22 18:49:54",
      custLevel: "C",
      custOrigin: "拜访"
    },
    {
      custId: 118,
      custCreateTime: "2021-07-21 18:50:14",
      custLevel: "A",
      custOrigin: "广告"
    },
    {
      custId: 119,
      custCreateTime: "2021-07-20 18:50:44",
      custLevel: "A",
      custOrigin: "拜访"
    },
    {
      custId: 120,
      custCreateTime: "2021-07-19 18:50:50",
      custLevel: "B",
      custOrigin: "电话"
    },
    {
      custId: 125,
      custCreateTime: "2021-07-18 18:51:34",
      custLevel: "B",
      custOrigin: "电话"
    },
    {
      custId: 126,
      custCreateTime: "2021-07-17 18:51:41",
      custLevel: "B",
      custOrigin: "拜访"
    },
    {
      custId: 127,
      custCreateTime: "2021-07-16 18:51:28",
      custLevel: "A",
      custOrigin: "电话"
    },
    {
      custId: 128,
      custCreateTime: "2021-07-15 18:51:57",
      custLevel: "C",
      custOrigin: "拜访"
    },
    {
      custId: 129,
      custCreateTime: "2021-07-14 18:52:03",
      custLevel: "C",
      custOrigin: "广告"
    },
    {
      custId: 130,
      custCreateTime: "2021-07-13 18:52:10",
      custLevel: "C",
      custOrigin: "广告"
    }
  ]
})
