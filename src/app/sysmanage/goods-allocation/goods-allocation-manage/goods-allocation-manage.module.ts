import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsAllocationManageRoutingModule } from './goods-allocation-manage-routing.module';
import { BillOfLadingComponent } from './bill-of-lading/bill-of-lading.component';

import { ENgxPrintModule } from '../../../components/e-ngx-print/e-ngx-print.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { InputNumberModule} from '@component/input-number/input-number.module';
import {ShareModule} from '@share/share.module';

import { ModalModule } from "../../../components/modal/modal.module";
import { BillOfManageComponent } from './bill-of-manage/bill-of-manage.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module';
import {NgZorroAntdModule, NzFormModule, NzModalModule} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';
import { GoodsTestComponent } from './goods-test/goods-test.component';

@NgModule({
  declarations: [BillOfLadingComponent, BillOfManageComponent, GoodsTestComponent],
  imports: [
    CommonModule,
    GoodsAllocationManageRoutingModule,
    ENgxPrintModule,
    TableFormModule,
    InputModalModule,
    TplButtonsModule,
    SearchformModule,
    GridResizeModule,
    NzFormModule,
    ReactiveFormsModule,
    NzModalModule,
    NgZorroAntdModule,
    ShareModule,
    InputNumberModule,
    ModalModule,
  ]
})
export class GoodsAllocationManageModule { }
