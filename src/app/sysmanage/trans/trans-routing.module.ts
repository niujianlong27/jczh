import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*后台模块路由*/
const routes: Routes = [
  {
    path: '',
    children: [
      { path:'waybill',loadChildren: './waybill/waybill.module#WaybillModule' },// 运单 已废弃
      { path:'waybill-manage',loadChildren: './waybill-manage/waybill-manage.module#WaybillManageModule' },// 运单
      { path:'plan-manage',loadChildren: './plan-manage/plan-manage.module#PlanManageModule' },// 调度
      { path:'trans-plan-manage',loadChildren: './trans-plan-manage/trans-plan-manage.module#TransPlanManageModule' },// 计划
      { path:'order-manage',loadChildren: './order-manage/order-manage.module#OrderManageModule' },// 委托
      { path:'entrust-manage',loadChildren: './entrust-manage/entrust-manage.module#EntrustManageModule' },// 待委托资源
      { path:'report-manage',loadChildren: './report-manage/report-manage.module#ReportManageModule' },// 运输报表
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransRoutingModule { }
