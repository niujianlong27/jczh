import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleAppointmentRoutingModule } from './vehicle-appointment-routing.module';
import { ReservationComponent } from './reservation/reservation.component';
import {CommonPageModule} from '@component/common-page';
import {ShareModule} from '@share/share.module';

@NgModule({
  declarations: [ReservationComponent],
  imports: [
    CommonModule,
    VehicleAppointmentRoutingModule,
    CommonPageModule,
    ShareModule
  ]
})
export class VehicleAppointmentModule { }
