// pages/mentalHealth/mentalHealthHomePage/mentalHealthHomePage.js
const { getRequest } = require("../../../utils/util");
let timer;

// const { teacherList } = require("../../../utils/teacherList");
// 当前页面获取信息，存入未读信息中
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerTitle: "心理健康",
    psychologistList: [],
    userChatMemory: null,
  },

  /**
   * 生命周期函数--监听页面加载,初始化聊天记录
   */
  onLoad(options) {
    wx.showLoading({
      title: '获取列表中'
    })
    this.getPsychologistList();
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
      userChatMemory: app.globalData.userChatMemory || wx.getStorageSync('userChatMemory')
    })
    timer = setInterval(() => {
      this.setData({
        userChatMemory: app.globalData.userChatMemory || wx.getStorageSync('userChatMemory')
      })
      console.log("正在获取最新消息记录...");
    },5000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if(timer) {
      clearInterval(timer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(timer);
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
  // 前往心理测试选择页面
  toPsyTestChoicePage() {
    wx.navigateTo({
      url: '/pages/mentalHealth/psychologyTestChoicePage/psychologyTestChoicePage',
    })
  },
  // 前往咨询历史页面
  toChatHistoryPage() {
    wx.navigateTo({
      url: `/pages/mentalHealth/chatHistory/chatHistory`,
    })
  },
  // 前往chatGPT聊天页面：fromId和toId都是自己
  toChatGPTPage() {
    wx.navigateTo({
      url: `/pages/mentalHealth/chatRoom/chatRoom?id=${app.globalData.userInfo.userId+''}`,
    })
  },
  // 前往个人成长页面
  toPersonalGrowthPage() {
    wx.navigateTo({
      url: '/pages/mentalHealth/mentalHealthHistory/mentalHealthHistory',
    })
  },
  // 还未开发
  onUndevelopedState() {
    wx.showToast({
      title: '正在开发中...',
      icon: 'none',
      duration: 800
    })
  },
  // 获取咨询师列表
  getPsychologistList() {
    getRequest('/consultant/GetConsultantList')
    .then(({data: res}) => {
      this.processData(res.data.list);
    })
    // this.processData(teacherList);
  },
  // 处理咨询师数据
  processData(list) {
    let newList = list.map(item => {
      item.introduce = item.introduce.split(",").join(" | ");
      item.tag = item.tag.split(";")
      return item;
    })
    wx.hideLoading();
    let timer1 = setInterval(() => {
      if(newList.length != 0) {
        this.setData({
          psychologistList: [...this.data.psychologistList, newList.shift()]
        })
      }
      else {
        clearInterval(timer1);
      }
    }, 300);
  }
});