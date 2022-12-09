// pages/historyPage/historyPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [
      { id: 0, date: "2022/12/7" },
      { id: 1, date: "2022/12/6" },
      { id: 2, date: "2022/12/5" },
      { id: 3, date: "2022/12/4" },
      { id: 4, date: "2022/12/3" },
      { id: 4, date: "2022/12/2" },
      { id: 4, date: "2022/12/1" },
      { id: 4, date: "2022/11/30" }
    ]
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
  toDetailPage(e) {
    let date = e.currentTarget.dataset.text.date;
    console.log(date);
    wx.navigateTo({
      url: `/pages/historyDetail/historyDetail?date=${date}`
    })
  }
})