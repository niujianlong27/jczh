import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationManageComponent } from './location-manage.component';
import { LocationManageRoutingModule } from './location-manage-routing.module';
import { CommonPageModule } from '@component/common-page';
import { SearchformModule } from '@component/searchform/searchform.module';
import { TableFormModule } from '@component/table-form/table-form.module';
import { CompanyChoiceModule } from '@component/company-choice/company-choice.module';
import { ModalModule } from '@component/modal';
import { NzModalModule, NzFormModule, NzInputModule, NzSelectModule, NzGridModule, NzRadioModule, NzInputNumberModule  } from 'ng-zorro-antd';
import { StandPointManageComponent } from './stand-point-manage/stand-point-manage.component';
import { UnstandPointManageComponent } from './unstand-point-manage/unstand-point-manage.component';
import { CommonModalModule } from './commonModal/common-modal.moudle';
@NgModule({
  declarations: [
    LocationManageComponent,
    StandPointManageComponent,
    UnstandPointManageComponent
  ],
  imports: [
    CommonModule,
    LocationManageRoutingModule,
    FormsModule,
    CommonPageModule,
    CompanyChoiceModule,
    ModalModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzRadioModule,
    NzInputNumberModule,
    SearchformModule,
    TableFormModule,
    CommonModalModule
  ]
})
export class LocationManageModule { }
