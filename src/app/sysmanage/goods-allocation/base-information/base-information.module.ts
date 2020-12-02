import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSetComponent } from './product-set/product-set.component';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { BaseInformationRoutingModule} from '../base-information/base-information-routing.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ProductSetComponent],
  imports: [
    CommonModule,
    BaseInformationRoutingModule,
    TableFormModule,
    TplButtonsModule,
    SearchformModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,

  ]
})
export class BaseInformationModule { }
