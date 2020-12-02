import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

import { InputNumberComponent } from './input-number.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
   
  ],
  declarations: [InputNumberComponent],
  exports: [ InputNumberComponent ]
})
export class InputNumberModule { }
