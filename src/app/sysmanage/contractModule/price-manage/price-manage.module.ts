import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceManageRoutingModule } from './price-manage-routing.module';
import {PriceLineComponent} from './price-line/price-line.component';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';
import {ShareModule} from '../../../common/share/share.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import {InputNumberModule} from '../../../components/input-number/input-number.module';

@NgModule({
  imports: [
    CommonModule,
    PriceManageRoutingModule,
    SearchformModule,
    TableFormModule,
    TplButtonsModule,
    ShareModule,
    InputModalModule,
    InputNumberModule
  ],
  declarations: [PriceLineComponent]
})
export class PriceManageModule { }
