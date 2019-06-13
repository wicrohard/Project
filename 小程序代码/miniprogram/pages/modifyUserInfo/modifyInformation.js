// pages/modifyInformation/modifyInformation.js

const app = getApp()
const db = wx.cloud.database()
//var newSex = 'male';
//var newGrade = 'grade-one';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexItems:[
      {name:'男',value: '男' },
      {name:'女',value: '女'},
    ],
    gradeItems: [
      { name: '大一', value: '大一' },
      { name: '大二', value: '大二' },
      { name: '大三', value: '大三' },
      { name: '大四', value: '大四' },
      { name: '研一', value: '研一' },
      { name: '研二', value: '研二' },
      { name: '研三', value: '研三' },
    ],
    gender: null,
    grade: null,
  },
  sexChange: function (e) {
    console.log('gender发生change事件，携带value值为：', e.detail.value);
    this.data.gender = e.detail.value;
  },
  gradeChange: function (e) {
    console.log('grade发生change事件，携带value值为：', e.detail.value)
    this.data.grade = e.detail.value;
  },
  submitInformation: function () {
    db.collection('usersInfo').doc(app.globalData.userInfo._id).update({
      data: {
        gender: this.data.gender,
        grade: this.data.grade,
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功, 记录 _id: ', res._id)
        app.globalData.userInfo.gender = this.data.gender
        app.globalData.userInfo.grade = this.data.grade
        console.log(app.globalData.userInfo)
        setTimeout(function(){
          wx.reLaunch({
            url: '../mine/mine',
          })
        },1000)
        wx.showToast({
          title: '修改信息成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '更新信息失败，请重试'
        })
        console.error('更新用户信息失败：', err)
      }
    })
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
  }
})

