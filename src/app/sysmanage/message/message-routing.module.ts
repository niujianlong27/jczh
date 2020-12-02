import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageViewComponent } from './message-view/message-view.component'; // 消息查看
import { MessageNoReadComponent } from './message-no-read/message-no-read.component'; // 消息未读查看
import { MessageReadComponent } from './message-read/message-read.component'; // 消息已读查看
import { MessageSubscribeComponent } from './message-subscribe/message-subscribe.component'; // 消息订阅// 消息发送
import { MessageTemplateComponent } from './message-template/message-template.component'; // 消息主题设置// 消息发送查看
import { MessageSendComponent } from './message-send/message-send.component';  // 平台消息发送
import { MessageSendViewComponent } from './message-send-view/message-send-view.component'; // 平台发送消息查看
import { MessageSendReportComponent } from './message-send-report/message-send-report.component'; // 平台消息统计报表
import { MessageRemindComponent } from './message-remind/message-remind.component';
import {MessageSendRGSalesComponent} from './message-send-rgsales/message-send-rgsales.component';
import {MessageSendRGSalesAllMessageComponent} from './message-send-rgsales-all-message/message-send-rgsales-all-message.component'; // 消息提醒设置
import { MessageRgComponent} from './message-rg/message-rg.component'; // 日钢采购消息设置

const routes: Routes = [
  {path: '', redirectTo: 'messageView'},
  { path: 'messageView', component: MessageViewComponent},
  { path: 'messageSend', component: MessageSendComponent},
  { path: 'messageTemplate', component: MessageTemplateComponent},
  { path: 'messageNoRead', component: MessageNoReadComponent},
  { path: 'messageRead', component: MessageReadComponent},
  { path: 'messageSubscribe', component: MessageSubscribeComponent},
  { path: 'messageSendView', component: MessageSendViewComponent},
  { path: 'messageSendReport', component: MessageSendReportComponent},
  { path: 'messageRemind', component: MessageRemindComponent},
  { path: 'messageSendRGSales', component: MessageSendRGSalesComponent},
  { path: 'messageSendRGSalesAllMessage', component: MessageSendRGSalesAllMessageComponent},
  { path: 'messageRg' , component: MessageRgComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }
