import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAmapModule } from 'ngx-amap';

import { LogisticsTrackRoutingModule } from './logistics-track-routing.module';
import { VehiclesShipsComponent } from './vehicles-ships/vehicles-ships.component';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { ShipSearchComponent } from './ship-search/ship-search.component';
import { BusinessOverviewComponent } from './business-overview/business-overview.component';
import { BusinessSearchComponent } from './business-search/business-search.component';
import { ShareModule } from '../../common/share/share.module';
import { CommonPageModule } from '../../components/common-page/common-page.module'
import { SearchformModule } from '../../components/searchform/searchform.module'
import { TableFormModule } from '../../components/table-form/table-form.module'
import { TplButtonsModule } from '../../components/tpl-buttons/tpl-buttons.module'

@NgModule({
  imports: [
    CommonModule,
    LogisticsTrackRoutingModule,
    ShareModule,
    CommonPageModule,
    SearchformModule,
    TableFormModule,
    TplButtonsModule,
    NgxAmapModule.forRoot({
      apiKey: '48c189c4061decc6f998af691e4c1232',
      apiVersion: '1.3'
    })
  ],
  declarations: [VehiclesShipsComponent, VehicleSearchComponent, ShipSearchComponent, BusinessOverviewComponent, BusinessSearchComponent]
})
export class LogisticsTrackModule { }
