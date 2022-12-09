// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegister: false,
    userInfo: {
      nickName: '',
      password: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  // 修改登录模式
  changeRegisterState() {
    this.setData({
      isRegister: !this.data.isRegister,
      ['userInfo.nickName']: '',
      ['userInfo.password']: ''
    })
  },
  // 获取用户名
  getNickName(e) {
    let name = e.detail.value;
    this.setData({
      ['userInfo.nickName']: name
    })
  },
  // 获取密码
  getPassword(e) {
    let pw = e.detail.value;
    this.setData({
      ['userInfo.password']: pw
    })
  },
  login() {
    let state = this.data.isRegister;
    let userName = this.data.userInfo.nickName;
    let password = this.data.userInfo.password;
    if (userName!="" && password!="") {
      if(state) { // 注册状态
        console.log("申请注册：",userName, password);
        // 注册后，保存个人信息
        wx.setStorageSync('userInfo', this.data.userInfo);
        wx.setStorageSync('needFillData', true);
        // 成功后跳转
        wx.switchTab({
          url: "/pages/personalData/personalData",
        })
      }
      else { // 登陆状态
        console.log("申请登录：",userName, password);
        // 成功后跳转
        // 保存用户信息
        wx.switchTab({
          url: "/pages/personalData/personalData",
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