import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueRoutingModule } from './queue-routing.module';
import { DealqueryComponent } from './dealquery/dealquery.component';
import { EntryKindComponent } from './entry-kind/entry-kind.component';
import { ParasettingComponent } from './parasetting/parasetting.component';
import { SynerrComponent } from './synerr/synerr.component';
import { TransqueryComponent } from './transquery/transquery.component';
import { VehicleFindComponent } from './vehicle-find/vehicle-find.component';
import { VehiclequeueComponent } from './vehiclequeue/vehiclequeue.component';
import { WarehouseRequiredComponent } from './warehouse-required/warehouse-required.component';
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { ShareModule } from '../../../common/share/share.module';
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";
import { IncomingqueryComponent } from './incomingquery/incomingquery.component';
import { WarehousequeryComponent } from './warehousequery/warehousequery.component';

@NgModule({
  declarations: [DealqueryComponent, EntryKindComponent, ParasettingComponent, SynerrComponent, TransqueryComponent, VehicleFindComponent, VehiclequeueComponent, WarehouseRequiredComponent, IncomingqueryComponent, WarehousequeryComponent],
  imports: [
    CommonModule,
    QueueRoutingModule,
    CommonPageModule,
    TableFormModule,
    ShareModule,
    NgZorroAntdModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    TplButtonsModule,
    InputNumberModule
  ]
})
export class QueueModule { }
