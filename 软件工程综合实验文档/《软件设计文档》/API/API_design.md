# API设计
   
     
| 版本 | 日期 | 描述 | 作者 |
| - | - | - | - |
| v1.3 | 2019.5.3 | API设计 | LJY |

本项目使用的是微信web开发者工具的云开发模式。因此，大部分API使用的是微信小程序开发的API。

[微信小程序API官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/)

## 关于开发者模式
在云开发模式中，后端功能迁移到前端实现，微信小程序的云开发为开发者设计后了一系列的API接口，我们只需要在前端使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代。例如以下代码用于更新用户集合中的性别和年级：
~~~
  db.collection('usersInfo').doc(app.globalData.userInfo._id).update({
    data: {
      gender: this.data.gender,
      grade: this.data.grade,
    },
~~~
db.collection('userInfo')访问到集合'userInfo'，然后根据app.globalData.userInfo._id找到对应的记录,使用update()方法更新这条记录。

## 云函数
但需要注意的是，关于数据库的处理权限，只有创建该记录的用户有权限写记录，其他用户最大权限也仅限于可读。如果想要对其他用户创建的记录执行写操作，必须通过云函数。因此，我们定义了两个云函数，分别是用于登录的"login"和回答问卷时用于提交的"submitQuestionaire"。
