//app.js

function login(app,callback) {
  // 登录
  wx.login({
    success: res => {
      var code = res.code
      wx.getUserInfo({
        'withCredentials': true,
        'success': function (info) {
          var wechatGroupInfo = ''
          //获取群ID
          wx.showShareMenu({
            withShareTicket: true, //要求小程序返回分享目标信息
            success: function () {
              if (app.globalData.opt.scene == 1044) {
                wx.getShareInfo({
                  shareTicket: app.globalData.opt.shareTicket,
                  complete(res) {
                    wechatGroupInfo = res
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                      url: app.globalData.apiDomain+'/user/small_login',
                      data: {
                        'code': code,
                        'rawData': info.rawData,
                        'signature': info.signature,
                        'encryptedData': info.encryptedData,
                        'iv': info.iv,
                        'encryptedData_': wechatGroupInfo.encryptedData,
                        'iv_': wechatGroupInfo.iv
                      },
                      success: function (res) {
                        //console.log(res)
                        wx.setStorageSync('token', res.data.msg.auth)
                        app.globalData.userInfo = res.data.msg.userInfo
                        if(typeof callback =='function'){
                          callback();
                        }
                      }
                    })
                  }
                })
              } else {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                  url: app.globalData.apiDomain +'/user/small_login',
                  data: {
                    'code': code,
                    'rawData': info.rawData,
                    'signature': info.signature,
                    'encryptedData': info.encryptedData,
                    'iv': info.iv
                  },
                  success: function (res) {
                    //console.log(res)
                    wx.setStorageSync('token', res.data.msg.auth)
                    app.globalData.userInfo = res.data.msg.userInfo
                    if (typeof callback == 'function') {
                      callback();
                    }
                  }
                })
              }
            }
          })

        },
        fail: function (FAIL) {
          //console.log(fail) 取消授权
          unAuthModal(app, callback)
        },
        complete: function (complete) {
          //console.log('complete')
        }
      })

    }
  })
}

function onLogin(app,callback){
  wx.checkSession({
    success: function () {
      //console.log('登录态有效')
      //session 未过期，并且在本生命周期一直有效
      //检测token是否存在
      var token = wx.getStorageSync('token')
      if (token == '' || token == null || token == undefined) {
        login(app,callback)
      } else {
        //获取用户信息等系统数据
        wx.request({
          url: app.globalData.apiDomain+'/user/userInfo',
          data: { 'token': wx.getStorageSync('token') },
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          dataType: 'json',
          success:function(res){
            
          }
        })
      }
    },
    fail: function () {
      //登录态过期 重新登录
      //console.log(opt)
      login(app,callback)
    }
  })
}

//不授权弹出提示 opt为传递过来的 onLaunch 场景参数
function unAuthModal(app,callback){
  wx.showModal({
    title: '警告',
    content: '若不授权微信登录，将无法正常使用本小程序；点击授权，则可重新使用。若还是点击不授权，之后还想使用的话，请在微信【发现】-【小程序】-删掉本小程序，重新授权登录，方可使用',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
              //这里是授权成功之后 填写你重新获取数据的js
              //参考:
              login(app,callback)
            }
          }
        })
      } else if (res.cancel) {
        unAuthModal(app,callback);
      }
    }
  })
}

App({
  onLaunch: function (opt) {
    //console.log(opt)
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    if(opt != '' && opt != null && opt != undefined && (typeof opt != 'function')){
      //第一次将opt存储起来
      this.globalData.opt = opt;       
    } else {
      //第二次被外部直接调用 onLaunch 函数
      onLogin(this,opt)
    }
  },
  globalData: {
    opt:null,
    userInfo: null,
    apiDomain: 'https://coder.51tui.vip',     //api主域名
  },
  /*onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        //console.log(app.globalData.userInfo)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }*/
})