import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortalComponent }   from './portal.component';


/**
 * 登陆路由
 */
const portalRoutes: Routes = [
  {
    path: '',
    component: PortalComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(portalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PortalRoutingModule { }
