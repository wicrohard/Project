// miniprogram/pages/mine/mine.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(this.data.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
    this.data.userInfo = app.globalData.userInfo
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

  /**
   * 用户跳转的创建问卷的界面
   */
  newQuestionaire: function (){
    wx.navigateTo({
      url: '../newQuestionaire/newQuestionaire',
    })
  },
  /**
   * 用户查看自己发布的问卷的列表
   */
  myQuestionaire: function (){
    wx.navigateTo({
      url: '../myQuestion/myQuestionList',
    })
  },
  answerQuestionaire: function(){
    wx.navigateTo({
      url: '../questionaireList/questionairList',
    })
  },

  modifyUserInfomation: function(){
    wx.navigateTo({
      url: '../modifyUserInfo/modifyInformation',
    })
  },
  newLost: function () {
    wx.navigateTo({
      url: '../newLost/newLost',
    })
  },
  lostList: function () {
    wx.navigateTo({
      url: '../lostList/lostList',
    })
  },
})