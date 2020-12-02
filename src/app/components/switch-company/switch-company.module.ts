import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { SwitchCompanyComponent } from './switch-company.component';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],
  declarations: [SwitchCompanyComponent],
  exports: [SwitchCompanyComponent]
})
export class SwitchCompanyModule { }
