import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBlockComponent } from './button-block.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  declarations: [ButtonBlockComponent],
  exports: [ButtonBlockComponent]
})
export class ButtonBlockModule { }
