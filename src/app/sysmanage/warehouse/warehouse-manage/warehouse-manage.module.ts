import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from '../../../components/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { ShareModule } from '../../../common/share/share.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {WarehouseManageRoutingModule} from './warehouse-manage-routing.module';
import { WarehouseConfigComponent } from './warehouse-config/warehouse-config.component';


@NgModule({
  declarations: [WarehouseConfigComponent],
  imports: [
    CommonModule,
    CommonPageModule,
    TableFormModule,
    ShareModule,
    NgZorroAntdModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    TplButtonsModule,
    WarehouseManageRoutingModule,
  ]
})
export class WarehouseManageModule { }
