import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JgwlparkComponent} from './jgwlpark/jgwlpark.component'
import {StparkComponent} from './stpark/stpark.component';
import {ZhparkComponent} from './zhpark/zhpark.component';
const routes: Routes = [
  {path:'', redirectTo:'jgwlpark'},
  {path:'jgwlpark',component: JgwlparkComponent},  // 仓库维护
  {path:'stpark',component: StparkComponent}, // 用户仓库管理
  {path:'zhpark',component: ZhparkComponent}, // 没用
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkRoutingModule { }
