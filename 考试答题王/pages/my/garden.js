// pages/my/garden.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    showFertilizerPanel:0,
    showWateringPanel:0,
    show_do_fertilizer:0,
    show_do_watering: 0,
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
    this.setData({'userInfo':app.globalData.userInfo}); 
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
    return app.onShareAppMessage();
  },

  //施肥弹窗
  fertilizer: function () {
    this.setData({ 'showFertilizerPanel': 1 })
  },

  //取消施肥弹窗
  cancelFertilizer:function(){
    this.setData({'showFertilizerPanel':0})
  },

  //取消浇水弹窗
  watering: function () {
    this.setData({ 'showWateringPanel': 1 })
  },

  //取消浇水弹窗
  cancelWatering: function () {
    this.setData({ 'showWateringPanel': 0 })
  },

  //执行施肥
  doFertilizer:function(){
    wx.request({
      url: app.globalData.apiDomain + '/my/doFertilizer',
      data: {
        token: wx.getStorageSync('token'),
        app: 2
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: (res) => {
        this.setData({ 'showFertilizerPanel': 0 })
        if(res.data.status > 0){
            setTimeout(() => {
              this.setData({ 'show_do_fertilizer': 1 })
              setTimeout(() => {
                app.globalData.userInfo = res.data.msg;
                this.setData({ 'show_do_fertilizer': 0, 'userInfo': app.globalData.userInfo})
                
              }, 2000)
            }, 500)
        } else {
          util.alert(res.data.msg[0]);
        }
      }
      //success
    })
    
  },
  
  //执行浇水
  doWatering:function(){
    wx.request({
      url: app.globalData.apiDomain + '/my/doWatering',
      data: {
        token: wx.getStorageSync('token'),
        app: 2
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: (res) => {
        this.setData({ 'showWateringPanel': 0 })
        if (res.data.status > 0) {
          setTimeout(() => {
            this.setData({ 'show_do_watering': 1 })
            setTimeout(() => {
              app.globalData.userInfo = res.data.msg;
              this.setData({ 'show_do_watering': 0, 'userInfo': app.globalData.userInfo })

            }, 2000)
          }, 500)
        } else {
          util.alert(res.data.msg[0]);
        }
      }
      //success
    })
    
  }
})