import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleRoutingModule } from './rule-routing.module';
import { MessagemanageComponent } from './messagemanage/messagemanage.component';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";


import { ShareModule } from '../../../common/share/share.module';



import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { CodesetComponent } from './codeset/codeset.component';
import { RulemaintainComponent } from './rulemaintain/rulemaintain.component';
import { RulecarsComponent } from './rulecars/rulecars.component';
import { TimeoutComponent } from './timeout/timeout.component';
import { MatkindComponent } from './matkind/matkind.component';
import { ParkTimeoutComponent } from './park-timeout/park-timeout.component';
import { RgDispManageComponent } from './rg-disp-manage/rg-disp-manage.component';

@NgModule({
  declarations: [MessagemanageComponent, CodesetComponent, RulemaintainComponent, RulecarsComponent, TimeoutComponent, MatkindComponent, ParkTimeoutComponent, RgDispManageComponent],
  imports: [
    CommonModule,
    RuleRoutingModule,
    CommonPageModule,
    TableFormModule,
    ShareModule,
    NgZorroAntdModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    SearchformModule,
    TplButtonsModule,
    InputNumberModule
  ]
})
export class RuleModule { }
