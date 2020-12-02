import { NgModule } from '@angular/core';
import { TableForm2Component } from './table-form2.component';

import { ShareModule } from '../../common/share/share.module';
import { PaginationModule } from '../pagination/pagination.module';
import { InputModalModule } from '../input-modal/input-modal.module';

import { InputNumberModule } from '../input-number/input-number.module';


@NgModule({
  imports: [

    ShareModule,
    PaginationModule,
    InputModalModule,
    InputNumberModule

  ],
  declarations: [TableForm2Component],
  exports: [TableForm2Component]
})
export class TableForm2Module { }
