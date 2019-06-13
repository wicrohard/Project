var app = getApp()

Page({
  data: {
    id: null,
    questionaire: null,
    color: [
      "#ffbe26",
      "#fc5b23",
      "#198ded",
      "#3bc06b",
      "#c90ff0"
    ],
    style: "wu",
  },
  onLoad: function (e) {
    //获得该问卷ID
    this.setData({
      id: e.id
    })
    wx.showNavigationBarLoading()
    const db = wx.cloud.database()
    // 查询该问卷
    db.collection('questionaires').where({
      _id: this.data.id
    }).get({
      success: res => {
        this.setData({
          questionaire: res.data[0]
        })
        console.log(res.data)
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  changestyle: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['无图表', '条形图'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.setData({
            style: "wu"
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            style: "tiaoxing"
          })
          console.log(that.data.style)
          that.drawtiaoxing()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  drawtiaoxing: function () {
    var that = this
    var res = wx.getSystemInfoSync()
    for (var i = 0; i < that.data.questionaire.questions.length; i++) {
      var question = that.data.questionaire.questions[i]
      var context = wx.createContext()
      var maxnumber = 0
      //获取最多人数的选项使图形充满屏幕宽度，其他选项根据比例调整长度
      for (var j = 0; j < question.optionsForQuesid.length; j++) {
        if (question.optionsForQuesid[j].weight > maxnumber) {
          maxnumber = question.optionsForQuesid[j].weight
        }
      }

      //开始绘制每个选项的图形条
      for (var k = 0; k < question.optionsForQuesid.length; k++) {
        var option = question.optionsForQuesid[k]
        var recheight = res.windowWidth * 200 / 750 / question.optionsForQuesid.length
        var vertioffset = k * recheight
        var width = option.weight / maxnumber * res.windowWidth * 0.95
        //防止人数为0的时候没有长度显示
        if (width == 0)
          width = 2;
        //开始创建一个路径
        context.beginPath()
        //设置纯色填充
        context.setFillStyle(that.data.color[k % that.data.color.length])
        //添加一个矩形路径到当前路径
        context.rect(0, vertioffset, width, recheight)
        //对当前路径进行填充
        context.fill()
      }
      wx.drawCanvas({
        canvasId: 'Canvastiaoxing' + parseInt(i + 1),
        //context.getActions()获取当前context上存储的绘图动作
        actions: context.getActions()
      })
    }
  }
})