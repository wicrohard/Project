//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
/*
    this.globalData.openid = wx.getStorageSync('openid')
    console.log(this.globalData.openid)
    if (this.globalData.openid) {
      const db = wx.cloud.database()
      db.collection('usersInfo').where({
        _openid: this.globalData.openid
      }).get({
        success: res => {
          getApp().globalData.userInfo = res.data[0]
          console.log(this.globalData.userInfo)
          //  wx.navigateTo({
          //    url: './pages/mine/mine',
          //  })
          this.getRequment()
        },
        fail: err => {
          console.error('[读取用户信息失败]：', err)
        }
      })
    } 
  */
  },
 globalData: {
    userInfo: null,
    openid: null,
    requment: [],
  },

 getRequment: function(){
   if(!this.globalData.userInfo) return
   var gender = null;
   if (this.globalData.userInfo.gender == "男") {
     gender = {男 : true}
   } else {
     gender = {女 : true}
   }
   var grade = null
   if (this.globalData.userInfo.grade == "大一") {
     grade = {大一: true}
   } else if (this.globalData.userInfo.grade == "大二"){
     grade = {大二: true }
   } else if (this.globalData.userInfo.grade == "大三") {
     grade = {大三: true }
   } else if (this.globalData.userInfo.grade == "大四") {
     grade = {大四: true }
   } else if (this.globalData.userInfo.grade == "研一") {
     grade = {研一: true }
   } else if (this.globalData.userInfo.grade == "研二") {
     grade = {研二: true }
   } else{
     grade = {研三: true }
   } 
   this.globalData.requment = {gender, grade}
   console.log("this.globalData.requment: " + this.globalData.requment)
 }
})
