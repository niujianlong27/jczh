import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BiddingEntrustedComponent} from './bidding-entrusted/bidding-entrusted.component';
import {BiddingManageComponent} from './bidding-manage/bidding-manage.component';
import {BiddingEvaluateComponent} from './bidding-evaluate/bidding-evaluate.component';
import {GradEntrustedComponent} from './grad-entrusted/grad-entrusted.component';
import {GradEvaluateComponent} from './grad-evaluate/grad-evaluate.component';
import {GradManageComponent} from './grad-manage/grad-manage.component';
import {StayManagementComponent} from './stayManagement/stay-management/stay-management.component';
import {StayManagementItemComponent} from './stayManagement/stay-management-item/stay-management-item.component';
import { DeliveryNoticeComponent } from './delivery-notice/delivery-notice.component';


const routes: Routes = [
  {path:'', redirectTo:'BiddingEntrusted'},
  {path:'BiddingEntrusted',component: BiddingEntrustedComponent},
  {path:'BiddingManage',component: BiddingManageComponent},
  {path:'BiddingEvaluate',component: BiddingEvaluateComponent},
  {path:'GradEntrusted',component: GradEntrustedComponent},
  {path:'GradEvaluate',component: GradEvaluateComponent},
  {path:'GradManage',component: GradManageComponent},
  {path:'StayManage',component: StayManagementComponent},
  {path:'StayManageItem',component: StayManagementItemComponent},
  {path:'deliveryNotice',component: DeliveryNoticeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiddingRoutingModule { }
