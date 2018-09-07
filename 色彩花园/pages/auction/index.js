const util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    coins_shops_status: 0,      //智慧商店状态
    lay_status:0,               //遮罩层状态
    lay_top:0,                  //金币商店top值
    need_smart:0,               //购买物件所需智慧值
    buy_smart:0,                //准备购进多少智慧值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.onLaunch(this.render)
  },

  //渲染页面数据
  render: function () {
    this.setData({ 'userInfo': app.globalData.userInfo })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  //获取scoll-view滚动位置
  getScrollOffset: function () {
    var that = this
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      that.setData({ 'lay_top': res.scrollTop })
    }).exec()
  },

  /**
   * 拍卖集市-购买
   */
  buy:function(e){
    var price = e.currentTarget.dataset.price
    var ename = e.currentTarget.dataset.ename
    var cname = e.currentTarget.dataset.cname
    //console.log(app.globalData.userInfo.smart)


    if (parseInt(app.globalData.userInfo.smart) < parseInt(price)){
      util.alert('智慧不足')
      this.getScrollOffset()
      this.openBuyLayer(price)
    } else {
      //扣款并跳转至新页面
      var timestamp = parseInt(Date.parse(new Date()) / 1000)+'';    //时间戳并转换成字符串类型
      var sign = MD5.md5(timestamp + price + 'colorGarden')
      if(!this.data.buy_market_lock){
        this.setData({ 'buy_market_lock': 1 })                        //锁住 购买完成/取消前不能重复点击发请求
        var url = app.globalData.apiDomain + '/Color/marketBuy'
        var data = { 'token': wx.getStorageSync('token'), 'app': 3, 'price': price, 'sign': sign, 'timestamp': timestamp,'ename':ename,'cname':cname }
        util.request(url, 'POST', data, this.buy_market_callback)
      }
    }
  },

  //拍卖集市虚拟货币购买回调
  buy_market_callback:function(res){
    util.alert(res.data.msg[0])
    this.setData({ 'buy_market_lock': 0})
    //console.log(app.globalData.userInfo.smart)
    if (res.data.status > 0) {
      app.globalData.userInfo.smart = res.data.msg[1]
      //购买成功并跳转至填色页面
      wx.navigateTo({
        url: '/pages/index/webcanvas?cname=' + res.data.msg[3] + '&ename=' + res.data.msg[2],
      })
    } else {
      //TODO
    }
    
  },

  //关闭购买金币浮层
  closeShop: function () {
    this.setData({ 'coins_shops_status': 0, 'lay_status': 0 })
  },
  //打开购买浮层
  openBuyLayer: function (price) {
    this.setData({ 'coins_shops_status': 1, 'lay_status': 1})
    //请求签到和分享数据
    util.request(app.globalData.apiDomain + '/color/openBuyLayer', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3 }, (res) => {
      //console.log(res)
      this.setData({ 'today_sign': res.data.msg[0], 'today_share_group': res.data.msg[1],'need_smart': price })
    })
  },

  //分享
  shareG: function () {
    util.request(app.globalData.apiDomain + '/color/sign_post', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3, 'type': 2 }, (res) => {
      setTimeout(() => {
        if (res.data.status > 0) {
          let userInfo = this.data.userInfo
          userInfo['smart'] = res.data.msg[1]
          this.setData({ 'today_share_group': 1, 'userInfo': userInfo })
        }
        util.alert(res.data.msg[0])
      }, 3000)

    })
  },

  //今日已分享
  shared: function () {
    //不做任何处理
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
      this.setData({ 'coins_buy_lock': 1,'buy_smart':smart })                        //锁住 购买完成/取消前不能重复点击发请求
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
      'success': (res2) => {
        if (res2.errMsg == 'requestPayment:ok') {
          if(app.globalData.userInfo.smart + this.data.buy_smart >= this.data.need_smart){
              wx.redirectTo({
                url: '/pages/index/webcanvas',
              })
          } else {
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/auction/index',
              })
            }, 100);
          }
          console.log(res)
        }
      },
      'fail': (res2) => {
        this.setData({ 'coins_buy_lock': 0 })
      },
      'complete': (res2) => {
        this.setData({ 'coins_buy_lock': 0 })
      }
    })
  },

  //签到
  sign: function () {
    util.request(app.globalData.apiDomain + '/color/sign_post', 'POST', { 'token': wx.getStorageSync('token'), 'app': 3, 'type': 1 }, (res) => {
      if (res.data.status > 0) {
        //let userInfo = this.data.userInfo
        app.globalData.userInfo['smart'] = res.data.msg[1]
        this.setData({ 'today_sign': 1, 'userInfo': app.globalData.userInfo })
      }
      util.alert(res.data.msg[0])
    })
  },

  //今日已签到
  signed: function () {
    util.alert('今日已签到')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShareAppMessage()
  }
})