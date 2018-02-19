// pages/detail/crypt.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    func_name:'',   //加密函数
    cipher: [],     //可选的加密类型
    index:0,        //当前加密类型序号
    encrypt:'',     //当前加密类型名称

    data:'',        //待加密的数据
    result: '',     //加密结果
    key:'',         //加密密钥
    iv:'',          //加密向量 默认为空
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
          var default_index = 0;    //默认加密类型序号
          this.setData({
            cipher:res.data.msg,
            encrypt: res.data.msg[default_index],
            index: default_index
          })
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
   * 
   */
  bindTextAreaBlur:function(e){
    this.setData({
      data: e.detail.value
    })
  },

  /**
   * 切换加密类型
   */
  bindPickerChange:function(e){
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      encrypt: this.data.cipher[e.detail.value],
      index: e.detail.value
    })
  },

  /**
   * 
   */
  setKey:function(e){
    this.setData({
      key:e.detail.value
    })
  },

  setIv:function(e){
    this.setData({
      iv: e.detail.value
    })
  },

  /**
   * 加密
   */
  encrypt:function(){
    var that = this
    setTimeout(function(){
      console.log(that.data)
      wx.request({
        url: app.globalData.apiDomain + '/smallContent/get_cipher_methods',
        data: { 'data': that.data.data, 'encrypt': that.data.encrypt,
        'key':that.data.key,'iv'：that.data.iv},
        
      })
    },100)
  },
})