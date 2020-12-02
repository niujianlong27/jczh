import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { PortOperateRoutingModule } from './port-operate-routing.module';
import { ShipMentComponent } from './ship-ment/ship-ment.component';
import { ShareModule } from '../../../common/share/share.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { TransferTaskComponent } from './transfer-task/transfer-task.component';
import { TransferTaskAddComponent } from './transfer-task-add/transfer-task-add.component';
import { ModalModule } from "../../../components/modal/modal.module";
import { DowntimeCollectComponent } from './downtime-collect/downtime-collect.component';
import { PortalCraneCollectComponent } from './portal-crane-collect/portal-crane-collect.component';
import { OperationTeamComponent } from './operation-team/operation-team.component';
import { ShipCollectComponent } from './ship-collect/ship-collect.component';
import { ShipCollect2Component } from './ship-collect2/ship-collect2.component';
import { ShipConfirmComponent } from './ship-confirm/ship-confirm.component';
import { UnshipCollectComponent } from './unship-collect/unship-collect.component';
import { UnshipConfirmComponent } from './unship-confirm/unship-confirm.component';
import { EssenceNg2PrintModule } from "essence-ng2-print";
import {ForkliftEntryAndExitManageComponent} from './forklift-entry-and-exit-manage/forklift-entry-and-exit-manage.component';
import { ShipDynamicManageComponent } from './ship-dynamic-manage/ship-dynamic-manage.component';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import {GridResizeModule} from '../../../components/grid-resize/grid-resize.module';
import { CabinEfficiencyMaintainComponent } from './cabin-efficiency-maintain/cabin-efficiency-maintain.component';

const components = [
  ShipMentComponent,
  TransferTaskComponent,
  TransferTaskAddComponent,
  ForkliftEntryAndExitManageComponent
]

@NgModule({
  imports: [
    CommonModule,
    PortOperateRoutingModule,
    ShareModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    InputModalModule,
    InputNumberModule,
    ModalModule,
    FormsModule,
    EssenceNg2PrintModule,
    CommonPageModule,
    GridResizeModule
  ],
  declarations: [...components, TransferTaskComponent, TransferTaskAddComponent, DowntimeCollectComponent, PortalCraneCollectComponent, OperationTeamComponent, ShipCollectComponent, ShipCollect2Component, ShipConfirmComponent, UnshipCollectComponent, UnshipConfirmComponent, ShipDynamicManageComponent, CabinEfficiencyMaintainComponent]
})
export class PortOperateModule { }
