import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { EntryQueueRoutingModule } from './entryqueue-routing.module';
import { ShareModule } from '../../../common/share/share.module';
import { EntryqueueComponent } from './entryqueue.component';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import {QueueSchedulingComponent} from './queue-scheduling/queue-scheduling.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeliveryQueueComponent } from './delivery-queue/delivery-queue.component';
import { PickQueueComponent } from './pick-queue/pick-queue.component';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { WarehouseSchedulingComponent } from './warehouse-scheduling/warehouse-scheduling.component';
import { TransTaskComponent } from './trans-task/trans-task.component';
import { QueryCarsComponent } from './query-cars/query-cars.component';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { QuerykindComponent } from './querykind/querykind.component';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
@NgModule({
  imports: [
    ShareModule,
    EntryQueueRoutingModule,
    CommonPageModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    ModalModule,
    TableFormModule,
    TplButtonsModule,
  ],
  declarations: [
    MessageComponent,
    EntryqueueComponent,
    TransTaskComponent,
    QueryCarsComponent,
    QueueSchedulingComponent,
    DeliveryQueueComponent,
    PickQueueComponent,
    WarehouseSchedulingComponent,
    EntryqueueComponent,
    TransTaskComponent,
    TransTaskComponent,
    QuerykindComponent
  ]
})
export class EntryQueueModule { }
