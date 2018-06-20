var interval = "";//周期执行函数的对象
var time = 0;//滑动时间
var touchDot = 0;//触摸时的原点
var flag_hd = true;//判定是否可以滑动

let animationShowHeight = 300;//动画偏移高度

Page({

  /**
    * 页面的初始数据
  */
  data: {

    // 遮罩层变量
    animationData: "",
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,

    // 评分变量
    stars: [0, 1, 2, 3, 4],//评分数值数组
    normalSrc: '../images/score.png',//空心星星图片路径
    selectedSrc: '../images/fullstar.png',//选中星星图片路径
    key: 0,//评分
  },

  //点击星星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },

  // 确定评分
  mark_click: function () {
    this.hideModal()
  },

  // 显示遮罩层  
  showModal: function () {
    //创建一个动画实例animation。调用实例的方法来描述动画。
    var animation = wx.createAnimation({
      duration: 500,         //动画持续时间500ms
      timingFunction: "ease",//动画以低速开始，然后加快，在结束前变慢
      delay: 0               //动画延迟时间0ms
    })
    this.animation = animation
    //调用动画操作方法后要调用 step() 来表示一组动画完成
    animation.translateY(animationShowHeight).step()//     在Y轴向上偏移300
    this.setData({
      //通过动画实例的export方法导出动画数据传递给组件的animation属性。
      animationData: animation.export(),
      showModalStatus: true //显示遮罩层
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },

  // 隐藏遮罩层  
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 评分按钮
  score_click: function () {

  },


  /**
    * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

  },

  /**
    * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },

  /**
    * 生命周期函数--监听页面显示
  */
  onShow: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
  },

  /**
    * 生命周期函数--监听页面隐藏
  */
  onHide: function () {

  },

  /**
    * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {

  },

  /**
    * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {

  },

  /**
    * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },

})