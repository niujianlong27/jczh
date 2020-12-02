import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectProductComponent } from './select-product/select-product.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockInAddComponent } from './stock-in-add/stock-in-add.component';
import { StockOutComponent } from './stock-out/stock-out.component';



const routes: Routes = [
  { path: '', redirectTo: ''},
  { path: 'selectProduction', component: SelectProductComponent },
  { path: 'stockIn', component: StockInComponent },
  { path: 'stockInAdd', component: StockInAddComponent },
  { path: 'stockOut', component: StockOutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepertorySearchRoutingModule { }
