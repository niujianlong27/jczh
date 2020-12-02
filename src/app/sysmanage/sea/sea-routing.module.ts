import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*后台模块路由*/
const routes: Routes = [
  {
    path: '',
    children: [
      { path:'basic',loadChildren: './basic-info/basic-info.module#BasicInfoModule' },// 基础信息设置
      { path:'pretender',loadChildren: './pretender/pretender.module#PretenderModule' },// 询价/预招标
      { path:'entrust',loadChildren: './entrust/entrust.module#EntrustModule' },// 待委托资源
      { path:'order',loadChildren: './order/order.module#OrderModule' },// 订单
      { path:'setting',loadChildren: './setting/setting.module#SettingModule' },// 系统设置
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeaRoutingModule { }
