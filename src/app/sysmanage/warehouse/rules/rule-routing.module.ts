import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagemanageComponent } from './messagemanage/messagemanage.component';
import { CodesetComponent } from './codeset/codeset.component';
import { RulemaintainComponent } from './rulemaintain/rulemaintain.component';
import { RulecarsComponent } from './rulecars/rulecars.component';
import { TimeoutComponent } from './timeout/timeout.component';
import { MatkindComponent } from './matkind/matkind.component';
import { ParkTimeoutComponent } from './park_timeout/park_timeout.component';
const routes: Routes = [
  {path:'', redirectTo:'message'},
  {path:'message',component: MessagemanageComponent}, // 消息管理
  {path:'codeset',component: CodesetComponent},             // 代码维护
  {path:'rulemaintain',component: RulemaintainComponent},   // 排队规则维护
  {path:'rulecars',component: RulecarsComponent},           // 成品入厂车辆数规则维护
  {path:'timeout',component: TimeoutComponent},             // 成品进厂超时处理配置
  {path:'parkTimeout',component: ParkTimeoutComponent},             //  仓库排队超时处理
  {path:'matkind',component: MatkindComponent},     // 成品分类维护

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleRoutingModule { }
