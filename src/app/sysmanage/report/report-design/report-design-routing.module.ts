import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RcvReportCountComponent} from './rcv-report-count/rcv-report-count.component';
import { PayableReportCountComponent } from './payable-report-count/payable-report-count.component';
import { CollectionStatisticsComponent } from './collection-statistics/collection-statistics.component';
import { PaymentStatisticsComponent } from './payment-statistics/payment-statistics.component';
import { InvoicingStatisticsComponent } from './invoicing-statistics/invoicing-statistics.component';
import { PaymentInvReportComponent } from './payment-inv-report/payment-inv-report.component';
import { OrderStatisticsComponent } from './order-statistics/order-statistics.component';
import { WaybillStatisticsComponent } from './waybill-statistics/waybill-statistics.component';
import { BusinessProfitReportComponent } from './business-profit-report/business-profit-report.component';

const routes: Routes = [
  {path: '', redirectTo: 'rcvReportCount'},
  {path: 'rcvReportCount', component: RcvReportCountComponent},
  {path: 'payableReportCount', component: PayableReportCountComponent},
  {path: 'collectionStatistics', component: CollectionStatisticsComponent},
  {path: 'paymentStatistics', component: PaymentStatisticsComponent},
  {path: 'invoicingStatistics', component: InvoicingStatisticsComponent},
  {path: 'paymentInvReport', component: PaymentInvReportComponent},
  {path: 'orderStatistics', component: OrderStatisticsComponent},
  {path: 'waybillStatistics', component: WaybillStatisticsComponent},
  {path: 'businessProfitReport', component: BusinessProfitReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportDesignRoutingModule {
}
