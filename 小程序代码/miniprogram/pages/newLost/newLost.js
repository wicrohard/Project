var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostOrder: 0,
    lostTitle: null,
    lostDescription: null,
    lostTime: null,
    lostLocation: null,
    contactDetails: null,
    user: null,
    time: null,       //当前时间
    timetab: null,    //当前时间距1970年1月1日之间的毫秒数
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    //获得当前时间
    var time = util.formatTime(new Date())
    var start_date = new Date(time.replace(/-/g, "/"));
    //获得当前时间距1970年1月1日之间的毫秒数
    var timetab = start_date.getTime()
    this.setData({
      timetab: timetab,
      time: time,
    })
  },

  lostComplete: function (e) {
    console.log(!(e.detail.value.lostTitle && e.detail.value.lostDescription && e.detail.value.lostTime && e.detail.value.lostLocation && e.detail.value.contactDetails))
    if (!(e.detail.value.lostTitle && e.detail.value.lostDescription && e.detail.value.lostTime && e.detail.value.lostLocation && e.detail.value.contactDetails)) {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '输入不能为空',
      })
      return
    }
    this.setData({
      lostTitle: e.detail.value.lostTitle,
      lostDescription: e.detail.value.lostDescription,
      lostTime: e.detail.value.lostTime,
      lostLocation: e.detail.value.lostLocation,
      contactDetails: e.detail.value.contactDetails,
    })
    console.log("e.detail.value.lostDescription: " + e.detail.value.lostDescription)
    const db = wx.cloud.database()
    db.collection('lost').add({
      data: {
        title: this.data.lostTitle,
        description: this.data.lostDescription,
        location: this.data.lostLocation,
        time: this.data.lostTime,
        contactDetails: this.data.contactDetails,
        startTime: this.data.timetab,
        releaseTime: this.data.time,
        userName: getApp().globalData.userInfo.nickName,
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.reLaunch({
          url: '../lostList/lostList',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 5000,
      mask: true
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