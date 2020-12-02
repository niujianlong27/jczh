import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path:'base-information',loadChildren: '../stock-manage/base-information/base-information.module#BaseInformationModule' },
      { path:'stock-in-manage',loadChildren: './stock-in-manage/stock-in-manage.module#StockInManageModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockManageRoutingModule { }
