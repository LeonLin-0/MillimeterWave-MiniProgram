const { getRequest } = require("../../../utils/util");

// pages/mentalHealth/psychologyTestChoicePage/psychologyTestChoicePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psyTestList: [],
    defaultImg: '/icon/projectIcon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPsyTestList();
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
  // 获取心理测试题列表
  getPsyTestList() {
    getRequest('/question/GetEvaluationScaleList')
    .then(({data: res})=> {
      let testList = res.data.list.map(item => {
        // 过滤出错数据
        let img = item.img.slice(0, 4) === 'http' ? item.img : '';
        return {
          psyTestPic: img,
          psyTestTitle: item.name,
          psyTestTitleEn: item.name,
          evaluationScaleId: item.Id,
          psyTestNum: item.component,
          psyTag: item.Tag,
          psyContent: item.content,
          psyHot: item.hot
        }
      })
      const timer = setInterval(() => {
        if(testList.length !== 0) {
          this.setData({
            psyTestList: [...this.data.psyTestList, testList.shift()]
          })          
        }
        else {
          clearInterval(timer);
        }
      }, 100)
    })
  },
  // 前往心理测试页面
  toPsyTestPage(e) {
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `/pages/mentalHealth/psychologyTestPage/psychologyTestPage?item=${item}`,
    })
  }
})