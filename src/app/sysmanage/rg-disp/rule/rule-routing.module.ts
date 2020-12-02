import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagemanageComponent } from './messagemanage/messagemanage.component';
import { CodesetComponent } from './codeset/codeset.component';
import { RulemaintainComponent } from './rulemaintain/rulemaintain.component';
import { RulecarsComponent } from './rulecars/rulecars.component';
import { TimeoutComponent } from './timeout/timeout.component';
import { MatkindComponent } from './matkind/matkind.component';
import { ParkTimeoutComponent } from './park-timeout/park-timeout.component';
import { RgDispManageComponent } from './rg-disp-manage/rg-disp-manage.component';
const routes: Routes = [
  {path:'', redirectTo:'messagemanage'},
  {path:'messagemanage',component: MessagemanageComponent},
  {path:'codeset',component: CodesetComponent},
  {path:'rulemaintain',component: RulemaintainComponent},
  {path:'rulecars',component: RulecarsComponent},
  {path:'timeout',component: TimeoutComponent},
  {path:'matkind',component: MatkindComponent},
  {path:'parkTimeout',component: ParkTimeoutComponent},
  {path:'manage',component: RgDispManageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleRoutingModule { }
