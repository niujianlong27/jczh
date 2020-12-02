import {environment} from '@env/environment';

 let transUrl = 'http://192.168.1.20:8040/trans/'; // 本地\
  let commissionUrl = 'http://192.168.1.20:8040/commission/'
//let transUrl = 'https://uat.jczh56.com/api/trans/'; // uat
// let transUrl = 'http://192.168.21.205:9106'; // 本地
if (environment.production) {
  transUrl = environment.baseUrlTrans; // 测试
  commissionUrl = environment.baseUrlCommission
}

export const TRANS_URLS = {
  // 运单
  getWaybill: `${environment.baseUrlContract}order/getWaybill`, //使用合同
  SELECT_WAYBILL: `${transUrl}waybill/getPage`,//分页查询运单列表
  INSERT_WAYBILL: `${transUrl}waybill/insert`,//新增运单
  UPDATE_WAYBILL: `${transUrl}waybill/update`,//修改运单
  DELETE_WAYBILL: `${transUrl}waybill/delete`,//作废运单
  updateConfirm: `${transUrl}waybill/updateConfirm`,//确认台账
  cancelWaybillMatch: `${transUrl}waybill/cancelWaybillMatch`,//确认台账

  GET_WAYBILL: `${transUrl}waybill/getWaybill`,//根据运单号查询运单
  IMPORT_WAYBILL: `${transUrl}waybill/importExcel`,//导入运单excel
  RETURN_WAYBILL: `${transUrl}waybill/waybillReturn`,//运单返单
  RETURN_WAYBILL_NRG: `${transUrl}waybill/waybillReturnWeb`,//非日钢单条返单
  RETURN_WAYBILL_NRG_MORE: `${transUrl}waybill/batchWaybillReturnWeb`,//非日钢批量返单
  waybillReturnV4: `${transUrl}waybill/waybillReturnV4`,//运单查询单条返单
  copyByWaybillNo: `${transUrl}waybill/copyWaybill`,//运单查询复制运单

  RETURN_WAYBILL_SYS: `${transUrl}waybill/getFeeRegPage`,//查询系统对接未登记未核价运单
  generateReports: `${transUrl}waybill/generateReports`,//价格匹配日照接口
  import: `${transUrl}waybillPack/import`,//营口数据导入
  exportListByWayBillModel: `${transUrl}waybillPack/exportListByWayBillModel`,//捆包明细导出
  orderAndItem: `${environment.baseUrlContract}orderItem/getorderAndItem`,//合同明细查询
  exportorderAndItem: `${environment.baseUrlContract}orderItem/exportorderAndItem`,//合同明细查询导出
  updateWaybillList: `${transUrl}waybill/updateWaybillList`,
  DispatchPdf: `${transUrl}waybill/DispatchPdf`, // 运单查询打印
  getScanCodeData: `${transUrl}waybill/getWaybillByMainProductListNo`,
  auditScanCodeData: `${transUrl}waybill/scanQRCodeReview`,

  // 运单捆包
  SELECT_WAYBILLPACK_BY_WAYBILL: `${transUrl}waybillPack/getListByWayBillModel`,//根据运单查询运单捆包
  DELETE_WAYBILLPACK: `${transUrl}waybillPack/delete`,//删除运单捆包信息（已作废）
  UPDATE_WAYBILLPACK: `${transUrl}waybillPack/updateList`,//修改运单捆包

  copyWaybill: `${transUrl}waybillProduct/copyWaybill`,//运输委托接受
  getWaybillBycomAndSettle: `${transUrl}waybillProduct/getWaybillBycomAndSettle`, // 运输委托查询

  // 运单司机
  SELECT_WAYBILLDRIVER_BY_WAYBILL: `${transUrl}waybillDriver/getListByWayBillModel`,//根据运单查询运单司机
  DELETE_WAYBILLDRIVER: `${transUrl}waybillDriver/delete`,//删除运单司机信息（已作废）
  selectWeightDetails: `${transUrl}waybill/selectWeightDetails`,//根据运单查询磅单

  matchingWaybill: `${transUrl}waybillCd/matchingWaybill`,//根据运单查询磅单
  auditReturn: `${transUrl}waybill/auditReturn`,//运单查询审核运单
  rejectWaybill: `${transUrl}waybill/rejectWaybill`,//运单查询驳回运单



// 委托
  SELECT_ORDER: `${environment.baseUrlContract}order/getPage`,//分页查询委托列表
  INSERT_ORDER: `${environment.baseUrlContract}order/insert`,//新增委托
  INSERT_ORDER1: `${transUrl}order/insertOrderAndItem`,//新增委托
  UPDATE_ORDER: `${environment.baseUrlContract}order/update`,//修改委托
  DELETE_ORDER: `${environment.baseUrlContract}order/delete`,//作废委托
  mergeOrder: `${environment.baseUrlContract}order/merge`,//合同生成页面 合同合并
  GET_ORDER: `${environment.baseUrlContract}order/getOrder`,//根据委托单号查询委托
  USE_ORDER: `${environment.baseUrlContract}order/insertOrderAndItem`,//使用订单接口
  importOrder: `${environment.baseUrlContract}order/importOrder`,//结案信息导入
  uploadOrder: `${environment.baseUrlContract}order/uploadOrder`,//上传
  uploadOrderList: `${environment.baseUrlContract}order/uploadOrderList`,//批量附件上传
  viewContractDetail: `${environment.baseUrlContract}order/viewContractDetail`,//存档查询
  saleCloseOne: `${environment.baseUrlContract}order/salecase`,//点击一条销售结案
  saleClosemore: `${environment.baseUrlContract}order/salescase`,//点击多条销售结案
  getOrderFinishWeight: `${transUrl}order/getOrderFinishWeight`,//获取返单总重量
  cancelMerger: `${environment.baseUrlContract}order/cancelMerger`,//取消合同合并


  seeOrder: `${environment.baseUrlContract}order/viewContractDetail`,//查看
  printOrder: `${environment.baseUrlContract}report/previewTransContract`,//打印
  backOrder: `${environment.baseUrlContract}order/rollbackContract`,//回退
  pickOrder: `${environment.baseUrlContract}order/updateBusinessNatureByTakeTheir`,//自提
  invalid: `${environment.baseUrlContract}order/invalid`,//合同管理 合同作废
  itemValid: `${environment.baseUrlContract}orderItem/itemValid`,//合同管理 明细作废
  integratedOrder: `${environment.baseUrlContract}order/updateBusinessNatureByOneVotePer `,//一票制
  exportOrder: `${environment.baseUrlContract}/order/exportOrder0 `,

  // 委托明细
  SELECT_ORDERITEM_BY_ORDER: `${environment.baseUrlContract}orderItem/getItemListByOrderModel`,//根据委托单查询委托明细

  // 委托捆包
  SELECT_ORDERPACK_BY_ORDER: `${environment.baseUrlContract}orderPack/getListByOrderModel`,//根据委托单询委托捆包
  SELECT_PLANORDERITEM_BY_ORDER: `${transUrl}orderPack/getPlanListByOrderModel`,//根据委托单查询委托明细(调度界面使用)

  // 调度
  SELECT_PLAN: `${commissionUrl}plan/getPage`,//分页查询调度列表
  INSERT_PLAN: `${commissionUrl}plan/insert`,//生成（新增）调度
  UPDATE_PLAN: `${commissionUrl}plan/update`,//修改调度
  GET_PLAN: `${commissionUrl}plan/getPlanModel`,//根据调度单号获取调度单信息
  DELETE_PLAN: `${commissionUrl}plan/delete`,//作废委托
  FORCE_FINISH_PLAN: `${commissionUrl}plan/forceFinish`,//强制完成调度
  CANCEL_PLAN: `${commissionUrl}plan/delete`,//撤销调度

  STOCKEXPORT: `${commissionUrl}sortMessage/stockExport`,//明细导出

  // 调度明细
  SELECT_PLANITEM_BY_PLAN: `${commissionUrl}planItem/getListByPlanModel`,//根据调度单查询调度明细

  // 调度司机
  SELECT_PLANDRIVER_BY_PLAN: `${transUrl}planDriver/getListByPlanModel`,//根据调度单查询司机

  OPEN_TENDER_REMIND: `${transUrl}ordertender/messagePush`, //  竞价单开始前十分钟提醒，长轮询


  // 竞价参与管理
  getOrderTender: `${transUrl}ordertender/getOrderTender`,// 主列表查询
  longPolling: `${transUrl}ordertender/longPolling`,//竞价长轮询

  selectPalletList: `${transUrl}ordertenderpallet/selectPalletList`,// 主列表查询
  selectPalletDetail: `${transUrl}ordertenderitem/selectPalletDetail`,// 货盘明细查询
  selectBalesDetail: `${transUrl}ordertenderpack/selectBalesDetail`,// 捆包明细查询
  insertOrderBid: `${transUrl}orderbid/insertOrderBid`,// 出价均价
  getBid: `${transUrl}ordertenderitem/getBid`,// 出价流向 品名
  getBidTwo: `${transUrl}ordertenderitem/getBidTwo`,// 出价流向 品名 新
  getMsgByFlowRightList: `${transUrl}orderbid/getMsgByFlowRightList`,// 出价流向 品名

  // 竞价评选管理
  getBiddingSelection: `${transUrl}ordertenderitem/getBiddingSelection`, // selection  竞价选择    results  竞价结果
  rebidding: `${transUrl}ordertender/rebidding`, //  重新竞价
  getTenderBidInfo: `${transUrl}ordertender/getTenderBidInfo`, //  出价弹框获取最低出价
  revokeTender: `${transUrl}ordertender/revokeTender`, //  撤销
  getBiddingSelectionHistory: `${transUrl}ordertenderitem/getBiddingSelectionHistory`, //  撤销
  bidSelect: `${transUrl}orderbid/bidSelect`, //  选择承运人
  // 竞价选择 /查看竞价结果
  getMsgByAvg: `${transUrl}orderbid/getMsgByAvg`, //  按均价
  getMsgByProductName: `${transUrl}orderbid/getMsgByProductName`, //  按品名
  getMsgByFlow: `${transUrl}orderbid/getMsgByFlow`, //  按流向
  getPalletDetails: `${transUrl}ordertenderitem/getPalletDetails`, //  按流向 按品名 子列表查询
  selelctPalletItemByContent: `${transUrl}ordertenderpallet/selelctPalletItemByContent`, //  货盘明细
  selectpalletPackContent: `${transUrl}ordertenderpack/selectpalletPackContent`, //  捆包明细

  //排产计划
  selectSchedulePlan: `${transUrl}schedulePlan/selectSchedulePlan`,//查询
  ImportSchedulePlan: `${transUrl}schedulePlan/insertSchedulePlan`,//导入
  exportSchedule: `${transUrl}schedulePlan/exportExcel`,
  saveSchedulePlanList: `${transUrl}schedulePlan/saveSchedulePlanList`,//保存
  deleteSchedulePlanList: `${transUrl}schedulePlan/deleteSchedulePlanList`,//删除


  //发货通知单
  selectDeliveryNotice: `${transUrl}deliveryNotice/selectDeliveryNotice`,//查询
  importDeliveryNotice: `${transUrl}deliveryNotice/insertDeliveryNotice`,//导入
  exportSchedulePlan: `${transUrl}deliveryNotice/exportExcel`,//导出
  //品种车型对照
  getVechileProd: `${transUrl}vechileProd/getVechileProd`,//查询
  insertVechileProd: `${transUrl}vechileProd/insertVechileProd`,//新增
  deleteVechileProd: `${transUrl}vechileProd/deleteVechileProd`,//删除
  updateVechileProd: `${transUrl}vechileProd/updateVechileProd`,//修改

  // 评标管理
  getFleetRatio: `${transUrl}fleetRatio/getFleetRatio`,//查询
  insertFleetRatio: `${transUrl}fleetRatio/insertFleetRatio`,//插入
  deleteFleetRatio: `${transUrl}fleetRatio/deleteFleetRatio`,//删除
  updateFleetRatio: `${transUrl}fleetRatio/updateFleetRatio`,//修改
  importFleetRatio: `${transUrl}fleetRatio/importFleetRatio`,//导入

  //合同草稿管理
  selectDraftOrder: `${environment.baseUrlContract}order/getOrderStatus`,//查询
  effectDraftOrder: `${environment.baseUrlContract}order/getStatus`,//生效
  matchDraftOrder: `${environment.baseUrlContract}order/matchTransContractPriceList`,//价格匹配
  exportDraftOrder: `${environment.baseUrlContract}order/exportOrder`,

  matchDraftOrderList: `${environment.baseUrlContract}order/matchTransContractPriceList3`,//合同管理价格匹配

  //省内分货
  cargoList: `${transUrl}sortMessage/selectSortMessage`,//列表接口
  cargoList2: `${transUrl}sortMessage/selectDetailMessage`,//右侧列表接口
  cargoDetailList: `${transUrl}sortMessage/selectDetailMessage`,//获取详情列表
  cargoSave: `${transUrl}sortMessage/saveSortMessage`,//保存接口
  exportCargo: `${transUrl}sortMessage/sortExport`,//导出
  createOrder: `${transUrl}sortMessage/createSortMessage`,//生成委托


  //分货跟踪
  cargoTraceList: `${transUrl}splitProd/selectSplitProd`,//列表接口
  cargoTraceLine: `${environment.baseUrl}lineCity/getLineCity`,//线路
  cargoTraceLine2: `${environment.baseUrl}lineCity/getLineCityTwo`,//线路2
  splitProdExport: `${transUrl}splitProd/splitProdExport`,//导出接口

  //运输跟踪报表
  traceReportList: `${transUrl}transReport/getPage`,//列表接口
  traceReportListMonthSum: `${transUrl}transReport/getMonthSum`,//月汇总
  exportTransTrack: `${transUrl}transReport/exportTransTrack`,//运输跟踪报表导出

  //发运单报表
  getShipmentReportByType: `${transUrl}Shipment/getShipmentReportByType`,//按品种
  getShipmentReportByCity: `${transUrl}Shipment/getShipmentReportByCity`,//按区域

  exportShipmentByCity: `${transUrl}Shipment/exportShipmentByCity`, //导出按区域
  exportShipmentByType: `${transUrl}Shipment/exportShipmentByType`,//发运量品种导出

  //到货跟踪报表查询
  arrivalReport: `${transUrl}waybill/arrivalReport`,
  exportArrivalReport: `${transUrl}waybill/exportArrivalReport`, //导出

  //委托调度
  getEntrust: `${commissionUrl}order/selectPage`,//查询主表信息
  getEntrustItem: `${commissionUrl}orderItem/selectItemListByOrderModel`,//查询子表信息
  deleteEntrust: `${commissionUrl}order/deleteOrderWT`,//删除
  getPlateCompanyName: `${commissionUrl}order/getPlateCompanyName`,//获取车队信息
  useBidResult: `${commissionUrl}order/getTenderTeam`,//使用招投标结果
  saveEntrust: `${commissionUrl}order/insertTorder`,//调度到车队
  saveSchedule: `${commissionUrl}order/insertDriverToOrder`,//调度到车辆
  getDriver: `${commissionUrl}order/getDriver`,//获取车辆信息
  insertDriverOfFleet: `${commissionUrl}order/insertDriverOfFleet`,//调度信息
  AddEntrust: `${commissionUrl}order/addOrderWT`,
  updateEntrust: `${commissionUrl}order/updateOrderWT`,
  selectEntrust: `${commissionUrl}order/selectOrderWT`,
  getFleetTender: `${environment.baseUrlTender}tender/getTenderResultByTenderNo`,//获得中标车队
  updateWeight:`${commissionUrl}order/updateWeight`,//修改重量
  consignorCompanyAddSchedule:`${commissionUrl}order/shipperAddPlanAndOrderWT`,
  getOutPrice:`${commissionUrl}order/waybillRecommendedPrice`,
  logOutPrice:`${commissionUrl}order/waybillPriceLog`,
  AutoCargo:`${commissionUrl}order/splitorder`,

  getCarTeam: `${commissionUrl}order/getFleetToApp`,   // 获取车队信息

  //委托查询
  getEntrustInfo: `${commissionUrl}order/selectOrderModel `,
  getEntrustInfoItem: `${commissionUrl}orderItem/selectItemByOrderModel`,
  returnEntrust: `${commissionUrl}order/revokeOrderWT`,
  getWaybillinfo: `${transUrl}waybillProduct/getWaybillByOrderNo`,
  exportExcelALLWT: `${commissionUrl}order/orderWTExport`,

  //调度查询
  getSchedullInfo: `${commissionUrl}plan/selectPage `,
  getSchedullInfoItem: `${commissionUrl}planItem/selectListByPlanModel `,
  addScheduleInfo: `${commissionUrl}order/addPlanAndOrderWT `,//新增调度单
  cancleScheduleInfo: `${commissionUrl}plan/driverCancelPlan `,//强制完成
  againScheduleInfo: `${commissionUrl}plan/againPlan `,//重新下发
  selectSchedule: `${commissionUrl}plan/getPlanModel `,
  selectLastprovince: `${commissionUrl}plan/getEndPointInf  `,
  importScheduleInfo: `${commissionUrl}order/importPlan`,//导入
  selectNewDriver: `${transUrl}waybill/isNewDriver`,//判断是否为新人新车


  //运输补单
  selectOldPlan: `${commissionUrl}plan/getSupplementCD`,
  saveOldPlan: `${commissionUrl}order/updatePickNo`,

  //核对明细
  getWaybillPackCheck: `${transUrl}waybillPack/getWaybillPackCheck`, // 查询
  exportListWaybillPackCheck: `${transUrl}waybillPack/exportListWaybillPackCheck`, // 导出

  //运单核对对账
  waybillPackCheck: `${transUrl}waybillPackCheck/getWaybillPackCheck`, // 查询
  waybillPackCheckexportList: `${transUrl}waybillPackCheck/exportListWaybillPackCheck`, // 导出

  // 调度签到查询
  getScheduleCheckIn: `${commissionUrl}plan/selectPlanToShipper `,
  //成都管厂新查询
  getScheduleInfoCDGC: `${commissionUrl}plan/selectPage`,
  returnScheduleInfo:`${commissionUrl}plan/cancelPlanToCDGC`,
  //合同作废
  getDelOrderPage: `${environment.baseUrlContract}order/getDelOrderPage`,//分页查询合同作废
  exportScrapRecords: `${environment.baseUrlContract}order/exportScrapRecords`,//合同作废导出


  //运单载重标记
  wayBillsByCondition: `${transUrl}waybill/wayBillsByCondition`,//查询
  updatewayBillsByCondition: `${transUrl}waybill/updatewayBillsByCondition`,//查询

//  运单实际匹配
  getNoWeightPage: `${transUrl}waybill/getNoWeightPage`,//查询
  waybillMath: `${transUrl}waybill/waybillMatch`,//查询

  //运单台账
  getWaybillcd: `${transUrl}waybill/getWaybillcd`, //查询
  updateByNo: `${transUrl}waybill/updateByNo`, //查询
  exportWaybillParameter: `${transUrl}waybill/exportWaybillParameter`, //导出
  updateWaybillBySettleWeight: `${transUrl}waybillCd/updateWaybillBySettleWeight`, //修改运单重量
  updateWaybillBySettleWeightV2: `${transUrl}waybill/updateWeightBySaleInfo`, //修改运单重量
  updateWaybillConsignee: `${transUrl}waybillCd/updateWaybillConsignee`, //修改承运人
  // importWaybillExcel: `${transUrl}waybillCd/wayBillLead`,   // 导入Excel
  importWaybillHS: `${transUrl}waybillCd/importWaybillHS`,   // 导入Excel

  importWaybillExcel: `${transUrl}waybillCd/importWaybillGC`,   // 导入Excel
  //x销售单台账
  getOrderHdWaybill: `${transUrl}waybillCd/getOrderHdWaybill`, //查询
  exportWaybillSales: `${transUrl}waybill/exportWaybillSales`, //导出

  updateRemark: `${transUrl}waybillProduct/updateRemark`, //修改发货跟踪报表备注

//   合同协议查询
  selectRecord: `${environment.baseUrlContract}outlineAgreement/selectRecord`, //主表查询
  selectItemRecord: `${environment.baseUrlContract}outlineAgreement/selectItemRecord`, //子表查询
  deleteRecord: `${environment.baseUrlContract}outlineAgreement/deleteRecord`,// 删除
  outlineexport: `${environment.baseUrlContract}outlineAgreement/export`,// 导出
  outlineAgreementPdf: `${environment.baseUrlContract}outline/outlineAgreementPdf`,
  updateStatus: `${environment.baseUrlContract}outlineAgreement/updateStatus`, //终止

//  合同协议登记
  selectAllByNo: `${environment.baseUrlContract}outlineAgreement/selectAllByNo`, //查询
  saveRecord: `${environment.baseUrlContract}outlineAgreement/saveRecord`, //查询


//地磅登记和地磅查询
  getListScaleLoadManagement: `${transUrl}scaleLoadManagement/getListScaleLoadManagement `,//查询主表
  getListScaleLoadManagementSon: `${transUrl}scaleLoadManagement/getListScaleLoadManagementSon  `,//查询子表
  insertScaleLoadManagement: `${transUrl}scaleLoadManagement/insertScaleLoadManagement  `,//增加主表    地磅登记
  //insertScaleLoadManagementSon: `${transUrl}scaleLoadManagement/insertScaleLoadManagementSon `,//增加子表   地磅登记
  updateScaleLoadManagement: `${transUrl}scaleLoadManagement/updateScaleLoadManagement   `,//修改主表
  //updateScaleLoadManagementSon: `${transUrl}scaleLoadManagement/updateScaleLoadManagementSon  `,//修改子表
  deleteListScaleLoadManagement: `${transUrl}scaleLoadManagement/deleteListScaleLoadManagement  `,//删除主表
  //deleteListScaleLoadManagementSon: `${transUrl}scaleLoadManagement/deleteListScaleLoadManagementSon  `,//删除子表
  importListScaleLoadManagement: `${transUrl}scaleLoadManagement/importListScaleLoadManagement `,//导入主表
  //importListScaleLoadManagementSon: `${transUrl}scaleLoadManagement/importListScaleLoadManagementSon   `,//导入子表

  //批量派车
  getBatchSchedule:`${commissionUrl}planTemplate/selectPage`,//查询
  saveBatchSchedule:`${commissionUrl}planTemplate/insertOrUpdate`,//保存
  deleteBatchSchedule:`${commissionUrl}planTemplate/deletePlanTemplateList`,//删除
  useBatchSchedule:`${commissionUrl}planTemplate/generatePlanAndOrderWT`,//使用
  updateConsigneeCompanyId: `${transUrl}waybill/updateConsigneeCompanyId`,//结算单修改收货单位

  //发货跟踪报表
  getTrackReport:`${transUrl}waybillProduct/getWaybillGc`,

  exportTrackReport:`${transUrl}waybillProduct/waybillExport`,

  // 运单查询（结算）
  settleV2Export:`${environment.baseUrlSettle}settleV2/export`,
  settleV2GetPage:`${environment.baseUrlSettle}settleV2/getPage`,

};


let sysUrl = 'http://127.0.0.1:8040/system/';
if (environment) {
  sysUrl = environment.baseUrlSystem;
}
export const SYS_URLS = {
  // 业务板块
  SELECT_BUSI_SEGMENT: `${sysUrl}busiSegment/getCompanyBusiSegment`, // 业务板块查询

  SELECT_DRIVER: `${sysUrl}user/selectDriver`, // 查询司机

  SELECT_COMPANY_FLOW: `${sysUrl}flow/getCompanyFlow`, // 查询该公司所有运输方式

  UPLOAD_GETPOLICY: `${sysUrl}getPolicy`, // 上传图片
};

let settleUrl = 'http://127.0.0.1:8040/settle/';
if (environment) {
  settleUrl = environment.baseUrlSettle;
}

export const SETTLE_URLS = {
  ADD_TRANS_FEE_PRICE: `${settleUrl}settle/addTransFeePrice`, //生成结算单
  GENERATE_RECEIVABLE_SETTLE: `${settleUrl}settle/generateReceivableSettleByWaybill`, //生成应收结算单
  GENERATE_COPE_SETTLE: `${settleUrl}settle/generateCopeSettleByWaybill`, //生成应付结算单
};
