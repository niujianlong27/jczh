import {environment} from '../../../environments/environment';

export const localUrls = {
  //应收结算报表形成
  getFormUrl1: `${environment.baseUrlSettle}settleOrder/selectSettleOrderGroupByWaybillNo`,//按运单
  getFormUrl2: `${environment.baseUrlSettle}settleOrder/selectSettleOrderGroupByPickNo`,//按合同号
  //应收结算报表页面
  getColumnsUrl: `${environment.baseUrl}userColumn/getUserColumns`,//获取列
  getSettleReportUrl: `${environment.baseUrlSettle}settleReport/getSettleReport`,//获取主表数据
  getFeeListUrl: `${environment.baseUrlSettle}settleFee/selectReportFee`,//费用清单列表
  getFeeDetailUrl: `${environment.baseUrlSettle}settleFee/selectReportFee`,//费用明细
  getGoodsDetailUrl: `${environment.baseUrlSettle}waybillpack/selectReporPack`,//货物明细
  modalConfirmUrl: `${environment.baseUrlSettle}settleinv/insertReprotInv`,//弹窗点击确定的接口
  insertReprotInvs: `${environment.baseUrlSettle}settleinv/insertReprotInvs`,//批量开票申请的接口
  settlementReportDeleteUrl: `${environment.baseUrlSettle}settleReport/toVoid`,//作废接口
  creatPaymentReport: `${environment.baseUrlSettle}settleReport/insertBySettleReportToPayReport`,//生成应付报表按钮
  received: `${environment.baseUrlSettle}settleReport/received`,//已接收按钮
  changeBusinessModuleId: `${environment.baseUrlSettle}kingDee/modifySettleRecSegment`,//业务公司
  JDExport: `${environment.baseUrlSettle}kingDee/exportSettleRecData`,//金蝶导出


  //收款登记
  getPaymentRegListUrl: `${environment.baseUrlSettle}settleRec/getSettleRec`,//列表接口
  addPaymentRegUrl: `${environment.baseUrlSettle}settleRec/insertSettleRec`,//增加接口
  deletePaymentRegUrl: `${environment.baseUrlSettle}settleRec/deleteSettleRec`,//作废接口
  importSettleRecUrl: `${environment.baseUrlSettle}settleRec/importExcel`,//导入接口
  getBankInfo: `${environment.baseUrlSystem}companyBank/selectCompanyBank`,//获取银行卡信息
  refreshInfo: `${environment.baseUrlSettle}settleRec/construction`,
  exportSettleRec: `${environment.baseUrlSettle}settleRec/exportSettleRec`, //导出
  modifyBussinessMark: `${environment.baseUrlSettle}settleRec/modifyBussinessMark`,//作废接口


  //发票信息
  getInvoiceInfoListUrl: `${environment.baseUrlSettle}settleinv/selectSettleInv`,//列表接口
  invoiceSaveUrl: `${environment.baseUrlSettle}settleinv/updateInvDateList`,//保存接口
  invoiceDetailUrl: `${environment.baseUrlSettle}settleinvitem/selectInvItem`,//发票明细
  invoiceFeeDetailUrl: `${environment.baseUrlSettle}settleFee/selectSettleFeeByInv`,//费用明细
  InvoicesellerPush: `${environment.baseUrlSettle}Invoice/sellerPush`,//费用明细
  InvoicesellerPushNull: `${environment.baseUrlSettle}Invoice/getCompanySettle`,
  billingHistory: `${environment.baseUrlSettle}Invoice/billingHistory`, //发票管理 历史
  invoiceAuditUrl: `${environment.baseUrlSettle}settleinv/updateInvAuditStatus`,    //审核接口

  dataSelectModalListUrl: `${environment.baseUrl}company/getCompanyByName`,//数据下拉框弹窗列表接口
  feeSearchDelUrl: `${environment.baseUrlSettle}settleFee/deleteCancellationFee`,//费用登记查询页面作废接口
  export: `${environment.baseUrlSettle}settle/export`,//费用登记查询导出

  createInvoiceAndInvoiceItem: `${environment.baseUrlSettle}invoice/createInvoiceAndInvoiceItem`, // 开票并打印

  //应收核价
  checkPriceUrl: `${environment.baseUrlTrans}waybill/selectWaybillTransFeePricingList`,//应收核价列表接口
  checkPriceCheckUrl: `${environment.baseUrlSettle}settle/addReceivableTransFeePricing`,//核价接口

  //平账审核
  accountAuditListUrl: `${environment.baseUrlSettle}flatfee/selectFlatfeeByApply`,//列表接口
  accountCheckPassUrl: `${environment.baseUrlSettle}flatfee/updateAuditingFlatfee`,//审核通过按钮
  accountCancelReviewUrl: `${environment.baseUrlSettle}flatfee/updateRecallAuditingFlatfee`,//撤销审核按钮
  accountCancelApplyUrl: `${environment.baseUrlSettle}flatfee/deleteRecallFlatfee`,//撤销申请按钮
  selectFlatfeeItem: `${environment.baseUrlSettle}flatfee/selectFlatfeeItem`, //grid2列表
  manualFlatAccountExamine: `${environment.baseUrlSettle}settleRec/manualFlatAccountExamine`,//确认审核
  manualFlatAccountRevoke: `${environment.baseUrlSettle}settleRec/manualFlatAccountRevoke`,//手工平账审核撤销
  manualFlatAccountDelete: `${environment.baseUrlSettle}settleRec/manualFlatAccountDelete`,//手工平账申请撤销

  //应付结算报表
  paymentReportListUrl: `${environment.baseUrlSettle}payreport/getPayReport`,//应付结算报表列表接口
  paymentReportChildrenListUrl1: `${environment.baseUrlSettle}settleFee/selectPayReportFee`,//应付结算报表费用明细
  paymentReportChildrenListUrl2: `${environment.baseUrlSettle}waybill/getWayBillByNo`,//应付结算报表货物明细（临时）
  paymentReportInvalidUrl: `${environment.baseUrlSettle}payreport/updatePayReportByNo`,//应付结算报表作废接口
  paymentReportReconciliation: `${environment.baseUrlSettle}payreport/reconciliation`,//应付结算报表发起对账接口
  paymentReportReconciliations: `${environment.baseUrlSettle}payreport/reconciliations`,//应付结算报表转代收代付
  paymentReportgenerateInfoFeePayment: `${environment.baseUrlSettle}payreport/generateInfoFeePayment`,//生成结算报表接口
  payreportInsert: `${environment.baseUrlSettle}payreport/insert`,
  updatePayRegister: `${environment.baseUrlSettle}payreport/updatePayRegister`,// 付款登记
  deletePayReportByNo: `${environment.baseUrlSettle}payreport/deletePayReportByNo`,// 删除明细
  insertPayReportSub: `${environment.baseUrlSettle}payreport/insertPayReportSub`,// 添加到结算报表



  //对账确认列表
  paymentReportConfirm: `${environment.baseUrlSettle}payreport/confirmationList`,//应付结算报表列表接口

  //付款申请登记
  paymentRegistListUrl1: `${environment.baseUrlSettle}payreport/getSelectPayPeportByFee`,//付款申请登记弹窗结算报表列表接口
  paymentRegistListUrl2: `${environment.baseUrlSettle}settleFee/getSelectFeeByPayPayment`,//付款申请登记弹窗结算单列表接口
  paymentRegistConfirmUrl1: `${environment.baseUrlSettle}settle/getSelectByFeeByOrder`,//付款申请登记弹窗结算报表确定接口
  paymentRegistConfirmUrl2: `${environment.baseUrlSettle}settle/getSelectByFeeByOrderList`,//付款申请登记弹窗结算单号确定接口
  paymentRegistCreateUrl2: `${environment.baseUrlSettle}payment/insertByPaymentByFee`,//付款申请登记添加请款单
  payment: `${environment.baseUrlSettle}print/payment`,//付款申请登记打印

  //付款申请查询
  paymentSearchListUrl: `${environment.baseUrlSettle}payment/getBillingInformation`,//付款申请查询  费用信息列表
  paymentSearchListUrl2: `${environment.baseUrlSettle}payment/getWaybill`,//付款申请查询  运输信息列表
  paymentSearchDelUrl: `${environment.baseUrlSettle}payment/deleteList`,//付款申请查询  作废
  getBillingInformationExport: `${environment.baseUrlSettle}payment/getBillingInformationExport`,//付款申请查询导出


  //付款申请审核
  paymentAuditRecordUrl: `${environment.baseUrlSettle}payment/getReview`,//申请记录
  paymentAuditDetailUrl: `${environment.baseUrlSettle}waybill/getApplyDetai`,//费用明细
  paymentAuditChecklUrl: `${environment.baseUrlSettle}payment/updateReview`,//审核
  paymentAuditDeleteUrl: `${environment.baseUrlSettle}payment/updateRepealReview`,//撤销审核
  //付款登记
  payRegGetUrl: `${environment.baseUrlSettle}payment/getSelectByPayment`,//付款登记 查询接口
  payRegSaveUrl: `${environment.baseUrlSettle}paypayment/insertPayPaymentByNo`, //付款登记 新增接口
  getAmount: `${environment.baseUrlSettle}payment/getSelectByAmountList`,//获取金额
  getSumAmount: `${environment.baseUrlSettle}payment/getSumAmount`,//批量支付金额汇总
  getOnlinePay: `${environment.baseUrlSettle}paypayment/getOnlinePay`,// 在线支付
  updateReject: `${environment.baseUrlSettle}payment/updateReject`,// 驳回

  //收票信息
  collectInformationGetUrl: `${environment.baseUrlSettle}paymentInv/selectPayment`,//收票信息  查询接口
  collectInformationSaveUrl: `${environment.baseUrlSettle}paymentInv/insertPaymentList`,//收票信息 新增-保存接口
  importSave: `${environment.baseUrlSettle}paymentInv/importSave`,//收票信息 导入接口
  selectCompanyFee: `${environment.baseUrlSettle}paymentInv/selectCompanyFee`,//收票信息 费用类型获取
  invoiceScanAndUpload: `${environment.baseUrlSettle}paymentInv/invoiceScanAndUpload`,//收票管理，扫描上传
  collectGetUrl: `${environment.baseUrlSettle}paymentInv/selectInvItem`,//收票信息子表  查询接口
  exportSave: `${environment.baseUrlSettle}paymentInv/exportInvItem`,//收票信息 导出接口

  //油款解冻
  oilUnfreezeListUrl1: `${environment.baseUrlSettle}payment/selectFrozenPaymentList`,//已冻结列表接口
  oilUnfreezeListUrl2: `${environment.baseUrlSettle}paymentOil/selectThawingPaymentOilList`,//未冻结列表接口
  oilUnfreezeAddUrl: `${environment.baseUrlSettle}payment/updateThawingPayment`,//油款解冻按钮接口
  oilRefreezeAddUrl: `${environment.baseUrlSettle}paymentOil/updateFrozenPaymentOil`,//油款重新冻结接口

  //应付油款
  payOilListUrl: `${environment.baseUrlSettle}payment/selectOilPayablePaymentList`,//应付油款列表接口

  //获取地点的接口
  pointUrl: `${environment.baseUrl}address/getAddress`,//获取地址的接口
  addPoint: `${environment.baseUrl}point/insertPoint`,//添加地址接口


  judgmentReport: `${environment.baseUrlSettle}GenerateSettlementReortController/judgmentReport`,//统计
  //应付结算报表形成
  selectStatisticalInfo: `${environment.baseUrlSettle}settleFee/selectStatisticalInfo`,//统计
  getWorkPart: `${environment.baseUrlSystem}busiSegment/getBusiSegment`,//获取业务板块
  insertBatchPayReport: `${environment.baseUrlSettle}payreport/insertBatchPayReport`,//应付结算报表批量生成确认
  addPayReportByWaybillNo: `${environment.baseUrlSettle}payreport/addPayReportByWaybillNo`,//按运单号生成报表

  //应收结算报表形成
  insertBatchSettleReport: `${environment.baseUrlSettle}settleReport/insertBatchSettleReport`,//应收结算报表批量生成确认
  exportReceiveSettle: `${environment.baseUrlSettle}settleFee/exportReceiveSettle`,//应收报表生成导出

  //预投标管理
  selectAggregate: `${environment.baseUrlBid}prebid/select-aggregate`,//弹窗列表接口
  prebidBid: `${environment.baseUrlBid}prebid/bid`,//弹窗确定接口
  //应收报表导出
  selectSettleReport7: `${environment.baseUrlSettle}settleReport/selectSettleReport7`,//应收查询
  exportSettleReport: `${environment.baseUrlSettle}settleReport/exportSettleReport`,//
  //批量生成报表
  insertSettleReportV2: `${environment.baseUrlSettle}settleReport/insertSettleReportV2`,
  //应付报表导出
  payreportSelectSettleReport7: `${environment.baseUrlSettle}payreport/selectPayReport7`,//应付查询
  payreportExportSettleReport: `${environment.baseUrlSettle}payreport/exportPayReport`,//应付导出
  settleExportSettle: `${environment.baseUrlSettle}settleFee/exportSettle`,//应付报表生成导出
  //收款报表导出
  selectListByCount: `${environment.baseUrlSettle}settleRec/selectListByCount`,//应收查询
  exportStatistics: `${environment.baseUrlSettle}settleRec/exportStatistics`,//应收导出
  //付款报表导出
  selectReportForm: `${environment.baseUrlSettle}paypayment/selectReportForm`,//应付查询
  paymentStatistics: `${environment.baseUrlSettle}paypayment/paymentStatistics`,//应付导出
  // 开票信息统计报表
  invoicingStatistics: `${environment.baseUrlSettle}settleinv/invoicingStatistics`,//开票查询
  exportInvoicing: `${environment.baseUrlSettle}settleinv/exportInvoicing`,//开票导出
  //收票信息统计报表
  selectInvReport: `${environment.baseUrlSettle}paymentInv/selectInvReport`,//收票查询
  exportInvReport: `${environment.baseUrlSettle}paymentInv/exportInvReport`,//收票导出

  //运费登记
  ifSetReport: `${environment.baseUrlSettle}GenerateSettlementReortController/ifSetReport `,//结算单状态判断
  settleV2Check: `${environment.baseUrlSettle}settleV2/check`,// 价格匹配前检查
  getListByWayBillModel: `${environment.baseUrlSettle}settleV2/getListByWayBillModel`, //运费登记子表查询
  generateReports: `${environment.baseUrlSettle}settleV2/generateReports`,//价格匹配日照接口

//合同报表
  selectOrder: `${environment.baseUrlTrans}order/getContractInfo`,//查询
  exportOrder: `${environment.baseUrlTrans}order/ContractExport`,//导出

  //运单信息统计
  getTWaybillModel: `${environment.baseUrlTrans}waybill/getTWaybillModel`,//查询
  exportWaybill: `${environment.baseUrlTrans}waybill/exportWaybill`,//导出

  //财务付款导出
  ExportByPayment: `${environment.baseUrlSettle}payment/exportByPayment`,

  //财务付款查询导出
  exportByPayPatment: `${environment.baseUrlSettle}paypayment/exportByPayPatment`,

// 开票
  exportInvAuditStatus: `${environment.baseUrlSettle}settleinv/exportInvAuditStatus`, //导出
  exportInvAuditStatusJD: `${environment.baseUrlSettle}kingDee/exportInvoiceData`, //金蝶导出
  importInvocieApplyExcel: `${environment.baseUrlSettle}settleinv/importInvocieApplyExcel`,//收票信息 导入接口
  cancellInvoiceApply: `${environment.baseUrlSettle}settleinv/cancellInvoiceApply`,// 作废

  // 日对账
  getPaymentAccoutResultList:`${environment.baseUrlSettle}paymentAccoutResult/getPaymentAccoutResultList`,//结算单状态判断
  exportPayAccountResult:`${environment.baseUrlSettle}paymentAccoutResult/exportPayAccountResult`,//日对账导出

  // 业务利润报表统计
  selectBusProReport: `${environment.baseUrlSettle}busProReport/selectBusProReport`,//查询
  busProExcel: `${environment.baseUrlSettle}busProReport/busProExcel`,// Excel导出
  getSegment: `${environment.baseUrlSettle}businessSegment/getSegment`,// 业务板块查询


  //一单一议
  bargainInfoGetPage:`${environment.baseUrlSystem}bargainInfo/getPage`,// 分页查询
  bargainInfoInsert:`${environment.baseUrlSystem}bargainInfo/insert`,// 新增
  bargainInfoUpdate:`${environment.baseUrlSystem}bargainInfo/update`,// 修改
  bargainInfoDeleteList:`${environment.baseUrlSystem}bargainInfo/deleteList`,// 删除
  updateIfUse:`${environment.baseUrlSystem}bargainInfo/updateIfUse`,//使用
  updateIfUseTwo:`${environment.baseUrlSystem}bargainInfo/updateIfUseTwo`,//未使用

  //运单台账生成结算单
  save:`${environment.baseUrlSettle}settle/save`,


  //车辆管理
  insertVehicleInfo:`${environment.baseUrlSystem}vehicleInfo/insertVehicleInfo`,// 新增
  updateVehicleInfo:`${environment.baseUrlSystem}vehicleInfo/updateVehicleInfo`,// 修改
  getVehicleInfoList:`${environment.baseUrlSystem}vehicleInfo/getVehicleInfoList`, // 查询
  deleteVehicleInfoByNo:`${environment.baseUrlSystem}vehicleInfo/deleteVehicleInfoByNo`, // 删除
  getEndPointByBusi:`${environment.baseUrlSystem}vehicleInfo/getEndPointByBusi`, // 业务类型查流向
  getbusiAndEndPoint:`${environment.baseUrlSystem}vehicleInfo/getbusiAndEndPoint`, // 查询业务板块和流向
  getStartPointByBusi:`${environment.baseUrlSystem}vehicleInfo/getStartPointByBusi`, // 查询装载仓库

  // 车辆业务
  getVehicleAuthInfo: `${environment.baseUrlSystem}vehicleInfo/getVehicleAuthInfo`, // 查询
  updateVehicleAuthPass: `${environment.baseUrlSystem}vehicleInfo/updateVehicleAuthPass`, // 审核通过
  updateVehicleAuthReject: `${environment.baseUrlSystem}vehicleInfo/updateVehicleAuthReject`, // 审核驳回

  // 车辆审核
  updateVehicleReject: `${environment.baseUrlSystem}vehicleInfo/updateVehicleReject`, // 审核驳回
  getVehicleInfoList2: `${environment.baseUrlSystem}vehicleInfo/getVehicleInfoList2`, // 查询接口
  updateVehiclePass: `${environment.baseUrlSystem}vehicleInfo/updateVehiclePass`, // 审核通过

  // 金蝶凭证管理
  selectKingDeeData: `${environment.baseUrlSettle}kingDee/selectKingDeeData`, // 查询
  exportKingDeeData: `${environment.baseUrlSettle}kingDee/exportKingDeeData`, // 导出
  importKingDeeData: `${environment.baseUrlSettle}kingDee/importKingDeeData`, // 导入
  selectSettleInvFinanceData: `${environment.baseUrlSettle}kingDee/selectSettleInvFinanceData`, // 查询
  exportSettleInvKingDeeData: `${environment.baseUrlSettle}kingDee/exportSettleInvKingDeeData`, // 导出

  // 内部凭证管理
  importInternData: `${environment.baseUrlSettle}kingDee/importInternData`, // 导入1
  importCollectionData: `${environment.baseUrlSettle}kingDee/importCollectionData`, // 导入2
  selectInternCollectionData: `${environment.baseUrlSettle}kingDee/selectInternCollectionData`, // 查询
  exportInternData: `${environment.baseUrlSettle}kingDee/exportInternData`, // 导出

//  车辆查询
  selectCar: `${environment.baseUrlTrans}waybillProduct/getWaybillDefult`, // 查询

  matchingWaybill: `${environment.baseUrlSettle}settleV2/matchingWaybill`,//运单台账价格匹配
  //已开票管理
  selectInvoiceInformationHad: `${environment.baseUrlSettle}invoice/invoiceQuery`,//查询
  seeInvoiceInformationHad: `${environment.baseUrlSettle}invoice/invoiceView`,//预览
  printInvoiceInformationHad: `${environment.baseUrlSettle}invoice/invoicePrint`,//打印
  deleteInvoiceInformationHad: `${environment.baseUrlSettle}invoice/invoiceCancel`,//作废

  //日记账
  selectJournalAccount: `${environment.baseUrlSettle}kingDee/selectJournalAccount`,//查询
  importJournalAccount: `${environment.baseUrlSettle}kingDee/importJournalAccount`,//导入日记账
  importKingDeeDataV2: `${environment.baseUrlSettle}kingDee/importKingDeeDataV2`,//导入供应商客户
  exportJournalAccount: `${environment.baseUrlSettle}kingDee/exportAsJournal`,//导出日记账
  exportAsKongDee: `${environment.baseUrlSettle}kingDee/exportAsKingDee`,//导出金蝶凭证
  deleteJournalAccount: `${environment.baseUrlSettle}kingDee/deleteJournalAccount`,//删除
  exportAsCommission: `${environment.baseUrlSettle}kingDee/exportAsCommission`,//导出手续费

  //结转收入
  selectCostIncome: `${environment.baseUrlSettle}kingDee/selectInvoiceKingDeeData`,//查询
  exportCostIncome: `${environment.baseUrlSettle}kingDee/exportInvoiceKingDeeData`,//导出
  importCostIncome: `${environment.baseUrlSettle}kingDee/importInvoiceData`,//导入
  deleteCostIncome: `${environment.baseUrlSettle}kingDee/deleteInvoiceKingDeeData`,//导入

  costIncomeUpload: `${environment.baseUrlSettle}kingDee/invoiceScanAndUpload`,//收票管理，扫描上传
}
