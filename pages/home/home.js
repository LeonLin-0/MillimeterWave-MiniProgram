// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultURL: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
    userInfo: {
      avatarURL: "",
      nickName: '',
      userAge: 0,
      userHeight: 0,
      userWeight: 0,
      userDisease: []
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
    let userInfo = wx.getStorageSync('userInfo');
    // 进入页面后，判断个人信息情况，如果信息不完善，则前往完善信息页面
    if(userInfo.avatarURL==="" || userInfo.avatarURL===undefined) {
      this.setData({
        ['userInfo.nickName']: userInfo.nickName
      })
    } else { // 有信息后，赋值显示
      this.setData({
        userInfo: userInfo,
        needFillData: false
      })
      wx.setStorageSync('needFillData', this.data.needFillData);
    }
    // 未登陆过或注销了
    // if (userUnlogin==="" && userUnlogin!=false) {
    //   this.setData({
    //     userUnlogin: true,
    //     userInfo: {
    //       avatarURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    //     }
    //   })
    // } else if(userUnlogin===false) {
    //   // 处于登陆状态
    //   this.setData({
    //     userInfo: userInfo,
    //     userUnlogin: userUnlogin
    //   })
    // }
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

  // 登录：显示弹出层
  logIn() {
    this.setData({
      showPopUp: true
    })
  },
  // 退出登录
  logOut() {
    if(wx.getStorageSync('userInfo')){
      wx.showModal({
        title: "您确定注销吗",
        success: res => {
          if (res.confirm==true) {
            wx.removeStorageSync('userInfo');
            this.setData({
              userInfo: {
                avatarURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
              }
            })
            wx.navigateTo({
              url: '/pages/login/login',
            })           
          }
        }
      })
    }
  },
  // 跳转到修改信息页面
  toModifyPage() {
    wx.navigateTo({
      url: '/pages/modifyPage/modifyPage',
    })
  },
  // 跳转到历史记录页面
  toHistoryPage() {
    wx.navigateTo({
      url: '/pages/historyPage/historyPage',
    })
  },
  // 跳转到关于我们页面
  toAboutUsPage() {
    wx.navigateTo({
      url: '/pages/aboutUsPage/aboutUsPage',
    })
  }
})