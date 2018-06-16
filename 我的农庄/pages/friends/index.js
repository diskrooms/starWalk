// pages/firends/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'friendsData':''        //好友数据
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
    wx.request({
      url: app.globalData.apiDomain + '/my/friends',
      data: {
        token: wx.getStorageSync('token'),
        app: 2
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: (res) => {
        this.setData({'friendsData':res.data.msg[1]})
      },

    })
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
  onShareAppMessage: function (res) {
    res.type = 2;                   //分享场景 0 +挑战次数   1复活卡 2邀请好友
    return app.onShareAppMessage(res, this.onShareCallBack)
  },

  /**
   * 用户执行分享后的回调
   */
  onShareCallBack:function(){
      wx.redirectTo({
        url: '/pages/index/index',
      })
  }
})