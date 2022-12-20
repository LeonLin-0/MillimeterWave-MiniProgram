// pages/historyPage/historyPage.js
import { ip } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    wx.request({
      method: 'GET',
      url: `http://${ip}:8090/v1/healthyData/GetDate`,
      success: res => {
        let resData = res.data.data;
        let tempArray = [];
        for(var i in resData) {
          let time = resData[i].time.split('T')[0];
          tempArray.push({date: time});
        }
        this.setData({
          history: tempArray.reverse()
        })
      }
    })
  },
  // 前往详细页
  toDetailPage(e) {
    let date = e.currentTarget.dataset.text.date;
    console.log(date);
    wx.navigateTo({
      url: `/pages/historyDetail/historyDetail?date=${date}`
    })
  }
})