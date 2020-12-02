import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VehiclequeueComponent} from './vehiclequeue/vehiclequeue.component';
import {WarehouseRequiredComponent} from './warehouse-required/warehouse-required.component';
import {VehicleFindComponent} from './vehicle-find/vehicle-find.component';
import {EntryKindComponent} from './entry-kind/entry-kind.component';
import {TransqueryComponent} from './transquery/transquery.component';
import {SynerrComponent} from './synerr/synerr.component';
import {ParasettingComponent} from './parasetting/parasetting.component';
import {DealqueryComponent} from './dealquery/dealquery.component';
import { WarehousequeryComponent} from './warehousequery/warehousequery.component';
import { IncomingqueryComponent} from './incomingquery/incomingquery.component';

const routes: Routes = [
  {path:'vehiclequeue',component: VehiclequeueComponent},  // 入厂车辆排队调度
  {path:'warehouse',component: WarehouseRequiredComponent}, // 仓库车辆排队调度
  {path:'vehicleFind',component: VehicleFindComponent}, // 成品入厂需求计划
  {path:'entryKind',component: EntryKindComponent}, // 成品仓库需求计划
  {path:'transquery',component: TransqueryComponent}, // 成品运输任务过程查询
  {path:'synerr',component: SynerrComponent}, // 运输任务过程查询
  {path:'parasetting',component: ParasettingComponent}, // 调度参数设置
  {path:'dealquery',component: DealqueryComponent}, // 没用
  {path:'incomquery',component: IncomingqueryComponent}, // 入厂车辆查询
  {path: 'warehousequery',component: WarehousequeryComponent}, // 入库车辆查询
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueRoutingModule { }
