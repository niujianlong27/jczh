import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiddingRoutingModule } from './bidding-routing.module';
import { BiddingEntrustedComponent } from './bidding-entrusted/bidding-entrusted.component';
import { BiddingManageComponent } from './bidding-manage/bidding-manage.component';
import { BiddingEvaluateComponent } from './bidding-evaluate/bidding-evaluate.component';
import { GradEntrustedComponent } from './grad-entrusted/grad-entrusted.component';
import { GradEvaluateComponent } from './grad-evaluate/grad-evaluate.component';
import { GradManageComponent } from './grad-manage/grad-manage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PretenderManageRoutingModule} from '../tenderModule/pretender-manage/pretender-manage-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {InputModalModule} from '../../components/input-modal/input-modal.module';
import {TableFormModule} from '../../components/table-form/table-form.module';
import {TplButtonsModule} from '../../components/tpl-buttons/tpl-buttons.module';
import {SearchformModule} from '../../components/searchform/searchform.module';
import {InputNumberModule} from '../../components/input-number/input-number.module';
import {CommonPageModule} from '../../components/common-page/common-page.module';
import {StayManagementComponent} from './stayManagement/stay-management/stay-management.component';
import {StayManagementItemComponent} from './stayManagement/stay-management-item/stay-management-item.component';

// 下拉数据本地加载
import { DeliveryNoticeComponent } from './delivery-notice/delivery-notice.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module';
import {SelectLocalLoadDirective} from '@directive/select-local-load.directive';
import {ShareModule} from '@share/share.module';


@NgModule({
  declarations: [BiddingEntrustedComponent, BiddingManageComponent, BiddingEvaluateComponent, GradEntrustedComponent,
    GradEvaluateComponent, GradManageComponent, SelectLocalLoadDirective, StayManagementComponent, StayManagementItemComponent,DeliveryNoticeComponent],
  imports: [
    CommonModule,
    BiddingRoutingModule,
    NgZorroAntdModule,
    InputModalModule,
    TableFormModule,
    TplButtonsModule,
    SearchformModule,
    InputNumberModule,
    FormsModule,
    GridResizeModule,
    ShareModule
  ]
})
export class BiddingModule { }
