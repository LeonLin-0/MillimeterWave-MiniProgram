// pages/historyDetail/historyDetail.js

import * as echarts from "../../ec-canvas/echarts";
let sleepChart = null; // 睡眠饼图
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    time: {
      sleepTime: 7.1,
      goBedTime: "00:40",
      wakeUpTime: "7:46",
      midWakeUpTimeLength: 0,      
    },
    heart: {
      baseHeartRate: 62,
      heightestHeartRate: 70,
      lowestHeartRate: 39,
      heartAnalysisText: ''
    },
    breath: {
      averageBreathRate: 18,
      heightestBreathRate: 34,
      lowestBreathRate: 7,
      breathAnalysisText: ''
    },
    sleepConclusionAndSuggest: '',
    ec: { // 睡眠饼图,初始化饼图
      onInit: function initSleepChart(canvas, width, height, dpr) {
        sleepChart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        })
        canvas.setChart(sleepChart);
        sleepChart.setOption(sleepOption);
        return sleepChart;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: options.date.split("/")
    })
    // 格式化睡眠时间
    let time = this.getSleepTime();
    sleepOption.series[0].data = [
      {
        value: this.data.time.sleepTime,
        name: `睡眠${time[0]}小时${time[1]}分钟`
      },
      {
        value: 24-this.data.time.sleepTime,
        name: `清醒${23-time[0]}小时${60-time[1]}分钟`
      }
    ];
    // 解决报错
    let timer1 = setTimeout(()=> {
      sleepChart.setOption(sleepOption);
    },100)
    clearTimeout(timer1);
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
    // 睡眠分析
    this.sleepAnalysis();
    // 心率分析
    this.heartAnnalysis();
    // 呼吸率分析
    this.breathAnalysis();
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
  // 格式化睡眠时间
  getSleepTime() {
    let time = this.data.time.sleepTime;
    return [parseInt(time),+(time%1*60).toFixed(0)]
  },
  // 睡眠分析
  sleepAnalysis() {
    let sleepLength = this.data.time.sleepTime;
    let goBedTime = this.data.time.goBedTime.split(":");
    let time = this.getSleepTime();
    let text = '';
    if(sleepLength>=6) {
      text = `成年人正常睡眠时长为6~8小时，您的睡眠时长为${time[0]}小时${time[1]}分钟，您的睡眠是充足的。`
      if(+goBedTime[0]>=23 || +goBedTime[0]<=7) {
        text = text + `您有熬夜情况，您昨晚的睡眠时间为${this.data.time.goBedTime}，建议您保持早睡早起的良好作息。`;
      }
    }
    this.setData({
      sleepConclusionAndSuggest: text
    })
  },
  // 心率分析
  heartAnnalysis() {
    let heightHeartRate = this.data.heart.heightestHeartRate;
    let lowHeartRate = this.data.heart.lowestHeartRate;
    let heartText="";
    if(heightHeartRate<=80 && lowHeartRate>=40) {
      heartText = "睡眠心率正常";
    }
    if(heightHeartRate>80){
      heartText = `发生心率过速，最高心率为${heightHeartRate}bpm`;
      if(lowHeartRate<40) {
        heartText = heartText + `\n发生心率过低，最低心率为${lowHeartRate}bpm`;
      }
    } else {
      if(lowHeartRate<40) {
        heartText = `发生心率过低，最低心率为${lowHeartRate}bpm`;
      }      
    }
    this.setData({
      ['heart.heartAnalysisText']: heartText
    })
  },
  // 呼吸率分析
  breathAnalysis() {
    let heightBreathRate = this.data.breath.heightestBreathRate;
    let lowBreathRate = this.data.breath.lowestBreathRate;
    let breathText="";
    if(heightBreathRate<=24 && lowBreathRate>=8) {
      breathText = `睡眠呼吸率正常`;
    }
    if(heightBreathRate>24) {
      breathText = `发生呼吸率过速，最高过速呼吸率为${heightBreathRate}bpm`;
      if(lowBreathRate<8) {
        breathText = breathText+`\n发生呼吸率过低，最低睡眠呼吸率为${lowBreathRate}bpm`;
      }    
    } else {
      if(lowBreathRate<8) {
        breathText = `发生呼吸率过低，最低睡眠呼吸率为${lowBreathRate}bpm`;
      }      
    }
    this.setData({
      ['breath.breathAnalysisText']: breathText
    })
  },
})

// 睡眠饼图配置
var sleepOption = {
  series: [
    {
      type: 'pie',
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '25',
          fontWeight: 'bold',
        }
      },
      itemStyle: {
        borderRadius: 10
      },
      color: ['#0058dd','#fff'],
      data: [],
      radius: ['55%', '90%']
    }
  ]
}