import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';
import { UseraddComponent } from './useradd/useradd.component';
const routes: Routes = [
   {path:'', redirectTo:'list'},
   {path: 'list', component: UserlistComponent},
   {path: 'add', component: UseraddComponent, data: {noReuse: true}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManageRoutingModule { }
