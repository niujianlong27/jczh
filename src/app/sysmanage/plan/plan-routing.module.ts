import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'shipmentPlanManage', loadChildren: './shipment-plan-manage/shipment-plan-manage.module#ShipmentPlanManageModule'},// 装船计划管理
      {path: 'shipUnloadingPlanManage', loadChildren: './ship-unloading-plan-manage/ship-unloading-plan-manage.module#ShipUnloadingPlanManageModule'},// 卸船计划管理
      {path: 'shipToPort', loadChildren: './ship-to-port/ship-to-port.module#ShipToPortModule'},// 船舶报港
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule {
}
