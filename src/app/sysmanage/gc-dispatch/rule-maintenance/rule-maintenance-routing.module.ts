import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MaintenanceOfTheNumberOfIncomingVehiclesComponent} from './maintenance-of-the-number-of-incoming-vehicles/maintenance-of-the-number-of-incoming-vehicles.component';
import {TimeoutRuleMaintenanceComponent} from './timeout-rule-maintenance/timeout-rule-maintenance.component';

const routes: Routes = [
  {path: 'maintenanceOfTheNumberOfIncomingVehicles', component: MaintenanceOfTheNumberOfIncomingVehiclesComponent},
  {path: 'timeoutRuleMaintenance', component: TimeoutRuleMaintenanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleMaintenanceRoutingModule {
}
