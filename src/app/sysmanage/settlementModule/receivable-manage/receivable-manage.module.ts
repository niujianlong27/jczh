import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { ReceivableManageRoutingModule } from './receivable-manage-routing.module';
import { SettlementReportComponent } from './settlement-report/settlement-report.component';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { SettlementReportFormComponent } from './settlement-report-form/settlement-report-form.component';
import { ModalModule } from '../../../components/modal/modal.module';
import { PaymentVerificationComponent } from './payment-verification/payment-verification.component';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { PaymentRegistrationComponent } from './payment-registration/payment-registration.component';
import { FinancialConfirmComponent } from './financial-confirm/financial-confirm.component';
import { InvoiceInformationComponent } from './invoice-information/invoice-information.component';
import { WaybillSettlementComponent } from './waybill-settlement/waybill-settlement.component';
import { AccountAuditComponent } from './account-audit/account-audit.component';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { AddedValueTaxTemplateModule } from '@component/added-value-tax-template/added-value-tax-template.module';

import { ShareModule } from '../../../common/share/share.module';
import { EntrustDistributionComponent } from './entrust-distribution/entrust-distribution.component';
import { EntrustDistributionConfirmComponent } from './entrust-distribution-confirm/entrust-distribution-confirm.component';
import { ClientMoneyManageComponent } from './client-money-manage/client-money-manage.component';
import { AllocateFundsSettleComponent } from './allocate-funds-settle/allocate-funds-settle.component';
import { BillingManageComponent } from './billing-manage/billing-manage.component';
import { OrderSettlementComponent } from './order-settlement/order-settlement.component';
import { RevWriteOff2Component } from './rev-write-off2/rev-write-off2.component';
import { ENgxPrintModule } from '../../../components/e-ngx-print/e-ngx-print.module';

import { GridResizeModule } from '../../../components/grid-resize/grid-resize.module';
import { NewEntrustDistributionComponent } from './new-entrust-distribution/new-entrust-distribution.component';
import { FlatAccountOrderComponent } from './flat-account-order/flat-account-order.component';
import { CustomerSettlementComponent } from './customer-settlement/customer-settlement.component';
import { InvoiceInformationHadComponent } from './invoice-information-had/invoice-information-had.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { JournalAccountComponent } from './journal-account/journal-account.component';
import { CostLncomeComponent } from './cost-lncome/cost-lncome.component';
import { CostExpendComponent } from './cost-expend/cost-expend.component';
import {ImgViewerModule} from '@component/img-viewer/img-viewer';
const components = [
  SettlementReportComponent,
  SettlementReportFormComponent,
  PaymentVerificationComponent,
  PaymentRegistrationComponent,
  FinancialConfirmComponent,
  InvoiceInformationComponent,
  WaybillSettlementComponent,
  AccountAuditComponent,
  EntrustDistributionComponent,
  EntrustDistributionConfirmComponent,
  ClientMoneyManageComponent,
  BillingManageComponent,
  AllocateFundsSettleComponent,
  OrderSettlementComponent
];
@NgModule({
  imports: [
    // CommonModule,
    ReceivableManageRoutingModule,
    //  NgZorroAntdModule,
    //   FormsModule,
    //   ReactiveFormsModule,
    CommonPageModule,
    SearchformModule,
    ModalModule,
    TplButtonsModule,
    TableFormModule,
    InputModalModule,
    ShareModule,
    GridResizeModule,
    ENgxPrintModule,
    AddedValueTaxTemplateModule,
    ImgViewerModule,
  ],
  declarations: [...components, RevWriteOff2Component, NewEntrustDistributionComponent, FlatAccountOrderComponent, CustomerSettlementComponent, InvoiceInformationHadComponent, InvoicePrintComponent, JournalAccountComponent, CostLncomeComponent, CostExpendComponent]
})
export class ReceivableManageModule { }
