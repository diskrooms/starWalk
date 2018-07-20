// pages/index/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'imagePath': '../../images/ice.png',
    'canvasPixelsData':[],
    'imageWidth':69,
    'imageHeight':122,
    'count':0
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
    const ctx = wx.createCanvasContext('myCanvas')
    this.setData({ 'ctx': ctx })
    /*ctx.moveTo(150, 150)
    ctx.arc(150, 150, 50, -Math.PI/2+0.2, 0)
    ctx.stroke()      //描线 
    ctx.fill();     //填充
    
    ctx.beginPath();
    ctx.moveTo(150, 150)
    ctx.setFillStyle('#EEEEEE')
    ctx.arc(150, 150, 50, 0, Math.PI +0.5)
    ctx.fill();     //填充

    ctx.beginPath();
    ctx.moveTo(150, 150)
    ctx.setFillStyle('#FF0000')
    ctx.arc(150, 150, 50, Math.PI + 0.5, -Math.PI / 2 + 0.2)
    ctx.fill();     //填充
    ctx.draw()*/

    ctx.drawImage(this.data.imagePath, 0, 0, this.data.imageWidth, this.data.imageHeight)
    ctx.draw()
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

  //
  toFill:function(e){
    this._init(this.data.imageWidth, this.data.imageHeight)
    if(this.data.canvasPixelsData.length == 0){
      return
    }
    //this._fill(e.detail.x,e.detail.y,[255,0,0,255],[0,0,0,255])
    var temp = this._findXPoints(e.detail.x, e.detail.y, [0, 0, 0, 255]);
    //console.log(temp)
    this._fillOneLine(temp[0], temp[1], e.detail.y, [255, 0, 0, 255])
  },

  //初始化图像数据
  _init:function(width,height){
    if (this.data.canvasPixelsData.length == 0){
      //canvasGetImageData 只会执行一次
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: width,
        height: height,
        success: (res) => {
            //console.log(res.data)
            this.setData({'canvasPixelsData':res.data})
        }
      })
    }
  },
  /**
   * 填充底层算法 TODO 像素比较是一维数组比较效率高还是转换成字符串比较效率高？
   * @param x 点击位置的x坐标
   * @param y 点击位置的y坐标
   * @param fillColor  填充区域像素数据 一维十进制整数数组表示
   * @param boundColor 填充边界像素数据 一维十进制整数数组表示
   */
  _fill:function(x,y,fillColor,boundColor){
    if(this.data.count > 1000){
      return;
    }
    var count = this.data.count
    count++;
    this.setData({'count':count})
    var currentPixel = this._getPixel(this.data.canvasPixelsData, this.data.imageWidth,x,y)
    var clickPointerColor = this._colorDataSwitch(currentPixel) //点击处像素数据
    //console.log(x)
    //console.log(y)
    //console.log(clickPointerColor)
    var _fillColor = this._colorDataSwitch(fillColor)       
    var _boundColor = this._colorDataSwitch(boundColor)       
    if (clickPointerColor != _fillColor && clickPointerColor != _boundColor){
      this._fillOnePointer(x,y,fillColor)
      if (((x + 1) < this.data.imageWidth) && ((y + 1) < this.data.imageHeight)
        && ((x - 1) > 0) && ((y-1) > 0) ){
        this._fill(x + 1, y, fillColor, boundColor)
        this._fill(x - 1, y, fillColor, boundColor)
        this._fill(x, y + 1, fillColor, boundColor)
        this._fill(x, y - 1, fillColor, boundColor)
      }
    }
  },

  /**
   * 填充一个像素点
   * fillColor 填充区域像素数据 一维数组
   */
  _fillOnePointer(x, y, fillColor){
    var data = new Uint8ClampedArray(fillColor)
    wx.canvasPutImageData({
      canvasId: 'myCanvas',
      x: x,
      y: y,
      width: 1,
      data: data,
      success(res) { },
      complete(res) { }
    })
  },

  /**
   * 填充一条线
   * x1 线段与图形左交点x坐标
   * x2 线段与图形右交点x坐标
   * y  线段y坐标
   * fillColor 一个像素点的图像数据 一维数组
   */
  _fillOneLine(x1, x2, y, fillColor){
      var pointsCount = x2 - x1;
      fillColor = this._concat(fillColor, pointsCount)
      var data = new Uint8ClampedArray(fillColor)
      wx.canvasPutImageData({
        canvasId: 'myCanvas',
        x: x1,
        y: y,
        width: x2-x1,
        height:1,
        data: data,
        success(res) { },
        complete(res) { }
      })
  },

  /**
   * 快速扩充数组元素
   */
  _concat(arr,count){
    var temp = [];
    for(var i = 0;i < count;i++){
      temp = temp.concat(arr)
    }
    return temp
  },

  /**
   * 图像数据转换
   * data 图像rgba数据 一维数组
   * return 图像像素的十六进制表示
   */
  _colorDataSwitch:function(data){
    if(data.length != 4){
      console.log(data);
      return;
    }
    var color = '#'
    for(var i in data){
      color += data[i].toString(16).length == 1 ? '0' + data[i].toString(16) : data[i].toString(16)
    }
    return color;
  },

  //根据坐标 x y 计算像素中的值
  _getPixel(arr,width,x,y){
    //console.log(arr)
    //console.log('--')
    //console.log(width)
    //console.log('--')
    //console.log(x)
    //console.log('--')
    //console.log(y)
    var start = (width * y + x) * 4
    var current = arr.slice(start, start + 4)
    //console.log(current)
    return current
  },

  //根据一个点的坐标计算左右两个交点
  _findXPoints(x, y, boundColor){
    var left = 0
    var right = 0
    for(var i=1;;i++){
      if (this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x + i, y).toString() == boundColor.toString()){
        right = x + i;
        break;
      }
    }
    for (var i = 1; ; i++) {
      if (this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x - i, y).toString() == boundColor.toString()) {
        left = x - i +1;
        break;
      }
    }
    return [left,right]
  },

  //根据线段的左右两个端点找到关联点并推入栈
  _pushToStack(x1, x2, y, fillColor, boundColor){
    for(var i = 0;;i++){
      
    }
  }
  
})