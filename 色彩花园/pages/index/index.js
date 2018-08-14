//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageData:{},
    lay_status: 0,             //遮罩层状态
    lay_top:0,                 //遮罩层top值
    download:'',               //
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  getUserInfo: function(e) {
    
  },
  detail:function(e){
      var cname = e.currentTarget.dataset.cname
      var ename = e.currentTarget.dataset.ename
      var width = e.currentTarget.dataset.width
      var height = e.currentTarget.dataset.height
      wx.navigateTo({
        url: '/pages/index/webcanvas?cname='+cname+'&ename='+ename+'&width='+width+'&height='+height,
      })
  },

  onShow:function(e){
    app.onLaunch(this.render)
  },

  //渲染页面数据
  render:function(){
    this.setData({'imageData':app.globalData.userInfo})
  },
  //下载作品
  bindGetUserInfo:function(e){
    //console.log(e)
    this.getScrollOffset()
    var userInfo = e.detail.userInfo
    var avatar = userInfo.avatarUrl
    var nickname = userInfo.nickName
    var ename = e.currentTarget.dataset.ename
    wx.request({
      url: app.globalData.apiDomain + '/canvas/download',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      data: {
        'token': wx.getStorageSync('token'),
        'avatar': avatar,
        'nickname': nickname,
        'ename':ename,
        'app': 3
      },
      success: (res)=> {
          var imgSrc = res.data
          this.setData({'download':imgSrc,'lay_status':1})
      }
    })
  },

  //获取scoll-view滚动位置
  getScrollOffset: function () {
    var that = this
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      that.setData({'lay_top':res.scrollTop})
    }).exec()
  },

  //关闭浮层
  closeLay:function(){
    this.setData({ 'lay_status': 0 })
  }
})
