import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridResizeComponent } from './grid-resize.component';
import { NzIconModule } from 'ng-zorro-antd';
import { GridResizeDirective } from './grid-resize.directive';
@NgModule({
  declarations: [GridResizeComponent, GridResizeDirective],
  imports: [
    CommonModule,
    NzIconModule
  ],
  exports: [GridResizeComponent],
})
export class GridResizeModule { }
