import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectService } from './select.service';
import { SelectComponent } from './select.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  exports: [
    SelectComponent
  ],
  declarations: [
    SelectComponent
  ],
  providers: [
    SelectService
  ]
})
export class SelectModule { }
