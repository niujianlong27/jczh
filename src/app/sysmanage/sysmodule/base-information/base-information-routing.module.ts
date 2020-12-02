import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VehicleManageComponent} from './vehicle-manage/vehicle-manage.component';
import {VehicleAddComponent} from './vehicle-add/vehicle-add.component';
import {DriverManageComponent} from './driver-manage/driver-manage.component';
import {ShipManagementComponent} from './ship-management/ship-management.component';
import {ShipAddComponent} from './ship-add/ship-add.component';
//import { LocationManageComponent } from './location-manage/location-manage.component';
import { BusinessPermissionComponent } from './business-permission/business-permission.component';
import {KilometreManageComponent} from './kilometre-manage/kilometre-manage.component';
import {LocationAddComponent} from './location-add/location-add.component';
import {LineManageComponent} from './line-manage/line-manage.component';
import {CompanyStaticDataComponent} from './company-static-data/company-static-data.component';
import {CompanyBankDataComponent} from './company-bank-data/company-bank-data.component';
import {DriverAddComponent} from './driver-add/driver-add.component';
import {CompanyUserBidComponent} from './company-user-bid/company-user-bid.component';
import {BusiSegmentComponent} from './busi-segment/busi-segment.component';
import {ProductManageComponent} from './product-manage/product-manage.component';
import {ProductAddComponent} from './product-add/product-add.component';

import {ProductareaAddComponent} from './productarea-add/productarea-add.component';
import {ProductareaManageComponent} from './productarea-manage/productarea-manage.component';
import {ProductkindManageComponent} from './productkind-manage/productkind-manage.component';
import {ProductkindAddComponent} from './productkind-add/productkind-add.component';
import {ProdSpectionsComponent} from './prod-spections/prod-spections.component';
import {TransInpriceComponent} from './trans-inprice/trans-inprice.component';
import {TransOutpriceComponent} from './trans-outprice/trans-outprice.component';
import {CompanySettleComponent} from './company-settle/company-settle.component';

import {PayChannelListComponent} from './payChannel/pay-channel-list/pay-channel-list.component';//支付通道列表
import {PayChannelAddComponent} from './payChannel/pay-channel-add/pay-channel-add.component';
//支付通道新增
import {VechileProdManageComponent} from './vechile-prod-manage/vechile-prod-manage.component';
import {FleetRatioManageComponent} from './fleet-ratio-manage/fleet-ratio-manage.component';
import {LineCityManageComponent} from './line-city-manage/line-city-manage.component';
import {AppUseReportComponent} from './app-use-report/app-use-report.component';
import {TeamManageComponent} from './team-manage/team-manage.component';
import {BerthManageComponent} from './berth-manage/berth-manage.component';
import {PortalCraneManageComponent} from './portal-crane-manage/portal-crane-manage.component';
import {TeamUserManageComponent} from './team-user-manage/team-user-manage.component';
import {BasicBankInformationComponent} from './basic-bank-information/basic-bank-information.component';
import {LineProdManageComponent} from './line-prod-manage/line-prod-manage.component';
import {TransOutpriceHisComponent} from './trans-outprice-his/trans-outprice-his.component';
import {ForkliftManageComponent} from './forklift-manage/forklift-manage.component';
import {BankBaseInformationComponent} from './bank-base-information/bank-base-information.component';

import {CommomAddressManageComponent} from './commom-address-manage/commom-address-manage.component';
import {BargainInfoComponent} from './bargain-info/bargain-info.component';
import {CarAuthComponent} from './car-auth/car-auth.component';
import {CarManageComponent} from './car-manage/car-manage.component';
import {CarManageAddComponent} from './car-manage-add/car-manage-add.component';
import {CarbusinessAuthComponent} from './carbusiness-auth/carbusiness-auth.component';
import { TransgroupMapComponent } from './transgroup-map/transgroup-map.component';
import { CarrierManageComponent } from './carrier-manage/carrier-manage.component';
import { CarierManageAddComponent } from './carier-manage-add/carier-manage-add.component';
import { CarSearchComponent} from './car-search/car-search.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserloginStatisticsComponent } from './userlogin-statistics/userlogin-statistics.component';
import {ReturnWaybillComponent} from './return-waybill/return-waybill.component';
import {RGPriceTrendComponent} from './rg-price-trend/rg-price-trend.component';

import { CheckUserInfoComponent } from './check-user-info/check-user-info.component';
import {PointDistanceComponent} from './point-distance/point-distance.component';

