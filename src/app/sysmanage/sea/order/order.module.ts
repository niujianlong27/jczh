import { NgModule } from '@angular/core';
import { OrderComponent } from './order/order.component';
import { OrderRoutingModule } from './order-routing.module';
import { ShareModule } from '../../../common/share/share.module';
import { TableFormModule } from '../common/table-form/table-form.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { OrderDispatchComponent } from './order-dispatch/order-dispatch.component';

@NgModule({
  imports: [
    OrderRoutingModule,
    ShareModule,
    TableFormModule,
    TplButtonsModule,
    SearchformModule
  ],
  declarations: [OrderComponent, OrderDispatchComponent]
})
export class OrderModule { }
