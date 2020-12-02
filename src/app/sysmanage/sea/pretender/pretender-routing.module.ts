import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrebidComponent } from './prebid/prebid.component';
import { PrebidRecordComponent } from './prebid-record/prebid-record.component';
import { PrebidRecord2Component } from './prebid-record2/prebid-record2.component';
import { PretenderPublishComponent } from './pretender-publish/pretender-publish.component';
import { PalletAddComponent, CanPalletAddDeactivate } from './pallet-add/pallet-add.component';


const routes: Routes = [
  {path:'', redirectTo:'pretenderPalletAdd'},
  
  // {path:'pretenderPalletAdd',component: PretenderPalletAddComponent}, // 新增货盘
  { path: 'pallet', component: PalletAddComponent}, // 新增货盘
  { path: 'pretenderPalletAdd', component: PalletAddComponent, canDeactivate: [CanPalletAddDeactivate]}, // 新增货盘
  {path:'pretenderPublish',component: PretenderPublishComponent}, // 发布预招标单
  {path:'prebidRecord2',component: PrebidRecordComponent}, // 预投标出价
  {path:'prebidRecord',component: PrebidRecord2Component}, // 预投标出价
  {path:'prebid',component: PrebidComponent}, // 预评标

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanPalletAddDeactivate]
})
export class PretenderRoutingModule { }
