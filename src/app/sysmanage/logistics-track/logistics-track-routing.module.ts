import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehiclesShipsComponent } from './vehicles-ships/vehicles-ships.component';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { ShipSearchComponent } from './ship-search/ship-search.component';
import { BusinessSearchComponent } from './business-search/business-search.component';
import { BusinessOverviewComponent } from './business-overview/business-overview.component';
const routes: Routes = [
  {path:'',redirectTo:'vehicleShipsOverview'},
  {path:'vehicleShipsOverview',component:VehiclesShipsComponent},
  {path:'vehicleSearch',component:VehicleSearchComponent},
  {path:'shipSearch',component:ShipSearchComponent},
  {path:'businessOverview',component:BusinessOverviewComponent},
  {path:'businessSearch',component:BusinessSearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogisticsTrackRoutingModule { }
