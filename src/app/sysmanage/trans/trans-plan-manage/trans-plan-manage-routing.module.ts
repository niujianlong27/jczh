import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoticeStockComponent} from './notice-stock/notice-stock.component';
import {ScheduleManageComponent} from './schedule-manage/schedule-manage.component';
import {ModelManageComponent} from './model-manage/model-manage.component';
import {BicycleGoodsComponent} from './bicycle-goods/bicycle-goods.component';
import { ModelEverydayManageComponent } from './model-everyday-manage/model-everyday-manage.component';
const routes: Routes = [
   {path:'', redirectTo:'transPlan'},
   {path: 'notice',component:NoticeStockComponent},
   {path: 'schedule',component:ScheduleManageComponent},
   {path: 'modelManage',component:ModelManageComponent},
   {path: 'bicycleGoods',component:BicycleGoodsComponent},
  {path: 'modelEverydayManage',component:ModelEverydayManageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransPlanManageRoutingModule {
}
