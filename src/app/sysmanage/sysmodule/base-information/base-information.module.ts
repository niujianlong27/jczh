import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInformationRoutingModule } from './base-information-routing.module';
import { VehicleManageComponent } from './vehicle-manage/vehicle-manage.component';
import { CommonPageModule } from '@component/common-page';
import { ModalModule } from '@component/modal';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DriverManageComponent } from './driver-manage/driver-manage.component';
import { ShipManagementComponent } from './ship-management/ship-management.component';
import { ShipAddComponent } from './ship-add/ship-add.component';
// import { LocationManageComponent } from './location-manage/location-manage.component';
import { LocationAddComponent } from './location-add/location-add.component';
import { LineManageComponent } from './line-manage/line-manage.component';
import { CompanyStaticDataComponent } from './company-static-data/company-static-data.component';
import { CompanyBankDataComponent } from './company-bank-data/company-bank-data.component';
import { DriverAddComponent } from './driver-add/driver-add.component';
import { InputModalModule } from '@component/input-modal/input-modal.module';
import { InputNumberModule } from '@component/input-number/input-number.module';

import { CompanyChoiceModule } from '@component/company-choice/company-choice.module';
import { CompanyUserBidComponent } from './company-user-bid/company-user-bid.component';
import { BusiSegmentComponent } from './busi-segment/busi-segment.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import {SearchformModule} from '@component/searchform/searchform.module';
import {TableFormModule} from '@component/table-form/table-form.module';
import {TplButtonsModule} from '@component/tpl-buttons/tpl-buttons.module';
import { ProductAddComponent } from './product-add/product-add.component';


import { ProductareaAddComponent } from './productarea-add/productarea-add.component';
import { ProductareaManageComponent } from './productarea-manage/productarea-manage.component';
import { ProductkindManageComponent } from './productkind-manage/productkind-manage.component';
import { ProductkindAddComponent } from './productkind-add/productkind-add.component';
import { ProdSpectionsComponent } from './prod-spections/prod-spections.component';
import { TransInpriceComponent } from './trans-inprice/trans-inprice.component';
import { TransOutpriceComponent } from './trans-outprice/trans-outprice.component';
import { CompanySettleComponent} from './company-settle/company-settle.component';
import { PayChannelListComponent } from './payChannel/pay-channel-list/pay-channel-list.component'; // 支付通道主页面
import { PayChannelAddComponent } from './payChannel/pay-channel-add/pay-channel-add.component'; // 支付通道新增
import { ImgViewerModule } from '@component/img-viewer/img-viewer';

import {FleetRatioManageComponent} from './fleet-ratio-manage/fleet-ratio-manage.component';
import { VechileProdManageComponent} from './vechile-prod-manage/vechile-prod-manage.component';
import { LineCityManageComponent } from './line-city-manage/line-city-manage.component';
import { AppUseReportComponent } from './app-use-report/app-use-report.component';
import { TeamManageComponent } from './team-manage/team-manage.component';
import { BerthManageComponent } from './berth-manage/berth-manage.component';
import { PortalCraneManageComponent } from './portal-crane-manage/portal-crane-manage.component';
import { TeamUserManageComponent } from './team-user-manage/team-user-manage.component';
import { BasicBankInformationComponent } from './basic-bank-information/basic-bank-information.component';
import { LineProdManageComponent } from './line-prod-manage/line-prod-manage.component';
import { TransOutpriceHisComponent } from './trans-outprice-his/trans-outprice-his.component';
import { KilometreManageComponent } from './kilometre-manage/kilometre-manage.component';
import { ForkliftManageComponent } from './forklift-manage/forklift-manage.component';
import { BankBaseInformationComponent } from './bank-base-information/bank-base-information.component';
import { CarManageComponent } from './car-manage/car-manage.component';
import { CarManageAddComponent } from './car-manage-add/car-manage-add.component';
import { CarAuthComponent } from './car-auth/car-auth.component';
import { CarbusinessAuthComponent } from './carbusiness-auth/carbusiness-auth.component';
import {ShareModule} from '@share/share.module';
import {BargainInfoComponent} from './bargain-info/bargain-info.component';
import { CommomAddressManageComponent } from './commom-address-manage/commom-address-manage.component';
import { BusinessPermissionComponent } from './business-permission/business-permission.component';
import {GridBlockModule} from '@component/simple-page/grid-block/grid-block.module';
import { TransgroupMapComponent } from './transgroup-map/transgroup-map.component';
import { CarrierManageComponent } from './carrier-manage/carrier-manage.component';
import { CarierManageAddComponent } from './carier-manage-add/carier-manage-add.component';
import { CarSearchComponent } from './car-search/car-search.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserloginStatisticsComponent } from './userlogin-statistics/userlogin-statistics.component';
import {GridResizeModule} from '@component/grid-resize/grid-resize.module';
import { ReturnWaybillComponent } from './return-waybill/return-waybill.component';
import { RGPriceTrendComponent } from './rg-price-trend/rg-price-trend.component';
import { CheckUserInfoComponent } from './check-user-info/check-user-info.component';
import { PointDistanceComponent } from './point-distance/point-distance.component';
import {InputPopModule} from '@component/input-pop/input-pop.module';

@NgModule({
  imports: [
    CommonModule,
    BaseInformationRoutingModule,
    CommonPageModule,
    ModalModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    InputModalModule,
    CompanyChoiceModule,
    SearchformModule,
    TableFormModule,
    TplButtonsModule,
    InputNumberModule,
    ShareModule,
    GridBlockModule,
    ImgViewerModule,
    InputPopModule,
    GridResizeModule,
  ],
  declarations: [
    VehicleManageComponent,
    VehicleAddComponent,
    DriverManageComponent,
    ShipManagementComponent,
    ShipAddComponent,
    //   LocationManageComponent,
    KilometreManageComponent,
    LocationAddComponent,
    LineManageComponent,
    CompanyStaticDataComponent,
    CompanyBankDataComponent,
    DriverAddComponent,
    CompanyUserBidComponent,
    BusiSegmentComponent,
    ProductareaAddComponent,
    ProductareaManageComponent,
    ProductManageComponent,
    ProductAddComponent,
    ProductkindManageComponent,
    ProductkindAddComponent,
    ProdSpectionsComponent,
    TransInpriceComponent,
    TransOutpriceComponent,
    CompanySettleComponent,
    PayChannelListComponent,
    PayChannelAddComponent,
    FleetRatioManageComponent,
    LineCityManageComponent,
    VechileProdManageComponent,
    AppUseReportComponent,
    TeamManageComponent,
    BerthManageComponent,
    PortalCraneManageComponent,
    TeamUserManageComponent,
    BasicBankInformationComponent,
    LineProdManageComponent,
    TransOutpriceHisComponent,
    KilometreManageComponent,
    ForkliftManageComponent,
    BankBaseInformationComponent,
    CommomAddressManageComponent,
    BargainInfoComponent,
    BusinessPermissionComponent,
    CarAuthComponent,
    CarManageComponent,
    CarManageAddComponent,
    CarbusinessAuthComponent,
    TransgroupMapComponent,
    CarrierManageComponent,
    CarierManageAddComponent,
    CarSearchComponent,
    UserStatisticsComponent,
    UserloginStatisticsComponent,
    ReturnWaybillComponent,
    RGPriceTrendComponent,
    CheckUserInfoComponent,
    PointDistanceComponent,
  ]
})
export class BaseInformationModule {
}
