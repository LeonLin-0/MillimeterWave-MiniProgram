const { getRequest, postRequest } = require("../../utils/util")
const app = getApp();
// pages/modifyPasswordPage/modifyPasswordPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    password: '',
    repeatPassword: '',
    verifyCode: '',
    verifyCodeBtnText: '获取验证码',
    time: 30,
    timer: undefined,
    isDisable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if(this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if(this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 获取输入的密码
  getInputPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 获取再次输入的密码
  getInputRepeatPassword(e) {
    this.setData({
      repeatPassword: e.detail.value
    })
  },
  // 获取输入的验证码
  getInputVerifyCode(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  // 发送请求获取验证码
  getMsgVerifyCode() {
    let length = this.data.time;
    // 为了立即触发
    const fn = () => {
      this.setData({
        verifyCodeBtnText: length
      })
      length -= 1;
      if(length === -2) {
        // 清除定时器
        clearInterval(this.data.timer);
        // 恢复按钮和文字
        this.setData({
          isDisable: false,
          verifyCodeBtnText: '获取验证码'
        })
      }
    }
    // 禁用按钮
    this.setData({
      isDisable: true
    })
    // 设置定时器
    this.data.timer = setInterval(fn, 1000);
    // 发送请求获取短信验证码
    getRequest('/base/SendSms', { mobile: this.data.userInfo.mobile+'' }).then(({data: res}) => {
      console.log(res);
    }).catch(({data: res}) => {
      wx.showToast({
        title: `res.msg`,
        icon: 'error',
        duration: 800
      })
    })
  },
  sumbitAll() {
    let mobile = this.data.userInfo.mobile+'';
    let password = this.data.password+'';
    let repeatPassword = this.data.repeatPassword+'';
    let verifyCode = this.data.verifyCode+'';
    if(mobile!="" && password!="" && repeatPassword!='' && verifyCode!="") {
      if(password !== repeatPassword) {
        wx.showToast({
          title: '密码不一致',
          icon: 'error',
          duration: 800
        })
      }
      else {
        postRequest('/user/FindPasswordByMobile',
        {
          mobile: mobile,
          password: password,
          repeatPassword: repeatPassword,
          smsCode: verifyCode
        }).then(({data: res}) => {
          if(res.code == 200) {
            wx.showToast({
              title: `${res.msg}`,
              icon: 'success',
              duration: 1500
            })
            const timer = setTimeout(() => {
              wx.switchTab({
                url: '/pages/home/home',
              })
              clearTimeout(timer);
            },800)
          }
          else {
            wx.showToast({
              title: `${res.msg}`,
              icon: 'error',
              duration: 1000
            })
            this.setData({
              password: '',
              verifyCode: ''
            })
          }
        })
      }
    }
    else {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'error',
        duration: 800
      })
    }
  }
})