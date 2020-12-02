import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplePageComponent } from './simple-page.component';
import { InquBlockModule } from '../inqu-block/inqu-block.module';
import { ButtonBlockModule } from '../button-block/button-block.module';
import { GridBlockModule } from '../grid-block/grid-block.module';

@NgModule({
  imports: [
    CommonModule,
    InquBlockModule,
    ButtonBlockModule,
    GridBlockModule,
  ],
  declarations: [SimplePageComponent],
  exports: [SimplePageComponent]
})
export class SimplePageModule { }
