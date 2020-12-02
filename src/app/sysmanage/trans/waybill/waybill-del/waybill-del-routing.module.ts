import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaybillDelOneComponent } from './waybill-del-one/waybill-del-one.component';


const routes: Routes = [
  {path:'', redirectTo:'waybill'},
  {path: 'waybill_del', component: WaybillDelOneComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaybillRoutingModule { }
