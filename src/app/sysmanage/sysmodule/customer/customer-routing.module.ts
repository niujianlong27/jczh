import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { CustomerAddComponent } from './customer-add/customer-add.component';
const routes: Routes = [
  {path:'',redirectTo: 'list'},
  {path:'list',component:CustomerlistComponent},
  {path:'add',component:CustomerAddComponent, data:{noReuse:true},}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
