import { NgModule } from '@angular/core';
import { TableTestComponent } from './table-test.component';

import { ShareModule } from '../../common/share/share.module';
import { PaginationModule } from '../pagination/pagination.module';
import { InputModalModule } from '../input-modal/input-modal.module';

import { InputNumberModule } from '../input-number/input-number.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [

    ShareModule,
    PaginationModule,
    InputModalModule,
    InputNumberModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [TableTestComponent],
  exports: [TableTestComponent]
})
export class TableTestModule { }
