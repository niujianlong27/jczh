import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridBlockComponent } from './grid-block.component';
import { NgZorroAntdModule, } from 'ng-zorro-antd';
import { SelectModule } from '../data-entry/select/public-api';
import { GridRowDirective } from './grid-row.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    SelectModule
  ],
  declarations: [
    GridBlockComponent, 
    GridRowDirective,
  ],
  exports: [
    GridBlockComponent, 
    GridRowDirective, 
  ]
})
export class GridBlockModule { }
