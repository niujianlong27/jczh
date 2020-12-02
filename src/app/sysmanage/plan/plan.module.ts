import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPageModule } from "../../components/common-page/common-page.module";
import { InputModalModule } from "../../components/input-modal/input-modal.module";
import { ModalModule } from "../../components/modal/modal.module";
import { TableFormModule } from "../../components/table-form/table-form.module";
import { SearchformModule } from "../../components/searchform/searchform.module";
import { TplButtonsModule } from "../../components/tpl-buttons/tpl-buttons.module";
import { PlanRoutingModule } from './plan-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonPageModule,
    InputModalModule,
    ModalModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    PlanRoutingModule
  ]
})
export class PlanModule { 
  
}
