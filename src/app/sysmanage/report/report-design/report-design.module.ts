import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportDesignRoutingModule} from './report-design-routing.module';
import {RcvReportCountComponent} from './rcv-report-count/rcv-report-count.component';
import {ShareModule} from '../../../common/share/share.module';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import { PayableReportCountComponent } from './payable-report-count/payable-report-count.component';
import { PaymentStatisticsComponent } from './payment-statistics/payment-statistics.component';
import { CollectionStatisticsComponent } from './collection-statistics/collection-statistics.component';
import { InvoicingStatisticsComponent } from './invoicing-statistics/invoicing-statistics.component';
import { PaymentInvReportComponent } from './payment-inv-report/payment-inv-report.component';
import { OrderStatisticsComponent } from './order-statistics/order-statistics.component';
import { WaybillStatisticsComponent } from './waybill-statistics/waybill-statistics.component';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';

import { TableFormModule } from '../../../components/table-form/table-form.module';
import { BusinessProfitReportComponent } from './business-profit-report/business-profit-report.component';

@NgModule({
  imports: [
    CommonModule,
    ReportDesignRoutingModule,
    ShareModule,
    CommonPageModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
  ],
  declarations: [RcvReportCountComponent, PayableReportCountComponent, PaymentStatisticsComponent, CollectionStatisticsComponent, InvoicingStatisticsComponent, PaymentInvReportComponent, OrderStatisticsComponent, WaybillStatisticsComponent, BusinessProfitReportComponent]
})
export class ReportDesignModule {
}
