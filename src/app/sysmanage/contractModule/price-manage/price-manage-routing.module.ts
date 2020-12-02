import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PriceLineComponent} from './price-line/price-line.component';

const routes: Routes = [
  {path:'',redirectTo:'priceLine'},
  {path:'priceLine',component:PriceLineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceManageRoutingModule { }
