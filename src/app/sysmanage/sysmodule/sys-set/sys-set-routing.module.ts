import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterfaceComponent } from './interface/interface.component';
import { MenusComponent } from './menus/menus.component';
import { QueryConditionComponent } from './query-condition/query-condition.component';
import { RowComponent } from './row/row.component';
import { ButtonComponent } from './button/button.component';
import { StaticDataComponent } from './static-data/static-data.component';
import { PlatformPermissonComponent } from './platform-permisson/platform-permisson.component';
import { CompanyPermissionComponent } from './company-permission/company-permission.component';
import { CompanyPermissionAddComponent } from './company-permission-add/company-permission-add.component';
import { CompanyPermissionAddNewComponent } from './company-permission-add-new/company-permission-add-new.component';
import { CompanyPermissionNewComponent } from './company-permission-new/company-permission-new.component';
import { FeeManageComponent } from './fee-manage/fee-manage.component';
import { TransportComponent } from './transport/transport.component';
import { PlatformaPermissonAddComponent } from './platforma-permisson-add/platforma-permisson-add.component';
import { AppSetupComponent } from './app-setup/app-setup.component';
import { ApprovalConfigComponent } from './approval-config/approval-config.component';
import { BlackListComponent } from './black-list/black-list.component';
import { MessagePublishComponent } from './message-publish/message-publish.component';

const routes: Routes = [
  { path: '', redirectTo: 'interfaceSet' },
  { path: 'interfaceSet', component: InterfaceComponent },
  { path: 'menusSet', component: MenusComponent },
  { path: 'queryCondition', component: QueryConditionComponent },
  { path: 'button', component: ButtonComponent },
  { path: 'row', component: RowComponent },
  { path: 'staticData', component: StaticDataComponent },
  { path: 'bizformPermisson', component: PlatformPermissonComponent },
  { path: 'bizformPermissonAdd', component: PlatformaPermissonAddComponent },
  { path: 'companyPermission', component: CompanyPermissionComponent },
  { path: 'companyPermissionAdd', component: CompanyPermissionAddComponent, data: { noReuse: true } },
  { path: 'companyPermissionAddNew', component: CompanyPermissionAddNewComponent },
  { path: 'companyPermissionNew', component: CompanyPermissionNewComponent },
  { path: 'feeManage', component: FeeManageComponent },
  { path: 'transport', component: TransportComponent },
  { path: 'appSetup', component: AppSetupComponent },
  { path: 'approvalConfig', component: ApprovalConfigComponent },
  { path: 'blackList', component: BlackListComponent },
  { path: 'messagePublish', component: MessagePublishComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysSetRoutingModule { }
