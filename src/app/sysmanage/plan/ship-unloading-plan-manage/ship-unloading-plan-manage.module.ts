import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShipUnloadingPlanManageRoutingModule} from './ship-unloading-plan-manage-routing.module';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {ShareModule} from '../../../common/share/share.module';
import { SchedulingPlanComponent } from './scheduling-plan/scheduling-plan.component';
import { JobPlanComponent } from './job-plan/job-plan.component';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import { ModalModule } from "../../../components/modal/modal.module";
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {GridResizeModule} from '../../../components/grid-resize/grid-resize.module';

@NgModule({
  declarations: [ShipPlanComponent, SchedulingPlanComponent, JobPlanComponent],
  imports: [
    CommonModule,
    ShipUnloadingPlanManageRoutingModule,
    ShareModule,
    CommonPageModule,
    InputModalModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
    ModalModule,
    GridResizeModule
  ]
})
export class ShipUnloadingPlanManageModule {
}
