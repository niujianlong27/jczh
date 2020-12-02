import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BerthUseAnalysisComponent} from './berth-use-analysis/berth-use-analysis.component';
import {ForkliftEntryAndExitTimeComponent} from './forklift-entry-and-exit-time/forklift-entry-and-exit-time.component';
import {AnalysisReportComponent} from './analysis-report/analysis-report.component';
import { VehicleShortageComponent } from './vehicle-shortage/vehicle-shortage.component';
import { StoptimeEfficiencyComponent } from './stoptime-efficiency/stoptime-efficiency.component';
import { BoatDataStatisticsComponent } from './boat-data-statistics/boat-data-statistics.component';
import { ShipBerthingDeparturePlanComponent } from './ship-berthing-departure-plan/ship-berthing-departure-plan.component';
import { ThroughputGoodsStatisticsComponent } from './throughput-goods-statistics/throughput-goods-statistics.component';
import { CabinEfficiencyComponent } from './cabin-efficiency/cabin-efficiency.component';
import { WaterElectricityComponent } from './water-electricity/water-electricity.component';

const routes: Routes = [
  {path:'',redirectTo:'forkliftEntryAndExitTime'},
  {path:'berthUseAnalysis',component:BerthUseAnalysisComponent},
  {path:'forkliftEntryAndExitTime',component:ForkliftEntryAndExitTimeComponent},
  {path:'analysisReport',component:AnalysisReportComponent},
  {path:'vehicleShortage',component:VehicleShortageComponent},
  {path:'stoptimeEfficiency',component:StoptimeEfficiencyComponent},
  {path:'boatDataStatistics',component:BoatDataStatisticsComponent},
  {path:'shipBerthingDeparturePlan',component:ShipBerthingDeparturePlanComponent},
  {path:'throughputGoodsStatistics',component:ThroughputGoodsStatisticsComponent},
  {path:'cabinEfficiency',component:CabinEfficiencyComponent},
  {path:'waterElectricity',component:WaterElectricityComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortReportRoutingModule { }
