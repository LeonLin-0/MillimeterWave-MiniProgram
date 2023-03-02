// app.js
import { ip, WebSocketIP } from "./utils/util"
const sendModule = {
	"msgId": "",
	"fromId": "",
	"toId": "",
	"objectType": 6,
	"media": 0,
	"content": "ping",
	"isRead": 0,
	"timeStamp": 0,
	"amout": 0
};
App({
  // 初始化
  onLaunch() {
    // 判断是否已经登录
    if(wx.getStorageSync('userInfo')&& wx.getStorageSync('x-token')) {
      // 获取userInfo
      this.globalData.userInfo = wx.getStorageSync('userInfo') || {};
      // 获取userChatMemory
      this.initUserChatMemory();
      // 连接websocket
      this.initWebSocket();
      // 将信息监听调至其他模式
      this.initChatMethod();
      // 监听websocket是否断开
      this.restartWebsocket();
      wx.switchTab({
        url: '/pages/personalData/personalData',
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  globalData: {
    xToken: null,
    userInfo: null,
    websocket: null,
    userChatMemory: null,
    inChatRoom: false,
    connectState: false
  },
  /**
   * 初始化websocket
   */
  initWebSocket() {
    this.globalData.websocket = wx.connectSocket({
      url: `${WebSocketIP}`,
      header: {
        'x-token': wx.getStorageSync('x-token')
      },
      success: res => {
        this.globalData.connectState = true;
        console.log(res);
      }
    })
  },
  /*
   * 初始化信息监听为其他模式
   */
  initChatMethod() {
    console.log('初始化为其他模式');
    this.globalData.websocket.onMessage(({data: data}) => {
      if(this.globalData.inChatRoom == false) {
        this.msgInOtherPlaces(data);
      }
    })
    const heartTimer = setInterval(()=> {
      this.sendMsg(sendModule);
    }, 60000)
  },
  // 监听websocket关闭，让其重开
  restartWebsocket() {
    this.globalData.websocket.onClose(() => {
      if(this.globalData.connectState === true) {
        console.log("websocket连接断开，即将重连");
        this.globalData.connectState = false;
        this.initWebSocket();
        this.initChatMethod();
      }
    });
  },
  /**
   * 发送信息
   * @param {Object} msg
   */
  sendMsg(msg) {
    let that = this;
    return new Promise (function(resolve, reject) {
      that.globalData.websocket.send({
        data: JSON.stringify(msg),
        success: res => {
          resolve(res);
        },
        fail: res => {
          console.log(res);
          wx.showToast({
            title: '请重试',
            icon: 'error',
            duration: 800
          })
          that.initWebSocket();
        }
      })
    });
  },
  // 信息监听切换到聊天室模式
  getMessageInChatRoom() {
    this.globalData.inChatRoom = true;
  },
  // 信息监听切换到其他模式
  getMessageInOtherPlaces() {
    this.globalData.inChatRoom = false; 
  },
  // 聊天室外将信息存入未读消息数组
  msgInOtherPlaces(msg) {
    let formatMsg = JSON.parse(msg);
    let userChatMemory = wx.getStorageSync('userChatMemory');
    let targetChatID = formatMsg.fromId;
    let objectType = formatMsg.objectType;
    // 本地聊天记录内没有该用户且非心跳包，为该用户创建记录
    if(objectType != "6") {
      console.log("unread");
      if(userChatMemory[targetChatID] == undefined) {
        userChatMemory[targetChatID] = {
          headerImg: '',
          userName: '',
          readMsg: [],
          unReadMsg: [formatMsg],
          unReadCount: 1
        }
      }
      // 本地聊天记录内有该用户，将信息计入未读数组内，并更新该用户的未读信息数以及总未读信息数
      else {
        let unReadMsg = userChatMemory[targetChatID].unReadMsg;
        userChatMemory[targetChatID].unReadMsg.push(formatMsg);
        userChatMemory[targetChatID].unReadCount = unReadMsg.length;
      }
      // 更新总未读信息数
      userChatMemory.totalUnReadCount = userChatMemory.totalUnReadCount + 1;
      // 更新数据
      this.globalData.userChatMemory = userChatMemory;
      // 更新本地数据
      wx.setStorageSync('userChatMemory', userChatMemory);
    }
  },
  /**
   * 初始化聊天记录
   */
  async initUserChatMemory() {
    // 如果用户已经登陆过
    if(wx.getStorageSync('x-token')) {
      var userChatMemory = wx.getStorageSync('userChatMemory') || {};
      // 本地没有存储聊天记录
      if(JSON.stringify(userChatMemory) === '{}') {
        userChatMemory = { totalUnReadCount: 0 };
        // 获取历史消息，有则存储，没有则跳过
        await this.getHistoryMsg().then(({data: res}) => {
          if(res.list) {
            res.list.forEach(item => {
              userChatMemory[item.Id] = {
                headerImg: "",
                userName: "",
                readMsg: [...item.msg],
                unReadMsg: [],
                unReadCount: 0
              };
            });            
          }
        });
        // 获取离线消息，有则存储且更新未读数，没有则跳过
        await this.getOfflineMsg().then(({data: res}) => {
          if(res.total != 0) {
            if(res.list) {
              res.list.forEach(item => {
                if(userChatMemory[item.fromId]) {
                  userChatMemory[item.fromId].unReadMsg = [...item.msg];
                  userChatMemory[item.fromId].unReadCount = +item.total;
                }
                else {
                  userChatMemory[item.fromId] = {
                    headerImg: "",
                    userName: "",
                    readMsg: [],
                    unReadMsg: [...item.msg],
                    unReadCount: +item.total
                  }
                }
                userChatMemory.totalUnReadCount += item.total;
              })
            }
          }
        })
      }
      // 本地有存储聊天记录
      else {
        // 发送请求获取离线消息，有则存储且更新未读数，没有则跳过
        await this.getOfflineMsg().then(({data: res}) => {
          if(res.list) {
            res.list.forEach(item => {
              if(userChatMemory[item.fromId]) {
                userChatMemory[item.fromId].unReadMsg = [...userChatMemory[item.fromId].unReadMsg, ...item.msg];
                userChatMemory[item.fromId].unReadCount = userChatMemory[item.fromId].unReadCount+item.total;
              }
              else {
                userChatMemory[item.fromId] = {
                  headerImg: "",
                  userName: "",
                  readMsg: [],
                  unReadMsg: [...item.msg],
                  unReadCount: +item.total
                }
              }
              userChatMemory.totalUnReadCount += item.total;
            })            
          }
        })
      }
      // 最后将新的历史消息存储到本地
      wx.setStorageSync('userChatMemory', userChatMemory);
      this.globalData.userChatMemory = userChatMemory;
    }
  },
  // 获取历史消息
  getHistoryMsg() {
    return new Promise(function(resolve, reject) {
      wx.request({
        method: 'GET',
        url: `${ip}/IM/GetHistoryMsg`,
        header: { 'x-token': wx.getStorageSync('x-token') },
        success: ({data: res}) => {
          // 将获取的历史信息覆盖原有信息
          resolve(res);
        },
        fail: ({data: res}) => {
          reject(res);
        }
      })    
    })
  },
  // 获取离线消息
  getOfflineMsg() {
    return new Promise(function(resolve, reject) {
      wx.request({
        method: 'GET',
        url: `${ip}/IM/GetOfflineMsg`,
        header: { 'x-token': wx.getStorageSync('x-token') },
        success: ({data: res}) => {
          resolve(res);
        },
        fail: ({data: res}) => {
          reject(res);
        }
      })      
    })
  },
})
