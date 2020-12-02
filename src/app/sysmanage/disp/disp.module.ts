import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispRoutingModule } from './disp-routing.module';
import { DispComponent } from './disp.component';
@NgModule({
  imports: [
    CommonModule,
    DispRoutingModule,
  ],
  declarations: [ DispComponent ]
})
export class DispModule { }
