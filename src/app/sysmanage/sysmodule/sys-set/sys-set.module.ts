import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InterfaceComponent} from './interface/interface.component';
import {SysSetRoutingModule} from './sys-set-routing.module';
import {MenusComponent} from './menus/menus.component';
import {SearchformModule} from '@component/searchform/searchform.module';
import {TableFormModule} from '@component/table-form/table-form.module';
import {ModalModule} from '@component/modal';
import {QueryConditionComponent} from './query-condition/query-condition.component';
import {RowComponent} from './row/row.component';
import {ButtonComponent} from './button/button.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StaticDataComponent} from './static-data/static-data.component';
import {PlatformPermissonComponent} from './platform-permisson/platform-permisson.component';
import {CommonPageModule} from '@component/common-page';
import {CompanyPermissionComponent} from './company-permission/company-permission.component';
import {CompanyPermissionAddComponent} from './company-permission-add/company-permission-add.component';
import {FeeManageComponent} from './fee-manage/fee-manage.component';
import {TransportComponent} from './transport/transport.component';
import {InputModalModule} from '@component/input-modal/input-modal.module';
import {PlatformaPermissonAddComponent} from './platforma-permisson-add/platforma-permisson-add.component';
import {AppSetupComponent} from './app-setup/app-setup.component';
import { CompanyPermissionAddNewComponent } from './company-permission-add-new/company-permission-add-new.component';
import { CompanyPermissionNewComponent } from './company-permission-new/company-permission-new.component';

import {ReNztableModule} from '@directive/reNztable.module';
import { ApprovalConfigComponent } from './approval-config/approval-config.component';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
import { BlackListComponent } from './black-list/black-list.component';
import { MessagePublishComponent } from './message-publish/message-publish.component';
@NgModule({
  imports: [
    CommonModule,
    SysSetRoutingModule,
    SearchformModule,
    TableFormModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CommonPageModule,
    InputModalModule,
    ReNztableModule,
    TplButtonsModule,

  ],
  declarations: [InterfaceComponent, MenusComponent, QueryConditionComponent, RowComponent, ButtonComponent, StaticDataComponent, PlatformPermissonComponent, CompanyPermissionComponent, CompanyPermissionAddComponent, FeeManageComponent, TransportComponent, PlatformaPermissonAddComponent, AppSetupComponent, CompanyPermissionAddNewComponent, CompanyPermissionNewComponent, ApprovalConfigComponent, BlackListComponent, MessagePublishComponent]
})
export class SysSetModule {
}
