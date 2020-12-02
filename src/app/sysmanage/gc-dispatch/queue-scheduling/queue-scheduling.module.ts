import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueSchedulingRoutingModule } from './queue-scheduling-routing.module';
import { IncomingManagementComponent } from './incoming-management/incoming-management.component';
import { OutcomingManagementComponent } from './outcoming-management/outcoming-management.component';
import {CommonPageModule} from '@component/common-page';
import {ShareModule} from '@share/share.module';
import {TableFormModule} from '@component/table-form/table-form.module';
import { AppointmentBigScreenComponent } from './appointment-big-screen/appointment-big-screen.component';
import {SearchformModule} from '@component/searchform/searchform.module';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
import {GridBlockModule} from '@component/simple-page/grid-block/grid-block.module';

@NgModule({
  declarations: [IncomingManagementComponent, OutcomingManagementComponent, AppointmentBigScreenComponent],
  imports: [
    CommonModule,
    QueueSchedulingRoutingModule,
    CommonPageModule,
    ShareModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    GridBlockModule
  ]
})
export class QueueSchedulingModule { }
