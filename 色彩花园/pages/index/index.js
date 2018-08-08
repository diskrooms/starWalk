//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
      var name = e.currentTarget.dataset.name
      var width = e.currentTarget.dataset.width
      var height = e.currentTarget.dataset.height
      wx.navigateTo({
        url: '/pages/index/webcanvas?name='+name+'&width='+width+'&height='+height,
      })
  },

})
