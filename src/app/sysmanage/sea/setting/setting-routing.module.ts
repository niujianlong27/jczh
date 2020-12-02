 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { UserSettingComponent } from './user-setting/user-setting.component';
const routes: Routes = [
  {path:'', redirectTo:'user-setting'},
  
  {path:'setting',component: SettingComponent}, // 系统设置
  {path:'user-setting',component: UserSettingComponent}, // 用户系统设置

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
