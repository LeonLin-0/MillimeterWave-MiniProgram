// pages/mentalHealth/mentalHealthHistory/mentalHealthHistory.js
import { getRequest } from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    noDataImg: '../../../icon/noData.svg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getRequest('/question/GetAnalyReportHistory')
    .then(({data: res}) => {
      if (res.code === 200) {
        let reList = (res.data || []).reverse();
        let timer = setInterval(() => {
          if(reList.length !== 0) {
            this.setData({
              historyList: [...this.data.historyList, reList.shift()]
            })
          }
          else {
            clearInterval(timer);
          }
        }, 140);
      }
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
  toMentalHealthDetail(e) {
    let data = e.currentTarget.dataset.history;
    getRequest(`/question/GetAnalyReportDetailed?id=${data.id}`)
    .then(({data: res}) => {
      wx.setStorageSync('psyResult', JSON.stringify(res));
      wx.navigateTo({
        url: `/pages/mentalHealth/mentalHealthConclusion/mentalHealthConclusion?resultName=psyResult`,
      })
    })
  }
})