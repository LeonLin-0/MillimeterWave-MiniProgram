// pages/historyPage/historyPage.js
import { getRequest } from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerTitle: "历史记录",
    hasHistory: false,
    noDataImg: "/icon/noData.svg",
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取历史日期
    this.getDateList();
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
  // 获取历史日期,并进行处理
  getDateList() {
    getRequest('/healthyData/GetDate').then(({data: res}) => {
      let data = res.data;
      if(data.length != 0) {
        this.setData({
          hasHistory: true
        });
        let timer = setInterval(() => {
          if(data.length !== 0) {
            this.setData({
              history: [...this.data.history, data.pop()]
            })
          }
          else {
            clearInterval(timer);
          }
        }, 80)
      }
    })
  },
  // 前往详细页
  toDetailPage(e) {
    let date = e.currentTarget.dataset.date.time;
    wx.navigateTo({
      url: `/pages/history/historyDetail/historyDetail?date=${date}`
    })
  }
})