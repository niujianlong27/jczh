import { NgModule } from '@angular/core';

import { ShareModule } from '../../../common/share/share.module';

import { SelectModule } from '../../../components/simple-page/simple-page-form.module';
import { TableFormModule } from '../../../components/table-form/table-form.module';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import {ScheduleManageComponent} from './schedule-manage/schedule-manage.component';
import { CommonPageModule } from "../../../components/common-page/common-page.module";
import {NoticeStockComponent} from './notice-stock/notice-stock.component';
import {TransPlanManageRoutingModule} from './trans-plan-manage-routing.module';
import { ModelManageComponent } from './model-manage/model-manage.component';
import { BicycleGoodsComponent } from './bicycle-goods/bicycle-goods.component';
import { ModelEverydayManageComponent } from './model-everyday-manage/model-everyday-manage.component';
@NgModule({
  imports: [
    ShareModule,
    SelectModule,
    TableFormModule,
    InputModalModule,
    SearchformModule,
    TplButtonsModule,
    CommonPageModule,
    TransPlanManageRoutingModule,
  ],
  declarations: [  NoticeStockComponent,
                   ScheduleManageComponent,
                   ModelManageComponent,
                   BicycleGoodsComponent,
                   ModelEverydayManageComponent,
  ],

})
export class TransPlanManageModule { }
