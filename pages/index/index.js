// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    wifiList: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // wifi测试
  showWifiList() {
    // 初始化wifi模块
    wx.startWifi({
      success: (res) => {
        console.log(res);
        // 获取wifi列表
        wx.getWifiList({
          success: (res) => {
            console.log(res);
            wx.onGetWifiList((res) => {
              console.log(res.wifiList);
              this.setData({
                wifiList: res.wifiList
              })
            })
          },
          fail: res => {
            if (res.errCode == 12006) { 
              wx.showToast({
                icon: "error",
                title: '请打开手机定位功能',
              })
            }
            else if (res.errCode == 12005) {
              wx.showToast({
                icon: "error",
                title: '请打开手机WiFi',
              })
            }
          }
        })
      },
      fail: res => {
        // 根据返回的errorcode进行错误类型判断
        if(res.errCode == 12005) {
          wx.showToast({
            title: '您未打开WiFi，请先打开WiFi',
          })
        }
      }
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
