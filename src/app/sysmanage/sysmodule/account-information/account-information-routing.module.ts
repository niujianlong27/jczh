import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonInformationComponent } from "./person-information/person-information.component";
import { LoginLogComponent } from './login-log/login-log.component';
import { OperationLogComponent } from './operation-log/operation-log.component';

const routes: Routes = [
  { path: '', redirectTo:'personInformation'},
  { path:'personInformation',component:PersonInformationComponent},
  { path:'loginLog',component:LoginLogComponent},
  { path:'operationLog',component:OperationLogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountInformationRoutingModule { }
