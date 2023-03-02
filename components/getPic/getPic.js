// components/getPic/getPic.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: Object,
    userPic: String
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
    // 点击预览图片
    previewPic(e) {
      let imgUrl = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: [imgUrl],
        current: imgUrl,
        showmenu: true
      })
    },
  }
})
