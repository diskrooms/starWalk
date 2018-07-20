// pages/index/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.moveTo(150, 150)
    ctx.arc(150, 150, 50, -Math.PI/2+0.2, 0)
    //ctx.closePath()
    ctx.stroke()      //描线 
    ctx.fill();     //填充
    
    /*ctx.beginPath();
    ctx.moveTo(150, 150)
    ctx.setFillStyle('#EEEEEE')
    ctx.arc(150, 150, 50, 0, Math.PI +0.5)
    ctx.stroke()      //描线
    ctx.fill();     //填充

    ctx.beginPath();
    ctx.moveTo(150, 150)
    ctx.setFillStyle('#FF0000')
    ctx.arc(150, 150, 50, Math.PI + 0.5, -Math.PI / 2 + 0.2)
    ctx.fill();     //填充*/
    ctx.draw()
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
  toFill:function(e){

  }
})