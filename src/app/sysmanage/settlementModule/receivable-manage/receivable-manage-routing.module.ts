import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettlementReportComponent } from './settlement-report/settlement-report.component';
import { SettlementReportFormComponent } from './settlement-report-form/settlement-report-form.component';
import { PaymentVerificationComponent } from './payment-verification/payment-verification.component';
import { PaymentRegistrationComponent } from './payment-registration/payment-registration.component';
import { FinancialConfirmComponent } from './financial-confirm/financial-confirm.component';
import { InvoiceInformationComponent } from './invoice-information/invoice-information.component';
import { WaybillSettlementComponent } from './waybill-settlement/waybill-settlement.component';
import { AccountAuditComponent } from './account-audit/account-audit.component';
import { EntrustDistributionComponent } from './entrust-distribution/entrust-distribution.component';
import { EntrustDistributionConfirmComponent } from './entrust-distribution-confirm/entrust-distribution-confirm.component';
import { ClientMoneyManageComponent } from './client-money-manage/client-money-manage.component';
import { AllocateFundsSettleComponent } from './allocate-funds-settle/allocate-funds-settle.component';
import { BillingManageComponent } from './billing-manage/billing-manage.component';
import { OrderSettlementComponent } from './order-settlement/order-settlement.component';
import { RevWriteOff2Component } from './rev-write-off2/rev-write-off2.component';
import { NewEntrustDistributionComponent } from './new-entrust-distribution/new-entrust-distribution.component';
import { FlatAccountOrderComponent } from './flat-account-order/flat-account-order.component';
import { CustomerSettlementComponent } from './customer-settlement/customer-settlement.component';
import { InvoiceInformationHadComponent } from './invoice-information-had/invoice-information-had.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { JournalAccountComponent } from './journal-account/journal-account.component';
import { CostLncomeComponent } from './cost-lncome/cost-lncome.component';
import { CostExpendComponent } from './cost-expend/cost-expend.component';


const routes: Routes = [
  { path: '', redirectTo: 'settlementReport' },
  { path: 'settlementReport', component: SettlementReportComponent },
  { path: 'settlementReportForm', component: SettlementReportFormComponent },
  { path: 'paymentVerification', component: PaymentVerificationComponent },
  { path: 'paymentVerificationNew', component: RevWriteOff2Component },
  { path: 'paymentRegistration', component: PaymentRegistrationComponent },
  { path: 'financialConfirm', component: FinancialConfirmComponent },
  { path: 'invoiceInformation', component: InvoiceInformationComponent },
  { path: 'waybillSettlement', component: WaybillSettlementComponent },
  { path: 'accountAudit', component: AccountAuditComponent },
  { path: 'entrustDistribution', component: EntrustDistributionComponent },
  { path: 'entrustDistributionConfirm', component: EntrustDistributionConfirmComponent },
  { path: 'clientMoneyManage', component: ClientMoneyManageComponent },
  { path: 'entrustDistributionSettle', component: AllocateFundsSettleComponent },
  { path: 'billingManage', component: BillingManageComponent, data: { noReuse: true } },
  { path: 'orderSettlement', component: OrderSettlementComponent },
  { path: 'entrustDistribution2', component: NewEntrustDistributionComponent },
  { path: 'flatAccountOrder', component: FlatAccountOrderComponent },
  { path: 'customerSettlement', component: CustomerSettlementComponent },
  { path: 'invoiceInformationHad', component: InvoiceInformationHadComponent },
  { path: 'invoicePrint', component: InvoicePrintComponent },
  { path: 'journalAccount', component: JournalAccountComponent },
  { path: 'costIncome', component: CostLncomeComponent },
  { path: 'costExpend', component: CostExpendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivableManageRoutingModule { }
