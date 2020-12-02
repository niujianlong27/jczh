import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeoutsetComponent } from './timeoutset/timeoutset.component';
import {SetconfigureComponent} from './setconfigure/setconfigure.component';
import {RuleCarsComponent} from './rule-cars/rule-cars.component';
import {CodesetComponent} from './codeset/codeset.component';
import { MatkindComponent } from './matkind/matkind.component';
import { QueueruleComponent } from './queuerule/queuerule.component';
import { WarehousestowComponent } from './warehousestow/warehousestow.component';
import { UsertruckComponent } from './usertruck/usertruck.component';
import { CompanytruckComponent } from './companytruck/companytruck.component';
import { VendorComponent } from './vendor/vendor.component';
import {DriverUnbindComponent} from './driver-unbind/driver-unbind.component';

const routes: Routes = [
  {path:'', redirectTo:'timeoutset'},
  {path: 'timeoutset', component: TimeoutsetComponent},
  {path: 'setconfigure', component:SetconfigureComponent},
  {path: 'ruleCars', component: RuleCarsComponent},

  {path: 'codeset', component:CodesetComponent},

  {path: 'queueRule', component:QueueruleComponent},

  {path: 'matkind',component:MatkindComponent},
  {path:'warehousestow',component:WarehousestowComponent},

  {path: 'userTruck', component:UsertruckComponent},

  {path: 'companytruck', component:CompanytruckComponent},
  {path: 'vendor', component:VendorComponent},
  {path: 'driverunbind', component: DriverUnbindComponent}

];
@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class RuleRoutingModule { }
