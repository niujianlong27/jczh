import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//  后台模块路由
const routes: Routes = [
    {
      path: '',
      children: [
       { path:'entryqueue',loadChildren: './entryqueue/entryqueue.module#EntryqueueModule' },
      { path:'rule',loadChildren: './rule/rule.module#RuleModule' },
      { path:'park',loadChildren: './park/park.module#ParkModule' },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RgDispRoutingModule { }
