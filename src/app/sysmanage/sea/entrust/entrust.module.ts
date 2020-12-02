import { NgModule } from '@angular/core';

import { EntrustRoutingModule } from './entrust-routing.module';
import { PublishEntrustComponent } from './publish-entrust/publish-entrust.component';
import { AppraiseBidComponent } from './appraise-bid/appraise-bid.component';
import { ShareModule } from '../../../common/share/share.module';
import { TableFormModule } from '../common/table-form/table-form.module';
import {InputModalModule} from '../../../components/input-modal/input-modal.module';
import { TplButtonsModule } from '../../../components/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '../../../components/searchform/searchform.module';
import { BidRecordComponent } from './bid-record/bid-record.component';
import { BidRecord2Component } from './bid-record2/bid-record2.component';
@NgModule({
  imports: [
    EntrustRoutingModule,
    ShareModule,
    TableFormModule,
    InputModalModule,
    TplButtonsModule,
    SearchformModule
  ],
  declarations: [PublishEntrustComponent, AppraiseBidComponent, BidRecordComponent, BidRecord2Component]
})
export class EntrustModule { }
