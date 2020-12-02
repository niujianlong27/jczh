import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaSelectComponent } from './area-select.component';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { FormsModule } from '@angular/forms';
import { ShareModule } from '@share/share.module';


@NgModule({
  imports: [
    CommonModule,
    ShareModule
  ],
  declarations: [AreaSelectComponent],
  exports:[AreaSelectComponent]
})
export class AreaSelectModule { }
