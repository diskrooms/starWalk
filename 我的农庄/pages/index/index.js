//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfoAuth: 1,                           //是否授权用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation:'',         //风车动画
    animationData:'',     //风车动画
    bag_animationData:'', //背包窗口关闭渐隐动画

    dialog_status:'hide',           //对话框状态
    dialog_text:'',                 //对话框内容
    dialog_sure:function(){},       //确定键回调函数
    dialog_btn:0,                   //确定键类型 0 普通按钮 1 分享按钮
    dialog_close:function(){},      //关闭键回调函数

    crop_index:0,                   //当前操作的土块索引
    bag_status:0,                   //背包打开状态
    shops_status:0,                 //商店打开状态

    lay_status:0,                   //遮罩层状态

    shops_cur_menu:'crop',          //商店当前所选菜单(暂时废弃)
    current_crop_index:0,             //当前操作作物id
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (opt) {
    //console.log(opt)
    wx.getSystemInfo({
      success: function(res) {
        //console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {

    }
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo != undefined){
      //允许授权
      var userInfo = e.detail.userInfo
      this._updateUserInfo(userInfo)
    }
    
  },

  _updateUserInfo:function(userInfo){
    if(userInfo != null && userInfo != undefined && userInfo !=''){
      var _userInfo = app.globalData.userInfo
      _userInfo['nickname'] = userInfo.nickName
      _userInfo['avatarurl'] = userInfo.avatarUrl
      _userInfo['status'] = 1
      app.globalData.userInfo = _userInfo
      this.setData({ 'userInfo': _userInfo,'hasUserInfoAuth':1 })
      wx.request({
        url: app.globalData.apiDomain + '/my/updateLite',
        data: {
          token: wx.getStorageSync('token'),
          nickname: _userInfo.nickname,
          avatarurl: _userInfo.avatarurl,
          app: 2
        },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        dataType: 'json',
        success: (res) => {
          if (res.data.status > 0) {
            wx.navigateTo({
              url: '/pages/friends/index',
            })
          }
        },

      })
    }
  },

  onShow: function () {
    //直接登录
    app.onLaunch(this.render)
  },

  //渲染页面
  render: function () {
    var that = this;
    //console.log(app.globalData.userInfo)
    this.setData({ 'userInfo':app.globalData.userInfo })
    //用户status为0时才需要检查是否授过权
    
    if (this.data.userInfo.status == 0) {
      wx.getSetting({
        success(res) {
          var hasUserInfoAuth = res.authSetting['scope.userInfo'] ? 1 : 0;
          that.setData({ 'hasUserInfoAuth': hasUserInfoAuth })
          //授过权的直接调用 getUserInfo 获取昵称和头像
          if (hasUserInfoAuth > 0) {
            
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                that._updateUserInfo(res.userInfo)
              }
            })
          }
        }
      })
    }
    /*wx.request({
      url: app.globalData.apiDomain + '/my/sign',
      data: {
        token: wx.getStorageSync('token'),
        app: 2
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: (res) => {
        if (res.data.status > 0) {
          this.setData({ 'showSignPanel': 1, 'showSignData': res.data.msg[1]['sign'] })
          //console.log(res.data.msg[1]['userInfo']['coins'])
          app.globalData.userInfo.new = res.data.msg[1]['userInfo']['new']
          app.globalData.userInfo.coins = res.data.msg[1]['userInfo']['coins']
        }
      },

    })*/

  },

  onReady:function(){
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    // animation.scale(2, 2).rotate(45).step()
    this.setData({
      animationData: this.animation.export()
    })
    var n = 0;
    var t = null;
    //连续动画需要添加定时器,所传参数每次+1就行
    t = setInterval(function () {
      // animation.translateY(-60).step()
      n = n + 1;
      //console.log(n)
      if (n > 10000) {
        clearInterval(t)
      }
      this.animation.rotate(10 * n).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 100)
  },


  //每日奖励
  award:function(e){
    
  },

  //跳转到好友页
  toFriends:function(e){
    wx.navigateTo({
      url: '/pages/friends/index',
    })
  },

  //分享
  onShareAppMessage: function (res) {
    res.type = 2;     //邀请场景 0 增加挑战次数 1 复活卡 2 邀请好友
    return app.onShareAppMessage(res, this.onShareCallback)
  },

  //邀请好友后的回调
  onShareCallback:function(){
    //util.alert('分享成功')
  },

  //种植行为
  crop_action:function(e){
      var crop_status = e.currentTarget.dataset.status;
      var crop_index = e.currentTarget.dataset.index;
      if (crop_status == 'crop-undig' || crop_status == 'crop-undig-shovel'){
        this.dig(crop_index);
      } else if(crop_status == 'crop-dig'){
        this.plant(crop_index)
      }
      this.setData({'current_crop_index':crop_index});
  },

  //确定对话框
  sureDialog:function(){
    if (typeof this.data.dialog_sure == 'function'){
      this.data.dialog_sure();
    }
  },

  //封装关闭对话框
  closeDialog:function(){
    if (typeof this.data.dialog_close == 'function') {
      this.data.dialog_close();
    }
  },

  //底层关闭对话框
  _closeDialog:function(){
    this.setData({'dialog_status':'hide'})
  },
  
  //开垦荒地
  dig: function (crop_index){
      this.setData({
      'dialog_status':'show',
      'dialog_text':'开荒将花费您50金币',
      'dialog_btn':0,
      'dialog_sure': this._dig_sure,
      'dialog_close':this._closeDialog,
      'crop_index':crop_index
    })
  },
  //确定开垦荒地
  _dig_sure: function (){
    var url = app.globalData.apiDomain+'/my/dig_sure'
    var data = { 'token': wx.getStorageSync('token'),'crop_index':this.data.crop_index,'app':2}
    util.request(url,'POST',data,this._dig_sure_callback)
  },

  //确定开垦荒地回调函数
  _dig_sure_callback:function(res){
    if(res.data.status > 0){
      this.setData({ 'dialog_status': 'hide' })
      setTimeout(()=>{
          util.alert('开垦成功')
          app.globalData.userInfo = res.data.msg;
          this.setData({ 'userInfo': res.data.msg})
      },300)
    
    } else{
      this.setData({'dialog_status':'hide'})
      setTimeout(()=>{
        this.setData({
          'dialog_status':'show',
          'dialog_text': res.data.msg[0],
          'dialog_btn': 1,
          'dialog_close': this._closeDialog
        })
      },500)
      
    }
  },

  //种植
  plant:function(crop_index){
    this.setData({'crop_index':crop_index,'bag_status':1,'lay_status':1});
  },

  //打开种子商店
  seedShop:function(){
    this.setData({'bag_status':0,'shop_status':1})
  },

  //渐隐效果
  fadeOut: function (key) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    //this.animation = animation
    animation.opacity(0).step()
    this.setData({
      [key]: animation.export(),
    })
  },
  
  //渐显效果
  fadeIn: function (key) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    animation.opacity(1).step()
    this.setData({
      [key]: animation.export(),
    })
  },

  //去商店购买种子
  goShop:function(){
    //this.fadeOut('bag_animationData');
    this.setData({'shops_status':1,'bag_status':0})
  },

  //商店切换选项卡(暂时废弃)
  chooseItem:function(e){
     var shops_cur_menu = e.currentTarget.dataset.menu
     this.setData({ 'shops_cur_menu': shops_cur_menu})
  },

  //打开背包
  openBag: function () {
    //this.fadeOut('bag_animationData');
    this.setData({ 'shops_status': 0, 'bag_status': 1 })
  },
})
