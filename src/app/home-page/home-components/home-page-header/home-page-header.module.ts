import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageHeaderComponent } from './home-page-header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HomePageHeaderComponent],
  exports:[CommonModule,HomePageHeaderComponent],
})
export class HomePageHeaderModule { }
