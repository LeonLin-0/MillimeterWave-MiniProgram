// pages/personalDataPage/personalDataPage.js
import { getRequest } from '../../utils/util'
import * as echarts from "../../ec-canvas/echarts";
let heartChart = null; // 心率echart
let breathChart = null; // 呼吸echart
const app = getApp();
Page({
  data: {
    headerTitle: "MillimeterWave",
    showChart: false, // 判断是否已经连接
    // 用户个人信息
    userInfo: null,
    getDate: '2022-12-1',
    ec1: { // 心率图
      onInit: initHeartChart
    },
    ec2: { // 呼吸图
      onInit: initBreathChart
    },
    // 情绪感知模块
    emotionText: "未知",
    // 心率
    heartRateNum: 0,
    // 呼吸值
    breathNum: 0,
    // 数据页数
    heartTime: 1,
    breathTime: 1,
    // 获取得到的数据，单纯数字
    originHeartData: [],
    originBreathData: [],
    // 未加时间的原始数据，进行存储合并
    heartRateData: [],
    breathData: [],
    // 总体定时器
    allTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
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
    let allTimer = this.data.allTimer;
    if (allTimer != undefined) {
      clearInterval(allTimer);
    }
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
   * 切换tabBar页面事件
   */
  onTabItemTap() {
    this.upDateDiseaseData();
  },
  // 更新疾病数据
  upDateDiseaseData() {
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
    })
  },
  // 点击进行连接，获取数据，整体的入口
  connectAndStartGetData() {
    // 如果还未登录,先进行登录
    if (this.data.userUnlogin) {
      wx.showToast({
        title: '还未登录',
        icon: 'error',
        duration: 2000,
        mask: true
      })
    }
    // 登陆之后才可连接
    else {
      wx.showModal({
        title: '请确保手机和设备在同一局域网内',
        complete: (res) => {
          if (res.confirm) {
            this.getChartData();
          }
        }
      })
    }
  },

  // 获取图表数据
  getChartData() {
    // 连接获取数据
    if (!this.data.showChart) {
      wx.showLoading({
        title: '正在连接中',
        mask: true
      });
      // 设置定时器，每5秒获取1次数据，再前端模拟一秒显示
      this.data.allTimer = setInterval(() => {
        // 获取呼吸率数据
        this.getBreathData();
        // 获取心率数据
        this.getHeartData().then(() => {
          // 如果还没showChart，则获取到数据后关闭Loading
          if (!this.data.showChart) {
            wx.hideLoading({
              success: (res) => {
                // 绘制空白图表
                this.setData({
                  showChart: true,
                })
              },
            })
          }
          // 进行数据处理和图表绘制
          this.drawBreathChart(this.data.originBreathData);
          this.drawHeartChart(this.data.originHeartData);
        });
      }, 6000);
    }
  },

  // 点击断开连接
  stopConnect() {
    clearInterval(this.data.allTimer);
    this.setData({
      heartRateNum: 0,
      breathNum: 0,
      showChart: false
    })
  },
  // 发送请求获取呼吸数据,整理得出需要的数据
  async getBreathData() {
    return await new Promise((resolve, reject) => {
      let data = {
        page: this.data.breathTime,
        date: this.data.getDate
      };
      // 获取数据
      getRequest('/healthyData/GetBreathData', data).then(({
        data: res
      }) => {
        // 清空
        this.setData({
          originBreathData: [],
          breathTime: this.data.breathTime + 1
        })
        // 赋值
        for (let i = 0; i < res.data.length; i++) {
          this.data.originBreathData.push(res.data[i].data);
        }
        resolve(res);
      }).catch(res => {
        resolve(res);
      });
    })
  },
  // 发送请求获取心跳数据，整理得出需要的数据
  getHeartData() {
    return new Promise((resolve, reject) => {
      let data = {
        page: this.data.heartTime,
        date: this.data.getDate
      };
      // 发送请求
      getRequest('/healthyData/GetHeartData', data).then(({
        data: res
      }) => {
        // 清空
        this.setData({
          originHeartData: [],
          heartTime: this.data.heartTime + 1
        })
        // 赋值
        for (let i = 0; i < res.data.length; i++) {
          this.data.originHeartData.push(res.data[i].data);
        }
        resolve(res);
      }).catch(res => {
        reject(res);
      })
    })
  },

  // 处理数据及画心率图表
  drawHeartChart(newHeartData) {
    console.log(newHeartData);
    let i = 0;
    let timer = setInterval(() => {
      if (this.data.showChart) {
        this.setData({
          heartRateData: this.data.heartRateData.concat(newHeartData[i]), // 数组
          heartRateNum: newHeartData[i]
        })
        console.log('heart: ', i, ' ', newHeartData[i]);
        i += 1;
        if (i >= 5) {
          clearInterval(timer);
        }
        let data = []; // 对数据进行处理，增加x轴的时间
        let tick = 0;
        for (var item of this.data.heartRateData) { // 遍历合并后的原始数据
          data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
          tick += 1; // 一秒一个数据
        }
        // 修改数据
        heartOption.series[0].data = data;
        // 绘图
        heartChart.setOption(heartOption);
      }
    }, 1000);
  },
  // 处理数据及画呼吸波形图
  drawBreathChart(newBreathData) {
    console.log(newBreathData);
    let i = 0;
    let timer = setInterval(() => {
      if (this.data.showChart) {
        this.setData({
          breathData: this.data.breathData.concat(newBreathData[i]), // 数组
          breathNum: newBreathData[i]
        })
        console.log('breath: ', i, " ", newBreathData[i]);
        i += 1;
        if (i >= 5) {
          clearInterval(timer);
        }
        let data = []; // 对数据进行处理，增加x轴的时间
        let tick = 0;
        for (var item of this.data.breathData) { // 遍历合并后的原始数据
          data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
          tick += 1; // 一秒一个数据
        }
        // 修改数据
        breathOption.series[0].data = data;
        // 绘图
        breathChart.setOption(breathOption);
      }
    }, 1000);
  }
})

