import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { DispComponent } from './disp.component';
/*后台模块路由*/
const routes: Routes = [
  {
    path: '',
    component: DispComponent,
    children: [
      { path:'entryqueue',loadChildren: './entryqueue-manage/entryqueue.module#EntryQueueModule' },
      { path:'rule',loadChildren: './rule-manage/rule.module#RuleModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispRoutingModule { }
