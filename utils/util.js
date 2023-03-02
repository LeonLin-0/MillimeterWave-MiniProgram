const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const ip = 'https://www.blueparadox.club/v1';
const WebSocketIP = 'wss://blueparadox.club/ws';

/**
 * 发送GET请求
 * @param {String} url 接口URL
 * @param {Object} data 数据
 */
const getRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: `${ip}${url}`,
      header: {
        'Content-Type': 'application/json',
        'X-Token': wx.getStorageSync('x-token') || app.globalData.xToken
      },
      data: data,
      success: res => {
        let obj = {
          header: res.header,
          data: res.data
        }
        resolve(obj);
      },
      fail: res => {
        let obj = {
          header: res.header,
          data: res.data
        }
        reject(obj);
      }
    })
  })
}
/**
 * 发送POST请求
 * @param {String} url 
 * @param {Object} data 
 */
const postRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: `${ip}${url}`,
      header: {
        'Content-Type': 'application/json',
        'X-Token': wx.getStorageSync('x-token') || app.globalData.xToken
      },
      data: data,
      success: res => {
        let obj = {
          header: res.header,
          data: res.data
        }
        resolve(obj);
      },
      fail: ({data: res}) => {
        wx.showToast({
          title: `res.msg`,
          icon: 'error',
          duration: 800
        })
        reject(res);
      }
    })
  })
}
module.exports = {
  formatTime,
  ip,
  WebSocketIP,
  getRequest,
  postRequest
}
