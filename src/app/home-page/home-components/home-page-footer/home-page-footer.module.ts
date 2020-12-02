import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageFooterComponent } from './home-page-footer.component';

@NgModule({
 
  imports: [
    CommonModule
  ],
  declarations: [HomePageFooterComponent],
  exports:[HomePageFooterComponent]
})
export class HomePageFooterModule { }
