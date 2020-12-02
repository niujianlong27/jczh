import {NgModule} from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { NgZorroAntdModule } from 'ng-zorro-antd';
//import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {ShareModule} from '@share/share.module';

import {PaymentManageRoutingModule} from './payment-manage-routing.module';
import {PaymentReportComponent} from './payment-report/payment-report.component';
import {PaymentRegisterComponent} from './payment-register/payment-register.component';
import {PaymentSearchComponent} from './payment-search/payment-search.component';
import {PaymentAuditComponent} from './payment-audit/payment-audit.component';
import {CommonPageModule} from '@component/common-page';
import {InputModalModule} from '@component/input-modal/input-modal.module';
import {PaymentReportFormComponent} from './payment-report-form/payment-report-form.component';
import {ModalModule} from '@component/modal';
import {TableFormModule} from '@component/table-form/table-form.module';
import {SearchformModule} from '@component/searchform/searchform.module';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
import {PayRegComponent} from './pay-reg/pay-reg.component';
import {CollectInformationComponent} from './collect-information/collect-information.component';
import {PaymentOilComponent} from './payment-oil/payment-oil.component';
import {OilUnfreezeComponent} from './oil-unfreeze/oil-unfreeze.component';
import {PaymentRegSearchComponent} from './payment-reg-search/payment-reg-search.component';
import {PaymentConfirmComponent} from './payment-confirm/payment-confirm.component';
import {PaymentRegisterBatchComponent} from './payment-register-batch/payment-register-batch.component';
import {CheckAccountComponent} from './check-account/check-account.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module';
import {ImgViewerModule} from '@component/img-viewer/img-viewer';
import { KingdeeComponent } from './kingdee/kingdee.component';
import { InvkingdeeComponent } from './invkingdee/invkingdee.component';
import { ApprovalPayComponent } from './approval-pay/approval-pay.component';
import { InternalCredentialManagementComponent } from './internal-credential-management/internal-credential-management.component';

const component = [
  PaymentReportComponent,
  PaymentRegisterComponent,
  PaymentSearchComponent,
  PaymentAuditComponent,
  PaymentReportFormComponent,
  PayRegComponent,
  CollectInformationComponent,
  PaymentOilComponent,
  OilUnfreezeComponent,
  PaymentRegSearchComponent,
  PaymentConfirmComponent
];

@NgModule({
  imports: [
    //  CommonModule,
    PaymentManageRoutingModule,
    CommonPageModule,
    InputModalModule,
    ModalModule,
    //  NgZorroAntdModule,
    //  FormsModule,
    //   ReactiveFormsModule,
    ShareModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    GridResizeModule,
    ImgViewerModule
  ],
  declarations: [...component, PaymentRegisterBatchComponent, CheckAccountComponent, KingdeeComponent,InvkingdeeComponent, ApprovalPayComponent, InternalCredentialManagementComponent],
})
export class PaymentManageModule {
}
