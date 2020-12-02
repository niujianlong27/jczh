import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContractTransComponent} from './contract-trans/contract-trans.component';
import {ContractSalesComponent} from './contract-sales/contract-sales.component';

const routes: Routes = [
  {path:'',redirectTo:'contractTrans'},
  {path:'contractTrans',component:ContractTransComponent},
  {path:'contractSales',component:ContractSalesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManageRoutingModule { }
