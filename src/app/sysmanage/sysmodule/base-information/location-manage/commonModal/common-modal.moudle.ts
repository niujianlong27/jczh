import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzFormModule, NzInputModule, NzInputNumberModule, NzRadioModule, NzSelectModule, NzGridModule } from 'ng-zorro-antd'; 
import { CommonModalComponent } from './common-modal.component';
@NgModule({
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSelectModule,
    NzGridModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CommonModalComponent],
  exports: [CommonModalComponent]
})

export class CommonModalModule {}