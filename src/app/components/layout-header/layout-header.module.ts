import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LayoutHeaderComponent } from './layout-header.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { FullScreenDirective } from '../../common/directives/fullScreen.directive';
import { FullScreenModule } from '../../common/directives/fullScreen.module';
import { ResetPswModule } from '../reset-psw/reset-psw.module';
import { SwitchCompanyModule } from '../switch-company/switch-company.module';
import { TopNavComponent } from './top-nav.component';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ResetPswModule,
    RouterModule,
    SwitchCompanyModule,
    FullScreenModule
  ],
  declarations: [LayoutHeaderComponent, TopNavComponent],
  exports: [CommonModule, LayoutHeaderComponent, TopNavComponent],
})
export class LayoutHeaderModule { }
