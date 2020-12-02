import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShipToPortComponent} from './ship-to-port/ship-to-port.component';
import {BoatWaterGaugeComponent} from './boat-water-gauge/boat-water-gauge.component';
import {BoatInspectGaugeComponent} from './boat-inspect-gauge/boat-inspect-gauge.component';

const routes: Routes = [
  {path: '', redirectTo: 'shipToPort'},
  {path: 'shipToPort', component: ShipToPortComponent},
  {path: 'boatWaterGauge', component: BoatWaterGaugeComponent},
  {path: 'boatInspectGauge', component: BoatInspectGaugeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipToPortRoutingModule {
}
