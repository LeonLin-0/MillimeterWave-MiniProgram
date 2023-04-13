// pages/mentalHealth/chatRoom/chatRoom.js
const { ip, getRequest, postRequest } = require("../../../utils/util");
// 全局录音管理器
const audioManager = wx.getRecorderManager()
// 获得app数据栈
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    chatName: '',
    chatImg: "",
    useAnimation: false, // 使用滑动效果
    userInput: '', // 用户输入框内容
    isRotate: false, // 是否展开功能区
    isAudio: false, // 使用语音输入
    lastMsgId: '', // 最后一条信息的id
    scrollViewHeight: "94vh", // 聊天窗口高度
    inputContainerHeight: '0px', // 输入框高度
    audioText: '按住 说话', // 录音按钮显示文字
    sendAudio: false, // 是否发送录音
    audioStartPoint: undefined, // 开始录音时手指的位置
    audioEndPoint: undefined, // 录音结束时手指的位置
    audioOption: {
      duration: 60000, // 语音最长60s
      sampleRate: 16000, // 采样率
      numberOfChannels: 2, // 通道数
      encodeBitRate: 96000, // 编码率
      format: 'mp3', // 格式
      frameSize: 50, // 帧的大小
      audioSource: 'audio', // 自适应输入源
    }, // 录音参数
    allMsgList: [], // 全部消息记录
    msgList: [], // 显示的聊天记录
    msgPage: 1,
    total: 0, // 统计收到的信息数
    unReadCount: null,
    sendModule: {
      fromId: '2',
      toId: '0',
      objectType: 5,
      media: 0, // 文本信息
      content: "",
      isRead: 0,
      timeStamp: null,
      amout: 0
    }, // 发送信息的模板
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取聊天双方id
    this.setData({
      userInfo: app.globalData.userInfo,
      ['sendModule.toId']: options.id,
      ['sendModule.fromId']: app.globalData.userInfo.userId+"",
      chatName: options.name,
      chatImg: options.img
    })
    // 获取聊天记录
    let allMsg = app.globalData.userChatMemory || wx.getStorageSync('userChatMemory');
    let targetMsg = allMsg[options.id];
    // 从咨询页面进入，可能暂无聊天记录
    if(!targetMsg) {
      // 创建该用户的聊天记录
      targetMsg = {
        headerImg: '',
        userName: '',
        readMsg: [],
        unReadMsg: [],
        unReadCount: 0
      }
    }
    // 将已读信息和未读信息合并后赋给页面信息数组，总未读消息数减少，清空未读消息，未读消息数清零
    let msgList = [...targetMsg.readMsg, ...targetMsg.unReadMsg];
    this.setData({
      allMsgList: msgList,
      msgList: msgList.slice(-15*this.data.msgPage)
    })
    this.setData({
      unReadCount: targetMsg.unReadMsg.length
    })
    // 更新聊天对象信息
    // this.getChatObjectMsg(options.id).then(res => {
    //   let target = res.data;
    //   if(this.data.chatImg != target.headerImg || this.data.chatName != target.nickName) {
    //     this.setData({
    //       chatName: target.nickName,
    //       chatImg: target.headerImg
    //     })
    //     targetMsg.headerImg = target.headerImg;
    //     targetMsg.userName = target.nickName;
    //   }
    // })
    targetMsg.readMsg = msgList;
    targetMsg.unReadMsg = [];
    allMsg.totalUnReadCount -= targetMsg.unReadCount;
    targetMsg.unReadCount = 0;
    allMsg[options.id] = targetMsg;
    // 发送对应用户的离线ACK
    this.sendAck(this.data.unReadCount);
    // 存储修改后的聊天记录
    app.globalData.userChatMemory = allMsg;
    wx.setStorageSync('userChatMemory', allMsg);
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
    // 将信息监听切换到聊天室模式
    app.getMessageInChatRoom();
    app.globalData.websocket.onMessage(({data:data}) => {
      if(app.globalData.inChatRoom == true) {
        // 将信息存储到对应聊天用户的已读列表中
        this.getMsgIntoReadList(data);
      }
    })
    // 滚动到最新消息的位置
    this.scrollToLastMsg();
    // 设置使用滚动
    this.setData({
      useAnimation: true
    })
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
    // 退出当前页面，将聊天记录存到本地，将信息监听模式改为其他模式
    let userChatMemory = app.globalData.userChatMemory || wx.getStorageSync('userChatMemory');
    // 因为进入页面时已将未读信息清空，所以只需要存入已读数组就好
    userChatMemory[this.data.sendModule.toId].readMsg = this.data.allMsgList;
    // 保存到本地
    app.globalData.userChatMemory = userChatMemory;
    wx.setStorageSync('userChatMemory', userChatMemory);
    app.getMessageInOtherPlaces();
    this.sendAck(this.data.total); // 发送ack确认收到信息
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
  // 获取目标用户聊天信息
  getChatObjectMsg(id) {
    return new Promise((resolve, reject) => {
      getRequest(`/user/GetUserInfo?userId=${id}`)
      .then(({data: res}) => {
        resolve(res);
      }).catch(({data: res}) => {
        reject(res);
      })
    })
  },
  // 发送ack
  sendAck(num) {
    if(num != 0) {
      postRequest('/IM/PostACK', 
      {
        ack: "ok",
        total: num,
        toId: +this.data.sendModule.toId
      }).then(({data: res}) => {
        console.log(res);
      })
    }
  },
  // 滚动到最后一条信息
  scrollToLastMsg() {
    this.setData({
      lastMsgId: `msg-${this.data.msgList.length-1}`
    })
  },
  // 触碰顶部
  touchTop(e) {
    wx.showToast({
      title: `加载中`,
      icon: 'loading'
    })
    this.setData({
      msgPage: this.data.msgPage + 1
    })
    let page = this.data.msgPage;
    this.setData({
      msgList: [...this.data.allMsgList.slice(-15*page, -15*(page-1)), ...this.data.msgList]
    })
    if(this.data.allMsgList.length < this.data.msgPage*15) {
      wx.showToast({
        title: '已无更多信息',
        icon: 'none',
        duration: 800
      })
    }
    else {
      wx.hideToast();
    }
  },
  // 获取当前时间戳
  getNowTimeStamp() {
    // 微信小程序需要套一层parse
    let date = Date.parse(Date());
    return parseInt(date/1000);
  }, 
  // 获取用户输入的内容
  getUserInput(e) {
    this.setData({
      userInput: e.detail.value
    })
  },
  // 展开||关闭功能区
  showFunctionArea() {
    this.setData({
      isRotate: !this.data.isRotate,
    })
    this.scrollToLastMsg();
  },
  // 关闭功能区
  closeFunctionArea() {
    this.setData({
      isRotate: false,
    })
    this.scrollToLastMsg();
  },
  // 键盘弹起时缩短scroll-view高度，调高输入框高度
  adjustScrollHeightToShort(e) {
    // 因为不能同时绑定两个事件，所有视情况执行关闭功能框
    if(this.data.isRotate) {
      this.closeFunctionArea();
    }
    let windowHeight = wx.getSystemInfoSync().windowHeight;
    let keyboardHeight = e.detail.height;
    this.setData({
      scrollViewHeight: +(windowHeight-keyboardHeight)+"px",
      inputContainerHeight: (+keyboardHeight)+"px"
    })
    // 显示最新消息
    this.scrollToLastMsg();
  },
  // 键盘关闭时伸长scroll-view高度，调低输入框高度
  adjustScrollHeightToLong(e) {
    this.setData({
      scrollViewHeight: "94.5vh",
      inputContainerHeight: "0px"
    })
  },
  // 选择语音输入
  audioInput() {
    // 开启录音权限
    this.setData({
      isAudio: true,
      isRotate: false
    })
  },
  // 长按开始录音
  handleRecordStart(e) {
    // 记录开始位置
    this.setData({
      audioStartPoint: e.detail.y
    })
    // 提示上滑取消录音
    wx.showToast({
      title: '上滑取消录音',
      icon: 'none',
      duration: 2000
    })
    // 开启录音
    audioManager.start(this.data.audioOption);
  },
  // 停止触摸结束录音
  handleRecordEnd(e) {
    // 停止录音
    audioManager.stop();
    // 判断是否需要发送录音
     if(this.data.sendAudio) {
      //  对录音停止监控
      audioManager.onStop(res => {
        // 对录音时长进行判断，<2s的不发送，并提示录音时长太短
        if(res.duration < 2000) {
          wx.showToast({
            title: '录音时长太短',
            icon: 'error',
            duration: 800
          })
        }
        else {
          // 获取临时地址
          const { tempFilePath } = res;
          // 上传录音文件

        }
      })
     }
  },
  // 转换为键盘输入
  useKeyBoard() {
    this.setData({
      isAudio: false
    })
  },
  // 发送文字信息
  sendMsg() {
    let input = this.data.userInput;
    // 判断是否为空输入
    if(input === '') {
      wx.showToast({
        title: '内容不可为空',
        icon: 'error',
        duration: 800
      })
    }
    else {
      // 修改模板内容
      this.setData({
        ['sendModule.media']: 0,
        ['sendModule.content']: input,
        ['sendModule.timeStamp']: this.getNowTimeStamp()
      })
      this.sendMsgToWebsocket();
      // 清空用户输入
      this.setData({
        userInput: ''
      })
    }
  },
  // 发送图片：只能发图片，一次最多一张
  sendPic() {
    this.setData({
      isRotate: false
    })
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      // 选择图片后
      success: res => {
        let file = res.tempFiles[0];
        // 上传图片获取返回的链接
        wx.uploadFile({
          filePath: file.tempFilePath,
          name: 'file',
          url: `${ip}/IM/UploadImages`,
          header: {
            'x-token': wx.getStorageSync('x-token')
          },
          formData: {
            "fromId": this.data.userInfo.userId,
            "toId": this.data.sendModule.toId
          },
          success: ({data: res}) => {
            res = JSON.parse(res);
            let picList = res.data.list;
            // 获得返回的图片链接
            this.setData({
              ['sendModule.media']: 1,
              ['sendModule.content']: picList[0],
              ['sendModule.timeStamp']: this.getNowTimeStamp()
            })
            // 发送信息
            this.sendMsgToWebsocket();
          }
        })
      },
      // 退出选择
      fail: res => {
        console.log(res);
      }
    })
  },
  // 将信息发送到websocket
  sendMsgToWebsocket() {
    // 发送信息
    app.sendMsg(this.data.sendModule)
    .then(res => {
      // 发送成功
      if(res.errMsg.split(":")[1] == 'ok') {
        // 拼接到聊天记录中
        this.setData({
          msgList: [...this.data.msgList, {...this.data.sendModule}],
          allMsgList: [...this.data.allMsgList, {...this.data.sendModule}]
        })
        // 上滑scroll-view
        this.scrollToLastMsg();
      }
    });
  },
  // 将获得的信息存到已读列表中
  getMsgIntoReadList(msg) {
    let formatMsg = JSON.parse(msg);
    let targetChatID = formatMsg.fromId;
    // 如果信息为当前聊天对象所发
    if(targetChatID == this.data.sendModule.toId) {
      console.log('read');
      // 将信息存入当前信息列表
      this.setData({
        msgList: [...this.data.msgList, {...formatMsg}],
        allMsgList: [...this.data.allMsgList, {...formatMsg}],
        total: this.data.total + 1
      })
      // 滚动到最新消息的位置
      this.scrollToLastMsg();
    }
    // 收到的信息不是该用户所发，存入总聊天消息记录中
    else {
      app.msgInOtherPlaces(msg);
    }
  },
})