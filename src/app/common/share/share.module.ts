import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZmMovableModalDirectiveDirective } from "@directive/zm-movable-modal-directive.directive";
import { GridLineDirective } from '@directive/gridLine.directive';
import { ReNztableModule } from '@directive/reNztable.module';
//pipes
import { GridDataModule } from '@pipe/grid-data.module';
import { HtmlPipe, safeUrlPipe } from '@pipe/html.pipe';
import {CilckOnceDirective} from '@directive/cilck-once.directive';
import {ClickDisabledDirective} from '@directive/click-disabled.directive';
import { ValueToLabelPipe } from '../../sysmanage/sea/common/value-to-label.pipe';
import {DataAggregationPipe} from '@pipe/data-aggregation.pipe';
import {TrimDirective} from '@directive/trim.directive';
import {InputThrottleDirective} from '@directive/input-throttle.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    GridDataModule,
    ReNztableModule
  ],
  declarations: [
    ZmMovableModalDirectiveDirective,
    GridLineDirective,
    HtmlPipe,
    safeUrlPipe,
    CilckOnceDirective,
    ClickDisabledDirective,
    ValueToLabelPipe,
    DataAggregationPipe,
    TrimDirective,
    InputThrottleDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    GridDataModule,
    GridLineDirective,
    ReNztableModule,
    ZmMovableModalDirectiveDirective,
    HtmlPipe,
    safeUrlPipe,
    CilckOnceDirective,
    ClickDisabledDirective,
    ValueToLabelPipe,
    DataAggregationPipe,
    TrimDirective,
    InputThrottleDirective
  ],
})
export class ShareModule {}


