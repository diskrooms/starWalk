//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js');

//丰收动画参数
var ctx = null;   //丰收动画canvas实例
var factor = {
  speed: .008,    // 运动速度，值越小越慢
  t: 0            //  贝塞尔函数系数
};
var timer = null;  // 丰收动画循环定时器

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

    crop_index:-1,                  //当前操作的土块索引  -1  表示没有选中任何土块
    bag_status:0,                   //背包打开状态
    shops_status:0,                 //商店打开状态
    coins_shops_status:0,           //货币商店打开状态
    warehouse_status:0,             //磨坊仓储状态 
    warehouse_data:null,            //磨坊仓储数据
    award_status:0,                 //抽奖面板状态
    coins_buy_lock:0,               //货币商店购买锁  为false时才可以点击购买
    lay_status:0,                   //遮罩层状态

    shops_cur_menu:'crop',          //商店当前所选菜单(暂时废弃)
    fishing:0,                      //渔获状态 0 未操作 1 下饵 2 渔获
    fishing_min:'00',               //下饵倒计时 分
    fishing_sec:'00',               //下饵倒计时 秒
    fish_res:0,                     //钓鱼结果 0 未收获  -2 鱼跑了  -1 渔业资源枯竭  1 收获
    fish_size:0,                    //鱼儿尺寸
    fish_type:0,                    //鱼儿品种(数字描述)
    fish_type2:'',                  //鱼儿品种(汉字描述)
    fish_desc:'',                   //钓鱼描述

    /* 丰收动画参数 TODO 用函数初始化参数 */
    style_img: '',
    harvest_timer: [{ 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }, { 'factor': { speed: 0.008, t: 0 }, 'timer': null }],
    Bézier_data: [
          [     //第一块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第二块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第三块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第四块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第五块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第六块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第七块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第八块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第九块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第十块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第十一块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ],
          [     //第十二块
            [{ x: 400, y: 400 }, { x: 70, y: 300 }, { x: 50, y: 150 }, { x: 60, y: 0 }],    //第一条线
            [{ x: 400, y: 400 }, { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 60, y: 0 }],    //第二条线
            [{ x: 400, y: 400 }, { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 60, y: 0 }]       //第三条线
          ]
    ],

    /* 渔获丰收动画 */
    
    /* 每日奖励数据 */
    awards: [
      { 'name': '10个金币', 'type':1, 'count':10 },
      { 'name': '20个金币', 'type': 1, 'count': 20 },
      { 'name': '5颗钻石', 'type': 2, 'count': 5 },
      { 'name': '5点智慧', 'type': 3, 'count': 5 },
      { 'name': '2张入学卡', 'type': 4, 'count': 2 },
      { 'name': '2张过关卡', 'type': 5, 'count': 2 },
      { 'name': '2点智慧', 'type': 3, 'count': 2 },
      { 'name': '2颗钻石', 'type': 2, 'count': 2 }
    ],
    awardBtnDisabled:'',            //抽奖按钮状态
    awardsList:[],                  //转盘分区数据
    awardAnimationData:{},          //转盘动画
    awardDegree:0,                  //转盘旋转角度
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

  onUnload:function(){
    if (timer != null) {
      this.cancelAnimationFrame(timer);
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
    //作物生长进度
    this._timer_growing(this.data.userInfo)
    //播放背景音乐
    //this.playBGM()
  },

  //播放背景音乐
  playBGM:function(){
    var bgm = wx.getBackgroundAudioManager()
    bgm.src = 'http://coder.51tui.vip/Public/miniProgram/my_garden/music/stream.mp3'
    bgm.play();
    /*bgm.onEnded(()=>{
      bgm.src = 'http://coder.51tui.vip/Public/miniProgram/my_garden/music/stream.mp3'
      bgm.play();
    })*/
  },

  onReady:function(){
    //风车动画
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


  //每日奖励-打开转盘
  award:function(e){
    var len = this.data.awards.length,
    html = [],
    turnNum = 1 / len  // 文字旋转 turn 值
    const ctx = wx.createCanvasContext('awardCanvas')
    const color = ['#9C67FF', '#767070', '#34CCFD', '#FFC000', '#9C67FF', '#767070', '#34CCFD', '#FFC000']

    for (var i = 0; i < len; i++) {
      html.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', name: this.data.awards[i].name }); 
      //画扇形
      var curDegree = (i * turnNum + turnNum / 2) * 2 * Math.PI - Math.PI/2
      var nextDegree = ((i + 1) * turnNum + turnNum / 2) * 2 * Math.PI - Math.PI / 2
      ctx.beginPath();
      ctx.moveTo(150, 150)
      ctx.setFillStyle(color[i])
      ctx.arc(150, 150, 150, curDegree, nextDegree)
      ctx.fill();     
      //画指针
      ctx.beginPath();  //先画箭头
      ctx.moveTo(150, 60)
      ctx.setFillStyle('#d52127')
      ctx.arc(150, 60, 100, Math.PI / 2 - 0.1, Math.PI / 2 + 0.1)
      ctx.fill()

      ctx.beginPath();  //再画大圆
      ctx.moveTo(150, 150)
      ctx.setFillStyle('#2a2a29')
      ctx.arc(150, 150, 20, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath();  //最后画小圆
      ctx.moveTo(150, 150)
      ctx.setFillStyle('#434243')
      ctx.arc(150,150,10,0,2*Math.PI)
      ctx.fill()

    }
    //ctx.drawImage('../../images/award/pointer.png', 134, 52, 16, 57) //模糊 效果不佳
    ctx.draw()
    this.setData({ 'award_status': 1, 'lay_status': 1,'awardsList':html})
  },

  //每日奖励-点击抽奖-每日5次抽奖
  getAward: function () {
    var data = { 'token': wx.getStorageSync('token'), 'app': 2 }
    util.request(app.globalData.apiDomain + '/my/hasAward', 'POST', data, (res) => {
        if(res.data){
          var awardIndex = Math.random() * this.data.awards.length >>> 0;   //>>>0 右移0位等同于取整 parseInt
          //console.log(awardIndex)
          var runNum = 8
          var degree = this.data.awardDegree || 0;
          degree = degree + (360 - degree % 360) + (360 * runNum - awardIndex * (360 / this.data.awards.length))
          var animationRun = wx.createAnimation({
            duration: 4000,
            timingFunction: 'ease'
          })
          //that.animationRun = animationRun
          animationRun.rotate(degree).step()
          this.setData({
            awardAnimationData: animationRun.export(),
            awardBtnDisabled: 'disabled',
            awardDegree: degree
          })
          //抽奖结果提示
          setTimeout(() => {
            var data = { 'token': wx.getStorageSync('token'), 'app': 2, 'award_index': awardIndex }
            util.request(app.globalData.apiDomain + '/my/getAward', 'POST', data, (res) => {
              if(res.data.status > 0){
                util.alert('恭喜获得' + (this.data.awards[awardIndex].name))
                var _type = this.data.awards[awardIndex].type
                var _count = this.data.awards[awardIndex].count
                if(_type == 1){
                  app.globalData.userInfo.coins = parseInt(app.globalData.userInfo.coins)  + _count 
                } else if(_type == 2){
                  app.globalData.userInfo.diamond = parseInt(app.globalData.userInfo.diamond)  + _count 
                } else if (_type == 3){
                  app.globalData.userInfo.smart = parseInt(app.globalData.userInfo.smart)  + _count 
                } else if (_type == 4){
                  app.globalData.userInfo.ticket = parseInt(app.globalData.userInfo.ticket)  + _count 
                } else if(_type == 5){
                  app.globalData.userInfo.card = parseInt(app.globalData.userInfo.card) + _count 
                } else {
                  return;
                }
                this.setData({
                  userInfo: app.globalData.userInfo,
                  awardBtnDisabled: ''
                })
              } else {
                util.alert(res.data.msg[0]);
              }
            })
          }, 4000);
        
        } else {
          util.alert('今天的抽奖机会用完了，明天再来吧~')
        }
    })

    
  },
  //关闭抽奖
  closeAward: function () {
    this.setData({ 'award_status': 0, 'lay_status': 0 })
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
        //开垦
        this.dig(crop_index);
      } else if(crop_status == 'crop-dig'){
        //种植
        this.plant(crop_index)
      } else if(crop_status == 'crop-wheat-m' || crop_status == 'crop-corn-m' || crop_status == 'crop-carrot-m' || crop_status == 'crop-cabbage-m'){
        //收获
        this.harvest(crop_index,crop_status)
      }
      this.setData({'crop_index':crop_index});    //当前操作土块索引
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
    this.setData({'crop_index':crop_index,'shops_status':1,'lay_status':1});
  },


  //打开种子商店
  seedShop:function(){
    this.setData({'bag_status':0,'shops_status':1})
  },

  //关闭商店
  closeShop: function () {
    this.setData({'coins_shops_status':0, 'shops_status': 0,'lay_status':0})
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
  //购买种子
  buy:function(e){  
     var id = e.currentTarget.dataset.id;           //物品id
     var level = e.currentTarget.dataset.level;
     var price = e.currentTarget.dataset.price;
     if(parseInt(this.data.userInfo.level) < parseInt(level)){
       util.alert('您的等级不足，赶紧种菜升级吧~')
       return false;
     }
     if(parseInt(this.data.userInfo.coins) < parseInt(price)) {
       //util.alert('您的金币不足，赶紧邀请好友吧~')
       this.setData({'shops_status':0,'coins_shops_status':1});
       return false;
     }
     var url = app.globalData.apiDomain + '/my/buy_sure'
     var data = { 'token': wx.getStorageSync('token'), 'crop_index': this.data.crop_index, 'app': 2, 'item_id':id,}
     util.request(url, 'POST', data, this._buy_sure_callback)
  },

  //购买种子回调
  _buy_sure_callback(res){
      if(res.data.status > 0){
        setTimeout(() => { 
          app.globalData.userInfo = res.data.msg[1];
          var data = this.data.userInfo;
          var crop_data = this.data.userInfo.crop_data;
          for (var i in crop_data){
            for (var j in crop_data[i]){
              if (crop_data[i][j]['crop_index'] == res.data.msg[2]){
                crop_data[i][j] = res.data.msg[1]['crop_data'][0][0]
              }
            }
          }
          //都放入setTimeout内部，否则会因为setTimeout的异步性而造成数据不同步
          data = res.data.msg[1]
          data.crop_data = crop_data
          this.setData({ 'userInfo': data,'shops_status':0,'lay_status':0 })
          util.alert(res.data.msg[0])
          this._timer_growing(this.data.userInfo, res.data.msg[2])
        }, 300)
      }
  },

  //购买金币,钻石和智慧值
  buyCoins:function(e){
    var that = this;
    var title = e.currentTarget.dataset.title;
    var type = e.currentTarget.dataset.type;
    var price = e.currentTarget.dataset.price;
    var timestamp = parseInt(Date.parse(new Date()) / 1000);    //参数签名
    var random = Math.ceil(Math.random() * 100000) + 1 + '';    //强制转换字符
    var sign = MD5.md5(timestamp + random + price + type + 'mygarden')
    if(!this.data.coins_buy_lock){
      this.setData({'coins_buy_lock':1})                        //锁住 购买完成/取消前不能重复点击发请求
      var url = app.globalData.apiDomain + '/pay/index2'
      var data = { 'token': wx.getStorageSync('token'), 'app': 2, 'timestamp': timestamp, 'random': random,'sign':sign,'type':type,'price':price}
      util.request(url, 'POST', data, this._buycoins_sure_callback)
    }
  },

  //购买金币,钻石及智慧值成功回调
  _buycoins_sure_callback:function(res){
    wx.requestPayment({
      'timeStamp': res.data.timeStamp + '',
      'nonceStr': res.data.nonceStr,
      'package': res.data.package,
      'signType': 'MD5',
      'paySign': res.data.paySign,
      'success':  (res) =>{
        if (res.errMsg == 'requestPayment:ok') {
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 100);
        }
      },
      'fail':  (res)=>{
        this.setData({ 'coins_buy_lock': 0 })
      },
      'complete':(res)=>{
        this.setData({ 'coins_buy_lock': 0 })
      }
    })
  },

  //生长倒计时
  _timer_growing(data,crop_index=''){
    var that = this;
      var i,j;
      for(i in data['crop_data']){
        for(j in data['crop_data'][i]){
          if (crop_index != '' && data['crop_data'][i][j]['crop_index']!=crop_index){
            continue;
          }
          //console.log(i)
          //console.log(j)
          //console.log(data['crop_data'][i][j])
          if (data['crop_data'][i][j]['crop_seeding']){
            var totalSecond = data['crop_data'][i][j]['crop_remains'];
            (function(i,j){
              var interval = setInterval(function () {
                var second = totalSecond //总秒数
                /*var day = Math.floor(second / 3600 / 24);
                var dayStr = day.toString();
                if (dayStr.length == 1) dayStr = '0' + dayStr;*/
                var day = 0;

                var hr = Math.floor((second - day * 3600 * 24) / 3600); //小时
                var hrStr = hr.toString();
                if (hrStr.length == 1) hrStr = '0' + hrStr;
                var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);//分
                var minStr = min.toString();
                if (minStr.length == 1) minStr = '0' + minStr;
                var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;  //秒
                var secStr = sec.toString();
                if (secStr.length == 1) secStr = '0' + secStr;
                //console.log(i)
                data = that.data.userInfo
                data['crop_data'][i][j].hour = hrStr    //这里注意 setInterval 的异步性  使用闭包
                data['crop_data'][i][j].minute = minStr
                data['crop_data'][i][j].second = secStr
                //console.log(data['crop_data'][i][j])
                //console.log(data)
                that.setData({
                  'userInfo':data
                });

                totalSecond--;
                if (totalSecond < 0) {
                  clearInterval(interval);
                  //发送请求改变作物状态
                  var data = { 'token': wx.getStorageSync('token'), 'crop_index': data['crop_data'][i][j]['crop_index'], 'app': 2 }
                  util.request(app.globalData.apiDomain + '/my/mature_sure', 'POST', data, that._mature_sure_callback)
                }
            }.bind(this), 1000);
            })(i,j)
          }
        }
      }
  },

  //作物成熟回调
  _mature_sure_callback:function(res){
    var data = this.data.userInfo;
    var crop_data = this.data.userInfo.crop_data;
    for (var i in crop_data) {
      for (var j in crop_data[i]) {
        if (crop_data[i][j]['crop_index'] == res.data.msg[2]) {
          crop_data[i][j] = res.data.msg[1]['crop_data'][0][0]
        }
      }
    }
    data.crop_data = crop_data
    this.setData({ 'userInfo': data})
  },

  //收割作物
  harvest: function (crop_index,crop_status) {
    var url = app.globalData.apiDomain + '/my/harvest_sure'
    var data = { 'token': wx.getStorageSync('token'), 'crop_index': crop_index, 'crop_status': crop_status, 'app': 2 }
    util.request(url, 'POST', data, this._harvest_sure_callback)
  },

  //收割作物回调
  _harvest_sure_callback:function(res){
    var data = this.data.userInfo;
    var crop_data = this.data.userInfo.crop_data;
    for (var i in crop_data) {
      for (var j in crop_data[i]) {
        if (crop_data[i][j]['crop_index'] == res.data.msg[2]) {
          crop_data[i][j] = res.data.msg[1]['crop_data'][0][0]
        }
      }
    }
    data = res.data.msg[1]
    data.crop_data = crop_data
    this.setData({ 'userInfo': data })
    //丰收动画
    var crop_prev_status = res.data.msg[3];
    ctx = wx.createCanvasContext('canvas_wi')
    this.drawImage(res.data.msg[2]-1, crop_prev_status)
  },


  //绘制作物丰收动画
  drawImage: function (crop_index, crop_prev_status) {
    var that = this
    var data = this.data.Bézier_data[crop_index]
    var p10 = data[0][0];   // 三阶贝塞尔曲线起点坐标值
    var p11 = data[0][1];   // 三阶贝塞尔曲线第一个控制点坐标值
    var p12 = data[0][2];   // 三阶贝塞尔曲线第二个控制点坐标值
    var p13 = data[0][3];   // 三阶贝塞尔曲线终点坐标值

    var p20 = data[1][0];
    var p21 = data[1][1];
    var p22 = data[1][2];
    var p23 = data[1][3];

    var p30 = data[2][0];
    var p31 = data[2][1];
    var p32 = data[2][2];
    var p33 = data[2][3];

    var t = that.data.harvest_timer[crop_index]['factor']['t'];

    /*计算多项式系数 （下同）*/
    var cx1 = 3 * (p11.x - p10.x);
    var bx1 = 3 * (p12.x - p11.x) - cx1;
    var ax1 = p13.x - p10.x - cx1 - bx1;

    var cy1 = 3 * (p11.y - p10.y);
    var by1 = 3 * (p12.y - p11.y) - cy1;
    var ay1 = p13.y - p10.y - cy1 - by1;

    var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
    var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;

    /** ---------------------------------------- */
    var cx2 = 3 * (p21.x - p20.x);
    var bx2 = 3 * (p22.x - p21.x) - cx2;
    var ax2 = p23.x - p20.x - cx2 - bx2;

    var cy2 = 3 * (p21.y - p20.y);
    var by2 = 3 * (p22.y - p21.y) - cy2;
    var ay2 = p23.y - p20.y - cy2 - by2;

    var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
    var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;

    /** ---------------------------------------- */
    var cx3 = 3 * (p31.x - p30.x);
    var bx3 = 3 * (p32.x - p31.x) - cx3;
    var ax3 = p33.x - p30.x - cx3 - bx3;

    var cy3 = 3 * (p31.y - p30.y);
    var by3 = 3 * (p32.y - p31.y) - cy3;
    var ay3 = p33.y - p30.y - cy3 - by3;

    /*计算xt yt的值 */
    var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x;
    var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y;
    that.data.harvest_timer[crop_index]['factor']['t'] += that.data.harvest_timer[crop_index]['factor']['speed'];
    //各作物丰收图片尺寸
    var _size = {'crop-wheat-m':[7,36,8,45,9,37],'crop-corn-m':[10,42,22,53,21,41]}  

    ctx.drawImage("../../images/" + crop_prev_status + "1.png", xt1, yt1, _size[crop_prev_status][0], _size[crop_prev_status][1]);
    ctx.drawImage("../../images/" + crop_prev_status + "2.png", xt2, yt2, _size[crop_prev_status][2], _size[crop_prev_status][3]);
    ctx.drawImage("../../images/" + crop_prev_status + "3.png", xt3, yt3, _size[crop_prev_status][4], _size[crop_prev_status][5]);
    ctx.draw();
    if (that.data.harvest_timer[crop_index]['factor']['t'] > 1) {
      that.data.harvest_timer[crop_index]['factor']['t'] = 0;
      that.cancelAnimationFrame(that.data.harvest_timer[crop_index]['timer']);
      //that.startTimer(crop_prev_status);
    } else {
      //console.log(that.data.harvest_timer[crop_index])
      if (that.data.harvest_timer[crop_index]['timer'] == null){
        that.data.harvest_timer[crop_index]['timer'] = that.requestAnimationFrame(function () {
          that.drawImage(crop_index, crop_prev_status)
        })
      }
    }
  },

  //requestAnimationFrame 函数兼容性处理
  requestAnimationFrame: function (callback) {
    return setInterval(callback, 1000 / 60);
  },

  //cancelAnimationFrame 函数兼容性处理
  cancelAnimationFrame: function (t) {
    clearInterval(t)
  },

  //渔获
  fishing:function(){
    var fish_status = this.data.fishing
    if(fish_status == 0){
      //下饵
      this.setData({'fishing':1})
      var totalSecond = 10     //总秒数
      var t = setInterval(function () {
        var second = totalSecond 
        var day = 0;
        var hr = Math.floor((second - day * 3600 * 24) / 3600); //小时
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);//分
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;  //秒
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        this.setData({
          'fishing_min': minStr,
          'fishing_sec': secStr
        });
        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(t);
          this.setData({ 'fishing': 2 })
        }
      }.bind(this), 1000)
    } else if (fish_status == 2){
      //渔获
      this.setData({ 'fishing': 0 })
      var data = { 'token': wx.getStorageSync('token'), 'app': 2 }
      util.request(app.globalData.apiDomain + '/my/fishing', 'POST', data, this._fishing_sure_callback)
    }
  },

  _fishing_sure_callback:function(res){
    if(res.data.status < 0){
      this.setData({ 'fish_res': res.data.status, 'fish_desc': res.data.msg[0],'lay_status':1})
    } else {
      this.setData({ 'fish_res': res.data.status, 'fish_desc': res.data.msg[1]['desc'], 'lay_status': 1, 'fish_type': res.data.msg[1]['type'], 'fish_type2': res.data.msg[1]['type2'], 'fish_size': res.data.msg[1]['size'] })
    }
  },

  //关闭渔获窗口
  closeFish:function(){
    this.setData({ 'fish_res': 0, 'lay_status': 0 })
  },

  //TODO 放鱼加经验
  abandonFish:function(){
    this.closeFish();
    setTimeout(()=>(
      util.alert('鱼儿很感激，说不定以后会报答你')
    ),500)
    
  },
  //抓鱼
  catchFish:function(){
    this.closeFish();
    var data = { 'token': wx.getStorageSync('token'), 'app': 2, 'fish_size': this.data.fish_size, 'fish_type': this.data.fish_type}
    util.request(app.globalData.apiDomain + '/my/catchFish', 'POST', data, this._catch_fish_callback)
  },

  //抓鱼回调 TODO 升级动画
  _catch_fish_callback:function(res){
      if(res.data.status < 0){
        var _coins = res.data.msg[1]
        app.globalData.userInfo.coins = _coins
        var _userInfo = app.globalData.userInfo
        util.alert(res.data.msg[0] +',金币 -5')
        this.setData({ 'userInfo': _userInfo})
      } else {
        var _energy = res.data.msg[1]
        var _level = res.data.msg[2]
        var _cur_energy = res.data.msg[3]
        var _max = res.data.msg[4]
        app.globalData.userInfo.energy = _energy
        app.globalData.userInfo.level = _level
        app.globalData.userInfo.cur_energy = _cur_energy
        app.globalData.userInfo.max = _max
        var _userInfo = app.globalData.userInfo
        this.setData({ 'userInfo': _userInfo })
        util.alert(res.data.msg[0])
      }
  },
  
  //打开磨坊仓储
  openWarehouse:function(){
    var data = { 'token': wx.getStorageSync('token'), 'app': 2}
    util.request(app.globalData.apiDomain + '/my/warehouse', 'POST', data, (res)=>{
      this.setData({ 'warehouse_data':res.data.msg[1],'warehouse_status': 1, 'lay_status': 1 })
    })
    
  },
  //关闭仓储
  closeWarehouse:function(){
    this.setData({ 'warehouse_status': 0, 'lay_status': 0 })
  },
  //仓储减少售卖
  minus:function(e){
    var _index = e.currentTarget.dataset.index
    var warehouse_data = this.data.warehouse_data
    var sell_count = warehouse_data[_index]['item_sell_count']
    sell_count = (sell_count > 1) ? sell_count - 1 : 1
    warehouse_data[_index]['item_sell_count'] = sell_count
    this.setData({'warehouse_data':warehouse_data})
  },
  //仓储增加售卖
  plus: function (e) {
    var _index = e.currentTarget.dataset.index
    var warehouse_data = this.data.warehouse_data
    var sell_count = warehouse_data[_index]['item_sell_count']
    var item_count = warehouse_data[_index]['item_count']
    sell_count = (sell_count < item_count) ? sell_count + 1 : item_count
    warehouse_data[_index]['item_sell_count'] = sell_count
    this.setData({ 'warehouse_data': warehouse_data })
  },
  //仓储售卖
  sell:function(e){
    var _index = e.currentTarget.dataset.index
    var id = this.data.warehouse_data[_index]['id']
    var sell_count = this.data.warehouse_data[_index]['item_sell_count']
    var data = { 'token': wx.getStorageSync('token'), 'app': 2,'id':id,'sell_count':sell_count }
    util.request(app.globalData.apiDomain + '/my/sell', 'POST', data, (res) => {
      var _coins = res.data.msg[2]
      app.globalData.userInfo.coins = _coins
      var _userInfo = app.globalData.userInfo
      util.alert('金币+' + res.data.msg[3])
      this.setData({ 'warehouse_data': res.data.msg[1],'userInfo': _userInfo })
    })
  },

  //去学校上学
  goToSchool:function(){
    wx.navigateTo({
      url: '/pages/school/index',
    })
  },
  
})
