import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterModule } from '../components/footer/footer.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { LoginComponent } from './login.component';

import { LoginRoutingModule } from './login-routing.module';
import { ResetPswModule } from '../components/reset-psw/reset-psw.module';
import { HomePageFooterModule } from '../home-page/home-components/home-page-footer/home-page-footer.module';
import { HomePageHeaderModule } from '../home-page/home-components/home-page-header/home-page-header.module';
import { SwitchCompanyModule } from '../components/switch-company/switch-company.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    FooterModule,
    NgZorroAntdModule,
    ResetPswModule,
    SwitchCompanyModule,
    HomePageFooterModule,
    HomePageHeaderModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: []
})
export class LoginModule { }
