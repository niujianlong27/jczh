import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShipmentPlanManageRoutingModule} from './shipment-plan-manage-routing.module';
import {ShipPlanComponent} from './ship-plan/ship-plan.component';
import {ShareModule} from '../../../common/share/share.module';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import {SchedulingPlanComponent} from './scheduling-plan/scheduling-plan.component';
import {ShipLoadingComponent} from './ship-loading/ship-loading.component';
import {ShippingOrderComponent} from './shipping-order/shipping-order.component';
import {JobPlanComponent} from './job-plan/job-plan.component';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {LoadingShipWorkComponent} from './loading-ship-work/loading-ship-work.component';
import {LoadingShipWorkAddComponent} from './loading-ship-work-add/loading-ship-work-add.component';
import {ModalModule} from '../../../components/modal/modal.module';
import {GridResizeModule} from '../../../components/grid-resize/grid-resize.module';
import {DispatchPlanComponent} from './dispatch-plan/dispatch-plan.component';
import {DispatchPlanAddComponent} from './dispatch-plan-add/dispatch-plan-add.component';
import {DispatchAddPathComponent} from './dispatch-add-path/dispatch-add-path.component';


@NgModule({
  declarations: [
    ShipPlanComponent,
    SchedulingPlanComponent,
    ShipLoadingComponent,
    ShippingOrderComponent,
    JobPlanComponent,
    LoadingShipWorkComponent,
    LoadingShipWorkAddComponent,
    DispatchPlanComponent,
    DispatchPlanAddComponent,
    DispatchAddPathComponent
  ],
  imports: [
    CommonModule,
    ShipmentPlanManageRoutingModule,
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
export class ShipmentPlanManageModule {
}
