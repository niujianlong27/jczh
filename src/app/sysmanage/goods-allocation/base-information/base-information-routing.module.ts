import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSetComponent } from './product-set/product-set.component';
const routes: Routes = [
  { path: '', redirectTo: '' },
  { path: 'productSet', component: ProductSetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseInformationRoutingModule {

}
