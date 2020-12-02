import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TableFormModule } from '../../../components/table-form/table-form.module';

import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';

import { RepertorySearchRoutingModule } from './repertory-search-routing.module';
import { SelectProductComponent } from './select-product/select-product.component';
import { ModalModule } from "../../../components/modal/modal.module";
import { StockInComponent } from './stock-in/stock-in.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import {GridResizeModule} from "../../../components/grid-resize/grid-resize.module";
import { StockInAddComponent } from './stock-in-add/stock-in-add.component';
import { StockOutComponent } from './stock-out/stock-out.component';

@NgModule({
  declarations: [SelectProductComponent, StockInComponent, StockInAddComponent, StockOutComponent],
  imports: [
    CommonModule,
    RepertorySearchRoutingModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
    ModalModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    GridResizeModule,
  ]
})
export class RepertorySearchModule { }
