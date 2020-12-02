import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuardService } from '../common/guard/auth-guard.service';
/*后台模块路由*/
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {noReuse: true},
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }, // 系统主页
      { path: 'customer', loadChildren: './sysmodule/customer/customer.module#CustomerModule' }, // 客户管理
      { path: 'systemSet', loadChildren: './sysmodule/sys-set/sys-set.module#SysSetModule' }, // 系统设置
      { path: 'userManage', loadChildren: './sysmodule/user-manage/user-manage.module#UserManageModule' }, // 用户管理
      { path: 'appManage', loadChildren: './sysmodule/app-manage/app-manage.module#AppManageModule' }, // app管理
      { path: 'sysPermission', loadChildren: './sysmodule/sys-permission/sys-permission.module#SysPermissionModule' }, // 系统权限
      { path: 'feeRegister', loadChildren: './settlementModule/fee-reg/fee-reg.module#FeeRegModule' }, // 费用登记
      { path: 'receivableManage',
      loadChildren: './settlementModule/receivable-manage/receivable-manage.module#ReceivableManageModule' }, // 应付管理
      { path: 'baseInformation', loadChildren: './sysmodule/base-information/base-information.module#BaseInformationModule'}, // 基础信息
      { path: 'paymentManage', loadChildren: './settlementModule/payment-manage/payment-manage.module#PaymentManageModule'}, // 应付管理
      { path: 'accountInformation',
      loadChildren: './sysmodule/account-information/account-information.module#AccountInformationModule'}, // 账户信息
      { path: 'trans', loadChildren: './trans/trans.module#TransModule'}, // 运输模块
      { path: 'disp', loadChildren: './disp/disp.module#DispModule'}, // 排队模块
      { path: 'stock', loadChildren: './stockModule/stock-manage/stock-manage.module#StockManageModule'}, // 仓储模块
      { path: 'shStock', loadChildren: './stockModule/shstock-manage/shstock-manage.module#ShstockManageModule'}, // 仓储散货模块
      { path: 'pretender', loadChildren: './tenderModule/pretender-manage/pretender-manage.module#PretenderManageModule'}, // 预招标管理
      { path: 'planManage', loadChildren: './portModule/plan-manage/plan-manage.module#PlanManageModule'}, // 港口   计划管理模块
      { path: 'portOperate', loadChildren: './portModule/port-operate/port-operate.module#PortOperateModule'}, // 港口   港口作业模块
      { path: 'portReport', loadChildren: './portModule/port-report/port-report.module#PortReportModule'}, // 港口   港口作业模块
      { path: 'logisticsTrack', loadChildren: './logistics-track/logistics-track.module#LogisticsTrackModule'}, // 物流全程追踪
      { path: 'contractManage', loadChildren: './contractModule/contract-manage/contract-manage.module#ContractManageModule'}, // 合同模块  合同管理
      { path: 'linePriceManage', loadChildren: './contractModule/price-manage/price-manage.module#PriceManageModule'}, // 合同模块  线路价格管理
      { path: 'report', loadChildren: './report/report.module#ReportModule'}, // 报表模块
      { path: 'sea', loadChildren: './sea/sea.module#SeaModule'}, // 海运
      { path: 'plan', loadChildren: './plan/plan.module#PlanModule'}, // 计划管理
      { path: 'bidding', loadChildren: './bidding/bidding.module#BiddingModule'}, // 竞价管理
      { path: 'transport', loadChildren: './transportation-manage/transportation-manage.module#TransportationManageModule'}, // 车辆提送管理
      { path: 'message', loadChildren: './message/message.module#MessageModule'}, // 消息管理
      { path: 'rg-disp', loadChildren: './rg-disp/rg-disp.module#RgDispModule'}, // 日钢排队
      { path: 'queue-product', loadChildren: './warehouse/warehouse.module#WarehouseModule'}, // 日钢出库排队
      { path: 'goods-allocation', loadChildren: './goods-allocation/goods-allocation.module#GoodsAllocationModule'},
      { path: 'stock-manage', loadChildren: './stock-manage/stock-manage.module#StockManageModule'},
      { path: 'gcDispatch', loadChildren: './gc-dispatch/gc-dispatch.module#GcDispatchModule' }  //管厂排队
    ], canLoad: [AuthGuardService], canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysmanageRoutingModule { }
