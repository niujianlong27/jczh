import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CustomerAddComponent } from './customer-add/customer-add.component';

import { ModalModule } from '../../../components/modal/modal.module';

import { CommonPageModule } from "../../../components/common-page/common-page.module";
import { CompanyChoiceModule } from '../../../components/company-choice/company-choice.module';
import { InputModalModule } from '../../../components/input-modal/input-modal.module';
import { ImgViewerModule } from '@component/img-viewer/img-viewer';

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ModalModule,
    CommonPageModule,
    CompanyChoiceModule,
    InputModalModule,
    ImgViewerModule
  ],
  providers: [],
  declarations: [CustomerlistComponent, CustomerAddComponent]
})
export class CustomerModule { }
