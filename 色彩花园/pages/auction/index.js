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
    coins_shops_status: 0,      //金币商店状态
    lay_status:0,               //遮罩层状态


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

  /**
   * 拍卖集市-购买
   */
  buy:function(e){
    var price = e.currentTarget.dataset.price
    var ename = e.currentTarget.dataset.ename
    var cname = e.currentTarget.dataset.cname
    //console.log( typeof app.globalData.userInfo.smart)
    //console.log(typeof price)
    if (parseInt(app.globalData.userInfo.smart) < parseInt(price)){
      util.alert('智慧不足')
      this.setData({'coins_shops_status':1,'lay_status':1})
    } else {
      //扣款并调整新页面
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

  //拍卖集市购买回调
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})