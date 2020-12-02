import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrebidComponent } from './prebid/prebid.component';
import { PrebidRecordComponent } from './prebid-record/prebid-record.component';
import { PretenderPublishComponent } from './pretender-publish/pretender-publish.component';
import { PretenderPalletAddComponent } from './pretender-pallet-add/pretender-pallet-add.component';
import {PriceComponent} from './price/price.component';
const routes: Routes = [
  {path:'', redirectTo:'pretenderPalletAdd'},
  {path:'prebid',component: PrebidComponent},
  {path:'prebidRecord',component: PrebidRecordComponent},
  {path:'pretenderPalletAdd', data: { noReuse: true }, component: PretenderPalletAddComponent},
  {path:'pretenderPublish',component: PretenderPublishComponent},
  {path:'price',component: PriceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PretenderManageRoutingModule { }
