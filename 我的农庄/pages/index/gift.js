//index.js
//获取应用实例
var app = getApp()
var cxt_arc;
var timer;
var n = 1;
var timer;
var which = 1;//中奖项
var luck = ["5积分", "5金币", "10积分", "10金币", "谢谢参与", "20金币"];//定义奖项
Page({
  data: {
    animationData: {},//动画
    isclick: "start",//按钮事件
    image: "/images/dianji_choujiang.png",//转盘图片
    hiddenModal: true,//弹框是否隐藏
    detail: "恭喜您获得" + luck[which - 1]//弹框内容
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    
  },

  start: function (e) {
    var _this = this;
    n = 1;
    this.setData({
      isclick: "stop"
    })
    reset.call(_this);
    timer = setInterval(function () {
      //开始旋转
      star.call(_this);
      //
      n++;
    }
      , 300);
    //启动动画
    function star() {
      console.log("开始动画.....")
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 300,
        timingFunction: "linear"
      });
      animation.rotate(360 * n).step();
      this.setData({
        animationData: animation.export(),
        image: "/images/dianji_tingzhi.png"
      })
    }
    //重置动画
    function reset() {
      console.log("重置动画.....")
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 0,
        timingFunction: "linear"
      });
      animation.rotate(0).step();
      this.setData({
        animationData: animation.export()
      })
    }

  },
  stop: function (e) {
    var _this = this;
    this.setData({
      isclick: ""
    })
    clearInterval(timer);
    timer = null;
    console.log("结束动画.....");
    sto.call(_this);
    function sto() {
      console.log("重置动画.....")
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 1.4 * (2160 - (which - 1) * 60),
        timingFunction: "ease-out"
      });
      console.log(Math.random() * 60);
      animation.rotate(360 * n + (2160 - ((which - 2) * 60) - 35 - (Math.random() * 50))).step();
      this.setData({
        animationData: animation.export(),
        image: "/images/dianji_choujiang.png",
      })
    }

    timer = setTimeout(function () {
      _this.setData({
        hiddenModal: false
      })
    }
      , 1.4 * (2160 - (which - 1) * 60 + 300));

  },
  listenerConfirm: function (e) {
    var _this = this;
    this.setData({
      hiddenModal: true,
      isclick: "start"
    })
    reset.call(_this);
    function reset() {
      console.log("重置动画.....")
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 0,
        timingFunction: "linear"
      });
      animation.rotate(0).step();
      this.setData({
        animationData: animation.export()
      })
    }
  }
})
