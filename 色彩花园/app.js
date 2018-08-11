//app.js
const util = require('./utils/util.js')

App({
  onLaunch: function (opt) {
    //console.log(opt)
    //var above = opt.query.above;
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    if (opt != '' && opt != null && opt != undefined && (typeof opt != 'function')) {
      //第一次将opt存储起来
      this.globalData.opt = opt;
    } else {
      //第二次被外部直接调用 onLaunch 函数
      onLogin(this, opt)
    }
  },
  globalData: {
    opt: null,
    userInfo: null,
    apiDomain: 'https://coder.51tui.vip',     //api主域名
    showAuthPanel: 0
  },

  onShareAppMessage: function (params, callback) {
    var that = this
    //console.log(params)
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
      }
    })
    return {
      title: util.share()['share_title'],
      path: '/pages/index/index?above=' + that.globalData.userInfo.id,
      imageUrl: util.share()['share_image'],
      success: function (res) {
        //console.log(res) //分享到群有tickets 分享到个人没有tickets
        var shareTickets = res.shareTickets;
        if (shareTickets == '' || shareTickets == undefined || shareTickets == null || shareTickets.length == 0) {
          //分享到个人
          //console.log('没有获取到tickets,分享给个人或者获取失败') 
          //alert('邀请成功');
          setTimeout(() => {
            if (typeof callback == 'function') {
              callback()
            }
          }, 1000)
          return false;
        } else {
          //分享到群
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function (res) {
              //console.log(res)
              wx.request({
                url: that.globalData.apiDomain + '/my/share',
                data: {
                  token: wx.getStorageSync('token'),
                  encryptedData_: res.encryptedData,
                  iv_: res.iv,
                  from: params.from,      //nenu右上角 button按钮
                  type: params.type,
                  app: 2
                },
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                dataType: 'json',
                success: (res) => {
                  if (res.data.status > 0) {
                    //alert(res.data.msg[0]);   //todo换对话框
                    setTimeout(() => {
                      if (typeof callback == 'function') {
                        callback(res.data.msg[1])
                      }
                    }, 1000)
                  } else {
                    alert(res.data.msg[0]);
                  }
                }
              })
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})

//弹出框
function alert(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

/**
 * 登录执行底层方法
 */
function login(app, callback) {
  // 登录
  wx.login({
    success: res => {
      var code = res.code
      //不使用getUserInfo获取详细信息 直接用openid注册用户
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var above = app.globalData.opt.query.above ? app.globalData.opt.query.above : 0
      if (app.globalData.opt.scene == 1044) {
        //群登录
        wx.getShareInfo({
          shareTicket: app.globalData.opt.shareTicket,
          complete(res) {
            var wechatGroupInfo = res
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            //console.log(res)
            wx.request({
              url: app.globalData.apiDomain + '/user/loginColor',
              method: 'POST',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              dataType: 'json',
              data: {
                'code': code,
                'encryptedData_': wechatGroupInfo.encryptedData,
                'iv_': wechatGroupInfo.iv,
                'above': above,
                'app': 3
              },
              success: function (res) {
                //console.log(res)
                wx.setStorageSync('token', res.data.msg.auth)
                wx.setStorageSync('sessionid', res.data.msg.sessionid)
                wx.setStorageSync('csrfToken', res.data.msg.csrfToken)
                app.globalData.userInfo = res.data.msg.userInfo
                if (typeof callback == 'function') {
                  callback();
                }
              }
            })
          }
        })
      } else {
        //个人登录
        wx.request({
          url: app.globalData.apiDomain + '/user/loginColor',
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          dataType: 'json',
          data: {
            'code': code,
            'above': above,
            'app': 3
          },
          success: function (res) {
            //console.log(res)
            wx.setStorageSync('token', res.data.msg.auth)
            wx.setStorageSync('sessionid', res.data.msg.sessionid)
            wx.setStorageSync('csrfToken', res.data.msg.csrfToken)
            //console.log(res.data.msg.userInfo)
            app.globalData.userInfo = res.data.msg.userInfo
            if (typeof callback == 'function') {
              callback();
            }
          }
        })
      }
    }
  })
}

/**
 * 检测是否需要执行登录
 */
function onLogin(app, callback) {
  wx.checkSession({
    success: function () {
      //console.log('登录态有效')
      //session 未过期，并且在本生命周期一直有效
      //检测token是否存在
      var token = wx.getStorageSync('token')
      if (token == '' || token == null || token == undefined) {
        login(app, callback)
      } else {
        //获取用户信息等系统数据
        wx.request({
          url: app.globalData.apiDomain + '/my/userInfo3',
          data: { 'token': wx.getStorageSync('token'), 'app': 3 },
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          dataType: 'json',
          success: function (res) {
            //console.log(res)
            app.globalData.userInfo = res.data.msg;
            if (typeof callback == 'function') {
              callback();
            }
          }
        })
      }
    },
    fail: function () {
      //登录态过期 重新登录
      //console.log(opt)
      login(app, callback)
    }
  })
}

