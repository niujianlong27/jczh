import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PretenderManageRoutingModule } from './pretender-manage-routing.module';

import { PrebidComponent } from './prebid/prebid.component';
import { PrebidRecordComponent } from './prebid-record/prebid-record.component';
import { PretenderPublishComponent } from './pretender-publish/pretender-publish.component';
import { PretenderPalletAddComponent } from './pretender-pallet-add/pretender-pallet-add.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

import {CommonPageModule} from '../../../components/common-page/common-page.module';
import { PriceComponent } from './price/price.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PretenderManageRoutingModule,
    NgZorroAntdModule,
    InputModalModule,
    TableFormModule,
    TplButtonsModule,
    SearchformModule,
    InputNumberModule,
    CommonPageModule,
    GridResizeModule,

  ],
  declarations: [PrebidComponent, PrebidRecordComponent, PretenderPublishComponent, PretenderPalletAddComponent, PriceComponent]
})
export class PretenderManageModule { }
