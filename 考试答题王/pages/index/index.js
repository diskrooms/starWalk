//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jobChoose: { 'php': 0, 'java': 0, 'python': 0, 
                'front': 0,'maintenance': 0,'go': 0,
                'c': 0, 'android': 0,'arithmetic':0
               },
    showJobChoosePanel:0,    //职业选择框显示开关
    showSharePanel:0,        //分享提示框开关
    showAuthPanel: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //onshow里不能再直接进行登录 需要先进行授权验证
  onShow: function () {
    //console.log('onShow')
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          //直接登录
          app.onLaunch(that.render)
        } else {
          that.setData({'showAuthPanel':1})
        }
      }
    })
  },
  onGotUserInfo:function(e){
    if (e.detail.encryptedData){
      this.setData({ 'showAuthPanel': 0 })
      app.onLaunch(this.render)
    } else {

    }
  },
  //渲染页面
  render:function(){
    this.setData({'userInfo':app.globalData.userInfo})
    var set_job = wx.getStorageSync('set_job')
    if (!(set_job > 0)) {
      this.setData({ "showJobChoosePanel": 1 })
    }
    
  },
  //职业选择
  chooseJob:function(e){
    var id = e.currentTarget.id
    var jobChoose = this.data.jobChoose
    if (jobChoose[id] > 0){
      jobChoose[id] = 0;
    } else {
      jobChoose[id] = 1;
    }
    this.setData({ jobChoose: jobChoose })
  },
  //提交职业
  submitJob:function(){
    var that = this;
    var jobs = [];
    var jobChoose = this.data.jobChoose
    for (var i in jobChoose){
      if(jobChoose[i] >0){
        jobs.push(i)
      }
    }
    if(jobs.length == 0){
      util.alert('请选择您擅长的领域');
      return;
    }
    wx.request({
      url: app.globalData.apiDomain+'/my/settings',
      data:{'jobs':jobs,'token':wx.getStorageSync('token')},
      method:'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType:'json',
      success:function(res){
        if(res.data.status > 0){
          /*var t = setTimeout(function(){
            that.setData({ 'showJobChoosePanel': 0 })
            wx.setStorageSync('set_job', 1);
            t = null;
            if(t == null){
              t = setTimeout(function () {
                wx.showModal({
                  title: '已设置职业',
                  content: '如果想更改，可点击左上角进行设置',
                  showCancel: false,
                  success: function (res) {
                    t = null
                  }
                })
              }, 200);
            }
          },500)*/
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              var t = setTimeout(function(){
                that.setData({ 'showJobChoosePanel': 0 })
                wx.setStorageSync('set_job', 1);
                t = null;
              },2000);
            }
          })
        } else {
          wx.showToast({
            title: '未作设置',
            icon: 'none',
            duration: 2000,
            success: function () {
              var t = setTimeout(function () {
                that.setData({ 'showJobChoosePanel': 0 })
                t = null;
              }, 2000);
            }
          })
        }
      }
    })
  },
  //开始答题
  start:function(){
    if(app.globalData.userInfo.ticket > 0){
      wx.navigateTo({
        url: '/pages/play/index',
      })
    } else {
      this.setData({'showSharePanel':1});
    }
  },
  //取消分享提示框
  cancelShowShare:function(){
    this.setData({ 'showSharePanel': 0 });
  },
  
  onShareAppMessage: function (res) {
    res.type = 0;
    return app.onShareAppMessage(res,this.afterShare)
  },
  afterShare(ticket){
    app.globalData.userInfo.ticket = ticket;
    this.setData({ 'userInfo': app.globalData.userInfo,'showSharePanel':0 });
  },

  //购买挑战次数
  buyTicket: function (e) {
    var that = this;
    var price = e.currentTarget.dataset.price;
    var title = e.currentTarget.dataset.title;
    wx.request({
      url: app.globalData.apiDomain + '/pay/index',
      data: {
        token: wx.getStorageSync('token'),
        title: title,
        price: price,
        'type': 1
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp + '',
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              },50);
            }
          },
          'fail': function (res) {
            //console.log(res)
          }
        })
      },

    })
  }
})
