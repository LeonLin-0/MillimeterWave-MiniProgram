// pages/mentalHealth/psychologyTestPage/psychologyTestPage.js
import { getRequest, postRequest } from "../../../utils/util";
import { setWatcher } from "../../../utils/watch"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    title: "",  // 测试题名称
    evaluationScaleId: undefined, // 测试题id
    page: 1, // 第几页
    pageSize: 90, // 一页多少条
    choices: [],  // 每道题的选项对象数组
    currentBtn: -1, // 当前选中选项
    numRange: [], // 题目编号数组，用于picker
    nowSubjectNum: 1, // 当前题目编号
    allSubjectNum: undefined, // 总题目数量
    progressNum: 0, // 进度条数字
    subjectList: [],  // 题目数组
    answerList: [], // 答案分数数组
    choiceList: [], // 答案选项数组
    startTime: '', // 测试开始时间
    showSubmitBtn: false, // 显示提交按钮
    showComponent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置监听器
    setWatcher(this);
    // 初始化数据
    let item = JSON.parse(options.item);
    this.setData({
      item: item,
      title: item.psyTestTitle,
      evaluationScaleId: item.evaluationScaleId,
      pageSize: item.psyTestNum
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 发送请求获取题目数据
    wx.showLoading({
      title: '获取题目中',
    })
    this.getQuestionList();
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
  /**
   * 监听器
   */
  watch: {
    nowSubjectNum: {
      handler(newVal) {
        // 当当前题目改变时，修改上方进度条数据，修改选项内容及对应分数
        this.setData({
          progressNum: (newVal/this.data.allSubjectNum*100).toFixed(0),
          choices: this.data.subjectList[this.data.nowSubjectNum-1].choice
        });
      }
    }
  },
  // 获取picker数字
  getQueNum(e) {
    this.setData({
      nowSubjectNum: parseInt(e.detail.value)+1
    })
    this.setAnswer();
  },
  // 获取题目列表
  getQuestionList() {
    let evaluationScaleId = this.data.evaluationScaleId;
    let page = this.data.page;
    let pageSize = this.data.pageSize;
    getRequest(`/question/GetQuestionList?evaluationScaleId=${evaluationScaleId}&page=${page}&pageSize=${pageSize}`)
    .then(({data: res}) => {
      if(res.code === 200) {
        let list = res.data.list.map(item => {
          item.answer = item.answer.split(';');
          item.score = item.score.split(';').map(num => +num);
          item.choice = this.setChoiceArray(item);
          return item;
        })
        this.setData({
          subjectList: [...this.data.subjectList, ...list],
          allSubjectNum: res.data.pageSize,
          nowSubjectNum: 1,
          numRange: Array(res.data.pageSize).fill(1).map( (item, index) => { return item + index } ),
          startTime: res.data.startTime,
          choiceList: Array(res.data.pageSize).fill(-1),
          answerList: Array(res.data.pageSize).fill(-1),
          showComponent: true
        })
        wx.hideLoading();
        this.judgeFinishedAll();   
      }
      else {
        wx.showModal({
          title: res.msg,
          showCancel: false
        })
      }
    })
  },
  // 设置选项数组
  setChoiceArray(item) {
    let arr = [];
    let answer = item.answer;
    let score = item.score;
    for(var i=0; i<answer.length; i++) {
      arr.push({'answer': answer[i], 'score': score[i]})
    }
    return arr;
  },
  // 返回上一题按钮
  backToLastSubject() {
    this.setData({
      nowSubjectNum: this.data.nowSubjectNum - 1
    })
    this.setAnswer();
  },
  // 前往下一题
  toNextSubject() {
    if(this.data.nowSubjectNum < this.data.allSubjectNum) {
      this.setData({
        nowSubjectNum: this.data.nowSubjectNum + 1
      })     
    }
    this.setAnswer();
  },
  // 选择选项
  selected(e) {
    let curBtn = this.data.currentBtn;
    let selBtn = e.currentTarget.dataset.index;
    let score = e.currentTarget.dataset.score;
    if(curBtn === selBtn) { // 重复点击
      this.setData({
        currentBtn: -1
      })
    } else { // 点击按钮
      this.setData({
        currentBtn: selBtn
      })
    }
    // 设置选项数组
    let choiceTarget = this.data.choiceList;
    choiceTarget[this.data.nowSubjectNum-1] = this.data.currentBtn;
    this.setData({
      choiceList: choiceTarget
    })
    // 设置答案数组
    let answerTarget = this.data.answerList;
    answerTarget[this.data.nowSubjectNum-1] = this.data.currentBtn === -1 ? -1 : score;
    this.setData({
      answerList: answerTarget
    })
    // 判断是否选择完所有题目
    this.judgeFinishedAll();
    // 如果不是取消答案，则切换下一道题
    if(curBtn != selBtn) {
      let timer = setTimeout(() => {
        this.toNextSubject();
        clearTimeout(timer);
      },300)
    }
  },
  // 按照答案数组，进行选项样式设置
  setAnswer() {
    let nowSub = this.data.nowSubjectNum;
    let target = this.data.choiceList[nowSub-1];
    this.setData({
      currentBtn: target
    })
  },
  // 判断是否完成所有题目
  judgeFinishedAll() {
    let judge = this.data.answerList.includes(-1) ? false : true;
    this.setData({
      showSubmitBtn: judge
    })
  },
  // 提交所有答案
  submitAllSubject() {
    // 如果存在没完成的题目
    if(this.data.answerList.includes(-1)) {
      // 查出所有没完成的题目编号
      let unSelArr = [];
      this.data.answerList.map((item,index) => {
        console.log(item);
        if(item === -1) { unSelArr.push(index + 1) }
      });
      // console.log(unSelArr);
      wx.showModal({
        title: `请完成全部题目再提交。未完成题目：${unSelArr.toString()}`,
        showCancel: false
      })
    } else {
      // console.log(this.data.answerList);
      postRequest('/question/PostQuestionScore', 
      {
        startTime: this.data.startTime,
        userID: wx.getStorageSync('userInfo').userId,
        evaluationScaleId: parseInt(this.data.evaluationScaleId),
        answer: [0, ...this.data.answerList]
      }).then(res => {
        console.log(res)
        wx.setStorageSync('psyResult', JSON.stringify(res.data));
        wx.navigateTo({
          url: `/pages/mentalHealth/mentalHealthConclusion/mentalHealthConclusion?resultName=psyResult`,
        })
      })
    }
  }
})
