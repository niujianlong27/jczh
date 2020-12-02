import {NgModule} from '@angular/core';
import {WaybillAddComponent} from './waybill-add/waybill-add.component';
import {WaybillComponent} from './waybill/waybill.component';
import {WaybillRoutingModule} from './waybill-routing.module';
import {ShareModule} from '../../../common/share/share.module';
import {SimplePageFormModule} from '../../../components/simple-page/simple-page-form.module';
import {WaybillDelModule} from './waybill-del/waybill-del.module';



@NgModule({
  imports: [
    ShareModule,
    WaybillRoutingModule,
    SimplePageFormModule,
    WaybillDelModule,
  ],
  declarations: [
    WaybillAddComponent,
    WaybillComponent,
  ]
})
export class WaybillModule {
}
