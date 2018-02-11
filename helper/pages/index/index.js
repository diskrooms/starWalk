//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code_languages:[],
    interview_skills: [],
    remain_skills:[],
    remain_skills_status:'hide',
    tools:[],
    remain_tools:[],
    remain_tools_status:'hide'
  },
  //事件处理函数
  /*bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },*/
  onLoad: function () {
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
    wx.request({
      url: app.globalData.apiDomain+'/smallContent/index',
      success:res=>{
        //console.log(res);
        this.setData({ 'code_languages': res.data.msg.books,
                      'interview_skills':res.data.msg.ivs,
                      'remain_skills':res.data.msg.remain_ivs,
                      'tools':res.data.msg.tools,
                      'remain_tools': res.data.msg.remain_tools,
                    })
      }
    })
  },
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpToNewPage:function(e){
    //手册页
    var id = e.currentTarget.id
    //console.log(id)
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    })
  },
  jumpToNewPage2: function (e) {
    //面试宝典列表页
    var id = e.currentTarget.id
    //console.log(id)
    wx.navigateTo({
      url: '/pages/detail/ivList?id=' + id
    })
  },
  jumpToNewPage3: function (e) {
    //实用工具页
    var id = e.currentTarget.id
    //console.log(id)
    wx.navigateTo({
      url: '/pages/detail/tool?id=' + id
    })
  },
  show_remain_tools:function(e){
    var _status = this.data.remain_tools_status
    var _status = _status == 'show' ? 'hide' : 'show'
    this.setData({'remain_tools_status':_status})
  },
  instruction:function(){
    wx.navigateTo({
      url: '/pages/detail/instruction'
    })
  },
  purchase:function(e){
    wx.request({
      url: app.globalData.apiDomain + '/pay/small_buy',
      data:{
        token:wx.getStorageSync('token'),
        title:'购买单条推送',
        desc:'购买单条推送'
      },
      success:function(res){
        wx.requestPayment({
          'timeStamp': res.data.timeStamp+'',
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
          },
          'fail': function (res) {
          }
        })
      },

    })
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
