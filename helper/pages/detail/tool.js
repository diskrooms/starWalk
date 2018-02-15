// pages/detail/tool.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      func_name:'',
      data:'',
      pwd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.name)
    this.data.func_name = options.name;
    
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

  bindTextAreaBlur:function (e){
    this.data.data = e.detail.value
    //console.log(this.data.data)
  },

  calculator:function(){
    var that = this;
    setTimeout(function(){
      if(that.data.data == '' || that.data.data == undefined || that.data.data == null){
        wx.showToast({
          title: '请输入待加密或者待哈希数据',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      wx.request({
        url: app.globalData.apiDomain + '/smallContent/calculator',
        data: { 'func_name': that.data.func_name, 'data': that.data.data, 'pwd':that.data.pwd },
        success: res => {

        }
      })
    }
    ,100)
  },
})