import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationManageComponent } from './location-manage.component';
import { StandPointManageComponent } from './stand-point-manage/stand-point-manage.component';
import { UnstandPointManageComponent } from './unstand-point-manage/unstand-point-manage.component';
const routes: Routes = [
  {path: '', component: LocationManageComponent},
  {path: 'standPointManage', component: StandPointManageComponent},
  {path: 'unstandPointManage', component: UnstandPointManageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationManageRoutingModule { }
