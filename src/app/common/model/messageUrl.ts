import {environment} from '../../../environments/environment';

let baseUrl = environment.baseUrlMessage;
if (environment.production) {
  baseUrl = environment.baseUrlMessage; // 根路径
}
export const messageUrl = {
  // layout
  messageUnRead: `${baseUrl}centreMessage/getUnReadMessage`, // 获取当前账户未读消息数量
  // 消息查看管理 -》消息查看（通过isAll来判断查看用户接收消息列表，还是平台发送消息列表）
  messageListGet: `${baseUrl}centreMessage/getMessage`, // 获取全部消息列表
  messageRead: `${baseUrl}centreMessage/markReadMessage`, // 标记已读
  messageAllRead: `${baseUrl}centreMessage/markReadAllMessage`, // 全部已读
  messageDel: `${baseUrl}messageUser/deleteMessageUserById`, // 消息删除
  // 消息发送管理 -》消息推送
  messagePush: `${baseUrl}pushMessage/pushMessage`, // 消息推送（即时/定时）
  sendUserGet: `${baseUrl}messageSubscribe/selectNoInfomationAllCompany`, // 获取主题未绑定所有人员
  // 消息设置管理 -》主题设置
  messageTopicSearch: `${baseUrl}messageTopic/getMessageTopic`, // 消息模板查询
  topicMessageSearch: `${baseUrl}messageTopic/getTopicSMS`, // 日钢消息模板查询
  getMessageUser: `${baseUrl}dispUserTruck/getUser`, // 日钢消息模板获取用户
  rgPushMessage: ` ${baseUrl}pushMessage/pushMessage`, // 日钢消息推送
  messageTopicAdd: `${baseUrl}messageTopic/insertMessageTopic`, // 消息主题新增
  messageTopicUpdate: `${baseUrl}messageTopic/updateMessageTopic`, // 消息主题更新
  messageTopicDel: `${baseUrl}messageTopic/deleteMessageTopic`, // 消息主题删除
  // 消息设置管理 -》提醒设置
  topicBindUsers: `${baseUrl}messageSubscribe/selectInfomation`, // 绑定某条主题的用户列表
  topicNoBindUsers: `${baseUrl}messageSubscribe/selectNoInfomation`, // 未绑定某条主题的用户列表
  topicUsersBind: `${baseUrl}messageSubscribe/inseertSubscribe`, // 主题用户绑定
  topicUsersUnBind: `${baseUrl}messageSubscribe/deleteSubscribe`, // 主题用户解绑
  // 消息发送管理 -》 消息查看
  messageGetGroup: `${baseUrl}messageGroup/getMessageGroup`, // 获取按组区分的消息
  messageGetDetail: `${baseUrl}centreMessage/getMessageByGroupId`, // 按消息组获取消息列表
  messageCancelSend: `${baseUrl}centreMessage/updateMessageStatusByGroup`, // 取消消息定时发送
  bindedCompanys: `${baseUrl}topicCompany/selectInfomation`, // 订阅到主题的公司列表
  // 消息设置管理 -》 订阅设置
  topicCompany: `${baseUrl}topicCompany/getAllCompany`, // 获取公司
  topicBindCompany: `${baseUrl}topicCompany/insertCompanysTopics`, // 公司订阅主题
  topicUnBindCompany: `${baseUrl}topicCompany/deleteCompanysTopics`, // 公司取消订阅主题
  topicResetCompany: `${baseUrl}topicCompany/resetCompanysTopics`, // 公司重置订阅主题
  topicCopy: `${baseUrl}topicCompany/copyCompanysTopics`, // 公司主题复制
  companyBindList: `${baseUrl}topicCompany/getInfomationTopic`, // 公司已订阅主题列表
  companyUnBindList: `${baseUrl}topicCompany/getNoInfomationTopic`, // 公司未订阅主题列表

  // 日钢销售司机消息发送
  getWaybillUser: `${baseUrl}dispUserTruck/getWaybillUser`, // 根据运单查询用户
  getSysUserByCompany: `${baseUrl}dispUserTruck/getSysUserByCompany`, // 根据车队查询
  getSysUserByMobile: `${baseUrl}dispUserTruck/getSysUserByMobile`, // 根据手机号查询

  // 消息内容发布
  selectAppName: `${baseUrl}appVersion/selectAppName`, // 消息内容发布发布位置查询
  insertNoticeMessage: `${baseUrl}noticeMessage/insertNoticeMessage`, // 消息内容发布新增
  selectNoticeMessage: `${baseUrl}noticeMessage/selectNoticeMessage`, // 消息内容发布查询
  updateNoticeMessage: `${baseUrl}noticeMessage/updateNoticeMessage`, // 消息内容发布修改
  deleteNoticeMessage: `${baseUrl}noticeMessage/deleteNoticeMessage`, // 消息内容发布删除


};
