import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractManageRoutingModule } from './contract-manage-routing.module';
import {ContractTransComponent} from './contract-trans/contract-trans.component';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {ShareModule} from '../../../common/share/share.module';
import {ContractSalesComponent} from './contract-sales/contract-sales.component';

@NgModule({
  imports: [
    CommonModule,
    ContractManageRoutingModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
    ShareModule
  ],
  declarations: [
    ContractTransComponent,
    ContractSalesComponent
  ]
})
export class ContractManageModule { }
