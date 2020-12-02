import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StockManageRoutingModule } from './stock-manage-routing.module';
import { StockManageComponent } from './stock-manage.component';
import { StockInfoComponent} from './stock-info/stock-info.component';
import { CommonPageModule } from "../../../components/common-page/common-page.module";
import { InputModalModule } from "../../../components/input-modal/input-modal.module";
import { ModalModule } from "../../../components/modal/modal.module";
import { TableFormModule } from "../../../components/table-form/table-form.module";
import { SearchformModule } from "../../../components/searchform/searchform.module";
import { TplButtonsModule } from "../../../components/tpl-buttons/tpl-buttons.module";
import { StockSetComponent } from './stock-set/stock-set.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockAreaSetComponent } from './stock-area-set/stock-area-set.component';
import { StockLocationSetComponent } from './stock-location-set/stock-location-set.component';
import { StockInAddComponent } from './stock-in-add/stock-in-add.component';
import { StockOutAddComponent } from './stock-out-add/stock-out-add.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { StockInventoryComponent } from './stock-inventory/stock-inventory.component';
import { StockMoveComponent } from './stock-move/stock-move.component';
import { StockMoveAddComponent } from './stock-move-add/stock-move-add.component';
import { StockInventoryAddComponent } from './stock-inventory-add/stock-inventory-add.component';
import { StockAddDetailComponent } from './stock-add-detail/stock-add-detail.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockTransferAddComponent } from './stock-transfer-add/stock-transfer-add.component';
import { StockReverseShipmentComponent } from './stock-reverse-shipment/stock-reverse-shipment.component';
import { StockReverseShipmentAddComponent } from './stock-reverse-shipment-add/stock-reverse-shipment-add.component';
import { StockBulkMoveComponent } from './stock-bulk-move/stock-bulk-move.component';
import { StockBulkMoveAddComponent } from './stock-bulk-move-add/stock-bulk-move-add.component';
import { StockBulkInComponent } from './stock-bulk-in/stock-bulk-in.component';
import { StockBulkInAddComponent } from './stock-bulk-in-add/stock-bulk-in-add.component';
import { MoistureValueComponent } from './moisture-value/moisture-value.component';
import { StockBulkOutComponent } from './stock-bulk-out/stock-bulk-out.component';
import { StockBulkOutAddComponent } from './stock-bulk-out-add/stock-bulk-out-add.component';
import { StockBulkInventoryComponent } from './stock-bulk-inventory/stock-bulk-inventory.component';
import { StockBulkInventoryAddComponent } from './stock-bulk-inventory-add/stock-bulk-inventory-add.component';
import {StockBulkTransferComponent} from './stock-bulk-transfer/stock-bulk-transfer.component';
import {StockBulkTranferAddComponent} from './stock-bulk-tranfer-add/stock-bulk-tranfer-add.component';
import { StockBulkAddDetailComponent } from './stock-bulk-add-detail/stock-bulk-add-detail.component';
import { StockBulkReverseShipmentComponent } from './stock-bulk-reverse-shipment/stock-bulk-reverse-shipment.component';
import { StockBulkReverseShipmentAddComponent } from './stock-bulk-reverse-shipment-add/stock-bulk-reverse-shipment-add.component';
import { StockFlatAccountComponent } from './stock-flat-account/stock-flat-account.component';
import { StockBulkInfoComponent } from './stock-bulk-info/stock-bulk-info.component';
import { StockBulkUserInfoComponent } from './stock-bulk-user-info/stock-bulk-user-info.component';
import { ShStockFlatAccountComponent } from './sh-stock-flat-account/sh-stock-flat-account.component';
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import {GridResizeModule} from "../../../components/grid-resize/grid-resize.module";

const component = [
  StockManageComponent,
  StockInfoComponent,
  StockSetComponent,
  StockAreaSetComponent,
  StockLocationSetComponent,
  StockInAddComponent,
  StockOutAddComponent,
  StockInComponent,
  StockOutComponent,
  StockInventoryComponent,
  StockInventoryAddComponent,
  StockMoveComponent,
  StockMoveAddComponent,
  StockAddDetailComponent,
  StockTransferComponent,
  StockTransferAddComponent,
  StockReverseShipmentComponent,
  StockReverseShipmentAddComponent,
  StockBulkMoveComponent,
  StockBulkMoveAddComponent,
  StockBulkInComponent,
  StockBulkInAddComponent,
  MoistureValueComponent,
  StockBulkOutComponent,
  StockBulkOutAddComponent,
  StockBulkInventoryComponent,
  StockBulkInventoryAddComponent,
  StockBulkTransferComponent,
  StockBulkTranferAddComponent,
  StockBulkAddDetailComponent,
  StockBulkReverseShipmentComponent,
  StockBulkReverseShipmentAddComponent,
  StockBulkInfoComponent,
  StockBulkUserInfoComponent
]

@NgModule({
  imports: [
    CommonModule,
    StockManageRoutingModule,
    CommonPageModule,
    InputModalModule,
    InputNumberModule,
    ModalModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    GridResizeModule
  ],
  declarations: [...component, StockFlatAccountComponent, ShStockFlatAccountComponent]

})
export class StockManageModule { }
