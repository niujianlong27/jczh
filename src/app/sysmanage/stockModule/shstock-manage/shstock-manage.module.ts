import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputModalModule} from "../../../components/input-modal/input-modal.module";
import {InputNumberModule} from "../../../components/input-number/input-number.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonPageModule} from "../../../components/common-page/common-page.module";
import {SearchformModule} from "../../../components/searchform/searchform.module";
import {NgZorroAntdModule} from "ng-zorro-antd";
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";
import {ModalModule} from "../../../components/modal/modal.module";
import {TableFormModule} from "../../../components/table-form/table-form.module";
import {ShstockManageRoutingModule} from "./shstock-manage-routing.module";
import { WeighingRecordComponent } from './weighing-record/weighing-record.component';
import { FlatAccountComponent } from './flat-account/flat-account.component';
import { ShstockInfoComponent } from './shstock-info/shstock-info.component';
import { ShstockInComponent } from './shstock-in/shstock-in.component';
import { ShstockInAddComponent } from './shstock-in-add/shstock-in-add.component';
import { ShstockAddDetailComponent } from './shstock-add-detail/shstock-add-detail.component';
import {BulkcargoOutComponent } from './bulkcargo-out/bulkcargo-out.component';
import { BulkcargoOutAddComponent } from './bulkcargo-out-add/bulkcargo-out-add.component';

@NgModule({
  declarations: [WeighingRecordComponent, FlatAccountComponent, ShstockInfoComponent, ShstockInComponent, ShstockInAddComponent, ShstockAddDetailComponent,BulkcargoOutComponent, BulkcargoOutAddComponent],
  imports: [
    CommonModule,
    ShstockManageRoutingModule,
    CommonPageModule,
    InputModalModule,
    InputNumberModule,
    ModalModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule
  ]
})
export class ShstockManageModule { }