// 初始化图表
function initHeartChart(canvas, width, height, dpr) {
  heartChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(heartChart);
  heartChart.setOption(heartOption);
  return heartChart;
}

function initBreathChart(canvas, width, height, dpr) {
  breathChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(breathChart);
  breathChart.setOption(breathOption);
  return breathChart;
}

// 心率图表
var heartOption = {
  xAxis: {
    // time: 时间轴，适用于连续的时序
    type: 'time',
    show: true,
    position: "bottom",
    // name: '2s/格，共40s',
    nameLocation: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    // 时间范围：0~30s
    // min: 0,
    // max: 40,
    // 坐标轴的分割段数
    // splitNumber: 15,
    // 显示坐标轴刻度,朝内显示,0.05s一个数据
    axisTick: {
      show: true,
      inside: true
    },
    // 不显示x坐标轴刻度标签
    axisLabel: {
      show: false
    },
  },
  // y轴坐标
  yAxis: {
    show: true,
    position: 'left',
    // value: 适用于连续数据
    type: 'value',
    name: 'bpm',
    nameLocation: 'end',
    min: 0,
    max: 150,
    interval: 50,
    // y轴坐标线
    axisLine: {
      show: false
    },
    // 刻度
    axisTick: {
      show: false
    },
    // 刻度标签
    axisLabel: {
      show: true
    },
  },
  // 为不同范围数值设置不同颜色
  visualMap: [{
    show: false,
    dimension: 1,
    pieces: [{ // 正常范围
        gte: 60,
        lte: 100,
        color: '#1d2e6e'
      },
      { // 太高
        gt: 100,
        color: "#f45d5d"
      },
      { // 太低
        lt: 60,
        color: "#f45d5d"
      }
    ],
  }],
  // 控制图表空白的尺寸
  grid: {
    top: "20%",
    left: "10%",
    right: "5%",
    bottom: "20%"
  },
  // y轴对应数值
  series: [{
    // 不显示点
    showSymbol: false,
    type: 'line',
    smooth: true,
    data: []
  }]
}
// 呼吸图表
var breathOption = {
  // 标题
  // title: {},
  // 提示框,微信小程序不支持
  // tooltip: {},
  // 图例
  // legend: {},
  // x轴坐标
  xAxis: {
    // time: 时间轴，适用于连续的时序
    type: 'time',
    show: true,
    position: "bottom",
    // name: '2s/格，共40s',
    nameLocation: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    // 时间范围：0~30s
    // min: 0,
    // max: 40,
    // 坐标轴的分割段数
    // splitNumber: 15,
    // 显示坐标轴刻度,朝内显示,1s一个数据
    axisTick: {
      show: true,
      inside: true
    },
    // 不显示x坐标轴刻度标签
    axisLabel: {
      show: false
    },
  },
  // y轴坐标
  yAxis: {
    show: true,
    position: 'left',
    // value: 适用于连续数据
    type: 'value',
    name: 'bpm',
    nameLocation: 'end',
    min: 0,
    max: 30,
    interval: 10,
    // y轴坐标线
    axisLine: {
      show: false
    },
    // 刻度
    axisTick: {
      show: false
    },
    // 刻度标签
    axisLabel: {
      show: true
    },
  },
  // 为不同范围数值设置不同颜色
  visualMap: [{
    show: false,
    dimension: 1,
    pieces: [{ // 正常范围
        gte: 12,
        lte: 24,
        color: '#1d2e6e'
      },
      { // 太高
        gt: 24,
        color: "#f45d5d"
      },
      { // 太低
        lt: 12,
        color: "#f45d5d"
      }
    ],
  }],
  // 控制图表空白的尺寸
  grid: {
    top: "20%",
    left: "10%",
    right: "5%",
    bottom: "20%"
  },
  // y轴对应数值
  series: [{
    // 不显示点
    showSymbol: false,
    type: 'line',
    smooth: true,
    data: [],
  }]
}
