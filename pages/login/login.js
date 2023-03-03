// pages/login/login.js
import { ip, getRequest } from '../../utils/util'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegister: false, // 是否为注册状态
    isPassword: false, // 是否为密码登录
    userInfo: {
      userPhone: undefined, // 手机号
      password: '', // 密码
    },
    messageVerifyCode: '', // 手机验证码
    msgVerifyCodeText: '获取验证码', // 获取验证码按钮
    mvcDisable: false, // 禁用按钮
    verifyCode: '', // 图形验证码
    imgCode: '', // 图形验证码base64
    captchaId: '', // 图形验证码ID
    timer: undefined, // 定时器
    timeLength: 30, // 时长
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if(this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if(this.data.timer) {
      clearInterval(this.data.timer);
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
  // 更改模式：登录 || 注册
  changeRegisterState() {
    this.setData({
      isRegister: !this.data.isRegister,
      messageVerifyCode: ""
    })
    this.deleteAllInput();
    if(this.data.isPassword && !this.data.isRegister) {
      this.getImgCode();
    }
  },
  // 更改模式：密码登录 || 短信登录
  setLoginMethod(e) {
    let method = e.currentTarget.dataset.method;
    let nowState = this.data.isPassword;
    // 防抖
    if(method === 'message' && nowState) {
      this.setData({
        isPassword: false
      })
    }
    else if(method === 'password' && !nowState) {
      this.setData({
        isPassword: true
      })
      this.getImgCode();
    }
    this.deleteAllInput();
  },
  // 清空填写内容
  deleteAllInput() {
    this.setData({
      ['userInfo.userPhone']: '',
      ['userInfo.password']: '',
      verifyCode: ''
    })
  },
  // 获取手机号
  getUserPhone(e) {
    let phone = e.detail.value;
    this.setData({
      ['userInfo.userPhone']: phone
    })
  },
  // 获取密码
  getPassword(e) {
    let pw = e.detail.value;
    this.setData({
      ['userInfo.password']: pw
    })
  },
  // 获取输入的图形验证码
  getVerifyCode(e) {
    let vc = e.detail.value;
    this.setData({
      verifyCode: vc
    })
  },
  // 获取图形验证码
  getImgCode() {
    wx.request({
      url: `${ip}/base/SendCaptcha`,
      method: 'GET',
      success: ({data: res}) => {
        this.setData({
          imgCode: res.data.picPath,
          captchaId: res.data.captchaId,
          verifyCode: ''
        })
      }
    })
  },
  // 获取输入的手机验证码
  getInputMsgVerifyCode(e) {
    let mvc = e.detail.value;
    this.setData({
      messageVerifyCode: mvc
    })
  },
  // 获取手机验证码
  getMsgVerifyCode() {
    if(this.data.userInfo.userPhone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
        duration: 800
      })
    }
    else {
      let length = this.data.timeLength;
      // 为了立即触发
      const fn = () => {
        this.setData({
          msgVerifyCodeText: length
        })
        length -= 1;
        if(length === -2) {
          // 清除定时器
          clearInterval(this.data.timer);
          // 恢复按钮和文字
          this.setData({
            mvcDisable: false,
            msgVerifyCodeText: '获取验证码'
          })
        }
      }
      // 禁用按钮
      this.setData({
        mvcDisable: true
      })
      // 设置定时器
      this.data.timer = setInterval(fn, 1000);
      // 发送请求获取短信验证码
      let data = {
        mobile: this.data.userInfo.userPhone.toString()
      };
      getRequest('/base/SendSms').then(({data: res}) => {
        if(res.code !== 200) {
          wx.showToast({
            title: `${res.msg}`,
            icon: 'error',
            duration: 800
          })
        }
      })
    }
  },
  // 注册/登录
  loginOrRegister() {
    let isRegister = this.data.isRegister; // 是否为注册
    let isPassword = this.data.isPassword; // 是否为密码登录
    let userPhone = this.data.userInfo.userPhone+''; // 手机
    let password = this.data.userInfo.password+''; // 密码
    let captcha = this.data.verifyCode+''; // 图形验证码
    let captchaId = this.data.captchaId+''; // 图形验证码ID
    let msgVerifyCode = this.data.messageVerifyCode+''; // 手机验证码
    // 注册状态：只能手机验证码
    if(isRegister) {
      if(userPhone!="" && msgVerifyCode!="") {
        wx.showToast({
          title: '正在注册中',
          icon: 'loading',
          duration: 1500,
          mask: true
        })
        wx.request({
          method: 'POST',
          url: `${ip}/user/LoginByMobile1`,
          data: {
            'mobile': userPhone,
            'smsCode': msgVerifyCode
          },
          success: res => {
            if(res.data.code == 200) {
              wx.showToast({
                title: '注册成功',
                icon: 'success',
                duration: 800
              })
              console.log(res);
              // 初始化
              this.loginToInit(res,0);
            }
            else {
              wx.showToast({
                title: `${res.msg}`,
                icon: 'error',
                duration: 800
              })
            }
          },
          fail: res => {
            wx.showToast({
              title: `${res.msg}`,
              icon: 'error',
              duration: 800
            })
          }
        })
      }
      else {
        wx.showToast({
          title: '请完整填写信息',
          icon: 'error',
          duration: 500
        })
      }
    }
    // 登陆状态：密码登录 || 手机验证码登录
    else {
      // 密码登录
      if(isPassword) {
        // 填写完整
        if (userPhone!="" && password!="" && captcha!="" && captchaId!="") {
          wx.showToast({
            title: '正在登录',
            icon: 'loading',
            duration: 1500,
            mask: true
          })
          wx.request({
            method: 'POST',
            url: `${ip}/user/LoginByEmailMobile`,
            data: {
              'mobile': userPhone,
              'password': password,
              'captcha': captcha,
              'captchaId': captchaId
            },
            success: res => {
              let _res = res.data;
              if(_res.code !== 200) {
                wx.showToast({
                  title: `${_res.msg}`,
                  icon: 'error',
                  duration: 1500
                })
                // 重置验证码
                this.setData({
                  verifyCode: '',
                  ['userInfo.password']: ''
                })
                this.getImgCode();
              }
              else {
                wx.showToast({
                  title: `${_res.msg}`,
                  icon: 'success',
                  duration: 1500
                })
                this.loginToInit(res,1);
              }
            },
            fail: res => {
              wx.showToast({
                title: `${_res.msg}`,
                icon: 'error',
                duration: 1500
              })
              // 重置验证码
              this.setData({
                verifyCode: '',
                ['userInfo.password']: ''
              })
              this.getImgCode(res);
            }
          })
        }
        else {
          wx.showToast({
            title: `请完整填写信息`,
            icon: 'error',
            duration: 1500
          })
        }
      }
      // 短信登录
      else {
        // 填写完整
        if(userPhone!="" && msgVerifyCode!="") {
          wx.showToast({
            title: '正在登录',
            icon: 'loading',
            duration: 1500,
            mask: true
          })
          wx.request({
            method: 'POST',
            url: `${ip}/user/LoginByMobile1`,
            data: {
              'mobile': userPhone,
              'smsCode': msgVerifyCode
            },
            success: res => {
              if(res.data.code === 200) {
                wx.showToast({
                  title: '登陆成功',
                  icon: 'success',
                  duration: 1500
                })
                this.loginToInit(res,1);
              }
              else {
                wx.showToast({
                  title: `${res.data.msg}`,
                  icon: 'error',
                  duration: 800
                })
                this.setData({
                  mobile: "",
                  smsCode: ""
                })
              }
            },
            fail: res => {
              wx.showToast({
                title: `${res.data.msg}`,
                icon: 'error',
                duration: 1500
              })
              this.setData({
                mobile: "",
                smsCode: ""
              })
            }
          })          
        }
        else {
          wx.showToast({
            title: '请完整输入信息',
            icon: 'error',
            duration: 1500
          })
        }
      }
    }
  },
  // 登录/注册成功后初始化
  loginToInit(res, state) {
    // 保存token
    wx.setStorageSync('x-token', res.header['X-Token']);
    app.globalData.xToken = res.header['X-Token'];
    // 修改疾病数据格式
    let userInfo = {...res.data.data};
    userInfo.sicks = userInfo.sicks.split(',').filter(item => {if(item!="") return item;})
    // 保存用户信息
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.userInfo = userInfo;
    //修改信息页：注册状态
    if(state === 0) {
      wx.navigateTo({
        url: '/pages/modifyPage/modifyPage',
      })
    }
    // 跳转到主页:登陆状态
    else if(state === 1) {
      // 初始化聊天记录
      app.initUserChatMemory();      
      wx.switchTab({
        url: '/pages/personalData/personalData',
      })
    }
    // 连接websocket
    app.initWebSocket();
    // 将信息监听调至其他模式
    app.initChatMethod();
  }
})