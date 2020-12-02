import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WaybillAddComponent} from './waybill-add/waybill-add.component';
import {WaybillComponent} from './waybill/waybill.component';
import {WaybillReturnComponent} from './waybill-return/waybill-return.component';
import {DepositNoticeComponent} from './deposit-notice/deposit-notice.component';
import {DepositOutsideComponent} from './deposit-outside/deposit-outside.component';
import {DepositUpkeepComponent} from './deposit-upkeep/deposit-upkeep.component';
import {WaybillPackCheckComponent} from './waybill-pack-check/waybill-pack-check.component';
import {WaybillNewComponent} from './waybill-new/waybill-new.component';
import {DepositOrderManageOutComponent} from './deposit-order-manage-out/deposit-order-manage-out.component';
import {WaybillLoadMarkQueryComponent} from './waybill-load-mark-query/waybill-load-mark-query.component';
import {WaybillDelComponent} from './waybill-del/waybill-del.component';
import {WaybillDelOneComponent} from './waybill-del-one/waybill-del-one.component';
import {WaybillMatchingComponent} from './waybill-matching/waybill-matching.component';
import {LoadameterAddComponent} from './loadameter-add/loadameter-add.component';
import {LoadameterComponent} from './loadameter/loadameter.component';
import {WaybillReconciliationComponent} from './waybill-reconciliation/waybill-reconciliation.component';
import {WaybillCheckReconciliationComponent} from './waybill-check-reconciliation/waybill-check-reconciliation.component';
import {WaybillFilingComponent} from './waybill-filing/waybill-filing.component';
import {WaybillBookComponent} from './waybill-book/waybill-book.component';
import {WaybillLedgerComponent} from './waybill-ledger/waybill-ledger.component';
import { SaleSettlementComponent } from './sale-settlement/sale-settlement.component';
import { SalesSettlementLedgerComponent } from './sales-settlement-ledger/sales-settlement-ledger.component';
import { WaybillTransportComponent } from './waybill-transport/waybill-transport.component';
import { TrackReportComponent } from './track-report/track-report.component';
import { DepositOutsideNewComponent } from './deposit-outside-new/deposit-outside-new.component';
import {WaybillSettleNewComponent} from './waybill-settle-new/waybill-settle-new.component';

const routes: Routes = [
  {path: '', redirectTo: 'waybill'},
  {path: 'waybill', component: WaybillComponent},
  {path: 'waybill-new', component: WaybillNewComponent},
  {path: 'waybill-add', component: WaybillAddComponent},
  {path: 'loadameter-add', component: LoadameterAddComponent},
  {path: 'waybill-return', component: WaybillReturnComponent},
  {path: 'depositNotice', component: DepositNoticeComponent},
  // {path: 'depositOutside', component: DepositOutsideComponent},
  {path: 'depositUpkeep', component: DepositUpkeepComponent},
  {path: 'waybillPackCheck', component: WaybillPackCheckComponent},
  {path: 'depositOrderManageOut', component: DepositOrderManageOutComponent},
  {path: 'waybillLoadMarkQuery', component: WaybillLoadMarkQueryComponent},
  {path: 'waybillMatching', component: WaybillMatchingComponent},
  {path: 'loadameter', component: LoadameterComponent},
  {path: 'WaybillDelComponent', component: WaybillDelComponent},
  {path: 'WaybillDelOneComponent', component: WaybillDelOneComponent},
  {path: 'waybillReconciliation', component: WaybillReconciliationComponent},
  {path: 'waybillCheckReconciliation', component: WaybillCheckReconciliationComponent},
  {path: 'waybillFiling', component: WaybillFilingComponent},
  {path: 'waybillBook', component: WaybillBookComponent},
  {path: 'waybillLedger', component: WaybillLedgerComponent},
  {path:'salesSettlementLedger',component:SalesSettlementLedgerComponent},
  {path: 'saleSettlement', component: SaleSettlementComponent},
  {path: 'saleSettlementLedger', component: SalesSettlementLedgerComponent},
  {path: 'waybillTransport', component: WaybillTransportComponent},
  {path: 'trackReport', component: TrackReportComponent},
  {path: 'depositOutside', component: DepositOutsideNewComponent},
  {path: 'waybillSettleNew', component: WaybillSettleNewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaybillManageRoutingModule {
}
