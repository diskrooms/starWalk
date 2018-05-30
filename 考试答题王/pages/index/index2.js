//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jobChoose: {
      'wen': 0, 'shi': 0, 'zhe': 0,
      'jing': 0
    },
    showJobChoosePanel: 0,    //职业选择框显示开关
    showSharePanel: 0,        //分享提示框开关
    showAuthPanel: 0,
    showSignPanel:0,           //每日签到
    showSignData:'',           //每日签到数据
    showSignTip:0              //领取提示
  },
  //事件处理函数
  bindViewTap: function () {
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
          that.setData({ 'showAuthPanel': 1 })
        }
      }
    })
  },
  onGotUserInfo: function (e) {
    if (e.detail.encryptedData) {
      this.setData({ 'showAuthPanel': 0 })
      app.onLaunch(this.render)
    } else {

    }
  },
  //渲染页面
  render: function () {
    this.setData({ 'userInfo': app.globalData.userInfo })
    wx.request({
      url: app.globalData.apiDomain + '/my/sign',
      data: {
        token: wx.getStorageSync('token'),
        app:2
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success:  (res)=> {
        if(res.data.status > 0){
          this.setData({ 'showSignPanel': 1,'showSignData':res.data.msg[1]['sign']})
          app.globalData.userInfo = res.data.msg[1]['userInfo']
        }
      },

    })

  },

  //开始答题
  start: function (e) {
    if (app.globalData.userInfo.ticket > 0) {
      var cate = e.currentTarget.dataset.cate;
      wx.navigateTo({
        url: '/pages/play/index?cate='+cate,
      })
    } else {
      this.setData({ 'showSharePanel': 1 });
    }
  },
  //取消分享提示框
  cancelShowShare: function () {
    this.setData({ 'showSharePanel': 0 });
  },

  onShareAppMessage: function (res) {
    res.type = 0;
    return app.onShareAppMessage(res, this.afterShare)
  },
  afterShare(ticket) {
    app.globalData.userInfo.ticket = ticket;
    this.setData({ 'userInfo': app.globalData.userInfo, 'showSharePanel': 0 });
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
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 50);
            }
          },
          'fail': function (res) {
            //console.log(res)
          }
        })
      },

    })
  },

  //进入我的花园
  goToMyGarden: function (e) {
     wx.navigateTo({
       url: '/pages/my/garden',
     })
  },

  //进入种子商店
  goToSeedShop:function(e){
    util.alert('马上回来，敬请期待');
    return;
  },

  //点击领取每日登录奖励
  daySignGet:function(e){
    this.setData({ 'showSignPanel': 0, 'userInfo': app.globalData.userInfo})
    setTimeout(()=>{
      this.setData({'showSignTip': 1 })
    },500)
  },

  //关闭 "我的花园" 提示窗口
  cancelSignTip:function(e){
    this.setData({ 'showSignTip': 0 })
  }
})
