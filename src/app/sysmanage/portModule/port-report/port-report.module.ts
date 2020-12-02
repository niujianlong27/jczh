import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableFormModule} from "../../../components/table-form/table-form.module";
import {TplButtonsModule} from "../../../components/tpl-buttons/tpl-buttons.module";
import {SearchformModule} from "../../../components/searchform/searchform.module";
import {InputModalModule} from "../../../components/input-modal/input-modal.module";
import {ShareModule} from "../../../common/share/share.module";
import {InputNumberModule} from "../../../components/input-number/input-number.module";

import {PortReportRoutingModule} from './port-report-routing.module';
import {BerthUseAnalysisComponent} from './berth-use-analysis/berth-use-analysis.component';
import {ForkliftEntryAndExitTimeComponent} from './forklift-entry-and-exit-time/forklift-entry-and-exit-time.component';
import {AnalysisReportComponent} from './analysis-report/analysis-report.component';
import {VehicleShortageComponent} from './vehicle-shortage/vehicle-shortage.component';
import {StoptimeEfficiencyComponent} from './stoptime-efficiency/stoptime-efficiency.component';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import {BoatDataStatisticsComponent} from './boat-data-statistics/boat-data-statistics.component';
import { ShipBerthingDeparturePlanComponent } from './ship-berthing-departure-plan/ship-berthing-departure-plan.component';
import { ThroughputGoodsStatisticsComponent } from './throughput-goods-statistics/throughput-goods-statistics.component';
import { CabinEfficiencyComponent } from './cabin-efficiency/cabin-efficiency.component';
import { WaterElectricityComponent } from './water-electricity/water-electricity.component';
import {GridResizeModule} from "../../../components/grid-resize/grid-resize.module";


@NgModule({
  declarations: [BerthUseAnalysisComponent, ForkliftEntryAndExitTimeComponent, AnalysisReportComponent, VehicleShortageComponent, StoptimeEfficiencyComponent, BoatDataStatisticsComponent, ShipBerthingDeparturePlanComponent, ThroughputGoodsStatisticsComponent, CabinEfficiencyComponent, WaterElectricityComponent],
  imports: [
    CommonModule,
    SearchformModule,
    TableFormModule,
    TplButtonsModule,
    ShareModule,
    InputModalModule,
    InputNumberModule,
    PortReportRoutingModule,
    CommonPageModule,
    GridResizeModule
  ]
})
export class PortReportModule {
}
