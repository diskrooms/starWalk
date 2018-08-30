//index.js
const util = require('../../utils/util.js')
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
  detail:function(e){
      var cname = e.currentTarget.dataset.cname
      var ename = e.currentTarget.dataset.ename
      var width = e.currentTarget.dataset.width
      var height = e.currentTarget.dataset.height
      wx.navigateTo({
        url: '/pages/index/webcanvas?cname=' + cname + '&ename=' + ename + '&width=' + width + '&height=' + height,
      })

      /*if (e.detail.userInfo != undefined && e.detail.userInfo != '' && e.detail.userInfo != null){
        //console.log(e.detail.userInfo)
        var nickname = e.detail.userInfo.nickName;
        var avatar = e.detail.userInfo.avatarUrl;
        wx.navigateTo({
          url: '/pages/index/webcanvas?cname=' + cname + '&ename=' + ename + '&width=' + width + '&height=' + height+'&nickname='+nickname+'&avatar='+avatar,
        })
      }*/
      
  },

  onShow:function(e){
    app.onLaunch(this.render)
  },

  //渲染页面数据
  render:function(){
    this.setData({'userInfo':app.globalData.userInfo})
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
  openBuyLayer:function(){
    //请求签到和分享数据
    util.request(app.globalData.apiDomain + '/color/openBuyLayer', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3},(res)=>{
      //console.log(res)
      this.setData({ 'today_sign': res.data.msg[0], 'today_share_group': res.data.msg[1], 'coins_shops_status': 1, 'lay_status': 1 })
    })
  },

  //购买智慧值
  buyCoins: function (e) {
    var that = this;
    var title = e.currentTarget.dataset.title;
    var type = e.currentTarget.dataset.type;
    var price = e.currentTarget.dataset.price;
    var timestamp = parseInt(Date.parse(new Date()) / 1000);    //参数签名
    var random = Math.ceil(Math.random() * 100000) + 1 + '';    //强制转换字符
    var sign = MD5.md5(timestamp + random + price + type + 'colorgarden')
    if (!this.data.coins_buy_lock) {
      this.setData({ 'coins_buy_lock': 1 })                        //锁住 购买完成/取消前不能重复点击发请求
      var url = app.globalData.apiDomain + '/pay/index2'
      var data = { 'token': wx.getStorageSync('token'), 'app': 3, 'timestamp': timestamp, 'random': random, 'sign': sign, 'type': type, 'price': price }
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
