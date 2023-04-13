// pages/modifyPage/modifyPage.js
import { ip, postRequest } from '../../utils/util'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    defaultURL: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', 
    userInfo: null,
    BMI: "",
    // picker
    ageRange: null,
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
    moreDisease: "",
    showDialog: true, // 显示弹窗
    unshowAgain: false, // 不再显示弹窗
    showAll: true // 显示所有填写选项
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
    // 初始化
    let userInfo = {...(app.globalData.userInfo || wx.getStorageSync('userInfo'))};
    let unshowAgain = wx.getStorageSync('unshowDialogAgain');
    unshowAgain = unshowAgain === "" ? false : (unshowAgain === true ? true : false);
    let showAll = wx.getStorageSync('showAll');
    showAll = showAll === "" ? true : (showAll === true ? true : false);
    this.setData({
      ageRange: Array(110).fill(0).map((value, index) => value+index),
      showDialog: !unshowAgain,
      showAll: showAll
    });
    this.setData({
      userInfo: userInfo
    })
    this.showBMI();
    // 修改疾病选择状态
    this.initDiseaseList();
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
  // 点击不再显示 
  unshow() {
    let unshow = this.data.unshowAgain;
    this.setData({
      unshowAgain: !unshow
    })
  },
  // 点击拒绝
  disagree() {
    this.setUnshowAgain(false);
    this.setData({
      showAll: false,
      showDialog: false // 关闭弹窗
    })
  },
  // 点击接受
  agree() {
    this.setUnshowAgain(true);
    this.setData({
      showAll: true,
      showDialog: false
    })
  },
  // 后悔按钮
  regretToShowAll() {
    this.setData({
      showAll: !this.data.showAll
    })
  },
  // 设置是否点击不再显示
  setUnshowAgain(bool) {
    let unshowAgain = this.data.unshowAgain;
    wx.setStorageSync('unshowDialogAgain', unshowAgain);
    wx.setStorageSync('showAll', bool);
  },
  // 进入页面时初始化疾病列表
  initDiseaseList() {
    let tempDiseaseArray = this.data.diseasesArray;
    let sicks = this.data.userInfo.sicks;
    for(var item of sicks){
      for(var arrayItem of tempDiseaseArray) {
        if(arrayItem.name == item) {
          arrayItem.checked = true;
          this.setData({
            checkedDisease: [...this.data.checkedDisease, item]
          })
          break;
        }
        else {
          if(item === "身体健康") {
            tempDiseaseArray[0].checked = true;
          }
          // 如果到最后一个都没有，则添加
          else if(arrayItem.name != item && arrayItem.value == this.data.diseasesArray.length - 1) {
            tempDiseaseArray = [...tempDiseaseArray, {value: tempDiseaseArray.length, name: item, checked: true}]
            this.setData({
              checkedDisease: [...this.data.checkedDisease, item]
            })
          }
        }
      }
    }
    if(sicks.length === 0) {
      tempDiseaseArray[0].checked = true;
    }
    this.setData({
      diseasesArray: tempDiseaseArray
    })
  },
  // 获取头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    wx.showToast({
      title: '头像上传中',
      icon: 'loading',
      duration: 1500
    })
    // 上传头像到后端进行存储
    wx.uploadFile({
      filePath: avatarUrl,
      name: 'file',
      url: `${ip}/user/UploadImg`,
      header: {
        'x-token': wx.getStorageSync('x-token')
      },
      success: ({data: res}) => {
        res = JSON.parse(res);
        this.setData({
          ['userInfo.headerImg']: res.data.headerImg
        })
        if(res.code === 200) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 500
          })          
        }
      }
    })
  },
  // 获取名字
  getNickName(e) {
    const { value } = e.detail;
    this.setData({
      ['userInfo.nickName']: value
    })
  },
  // 获取手机号
  getUserPhone(e) {
    let phone = e.detail.value;
    this.setData({
      ['userInfo.mobile']: phone
    })
  },
  // 获取年龄
  getUserAge(e) {
    this.setData({
      ['userInfo.age']: +e.detail.value
    })
  },
  // 获取身高
  getUserHeight(e) {
    let num = +e.detail.value <= 0 ? 0 : +e.detail.value;
    this.setData({
      ['userInfo.height']: num
    });
    this.showBMI();
  },
  // 获取体重
  getUserWeight(e) {
    let num = +e.detail.value <= 0 ? 0 : +e.detail.value;
    this.setData({
      ['userInfo.weight']: num
    });
    this.showBMI();
  },
  // 计算BMI指数
  showBMI() {
    const height = this.data.userInfo.height;
    const weight = this.data.userInfo.weight;
    if(height && weight && height>0 && weight>0) {
      this.setData({
        BMI: +(weight/((height/100)**2)).toFixed(2)
      });
    }
    else {
      this.setData({ BMI: "" })
    }
  },
  // 获取用户疾病选项
  getCheckbox(e) {
    // 若选中"无"
    if(e.detail.value.indexOf("无") != -1) {
      // 选其他选项后，再选中"无"，清空其他选项
      if(e.detail.value.indexOf("无")!=0) {
        this.setData({
          ['diseaseArray[0].checked']: true
        })
        for(let i=1,len=this.data.diseasesArray.length; i<len; i++){
          this.setData({
            [`diseasesArray[${i}].checked`]: false
          })
        }
        this.setData({
          checkedDisease: ["无"]
        })
      }
      // 选"无"后选择其他选项，清掉"无"
      else if(e.detail.value.length > 1){
        this.setData({
          [`diseasesArray[${0}].checked`]: false
        })
        let tempArr = [];
        e.detail.value.forEach(item => {
          if(item != "无") {
            tempArr.push(item);
          }
        })
        this.setData({
          checkedDisease: tempArr
        }) 
      }
      else {
        this.setData({
          checkedDisease: ["无"]
        })
      }
    }
    // 没选择"无"
    else {
      this.setData({
        checkedDisease: e.detail.value
      })
    }
  },
  // 获取更多疾病信息
  getMoreDisease(e) {
    let originData = e.detail.value.trim();
    if (originData != "") {
      this.setData({
        moreDisease: originData.split(" ")
      })
    }
    else {
      this.setData({
        moreDisease: ""
      })
    }
  },
  // 整理疾病填写
  tidySicksArray() {
    let checkDisease = this.data.checkedDisease;
    let moreDisease = this.data.moreDisease;
    if(typeof moreDisease === "Array") {
      moreDisease = [...moreDisease.split(" ")]
    }
    // 选择无疾病
    if(checkDisease[0]==="无") {
      // 没有额外输入的疾病
      if(moreDisease.length === 0) {
        this.setData({
          ['userInfo.sicks']: ["身体健康"]
        })
      }
      // 有额外输入的疾病
      else {
        this.setData({
          ['userInfo.sicks']: [...moreDisease]
        })
      }
    }
    // 什么都没选
    else if(checkDisease.length === 0) {
      // 没有填写额外信息
      if(moreDisease.length === 0) {
        this.setData({
          ['userInfo.sicks']: []
        })
      }
      // 填写了额外疾病信息
      else{
        this.setData({
          ['userInfo.sicks']: [...moreDisease]
        })
      }
    }
    // 选了疾病
    else {
      // 最终处理疾病数组
      let sicksArr;
      if(moreDisease.length != 0) {
        sicksArr = [...checkDisease, ...moreDisease];
      }
      else {
        sicksArr = [...checkDisease];
      }
      this.setData({
        ['userInfo.sicks']: sicksArr
      })
    }
  },
  // 提交所有信息，判断状态
  submitAllinfo() {
    // 过滤疾病信息
    this.tidySicksArray();
    wx.showToast({
      title: '正在提交',
      icon: 'loading',
      duration: 1500,
      mask: true
    })
    // 发送数据
    let userInfo = this.data.userInfo;
    // 不缺基础信息之后，上传数据
    if(userInfo.nickName && userInfo.mobile && userInfo.headerImg) {
      postRequest('/user/ChangeUserInfo',
      {
        nickName: userInfo.nickName,
        mobile: userInfo.mobile+'',
        height: userInfo.height,
        weight: userInfo.weight,
        sicks: userInfo.sicks,
        age: userInfo.age
      }).then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 800,
        })
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        // 自动返回个人主页
        wx.switchTab({
          url: '/pages/home/home',
        });
      })
    }
    else {
      wx.showModal({
        title: "请完善信息再提交",
        showCancel: false
      })
    }
  }
})