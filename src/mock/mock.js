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
Mock.mock(/\/sockjs-node\/info/, 'get', _ => {
  console.log()
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
    familyName: '@cname()',
    id: 0,
    imgPath: "@image('100x100', '#894FC4', '#FFF', 'png', 'user')",
    lastLogin: "@date(yyyy-MM-dd hh:mm:ss)",
    mobile: "@string('number', 11)",
    name: "@cname()",
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
  'data|15': [{
    custId: '@increment',
    custName: '@cname(2,3)',
    custMobile: "@string('number', 11)",
    custUpdateTime: '@date(yyyy-MM-dd hh:mm:ss)',
    custDocumentType: "@ctitle(3, 4)",
    custDocumentNum: "@string('number', 18)",
    "custFrom": /[A-C]/,
    "custLevel": /[A-E]/,
    custAddress: "@county(true)",
    custAddressDetail: "@city(true)",
    custNote: '@sentence(20)',
    founder: "@cname(2, 3)",
  }]
})

// 模拟用户跟进记录
let followRecords = Mock.mock({
  'data|15': [{
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
    if (data.custMobile) {
      res = res.filter(v => v.custMobile.indexOf(data.custMobile) > -1)
    }
    if (data.custFrom) {
      res = res.filter(v => v.custFrom.indexOf(data.custFrom) > -1)
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
