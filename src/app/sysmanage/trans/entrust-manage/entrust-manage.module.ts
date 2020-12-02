import { NgModule } from '@angular/core';

import { ENgxPrintModule } from "../../../components/e-ngx-print/e-ngx-print.module";

import { EntrustManageRoutingModule } from './entrust-manage-routing.module';
import { AddEntrustComponent } from './add-entrust/add-entrust.component';
import { PublishEntrustComponent } from './publish-entrust/publish-entrust.component';
import { ParticipateBidComponent } from './participate-bid/participate-bid.component';
import { AppraiseBidComponent } from './appraise-bid/appraise-bid.component';
import { ShareModule } from '../../../common/share/share.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { EntrustScheduleComponent } from './entrust-schedule/entrust-schedule.component';
import { EntrustInfoComponent } from './entrust-info/entrust-info.component';
import { ScheduleInfoComponent } from './schedule-info/schedule-info.component';
import { ModalModule } from "../../../components/modal/modal.module";
import { EntrustAddComponent } from './entrust-add/entrust-add.component';
import {GridResizeModule} from "../../../components/grid-resize/grid-resize.module";
import { ScheduleCheckInComponent } from './schedule-check-in/schedule-check-in.component';
import { AddOldPlanComponent } from './add-old-plan/add-old-plan.component';
import { InputPopModule } from '../../../components/input-pop/input-pop.module';
import { ScheduleInfoCdgcComponent } from './schedule-info-cdgc/schedule-info-cdgc.component';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { OutboundOrderQueryComponent } from './outbound-order-query/outbound-order-query.component';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';

@NgModule({
  imports: [
    EntrustManageRoutingModule,
    ShareModule,
    TableFormModule,
    InputModalModule,
    TplButtonsModule,
    SearchformModule,
    ModalModule,
    GridResizeModule,
    InputPopModule,
    ENgxPrintModule,
  ],
  declarations: [AddEntrustComponent, PublishEntrustComponent, ParticipateBidComponent, AppraiseBidComponent, EntrustScheduleComponent, EntrustInfoComponent, ScheduleInfoComponent, EntrustAddComponent, ScheduleCheckInComponent, AddOldPlanComponent, ScheduleInfoCdgcComponent, SalesStockComponent, AddScheduleComponent, OutboundOrderQueryComponent, NewVehicleComponent]
})
export class EntrustManageModule { }
