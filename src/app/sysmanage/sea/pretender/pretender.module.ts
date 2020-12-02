import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PretenderRoutingModule } from './pretender-routing.module';

import { PrebidComponent } from './prebid/prebid.component';
import { PrebidRecordComponent } from './prebid-record/prebid-record.component';
import { PretenderPublishComponent } from './pretender-publish/pretender-publish.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { TableFormModule } from '../common/table-form/table-form.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

import { ShareModule } from '../../../common/share/share.module';
import { PalletAddComponent } from './pallet-add/pallet-add.component';
import { PrebidRecord2Component } from './prebid-record2/prebid-record2.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    PretenderRoutingModule,
    NgZorroAntdModule,
    InputModalModule,
    TableFormModule,
    TplButtonsModule,
    SearchformModule,
    InputNumberModule
  ],
  declarations: [
    PrebidComponent, 
    PrebidRecordComponent, 
    PretenderPublishComponent, 
    PalletAddComponent, PrebidRecord2Component,
  ],
  entryComponents: [
    PalletAddComponent,
  ]
})
export class PretenderModule { }
