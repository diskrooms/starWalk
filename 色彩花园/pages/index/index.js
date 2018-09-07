//index.js
const util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageData:{},
    lay_status: 0,             //遮罩层状态
    lay_top:0,                 //遮罩层top值
    download:'',               //
    coins_shops_status:0,      //金币商店状态
    today_sign:0,              //今日是否已签到
    today_share_group:0,       //今日是否已分享群组
    buy_index_lock:0,          //首页购买锁
    need_smart: 0,             //购买物件所需智慧值
    buy_smart: 0,              //准备购进多少智慧值
    bought_sid:[],             //已经购买的物料 sid 存放数组
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  getUserInfo: function(e) {
    
  },
  
  //点击物件动作-跳转至填色页或者弹出智慧购买页
  detail:function(e){
      var cname = e.currentTarget.dataset.cname
      var ename = e.currentTarget.dataset.ename
      var width = e.currentTarget.dataset.width
      var height = e.currentTarget.dataset.height
      var price = e.currentTarget.dataset.price
      var sid = e.currentTarget.dataset.sid
      
      if(price > 0){  
        //非免费
        if (!this.data.buy_index_lock) {
          this.setData({ 'buy_index_lock': 1 })                        //锁住 请求完成/取消前不能重复点击发请求
          var url = app.globalData.apiDomain + '/Color/indexSmartBuy'
          var data = { 'token': wx.getStorageSync('token'), 'app': 3, 'sid':sid }
          util.request(url, 'POST', data, this.buy_index_callback)
        }
      } else {
        //免费
        wx.navigateTo({
          url: '/pages/index/webcanvas?cname=' + cname + '&ename=' + ename + '&width=' + width + '&height=' + height,
        })
      }
  },

  //首页虚拟货币购买回调
  buy_index_callback: function (res) { 
    this.setData({ 'buy_index_lock': 0 })
    if (res.data.status > 0) {
      app.globalData.userInfo.smart = res.data.msg[1]
      //购买成功(或已购买)并跳转至填色页面
      wx.navigateTo({
        url: '/pages/index/webcanvas?cname=' + res.data.msg[3] + '&ename=' + res.data.msg[2],
      })
    } else if(res.data.status == 0) {
      //智慧不足 需要充值
      util.alert(res.data.msg[0])
      this.getScrollOffset()
      this.openBuyLayer(res.data.msg[2])
    } else {
      //其他错误
      util.alert(res.data.msg[0])
    }
  },

  onShow:function(e){
    app.onLaunch(this.render)
  },

  //渲染页面数据
  render:function(){
    this.setData({ 'userInfo': app.globalData.userInfo,'bought_sid':app.globalData.userInfo.bought_sid})
    //console.log(typeof this.data.bought_sid.indexOf('2'));
  },

  //下载作品
  downloadGift:function(e){
    //console.log(e)
    wx.showLoading({
      title: '正在生成海报图...',
    })
    this.getScrollOffset()
    var userInfo = e.detail.userInfo
    var avatar = userInfo.avatarUrl
    var nickname = userInfo.nickName
    var ename = e.currentTarget.dataset.ename
    wx.request({
      url: app.globalData.apiDomain + '/canvas/download',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      data: {
        'token': wx.getStorageSync('token'),
        'avatar': avatar,
        'nickname': nickname,
        'ename':ename,
        'app': 3
      },
      success: (res)=> {
          var imgSrc = res.data
          this.setData({'download':imgSrc})
      }
    })
  },

  //图片加载监听事件
  imgload:function(e){
    wx.hideLoading();
    this.setData({'lay_status': 1 })
  },

  //获取scoll-view滚动位置
  getScrollOffset: function () {
    var that = this
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      that.setData({'lay_top':res.scrollTop})
    }).exec()
  },

  //关闭遮罩浮层
  closeLay:function(){
    this.setData({ 'lay_status': 0 })
  },
  //关闭购买浮层
  closeShop:function(){
    this.setData({ 'coins_shops_status': 0, 'lay_status': 0 })
  },
  //打开购买浮层
  openBuyLayer:function(price){
    this.setData({ 'coins_shops_status': 1, 'lay_status': 1})
    //请求签到和分享数据
    util.request(app.globalData.apiDomain + '/color/openBuyLayer', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3},(res)=>{
      //console.log(res)
      this.setData({ 'today_sign': res.data.msg[0], 'today_share_group': res.data.msg[1], 'need_smart': price })
    })
  },

  //购买智慧值
  buyCoins: function (e) {
    var that = this;
    var price = e.currentTarget.dataset.price;                  //该物件人民币价格
    var smart = e.currentTarget.dataset.smart;                  //购买多少智慧值
    var timestamp = parseInt(Date.parse(new Date()) / 1000);    //参数签名
    var random = Math.ceil(Math.random() * 100000) + 1 + '';    //强制转换字符
    var sign = MD5.md5(timestamp + random + price + 'colorgarden')
    if (!this.data.coins_buy_lock) {
      this.setData({ 'coins_buy_lock': 1, 'buy_smart': smart })                        //锁住 购买完成/取消前不能重复点击发请求
      var url = app.globalData.apiDomain + '/pay/color'
      var data = { 'token': wx.getStorageSync('token'), 'app': 3, 'timestamp': timestamp, 'random': random, 'sign': sign, 'price': price }
      util.request(url, 'POST', data, this._buycoins_sure_callback)
    }
  },

  //购买智慧值成功回调
  _buycoins_sure_callback: function (res) {
    wx.requestPayment({
      'timeStamp': res.data.timeStamp + '',
      'nonceStr': res.data.nonceStr,
      'package': res.data.package,
      'signType': 'MD5',
      'paySign': res.data.paySign,
      'success': (res) => {
        if (res.errMsg == 'requestPayment:ok') {
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 100);
        }
      },
      'fail': (res) => {
        this.setData({ 'coins_buy_lock': 0 })
      },
      'complete': (res) => {
        this.setData({ 'coins_buy_lock': 0 })
      }
    })
  },
  
  //签到
  sign:function(){
    util.request(app.globalData.apiDomain + '/color/sign_post', 'POST', {'token':wx.getStorageSync('token'),'app':3,'type':1}, (res)=>{
      if(res.data.status > 0){
        let userInfo = this.data.userInfo
        userInfo['smart'] = res.data.msg[1]
        this.setData({ 'today_sign': 1, 'userInfo': userInfo })
      }
      util.alert(res.data.msg[0])
    })
  },

  //今日已签到
  signed:function(){
      util.alert('今日已签到')
  },

  //分享
  shareG:function(){
    util.request(app.globalData.apiDomain + '/color/sign_post', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3,'type':2 }, (res) => {
      setTimeout(()=>{
          if (res.data.status > 0) {
            let userInfo = this.data.userInfo
            userInfo['smart'] = res.data.msg[1]
            this.setData({ 'today_share_group': 1, 'userInfo': userInfo })
          }
          util.alert(res.data.msg[0])
      },3000)
      
    })
  },

  //今日已分享
  shared:function(){
      //不做任何处理
  },

  //长按保存图片到相册
  saveImgToPhotosAlbum: function (e) {
    var img_url = e.currentTarget.dataset.src
    wx.downloadFile({
      url: img_url,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },

  //分享
  onShareAppMessage(){
    return app.onShareAppMessage()
  }
})
