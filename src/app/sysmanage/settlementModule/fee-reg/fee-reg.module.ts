import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeeRegRoutingModule } from './fee-reg-routing.module';
import { RegisterComponent } from './register/register.component';
import { FeeSearchComponent } from './fee-search/fee-search.component';
import { CheckPriceComponent } from './check-price/check-price.component';

import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { ModalModule } from '../../../components/modal/modal.module';
//import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { ShareModule } from '../../../common/share/share.module';

import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { WaybillFeeRegComponent } from './waybill-fee-reg/waybill-fee-reg.component';
import { AccountReceivableComponent } from './account-receivable/account-receivable.component';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { GridResizeModule } from '../../../components/grid-resize/grid-resize.module';
import { TransFeeComponent } from './trans-fee/trans-fee.component';
import {ImgViewerModule} from '@component/img-viewer/img-viewer';
import { FeeRegInquNewComponent } from './fee-reg-inqu-new/fee-reg-inqu-new.component';
import {GridBlockModule} from '@component/simple-page/grid-block/grid-block.module';

@NgModule({
  imports: [
    //  CommonModule,
    //  FormsModule,
    //  ReactiveFormsModule,
    FeeRegRoutingModule,
    CommonPageModule,
    ModalModule,
    ShareModule,
    //  NgZorroAntdModule,
    InputModalModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
    GridResizeModule,
    ImgViewerModule,
    GridBlockModule,

  ],
  declarations: [ RegisterComponent, FeeSearchComponent, CheckPriceComponent, WaybillFeeRegComponent, AccountReceivableComponent, AccountPayableComponent, TransFeeComponent, FeeRegInquNewComponent]
})
export class FeeRegModule { }
