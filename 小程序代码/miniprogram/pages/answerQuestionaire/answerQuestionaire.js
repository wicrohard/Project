// pages/answerQuestionaire/answerQuestionaire.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionaire: null,
    answers: [],
    complete: false,  //用于判断是否填完了所有的问题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.userInfo.openid)
    console.log(options)
    const db = wx.cloud.database()
    db.collection('questionaires').doc(options._id).get({
      success: res => {
        console.log('[数据库] [获取记录] 成功, 记录 _id: ', res.data._id)
        console.log(res.data)
        this.setData({
          questionaire: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取问卷信息失败，请重试'
        })
        console.error('获取问卷信息失败：', err)
      },
    })
  },
  submitQuestionaire: function(e){
    // 用于判断是否填写完了所有的问题
    console.log(e.detail.value)
    for(var i = 1; i <= this.data.questionaire.questions.length; i++){
      if((!e.detail.value["question" + i])
        || (this.data.questionaire.questions[i - 1].questionTypeid == 2 && e.detail.value["question" + i].length == 0)){
        wx.showToast({
          icon: 'none',
          title: '请填写完所有问题',
        });
        return ;
      }
    }

    // 获取答题者所选选项列表
    var answers = []
    var optionOrder = []
    for (var i = 0; i < this.data.questionaire.questions.length; i++) {
      var key = "question" + this.data.questionaire.questions[i].quesOrder;
      if (this.data.questionaire.questions[i].questionTypeid == 1){
        answers = answers.concat({ optionOrder: parseInt(e.detail.value[key]) })
      }else{
        for (var j = 0; j < e.detail.value[key].length; j++){
          optionOrder[j] = parseInt(e.detail.value[key][j])
        }
        answers = answers.concat({ optionOrder: optionOrder} )
        optionOrder = []
      }
    }
    console.log(answers)

    // 修改选项信息
    for (var i = 0; i < this.data.questionaire.questions.length; i++) {
      if (this.data.questionaire.questions[i].questionTypeid == 1) {
        this.data.questionaire.questions[i].optionsForQuesid[answers[i].optionOrder - 1].weight += 1
      } else {
        for (var j = 0; j < answers[i].optionOrder.length; j++) {
          this.data.questionaire.questions[i].optionsForQuesid[answers[i].optionOrder[j] - 1].weight += 1
        }
      }
    }
    console.log(this.data.questionaire)
    // 进行数据库操作 ------------------------
    // 提交问卷
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: 'submitQuestionaire',
      data: {
        questions: this.data.questionaire.questions,
        id: this.data.questionaire._id
      },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res.data)
      }
    })
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    // 添加用户积分
    db.collection('usersInfo').doc(getApp().globalData.userInfo._id).update({
      data: {
        credit: _.inc(this.data.questionaire.bonus)
      },
      success: res => {
        getApp().globalData.userInfo.credit += this.data.questionaire.bonus
        wx.reLaunch({
          url: '../questionaireList/questionairList',
        })
      },
      fail: err => {
        icon: 'none',
          console.error('提交问卷失败：', err)
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