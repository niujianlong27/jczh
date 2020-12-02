import { NgModule } from '@angular/core';

import { ShareModule } from '@share/share.module';
import { CommonPageModule } from '@component/common-page';

import { AppManageRoutingModule } from './app-manage-routing.module';
import { AppVersionComponent } from './app-version/app-version.component';
import { AppInterfaceComponent } from './app-interface/app-interface.component';
import { AppRoleComponent } from './app-role/app-role.component';
import { AppUserComponent } from './app-user/app-user.component';
import { AppPermissionComponent } from './app-permission/app-permission.component';
import {TableFormModule} from '@component/table-form/table-form.module';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';

@NgModule({
  declarations: [AppVersionComponent, AppInterfaceComponent, AppRoleComponent, AppUserComponent, AppPermissionComponent],
  imports: [
    AppManageRoutingModule,
    ShareModule,
    CommonPageModule,
    TableFormModule,
    TplButtonsModule
  ]
})
export class AppManageModule { }
