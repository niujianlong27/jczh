import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanComponent } from './plan/plan.component';
import { PlanVehicleComponent } from './plan-vehicle/plan-vehicle.component';
import { PlanUpdateComponent } from './plan-update/plan-update.component';
import { ScheduleManageComponent } from './schedule-manage/schedule-manage.component';
import { DeliveryNoticeComponent } from './delivery-notice/delivery-notice.component';
import { SplitCargoComponent } from './split-cargo/split-cargo.component';
import {SplitCargoTraceComponent} from './split-cargo-trace/split-cargo-trace.component';
import {AllocateGoodsComponent} from './allocate-goods/allocate-goods.component';
import {NoticeStockInfoComponent} from './notice-stock-info/notice-stock-info.component';
import {AllocateGoodsAddComponent} from './allocate-goods-add/allocate-goods-add.component';

const routes: Routes = [
   {path:'', redirectTo:'plan'},
   {path: 'plan', component: PlanComponent},
   {path: 'plan-vehicle', component: PlanVehicleComponent},
   {path: 'plan-update', component: PlanUpdateComponent},
   {path: 'scheduleManage',component:ScheduleManageComponent},
   {path: 'deliveryNotice',component:DeliveryNoticeComponent},
   {path: 'spitCargo',component:SplitCargoComponent},
   {path: 'spitCargoTrace',component:SplitCargoTraceComponent},
   {path:'allocateGoods',component:AllocateGoodsComponent},
   {path:'noticeStockInfo',component:NoticeStockInfoComponent},
   {path:'allocateGoodsAdd',component:AllocateGoodsAddComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManageRoutingModule {
}
