import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { FooterModule } from '../components/footer/footer.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HomePageComponent } from './home-page.component';

import { HomePageRoutingModule} from './home-page-routing.module';
import { HomePageLoginComponent } from './home-page-login/home-page-login.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { HomePageChartQyComponent } from './home-page-chart-qy/home-page-chart-qy.component';
import { HomePageChartQy3Component } from './home-page-chart-qy3/home-page-chart-qy.component';
import { HomePageChartQy2Component } from './home-page-chart-qy2/home-page-chart-qy.component';

import { HomePageAppComponent } from './home-page-app/home-page-app.component';
import { HomePageAboutComponent } from './home-page-about/home-page-about.component';
import { SwitchCompanyComponent } from '.././components/switch-company/switch-company.component';
//import { HomePageHeaderComponent } from './home-components/home-page-header/home-page-header.component';
//import { HomePageFooterComponent } from './home-components/home-page-footer/home-page-footer.component';
import { HomePageFooterModule } from './home-components/home-page-footer/home-page-footer.module';/*模块导入 */
import { HomePageHeaderModule } from './home-components/home-page-header/home-page-header.module';

import { SwitchCompanyModule } from '../components/switch-company/switch-company.module';

import { LoginModule } from '../login/login.module';
import { HomePageCultureComponent } from './home-page-culture/home-page-culture.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import { HomeRegisterComponent } from './home-register/home-register.component';
import { HomeRegisterFormComponent } from './home-register-form/home-register-form.component';
import { UpdateRegisterComponent } from './update-register/update-register.component';
import { ResetPswModule } from '@component/reset-psw/reset-psw.module';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { HomePageGoodsComponent } from './home-page-goods/home-page-goods.component';
import { HomePageCarsComponent } from './home-page-cars/home-page-cars.component';

@NgModule({
  imports:      [
     CommonModule,
     FormsModule,
     ReactiveFormsModule,
     HomePageRoutingModule,
     FooterModule,
     NgZorroAntdModule,
    NgxEchartsModule,
    HomePageFooterModule,
    HomePageHeaderModule,
    SwitchCompanyModule,
    LoginModule,
    ResetPswModule
  ],
  declarations: [
    HomePageComponent,
    HomePageLoginComponent,
    HomePageChartQyComponent,
    HomePageChartQy3Component,
    HomePageChartQy2Component,

    HomePageAppComponent,

    HomePageAboutComponent,

    HomePageCultureComponent,
    ForgetPasswordComponent,
    HomeRegisterComponent,
    HomeRegisterFormComponent,
    UpdateRegisterComponent,
    UserAgreementComponent,
    HomePageGoodsComponent,
    HomePageCarsComponent

    // SwitchCompanyComponent

   // HomePageHeaderComponent,

  //  HomePageFooterComponent,//下载APP

  ],
  exports:      [],
  providers:    []
})
export class HomePageModule { }
