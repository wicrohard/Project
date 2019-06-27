// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logged: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 判断是否可以使用云能力，否则需要提示用户升级基础库
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      wx.reLaunch({
        url: '../mine/mine',
      })
      //console.log(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(app.globalData.userInfo)
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
          wx.switchTab({
            url: '../mine/mine',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      })
    }
  },


  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  // how to get user's openid and add user's info into database
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.userInfo["credit"] = 10
    app.globalData.userInfo["gender"] = '未知'
    app.globalData.userInfo["grade"] = '未知'
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // wx.switchTab({
    //   url: '../mine/mine',
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    // 调用云函数
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.userInfo.openid = res.result.openid
        console.log(app.globalData.userInfo)
        // get user's info with openid we got
        const db = wx.cloud.database()
        db.collection('usersInfo').where({
          _openid: app.globalData.userInfo.openid
        }).get({
          // if exists
          success: res => {
            if(res.data.length != 0 ){
              app.globalData.userInfo = res.data[0]
              console.log("Get User Information Succeed")
              console.log("app.globalData.userInfo: ")
              console.log(app.globalData.userInfo)
              wx.reLaunch({
                url: '../mine/mine'
              })
            }
            else {
              db.collection('usersInfo').add({
                data: app.globalData.userInfo,
                success: res => {
                  console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  console.log("add : " + res._id)
                  wx.reLaunch({
                    url: '../mine/mine'
                  })
                },
                fail: err => {
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            }

          },
          // else
          fail: err => {
            console.log("Get User Information Failed")
            
          }
        })
        // wx.reLaunch({
        //   url: '../mine/mine'
        // })
        // wx.switchTab({
        //   url: '../mine/mine',
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // })
        // wx.setStorage({
        //   key: 'openid',
        //   data: res.result.openid,
        //   success: function () {
        //     console.log('写入openid成功')
        //   },
        //   fail: function () {
        //     console.log('写入openid发生错误')
        //   }
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
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

  }
})
