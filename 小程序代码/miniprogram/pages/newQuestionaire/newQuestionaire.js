// miniprogram/pages/newQuestionaire/newQuestionaire.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quesorder: 0,
    array: [],
    optioncontent: null,
    nextquesid: null,
    optionsForQuesid: [],
    questionTypeid: 0,
    quesTypeArray: ['单选题', '多选题'],
    current: "survey",
    surveyTitle: null,
    surveyDescription: null,
    surveyPeroration: null,
    surveyBonus: null,
    queses: [],
    user: null,
    time: null,       //当前时间
    timetab: null,    //当前时间距1970年1月1日之间的毫秒数
    requments: {
      gender : [
        { name: '男', value: '男', checked: false},
        { name: '女', value: '女', checked: false},
      ],
      grade: [
        { name: '大一', value: '大一', checked: false},
        { name: '大二', value: '大二', checked: false},
        { name: '大三', value: '大三', checked: false},
        { name: '大四', value: '大四', checked: false},
        { name: '研一', value: '研一', checked: false },
        { name: '研二', value: '研二', checked: false },
        { name: '研三', value: '研三', checked: false }
      ]
    },
    gender : {},
    grade : {}
  },
  checkboxChangeGender: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.gender = {}
    for (var i = 0; i < e.detail.value.length; i++) {
      this.data.gender[e.detail.value[i]] = true
    }
    console.log(this.data.gender)
  },
  checkboxChangeGrade: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.grade = {}
    for (var i = 0; i < e.detail.value.length; i++) {
      this.data.grade[e.detail.value[i]] = true
    }
    console.log(this.data.grade)
  },
  surveyComplete: function (e) {
    if (!(e.detail.value.surveyTitle && e.detail.value.surveyDescription && e.detail.value.surveyPeroration && e.detail.value.surveyBonus))
    {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '输入不能为空',
      })
      return
    }
    if (!parseInt(e.detail.value.surveyBonus))
    {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '报酬请输入数字',
      })
      return
    }
    if (JSON.stringify(this.data.gender) == "{}" || JSON.stringify(this.data.grade) == "{}")
    {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '请选择调查对象',
      })
      return
    }
    this.setData({
      current: "questionList",
      surveyTitle: e.detail.value.surveyTitle,
      surveyDescription: e.detail.value.surveyDescription,
      surveyPeroration: e.detail.value.surveyPeroration,
      surveyBonus: parseInt(e.detail.value.surveyBonus)
    })
    console.log("e.detail.value.surveyDescription: " + e.detail.value.surveyDescription)
  },
  toques: function () {
    this.setData({
      current: "ques",
    })
  },
  newques: function () {
    this.setData({
      current: "option",
    })
  },
  bindTypeChange: function (e) {
    this.setData({
      questionTypeid: parseInt(e.detail.value)
    })
  },
  addOption: function () {
    this.setData({
      array: this.data.array.concat(this.data.array.length + 1)
    })
  },
  quesComplete: function (e) {
    if (!e.detail.value.quesContent) {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '请输入题目内容',
      })
      return
    }
    if (this.data.array.length < 2) {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '至少两个选项',
        
      })
      return
    }
    for(var i = 0; i< this.data.array.length; ++i)
    {
      var optionkey = "option" + i;
      if (!e.detail.value[optionkey])
      {
        wx.showToast({
          image: '../../images/icon/icon-bang.png',
          title: '请输入选项内容',
        })
        return
      }
    }
    this.setData({
      quesorder: this.data.quesorder + 1,
    })
    for (var i = 0; i < this.data.array.length; i++) {
      var optionkey = "option" + i;
      var optionsForQuesidd = this.data.optionsForQuesid.concat([{ optionOrder: i + 1,optionContent: e.detail.value[optionkey], weight: 0}])
      this.setData({
        optionsForQuesid: optionsForQuesidd
      })
    }

    var quesess = this.data.queses.concat([{ quesContent: e.detail.value.quesContent, 
                                            questionTypeid: 1 + parseInt(this.data.questionTypeid), 
                                            quesOrder: this.data.quesorder, 
                                            optionsForQuesid: this.data.optionsForQuesid }])
    console.log(quesess)
    this.setData({
      queses: quesess,
      questionTypeid: 0,
    })
    this.setData({
      current: "questionList",
    })
    this.setData({
      array: [],
      optionsForQuesid: [],
    })
  },
  completeAll: function () {
    // get reference of the database
    var gender = this.data.gender
    var grade = this.data.grade
    const db = wx.cloud.database()
    if(this.data.queses.length == 0)
    {
      wx.showToast({
        image: '../../images/icon/icon-bang.png',
        title: '请添加新题',
      })
      return
    }
    db.collection('questionaires').add({
      data: {
        title: this.data.surveyTitle,
        description: this.data.surveyDescription,
        peroration: this.data.surveyPeroration,
        questions: this.data.queses,
        total: 0,
        isLiving: true,
        releaseTime: this.data.time,
        userName: getApp().globalData.userInfo.nickName,
        requment: {
          gender,
          grade
        },
        bonus: this.data.surveyBonus,
      },
      success: res => {
        wx.showToast({
          title: '发布问卷成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.reLaunch({
          url: '../questionaireList/questionairList',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建问卷失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
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
