import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManageRoutingModule } from './report-manage-routing.module';
import { NgxEchartsModule }  from 'ngx-echarts';
import { TraceReportComponent } from './trace-report/trace-report.component';
import { DespatchReportComponent } from './despatch-report/despatch-report.component';
import { LoginLogReportComponent } from './login-log-report/login-log-report.component';
import {ShareModule} from '../../../common/share/share.module';
import {TableFormModule} from '../../../components/table-form/table-form.module';
import {SearchformModule} from '../../../components/searchform/searchform.module';
import {TplButtonsModule} from '../../../components/tpl-buttons/tpl-buttons.module';


@NgModule({
  imports: [
    CommonModule,
    ReportManageRoutingModule,
    NgxEchartsModule,
    ShareModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule
  ],
  declarations: [
    TraceReportComponent,
    DespatchReportComponent,
    LoginLogReportComponent
  ]
})
export class ReportManageModule { }
