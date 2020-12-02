import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchformComponent } from './searchform.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModalModule } from '../input-modal/input-modal.module';

import { InputNumberModule } from '../input-number/input-number.module';
import { MutiSearchModule } from '../muti-search/muti-search.module';
import { ShowTimePipe } from './show-time.pipe';
import { GridDataModule } from '@pipe/grid-data.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    InputModalModule,
    InputNumberModule,
    MutiSearchModule,
    GridDataModule
  ],
  declarations: [SearchformComponent, ShowTimePipe],
  exports: [SearchformComponent]
})
export class SearchformModule { }
