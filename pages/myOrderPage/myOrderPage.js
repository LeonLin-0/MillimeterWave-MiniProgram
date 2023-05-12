// pages/myOrderPage/myOrderPage.js
import { getRequest, postRequest } from '../../utils/util';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.locale('zh-cn') // 使用本地化语言
dayjs.extend(isBetween);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的预约',
    orderList: [],
    stateList: ['未开始', '进行中', '已结束']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getRequest('/consultant/ViewAppointment')
    .then(({data: res}) => {
      let list = (res.data || []).reverse();
      if (list.length !== 0) {
        list = list.map(item => {
          // 删除多余信息，合并字段
          delete item.counsultant.Id;
          delete item.counsultant.userId;
          let obj = Object.assign(item.counsultant, item.appointment);
          obj.date = obj.startTime.split(' ')[0];
          let st = obj.startTime.split(' ')[1].split(':');
          let et = obj.endTime.split(' ')[1].split(':');
          obj.time = `${st[0]}:${st[1]}-${et[0]}:${et[1]}`;
          obj.state = this.judgeTimeState(obj.startTime, obj.endTime);
          obj.tag = obj.tag.split(';');
          return obj;
        })
      }
      let timer = setInterval(() => {
        if(list.length !== 0) {
          this.setData({
            orderList: [...this.data.orderList, list.shift()]
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

  // 根据时间判断状态
  judgeTimeState(sT, eT) {
    let startTime = dayjs(sT);
    let endTime = dayjs(eT);
    let nowTime = dayjs(Date.now());
    if (nowTime.isBetween(startTime, endTime, '()')) {
      return 1;
    }
    if (nowTime.isBefore(startTime, 'second')) {
      return 0;
    }
    if (nowTime.isAfter(endTime, 'second')) {
      return 2;
    }
  },

  // 取消预约
  cancelOrder(e) {
    let { appointmentid: id, index: index } = e.currentTarget.dataset;
    postRequest(
      '/consultant/CancelAppointment',
      { id: id }
    ).then(({data: res}) => {
      if (res.code === 200) {
        wx.showToast({
          title: `${res.msg}` || '取消成功',
          icon: 'success'
        })
        // let list = this.data.orderList;
        // console.log(index);
        // list = list.splice(index-1, 1);
        this.regainOrderList();
        // this.setData({
        //   orderList: list
        // })
      }
    }).catch(({data: res}) => {
      wx.showToast({
        title: `${res.msg}` || '取消失败',
        icon: 'error'
      })
    })
  },

  // 重新获取预约数据
  regainOrderList() {
    getRequest('/consultant/ViewAppointment')
    .then(({data: res}) => {
      let list = (res.data || []).reverse();
      if (list.length !== 0) {
        list = list.map(item => {
          // 删除多余信息，合并字段
          delete item.counsultant.Id;
          delete item.counsultant.userId;
          let obj = Object.assign(item.counsultant, item.appointment);
          obj.date = obj.startTime.split(' ')[0];
          let st = obj.startTime.split(' ')[1].split(':');
          let et = obj.endTime.split(' ')[1].split(':');
          obj.time = `${st[0]}:${st[1]}-${et[0]}:${et[1]}`;
          obj.state = this.judgeTimeState(obj.startTime, obj.endTime);
          obj.tag = obj.tag.split(';');
          return obj;
        })
      }
      this.setData({
        orderList: list
      })
    })
  }
})