// pages/index/test.js
const app = getApp()
const util = require('../../utils/util.js')
var canvasPixelsData1 = []
Page({
  /**
   * 页面的初始数据
   */
  data: {

    'imagePath': '../../images/flower.png',
    'canvasPixelsData':[],
    'imageWidth':207,
    'imageHeight':288,
    'count':0,
    'pointerStack':[],      //点堆栈
    'shiftPointerStack':[], //存放已弹出的栈元素
    'colorIndex1': [],       //区域1颜色索引
    'colorIndex2': [],
    'colorIndex3': []
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

    //this._fill(e.touches[0].x,e.touches[0].y,[255,0,0,255],[0,0,0,255])
    //var temp = this._findXPoints(e.touches[0].x, e.touches[0].y, [0, 0, 0, 255]);
    //e.detail.x = 30  //38
    //e.detail.y = 41  //66
    
    /*this._fillOneLine(e.detail.x, e.detail.y, [255, 0, 0, 255], [0, 0, 0, 255])
    while (this.data.pointerStack.length > 0){
      var _temp = this.data.pointerStack.shift()
      //this.data.shiftPointerStack.push(_temp)
      this._fillOneLine(_temp[0], _temp[1], [255, 0, 0, 255], [0, 0, 0, 255])
    }*/

    //第二种填充算法 根据点击区域来直接填充像素点数据达到填充目的（效率低）
        /*var _pixelPointers = [];
        var _data = this.data.canvasPixelsData
        for (var i = 0; i < _data.length; i = i + 4) {
          var _temp = _data.slice(i, i + 4);
          var _temp2 = [0,0,0,0]
          _temp2[0] = _temp[0]
          _temp2[1] = _temp[1]
          _temp2[2] = _temp[2]
          _temp2[3] = _temp[3]
          _pixelPointers.push(_temp2)
        }
        console.log('a')
        var _colorIndex1 = this.data.colorIndex1
        //console.log(_colorIndex1)
        for (var j in _colorIndex1){
          _pixelPointers[_colorIndex1[j]] = [255,0,0,255]
        }
        console.log('b')
          //合并数组元素
          var _result = []
          for (var k in _pixelPointers){
            _result = _result.concat(_pixelPointers[k])
          }
          console.log('c')
          _result = new Uint8ClampedArray(_result)
          this.setData({'canvasPixelsData':_result})
          //填充
          console.log('d')
          wx.canvasPutImageData({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: 100,
            data: _result,
            success(res) { console.log(res) },
            fail(res){ console.log(res)},
            complete(res) { console.log(res)}
          })*/

    //第三种填充方法(效率高)
    /*var _colorIndex1 = this.data.colorIndex1
    for (var j in _colorIndex1) {
      var _data = this.data.canvasPixelsData
      _data[_colorIndex1[j] * 4] = 255
      _data[_colorIndex1[j] * 4 + 1] = 0
      _data[_colorIndex1[j] * 4 + 2] = 0
      _data[_colorIndex1[j] * 4 + 3] = 255
    }
    //console.log(_data)
    this.setData({ 'canvasPixelsData': _data })
    //填充
    wx.canvasPutImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: 100,
      data: _data,
      success(res) { console.log(res) },
      fail(res) { console.log(res) },
      complete(res) { console.log(res) }
    })*/
    //以下为获取像素点数据使用
    var _pixelPointers = [];      //以像素点组织的数据
    var _data = this.data.canvasPixelsData
    for (var i=0;i< _data.length;i=i+4){
      _pixelPointers.push(_data.slice(i,i+4))
    }
    //查找区域块像素点
    var _pixelIndex = []
    for (var j = 0; j < _pixelPointers.length; j++){
      if (_pixelPointers[j].toString() == [255,0,0,255].toString()){
        _pixelIndex.push(j)
      }
    }
      //console.log(_pixelIndex)
      var data = { 'token': wx.getStorageSync('token'), 'app': 2, '_pixelIndex': _pixelIndex }
      util.request(app.globalData.apiDomain + '/my/collect', 'POST', data, (res) => {

      })
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
          //this.setData({ 'canvasPixelsData1': res.data }) //invokeWebviewMethod 最大长度 1048576 考虑分隔图像
          canvasPixelsData1 = res.data
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
   * x  线段与图形左交点x坐标
   * y  线段y坐标
   * fillColor 一个像素点的图像数据 一维数组
   */
  _fillOneLine(x, y, fillColor,boundColor){
    //console.log([x,y])
    //检测是否已经填色 如果已经填色 直接返回
    if (this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x, y).toString() == fillColor.toString()){
      return
    }
    var left = 0
    var right = 0
    var x = x >>> 0     //移动设备真机上为float类型 开发工具上为整形 注意区别 一定要取整
    var y = y >>> 0
    //var _console = [x,y]
    //console.log(_console)
    for (var i = 1; (x + i) < this.data.imageWidth ; i++) {
      //console.log(this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x + i, y))
      if (this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x + i, y).toString() == boundColor.toString()) {
        right = x + i    //TODO
        //console.log('right')
        break
      }
    }
    for (var i = 1; (x - i >= 0); i++) {
      if (this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x - i, y).toString() == boundColor.toString()) {
        left = x - i + 1
        //console.log('left')
        break
      }
    }
    var pointsCount = right - left;
    var _fillColor = this._concat(fillColor, pointsCount)
    var data = new Uint8ClampedArray(_fillColor)
    
    wx.canvasPutImageData({
      canvasId: 'myCanvas',
      x: left,
      y: y,
      width: right - left,
      height:1,
      data: data,
      success(res) { //console.log(res)
      },
      fail(res) { console.log(res)},
      complete(res) { //console.log(res)
      }
    })

    //修改canvasPixelsData数据
    var _tempCanvas = this._updateCanvasPixelsData(this.data.canvasPixelsData, this.data.imageWidth,left, right, y, fillColor)
    this.setData({ 'canvasPixelsData': _tempCanvas})
    //console.log([left, right, y])
    this._pushToStack(left, right, y, fillColor, boundColor)
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
    var left_top = []
    var right_top = []
    var left_bottom = []
    var right_bottom = []
    //console.log(x1+'-'+x2+'-'+y)
    for (var i = 0; i < 3; i++){    //3与边界宽度正比关联
      var left_top = this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x1 + i, y - 1)
      if (left_top.toString() == fillColor.toString()){
        break
      }
      if (this._colorDataSwitch(left_top) == '#00000000'){
        var exist = 0
        //栈中有相同元素 退出
        for (var k = 0; k < this.data.pointerStack.length;k++){
          if ([x1 + i, y - 1].toString() == this.data.pointerStack[k].toString()){
            exist = 1
            break;
          }
        }
        for (var k = 0; k < this.data.shiftPointerStack.length;k++){
          if ([x1 + i, y - 1].toString() == this.data.shiftPointerStack[k].toString()) {
            exist = 1
            break;
          }
        }
        
        if(exist == 0){
          //console.log([x1 + i, y - 1])
          this.data.pointerStack.push([x1+i,y-1])
        }
        break
      }
    }
    for (var i = 0; i < 3 ; i++) {
      var right_top = this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x2 - i, y - 1)
      if (right_top.toString() == fillColor.toString()) {
        break
      }
      if (this._colorDataSwitch(right_top) == '#00000000') {
        //栈中有相同元素 退出
        /*for (var k = 0; k < this.data.pointerStack.length; k++) {
          if ([x2 - i, y - 1].toString() == this.data.pointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        }
        for (var k = 0; k < this.data.shiftPointerStack.length; k++) {
          if ([x2 - i, y - 1].toString() == this.data.shiftPointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        }*/
        //console.log([x2 - i, y - 1,i,x1,x2,y])
        this.data.pointerStack.push([x2 - i, y - 1])
        break
      }
    }
    for (var i = 0; i < 3; i++) { // 3与边界宽度正比关联
      var left_bottom = this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x1 + i, y + 1)
      if (left_bottom.toString() == fillColor.toString()) {
        break
      }
      if (this._colorDataSwitch(left_bottom) == '#00000000') {
        //栈中有相同元素 退出
        /*for (var k = 0; k < this.data.pointerStack.length; k++) {
          if ([x1 + i, y + 1].toString() == this.data.pointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        }
        for (var k = 0; k < this.data.shiftPointerStack.length; k++) {
          if ([x1 + i, y + 1].toString() == this.data.shiftPointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        } */
        this.data.pointerStack.push([x1 + i, y + 1])
        break
      }
    }
    for (var i = 0; i < 3 ; i++) {
      var right_bottom = this._getPixel(this.data.canvasPixelsData, this.data.imageWidth, x2 - i, y + 1)
      if (right_bottom.toString() == fillColor.toString()) {
        //console.log(right_bottom)
        break
      }
      //console.log(right_bottom)
      if (this._colorDataSwitch(right_bottom) == '#00000000') {
        //栈中有相同元素 退出
        /*for (var k = 0; k < this.data.pointerStack.length; k++) {
          if ([x2 - i, y + 1].toString() == this.data.pointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        }
        for (var k = 0; k < this.data.shiftPointerStack.length; k++) {
          if ([x2 - i, y + 1].toString() == this.data.shiftPointerStack[k].toString()) {
            //console.log('exist')
            exist = 1
            break;
          }
        } */
        this.data.pointerStack.push([x2 - i, y + 1])
        break
      }
    }
  },

  //修改 canvasPixelsData 数据 (连续填充)
  _updateCanvasPixelsData(arr,width,left, right, y, fillColor){
    var left_start = (width * y + left) * 4
    var right_end = (width * y + right) * 4 + 4
    for (var i = left_start; i < right_end;i++){
      if((i % 4) == 0){
        arr[i] = fillColor[0]
      } else if((i % 4) == 1){
        arr[i] = fillColor[1]
      } else if((i % 4) == 2){
        arr[i] = fillColor[2]
      } else if ((i % 4) == 3){
        arr[i] = fillColor[3]
      }
    }
    return arr
  },
  
})