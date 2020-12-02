import {environment} from '../../../environments/environment';

export const stockUrl = {
  selectStockSet: `${environment.baseUrlStock}stockSet/selectStockSet`,//仓库查询
  insertStockSet: `${environment.baseUrlStock}stockSet/insertStockSet`,//add
  updateStockSet: `${environment.baseUrlStock}stockSet/updateStockSet`,//update
  deleteStockSet: `${environment.baseUrlStock}stockSet/deleteStockSet`,//delete
  selectStockSetName: `${environment.baseUrlStock}stockSet/selectStockSetName`,//查询仓库名称列表

  selectStockAreaSet: `${environment.baseUrlStock}stockAreaSet/selectStockAreaSet`,//库区列表查询
  insertStockAreaSet: `${environment.baseUrlStock}stockAreaSet/insertStockAreaSet`,//add
  deleteStockAreaSet: `${environment.baseUrlStock}stockAreaSet/deleteStockAreaSet`,//delete
  updateStockAreaSet: `${environment.baseUrlStock}stockAreaSet/updateStockAreaSet`,//update
  selectStockAreaSetName: `${environment.baseUrlStock}stockAreaSet/selectStockAreaSetName`,//根据仓库id查询库区名称列表
  selectStockAreaSetNames: `${environment.baseUrlStock}stockAreaSet/selectStockAreaSetNames`,//查询库区名称列表

  insertStockLocationSet: `${environment.baseUrlStock}stockLocationSet/insertStockLocationSet`,//储位新增
  updateStockLocationSet: `${environment.baseUrlStock}stockLocationSet/updateStockLocationSet`,//储位修改
  deleteStockLocationSet: `${environment.baseUrlStock}stockLocationSet/deleteStockLocationSet`,//储位删除
  selectStockLocationSet: `${environment.baseUrlStock}stockLocationSet/selectStockLocationSet`,//储位查询
  selectStockLocationSetName: `${environment.baseUrlStock}stockLocationSet/selectStockLocationSetName`,//查询储位名称列表


  selectStockInfo: `${environment.baseUrlStock}stockInfo/selectStockInfo`,//库存查询
  selectStockInfoForOut: `${environment.baseUrlStock}stockInfo/selectStockInfoForOut`,//库存查询
  selectStockMove: `${environment.baseUrlStock}stockMove/selectStockMove`,//移库查询
  selectReshipment: `${environment.baseUrlStock}reshipment/selectReshipment`,//倒运查询
  selectReshipmentDetail: `${environment.baseUrlStock}reshipment/selectReshipmentDetail`,//倒运明细查询
  insertReshipment: `${environment.baseUrlStock}reshipment/insertReshipment`,//倒运新增
  updateReshipment: `${environment.baseUrlStock}reshipment/updateReshipment`,//倒运  修改
  deleteReshipment: `${environment.baseUrlStock}reshipment/deleteReshipment`,//倒运  删除

  selectStockMoveDetail: `${environment.baseUrlStock}stockMove/selectStockMoveDetail`,//移库查询
  deleteStockMoveAndDetail: `${environment.baseUrlStock}stockMove/deleteStockMoveAndDetail`,//删除入库及明细
  insertStockIn: `${environment.baseUrlStock}stockIn/insertStockIn`,//新增入库
  insertStockMove: `${environment.baseUrlStock}stockMove/insertStockMove`,//新增移库
  updateStockIn: `${environment.baseUrlStock}stockIn/updateStockIn`,//修改入库
  deleteStockIn: `${environment.baseUrlStock}stockIn/deleteStockInAndDetail`,//删除入库
  deleteStockInAndDetail: `${environment.baseUrlStock}stockIn/deleteStockInAndDetail`,//删除入库及明细
  updateStockInAndDetail: `${environment.baseUrlStock}stockIn/updateStockInAndDetail`,//修改入库及明细
  updateStockMoveAndDetail: `${environment.baseUrlStock}stockMove/updateStockMoveAndDetail`,//修改移库及明细
  selectStockIn: `${environment.baseUrlStock}stockIn/selectStockIn`,//入库查询
  selectStockInDetail: `${environment.baseUrlStock}stockIn/selectStockInDetail`,//入库明细查询
  auditInStatus: `${environment.baseUrlStock}stockIn/auditInStatus`,//确认状态
  cancelInStatus: `${environment.baseUrlStock}stockIn/cancelInStatus`,//取消确认状态
  auditOutStatus: `${environment.baseUrlStock}stockOut/auditOutStatus`,//确认状态
  cancelOutStatus: `${environment.baseUrlStock}stockOut/cancelOutStatus`,//取消确认状态

  selectStockOut: `${environment.baseUrlStock}stockOut/selectStockOut`,//出库查询
  selectStockOutDetail: `${environment.baseUrlStock}stockOut/selectStockOutDetail`,//出库明细查询
  insertStockOut: `${environment.baseUrlStock}stockOut/insertStockOut`,//新增出库
  updateStockOut: `${environment.baseUrlStock}stockOut/updateStockOut`,//修改出库
  updateStockOutAndDetail: `${environment.baseUrlStock}stockOut/updateStockOutAndDetail`,//修改入库及明细
  deleteStockOutAndDetail: `${environment.baseUrlStock}stockOut/deleteStockOutAndDetail`,//删除出库及明细
  selectStockInventoryInfo: `${environment.baseUrlStock}stockInventory/selectStockInventoryInfo`,//删除出库及明细


  insertStockInventory: `${environment.baseUrlStock}stockInventory/insertStockInventory`,//新增盘库库
  updateStockInventory: `${environment.baseUrlStock}stockInventory/updateStockInventory`,//修改盘库库
  deleteStockInventory: `${environment.baseUrlStock}stockInventory/deleteStockInventoryAndDetail`,//删除盘库库
  deleteStockInventoryAndDetail: `${environment.baseUrlStock}stockInventory/deleteStockInventoryAndDetail`,//删除盘库库及明细
  updateStockInventoryAndDetail: `${environment.baseUrlStock}stockInventory/updateStockInventoryAndDetail`,//修改盘库库及明细
  selectStockInventory: `${environment.baseUrlStock}stockInventory/selectStockInventory`,//盘库库查询
  selectStockInventoryDetail: `${environment.baseUrlStock}stockInventory/selectStockInventoryDetail`,//盘库库明细查询
  auditInventoryStatus: `${environment.baseUrlStock}stockInventory/auditInventorytStatus`,//确认状态
  cancelInventoryStatus: `${environment.baseUrlStock}stockInventory/cancelInventoryStatus`,//取消确认状态

  insertStockTransfer: `${environment.baseUrlStock}stockTransfer/insertStockTransfer`,//新增调港
  updateStockTransfer: `${environment.baseUrlStock}stockTransfer/updateStockTransfer`,//修改调港
  deleteStockTransfer: `${environment.baseUrlStock}stockTransfer/deleteStockTransferAndDetail`,//删除调港
  deleteStockTransferAndDetail: `${environment.baseUrlStock}stockTransfer/deleteStockTransferAndDetail`,//删除调港及明细
  updateStockTransferAndDetail: `${environment.baseUrlStock}stockTransfer/updateStockTransferAndDetail`,//修改调港及明细
  selectStockTransfer: `${environment.baseUrlStock}stockTransfer/selectStockTransfer`,//调港查询
  selectStockTransferDetail: `${environment.baseUrlStock}stockTransfer/selectStockTransferDetail`,//调港明细查询
  auditTransferStatus: `${environment.baseUrlStock}stockTransfer/auditTransferStatus`,//确认状态
  cancelTransferStatus: `${environment.baseUrlStock}stockTransfer/cancelTransferStatus`,//取消确认状态

  selectStockTransferDetail1: `${environment.baseUrlStock}stockInfo/selectStockTransferDetail`,//调港  查询库存信息


  selectStockBulkIn:`${environment.baseUrlStock}shStockIn/getPage`,//散货入库主表分页查询
  selectStockBulkInDetail:`${environment.baseUrlStock}shStockInDetail/getPage`,//散货入库明细表分页查询
  insertStockBulkIn:`${environment.baseUrlStock}shStockIn/insert`,//散货入库明细表
  insertStockBulkInList:`${environment.baseUrlStock}shStockIn/insertList`,//散货入库明细表
  insertStockBulkOutList:`${environment.baseUrlStock}shStockOut/insertList`,//散货出库过磅保存

  updateStockBulkIn:`${environment.baseUrlStock}shStockIn/update`,//散货入库主表
  deleteStockBulkIn:`${environment.baseUrlStock}shStockIn/deleteList`,//散货入库批量删除
  auditStockBulkIn:`${environment.baseUrlStock}shStockIn/audit`,//散货入库批量确认
  cancelStockBulkIn:`${environment.baseUrlStock}shStockIn/cancel`,//散货入库批量确认

  selectStockBulkOut:`${environment.baseUrlStock}shStockOut/getPage`,//散货出库主表分页查询
  selectStockBulkInDetailOut:`${environment.baseUrlStock}shStockOutDetail/getPage`,//散货出库明细表分页查询
  insertStockBulkOut:`${environment.baseUrlStock}shStockOut/insert`,//散货出库明细表
  updateStockBulkOut:`${environment.baseUrlStock}shStockOut/update`,//散货出库主表
  deleteStockBulkOut:`${environment.baseUrlStock}shStockOut/deleteList`,//散货出库批量删除
  auditStockBulkOut:`${environment.baseUrlStock}shStockOut/audit`,//散货出库批量确认
  cancelStockBulkOut:`${environment.baseUrlStock}shStockOut/cancel`,//散货出库批量确认
  returnOrder:`${environment.baseUrlStock}shStockOut/returnOrder`,//散货出库返单


  selectMoistureValue: `${environment.baseUrlStock}moistureValue/getPage`,//水分设置分页查询
  deleteMoistureValue: `${environment.baseUrlStock}moistureValue/deleteList`,//水分设置分页查询
  updateMoistureValue: `${environment.baseUrlStock}moistureValue/update`,//水分设置分页查询
  insertMoistureValue: `${environment.baseUrlStock}moistureValue/insert`,//水分设置分页查询

  // 散货盘库管理
  selectShStockInventor: `${environment.baseUrlStock}shStockInventory/selectShStockInventory`,//散货盘库主表查询
  selectShStockInventory: `${environment.baseUrlStock}shStockInventory/selectShStockInventoryDetail`,//散货盘库明细查询
  insertShStockInventory: `${environment.baseUrlStock}shStockInventory/insertShStockInventory`,//   散货新增
  deleteShStockInventory: `${environment.baseUrlStock}shStockInventory/deleteShStockInventoryAndDetail`,//  散货删除
  updateShStockInventory: `${environment.baseUrlStock}shStockInventory/updateShStockInventoryAndDetail`,// 散货修改
  auditShInventorytStatus: `${environment.baseUrlStock}shStockInventory/auditShInventorytStatus `,//  散货确认状态
  cancelShInventoryStatus: `${environment.baseUrlStock}shStockInventory/cancelShInventoryStatus`,// 散货取消确认状态

// 散货移库管理
  selectShStockMove: `${environment.baseUrlStock}shStockMoveV2/getPage`,//查询散货移库
  deleteShStockMove: `${environment.baseUrlStock}shStockMove/deleteShStockMoveAndDetail`,// 散货移库删除
  updateShStockMove: `${environment.baseUrlStock}shStockMove/updateShStockMoveAndDetail`,//散货移库修改
  insertShStockMove: `${environment.baseUrlStock}shStockMoveV2/insert`,//新增散货移库
  selectShShStockMoveDetail: `${environment.baseUrlStock}shStockMoveDetailV2/getPage`,//明细查询散货移库

  //散货库存查询
  selectShStockInfo: `${environment.baseUrlStock}shStockInfo/getPage`,

  // 散货调港管理
  selectShStockTransfer: `${environment.baseUrlStock}shStockTransfer/selectShStockTransfer`,//   查询调港
  selectShStockTransferDetail: `${environment.baseUrlStock}shStockTransfer/selectShStockTransferDetail`,//查询调港明细
  insertShStockTransfer: `${environment.baseUrlStock}shStockTransfer/insertShStockTransfer`,// 新增调港
  deleteShStockTransfer: `${environment.baseUrlStock}shStockTransfer/deleteShStockTransferAndDetail`,// 删除调港及明细
  updateShStockTransfer: `${environment.baseUrlStock}shStockTransfer/updateShStockTransfer`,//修改调港及明细
  auditShTransferStatus: `${environment.baseUrlStock}shStockTransfer/auditShTransferStatus`,//确认
  cancelShTransferStatus: `${environment.baseUrlStock}shStockTransfer/cancelShTransferStatus`,//  取消确认

  // 散货倒运
  selectShReshipment: `${environment.baseUrlStock}shReshipmentV2/getPage`,//  查询散货倒运
  selectShReshipmentDetail: `${environment.baseUrlStock}shReshipmentDetailV2/getPage`,// 查询散货倒运明细
  insertShReshipment: `${environment.baseUrlStock}shReshipmentV2/insert`,//新增散货倒运
  deleteShReshipment: `${environment.baseUrlStock}shReshipmentV2/deleteList`,//删除散货倒运及明细
  updateShReshipment: `${environment.baseUrlStock}shReshipmentV2/update`,// 修改散货倒运及明细

  //客户库存查询
  shStockgetPage: `${environment.baseUrlStock}shStockCustomerInfo/getPage`,
  //散货库存查询
  selectshStockgetPage: `${environment.baseUrlStock}shStockInfo/getPage`,




  //平账
  stockInfoAlatAccount:`${environment.baseUrlStock}stockFlatAccount/flatAccount`,// 非散货平账处理
  selectInfoAlatAccount:`${environment.baseUrlStock}stockFlatAccount/getPage`,// 非散货平账查询
  stockBulkInfoAlatAccount:`${environment.baseUrlStock}shStockFlatAccount/flatAccount`,// 散货平账处理
  selectBulkInfoAlatAccount:`${environment.baseUrlStock}shStockFlatAccount/getPage`,// 散货平账查询
  cancelFlatAccount:`${environment.baseUrlStock}shStockFlatAccount/cancelFlatAccount`,// 散货平账查询
  // 过磅记录
  weighinginsert:`${environment.baseUrlStock}weighingRecord/insertList`,// 过磅记录导入
  weighingexport:`${environment.baseUrlStock}weighingRecord/export`,
  weighinggetPage:`${environment.baseUrlStock}weighingRecord/getPage`,// 过磅记录导入
  getPageByOut:`${environment.baseUrlStock}weighingRecord/getPageByOut`,// 过磅记录导入


  //品种对照设置
  getProductConfig:`${environment.baseUrlStock}gcProductConfig/getList`,//查询
  getItema:`${environment.baseUrlStock}gcProductConfig/getItema`,//查询物质代码
  setProductConfig:`${environment.baseUrlStock}gcProductConfig/setProductConfig`,//物资代码选择确定
  Matchproduct:`${environment.baseUrlStock}gcProductConfig/setType`,
  StockOutOK:`${environment.baseUrlStock}gcProductConfig/addStockOut`,

}
