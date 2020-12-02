import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
//Module
import { TplButtonsModule } from '@component/tpl-buttons/tpl-buttons.module';
import { SearchformModule } from '@component/searchform/searchform.module';
import { TableFormModule } from '@component/table-form/table-form.module';
import { GridResizeModule } from '@component/grid-resize/grid-resize.module';
import { BaseInformationRoutingModule } from './base-information-routing.module';
import { ModalModule } from '@component/modal';
import { ProductSalesComparisonComponent } from './product-sales-comparison/product-sales-comparison.component';
import { WarehouseVarietiesSetComponent } from './warehouse-varieties-set/warehouse-varieties-set.component';

import { WarehouseManagementComponent } from './warehouse-management/warehouse-management.component';
import {NzTableModule, NzModalModule, NzFormModule, NzSelectModule, NzInputModule} from 'ng-zorro-antd';
import {ShareModule} from '@share/share.module';
import { MaterialManagementComponent } from './material-management/material-management.component';
import {CommonPageModule} from '@component/common-page';
import { SalesVarietyManagementComponent } from './sales-variety-management/sales-variety-management.component';
import { ProductionVarietyManagementComponent } from './production-variety-management/production-variety-management.component';
import { ProdCategorComponent } from './prod-categor/prod-categor.component';

@NgModule({
  declarations: [ProductSalesComparisonComponent, WarehouseVarietiesSetComponent, WarehouseManagementComponent, MaterialManagementComponent, SalesVarietyManagementComponent, ProductionVarietyManagementComponent, ProdCategorComponent],
  imports: [
    CommonModule,
    BaseInformationRoutingModule,
    TplButtonsModule,
    SearchformModule,
    TableFormModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    ReactiveFormsModule,
    ModalModule,
    ShareModule,
    CommonPageModule,
    GridResizeModule
  ]
})
export class BaseInformationModule { }
