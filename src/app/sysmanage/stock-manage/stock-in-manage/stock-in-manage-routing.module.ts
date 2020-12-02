import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockInPlannedRegistrationComponent } from './stock-in-planned-registration/stock-in-planned-registration.component';
import { StockInRegistrationComponent } from './stock-in-registration/stock-in-registration.component';
import { StoreMoveCheckComponent } from './store-move-check/store-move-check.component';
import { StoreMoveManageComponent } from './store-move-manage/store-move-manage.component';
import { CheckManageComponent } from './check-manage/check-manage.component';
import { CheckInfoComponent } from './check-info/check-info.component';
import { StockInManageComponent } from './stock-in-manage/stock-in-manage.component';
import { StockOutPlannedRegistrationComponent } from './stock-out-planned-registration/stock-out-planned-registration.component';
import { StockManageComponent } from './stock-manage/stock-manage.component';
import { StoreOutManageComponent } from './store-out-manage/store-out-manage.component';
import { StockOutRegistrationComponent } from './stock-out-registration/stock-out-registration.component';


const routes: Routes = [
  {path: '', redirectTo: ''},
  {path: 'stockInPlannedRegistration', component: StockInPlannedRegistrationComponent},
  {path: 'stockInPlanned', component: StockInRegistrationComponent},
  {path: 'storeMoveCheck', component: StoreMoveCheckComponent},
  {path: 'storeMoveManage', component: StoreMoveManageComponent},
  {path: 'checkManage', component: CheckManageComponent},
  {path: 'checkInfo', component: CheckInfoComponent},
  {path: 'stockInManage', component: StockInManageComponent},
  {path: 'stockOutPlannedRegistration', component: StockOutPlannedRegistrationComponent},
  {path: 'stockManage', component: StockManageComponent},
  { path: 'storeOutManage', component: StoreOutManageComponent },
  { path: 'stockOutRegistration', component: StockOutRegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockInManageRoutingModule { }
