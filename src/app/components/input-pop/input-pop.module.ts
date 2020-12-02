import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalContentHeightModule} from '@directive/modal-content-height.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {InputPopComponent} from '@component/input-pop/input-pop.component';
import {InputModalModule} from '../input-modal/input-modal.module';
import {AreaSelectModule} from '@component/area-select/area-select.module';
import {ShareModule} from '@share/share.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    InputModalModule,
    AreaSelectModule,
    ModalContentHeightModule,

  ],
  declarations: [InputPopComponent],
  exports: [CommonModule, InputPopComponent]
})
export class InputPopModule {
}
