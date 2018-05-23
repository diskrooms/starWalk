// pages/list/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'currentTabIndex':0,
    'listData':[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('onLoad')
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
    wx.request({
      url: app.globalData.apiDomain + '/question/ranklist',
      data: { 'token': wx.getStorageSync('token') },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: (res) => {
        console.log(res)
        this.setData({ 'listData': res.data.msg });
      }
    })
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
  
  },
  /**
   * 切换tab
   */
  switchTab:function(e){
    var index = e.currentTarget.id;
    //console.log(index)
    this.setData({'currentTabIndex':index});
  }
})