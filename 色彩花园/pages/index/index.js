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
})
