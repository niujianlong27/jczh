import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VehiclequeueComponent} from './vehiclequeue/vehiclequeue.component';
import {VehiclequeueFgComponent} from './vehiclequeue-fg/vehiclequeue-fg.component';
import {VehicleDivideComponent} from './vehicle-divide/vehicle-divide.component';
import {WarehouseRequiredComponent} from './warehouse-required/warehouse-required.component';
import {VehicleFindComponent} from './vehicle-find/vehicle-find.component';
import {EntryKindComponent} from './entry-kind/entry-kind.component';
import {TransqueryComponent} from './transquery/transquery.component';
import {JgwlqueueComponent} from './jgwlqueue/jgwlqueue.component';
import {SynerrComponent} from './synerr/synerr.component';
import {ParasettingComponent} from './parasetting/parasetting.component';
import {DealqueryComponent} from './dealquery/dealquery.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {path:'', redirectTo:'dashboard1'},
  {path:'dashboard1',component: DashboardComponent},
  {path:'vehiclequeue',component: VehiclequeueComponent},
  {path:'vehiclequeueFg',component: VehiclequeueFgComponent},
  {path:'vehicleDivide',component: VehicleDivideComponent},
  {path:'warehouseRequired',component: WarehouseRequiredComponent},
  {path:'vehicleFind',component: VehicleFindComponent},
  {path:'entryKind',component: EntryKindComponent},
  {path:'transquery',component: TransqueryComponent},
  {path:'jgwlqueue',component: JgwlqueueComponent},
  {path:'synerr',component: SynerrComponent},
  {path:'parasetting',component: ParasettingComponent},
  {path:'dealquery',component: DealqueryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryqueueRoutingModule { }
