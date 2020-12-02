import { environment } from '../../../environments/environment';


export const contractUrl = {
    //运输合同
  contractTransList:`${environment.baseUrlContract}contarct/selectContract`,//运输合同列表
  contractTransAdd:`${environment.baseUrlContract}contarct/insertContract`,//运输合同新增
  contractTransDelete:`${environment.baseUrlContract}contarct/deleteContract`,//运输合同删除
  contractTransSave:`${environment.baseUrlContract}contarct/updateContract`,//运输合同保存
  contractTransAuditBill:`${environment.baseUrlContract}contarct/updateReturnFlag`,//运输合同确认回单
  contractTransAuditFlow:`${environment.baseUrlContract}contarct/updateflowConfirmation`,//运输合同确认流向

  //线路运价
  selectPriceLine:`${environment.baseUrlContract}ContractPrice/getContractPrice`,//查询
  addPriceLine:`${environment.baseUrlContract}ContractPrice/insertContractPrice`,//新增
  updatePriceLine:`${environment.baseUrlContract}ContractPrice/updateContractPrice`,//修改

  // 销售订单
  selectSales:`${environment.baseUrlInter}salesContract/selectSalesContractList`,//列表
  selectSales2:`${environment.baseUrlInter}salesContract/selectSalesContractListUnused`,//列表(状态：未使用)
  deleteSales:`${environment.baseUrlInter}salesContract/deleteSalesContractList`,//删除
  updateSales:`${environment.baseUrlInter}salesContract/updateSalesContractList`,//保存
  importSales:`${environment.baseUrlInter}salesContract/importSalesContractList`,//导入
  matchSales:`${environment.baseUrlInter}salesContract/matchTransportPriceList`,//匹配价格
  useSales:`${environment.baseUrlInter}salesContract/updateIsUsed`,//使用
  exportSalse:`${environment.baseUrlInter}salesContract/exportExcel`,//导出

  refreshMenCode:`${environment.baseUrlInter}customer/getCustomerList`,
  refreshItemId:`${environment.baseUrlInter}itema/getItemaList`,

  //销售库存查询
  getSalesStock:`${environment.baseUrlInter}Repertory/getRepertory`,//查询
  addSalesStock:`${environment.baseUrlInter}orderhd/addOrderhd`,
  updateSalesStock:`${environment.baseUrlInter}orderhd/updateOrderhd`,
  deleteSalesStock:`${environment.baseUrlInter}orderhd/deleteOrderhd`,

//  出库单查询
  queryOutbound: `${environment.baseUrlInter}HsStckInfo/selectPage`,   // 查询

  // LMS合同明细
  getLMSByOrderNo: `${environment.baseUrlContract}orderItem/getLMSByOrderNo`, // 查询
  exportLMS: `${environment.baseUrlContract}orderItem/exportLMS`, // 导出


  refreshProduct: `${environment.baseUrlInter}tAcManufactureRecord/getTacManufactureRecordList`
}
