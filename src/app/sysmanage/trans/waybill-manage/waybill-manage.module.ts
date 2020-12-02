import { NgModule } from '@angular/core';
import { WaybillAddComponent } from './waybill-add/waybill-add.component';
import { WaybillComponent } from './waybill/waybill.component';
import { WaybillManageRoutingModule } from './waybill-manage-routing.module';
import { ShareModule } from '../../../common/share/share.module';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SelectModule } from '../../../components/simple-page/simple-page-form.module';
import { WaybillImportComponent } from './waybill-import/waybill-import.component';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { WaybillReturnComponent } from './waybill-return/waybill-return.component';
import {DepositNoticeComponent} from "./deposit-notice/deposit-notice.component";
import {DepositOutsideComponent} from "./deposit-outside/deposit-outside.component";
import { DepositUpkeepComponent } from './deposit-upkeep/deposit-upkeep.component';
import { WaybillPackCheckComponent } from './waybill-pack-check/waybill-pack-check.component';
import { WaybillNewComponent } from './waybill-new/waybill-new.component';
import { GridResizeModule } from '../../../components/grid-resize/grid-resize.module';
import { ImgViewerModule } from '../../../components/img-viewer/img-viewer';
import { DepositOrderManageOutComponent } from './deposit-order-manage-out/deposit-order-manage-out.component';
import { WaybillLoadMarkQueryComponent } from './waybill-load-mark-query/waybill-load-mark-query.component';
import { WaybillDelComponent } from './waybill-del/waybill-del.component';
import { WaybillDelOneComponent } from './waybill-del-one/waybill-del-one.component';
import { WaybillDelTwoComponent } from './waybill-del-two/waybill-del-two.component';
import { WaybillMatchingComponent } from './waybill-matching/waybill-matching.component';
import { LoadameterAddComponent } from './loadameter-add/loadameter-add.component';
import { WaybillReconciliationComponent } from './waybill-reconciliation/waybill-reconciliation.component';
import { LoadameterComponent } from './loadameter/loadameter.component';
import { WaybillCheckReconciliationComponent } from './waybill-check-reconciliation/waybill-check-reconciliation.component';
import { WaybillFilingComponent } from './waybill-filing/waybill-filing.component';
import { WaybillBookComponent } from './waybill-book/waybill-book.component';
import { WaybillLedgerComponent } from './waybill-ledger/waybill-ledger.component';
import { SaleSettlementComponent } from './sale-settlement/sale-settlement.component';
import { SalesSettlementLedgerComponent } from './sales-settlement-ledger/sales-settlement-ledger.component';
import { WaybillTransportComponent } from './waybill-transport/waybill-transport.component';
import { TrackReportComponent } from './track-report/track-report.component';
import { ModalModule } from "../../../components/modal/modal.module";
import { DepositOutsideNewComponent } from './deposit-outside-new/deposit-outside-new.component';
import { WaybillSettleNewComponent } from './waybill-settle-new/waybill-settle-new.component';

@NgModule({
  imports: [
    ShareModule,
    WaybillManageRoutingModule,
    CommonPageModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
    SelectModule,
    InputModalModule,
    GridResizeModule,
    ImgViewerModule,
    ModalModule,
  ],
  declarations: [
    WaybillAddComponent,
    WaybillComponent,
    WaybillImportComponent,
    WaybillReturnComponent,
    DepositNoticeComponent,
    DepositOutsideComponent,
    DepositUpkeepComponent,
    WaybillPackCheckComponent,
    WaybillNewComponent,
    DepositOrderManageOutComponent,
    WaybillLoadMarkQueryComponent,
    WaybillDelComponent,
    WaybillDelOneComponent,
    WaybillDelTwoComponent,
    WaybillMatchingComponent,
    WaybillReconciliationComponent,
    LoadameterAddComponent,
    LoadameterComponent,
    WaybillCheckReconciliationComponent,
    WaybillFilingComponent,
    WaybillBookComponent,
    WaybillLedgerComponent,
    SalesSettlementLedgerComponent,
    SaleSettlementComponent,
    SalesSettlementLedgerComponent,
    WaybillTransportComponent,
    TrackReportComponent,
    DepositOutsideNewComponent,
    WaybillSettleNewComponent,
  ]
})
export class WaybillManageModule { }
