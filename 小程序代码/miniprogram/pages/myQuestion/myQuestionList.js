// miniprogram/pages/myQuestion/myQuestionList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionaires: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    // 查询当前用户所有的问卷
    console.log(app.globalData.userInfo.openid)
    db.collection('questionaires').where({
      _openid: app.globalData.userInfo.openid
    }).get({
      success: res => {
        this.setData({
          questionaires: res.data
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

  },

  showdetail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../statistics/statistics?id=' + id,
    })
  },

  stopAnswer: function (e) {
    const db = wx.cloud.database()
    db.collection('questionaires').doc(e.target.dataset._id).update({
      data: {
        isLiving: false,
      },
      success: res => {
        wx.showToast({
          title: '问卷已结束',
        })
        this.onLoad()
      },
      fail: err => {
        icon: 'none',
          console.error('提交问卷失败：', err)
      }
    })
  },

  clearAnswer: function (e) {
    const db = wx.cloud.database()
    db.collection('questionaires').doc(e.target.dataset._id).remove({
      success: res => {
        wx.showToast({
          title: '问卷已删除',
        })
        this.onLoad()
      },
      fail: err => {
        icon: 'none',
          console.error('删除问卷失败：', err)
      }
    })
  }

})