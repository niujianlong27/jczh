import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManageRoutingModule } from './user-manage-routing.module';
import { UserlistComponent } from './userlist/userlist.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ModalModule } from '@component/modal';
import { UseraddComponent } from './useradd/useradd.component';
import { CommonPageModule } from '@component/common-page';
import { InputModalModule } from '@component/input-modal/input-modal.module';
import { CompanyChoiceModule } from '@component/company-choice/company-choice.module';
import {TableFormModule} from '@component/table-form/table-form.module';

@NgModule({
  imports: [
    CommonModule,
    UserManageRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPageModule,
    ModalModule,
    InputModalModule,
    CompanyChoiceModule,
    TableFormModule
  ],
  providers: [],
  declarations: [UserlistComponent, UseraddComponent]
})
export class UserManageModule { }
