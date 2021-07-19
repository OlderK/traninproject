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
    imgPath: "https://img1.baidu.com/it/u=2576775337,1212654948&fm=26&fmt=auto&gp=0.jpg",
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
