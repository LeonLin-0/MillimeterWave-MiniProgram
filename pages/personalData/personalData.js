// pages/personalDataPage/personalDataPage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userUnlogin: true, 
    userInfo: {},
    userAge: 0,
    diseases: [],
    // '心脏病','糖尿病','高血压','高血脂','xx病','xxx症'
    heartRateNum: 0,
    breathNum: 0
	},
	/**
	 * 页面方法
	 */
  toLogin() {
    wx.getUserProfile({
      desc: '登录',
      success: res=> {
        this.setData({
          userInfo: res.userInfo,
          userUnlogin: false
        })
        // 保存用户头像和名字
        wx.setStorageSync('avatarURL', res.userInfo.avatarUrl);;
        wx.setStorageSync('nickName', res.userInfo.nickName);
      }
    })
  },
	toMyPage() {
		wx.switchTab({
			url: '/pages/home/home',
		})
	},
	getUserInfo() {
		wx.getUserProfile({
			desc: '获取个人数据用于显示',
			success: res => {
        this.setData({
          userImg: res.userInfo.avatarUrl,
          userName: res.userInfo.nickName
        })
				console.log(res);
			}
		})
  },
  fillAgeData() {
    console.log('前往完善数据');
    this.setData({
      userAge: 20
    })
  },
  fillDiseaseData() {
    console.log("前往完善数据页面");
    this.setData({
      diseases: ['心脏病','糖尿病','高血压','高血脂','xx病','xxx症']
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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