import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StockInfoComponent} from './stock-info/stock-info.component';
import {StockSetComponent} from './stock-set/stock-set.component';
import {StockInComponent} from './stock-in/stock-in.component';
import {StockOutComponent} from './stock-out/stock-out.component';
import {StockInAddComponent} from './stock-in-add/stock-in-add.component';
import {StockOutAddComponent} from './stock-out-add/stock-out-add.component';
import {StockLocationSetComponent} from './stock-location-set/stock-location-set.component';
import {StockAreaSetComponent} from './stock-area-set/stock-area-set.component';
import {StockInventoryComponent} from './stock-inventory/stock-inventory.component';
import {StockMoveComponent} from './stock-move/stock-move.component';
import {StockMoveAddComponent} from './stock-move-add/stock-move-add.component';
import {StockInventoryAddComponent} from './stock-inventory-add/stock-inventory-add.component';
import {StockTransferComponent} from './stock-transfer/stock-transfer.component';
import {StockTransferAddComponent} from './stock-transfer-add/stock-transfer-add.component';
import {StockAddDetailComponent} from './stock-add-detail/stock-add-detail.component';
import {StockReverseShipmentComponent} from './stock-reverse-shipment/stock-reverse-shipment.component';
import {StockReverseShipmentAddComponent} from './stock-reverse-shipment-add/stock-reverse-shipment-add.component';
import {StockBulkMoveComponent} from './stock-bulk-move/stock-bulk-move.component';
import {StockBulkMoveAddComponent} from './stock-bulk-move-add/stock-bulk-move-add.component';
import {StockBulkInComponent} from './stock-bulk-in/stock-bulk-in.component';
import {StockBulkInAddComponent} from './stock-bulk-in-add/stock-bulk-in-add.component';
import {MoistureValueComponent} from './moisture-value/moisture-value.component';
import {StockBulkOutComponent} from './stock-bulk-out/stock-bulk-out.component';
import {StockBulkOutAddComponent} from './stock-bulk-out-add/stock-bulk-out-add.component';
import {StockBulkInventoryComponent} from './stock-bulk-inventory/stock-bulk-inventory.component';
import {StockBulkInventoryAddComponent} from './stock-bulk-inventory-add/stock-bulk-inventory-add.component';
import {StockBulkTransferComponent} from './stock-bulk-transfer/stock-bulk-transfer.component';
import {StockBulkTranferAddComponent} from './stock-bulk-tranfer-add/stock-bulk-tranfer-add.component';
import { StockBulkAddDetailComponent } from './stock-bulk-add-detail/stock-bulk-add-detail.component';
import { StockBulkReverseShipmentComponent } from './stock-bulk-reverse-shipment/stock-bulk-reverse-shipment.component';
import { StockBulkReverseShipmentAddComponent } from './stock-bulk-reverse-shipment-add/stock-bulk-reverse-shipment-add.component';
import { StockBulkInfoComponent } from './stock-bulk-info/stock-bulk-info.component';
import { StockBulkUserInfoComponent } from './stock-bulk-user-info/stock-bulk-user-info.component';
import {StockFlatAccountComponent} from './stock-flat-account/stock-flat-account.component';
import {ShStockFlatAccountComponent} from './sh-stock-flat-account/sh-stock-flat-account.component';
const routes: Routes = [
  {path: '', redirectTo: 'stockInfo'},
  {path: 'stockInfo', component: StockInfoComponent},
  {path: 'stockSet', component: StockSetComponent},
  {path: 'stockIn', component: StockInComponent},
  {path: 'stockOut', component: StockOutComponent},
  {path: 'stockMove', component: StockMoveComponent},
  {path: 'stockMoveAdd', component: StockMoveAddComponent},
  {path: 'stockAreaSet', component: StockAreaSetComponent},
  {path: 'stockInAdd', component: StockInAddComponent},
  {path: 'stockOutAdd', component: StockOutAddComponent},
  {path: 'stockLocationSet', component: StockLocationSetComponent},
  {path: 'stockAreaSet', component: StockAreaSetComponent},
  {path: 'stockInventory', component: StockInventoryComponent},
  {path: 'stockInventoryAdd', component: StockInventoryAddComponent},
  {path: 'stockAddDetail', component: StockAddDetailComponent},
  {path: 'stockTransfer', component: StockTransferComponent},
  {path: 'stockTransferAdd', component: StockTransferAddComponent},
  {path: 'stockReverseShipment', component: StockReverseShipmentComponent},
  {path: 'stockReverseShipmentAdd', component: StockReverseShipmentAddComponent},
  {path: 'stockBulkMove', component: StockBulkMoveComponent},
  {path: 'stockBulkMoveAdd', component: StockBulkMoveAddComponent},
  {path: 'stockBulkIn', component: StockBulkInComponent},
  {path: 'stockBulkInAdd', component: StockBulkInAddComponent},
  {path: 'stockBulkOut', component: StockBulkOutComponent},
  {path: 'stockBulkOutAdd', component: StockBulkOutAddComponent},
  {path: 'moistuerValue', component: MoistureValueComponent},
  {path: 'stockBulkInventory', component: StockBulkInventoryComponent},
  {path: 'stockBulkInventoryAdd', component: StockBulkInventoryAddComponent},
  {path: 'stockBulkTransfer', component: StockBulkTransferComponent},
  {path: 'stockBulkTransferAdd', component: StockBulkTranferAddComponent},
  {path: 'stockBulkAddDetail', component: StockBulkAddDetailComponent},
  {path: 'stockBulkReverseShipment', component: StockBulkReverseShipmentComponent},
  {path: 'stockBulkReverseShipmentAdd', component: StockBulkReverseShipmentAddComponent},
  {path: 'stockBulkInfo', component: StockBulkInfoComponent},
  {path: 'stockBulkUserInfo', component: StockBulkUserInfoComponent},
  {path: 'stockFlatAccountComponent',component:StockFlatAccountComponent},
  {path: 'shStockFlatAccountComponent',component:ShStockFlatAccountComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockManageRoutingModule {
}
