import { NgModule }   from '@angular/core';
import { CommonModule }       from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { FooterModule } from '../components/footer/footer.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { PortalComponent } from './portal.component';

import { PortalRoutingModule } from './portal-routing.module';
import { PortalLoginComponent } from './portallogin/portal-login.component';
import { PortalChartComponent } from './portal-chart/portal-chart.component';

import { NgxEchartsModule }  from 'ngx-echarts';
import { PortalChart2Component } from './portal-chart2/portal-chart2.component';
import { PortalChart3Component } from './portal-chart3/portal-chart3.component';//折线图

@NgModule({
  imports:      [
     CommonModule, 
     FormsModule,
     ReactiveFormsModule,
     PortalRoutingModule,
     FooterModule,
     NgZorroAntdModule,
     NgxEchartsModule
  ],
  declarations: [
     PortalComponent,
     PortalLoginComponent,
     PortalChartComponent,
     PortalChart2Component,
     PortalChart3Component,
  ],
  exports:      [],
  providers:    []
})
export class PortalModule { }
