
//加载插件

Page({
  data: {},

  onLoad: function (options) {

    //建立连接
    wx.connectSocket({
      url: "wss://xcx3.zengcr.com:9502",
    })

    //连接成功
    wx.onSocketOpen(function (res) {
      //console.log(res)
      wx.sendSocketMessage({
        /*'data':'{"cmd":"unlockProp","openid":"1112","propType":3,"unlocType":1}'*/
       /*'data': '{"cmd":"uploadGold","uploadType":1,"offType":0,"gold":60,"scoreType":5,"openid":"1112"}'*/
        /*'data': '{"cmd":"unlockProp","openid":"11311","propType":1,"unlocType":1}'*/
        /*'data': '{"cmd":"quitGame","openid":"o26vW5eokuIV3sjovfppMnSlWALw"}'*/
        'data': '{"cmd":"login","openid":"o26vW5eokuIV3sjovfppMnSlWALw"}'
        
      })
    })

    //接收数据
    wx.onSocketMessage(function (data) {
      //var objData = JSON.parse(data.data);
      console.log(data);
      /*new wxCharts({
        canvasId: 'lineCanvas',//指定canvas的id
        animation: false,
        type: 'line',//类型是线形图
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],

        series: [{
          name: '交易量',
          data: objData,//websocket接收到的数据
          format: function (val) {
            if (typeof val == "string") {
              val = parseFloat(val);
            }
            return val.toFixed(2) + '万元';
          }
        },
        ],
        yAxis: {
          title: '交易金额 (万元)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: 320,
        height: 200
      });*/
    })

    //连接失败
    wx.onSocketError(function (res) {
      console.log(res)
      console.log('websocket连接失败！');
    })
  },
})