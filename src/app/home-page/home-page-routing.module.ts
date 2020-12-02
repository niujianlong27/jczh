import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { HomePageAppComponent } from './home-page-app/home-page-app.component';
import { HomePageAboutComponent } from './home-page-about/home-page-about.component';
// import {HomePageLoginComponent} from './home-page-login/home-page-login.component';
// import { HomePageHeaderComponent } from './home-components/home-page-header/home-page-header.component';
import { HomePageCultureComponent } from './home-page-culture/home-page-culture.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import { HomeRegisterComponent } from './home-register/home-register.component';
import { HomeRegisterFormComponent } from './home-register-form/home-register-form.component';
import { UpdateRegisterComponent } from './update-register/update-register.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { HomePageGoodsComponent } from './home-page-goods/home-page-goods.component';
import { HomePageCarsComponent } from './home-page-cars/home-page-cars.component';

/**
 * 登陆路由
 */
const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'home-page-app',
    component: HomePageAppComponent
  },
  {
    path: 'home-page-about',
    component: HomePageAboutComponent
  }, /* {
    path: 'home-page-login',
    component: HomePageLoginComponent
  }, */
  {
    path: 'home-page-culture',
    component: HomePageCultureComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'home-register',
    component: HomeRegisterComponent,
  },
  {
    path: 'home-register-form',
    component: HomeRegisterFormComponent,
  },
  {
    path: 'update-register',
    component: UpdateRegisterComponent,
  },
  {
    path: 'userAgreement',
    component: UserAgreementComponent,
  },
  {
    path: 'home-page-goods',
    component: HomePageGoodsComponent,
  },
  {
    path: 'home-page-cars',
    component: HomePageCarsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomePageRoutingModule { }
