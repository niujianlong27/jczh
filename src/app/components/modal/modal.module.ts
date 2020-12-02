import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalTplComponent } from './modalTpl.component';
import { ModalMapLineComponent } from './modal-map-line/modal-map-line.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ModalFormComponent, ModalConfirmComponent, ModalTplComponent, ModalMapLineComponent],
  exports: [CommonModule, ModalFormComponent, ModalConfirmComponent, ModalTplComponent, ModalMapLineComponent]
})
export class ModalModule { }
