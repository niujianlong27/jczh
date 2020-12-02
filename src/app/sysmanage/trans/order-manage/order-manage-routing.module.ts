import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrderComponent} from './order/order.component';
import {OrderAddComponent} from './order-add/order-add.component';
import {DraftOrderComponent} from './draft-order/draft-order.component';
import {ContractDetailsComponent} from './contract-details/contract-details.component';
import {OrderDelComponent} from './order-del/order-del.component';
import {FrameAgreementComponent} from './frame-agreement/frame-agreement.component';
import { OutlineAgreementComponent } from './outline-agreement/outline-agreement.component';
import { SupplementaryContractComponent } from './supplementary-contract/supplementary-contract.component';
import {OrderAndItemLMSComponent} from './order-and-item-lms/order-and-item-lms.component';


const routes: Routes = [
  {path: '', redirectTo: 'order'},
  {path: 'order', component: OrderComponent},
  {path: 'order-add', component: OrderAddComponent},
  {path: 'draftOrder', component: DraftOrderComponent},
  {path: 'contractDetails', component: ContractDetailsComponent},
  {path: 'order-del', component: OrderDelComponent},
  {path: 'frameAgreement', component: FrameAgreementComponent},
  {path: 'outlineAgreement', component: OutlineAgreementComponent},
  {path: 'supplementaryContract', component: SupplementaryContractComponent},
  {path: 'orderAndItemLMS', component: OrderAndItemLMSComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManageRoutingModule {
}
