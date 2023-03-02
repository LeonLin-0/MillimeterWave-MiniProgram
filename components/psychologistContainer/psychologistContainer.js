// pages/mentalHealth/psychologistContainer/psychologistContainer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    psyInfo: Object
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
    // 前往详细信息页面
    toDetailPage() {
      let info = JSON.stringify(this.properties.psyInfo);
      wx.navigateTo({
        url: `/pages/mentalHealth/psychologistDetailPage/psychologistDetailPage?psyInfo=${info}`,
      })
    }
  }
})
