import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoRoutingModule } from './basic-info-routing.module';
import { OwnerCarrierComponent } from './owner-carrier/owner-carrier.component';
import { ShareModule } from '../../../common/share/share.module';
import { SeaCompanyAddComponent } from './sea-company-add/sea-company-add.component';
import { SeaUserAddComponent } from './sea-user-add/sea-user-add.component';
import { SeaBasicHarborAddComponent } from './sea-basic-harbor-add/sea-basic-harbor-add.component';
import { CarrierListComponent } from './carrier/carrier-list.component';
import { CarrierAddComponent } from './carrier/carrier-add.component';
import { ShipListComponent } from './ship/ship-list.component';
import { ShipAddComponent } from './ship/ship-add.component';

@NgModule({
  imports: [
    CommonModule,
    BasicInfoRoutingModule,
    ShareModule,
  ],
  declarations: [OwnerCarrierComponent, SeaCompanyAddComponent, SeaUserAddComponent, SeaBasicHarborAddComponent,
    CarrierListComponent, CarrierAddComponent, ShipListComponent, ShipAddComponent]
})
export class BasicInfoModule { }
