// pages/explain/index.js
var WxParse = require('../../wxParse/wxParse.js');
var lighter = require('../../utils/code-lighter.js');
var md5 = require('../../utils/md5.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      'explain':''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var q_id = options.q_id;
    var timestamp = parseInt(Date.parse(new Date()) / 1000)+'';    //当前时间戳
    var random = Math.ceil(Math.random() * 10000)  + '';    //随机数
    var sign = md5.md5(q_id + timestamp + random + 'coder')
    var sessionid = wx.getStorageSync('sessionid')          //session只用来防止重复提交 不可像web开发那样用来做登录机制 登录机制还是使用原有的不变
    wx.request({
      url: app.globalData.apiDomain + '/question/explain',
      data: {
        token: wx.getStorageSync('token'),
        q_id:q_id,
        timestamp: timestamp,
        random:random,
        sign:sign
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded", "cookie": "PHPSESSID=" + sessionid },
      dataType: 'json',
      success:function(res){
        //console.log(res.data.msg)
        that.setData({'explain':res.data.msg})
        
        //console.log(res.data.msg)
        WxParse.wxParse('wxParseData', 'html', res.data.msg, that, 5)     //'wxParseData'为绑定数据键名
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})