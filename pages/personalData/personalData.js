// pages/personalDataPage/personalDataPage.js
Page({
  data: {
    userUnlogin: true, // 判断是否已经登陆
    showPopUp: false, // 判断是否显示弹出层
    userInfo: {
      avatarURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName: "",
      userAge: ""
    },
    diseases: [],
    // '心脏病','糖尿病','高血压','高血脂','xx病','xxx症'
    heartRateNum: 0,
    breathNum: 0
  },

  // 显示弹出层
  onShowPopUp() {
    this.setData({
      showPopUp: true
    })
  },
  // 关闭弹出层
  onClosePopUp() {
    this.setData({
      showPopUp: false
    })
  },
  // 获取头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    let img = 'userInfo.avatarURL';
    this.setData({
        [img]: avatarUrl
    })
    wx.setStorageSync('avatarURL', avatarUrl);
  },
  // 获取名字
  getNickName(e) {
    const { value } = e.detail;
    let name = 'userInfo.nickName';
    this.setData({
      [name]: value
    })
  },
  // 获取年纪
  getUserAge(e) {
    const { value } = e.detail;
    let age = 'userInfo.userAge';
    this.setData({
      [age]: value
    })
  },
  // 跳转到我的页面
	toMyPage() {
		wx.switchTab({
			url: '/pages/home/home',
		})
  },
  // 提交个人信息
  submitAllData() {
    // 将个人信息写入Storge，方便获取
    wx.setStorageSync('userInfo', this.data.userInfo);
    this.setData({
      userUnlogin: false,
      showPopUp: false
    })
  },
  // 前往完善疾病信息
  fillDiseaseData() {
    console.log("前往完善数据页面");
    this.setData({
      diseases: ['心脏病','糖尿病','高血压','高血脂','xx病','xxx症']
    })
  },
  // 判断是否未登录
  checkLogin() {
    if(wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        userUnlogin: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.checkLogin();
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

  }
})