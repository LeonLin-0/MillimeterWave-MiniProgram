// pages/personalDataPage/personalDataPage.js

import * as echarts from "../../ec-canvas/echarts";
let heartChart = null; // 心率echart
let breathChart = null; // 呼吸echart

Page({
  data: {
    needFillData: true, // 判断是否需要完善信息
		showPopUp: false, // 判断是否显示弹出层
    showChart: false, // 判断是否已经连接
    // 用户个人信息
    userInfo: {
      avatarURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName: "",
      userAge: "",
      userHeight: 0,
      userWeight: 0,
      userDisease: []
		},
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
    heartTime: 0,
    breathTime: 0,
    // 获取得到的数据，单纯数字
    originHeartData: [],
    originBreathData: [],
    // 未加时间的原始数据，进行存储合并
    heartRateData: [],
    breathData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 初始化，获取登陆状态，没有则从未登陆过，设置为True
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })

    // // 进入页面后，判断个人信息情况，如果信息不完善，则前往完善信息页面
    // if(userInfo.avatarURL==="" || userInfo.avatarURL===undefined) {
    //   this.setData({
    //     needFillData: true,
    //   })
    //   wx.setStorageSync('needFillData', this.data.needFillData);
    // } else { // 有信息后，赋值显示
    //   this.setData({
    //     userInfo: userInfo,
    //     needFillData: false
    //   })
    //   wx.setStorageSync('needFillData', this.data.needFillData);
    // }
    
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
      needFillData: wx.getStorageSync('needFillData')
    })

    // 没登陆过 或 登录完注销了
    // if(userUnlogin==="" || userUnlogin===true) {
    //   console.log("!");
    //   this.setData({
    //     userUnlogin: true,
    //     userInfo: {
    //       avatarURL: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
    //       nickName: "",
    //       userAge: 0
    //     }
    //   })
    // } 
    // else {
    //   // 登陆过且没注销且有个人信息
    //   if(userUnlogin==false && userInfo!="") { // 如果已登录且有userInfo
    //     this.setData({
    //       userUnlogin: false,
    //       userInfo: userInfo
    //     })
    //   }
    // }

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
	
  // 显示弹出层
  onShowPopUp() {
    this.setData({
      showPopUp: true
    })
  },
  // 关闭弹出层
  onClosePopUp() {
    this.setData({
      showPopUp: false
    })
  },
  // 获取头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    let img = 'userInfo.avatarURL';
    this.setData({
      [img]: avatarUrl
    })
  },
  // 获取名字
  getNickName(e) {
    const { value } = e.detail;
    let name = 'userInfo.nickName';
    this.setData({
      [name]: value
    })
  },
  // 获取年纪
  getUserAge(e) {
    const { value } = e.detail;
    let age = 'userInfo.userAge';
    this.setData({
      [age]: value
    })
  },
  // 提交个人信息
  submitAllData() {
    // 判断是否完整填写
    let data = this.data.userInfo;
    // 临时设置
    this.setData({
      ['userInfo.userDisease']: ['心脏病','I型糖尿病','高血压','高血脂']
    })
    if (data.avatarURL==="" || data.nickName==="" || data.userAge===undefined) {
      wx.showModal({
        title: "请完整填写信息"
      })
    } else {
      // 将个人信息写入Storge，方便获取
      wx.setStorageSync('userInfo', data);
      wx.setStorageSync('userUnlogin', false);
      this.setData({
        userUnlogin: false,
        showPopUp: false
			});
    }
  },
  // 跳转到我的页面
  toMyPage() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  toFillInfoPage() {
    wx.navigateTo({
      url: '/pages/modifyPage/modifyPage',
    })
  },
  // 如果没有疾病信息则前往完善疾病信息
  fillDiseaseData() {
    console.log("前往完善数据页面");
  },
  // 判断是否未登录
  checkLogin() {
    // if (wx.getStorageSync('userUnlogin') == true) {
    //   this.setData({
    //     userInfo: wx.getStorageSync('userInfo'),
    //     userUnlogin: false
    //   })
    // }
  },
  // 情绪感知
  judgeEmotion() {
    let background = 'emotion.emotionBackground';
    let icon = 'emotion.emotionIcon';
    switch (this.data.emotion.emotionText) {
      case '未知': {
        this.setData({
          [background]: '-emotion-unknown',
          [icon]: '/icon/unknown.png'
        })
        break;
      }
      case '愉悦': {
        this.setData({
          [background]: '-emotion-happy',
          [icon]: '/icon/happy.png'
        });
        break;
      }
      case '平静': {
        this.setData({
          [background]: '-emotion-calm',
          [icon]: '/icon/calm.png'
        });
        break;
      }
      case '压力': {
        this.setData({
          [background]: '-emotion-stressful',
          [icon]: '/icon/stressful.png'
        })
      }
    }
  },
	// 点击进行连接，获取数据，整体的入口
	connectAndStarttpGetData() {
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
			// 连接获取数据
			if(!this.data.showChart) {
				wx.showLoading({
					title: '正在连接中',
					mask: true
        });
        // this.getBreathData(this.data.originBreathData);
        this.getHeartData(this.data.originHeartData).then(()=> {
          wx.hideLoading({
            success: (res) => {
              console.log("接收到数据");
            },
          })          
        });

        // 设置定时器，每5秒获取1次数据，再前端模拟一秒显示
        // setInterval(()=>{
        //   // 按次序获取数据，第一次要关闭loading
        //   this.getBreathData();
        //   this.getHeartData().then( () => {
        //     // 如果还没showChart，则获取到数据后关闭Loading
        //     if(!this.data.showChart) {
        //       wx.hideLoading({
        //         success: (res) => {
        //           // 绘制空白图表
        //           this.setData({
        //             showChart: true,
        //           })
        //         },
        //       })
        //     }
        //     // 进行数据处理和图表绘制
        //     this.drawBreathChart(this.data.originBreathData);
        //     this.drawHeartChart(this.data.originHeartData);
        //   });
        // },6000);
			}			
		}
	},
  // 发送请求获取呼吸数据,整理得出需要的数据
	async getBreathData() {
    // 获取数据
    const {data: res} = await wx.p.request({
			url: `http://10.151.7.75:8090/data2/${this.data.heartTime}/2022-12-01`,
      method: 'GET',
    })
    // 清空
    this.setData({
      originBreathData: []
    })
    // 赋值
    for(let i=0; i<res.data.length; i++) {
      this.data.originBreathData.push(res.data[i].data);
    }
    return res;
  },
  // 发送请求获取心跳数据，整理得出需要的数据
  async getHeartData() {
    const { data: res } = await wx.p.request({
      url: `http://10.151.7.75:8090/heartData/2022-12-01`,
      method: 'GET',
    })
    console.log(res);
    // 清空
    this.setData({
      originHeartData: []
    })
    // 赋值
    for (let i=0; i<3000; i++) {
      console.log(res.data[i]);
      this.data.originHeartData.push(res.data[i].data);
    }
    return res;
  },

  // drawHeartChart(newHeartData) {
  //     let data = []; // 对数据进行处理，增加x轴的时间
  //     let tick = 0;
  //     console.log(newHeartData);
  //     for(var item of newHeartData) { // 遍历合并后的原始数据
  //       data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
  //       tick += 1; // 一秒一个数据
  //     }
  //     // 修改数据
  //     heartOption.series[0].data = data;
  //     // 解决报错
  //     setTimeout( () => {
  //       heartChart.setOption(heartOption);
  //     },100)
  //     clearTimeout(); 
  // },
  // drawBreathChart(newBreathData) {
  //     let data = []; // 对数据进行处理，增加x轴的时间
  //     let tick = 0;
  //     for(var item of newBreathData) { // 遍历合并后的原始数据
  //       data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
  //       tick += 1; // 一秒一个数据
  //     }
  //     // 修改数据
  //     breathOption.series[0].data = data;
  //     // 解决报错
  //     setTimeout( () => {
  //       breathChart.setOption(breathOption);
  //     },100)
  //     clearTimeout(); 
  // },
  
	// 处理数据及画心率图表
	drawHeartChart(newHeartData) {
    console.log(newHeartData);
    let i = 0;
    let timer = setInterval(()=>{
      this.setData({
        heartRateData: this.data.heartRateData.concat(newHeartData[i]), // 数组
        heartRateNum: newHeartData[i]
      })
      console.log('heart: ',i,' ', newHeartData[i]);
      i+=1;
      if(i>=5) {
        clearInterval(timer);
      }

      let data = []; // 对数据进行处理，增加x轴的时间
      let tick = 0;
      for(var item of this.data.heartRateData) { // 遍历合并后的原始数据
        data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
        tick += 1; // 一秒一个数据
      }
      this.setData({
        heartTime: this.data.heartTime + 1,
      })
      // 修改数据
      heartOption.series[0].data = data;
      // 解决报错
      setTimeout( () => {
        heartChart.setOption(heartOption);
      },100)
      clearTimeout();      
    },1000);
  },

  // 处理数据及画呼吸波形图
	drawBreathChart(newBreathData) {
    let i = 0;
    let timer = setInterval(()=>{
      this.setData({
        breathData: this.data.breathData.concat(newBreathData[i]), // 数组
        breathNum: newBreathData[i]
      })
      console.log('breath: ',i," ",newBreathData[i]);
      i+=1;
      if(i>=5) {
        clearInterval(timer);
      }
      let data = []; // 对数据进行处理，增加x轴的时间
      let tick = 0;
      for(var item of this.data.breathData) { // 遍历合并后的原始数据
        data.push([+tick.toFixed(2), +(+item).toFixed(5)]);
        tick += 1; // 一秒一个数据
      }
      this.setData({
        breathTime: this.data.greathTime + 1,
      })
      // 修改数据
      breathOption.series[0].data = data;
      // 解决报错
      setTimeout( () => {
        breathChart.setOption(breathOption);
      },100)
      clearTimeout();      
    },1000);
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
		axisTick: { show: true, inside: true },
		// 不显示x坐标轴刻度标签
		axisLabel: { show: false },
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
		axisLine: { show: false },
		// 刻度
		axisTick: { show: false },
		// 刻度标签
		axisLabel: { show: true },
	},
	// 为不同范围数值设置不同颜色
	visualMap: [{
		show: false,
		dimension: 1,
		pieces: [
		{ // 正常范围
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
		}],
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
		axisTick: { show: true, inside: true },
		// 不显示x坐标轴刻度标签
		axisLabel: { show: false },
	},
	// y轴坐标
  yAxis: {
		show: true,
		position: 'left',
		// value: 适用于连续数据
		type: 'value',
		name: 'mV',
		nameLocation: 'end',
		min: 0,
		max: 30,
		interval: 10,
		// y轴坐标线
		axisLine: { show: false },
		// 刻度
		axisTick: { show: false },
		// 刻度标签
		axisLabel: { show: true },
	},
	// 为不同范围数值设置不同颜色
	visualMap: [{
		show: false,
		dimension: 1,
		pieces: [
		{ // 正常范围
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
		}],
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
