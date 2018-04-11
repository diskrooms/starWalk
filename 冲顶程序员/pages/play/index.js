// pages/play/index.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalTime:60,     //总计时间
    remains: 60,      //答题保留时间
    count: 0,         // 设置 计数器 初始为0
    countTimer: null,  // 设置 定时器 初始为null
    freq:100,           //绘制频率 ms
    arcWidth:3,         //圆环宽度
    arcPointX:25,          //圆环中心x坐标 相对于canvas容器
    arcPointY: 25,           //圆环中心y坐标 相对于canvas容器
    arcRadius:20,          //圆环半径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var article = '<code>\
      <?php\
    $arr = array(0 =>1, "aa" => 2, 3, 4);\
foreach($arr as $key => $val){\
  print($key == "aa" ? 5 : $val);\
}\
?>\
  </code>\
  <text>\
  以上程序输出什么？\
</text>';
    WxParse.wxParse('article', 'html', article, this, 5);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.drawProgressbg()
    //this.drawCircle(1)
    this.countInterval()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  //绘制圆
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  //绘制圆环
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    //gradient.addColorStop("0.5", "#40ED94");
    //gradient.addColorStop("1.0", "#5956CC");
    context.setLineWidth(this.data.arcWidth);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(this.data.arcPointX, this.data.arcPointY, this.data.arcRadius, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  //倒计时
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      var _count = this.data.count
      var _max = parseInt(this.data.totalTime * 1000 / this.data.freq)
      if (_count <= _max) {
        /* 绘制彩色圆环进度条 
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(_count / (_max / 2))
        _count++;
        this.setData({'count':_count})
      } else {
        clearInterval(this.countTimer);
      }
      var _spent_time = parseInt(_count * this.data.freq/1000) //花费时间 s
      var _remains_time = this.data.totalTime - _spent_time       
      this.setData({
        remains: _remains_time
      })
    }, this.data.freq)
  },
})