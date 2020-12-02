import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TplButtonsComponent } from './tpl-buttons.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MutiSearchModule } from '../muti-search/muti-search.module';
import {ShareModule} from '../../common/share/share.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    MutiSearchModule,
    ShareModule
  ],
  declarations: [TplButtonsComponent],
  exports: [CommonModule, TplButtonsComponent]
})
export class TplButtonsModule { }
