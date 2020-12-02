 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrderDispatchComponent } from './order-dispatch/order-dispatch.component';
const routes: Routes = [
  {path:'', redirectTo:'order'},
  
  {path:'order',component: OrderComponent}, // 订单查询
  {path:'order-dispatch',component: OrderDispatchComponent}, // 订单调度
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
