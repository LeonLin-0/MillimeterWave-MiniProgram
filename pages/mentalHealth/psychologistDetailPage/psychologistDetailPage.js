const { getRequest, postRequest } = require("../../../utils/util");
import dayjs from 'dayjs';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    psyInfo: null,
    appointableTime: [],
    commentList: null,
    showPopUp: false,
    result: '',
    isLiked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = JSON.parse(options.psyInfo);
    info.score = (+info.score).toFixed(1);
    this.setData({
      id: info.Id,
      psyInfo: info
    })
    this.getComment(info.Id);
    this.getAppointableTime(info.Id);
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

  // 前往聊天室
  toChatRoom() {
    wx.navigateTo({
      url: `/pages/mentalHealth/chatRoom/chatRoom?id=${this.data.id}&name=${this.data.psyInfo.name}&img=${this.data.psyInfo.img}&userid=${this.data.psyInfo.userId}`,
    })
  },

  // 点击预览图片
  previewPic(e) {
    let imgUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [imgUrl],
      current: imgUrl,
      showmenu: true
    })
  },

  // 获取可预约时间
  getAppointableTime(id) {
    if (typeof(id) !== 'number') {
      id = this.data.id;
    }
    getRequest(`/consultant/GetAppointment?consultantId=${id || this.data.id}`)
    .then(({data: res}) => {
      let tempArr = res.data.reverse() || []
      tempArr = tempArr.filter(item => {
        item.date = (item.startTime || '').split(' ')[0];
        let st = (item.startTime || '').split(' ')[1].split(':');
        let et = (item.endTime || '').split(' ')[1].split(':');
        item.time = `${st[0]}:${st[1]}-${et[0]}:${et[1]}`;
        let nT = dayjs(Date.now());
        let sT = dayjs(item.startTime);
        return nT.isBefore(sT) ? true : false;
      })
      this.setData({
        appointableTime: tempArr,
        result: ''
      })
    })
  },

  // 获取咨询师信息
  getComment(id) {
    getRequest(`/consultant/GetConsultantDetailed?Id=${id}`)
    .then(({data: res}) => {
      let tempArr = (res.data.List || []).reverse();
      tempArr = tempArr.length === 0 ? '' : tempArr;
      this.setData({
        commentList: tempArr,
        isLiked: res.data.Love || false
      })
    })
  },

  // 过滤时间
  filterTime(list) {
    list = list.filter(item => {
      let nT = dayjs(Date.now());
      let sT = dayjs(item.startTime);
      return nT.isBefore(sT) ? true : false;
    })
    return list;
  },

  // 打开弹出层以预约
  showAppointmentContainer() {
    this.setData({
      showPopUp: true
    })
  },

  // 关闭弹出层
  closePopUp() {
    this.setData({
      showPopUp: false,
      result: '' // 清空选项
    })
  },

  // 触发radio的选择函数
  onChooseTime(e) {
    let id = e.detail;
    this.setData({
      result: id
    })
  },

  // 触发cell的选择函数
  onClickTime(e) {
    let { id, unchoosable } = e.currentTarget.dataset;
    if (!unchoosable) {
      this.setData({
        result: id
      });
    }
  },

  // 设置关注
  setLiked() {
    postRequest(
      '/consultant/LoveConsultant',
      { 
        consultantId: this.data.id,
        love: !this.data.isLiked
      },
    )
    .then(({data: res}) => {
      if (res.code === 200) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 600
        })
        this.setData({
          isLiked: !this.data.isLiked
        })
      }
    })
    .catch(({data: res}) => {
      wx.showToast({
        title: '关注失败'
      })
    })
  },

  // 提交预约时间
  submitOrder() {
    let result = this.data.result;
    if (result === '') {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'error',
        duration: 1000
      })
    }
    else {
      postRequest(
        '/consultant/ChoseAppointment',
        { id: result }
      ).then(({data: res}) => {
        if (res.code === 200) {
          wx.showToast({
            title: res.msg || '预约成功',
            icon: 'none',
            duration: 1000
          })
          this.getAppointableTime(this.data.id); // 获取最新的数据来刷新
        } else {
          wx.showToast({
            title: res.msg || '预约失败',
            icon: 'error',
            duration: 1000
          })
        }
      })
      .catch(({data: res}) => {
        wx.showToast({
          title: res.msg || '预约失败',
          icon: 'error',
          duration: 1000
        })
      })
    }
  }
})