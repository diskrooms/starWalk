//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude:0,
    longitude:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //从小程序客户端获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: res=> {
        //var latitude = res.latitude
        //var longitude = res.longitude
        //var speed = res.speed
        //var accuracy = res.accuracy
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        /*wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 28
        })*/
      }
    })

    //初始化WIFI模块
    wx.startWifi({
      success:function(res){
        //获取WIFI信息
        wx.getConnectedWifi({
          success: function(res) {
            wx.showToast({
              title: res.wifi.BSSID+'',
              icon: 'success',
              duration: 2000
            })
          },
          fail: res => {
            wx.showToast({
              title: res.errCode + '',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
