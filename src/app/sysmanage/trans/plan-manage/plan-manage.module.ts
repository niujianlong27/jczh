import { NgModule } from '@angular/core';
import { PlanComponent } from './plan/plan.component';
import { PlanVehicleComponent } from './plan-vehicle/plan-vehicle.component';
import { ShareModule } from '../../../common/share/share.module';
import { PlanManageRoutingModule } from './plan-manage-routing.module';
import { SelectModule } from '../../../components/simple-page/simple-page-form.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { PlanUpdateComponent } from './plan-update/plan-update.component';
import { PlanItemAddComponent } from './plan-item-add/plan-item-add.component';
import { PlanItemAddServiceComponent } from './plan-item-add-service/plan-item-add-service.component';
import { ScheduleManageComponent } from './schedule-manage/schedule-manage.component';
import { DeliveryNoticeComponent } from './delivery-notice/delivery-notice.component';
import { SplitCargoComponent } from './split-cargo/split-cargo.component';
import { SplitCargoTraceComponent } from './split-cargo-trace/split-cargo-trace.component';
import { AllocateGoodsComponent } from './allocate-goods/allocate-goods.component';
import { ModalModule } from "../../../components/modal/modal.module";
import { NoticeStockInfoComponent } from './notice-stock-info/notice-stock-info.component';
import { AllocateGoodsAddComponent } from './allocate-goods-add/allocate-goods-add.component';
import { CommonPageModule } from "../../../components/common-page/common-page.module";
import { GridResizeModule } from '../../../components/grid-resize/grid-resize.module';
@NgModule({
  imports: [
    ShareModule,
    PlanManageRoutingModule,
    SelectModule,
    TableFormModule,
    InputModalModule,
    SearchformModule,
    TplButtonsModule,
    ModalModule,
    CommonPageModule,
    GridResizeModule
  ],
  declarations: [PlanComponent,
    PlanVehicleComponent,
    PlanUpdateComponent,
    PlanItemAddComponent,
    PlanItemAddServiceComponent,
    ScheduleManageComponent,
    DeliveryNoticeComponent,
    SplitCargoComponent,
    SplitCargoTraceComponent,
    AllocateGoodsComponent,
    NoticeStockInfoComponent,
    AllocateGoodsAddComponent],

  entryComponents: [PlanItemAddComponent]
})
export class PlanManageModule { }
