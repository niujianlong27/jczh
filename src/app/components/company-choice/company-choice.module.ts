import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyChoiceComponent } from './company-choice.component';
import { ShareModule } from '@share/share.module';

@NgModule({
  imports: [
    CommonModule,
    ShareModule
  ],
  declarations: [CompanyChoiceComponent],
  exports: [CompanyChoiceComponent]
})
export class CompanyChoiceModule { }
