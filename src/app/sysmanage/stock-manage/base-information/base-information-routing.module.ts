import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSalesComparisonComponent } from './product-sales-comparison/product-sales-comparison.component';
import { WarehouseManagementComponent } from './warehouse-management/warehouse-management.component';
import { WarehouseVarietiesSetComponent } from './warehouse-varieties-set/warehouse-varieties-set.component';
import { MaterialManagementComponent } from './material-management/material-management.component';
import { SalesVarietyManagementComponent } from './sales-variety-management/sales-variety-management.component';
import { ProductionVarietyManagementComponent } from './production-variety-management/production-variety-management.component';
import { ProdCategorComponent } from './prod-categor/prod-categor.component';
const routes: Routes = [
  { path: '', redirectTo: '' },
  { path: 'productSalesComparison', component: ProductSalesComparisonComponent },
  { path: 'warehouseVarietiesSet', component: WarehouseVarietiesSetComponent },
  { path: 'warehouseManagement', component: WarehouseManagementComponent },
  { path: 'materialManagement', component: MaterialManagementComponent },
  { path: 'salesVarietyManagement', component: SalesVarietyManagementComponent },
  { path: 'productionVarietyManagement', component: ProductionVarietyManagementComponent },
  { path: 'prodcategor', component: ProdCategorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseInformationRoutingModule {
}
