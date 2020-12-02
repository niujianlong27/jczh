 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerCarrierComponent } from './owner-carrier/owner-carrier.component';
import { SeaCompanyAddComponent } from './sea-company-add/sea-company-add.component';
import { SeaUserAddComponent } from './sea-user-add/sea-user-add.component';
import { SeaBasicHarborAddComponent } from './sea-basic-harbor-add/sea-basic-harbor-add.component';
import { CarrierListComponent } from './carrier/carrier-list.component';
import { CarrierAddComponent } from './carrier/carrier-add.component';
import { ShipListComponent } from './ship/ship-list.component';
import { ShipAddComponent } from './ship/ship-add.component';
const routes: Routes = [
  {path:'', redirectTo:'sea-company-add'},
  {path:'sea-company-add', component: SeaCompanyAddComponent},
  {path:'owner-carrier', component: OwnerCarrierComponent},
  {path:'sea-user-add', component: SeaUserAddComponent},
  {path:'sea-basic-harbor-add', component: SeaBasicHarborAddComponent},
  {path:'sea-ship', component: ShipListComponent},
  {path:'ship-add', component: ShipAddComponent},
  {path:'carrier-list',component:CarrierListComponent},
  {path:'carrier-add',component:CarrierAddComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicInfoRoutingModule { }
