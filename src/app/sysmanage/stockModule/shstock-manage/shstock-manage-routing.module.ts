import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { WeighingRecordComponent } from './weighing-record/weighing-record.component';
import { FlatAccountComponent } from './flat-account/flat-account.component';
import { ShstockInfoComponent } from './shstock-info/shstock-info.component';
import { ShstockInComponent } from './shstock-in/shstock-in.component';
import { ShstockInAddComponent } from './shstock-in-add/shstock-in-add.component';
import { ShstockAddDetailComponent } from './shstock-add-detail/shstock-add-detail.component';
import { BulkcargoOutComponent } from './bulkcargo-out/bulkcargo-out.component';
import { BulkcargoOutAddComponent } from './bulkcargo-out-add/bulkcargo-out-add.component';


const routes: Routes = [
  {path: '', redirectTo: 'shstockInfo'},
  {path: 'weighingRecord', component: WeighingRecordComponent},
  {path: 'flatAccount', component: FlatAccountComponent},
  {path: 'shstockInfo', component: ShstockInfoComponent},
  {path: 'shstockIn', component: ShstockInComponent},
  {path: 'shstockInAdd', component: ShstockInAddComponent},
  {path: 'shstockAddDetail', component: ShstockAddDetailComponent},
  {path: 'bulkcargoOut', component: BulkcargoOutComponent},
  {path: 'bulkcargoOutAdd', component: BulkcargoOutAddComponent},

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShstockManageRoutingModule{
}
