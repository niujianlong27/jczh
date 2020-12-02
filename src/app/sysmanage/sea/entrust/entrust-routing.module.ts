 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublishEntrustComponent } from './publish-entrust/publish-entrust.component';
import { AppraiseBidComponent } from './appraise-bid/appraise-bid.component';
import { BidRecordComponent } from './bid-record/bid-record.component';
import { BidRecord2Component } from './bid-record2/bid-record2.component';
const routes: Routes = [
  {path:'', redirectTo:'publishEntrust'},
  
  {path:'publishEntrust',component: PublishEntrustComponent}, // 发布竞价单
  {path:'participateBid2',component: BidRecordComponent}, // 竞价出价
  {path:'participateBid',component: BidRecord2Component}, // 竞价出价
  {path:'appraiseBid',component: AppraiseBidComponent}, // 竞价评选

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrustRoutingModule { }
