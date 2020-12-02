import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageComponent } from './message/message.component';
import{ QueueSchedulingComponent } from './queue-scheduling/queue-scheduling.component';
import{ DeliveryQueueComponent } from './delivery-queue/delivery-queue.component';
import{ PickQueueComponent }from './pick-queue/pick-queue.component';
import{ WarehouseSchedulingComponent } from './warehouse-scheduling/warehouse-scheduling.component'
import { TransTaskComponent } from './trans-task/trans-task.component';
import { QueryCarsComponent } from './query-cars/query-cars.component';
import { QuerykindComponent } from './querykind/querykind.component';

const routes: Routes = [
  {path:'', redirectTo:'message'},
  {path: 'message', component: MessageComponent},
  {path:'transtask',component:TransTaskComponent},
  {path:'queryCars',component:QueryCarsComponent},
  {path:'transtask',component:TransTaskComponent},
  {path:'queueQuery',component:QueueSchedulingComponent},
  {path:'deliveryQueue',component:DeliveryQueueComponent},
  {path:'pickQueue',component:PickQueueComponent},
  {path:'warehouseQueue',component:WarehouseSchedulingComponent},
  {path:'transtask',component:TransTaskComponent},
  {path:'querykind',component:QuerykindComponent}, 
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class EntryQueueRoutingModule { }
