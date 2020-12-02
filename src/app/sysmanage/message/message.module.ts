import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPageModule } from '../../components/common-page/common-page.module';
import { SearchformModule } from '../../components/searchform/searchform.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../components/modal/modal.module';
import { TableFormModule } from '../../components/table-form/table-form.module';
import { InputModalModule } from '../../components/input-modal/input-modal.module';
import { TplButtonsModule } from '../../components/tpl-buttons/tpl-buttons.module';
import { SelectModule } from '../../components/simple-page/simple-page-form.module';
import { CompanyChoiceModule } from '../../components/company-choice/company-choice.module';
import { ShareModule } from '../../common/share/share.module';

import { MessageRoutingModule } from './message-routing.module';

import { MessageViewComponent } from './message-view/message-view.component'; // 消息查看
import { MessageNoReadComponent } from './message-no-read/message-no-read.component'; // 消息未读查看
import { MessageReadComponent } from './message-read/message-read.component'; // 消息已读查看
import { MessageSubscribeComponent } from './message-subscribe/message-subscribe.component'; // 消息订阅
import { MessageTemplateComponent } from './message-template/message-template.component'; // 消息主题设置 // 消息发送查看
import { MessageSendComponent } from './message-send/message-send.component'; // 平台消息发送
import { MessageSendViewComponent } from './message-send-view/message-send-view.component'; // 平台发送消息查看
import { MessageSendReportComponent } from './message-send-report/message-send-report.component';
import { MessageRemindComponent } from './message-remind/message-remind.component';
import { MessageRgComponent } from './message-rg/message-rg.component'; // 平台消息统计报表
import { MessageSendRGSalesComponent } from './message-send-rgsales/message-send-rgsales.component';
import { MessageSendRGSalesAllMessageComponent } from './message-send-rgsales-all-message/message-send-rgsales-all-message.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module'; // 平台消息统计报表

@NgModule({
  declarations: [
    MessageViewComponent, MessageSendComponent, MessageReadComponent, MessageSubscribeComponent,
    MessageTemplateComponent, MessageNoReadComponent, MessageSendViewComponent ,
    MessageSendReportComponent,
    MessageRemindComponent,
    MessageRgComponent,
    MessageSendRGSalesComponent,
    MessageSendRGSalesAllMessageComponent],
  imports: [
    SelectModule,
    TplButtonsModule,
    CommonModule,
    MessageRoutingModule,
    CommonPageModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    SearchformModule,
    TableFormModule,
    InputModalModule,
    CompanyChoiceModule,
    ShareModule,
    GridResizeModule
  ]
})
export class MessageModule { }
