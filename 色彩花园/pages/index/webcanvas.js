// pages/index/webcanvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var cname = options.cname
      var ename = options.ename
      var nickname = options.nickname
      var avatar = options.avatar

      var token = wx.getStorageSync('token')
      this.setData({'src':'https://coder.51tui.vip/canvas/index2?cname='+cname+'&ename='+ename+'&token='+token+'&app=3'+'&nickname='+nickname+'&avatar='+avatar})
    console.log('https://coder.51tui.vip/canvas/index2?cname=' + cname + '&ename=' + ename + '&token=' + token + '&app=3' + '&nickname=' + nickname + '&avatar=' + avatar)
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
  
  },

  test:function(e){
    alert('ab')
  }
})