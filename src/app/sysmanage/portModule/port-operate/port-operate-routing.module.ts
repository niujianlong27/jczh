import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipMentComponent } from './ship-ment/ship-ment.component';
import { TransferTaskComponent } from './transfer-task/transfer-task.component';
import { TransferTaskAddComponent } from './transfer-task-add/transfer-task-add.component';
import { DowntimeCollectComponent } from './downtime-collect/downtime-collect.component';
import { PortalCraneCollectComponent } from './portal-crane-collect/portal-crane-collect.component';
import { OperationTeamComponent } from './operation-team/operation-team.component';
import { ShipCollectComponent } from './ship-collect/ship-collect.component';
import { ShipCollect2Component } from './ship-collect2/ship-collect2.component';
import { ShipConfirmComponent } from './ship-confirm/ship-confirm.component';
import { UnshipCollectComponent } from './unship-collect/unship-collect.component';
import { UnshipConfirmComponent } from './unship-confirm/unship-confirm.component';
import {ForkliftEntryAndExitManageComponent} from './forklift-entry-and-exit-manage/forklift-entry-and-exit-manage.component';
import {ShipDynamicManageComponent} from './ship-dynamic-manage/ship-dynamic-manage.component';
import { CabinEfficiencyMaintainComponent } from './cabin-efficiency-maintain/cabin-efficiency-maintain.component';

const routes: Routes = [
  { path: '', redirectTo: 'shipMent' },
  { path: 'shipMent', component: ShipMentComponent },
  { path: 'transferTask', component: TransferTaskComponent },
  { path: 'transferTaskAdd', component: TransferTaskAddComponent },
  { path: 'downtimeCollect', component: DowntimeCollectComponent },
  { path: 'portalCraneCollect', component: PortalCraneCollectComponent },
  { path: 'operationteam', component: OperationTeamComponent },
  { path: 'shipCollect2', component: ShipCollectComponent },
  { path: 'shipCollect', component: ShipCollect2Component },
  { path: 'shipConfirm', component: ShipConfirmComponent },
  { path: 'unshipCollect', component: UnshipCollectComponent },
  { path: 'unshipConfirm', component: UnshipConfirmComponent },
  {path:'forkliftEntryAndExitManage',component:ForkliftEntryAndExitManageComponent},
  {path:'shipDynamicManage',component:ShipDynamicManageComponent},
  {path:'cabinEfficiencyMaintain',component:CabinEfficiencyMaintainComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortOperateRoutingModule { }
