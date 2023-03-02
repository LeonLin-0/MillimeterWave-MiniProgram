// pages/mentalHealth/chatHistory/chatHistory.js
const app = getApp();
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getRequest } from '../../../utils/util';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatHistory: [],
    hasChatHistory: null,
    noMessageImg: "/icon/noMessage.svg"
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
    console.log("获取最新聊天记录...");
    this.initChatHistory();
    this.improveInfomationContent();
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
  // 获取历史信息
  initChatHistory() {
    // 获取聊天记录
    let userChatMemory = app.globalData.userChatMemory || wx.getStorageSync('userChatMemory');
    if(JSON.stringify(userChatMemory)==='{"totalUnReadCount":0}') {
      this.setData({
        hasChatHistory: false
      })
    }
    else {
      let chatHistory = [];
      // 显示历史信息
      Object.keys(userChatMemory).forEach(item => {
        // 过滤
        if(item != 'totalUnReadCount') {
          let target = userChatMemory[item];
          let tempObj = {
            id: item,
            headerImg: target.headerImg,
            userName: target.userName
          }
          let lastMsg;
          // 没有未读消息
          if(target.unReadCount === 0) {
            lastMsg = target.readMsg[target.readMsg.length-1];
            tempObj.unReadCount = 0;
          }
          // 有未读消息
          else {
            lastMsg = target.unReadMsg[target.unReadMsg.length-1];
            tempObj.unReadCount = target.unReadCount;
          }
          // 格式化显示
          if(lastMsg) {
            if(lastMsg.media === 1) {
              tempObj.lastChat = '[图片]';
            }
            else {
              tempObj.lastChat = lastMsg.content;
            }
            tempObj.time = dayjs(lastMsg.timeStamp*1000).fromNow();
            chatHistory.push(tempObj);
            this.setData({
              hasChatHistory: true
            })
          }
        }
      })
      this.setData({
        chatHistory: chatHistory
      })
    }
  },
  // 完善信息
  improveInfomationContent() {
    let chatHistory = this.data.chatHistory;
    let userChatMemory = app.globalData.userChatMemory || wx.getStorageSync('userChatMemory');
    // 遍历信息数组，完善用户信息
    for(let item of chatHistory) {
      if(item.headerImg==="" || item.userName==="") {
        this.getUserInfo(item.id).then( res => {
          if(res.code === 200) {
            // 有需要完善的且完善成功了，进行保存
            item.userName = res.data.nickName;
            item.headerImg = res.data.headerImg;
            userChatMemory[item.id].userName = res.data.nickName;
            userChatMemory[item.id].headerImg = res.data.headerImg;
            this.setData({
              chatHistory: chatHistory
            })
            wx.setStorageSync('userChatMemory', userChatMemory);
            app.globalData.userChatMemory = userChatMemory;
          }
        })
      }
    }
  },
  // 获取用户信息
  getUserInfo(id) {
    return new Promise((resolve, reject) => {
      getRequest(`/user/GetUserInfo?userId=${id}`)
      .then(({data: res}) => {
        resolve(res);
      })
      .catch(({data: res}) => {
        reject(res);
      })
    })
  }
})
