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
        url: '/pages/index/webcanvas?cname=' + cname + '&ename=' + ename + '&width=' + width + '&height=' + height,
      })

      /*if (e.detail.userInfo != undefined && e.detail.userInfo != '' && e.detail.userInfo != null){
        //console.log(e.detail.userInfo)
        var nickname = e.detail.userInfo.nickName;
        var avatar = e.detail.userInfo.avatarUrl;
        wx.navigateTo({
          url: '/pages/index/webcanvas?cname=' + cname + '&ename=' + ename + '&width=' + width + '&height=' + height+'&nickname='+nickname+'&avatar='+avatar,
        })
      }*/
      
  },

  onShow:function(e){
    app.onLaunch(this.render)
  },

  //渲染页面数据
  render:function(){
    this.setData({'imageData':app.globalData.userInfo})
  },
  //下载作品
  downloadGift:function(e){
    //console.log(e)
    wx.showLoading({
      title: '正在生成海报图...',
    })
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
          this.setData({'download':imgSrc})
      }
    })
  },

  //图片加载监听事件
  imgload:function(e){
    wx.hideLoading();
    this.setData({'lay_status': 1 })
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
  },

  //长按保存图片到相册
  saveImgToPhotosAlbum: function (e) {
    var img_url = e.currentTarget.dataset.src
    wx.downloadFile({
      url: img_url,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },

  //分享
  onShareAppMessage(){
    return app.onShareAppMessage()
  }
})
