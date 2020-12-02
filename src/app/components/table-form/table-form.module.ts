import { NgModule } from '@angular/core';

import { TableFormComponent } from './table-form.component';
import { ShareModule } from '@share/share.module';
import { PaginationModule } from '@component/pagination/pagination.module';
import { InputModalModule } from '@component/input-modal/input-modal.module';
import { InputNumberModule } from '@component/input-number/input-number.module';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FilterDataPipe } from './filterData.pipe';
@NgModule({
  imports: [
    ShareModule,
    PaginationModule,
    InputModalModule,
    InputNumberModule,
    ScrollDispatchModule
  ],
  declarations: [TableFormComponent, FilterDataPipe],
  exports: [TableFormComponent]
})
export class TableFormModule { }
