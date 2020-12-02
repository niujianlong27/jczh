import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryqueueRoutingModule } from './entryqueue-routing.module';
import { VehiclequeueComponent } from './vehiclequeue/vehiclequeue.component';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { VehiclequeueFgComponent } from './vehiclequeue-fg/vehiclequeue-fg.component';
import { TableFormModule } from '../../../components/table-form/table-form.module';

import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import { ShareModule } from '../../../common/share/share.module';



import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SearchformModule } from '../../../components/searchform/searchform.module';
import { VehicleDivideComponent } from './vehicle-divide/vehicle-divide.component';
import { WarehouseRequiredComponent } from './warehouse-required/warehouse-required.component';
import { VehicleFindComponent } from './vehicle-find/vehicle-find.component';
import { EntryKindComponent } from './entry-kind/entry-kind.component';
import { TransqueryComponent } from './transquery/transquery.component';
import { JgwlqueueComponent } from './jgwlqueue/jgwlqueue.component';
import { SynerrComponent } from './synerr/synerr.component';
import { ParasettingComponent } from './parasetting/parasetting.component';
import { DealqueryComponent } from './dealquery/dealquery.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { QRCodeModule } from 'angular2-qrcode'
@NgModule({
  declarations: [VehiclequeueComponent, VehiclequeueFgComponent, VehicleDivideComponent,VehicleDivideComponent, WarehouseRequiredComponent, VehicleFindComponent, EntryKindComponent, TransqueryComponent, JgwlqueueComponent, SynerrComponent, ParasettingComponent, DealqueryComponent, DashboardComponent],
  imports: [
    CommonModule,
    EntryqueueRoutingModule,
    CommonPageModule,
    TableFormModule,
    ShareModule,
    NgZorroAntdModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    TplButtonsModule,
    InputNumberModule,
    QRCodeModule
  ]
})
export class EntryqueueModule { }
