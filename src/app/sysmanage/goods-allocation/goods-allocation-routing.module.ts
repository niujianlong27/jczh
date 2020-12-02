import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'goods-allocation', loadChildren: './goods-allocation-manage/goods-allocation-manage.module#GoodsAllocationManageModule' }, // 销售开单
      { path: 'repertory-search', loadChildren: './repertory-search/repertory-search.module#RepertorySearchModule' },
      { path: 'base-information', loadChildren: './base-information/base-information.module#BaseInformationModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsAllocationRoutingModule { }
