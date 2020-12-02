import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModalComponent } from './input-modal.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '@share/share.module';
import { AreaSelectModule } from '../area-select/area-select.module';
import { ModalContentHeightModule } from '@directive/modal-content-height.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    AreaSelectModule,
    ModalContentHeightModule
  ],
  declarations: [InputModalComponent],
  exports: [ CommonModule, InputModalComponent ]
})
export class InputModalModule { }
