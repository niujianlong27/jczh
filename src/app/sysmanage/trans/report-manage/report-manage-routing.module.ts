import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TraceReportComponent} from './trace-report/trace-report.component';
import {DespatchReportComponent} from './despatch-report/despatch-report.component';
import {LoginLogReportComponent} from './login-log-report/login-log-report.component';

const routes: Routes = [
  {path:'',redirectTo:'traceReport'},
  {path:'trace',component:TraceReportComponent},
  {path:'despatch',component:DespatchReportComponent},
  {path:'loginLog',component:LoginLogReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManageRoutingModule { }
