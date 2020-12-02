import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Searchform2Component } from './searchform2.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModalModule } from '../input-modal/input-modal.module';

import { InputNumberModule } from '../input-number/input-number.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    InputModalModule,
    InputNumberModule
  ],
  declarations: [Searchform2Component],
  exports: [Searchform2Component]
})
export class Searchform2Module { }
