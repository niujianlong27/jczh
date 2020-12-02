import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanManageRoutingModule } from './plan-manage-routing.module';
import {ShipDemandComponent} from './ship-demand/ship-demand.component';
import {ShipAllocateComponent} from './ship-allocate/ship-allocate.component';
import {ShipDispatchComponent} from './ship-dispatch/ship-dispatch.component';
import {ShipWorkComponent} from './ship-work/ship-work.component';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {ShareModule} from '../../../common/share/share.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import {InputNumberModule} from '../../../components/input-number/input-number.module';
import {ShipAllocateAddComponent} from './ship-allocate-add/ship-allocate-add.component';
import {ShipStowageComponent} from './ship-stowage/ship-stowage.component';
import {ShipDemandAddComponent} from './ship-demand-add/ship-demand-add.component';
import {DayDeliverComponent} from './day-deliver/day-deliver.component';
import {WeekDeliverComponent} from './week-deliver/week-deliver.component';

const components = [
  ShipDemandComponent,
  ShipAllocateComponent,
  ShipDispatchComponent,
  ShipWorkComponent,
  ShipPlanComponent,
  ShipAllocateAddComponent,
  ShipStowageComponent,
  ShipDemandAddComponent,
  DayDeliverComponent,
  WeekDeliverComponent

];

@NgModule({
  imports: [
    CommonModule,
    PlanManageRoutingModule,
    SearchformModule,
    TableFormModule,
    TplButtonsModule,
    ShareModule,
    InputModalModule,
    InputNumberModule
  ],
  declarations: [...components]
})
export class PlanManageModule { }
