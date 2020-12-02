import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MutiSearchComponent } from './muti-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalContentHeightModule } from '@directive/modal-content-height.module';
import {ShareModule} from '@share/share.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ModalContentHeightModule,
    ShareModule
  ],
  declarations: [MutiSearchComponent],
  exports: [MutiSearchComponent]
})
export class MutiSearchModule { }
