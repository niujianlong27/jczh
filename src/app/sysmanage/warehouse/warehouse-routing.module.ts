import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
    { path:'entryqueue',loadChildren: './queue/queue.module#QueueModule'},
    { path:'rule',loadChildren: './rules/rule.module#RuleModule' },
    { path: 'warehouse', loadChildren: './warehouse-manage/warehouse-manage.module#WarehouseManageModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
