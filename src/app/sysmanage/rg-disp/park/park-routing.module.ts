import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StparkComponent} from './stpark/stpark.component';
import {ZhparkComponent} from './zhpark/zhpark.component';
import {TdparkComponent} from './tdpark/tdpark.component';
const routes: Routes = [
  {path: '', redirectTo: 'stpark'},
  {path: 'stpark', component: StparkComponent},
  {path: 'zhpark', component: ZhparkComponent},
  {path: 'tdpark', component: TdparkComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkRoutingModule { }
