// pages/mySchedulePage/mySchedulePage.js
import { postRequest } from '../../utils/util';
import dayjs from 'dayjs';
const app = getApp();
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的日程',
    userInfo: null,
    scheduleList: [],
    allCount: 0,
    unfinishedCount: 0,
    finishedCount: 3,
    isPopUp: false,
    date: '',
    startTime: '',
    endTime: '',
    reserved: '',
    modifyTarget: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = {...(app.globalData.userInfo || wx.getStorageSync('userInfo'))};
    this.setData({
      userInfo: userInfo
    })
    postRequest(
      `/consultant/CheckAppointment`,
      {
        consultantId: userInfo.consultantId
      }
    )
    .then(({data: res}) => {
      let list = res.data || [];
      let allCount = list.length,
          unfinishedCount = 0,
          finishedCount = 0,
          nowDay = dayjs(Date.now());
      list.forEach(({appointment: item}) => {
        item.date = item.startTime.split(' ')[0];
        let st = item.startTime.split(' ')[1].split(':');
        let et = item.endTime.split(' ')[1].split(':');
        item.time = `${st[0]}:${st[1]}-${et[0]}:${et[1]}`;
        let endDay = dayjs(item.endTime);
        if (endDay.isBefore(nowDay)) { // 结束
          item.state = '已结束';
          finishedCount += 1;
        } else {
          item.state = '未结束';
          unfinishedCount += 1;
        }
      })
      this.setData({
        allCount: allCount,
        unfinishedCount: unfinishedCount,
        finishedCount: finishedCount
      })
      let timer = setInterval(() => {
        if(list.length !== 0) {
          this.setData({
            scheduleList: [...this.data.scheduleList, list.pop()]
          })
        }
        else {
          clearInterval(timer);
        }
      }, 250);
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
  // 重新获取日程表
  regainSchedule() {
    postRequest(
      `/consultant/CheckAppointment`,
      {
        consultantId: this.data.userInfo.consultantId
      }
    )
    .then(({data: res}) => {
      let list = res.data || [];
      let allCount = list.length,
          unfinishedCount = 0,
          finishedCount = 0,
          nowDay = dayjs(Date.now());
      list.forEach(({appointment: item}) => {
        item.date = item.startTime.split(' ')[0];
        let st = item.startTime.split(' ')[1].split(':');
        let et = item.endTime.split(' ')[1].split(':');
        item.time = `${st[0]}:${st[1]}-${et[0]}:${et[1]}`;
        let endDay = dayjs(item.endTime);
        if (endDay.isBefore(nowDay)) { // 结束
          item.state = '已结束';
          finishedCount += 1;
        } else {
          item.state = '未结束';
          unfinishedCount += 1;
        }
      })
      list = list.reverse();
      this.setData({
        allCount: allCount,
        unfinishedCount: unfinishedCount,
        finishedCount: finishedCount,
        scheduleList: list
      })
    })
  },
  // 修改预约时间
  modifyTime(e) {
    let { users: userList, appointment: appointment } = e.currentTarget.dataset.item;
    let sT = dayjs(appointment.startTime);
    let eT = dayjs(appointment.endTime);
    let date = sT.format('YYYY-MM-DD'),
        startTime = sT.format('HH:mm'),
        endTime = eT.format('HH:mm');
    this.setData({
      date: date,
      startTime: startTime,
      endTime: endTime,
      reserved: appointment.reserved,
      modifyTarget: appointment,
      isPopUp: true
    })
  },
  // 取消修改预约时间
  cancelModifyTime() {
    this.setData({
      isPopUp: false
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
  // 提交修改预约时间
  modifyFinalOrderList(e) {
    let target = this.data.modifyTarget;
    let obj = e.detail.value;
    let day = dayjs(obj.date);
    obj.appointmentId = target.Id;
    obj.reserved = +obj.reserved;
    obj.week = `周${WEEK[day.day()]}`;
    obj.startTime = `${obj.date} ${obj.startTime}:00`;
    obj.endTime = `${obj.date} ${obj.endTime}:00`;
    delete obj.date;

    postRequest(
      '/consultant/UpdateAppointment',
      obj
    ).then(({data: res}) => {
      if(res.code === 200) {
        this.setData({
          isPopUp: false
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 800
        })
        this.regainSchedule();
      }
    })
  },
  // 关闭预约
  deleteTime(e) {
    let target = e.currentTarget.dataset.item.appointment;
    postRequest(
      '/consultant/DeleteAppointment',
      { appointmentId: target.Id }
    ).then(({data: res}) => {
      if(res.code === 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        this.regainSchedule();
      }
    }).catch(({data: res}) => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    })
  }
})