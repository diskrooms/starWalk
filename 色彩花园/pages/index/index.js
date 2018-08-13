//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageData:{}
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
      success: function (res) {

      }
    })
  }
})
