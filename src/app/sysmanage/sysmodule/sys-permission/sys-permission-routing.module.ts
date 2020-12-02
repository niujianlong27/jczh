import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleUserComponent } from './role-user/role-user.component';
import { RolePermissionComponent } from "./role-permission/role-permission.component";
import { RolePermissionNewComponent } from "./role-permission-new/role-permission-new.component";
import { RoleManageComponent } from './role-manage/role-manage.component';
import { RolePermissionColComponent } from './role-permission-col/role-permission-col.component';
import {AppUserComponent} from './app-user/app-user.component';
import { BusiUserComponent } from './busi-user/busi-user.component';
import { BidderLimitComponent } from './bidder-limit/bidder-limit.component';



const routes: Routes = [
  {path:'',redirectTo:'roleUser'},
  { path: 'roleUser', component: RoleUserComponent},
  { path: 'rolePermission', component: RolePermissionComponent },
  { path: 'rolePermissionNew', component: RolePermissionNewComponent },
  { path: 'role', component: RoleManageComponent },
  { path: 'roleColumn', component: RolePermissionColComponent },
  { path: 'appUser', component: AppUserComponent },
  { path: 'busiUser', component: BusiUserComponent },
  { path: 'bidderLimit', component: BidderLimitComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysPermissionRoutingModule { }
