// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://172.16.30.163:9030/', // 系统模块
  baseUrlTrans: 'http://192.168.0.105:9034/', // 运输模块
  baseUrlCommission: 'http://192.168.1.44:8040/commission/',
  baseUrlGoodsAllocation: 'https://dev.jczh56.com/api/goods-allocation/',
  baseUrlTransPlan: 'http://localhost:9038/', // 运输计划模块
  baseUrlModelManage: 'http://localhost:9230/', // 模型管理Python模块
  baseUrlAllocate: 'http://localhost:9206/', // 单车分货Python模块
  baseUrlSettle: 'http://127.0.0.1:9036/', // 结算模块
  baseUrlSystem: 'http://172.16.30.163:9030/', // 系统模块
  // baseUrlSystem2: 'http://192.168.1.20:8040/system2/',
  baseUrlBid: 'http://172.16.30.163:2006/', // 预招投标模块
  baseUrlStock: 'http://192.168.1.44:8040/stock/', // 金星 //库存模块
  baseUrlDisp: 'http://172.16.30.163:2222/', // 排队模块
  baseUrlPort: 'http://172.16.30.163:9102/', // 港口模块
  baseUrlTrack: 'http://172.16.30.163:8040/track/',
  baseUrlContract: 'http://192.168.1.20:9106/', // 合同模块
  baseUrlInter: 'http://172.16.30.163:9106/', // 接口服务
  baseUrlSea: 'http://172.16.30.163:8040/sea-trans/', // 海运
  baseUrlTender: 'http://192.168.8.166:9108/',  // 汽运招投标
  baseUrlMessage: 'http://192.168.21.185:9040/', // 消息中心
  baseUrlRgDispatch: 'http://192.168.21.102:9044/', // 日钢排队
  baseUrlRzsteelWarehouse: 'http://192.168.1.18:9045/', // 日钢成品仓库排队
  baseUrlSocket: 'http://172.16.30.163:9099/',  //socket
  baseUrlHomePage: 'http://192.168.1.27:9240/', // 官网首页
  baseUrlStockManage: 'http://192.168.21.146:9110/', // 仓储管理
  baseUrlStorage: 'http://192.168.1.20:8040/storage/',
  baseUrlGCDispatch: 'http://192.168.1.44:8040/gc-dispatch/', // 管厂排队
  baseUrlBooking: 'http://192.168.1.44:8040/booking/', // Booking
  baseUrlManage:'http://192.168.1.26:9016/',
  baseUrlShipper: 'http://192.168.1.20:8040/shipper/',
  /* baseUrl:'http://192.168.8.189:8040/system/',

   baseUrlTrans: 'http://192.168.8.189:8040/trans/',
   baseUrlSettle: 'http://192.168.8.189:8040/settle/',
   baseUrlSystem: 'http://192.168.8.189:8040/system/',
   baseUrlBid:'http://192.168.8.193:2006/',
   baseUrlStock:'http://192.168.8.189:8040/system/',
   baseUrlDisp:'http://192.168.8.189:8040/',*/
  hmr: false
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

