import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillOfLadingComponent } from './bill-of-lading/bill-of-lading.component';
import { BillOfManageComponent} from './bill-of-manage/bill-of-manage.component';
import { GoodsTestComponent } from './goods-test/goods-test.component';

const routes: Routes = [
  {path: '', redirectTo: ''},
  { path: 'billOfLading', component: BillOfLadingComponent},
  {path: 'billOfManage', component: BillOfManageComponent},
  {path: 'goodsTest', component: GoodsTestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsAllocationManageRoutingModule { }
