//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jobChoose: { 'php': 0, 'java': 0, 'python': 0, 
                'front': 0,'maintenance': 0,'go': 0,
                'c': 0, 'android': 0,'arithmetic':0
               },
    showJobChoosePanel:0,    //职业选择框显示开关
    showSharePanel:0,        //分享提示框开关
    showAuthPanel: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //onshow里不能再直接进行登录 需要先进行授权验证
  onShow: function () {
    //console.log('onShow')
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          //直接登录
          app.onLaunch(that.render)
        } else {
          that.setData({'showAuthPanel':1})
        }
      }
    })
  },
  onGotUserInfo:function(e){
    if (e.detail.encryptedData){
      this.setData({ 'showAuthPanel': 0 })
      app.onLaunch(this.render)
    } else {

    }
  },
  //渲染页面
  render:function(){
    this.setData({'userInfo':app.globalData.userInfo})
    var set_job = wx.getStorageSync('set_job')
    if (!(set_job > 0)) {
      this.setData({ "showJobChoosePanel": 1 })
    }
    
  },
  //职业选择
  chooseJob:function(e){
    var id = e.currentTarget.id
    var jobChoose = this.data.jobChoose
    if (jobChoose[id] > 0){
      jobChoose[id] = 0;
    } else {
      jobChoose[id] = 1;
    }
    this.setData({ jobChoose: jobChoose })
  },
  //提交职业
  submitJob:function(){
    var that = this;
    var jobs = [];
    var jobChoose = this.data.jobChoose
    for (var i in jobChoose){
      if(jobChoose[i] >0){
        jobs.push(i)
      }
    }
    if(jobs.length == 0){
      util.alert('请选择您擅长的语言');
      return;
    }
    wx.request({
      url: app.globalData.apiDomain+'/my/settings',
      data:{'jobs':jobs,'token':wx.getStorageSync('token')},
      method:'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType:'json',
      success:function(res){
        if(res.data.status > 0){
          /*var t = setTimeout(function(){
            that.setData({ 'showJobChoosePanel': 0 })
            wx.setStorageSync('set_job', 1);
            t = null;
            if(t == null){
              t = setTimeout(function () {
                wx.showModal({
                  title: '已设置职业',
                  content: '如果想更改，可点击左上角进行设置',
                  showCancel: false,
                  success: function (res) {
                    t = null
                  }
                })
              }, 200);
            }
          },500)*/
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000,
            success:function(){
              var t = setTimeout(function(){
                that.setData({ 'showJobChoosePanel': 0 })
                wx.setStorageSync('set_job', 1);
                t = null;
              },2000);
            }
          })
        } else {
          wx.showToast({
            title: '未作设置',
            icon: 'none',
            duration: 2000,
            success: function () {
              var t = setTimeout(function () {
                that.setData({ 'showJobChoosePanel': 0 })
                t = null;
              }, 2000);
            }
          })
        }
      }
    })
  },
  //开始答题
  start:function(){
    if(app.globalData.userInfo.ticket > 0){
      wx.navigateTo({
        url: '/pages/play/index',
      })
    } else {
      this.setData({'showSharePanel':1});
    }
  },
  //取消分享提示框
  cancelShowShare:function(){
    this.setData({ 'showSharePanel': 0 });
  },
  //分享
  onShareAppMessage: function (fromRes) {
    var that = this;
    //res form target
    wx.showShareMenu({
      withShareTicket: true,
      success: function (showRes) {    //showShareMenu:ok showShareMenu会打开群分享体验并shareTickets出现
      }
    })
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: function (shareRes) {
        //转发成功记录
        var shareTicket = shareRes.shareTickets[0];
        if (shareTicket != '' && shareTicket != null && shareTicket != undefined){
          wx.getShareInfo({
            shareTicket: shareTicket,
            success:function(infoRes){
              //记录分享信息 start
              wx.request({
                url: app.globalData.apiDomain + '/my/shareLog',
                data: {
                  'token': wx.getStorageSync('token'),
                  'fromRes': fromRes,                             //分享来源 按钮还是右上角
                  'url':'/pages/index/index',                     //分享页面url
                  'encryptedData': infoRes.encryptedData,
                  'iv': infoRes.iv
                },
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                dataType: 'json',
                success: function (res) {
                    if(res.data.status > 0){
                      //console.log(res.data.msg)
                        //分享成功
                      wx.showToast({
                        title: res.data.msg[0],
                        icon:'none',
                        duration: 2000
                      })
                      app.globalData.userInfo.ticket = res.data.msg[1];
                      that.setData({ 'userInfo': app.globalData.userInfo});
                    } else {
                        //分享失败
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 2000
                        })
                    }
                }
              })
              //记录分享信息 end
            }
          })
          
        }
      },
      fail: function (shareRes) {
        // 转发失败
        //console.log(shareRes)
      }
    }
  }
})
