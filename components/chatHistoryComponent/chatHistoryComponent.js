// components/chatHistoryComponent/chatHistoryComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chatInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toChatRoom() {
      let id = this.properties.chatInfo.id;
      let userName = this.properties.chatInfo.userName;
      let headerImg = this.properties.chatInfo.headerImg;
      wx.navigateTo({
        url: `/pages/mentalHealth/chatRoom/chatRoom?id=${id}&name=${userName}&img=${headerImg}`,
      })
    }
  }
})
