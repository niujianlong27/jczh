import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEntrustComponent } from './add-entrust/add-entrust.component';
import { PublishEntrustComponent } from './publish-entrust/publish-entrust.component';
import { ParticipateBidComponent } from './participate-bid/participate-bid.component';
import { AppraiseBidComponent } from './appraise-bid/appraise-bid.component';
import { EntrustScheduleComponent } from './entrust-schedule/entrust-schedule.component';
import { EntrustInfoComponent } from './entrust-info/entrust-info.component';
import { ScheduleInfoComponent } from './schedule-info/schedule-info.component';
import { EntrustAddComponent } from './entrust-add/entrust-add.component';
import { ScheduleCheckInComponent } from './schedule-check-in/schedule-check-in.component';
import { AddOldPlanComponent } from './add-old-plan/add-old-plan.component';
import { ScheduleInfoCdgcComponent } from './schedule-info-cdgc/schedule-info-cdgc.component';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { OutboundOrderQueryComponent } from './outbound-order-query/outbound-order-query.component';
import { NewVehicleComponent } from './new-vehicle/new-vehicle.component';

const routes: Routes = [
  { path: '', redirectTo: 'addEntrust' },
  { path: 'addEntrust', component: AddEntrustComponent },
  { path: 'publishEntrust', component: PublishEntrustComponent },
  { path: 'participateBid', component: ParticipateBidComponent },
  { path: 'appraiseBid', component: AppraiseBidComponent },
  { path: 'entrustSchedule', component: EntrustScheduleComponent },
  { path: 'entrustInfo', component: EntrustInfoComponent },
  { path: 'scheduleInfo', component: ScheduleInfoComponent },
  { path: 'entrustAdd', component: EntrustAddComponent },
  { path: 'scheduleCheckIn', component: ScheduleCheckInComponent },
  { path: 'addOldPlan', component: AddOldPlanComponent },
  { path: 'scheduleInfoCDGC', component: ScheduleInfoCdgcComponent },
  { path: 'salesStock', component: SalesStockComponent },
  { path: 'scheduleInfoCDGC', component: ScheduleInfoCdgcComponent },
  { path: 'addSchedule', component: AddScheduleComponent },
  { path: 'queryOutbound', component: OutboundOrderQueryComponent },
  { path: 'newVehicle', component: NewVehicleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrustManageRoutingModule { }
