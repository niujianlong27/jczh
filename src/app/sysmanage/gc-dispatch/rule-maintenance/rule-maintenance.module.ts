import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleMaintenanceRoutingModule } from './rule-maintenance-routing.module';
import { MaintenanceOfTheNumberOfIncomingVehiclesComponent } from './maintenance-of-the-number-of-incoming-vehicles/maintenance-of-the-number-of-incoming-vehicles.component';
import { TimeoutRuleMaintenanceComponent } from './timeout-rule-maintenance/timeout-rule-maintenance.component';
import {CommonPageModule} from '@component/common-page';
import {NzButtonModule} from 'ng-zorro-antd';
import {ShareModule} from '@share/share.module';

@NgModule({
  declarations: [MaintenanceOfTheNumberOfIncomingVehiclesComponent, TimeoutRuleMaintenanceComponent],
    imports: [
        CommonModule,
        RuleMaintenanceRoutingModule,
        CommonPageModule,
        NzButtonModule,
        ShareModule
    ]
})
export class RuleMaintenanceModule { }
