import { NgModule } from '@angular/core';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderComponent } from './order/order.component';
import { ShareModule } from '../../../common/share/share.module';
import { SelectModule } from '../../../components/simple-page/simple-page-form.module';
import { OrderManageRoutingModule } from './order-manage-routing.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { ModalModule } from '../../../components/modal/modal.module';
import { DraftOrderComponent } from './draft-order/draft-order.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import {GridResizeModule} from "../../../components/grid-resize/grid-resize.module";
import { OrderDelComponent } from './order-del/order-del.component';
import {CommonPageModule} from '@component/common-page';
import { FrameAgreementComponent } from './frame-agreement/frame-agreement.component';
import { OutlineAgreementComponent } from './outline-agreement/outline-agreement.component';
import { SupplementaryContractComponent } from './supplementary-contract/supplementary-contract.component';
import { OrderAndItemLMSComponent } from './order-and-item-lms/order-and-item-lms.component';

@NgModule({
  imports: [
    ShareModule,
    OrderManageRoutingModule,
    SelectModule,
    TableFormModule,
    InputModalModule,
    SearchformModule,
    TplButtonsModule,
    ModalModule,
    GridResizeModule,
    CommonPageModule
  ],
  declarations: [OrderAddComponent, OrderComponent, DraftOrderComponent, ContractDetailsComponent, OrderDelComponent, FrameAgreementComponent, OutlineAgreementComponent, SupplementaryContractComponent, OrderAndItemLMSComponent]
})
export class OrderManageModule { }
