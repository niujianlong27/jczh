import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApploadComponent } from './appload.component';

/**
 * app下载路由
 * appload/Android_jczh Android_jczhwl是安卓下载
 * appload/IOS_jczh IOS_jczhwl是苹果下载
 */

const apploadRoutes: Routes = [
  {
    path: '',
    redirectTo: 'Android_jczh'
  },
  {
    path: ':appOs',
    component: ApploadComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(apploadRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ApploadRoutingModule { }
