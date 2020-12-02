import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {SchedulingPlanComponent} from './scheduling-plan/scheduling-plan.component';
import {JobPlanComponent} from './job-plan/job-plan.component';

const routes: Routes = [
  {path: '', redirectTo: 'shipPlan'},
  {path: 'shipPlan', component: ShipPlanComponent},
  {path: 'schedulingPlan', component: SchedulingPlanComponent},
  {path: 'jobPlan', component: JobPlanComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipUnloadingPlanManageRoutingModule {
}
