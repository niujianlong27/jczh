import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { PaymentRegisterComponent } from "./payment-register/payment-register.component";
import { PaymentSearchComponent } from "./payment-search/payment-search.component";
import { PaymentAuditComponent } from "./payment-audit/payment-audit.component";
import { PaymentReportFormComponent } from "./payment-report-form/payment-report-form.component";
import { PayRegComponent } from "./pay-reg/pay-reg.component";
import { CollectInformationComponent } from "./collect-information/collect-information.component";
import { PaymentOilComponent } from "./payment-oil/payment-oil.component";
import { OilUnfreezeComponent } from "./oil-unfreeze/oil-unfreeze.component";
import {PaymentRegSearchComponent} from './payment-reg-search/payment-reg-search.component';
import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import { PaymentRegisterBatchComponent } from './payment-register-batch/payment-register-batch.component';
import { CheckAccountComponent } from './check-account/check-account.component';
import {KingdeeComponent} from './kingdee/kingdee.component';
import {InvkingdeeComponent} from './invkingdee/invkingdee.component';
import { ApprovalPayComponent } from './approval-pay/approval-pay.component';
import {InternalCredentialManagementComponent} from './internal-credential-management/internal-credential-management.component';
const routes: Routes = [
  { path: '', redirectTo: 'paymentReport' },
  { path: 'paymentReport', component: PaymentReportComponent },
  { path: 'paymentRegister', component: PaymentRegisterComponent },
  { path: 'paymentRegisterBatch', component: PaymentRegisterBatchComponent },
  { path: 'paymentSearch', component: PaymentSearchComponent },
  { path: 'paymentAudit', component: PaymentAuditComponent },
  { path: 'paymentReportForm', component: PaymentReportFormComponent },
  { path: 'payReg', component: PayRegComponent },
  { path: 'collectInformation', component: CollectInformationComponent },
  { path: 'paymentOil', component: PaymentOilComponent },
  { path: 'oilUnfreeze', component: OilUnfreezeComponent },
  { path: 'paymentRegSearch', component: PaymentRegSearchComponent },
  { path: 'paymentConfirm', component: PaymentConfirmComponent },
  { path: 'checkAccount', component: CheckAccountComponent },
  { path: 'paymentConfirmFleet', component: PaymentConfirmComponent },
  { path: 'kingdee', component: KingdeeComponent },
  { path: 'invkingdee', component: InvkingdeeComponent },
  { path: 'approvalPay', component: ApprovalPayComponent },
  { path: 'internalCredentialManagement', component: InternalCredentialManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentManageRoutingModule { }
