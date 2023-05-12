// pages/setOrderPage/setOrderPage.js
import dayjs from 'dayjs';
import { postRequest } from '../../utils/util';
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '设置预约',
    userInfo: {},
    date: '',
    startTime: '',
    endTime: '',
    reserved: 0,
    finalOrderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initForm();
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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
  // 删除不需要的预约时间
  deleteOrder(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.finalOrderList;
    list.splice(index, 1);
    this.setData({
      finalOrderList: list
    })
  },
  // 初始化
  initForm() {
    let day = dayjs(Date.now());
    let date = day.format('YYYY-MM-DD');
    let time = day.format('HH:mm');
    this.setData({
      date: date,
      startTime: time,
      endTime: time,
      reserved: 0,
      finalOrderList: []
    })
  },
  // 获取date数据
  getDate(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 获取开始时间和结束时间
  getST(e) {
    this.setData({
      startTime: e.detail.value,
      endTime: e.detail.value
    })
  },
  getET(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 重置表单
  resetFinalOrderList() {
    this.initForm();
  },
  // 添加记录
  addFinalOrderList(e) {
    let record = e.detail.value;
    record.reserved = parseInt(record.reserved);
    if (record.reserved === 0) {
      wx.showToast({
        title: '可预约人数不可为 0',
        icon: 'none',
        duration: 800
      })
    } else if (record.startTime === record.endTime) {
      wx.showToast({
        title: '咨询时长不可为 0',
        icon: 'none',
        duration: 800
      })
    } else {
      let week = '周' + WEEK[dayjs(record.date).day()];
      record.week = week;
      let list = this.data.finalOrderList;
      list.unshift(record);
      this.setData({
        finalOrderList: list
      })
    }
  },
  // 提交预约时间列表
  submitOrderTime() {
    let list = this.data.finalOrderList;
    list = this.formatOrderTime(list);
    let consultantId = this.data.userInfo.consultantId;
    if (list.length === 0) {
      wx.showToast({
        title: '时间列表为空',
        icon: 'error',
        duration: 800
      })
    } else {
      postRequest(
        '/consultant/AddAppointment',
        {
          appointment: list,
          consultantId: consultantId
        }
      ).then(({data: res}) => {
        if (res.code === 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          this.initForm();
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'error',
            duration: 1000
          })
        }
      }).catch(({data: res}) => {
        wx.showToast({
          title: '添加失败',
          icon: 'error',
          duration: 1000
        })
      })
    }
  },
  // 格式化提交的时间
  formatOrderTime(list) {
    list.forEach(item => {
      item.startTime = `${item.date} ${item.startTime}:00`;
      item.endTime = `${item.date} ${item.endTime}:00`;
      delete item.date
    })
    return list;
  }
})