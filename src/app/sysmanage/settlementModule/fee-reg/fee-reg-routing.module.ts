import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { FeeSearchComponent } from './fee-search/fee-search.component';
import { CheckPriceComponent } from './check-price/check-price.component';
import { WaybillFeeRegComponent } from './waybill-fee-reg/waybill-fee-reg.component';
import { AccountReceivableComponent } from './account-receivable/account-receivable.component';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { TransFeeComponent } from './trans-fee/trans-fee.component';
import {FeeRegInquNewComponent} from './fee-reg-inqu-new/fee-reg-inqu-new.component';

const routes: Routes = [
  {path:'',redirectTo:'register'},
  {path:'register', component: RegisterComponent},
  {path:'search', component: FeeSearchComponent},
  {path:'checkPrice', component: CheckPriceComponent},
  {path:'waybill-fee-reg', component: WaybillFeeRegComponent},
  {path:'accountReceivable', component: AccountReceivableComponent},
  {path:'accountPayable', component: AccountPayableComponent},
  {path:'transFee', component: TransFeeComponent},
  {path:'feeRegInquNew', component: FeeRegInquNewComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeRegRoutingModule { }
