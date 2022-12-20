// pages/login/login.js
import { ip } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegister: false,
    userInfo: {
      nickName: '',
      userPhone: undefined,
      password: '',
    },
    verifyCode: '',
    imgCode: '',
    captchaId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getImgCode();
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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
  // 更改模式
  changeRegisterState() {
    this.setData({
      isRegister: !this.data.isRegister,
      ['userInfo.userPhone']: '',
      ['userInfo.password']: '',
      verifyCode: ''
    })
    this.getImgCode();
  },
  // 获取手机号
  getUserPhone(e) {
    let phone = e.detail.value;
    this.setData({
      ['userInfo.userPhone']: phone
    })
  },
  // 获取密码
  getPassword(e) {
    let pw = e.detail.value;
    this.setData({
      ['userInfo.password']: pw
    })
  },
  // 获取输入的验证码
  getVerifyCode(e) {
    let vc = e.detail.value;
    this.setData({
      verifyCode: vc
    })
  },
  // 获取图形验证码
  getImgCode() {
    wx.request({
      method: 'GET',
      url: `http://${ip}:8090/v1/base/captcha`,
      success: res => {
        this.setData({
          imgCode: res.data.picPath,
          captchaId: res.data.captchaId
        })
      }
    })
  },
  // 注册/登录
  loginOrRegister() {
    let state = this.data.isRegister;
    let userPhone = this.data.userInfo.userPhone;
    let password = this.data.userInfo.password;
    let captcha = this.data.verifyCode;
    let captchaId = this.data.captchaId;
    if (userPhone!="" && password!="" && captcha!="" && captchaId!="") {
      if(state) { // 注册状态
        // 发送请求，注册账号
        wx.request({
          method: 'POST',
          url: `http://${ip}:8090/v1/user/MobileRegister`,
          data: {
            'mobile': userPhone,
            'password': password,
            'captcha': captcha,
            'captchaId': captchaId
          },
          success: res => {
            // 如果注册成功
            if( res.statusCode===200 ) {
              wx.setStorageSync('userInfo', this.data.userInfo);
              wx.setStorageSync('needFillData', true);
              wx.setStorageSync('x-token', res.data.token);
              // 成功后跳转
              wx.switchTab({
                url: "/pages/personalData/personalData",
              })
            } else {
              // 注册失败
              wx.showToast({
                title: res.data.msg,
                icon: 'error'
              })
            }
          }
        })
      }
      else { // 登陆状态
        // 发送请求，注册账号
        wx.request({
          method: 'POST',
          url: `http://${ip}:8090/v1/user/Login`,
          data: {
            'mobile': userPhone,
            'password': password,
            'captcha': captcha,
            'captchaId': captchaId
          },
          success: res => {
            console.log(res);
            if( res.statusCode === 200 ) {
              // 保存token
              wx.setStorageSync('x-token', res.data.token);
              // 保存用户信息
              wx.setStorageSync('userInfo',res.data.data);
              // 设置无需完善信息
              wx.setStorageSync('needFillData', false);
              // 跳转页面
              wx.switchTab({
               url: "/pages/personalData/personalData",
              })              
            }
          }
        })
      }      
    } else {
      wx.showToast({
        title: '请完整填写',
        icon: "error"
      })
    }

  }
})