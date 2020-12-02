import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineNavComponent } from './line-nav.component';
import { NzIconModule, NzTabsModule  } from 'ng-zorro-antd';
@NgModule({
  declarations: [LineNavComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzTabsModule
  ],
  exports: [LineNavComponent]
})
export class LineNavModule { }
