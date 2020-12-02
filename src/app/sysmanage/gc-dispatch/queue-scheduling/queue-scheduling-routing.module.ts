import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IncomingManagementComponent} from './incoming-management/incoming-management.component';
import {OutcomingManagementComponent} from './outcoming-management/outcoming-management.component';
import {AppointmentBigScreenComponent} from './appointment-big-screen/appointment-big-screen.component';

const routes: Routes = [
  {path: 'incomingManagement', component: IncomingManagementComponent},
  {path: 'OutcomingManagement', component: OutcomingManagementComponent},
  {path: 'appointmentBigScreen', component: AppointmentBigScreenComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueSchedulingRoutingModule {
}
