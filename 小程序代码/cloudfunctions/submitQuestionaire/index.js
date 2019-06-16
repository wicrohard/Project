// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('questionaires').doc(event.id).update({
      data: {
        questions: _.set(event.questions),
        total: _.inc(1)
      },
      success: res => {
        messages = '回答问卷' + event.id + '成功'
        console.log('回答问卷成功')
      },
      fail: err => {
        messages = '回答问卷' + event.id + '失败'
        console.error('提交问卷失败：', err)
      }
    })

  } catch (e) {
    console.log(e)
  }

}