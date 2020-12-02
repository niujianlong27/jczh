import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShipDemandComponent} from './ship-demand/ship-demand.component';
import {ShipAllocateComponent} from './ship-allocate/ship-allocate.component';
import {ShipDispatchComponent} from './ship-dispatch/ship-dispatch.component';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {ShipWorkComponent} from './ship-work/ship-work.component';
import {ShipAllocateAddComponent} from './ship-allocate-add/ship-allocate-add.component';
import {ShipStowageComponent} from './ship-stowage/ship-stowage.component';
import {ShipDemandAddComponent} from './ship-demand-add/ship-demand-add.component';
import {DayDeliverComponent} from './day-deliver/day-deliver.component';
import {WeekDeliverComponent} from './week-deliver/week-deliver.component';

const routes: Routes = [
  { path:'',redirectTo:'shipStowage' },
  { path:'shipStowage',component:ShipStowageComponent },
  { path:'shipDemand',component:ShipDemandComponent },
  { path:'shipAllocate',component:ShipAllocateComponent },
  { path:'shipDispatch',component:ShipDispatchComponent },
  { path:'shipPlan',component:ShipPlanComponent },
  { path:'shipWork',component:ShipWorkComponent },
  { path:'shipAllocateInfo',component:ShipAllocateAddComponent },
  { path:'shipDemandAdd',component:ShipDemandAddComponent },
  { path:'dayDeliver',component:DayDeliverComponent },
  { path:'weekDeliver',component:WeekDeliverComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManageRoutingModule { }
