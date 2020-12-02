import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {SchedulingPlanComponent} from './scheduling-plan/scheduling-plan.component';
import {JobPlanComponent} from './job-plan/job-plan.component';
import {ShipLoadingComponent} from './ship-loading/ship-loading.component';
import {ShippingOrderComponent} from './shipping-order/shipping-order.component';
import {LoadingShipWorkComponent} from './loading-ship-work/loading-ship-work.component';
import {LoadingShipWorkAddComponent} from './loading-ship-work-add/loading-ship-work-add.component';
import { DispatchPlanComponent } from './dispatch-plan/dispatch-plan.component';
import { DispatchPlanAddComponent } from './dispatch-plan-add/dispatch-plan-add.component';
import { DispatchAddPathComponent } from './dispatch-add-path/dispatch-add-path.component';

const routes: Routes = [
  {path: '', redirectTo: 'shipPlan'},
  {path: 'shipPlan', component: ShipPlanComponent},  //船舶计划
  {path: 'schedulingPlan', component: SchedulingPlanComponent}, // 调度计划
  {path: 'jobPlan', component: JobPlanComponent}, //作业计划
  {path: 'shipLoading', component: ShipLoadingComponent}, //船舶配载
  {path: 'shippingOrder', component: ShippingOrderComponent}, //装船顺序
  {path: 'loadingShipWork', component :LoadingShipWorkComponent},//装船作业计划
  {path: 'loadingShipWorkAdd', component :LoadingShipWorkAddComponent},//装船作业计划添加  修改
  {path: 'dispatchPlan', component :DispatchPlanComponent},//派车计划
  {path: 'dispatchPlanAdd', component :DispatchPlanAddComponent},//派车计划新增
  {path: 'dispatchAddPath', component :DispatchAddPathComponent},//派车计划新增跳转
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentPlanManageRoutingModule {
}
