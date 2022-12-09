// pages/modifyPage/modifyPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    defaultURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', 
    userInfo: {
      avatarURL: "",
      nickName: '',
      userAge: 20,
      userHeight: undefined,
      userWeight: undefined,
      userDisease: []
    },
    BMI: "",
    // picker
    ageRange: [],
    // checkedDisease
    checkedDisease: [],
    // diseasesArray
    diseasesArray: [
      { value: "0", name: "无", checked: false },
      { value: "1", name: "I型糖尿病",checked: false },
      { value: "2", name: "II型糖尿病", checked: false },
      { value: "3", name: "心脏病", checked: false},
      { value: "4", name: "高血脂", checked: false},
      { value: "5", name: "高血压", checked: false},
      { value: "6", name: "抑郁症", checked: false},
      { value: "7", name: "焦虑症", checked: false},
    ],
    moreDisease: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      ageRange: Array(110).fill(0).map((value, index) => value+index)
    });
    if(userInfo.avatarURL!="" && userInfo.avatarURL!=undefined) {
      // 真正有数据
      this.setData({
        userInfo: userInfo
      })
    }
    this.showBMI();
    // 修改疾病选择状态
    let tempDiseaseArray = this.data.diseasesArray;
    for(var item of this.data.userInfo.userDisease){
      for(var arrayItem of tempDiseaseArray) {
        if(arrayItem.name == item) {
          arrayItem.checked = true;
        }
      }
    }
    this.setData({
      diseasesArray: tempDiseaseArray
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
  // 获取头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      ['userInfo.avatarURL']: avatarUrl
    })
  },
  // 获取名字
  getNickName(e) {
    const { value } = e.detail;
    this.setData({
      ['userInfo.nickName']: value
    })
  },
  // 获取年龄
  getUserAge(e) {
    this.setData({
      ['userInfo.userAge']: +e.detail.value
    })
  },
  // 获取身高
  getUserHeight(e) {
    let num = +e.detail.value <=0? 0:+e.detail.value;
    this.setData({
      ['userInfo.userHeight']: num
    });
    this.showBMI();
  },
  // 获取体重
  getUserWeight(e) {
    let num = +e.detail.value <=0? 0:+e.detail.value;
    this.setData({
      ['userInfo.userWeight']: num
    });
    this.showBMI();
  },
  // 计算BMI指数
  showBMI() {
    const height = this.data.userInfo.userHeight;
    const weight = this.data.userInfo.userWeight;
    if(height && weight && height>0 && weight>0) {
      this.setData({ BMI: +(weight/((height/100)**2)).toFixed(2) });
    }
    else {
      this.setData({ BMI: "" })
    }
  },
  // 获取用户疾病选项
  getCheckbox(e) {
    // 若选中"无"，则将其余选项置为未选中
    if(e.detail.value.indexOf("无")!=-1) {
      this.setData({
        ['diseaseArray[0].checked']: true
      })
      for(let i=1;i<this.data.diseasesArray.length; i++){
        this.setData({
          [`diseasesArray[${i}].checked`]: false
        })
      }
    } else { // 没选中"无"，则将“无”置为未选中
      this.setData({
        ['diseasesArray[0].checked']: false
      })
    }
    this.setData({
      checkedDisease: e.detail.value
    })
  },
  // 获取更多疾病信息
  getMoreDisease(e) {
    let originData = e.detail.value;
    this.setData({
      moreDisease: originData.split(" ")
    })
  },
  // 提交所有信息，判断状态
  submitAllinfo() {
    // 过滤疾病信息
    let checkDisease = this.data.checkedDisease;
    let moreDisease = this.data.moreDisease;
    // 选择无疾病
    if(checkDisease.indexOf("无")===0) {
      if(moreDisease.length===0 || moreDisease[0]==="") {
        this.setData({
          ['userInfo.userDisease']: ["身体健康"]
        })
      } else {
        this.setData({
          ['userInfo.userDisease']: [...moreDisease]
        })          
      }
    }
    // 什么都没选 
    else if(checkDisease.indexOf("无")===-1 && checkDisease.length===0) {
      if(moreDisease.length===0 || moreDisease[0]==="") {
        // 没有填写任何疾病信息
        this.setData({
          ['userInfo.userDisease']: []
        })
      } else{ // 填写了额外疾病信息
        this.setData({
          ['userInfo.userDisease']: [...moreDisease]
        })
      }
    }
    // 选了疾病
    else if(checkDisease.indexOf("无")===-1 && checkDisease.length!=0){
      this.setData({
        ['userInfo.userDisease']: [...checkDisease, ...moreDisease]
      })
    }
    let userInfo = this.data.userInfo;
    console.log(userInfo);
    wx.setStorageSync('userInfo', userInfo);
    if(userInfo.nickName!="" && userInfo.userAge!="" && userInfo.avatarURL!="") {
      wx.setStorageSync('needFillData', false);
    }
    // 发送成功后跳回前一页
    wx.navigateBack(-1);
  }
})