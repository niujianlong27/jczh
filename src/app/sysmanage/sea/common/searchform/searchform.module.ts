import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchformComponent } from './searchform.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModalModule } from '../../../../components/input-modal/input-modal.module';

import { InputNumberModule } from '../../../../components/input-number/input-number.module';
import { MutiSearchModule } from '../../../../components/muti-search/muti-search.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    InputModalModule,
    InputNumberModule,
    MutiSearchModule
  ],
  declarations: [SearchformComponent],
  exports: [SearchformComponent]
})
export class SearchformModule { }
