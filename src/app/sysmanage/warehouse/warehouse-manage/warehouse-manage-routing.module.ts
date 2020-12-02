import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseConfigComponent } from './warehouse-config/warehouse-config.component';

const routes: Routes = [
  {path: 'warehouseManage', component: WarehouseConfigComponent},  // 仓库维护
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseManageRoutingModule { }
