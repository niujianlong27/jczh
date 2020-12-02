import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd';
import { ApploadComponent } from './appload.component';
import { ApploadRoutingModule } from './appload-routing.module';
@NgModule({
  imports:      [
     CommonModule,
     ApploadRoutingModule,
     NzButtonModule
  ],
  declarations: [
    ApploadComponent
  ],
  exports:      [],
  providers:    []
})
export class ApploadModule { }
