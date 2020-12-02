import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TplButtonsModule } from '../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../components/searchform/searchform.module';
import { TableFormModule } from '../../components/table-form/table-form.module';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
  ],
  declarations: []
})
export class ReportModule { }
