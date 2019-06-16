// miniprogram/pages/questionaireList/questionairList.js
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionaires : null,
    time: null,       //当前时间
    nowDate: null,    //当前日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getRequment()
    const db = wx.cloud.database()
    // 查询满足当前用户的所有问卷
    var gender2 = "大一"
    db.collection('questionaires').where({
      requment: app.globalData.requment,
      isLiving: true
    }).get({
      success: res => {
        this.setData({
          questionaires: res.data
        })
        console.log(this.data.questionaires)
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
  gotoAnswer: function(e){
    console.log(e.target.dataset._id)
    wx.navigateTo({
      url: '../answerQuestionaire/answerQuestionaire?_id=' + e.target.dataset._id,
    })
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