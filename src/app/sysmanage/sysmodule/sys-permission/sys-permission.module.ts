import { NgModule } from '@angular/core';

import { ShareModule } from '../../../common/share/share.module';

import { SysPermissionRoutingModule } from './sys-permission-routing.module';
import { RoleUserComponent } from './role-user/role-user.component';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { ModalModule } from '../../../components/modal/modal.module';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { RolePermissionColComponent } from './role-permission-col/role-permission-col.component';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { CompanyChoiceModule } from '../../../components/company-choice/company-choice.module';
import { AppUserComponent } from './app-user/app-user.component';
import { BusiUserComponent } from './busi-user/busi-user.component';
import { BidderLimitComponent } from './bidder-limit/bidder-limit.component';
import { RolePermissionNewComponent } from './role-permission-new/role-permission-new.component';

@NgModule({
  imports: [
    ShareModule,
    SysPermissionRoutingModule,
    SearchformModule,
    TableFormModule,
    ModalModule,
    CommonPageModule,
    TplButtonsModule,
    CompanyChoiceModule
  ],
  declarations: [ RoleUserComponent, RolePermissionComponent, RoleManageComponent, RolePermissionColComponent, AppUserComponent, BusiUserComponent, BidderLimitComponent, RolePermissionNewComponent]
})
export class SysPermissionModule { }
