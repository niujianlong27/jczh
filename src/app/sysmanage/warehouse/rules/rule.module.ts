import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleRoutingModule } from './rule-routing.module';
import { CodesetComponent } from './codeset/codeset.component';
import { MatkindComponent } from './matkind/matkind.component';
import { MessagemanageComponent } from './messagemanage/messagemanage.component';
import { ParkTimeoutComponent } from './park_timeout/park_timeout.component';
import { RgDispManageComponent } from './rg-disp-manage/rg-disp-manage.component';
import { RulecarsComponent } from './rulecars/rulecars.component';
import { RulemaintainComponent } from './rulemaintain/rulemaintain.component';
import { TimeoutComponent } from './timeout/timeout.component';


import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalModule } from "../../../components/modal/modal.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { ShareModule } from '../../../common/share/share.module';
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";


@NgModule({
  declarations: [CodesetComponent, MatkindComponent, MessagemanageComponent, ParkTimeoutComponent, RgDispManageComponent, RulecarsComponent, RulemaintainComponent, TimeoutComponent],
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
    TplButtonsModule
  ]
})
export class RuleModule { }
