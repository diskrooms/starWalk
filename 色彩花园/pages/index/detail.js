// pages/index/test.js
const app = getApp()
const util = require('../../utils/util.js')
var canvasPixelsData1 = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    'imagePath': '../../images/flower3.png',
    'canvasPixelsData': [],
    'imageWidth': 300,
    'imageHeight': 980,
    'count': 0,
    'pointerStack': [],      //点堆栈
    'shiftPointerStack': [], //存放已弹出的栈元素
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.name
    var width = options.width
    var height = options.height
    const ctx = wx.createCanvasContext('myCanvas')
    this.setData({ 'ctx': ctx })
    //ctx.scale(0.3,0.3)
    ctx.drawImage('../../images/'+name+'.png', 0, 0, width, height)
    ctx.draw()
    //this._drawImage()
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
    //const ctx = wx.createCanvasContext('myCanvas')
    //this.setData({ 'ctx': ctx })

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

    //ctx.drawImage(this.data.imagePath, 0, 0, this.data.imageWidth, this.data.imageHeight)
    //ctx.draw()

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
  toFill: function (e) {
    this._init(this.data.imageWidth, this.data.imageHeight)
    if (canvasPixelsData1.length == 0) {
      return
    }

    //this._fill(e.touches[0].x,e.touches[0].y,[255,0,0,255],[0,0,0,255])
    //var temp = this._findXPoints(e.touches[0].x, e.touches[0].y, [0, 0, 0, 255]);
    //e.detail.x = 30  //38
    //e.detail.y = 41  //66
    
    this._fillOneLine(e.detail.x, e.detail.y, [255, 0, 0, 255], [0, 0, 0, 255])

    while (this.data.pointerStack.length > 0) {
      var _temp = this.data.pointerStack.shift()
      //this.data.shiftPointerStack.push(_temp)
      this._fillOneLine(_temp[0], _temp[1], [255, 0, 0, 255], [0, 0, 0, 255])
    }
    //以下为获取像素点数据使用
    var _pixelPointers = [];      //以像素点组织的数据
    var _data = canvasPixelsData1
    for (var i = 0; i < _data.length; i = i + 4) {
      _pixelPointers.push(_data.slice(i, i + 4))
    }
    //查找区域块像素点
    var _pixelIndex = []
    for (var j = 0; j < _pixelPointers.length; j++) {
      if (_pixelPointers[j].toString() == [255, 0, 0, 255].toString()) {
        _pixelIndex.push(j)
      }
    }
    //console.log(_pixelIndex)
    var data = { 'token': wx.getStorageSync('token'), 'app': 2, '_pixelIndex': _pixelIndex }
    util.request(app.globalData.apiDomain + '/my/collect', 'POST', data, (res) => {

    })

    //第二种填充算法 根据点击区域来直接填充像素点数据达到填充目的（效率低）
    /*var _pixelPointers = [];
    var _data = canvasPixelsData1
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
      var _data = canvasPixelsData1
      _data[_colorIndex1[j] * 4] = 255
      _data[_colorIndex1[j] * 4 + 1] = 0
      _data[_colorIndex1[j] * 4 + 2] = 0
      _data[_colorIndex1[j] * 4 + 3] = 255
    }
    //console.log(_data)
    //this.setData({ 'canvasPixelsData': _data })
    canvasPixelsData1 = _data
    //填充
    wx.canvasPutImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: this.data.imageWidth,
      data: _data,
      success(res) { //console.log(res) 
      },
      fail(res) { //console.log(res) 
      },
      complete(res) { //console.log(res)
       }
    })*/

  },

  //初始化图像数据
  _init: function (width, height) {
    if (canvasPixelsData1.length == 0) {
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
          //console.log(canvasPixelsData1)
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
  _fill: function (x, y, fillColor, boundColor) {
    if (this.data.count > 1000) {
      return;
    }
    var count = this.data.count
    count++;
    this.setData({ 'count': count })
    var currentPixel = this._getPixel(canvasPixelsData1, this.data.imageWidth, x, y)
    var clickPointerColor = this._colorDataSwitch(currentPixel) //点击处像素数据
    //console.log(x)
    //console.log(y)
    //console.log(clickPointerColor)
    var _fillColor = this._colorDataSwitch(fillColor)
    var _boundColor = this._colorDataSwitch(boundColor)
    if (clickPointerColor != _fillColor && clickPointerColor != _boundColor) {
      this._fillOnePointer(x, y, fillColor)
      if (((x + 1) < this.data.imageWidth) && ((y + 1) < this.data.imageHeight)
        && ((x - 1) > 0) && ((y - 1) > 0)) {
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
  _fillOnePointer(x, y, fillColor) {
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
  _fillOneLine(x, y, fillColor, boundColor) {
    //console.log([x,y])
    //检测是否已经填色 如果已经填色 直接返回
    if (this._getPixel(canvasPixelsData1, this.data.imageWidth, x, y).toString() == fillColor.toString()) {
      return
    }
    var left = 0
    var right = 0
    var x = x >>> 0     //移动设备真机上为float类型 开发工具上为整形 注意区别 一定要取整
    var y = y >>> 0
    //var _console = [x,y]
    //console.log(_console)
    //console.log(boundColor.toString())
    for (var i = 1; (x + i) < this.data.imageWidth; i++) {
      //console.log(this._getPixel(canvasPixelsData1, this.data.imageWidth, x + i, y))
      if (this._getPixel(canvasPixelsData1, this.data.imageWidth, x + i, y).toString() == boundColor.toString()) {
        right = x + i    //TODO
        //console.log('right')
        break
      }
    }
    for (var i = 1; (x - i >= 0); i++) {
      if (this._getPixel(canvasPixelsData1, this.data.imageWidth, x - i, y).toString() == boundColor.toString()) {
        left = x - i + 1
        //console.log('left')
        break
      }
    }
    //console.log(left)
    //console.log(right)

    var pointsCount = right - left;
    var _fillColor = this._concat(fillColor, pointsCount)
    
    var data = new Uint8ClampedArray(_fillColor)
    wx.canvasPutImageData({
      canvasId: 'myCanvas',
      x: left,
      y: y,
      width: right - left,
      height: 1,
      data: data,
      success(res) { //console.log(res)
      },
      fail(res) { //console.log(res) 
      },
      complete(res) { //console.log(res)
      }
    })

    //修改canvasPixelsData数据
    var _tempCanvas = this._updateCanvasPixelsData(canvasPixelsData1, this.data.imageWidth, left, right, y, fillColor)
    //this.setData({ 'canvasPixelsData': _tempCanvas })
    canvasPixelsData1 = _tempCanvas
    //console.log([left, right, y])
    this._pushToStack(left, right, y, fillColor, boundColor)
  },

  /**
   * 快速扩充数组元素
   */
  _concat(arr, count) {
    var temp = [];
    for (var i = 0; i < count; i++) {
      temp = temp.concat(arr)
    }
    return temp
  },

  /**
   * 图像数据转换
   * data 图像rgba数据 一维数组
   * return 图像像素的十六进制表示
   */
  _colorDataSwitch: function (data) {
    if (data.length != 4) {
      console.log(data);
      return;
    }
    var color = '#'
    for (var i in data) {
      color += data[i].toString(16).length == 1 ? '0' + data[i].toString(16) : data[i].toString(16)
    }
    return color;
  },

  //根据坐标 x y 计算像素中的值
  _getPixel(arr, width, x, y) {
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
  _findXPoints(x, y, boundColor) {
    var left = 0
    var right = 0
    for (var i = 1; ; i++) {
      if (this._getPixel(canvasPixelsData1, this.data.imageWidth, x + i, y).toString() == boundColor.toString()) {
        right = x + i;
        break;
      }
    }
    for (var i = 1; ; i++) {
      if (this._getPixel(canvasPixelsData1, this.data.imageWidth, x - i, y).toString() == boundColor.toString()) {
        left = x - i + 1;
        break;
      }
    }
    return [left, right]
  },

  //根据线段的左右两个端点找到关联点并推入栈
  _pushToStack(x1, x2, y, fillColor, boundColor) {
    var left_top = []
    var right_top = []
    var left_bottom = []
    var right_bottom = []
    //console.log(x1+'-'+x2+'-'+y)
    for (var i = 0; i < 3; i++) {    //3与边界宽度正比关联
      var left_top = this._getPixel(canvasPixelsData1, this.data.imageWidth, x1 + i, y - 1)
      if (left_top.toString() == fillColor.toString()) {
        break
      }
      if (this._colorDataSwitch(left_top) == '#00000000') {
        var exist = 0
        //栈中有相同元素 退出
        for (var k = 0; k < this.data.pointerStack.length; k++) {
          if ([x1 + i, y - 1].toString() == this.data.pointerStack[k].toString()) {
            exist = 1
            break;
          }
        }
        for (var k = 0; k < this.data.shiftPointerStack.length; k++) {
          if ([x1 + i, y - 1].toString() == this.data.shiftPointerStack[k].toString()) {
            exist = 1
            break;
          }
        }

        if (exist == 0) {
          //console.log([x1 + i, y - 1])
          this.data.pointerStack.push([x1 + i, y - 1])
        }
        break
      }
    }
    for (var i = 0; i < 3; i++) {
      var right_top = this._getPixel(canvasPixelsData1, this.data.imageWidth, x2 - i, y - 1)
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
      var left_bottom = this._getPixel(canvasPixelsData1, this.data.imageWidth, x1 + i, y + 1)
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
    for (var i = 0; i < 3; i++) {
      var right_bottom = this._getPixel(canvasPixelsData1, this.data.imageWidth, x2 - i, y + 1)
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
  _updateCanvasPixelsData(arr, width, left, right, y, fillColor) {
    var left_start = (width * y + left) * 4
    var right_end = (width * y + right) * 4 + 4
    for (var i = left_start; i < right_end; i++) {
      if ((i % 4) == 0) {
        arr[i] = fillColor[0]
      } else if ((i % 4) == 1) {
        arr[i] = fillColor[1]
      } else if ((i % 4) == 2) {
        arr[i] = fillColor[2]
      } else if ((i % 4) == 3) {
        arr[i] = fillColor[3]
      }
    }
    return arr
  },

  _drawImage: function () {
    const ctx = wx.createCanvasContext('myCanvas')
    this.setData({ 'ctx': ctx })
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    //ctx.font = "normal normal 400 normal 15px / 21.4286px ''";
    //ctx.font = "   15px ";
    //ctx.scale(0.3864734299516908, 0.3864734299516908);
    ctx.save()
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(144.595, 287.233);
    ctx.lineTo(63.021, 287.233);
    ctx.lineTo(47.751000000000005, 193.54500000000002);
    ctx.lineTo(159.868, 193.54500000000002);
    ctx.lineTo(144.595, 287.233);
    ctx.closePath();
    ctx.moveTo(65.911, 283.837);
    ctx.lineTo(141.709, 283.837);
    ctx.lineTo(155.876, 196.94099999999997);
    ctx.lineTo(51.746, 196.94099999999997);
    ctx.lineTo(65.911, 283.837);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(169.336, 196.941);
    ctx.lineTo(38.284, 196.941);
    ctx.lineTo(38.284, 162.833);
    ctx.lineTo(169.33599999999998, 162.833);
    ctx.lineTo(169.33599999999998, 196.941);
    ctx.closePath();
    ctx.moveTo(41.681, 193.545);
    ctx.lineTo(165.941, 193.545);
    ctx.lineTo(165.941, 166.23);
    ctx.lineTo(41.681, 166.23);
    ctx.lineTo(41.681, 193.545);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(106.569, 166.229);
    ctx.bezierCurveTo(106.35300000000001, 166.229, 106.133, 166.19000000000003, 105.922, 166.09900000000002);
    ctx.bezierCurveTo(105.05499999999999, 165.745, 104.642, 164.752, 104.99799999999999, 163.883);
    ctx.bezierCurveTo(106.49399999999999, 160.247, 141.994, 74.48700000000001, 171.648, 46.95200000000001);
    ctx.lineTo(175.72, 43.16800000000001);
    ctx.lineTo(174.455, 48.58400000000002);
    ctx.bezierCurveTo(174.268, 49.36700000000002, 155.834, 127.44200000000002, 130.48200000000003, 165.47200000000004);
    ctx.bezierCurveTo(129.96100000000004, 166.25400000000005, 128.90000000000003, 166.46000000000004, 128.12700000000004, 165.94400000000005);
    ctx.bezierCurveTo(127.34800000000004, 165.42300000000006, 127.13600000000004, 164.36900000000006, 127.65600000000003, 163.59000000000003);
    ctx.bezierCurveTo(148.59300000000005, 132.18100000000004, 164.82300000000004, 72.78300000000003, 169.66200000000003, 53.80100000000003);
    ctx.bezierCurveTo(141.39800000000002, 84.80800000000004, 108.48400000000004, 164.336, 108.13800000000003, 165.17900000000003);
    ctx.bezierCurveTo(107.869, 165.835, 107.235, 166.229, 106.569, 166.229);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(99.351, 166.229);
    ctx.bezierCurveTo(98.642, 166.229, 97.979, 165.782, 97.742, 165.072);
    ctx.bezierCurveTo(97.417, 164.102, 66.416, 72.412, 39.02, 35.10900000000001);
    ctx.bezierCurveTo(43.462, 58.38300000000001, 58.956, 135.42200000000003, 74.515, 163.71200000000002);
    ctx.bezierCurveTo(74.968, 164.53500000000003, 74.668, 165.56600000000003, 73.845, 166.02200000000002);
    ctx.bezierCurveTo(73.027, 166.46900000000002, 71.99, 166.17000000000002, 71.53999999999999, 165.35100000000003);
    ctx.bezierCurveTo(52.938, 131.528, 35.166, 33.139, 34.418, 28.967);
    ctx.lineTo(33.321, 22.849999999999998);
    ctx.lineTo(37.376, 27.56);
    ctx.bezierCurveTo(66.132, 60.968999999999994, 99.55099999999999, 159.798, 100.961, 163.993);
    ctx.bezierCurveTo(101.259, 164.882, 100.78, 165.844, 99.891, 166.141);
    ctx.bezierCurveTo(99.713, 166.2, 99.53, 166.229, 99.351, 166.229);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(144.355, 166.229);
    ctx.bezierCurveTo(143.887, 166.229, 143.422, 166.037, 143.087, 165.662);
    ctx.bezierCurveTo(142.463, 164.963, 142.524, 163.888, 143.22299999999998, 163.26500000000001);
    ctx.bezierCurveTo(168.545, 140.68300000000002, 191.641, 101.17700000000002, 199.242, 87.48600000000002);
    ctx.bezierCurveTo(166.968, 104.93200000000002, 148.643, 129.92400000000004, 148.456, 130.18400000000003);
    ctx.bezierCurveTo(147.905, 130.949, 146.844, 131.11100000000002, 146.084, 130.56700000000004);
    ctx.bezierCurveTo(145.324, 130.01500000000004, 145.15200000000002, 128.95500000000004, 145.703, 128.19600000000003);
    ctx.bezierCurveTo(145.90800000000002, 127.91400000000003, 166.57, 99.72800000000002, 202.619, 81.91700000000003);
    ctx.lineTo(207.271, 79.61900000000003);
    ctx.lineTo(204.87599999999998, 84.22300000000003);
    ctx.bezierCurveTo(204.60099999999997, 84.75700000000003, 176.77399999999997, 137.89500000000004, 145.48499999999999, 165.80100000000004);
    ctx.bezierCurveTo(145.162, 166.087, 144.758, 166.229, 144.355, 166.229);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(56.249, 166.229);
    ctx.bezierCurveTo(55.761, 166.229, 55.277, 166.02, 54.942, 165.616);
    ctx.bezierCurveTo(20.52, 124.236, 2.807, 70.488, 2.631, 69.951);
    ctx.lineTo(1.3659999999999999, 66.05499999999999);
    ctx.lineTo(5.015, 67.91199999999999);
    ctx.bezierCurveTo(30.13, 80.67999999999999, 56.496, 115.69299999999998, 57.607, 117.17599999999999);
    ctx.bezierCurveTo(58.169, 117.92999999999999, 58.013999999999996, 118.99399999999999, 57.263, 119.55499999999999);
    ctx.bezierCurveTo(56.51, 120.118, 55.448, 119.963, 54.885999999999996, 119.213);
    ctx.bezierCurveTo(54.632999999999996, 118.875, 30.606999999999996, 86.969, 7.323999999999998, 73.07);
    ctx.bezierCurveTo(12.178999999999998, 86.42099999999999, 29.095, 129.233, 57.552, 163.445);
    ctx.bezierCurveTo(58.153, 164.165, 58.054, 165.236, 57.333, 165.83599999999998);
    ctx.bezierCurveTo(57.017, 166.101, 56.63, 166.229, 56.249, 166.229);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(88.836, 137.057);
    ctx.bezierCurveTo(88.644, 137.057, 88.45, 137.02499999999998, 88.259, 136.957);
    ctx.bezierCurveTo(87.377, 136.63899999999998, 86.921, 135.664, 87.239, 134.781);
    ctx.bezierCurveTo(88.521, 131.22400000000002, 118.947, 47.426, 140.657, 27.417);
    ctx.lineTo(143.822, 24.502000000000002);
    ctx.lineTo(143.504, 28.794000000000004);
    ctx.bezierCurveTo(143.457, 29.388000000000005, 138.926, 88.446, 126.55699999999999, 124.535);
    ctx.bezierCurveTo(126.25899999999999, 125.41799999999999, 125.28699999999999, 125.895, 124.40199999999999, 125.59);
    ctx.bezierCurveTo(123.51599999999999, 125.288, 123.04299999999999, 124.32300000000001, 123.34499999999998, 123.434);
    ctx.bezierCurveTo(133.528, 93.728, 138.349, 48.117000000000004, 139.702, 33.337999999999994);
    ctx.bezierCurveTo(118.805, 57.776999999999994, 90.729, 135.11599999999999, 90.43199999999999, 135.937);
    ctx.bezierCurveTo(90.185, 136.626, 89.531, 137.057, 88.836, 137.057);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(74.847, 102.003);
    ctx.bezierCurveTo(73.984, 102.003, 73.243, 101.347, 73.15899999999999, 100.467);
    ctx.bezierCurveTo(72.91, 97.898, 67.101, 37.324999999999996, 70.08999999999999, 22.393);
    ctx.lineTo(70.91599999999998, 18.259);
    ctx.lineTo(73.18699999999998, 21.809);
    ctx.bezierCurveTo(74.27999999999999, 23.521, 100.02299999999998, 64.072, 105.82799999999997, 96.298);
    ctx.bezierCurveTo(105.99399999999997, 97.224, 105.37999999999998, 98.107, 104.45599999999997, 98.273);
    ctx.bezierCurveTo(103.53399999999998, 98.42399999999999, 102.64999999999998, 97.822, 102.48399999999998, 96.90299999999999);
    ctx.bezierCurveTo(97.855, 71.196, 79.622, 39.06, 72.862, 27.78);
    ctx.bezierCurveTo(71.50999999999999, 47.731, 76.48599999999999, 99.572, 76.53999999999999, 100.142);
    ctx.bezierCurveTo(76.63099999999999, 101.075, 75.948, 101.904, 75.014, 101.996);
    ctx.bezierCurveTo(74.956, 102, 74.901, 102.003, 74.847, 102.003);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(93.429, 65.41);
    ctx.bezierCurveTo(92.566, 65.41, 91.827, 64.753, 91.741, 63.878);
    ctx.bezierCurveTo(89.195, 37.992, 106.732, 5.051, 107.48, 3.661);
    ctx.lineTo(109.043, 0.7589999999999999);
    ctx.lineTo(110.501, 3.718);
    ctx.bezierCurveTo(119.747, 22.491, 121.915, 59.837999999999994, 122.00200000000001, 61.42);
    ctx.bezierCurveTo(122.05600000000001, 62.357, 121.337, 63.158, 120.40100000000001, 63.207);
    ctx.bezierCurveTo(119.49100000000001, 63.317, 118.66300000000001, 62.541000000000004, 118.61200000000001, 61.605000000000004);
    ctx.bezierCurveTo(118.59100000000001, 61.24700000000001, 116.63000000000001, 27.472, 108.88300000000001, 8.422000000000004);
    ctx.bezierCurveTo(104.57400000000001, 17.305000000000003, 93.117, 43.193000000000005, 95.11900000000001, 63.544000000000004);
    ctx.bezierCurveTo(95.21000000000001, 64.477, 94.52900000000001, 65.309, 93.59500000000001, 65.40100000000001);
    ctx.bezierCurveTo(93.54, 65.406, 93.483, 65.41, 93.429, 65.41);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.draw()
  },

  

})