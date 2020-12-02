import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaybillAddComponent } from './waybill-add/waybill-add.component';
import { WaybillComponent } from './waybill/waybill.component';
import {WaybillDelModule} from './waybill-del/waybill-del.module';


const routes: Routes = [
   {path:'', redirectTo:'waybill'},
   {path: 'waybill', component: WaybillComponent},
   {path: 'waybill-add', component: WaybillAddComponent},
   {path: 'waybill-del', component: WaybillDelModule},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaybillRoutingModule { }
