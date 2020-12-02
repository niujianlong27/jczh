import {environment} from '@env/environment';

export const stockManageURL = {

  //仓库管理
  selectAllStoreLocation: `${environment.baseUrlStorage}storelocation/selectAllStoreLocation`,//查询接口(无分页)
  selectStoreLocation: `${environment.baseUrlStorage}storelocation/selectStoreLocation`,//查询接口(有分页)
  insertStore: `${environment.baseUrlStorage}store/insertStore`,//新增仓库
  insertStoreArea: `${environment.baseUrlStorage}storearea/insertStoreArea`,//新增库区
  insertStoreLocation: `${environment.baseUrlStorage}storelocation/insertStoreLocation`,//新增库位
  storeLocationExcel: `${environment.baseUrlStorage}storelocation/storeLocationExcel`,//导出
  updateStoreLocation: `${environment.baseUrlStorage}storelocation/updateStoreLocation`,//修改库位
  updateStoreArea: `${environment.baseUrlStorage}storearea/updateStoreArea`,//修改库区
  updateStore: `${environment.baseUrlStorage}store/updateStore`,//修改仓库
  deleteStore: `${environment.baseUrlStorage}store/deleteStore`,//删除仓库
  deleteStoreArea: `${environment.baseUrlStorage}storearea/deleteStoreArea`,//新增库区
  deleteStoreLocation: `${environment.baseUrlStorage}storelocation/deleteStoreLocation`,//删除库位

  //材质管理
  selectProdsign: `${environment.baseUrlStorage}prodsign/selectProdsign`,//查询
  insertProdsign: `${environment.baseUrlStorage}prodsign/insertProdsign`,//新增
  updateProdsign: `${environment.baseUrlStorage}prodsign/updateProdsign`,//更新
  deleteProdsign: `${environment.baseUrlStorage}prodsign/deleteProdsign`,//删除
  getProdsignExcel: `${environment.baseUrlStorage}prodsign/getProdsignExcel`,//导出

  //生产销售品种对照
  selectData: `${environment.baseUrlStorage}gcproductconfig/getGcProductConfigList`,//查询主列表
  selectProduct: `${environment.baseUrlStorage}gcproductconfig/getProduct`,//查询生产品种
  selectSales: `${environment.baseUrlStorage}gcproductconfig/getItem`,//查询销售品种
  exportData: `${environment.baseUrlStorage}gcproductconfig/exportProductConfig`,//导出
  deleteData: `${environment.baseUrlStorage}gcproductconfig/deleteProductConfig`,//删除
  addData: `${environment.baseUrlStorage}gcproductconfig/insertProductConfig`,//新增
  updateData: `${environment.baseUrlStorage}gcproductconfig/updateProductConfig`,//修改

  //入库计划
  selectStockInPlan: `${environment.baseUrlStorage}stockinplan/getStockInPlanList`,
  selectWs: `${environment.baseUrlStorage}stockinplan/getStockWsNameByCompany`,//仓库
  selectItemid: `${environment.baseUrlStorage}stockinplan/getPlanStatic`,//物资代码
  saveStockInPlan: `${environment.baseUrlStorage}stockinplan/save`,
  selectWsLocation: `${environment.baseUrlStorage}stockinplan/getWsLocation`,//库位
  // 销售品种
  selectItema: `${environment.baseUrlStorage}itema/selectItema`,//查询
  insertItema: `${environment.baseUrlStorage}itema/insertItema`,//新增
  updateItema: `${environment.baseUrlStorage}itema/updateItema`,//更新
  deleteItema: `${environment.baseUrlStorage}itema/deleteItema`,//删除
  getItemaExcel: `${environment.baseUrlStorage}itema/getItemaExcel`,//导出

  //生成品种管理
  selectDcProduct: `${environment.baseUrlStorage}dcproduct/selectDcProduct`,//查询
  insertDcProduct: `${environment.baseUrlStorage}dcproduct/insertDcProduct`,//新增
  updateDcProduct: `${environment.baseUrlStorage}dcproduct/updateDcProduct`,//修改
  deleteDcProduct: `${environment.baseUrlStorage}dcproduct/deleteDcProduct`,//删除
  getDcProductExcel: `${environment.baseUrlStorage}dcproduct/getDcProductExcel`,//导出


  //入库登记
  saveStockInRegistration: `${environment.baseUrlStorage}stockin/save`,
  selectStockInPlan10: `${environment.baseUrlStorage}stockin/getStockInPlanList`,

  //入库管理
  deleteStockInInfo: `${environment.baseUrlStorage}stockin/stockInManageDelete`,
  selectstockinInfo: `${environment.baseUrlStorage}stockin/stockInManage`,
  selectStockInInfoItem: `${environment.baseUrlStorage}stockin/stockInManageDetails`,
  auditStockInInfo: `${environment.baseUrlStorage}stockin/stockInManageAudit`,
  cancleStockInInfo: `${environment.baseUrlStorage}stockin/stockInManageAuditCancel`,

  //出库计划登记
  selectStockOutPlan: `${environment.baseUrlStorage}stockOutPlan/getStockOutPlan`,
  saveStockOutPlan: `${environment.baseUrlStorage}stockOutPlan/saveOutPlan`,

  //出库登记
  selectStockOut: `${environment.baseUrlStorage}stockOutPlan/getStockOutPlanOne`,//获取计划出库信息
  saveStockOut: `${environment.baseUrlStorage}stockout/saveStockOut`,
  getUserData: `${environment.baseUrlStorage}storeProdSet/getUser`,

  //库存查询
  selectStockInfo: `${environment.baseUrlStorage}stockinfo/getStocInfoPage`,
  exportStockInfo: `${environment.baseUrlStorage}stockinfo/stockOutPlanOneExcel`,
  selectStockInfo10: `${environment.baseUrlStorage}stockinfo/getStocInPulk`,

  // 定义物资类别代码
  selectProdCategory: `${environment.baseUrlStorage}prodCategory/selectProdCategory`, //表一数据获取
  selectAllProdSubclass: `${environment.baseUrlStorage}prodSubclass/selectAllProdSubclass`, //表2数据获取
  insertProdCategory: `${environment.baseUrlStorage}prodCategory/insertProdCategory`, //新增大类
  updateProdCategory: `${environment.baseUrlStorage}prodCategory/updateProdCategory`, //修改大类
  deleteProdCategory: `${environment.baseUrlStorage}prodCategory/deleteProdCategory`, //删除大类
  insertProdSubclass: `${environment.baseUrlStorage}prodSubclass/insertProdSubclass`, //新增小类
  updateProdSubclass: `${environment.baseUrlStorage}prodSubclass/updateProdSubclass`, //修改小类
  deleteProdSubclass: `${environment.baseUrlStorage}prodSubclass/deleteProdSubclass`, //删除小类
};
