// components/headerTitle/headerTitle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String
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
    // 根据页面路径返回上一页
    goBack() {
      let page = getCurrentPages();
      let length = page.length;
      let path = page[length-1].route;
      let secondFromPath = page[length-2].route;
      if(path !== 'pages/mentalHealth/mentalHealthConclusion/mentalHealthConclusion') {
        wx.navigateBack({
          delta: -1,
        })
      }
      else if (secondFromPath === 'pages/mentalHealth/mentalHealthHistory/mentalHealthHistory') {
        wx.navigateBack({
          delta: -1,
        })
      }
      else {
        wx.switchTab({
          url: '/pages/mentalHealth/mentalHealthHomePage/mentalHealthHomePage',
        })
      }
    }
  }
})
