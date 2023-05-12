// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultURL: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
    userInfo: null
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
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
    })
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

  // 退出登录
  logOut() {
    wx.showModal({
      title: "退出登录将清除本地所有信息，您确定退出吗？",
      success: res => {
        if (res.confirm==true) {
          wx.clearStorageSync();
          wx.navigateTo({
            url: '/pages/login/login',
          })           
        }
      }
    })
    
  },
  // 跳转到修改信息页面
  toModifyPage() {
    wx.navigateTo({
      url: '/pages/modifyPage/modifyPage',
    })
  },
  // 跳转到修改密码页面
  toModifyPasswordPage() {
    wx.navigateTo({
      url: '/pages/modifyPasswordPage/modifyPasswordPage',
    })
  },
  // 跳转我的预约页面
  toMyOrderPage() {
    wx.navigateTo({
      url: '/pages/myOrderPage/myOrderPage',
    })
  },
  // 跳转到设置预约页面
  toSetOrderPage() {
    wx.navigateTo({
      url: '/pages/setOrderPage/setOrderPage',
    })
  },
  // 跳转到我的日程页面
  toGetSchedule() {
    wx.navigateTo({
      url: '/pages/mySchedulePage/mySchedulePage',
    })
  },
  // 跳转到关于我们页面
  toAboutUsPage() {
    wx.navigateTo({
      url: '/pages/aboutUsPage/aboutUsPage',
    })
  },
  // 未开发功能弹窗
  unDevelopContainer() {
    wx.showToast({
      title: '正在开发中...',
      icon: 'none',
      duration: 800
    })
  }
})