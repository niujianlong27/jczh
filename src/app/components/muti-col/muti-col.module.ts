import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MutiColComponent } from './muti-col.component';
import { ShareModule } from '@share/share.module';
import { ModalContentHeightModule } from '@directive/modal-content-height.module';
@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    ModalContentHeightModule
  ],
  declarations: [MutiColComponent],
  exports: [MutiColComponent]
})
export class MutiColModule { }