const routes: Routes = [
  { path: '', redirectTo:''},
  { path: 'vehicleManage', component: VehicleManageComponent},
 // { path: 'vehicleAdd', component:VehicleAddComponent},
  { path: 'DirverManage', component:DriverManageComponent},
  { path: 'DirverAdd', data: {noReuse: true}, component:DriverAddComponent},
  { path: 'shipManagement', component:ShipManagementComponent},
  { path: 'shipAdd', component:ShipAddComponent},
 // { path: 'locationManage', component:LocationManageComponent},
  { path: 'locationManage', loadChildren: './location-manage/location-manage.module#LocationManageModule'},
  { path: 'kilometreManage', component:KilometreManageComponent},
  { path: 'businessPermission', component:BusinessPermissionComponent},
  { path: 'locationAdd', component:LocationAddComponent},
  { path: 'lineManage', component:LineManageComponent},
  { path: 'companyStaticData', component:CompanyStaticDataComponent},
  { path: 'companyBankData', component:CompanyBankDataComponent},
  { path: 'companyuserbid', component:CompanyUserBidComponent},
  { path: 'busisegment', component:BusiSegmentComponent},
  { path: 'productManage', component:ProductManageComponent},
  { path: 'productAdd', component:ProductAddComponent},
  { path: 'productareaManage',component:ProductareaManageComponent},
  { path: 'productareaAdd',component:ProductareaAddComponent},
  { path: 'productkindManage',component:ProductkindManageComponent},
  { path: 'productkindAdd',component:ProductkindAddComponent},
  { path: 'prodSpections',component:ProdSpectionsComponent},
  { path: 'transInprice',component:TransInpriceComponent},
  { path: 'transOutprice',component:TransOutpriceComponent},
  { path: 'companySettle', component: CompanySettleComponent},
  { path: 'payChannelList', component: PayChannelListComponent },
  { path: 'payChannelAdd', component: PayChannelAddComponent },
  { path: 'fleetRatioManage',component:FleetRatioManageComponent},
  { path: 'vechileProdManage',component:VechileProdManageComponent},
  { path: 'lineCityManage',component:LineCityManageComponent},
  { path: 'appUseReport',component:AppUseReportComponent},
  { path: 'teamManage',component:TeamManageComponent},
  { path: 'berthManage',component:BerthManageComponent},
  { path: 'portalCrane',component:PortalCraneManageComponent},
  { path: 'teamUserManage',component:TeamUserManageComponent},
  { path: 'basicBankInformation',component:BasicBankInformationComponent},
  { path: 'lineProdManager',component:LineProdManageComponent},
  { path: 'transOutpriceHis', component: TransOutpriceHisComponent},
  { path: 'forkliftManage', component: ForkliftManageComponent},
  { path: 'bankBaseInformation', component: BankBaseInformationComponent},
  { path: 'commomAddressManage', component: CommomAddressManageComponent},
  { path: 'bargainInfo', component: BargainInfoComponent},
  {path: '', redirectTo: ''},
  {path: 'vehicleManage', component: VehicleManageComponent},
  { path: 'vehicleAdd', data: { noReuse: true }, component: VehicleAddComponent }, // 新增
  { path: 'vehicleUpdate', data: { noReuse: true }, component: VehicleAddComponent }, // 修改
  { path: 'vehicleCheck', data: { noReuse: true }, component: VehicleAddComponent }, // 审核
  {path: 'DirverManage', component: DriverManageComponent},
  {path: 'DirverAdd', data: {noReuse: true}, component: DriverAddComponent},
  {path: 'shipManagement', component: ShipManagementComponent},
  {path: 'shipAdd', component: ShipAddComponent},
  // { path: 'locationManage', component:LocationManageComponent},
  {path: 'locationManage', loadChildren: './location-manage/location-manage.module#LocationManageModule'},
  {path: 'kilometreManage', component: KilometreManageComponent},
  {path: 'locationAdd', component: LocationAddComponent},
  {path: 'lineManage', component: LineManageComponent},
  {path: 'companyStaticData', component: CompanyStaticDataComponent},
  {path: 'companyBankData', component: CompanyBankDataComponent},
  {path: 'companyuserbid', component: CompanyUserBidComponent},
  {path: 'busisegment', component: BusiSegmentComponent},
  {path: 'productManage', component: ProductManageComponent},
  {path: 'productAdd', component: ProductAddComponent},
  {path: 'productareaManage', component: ProductareaManageComponent},
  {path: 'productareaAdd', component: ProductareaAddComponent},
  {path: 'productkindManage', component: ProductkindManageComponent},
  {path: 'productkindAdd', component: ProductkindAddComponent},
  {path: 'prodSpections', component: ProdSpectionsComponent},
  {path: 'transInprice', component: TransInpriceComponent},
  {path: 'transOutprice', component: TransOutpriceComponent},
  {path: 'companySettle', component: CompanySettleComponent},
  {path: 'payChannelList', component: PayChannelListComponent},
  {path: 'payChannelAdd', component: PayChannelAddComponent},
  {path: 'fleetRatioManage', component: FleetRatioManageComponent},
  {path: 'vechileProdManage', component: VechileProdManageComponent},
  {path: 'lineCityManage', component: LineCityManageComponent},
  {path: 'appUseReport', component: AppUseReportComponent},
  {path: 'teamManage', component: TeamManageComponent},
  {path: 'berthManage', component: BerthManageComponent},
  {path: 'portalCrane', component: PortalCraneManageComponent},
  {path: 'teamUserManage', component: TeamUserManageComponent},
  {path: 'basicBankInformation', component: BasicBankInformationComponent},
  {path: 'lineProdManager', component: LineProdManageComponent},
  {path: 'transOutpriceHis', component: TransOutpriceHisComponent},
  {path: 'forkliftManage', component: ForkliftManageComponent},
  {path: 'bankBaseInformation', component: BankBaseInformationComponent},
  {path: 'commomAddressManage', component: CommomAddressManageComponent},
  {path: 'bargainInfo', component: BargainInfoComponent},
  {path: 'carManage', component: CarManageComponent},
  {path: 'carManageAdd', component: CarManageAddComponent},
  {path: 'carAuth', component: CarAuthComponent},
  {path: 'carbusinessAuth', component: CarbusinessAuthComponent},
  {path: 'transgroupMap', component: TransgroupMapComponent},
  {path: 'carrierManage', component: CarrierManageComponent},
  {path: 'carrierManageAdd', component: CarierManageAddComponent},
  {path: 'carSearch', component: CarSearchComponent},
  {path: 'userStatistics', component: UserStatisticsComponent},
  {path: 'loginStatistics', component: UserloginStatisticsComponent},
  {path: 'returnWaybill', component: ReturnWaybillComponent},
  {path: 'RGPriceTrend', component: RGPriceTrendComponent},
  {path: 'checkUserInfo', component: CheckUserInfoComponent},
  {path: 'pointDistance', component: PointDistanceComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseInformationRoutingModule {
}
