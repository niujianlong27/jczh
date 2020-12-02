import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: 'queueScheduling', loadChildren: './queue-scheduling/queue-scheduling.module#QueueSchedulingModule'},
  {path: 'ruleMaintenance', loadChildren: './rule-maintenance/rule-maintenance.module#RuleMaintenanceModule'},
  {path: 'vehicleAppointment', loadChildren: './vehicle-appointment/vehicle-appointment.module#VehicleAppointmentModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GcDispatchRoutingModule {
}
