import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPageComponent } from './common-page.component';
import { SearchformModule } from '../searchform/searchform.module';
import { TableFormModule } from '../table-form/table-form.module';
import { TplButtonsModule } from '../tpl-buttons/tpl-buttons.module';
@NgModule({
  imports: [
    CommonModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule
  ],
  declarations: [CommonPageComponent],
  exports: [ CommonModule, CommonPageComponent]
})
export class CommonPageModule { }
