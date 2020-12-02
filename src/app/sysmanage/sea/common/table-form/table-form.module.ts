import { NgModule } from '@angular/core';
import { TableFormComponent } from './table-form.component';

import { ShareModule } from '../../../../common/share/share.module';
import { PaginationModule } from '../../../../components/pagination/pagination.module';
import { InputModalModule } from '../../../../components/input-modal/input-modal.module';

import { InputNumberModule } from '../../../../components/input-number/input-number.module';



@NgModule({
  imports: [

    ShareModule,
    PaginationModule,
    InputModalModule,
    InputNumberModule

  ],
  declarations: [TableFormComponent],
  exports: [TableFormComponent]
})
export class TableFormModule { }
