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
  var _title = ['文史哲经计算机，题题都会。风声雨声读书声，声声入耳',
    '还在考前熬夜刷题？不必惊慌，快用答题王复习一下',
    '学长，帮帮忙，这道题不会做',
    '寓教于乐，你见过把考试当游戏玩的吗？',
    '答题还能种菜养花？是的，你没看错',
    '考试通过后才有资格做一个快乐的农夫',
    '一边考试，一边种菜，你会吗？',
    '你挑水来我浇园，夫妻双双把菜种',
    '生活妙招365，你能答对多少？'
  ];
  var random = parseInt(_title.length * Math.random());
  var share_title = _title[random];
  var _image = ['http://coder.51tui.vip/Public/miniProgram/share_image1.png', 'http://coder.51tui.vip/Public/miniProgram/share_image2.png'];
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
