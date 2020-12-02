import { NgModule } from '@angular/core';
import { RuleRoutingModule } from './rule-routing.module';
import { ShareModule } from '../../../common/share/share.module';
import { RuleComponent } from './rule.component';
import { CommonPageModule } from '../../../components/common-page/common-page.module';
import { TimeoutsetComponent } from './timeoutset/timeoutset.component';
import { ModalModule } from '../../../components/modal/modal.module';
import { SetconfigureComponent } from './setconfigure/setconfigure.component';
import { RuleCarsComponent } from './rule-cars/rule-cars.component';
import { CodesetComponent } from './codeset/codeset.component';
import { MatkindComponent } from './matkind/matkind.component';
import { QueueruleComponent } from './queuerule/queuerule.component';
import { WarehousestowComponent } from './warehousestow/warehousestow.component';
import { UsertruckComponent } from './usertruck/usertruck.component';
import { CompanytruckComponent } from './companytruck/companytruck.component';
import { VendorComponent } from './vendor/vendor.component';
import { DriverUnbindComponent } from './driver-unbind/driver-unbind.component';
import {SearchformModule} from '@component/searchform/searchform.module';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
import {TableFormModule} from '../../sea/common/table-form/table-form.module';
@NgModule({
  imports: [
    ShareModule,
    RuleRoutingModule,
    CommonPageModule,
    ModalModule,
    SearchformModule,
    TplButtonsModule,
    TableFormModule,
  ],
  declarations: [
   RuleComponent,
   TimeoutsetComponent,
   SetconfigureComponent,
   RuleCarsComponent,
   CodesetComponent,
   MatkindComponent,
   QueueruleComponent,
   WarehousestowComponent,
   UsertruckComponent,
   CompanytruckComponent ,
   VendorComponent,
   DriverUnbindComponent ,
  ]

})
export class RuleModule { }
