// miniprogram/pages/questionaireList/questionairList.js
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lost: null,
    stopTime: null,   //限制可查看到的寻物启事发布时间
    array: ['三日内', '七日内', '一月内', '全部'],
    objectArray: [
      {
        id: 3,
        name: '三日内'
      },
      {
        id: 7,
        name: '七日内'
      },
      {
        id: 30,
        name: '一月内'
      },
      {
        id: 30000,
        name: '全部'
      }
    ],
    index: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date())
    var start_date = new Date(time.replace(/-/g, "/"));
    //限制在七天内
    var timetab = start_date.getTime() - this.data.objectArray[this.data.index].id*24*60*60*1000
    this.setData({
      stopTime: timetab
    })
    app.getRequment()
    const db = wx.cloud.database()
    db.collection('lost').get({
      success: res => {
        this.setData({
          lost: res.data
        })
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

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.onLoad()
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
    //下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
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

  }
})