import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzFormModule, NzDatePickerModule, NzInputModule, NzGridModule, NzSelectModule, NzModalModule } from 'ng-zorro-antd';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { GridResizeModule } from '@component/grid-resize/grid-resize.module';
import { InputNumberModule } from '@component/input-number/input-number.module';
import {ShareModule} from '@share/share.module';
import { StockInManageRoutingModule } from './stock-in-manage-routing.module';
import { StockInPlannedRegistrationComponent } from './stock-in-planned-registration/stock-in-planned-registration.component';
import { StockInRegistrationComponent } from './stock-in-registration/stock-in-registration.component';
import { StoreMoveCheckComponent } from './store-move-check/store-move-check.component';
import { StoreMoveManageComponent } from './store-move-manage/store-move-manage.component';
import {InputModalModule} from '@component/input-modal/input-modal.module';
import { CheckManageComponent } from './check-manage/check-manage.component';
import { CheckInfoComponent } from './check-info/check-info.component';
import { StockInManageComponent } from './stock-in-manage/stock-in-manage.component';
import { StockOutPlannedRegistrationComponent } from './stock-out-planned-registration/stock-out-planned-registration.component';
import { StockOutRegistrationComponent } from './stock-out-registration/stock-out-registration.component';
import { StockManageComponent } from './stock-manage/stock-manage.component';
import { StoreOutManageComponent } from './store-out-manage/store-out-manage.component';

@NgModule({
  declarations: [
    StockInPlannedRegistrationComponent,
    StockInRegistrationComponent,
    StoreMoveCheckComponent,
    StoreMoveManageComponent,
    StockInManageComponent,
    CheckManageComponent,
    CheckInfoComponent,
    StockOutPlannedRegistrationComponent,
    StockOutRegistrationComponent,
    StockManageComponent,
    StoreOutManageComponent],
  imports: [
    CommonModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzModalModule,
    StockInManageRoutingModule,
    TplButtonsModule,
    TableFormModule,
    SearchformModule,
    InputNumberModule,
    GridResizeModule,
    ShareModule,
    InputModalModule,
  ]
})
export class StockInManageModule { }
