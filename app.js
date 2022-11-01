// app.js
import { promisifyAll } from 'miniprogram-api-promise'
const wxp = wx.p = {}
// 调用promisifyAll方法将wx这个对象上的异步API promise化后挂载到wxp上
// 并将这个对象赋值给wx的自定义属性 wx.p，后续通过wx.p来调用promise化后的异步API
// 如 wx.p.request({})
promisifyAll(wx, wxp)

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
