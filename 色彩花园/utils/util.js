const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//弹出框
function alert(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

//随机分享
function share() {
  var _title = ['你离世界名画的距离，只差一个色彩花园','看看你的作品能拍卖多少'];
  var random = parseInt(_title.length * Math.random());
  var share_title = _title[random];
  var _image = ['http://coder.51tui.vip/Public/miniProgram/color_garden/share.jpg', 'http://coder.51tui.vip/Public/miniProgram/color_garden/share_2.webp'];
  var random = parseInt(_image.length * Math.random());
  var share_image = _image[random];
  return { 'share_title': share_title, 'share_image': share_image }
}

//封装请求方法
function request(url, method, data, succ_callback, fail_callback) {
  wx.request({
    url: url,
    data: data,
    method: method,
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    dataType: 'json',
    success: (res) => {
      succ_callback(res)
    },
    fail: (res) => {
      fail_callback(res)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  alert: alert,
  share: share,
  request: request
}
