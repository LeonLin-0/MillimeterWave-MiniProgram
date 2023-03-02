// pages/mentalHealth/mentalHealthConclusion/mentalHealthConclusion.js
const app = getApp();
import * as echarts from "../../../ec-canvas/echarts";
let radarChart = null; // 雷达图
// 雷达图配置
let radarOption = {
  radar: {
    indicator: [],
    radius: ['0%','65%'],
    center: ['50%', '50%'],
    axisName: {
      color: '#2861b7',
      fontWeight: 'bold',
      fontSize: '11'
    },
    nameGap: 6,
    axisLine: {
      symbol: ['none','arrow'],
      symbolSize: ['6', '6'],
      lineStyle: {
        color: '#aaa',
      }
    },

  },
  series: [{
    type: 'radar',
    data: []
  }]
}
function initRadarChart(canvas, width, height, dpr) {
  radarChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(radarChart);
  radarChart.setOption(radarOption);
  return radarChart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    psyTitle: "心理测评",
    psyResult: {},
    list: ['躯体化','强迫症状','人际关系敏感','抑郁','焦虑','敌对','恐怖','偏执','精神病性','其他'],
    conclusionList: [],
    isTCM: null, // 判断是否为中医表
    ec: { // 雷达图，初始化雷达图
      onInit: initRadarChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
    })
    let psyResult = JSON.parse(wx.getStorageSync(`${options.resultName}`));
    // 设置标题
    let title = psyResult.msg.match(new RegExp('获取'+'(.*?)'+'结果成功'))[1];
    this.setData({
      psyTitle: title,
    })
    if(title === '中医体质量表测评') {
      this.setData({
        isTCM: true
      })
      this.isTCMData(psyResult.data);
    }
    else {
      this.setData({
        isTCM: false
      })
      this.otherTypeData(psyResult.data);
    }
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
    if(wx.getStorageSync(`${options.resultName}`)) {
      wx.removeStorageSync(`${options.resultName}`)
    }
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
  /**
   * 处理其他类型数据
   */ 
  otherTypeData(data) {
    // 处理数据
    data.avgScore = parseFloat(data.avgScore).toFixed(2);
    let list = this.data.list;
    let conclusionList = [];
    for(let i = 0; i < 10; i++) {
      conclusionList.push({
        itemName: list[i],
        itemConclusion: data.appraise[i]
      })
      // 为雷达图配置做准备
      list[i] = {
        name: list[i],
        max: 5 // 最高5分
      }
    }
    for (let item of data.radarData) {
      item = parseFloat(item.toFixed(2))
    }
    this.setData({
      psyResult: data,
      conclusionList: conclusionList
    })
    // 雷达图配置
    radarOption.radar.indicator = list;
    radarOption.series[0].data = [{
      value: data.radarData,
      name: '测评分数'
    }]
    radarChart.setOption(radarOption);
  },
  /**
   * 处理中医体质量表数据
   */
  isTCMData(data) {
    console.log(data);
    data.avgScore = data.avgScore.toFixed(2);
    this.setData({
      psyResult: {
        avgScore: data.avgScore,
        toTalScore: data.toTalScore
      },
      conclusionList: [
        {
          itemName: '体质类型',
          itemConclusion: data.tizhiType
        },
        {
          itemName: '健康状态',
          itemConclusion: data.principle
        },
        {
          itemName: '体质特征',
          itemConclusion: data.feature
        },
        {
          itemName: '关键点',
          itemConclusion: data.keyPoint
        }
      ]
    })
    
  }
})