import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppVersionComponent} from './app-version/app-version.component';
import {AppInterfaceComponent} from './app-interface/app-interface.component';
import {AppRoleComponent} from './app-role/app-role.component';
import {AppUserComponent} from './app-user/app-user.component';
import {AppPermissionComponent} from './app-permission/app-permission.component';

const routes: Routes = [
  {
    path: 'appVersion', component: AppVersionComponent
  },
  {
    path: 'appInterface', component: AppInterfaceComponent
  },
  {
    path: 'appRole', component: AppRoleComponent
  },
  {
    path: 'appUser', component: AppUserComponent
  },
  {
    path: 'appPermission', component: AppPermissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppManageRoutingModule {
}
