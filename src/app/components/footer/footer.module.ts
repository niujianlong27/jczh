import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ FooterComponent ],
  providers: [],
  exports: [ CommonModule, FooterComponent ]
})
export class FooterModule { }
