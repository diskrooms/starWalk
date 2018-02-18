// pages/detail/crypt.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    func_name:'',
    cipher: [],
    index:0,
    result: '这是是加密后的字符串'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.data.func_name = options.name;
      wx.request({
        url: app.globalData.apiDomain + '/smallContent/get_cipher_methods',
        data: { 'func_name': this.data.func_name},
        success:res=>{
          this.setData({cipher:res.data.msg})
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
  
  },

  /**
   * 切换加密类型
   */
  bindPickerChange:function(e){
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})