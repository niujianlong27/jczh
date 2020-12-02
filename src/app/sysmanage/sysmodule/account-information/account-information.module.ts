import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountInformationRoutingModule } from './account-information-routing.module';
import { PersonInformationComponent } from './person-information/person-information.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { OperationLogComponent } from './operation-log/operation-log.component';
import { CommonPageModule } from '@component/common-page';
import { CompanyChoiceModule } from '@component/company-choice/company-choice.module';

const component = [
  PersonInformationComponent
]

@NgModule({
  imports: [
    CommonModule,
    AccountInformationRoutingModule,
    CommonPageModule,
    CompanyChoiceModule
  ],
  declarations: [...component, LoginLogComponent, OperationLogComponent]
})
export class AccountInformationModule { }
