import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShipToPortRoutingModule} from './ship-to-port-routing.module';
import {ShipToPortComponent} from './ship-to-port/ship-to-port.component';
import {ShareModule} from '../../../common/share/share.module';
import {CommonPageModule} from '../../../components/common-page/common-page.module';
import { TableFormModule } from 'src/app/components/table-form/table-form.module';
import { SearchformModule } from 'src/app/components/searchform/searchform.module';
import { TplButtonsModule } from 'src/app/components/tpl-buttons/tpl-buttons.module';
import { InputModalModule } from "../../../components/input-modal/input-modal.module";
import { BoatWaterGaugeComponent } from './boat-water-gauge/boat-water-gauge.component';
import {GridResizeModule} from '../../../components/grid-resize/grid-resize.module';
import {GridBlockModule} from '../../../components/simple-page/grid-block/grid-block.module';
import { BoatInspectGaugeComponent } from './boat-inspect-gauge/boat-inspect-gauge.component';
@NgModule({
  declarations: [ShipToPortComponent, BoatWaterGaugeComponent, BoatInspectGaugeComponent],
  imports: [
    CommonModule,
    ShipToPortRoutingModule,
    ShareModule,
    CommonPageModule,
    TableFormModule,
    SearchformModule,
    TplButtonsModule,
    InputModalModule,
    GridResizeModule,
    GridBlockModule
  ]
})
export class ShipToPortModule {
}
