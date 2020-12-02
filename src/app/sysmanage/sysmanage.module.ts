import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SysmanageRoutingModule } from './sysmanage-routing.module';
import { NzSpinModule } from 'ng-zorro-antd';
import { LayoutComponent } from './layout/layout.component';
import { LineNavModule } from '../components/line-nav/line-nav.module';
import { LayoutHeaderModule } from '../components/layout-header/layout-header.module';
import { LayoutSidebarModule } from '../components/layout-sidebar/layout-sidebar.module';
@NgModule({
  imports: [
    SysmanageRoutingModule,
    PerfectScrollbarModule,
    NzSpinModule,
    LayoutHeaderModule,
    LayoutSidebarModule,
    LineNavModule
  ],
  declarations: [LayoutComponent]
})
export class SysmanageModule { }
