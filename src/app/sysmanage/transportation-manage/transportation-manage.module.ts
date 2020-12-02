import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransportationManageRoutingModule} from './transportation-manage-routing.module';
import {SearchformModule} from "../../components/searchform/searchform.module";
import {TableFormModule} from "../../components/table-form/table-form.module";
import {TplButtonsModule} from "../../components/tpl-buttons/tpl-buttons.module";
import {CommonPageModule} from "../../components/common-page/common-page.module";
import {InputModalModule} from "../../components/input-modal/input-modal.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule} from "../../components/modal/modal.module";
import {NgZorroAntdModule} from "ng-zorro-antd";
import {TransportInquiryComponent} from './transport-inquiry/transport-inquiry.component';

const component = [TransportInquiryComponent]

@NgModule({

  imports: [
    CommonModule,
    TransportationManageRoutingModule,
    CommonPageModule,
    InputModalModule,
    ModalModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule
  ],
  declarations: [...component]
})
export class TransportationManageModule {
}
