import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkRoutingModule } from './park-routing.module';
import { JgwlparkComponent } from './jgwlpark/jgwlpark.component';
import { ZhparkComponent } from './zhpark/zhpark.component';
import { StparkComponent } from './stpark/stpark.component';


import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { ShareModule } from '../../../common/share/share.module';
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";


@NgModule({
  declarations: [JgwlparkComponent, ZhparkComponent, StparkComponent],
  imports: [
    CommonModule,
    ParkRoutingModule,
    CommonPageModule,
    TableFormModule,
    ShareModule,
    NgZorroAntdModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    TplButtonsModule
  ]
})
export class ParkModule { }
