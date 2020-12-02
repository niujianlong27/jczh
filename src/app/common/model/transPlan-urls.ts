import { environment } from "../../../environments/environment";

// let transUrl = 'http://192.168.8.133:9034/'; // 本地
//let transUrl = 'https://uat.jczh56.com/api/trans/'; // uat
// let transPlanUrl = 'http://localhost:9038/'; // 本地
let transPlanUrl='http://192.168.1.18:9038/'; //邵鲁玉本地
if (environment.production) {
  transPlanUrl = environment.baseUrlTransPlan; // 测试
}


export const TRANS_PLAN_URLS = {



  //排产计划
  selectSchedulePlan:`${transPlanUrl}schedulePlan/selectSchedulePlan`,//查询
  ImportSchedulePlan:`${transPlanUrl}schedulePlan/insertSchedulePlan`,//导入
  exportSchedule:`${transPlanUrl}schedulePlan/exportExcel`,
  saveSchedulePlanList:`${transPlanUrl}schedulePlan/saveSchedulePlanList`,//保存
  deleteSchedulePlanList:`${transPlanUrl}schedulePlan/deleteSchedulePlanList`,//删除
  forecastSchedulePlan:`${transPlanUrl}schedulePlan/forecastSchedulePlan`,//预测排产计划


  //可发库存
  selectDeliveryNotice:`${transPlanUrl}deliveryNotice/selectDeliveryNotice`,//查询
  importDeliveryNotice:`${transPlanUrl}deliveryNotice/insertDeliveryNotice`,//导入
  exportSchedulePlan:`${transPlanUrl}deliveryNotice/exportExcel`,//导出

  //每日库存
  selectDeliveryNoticeOne:`${environment.baseUrlManage}ship/getList`,//查询
  exportSchedulePlanOne:`${environment.baseUrlManage}ship/export`,//导出
  //分货（邵鲁玉）
  getNoticeStockInfo:`${transPlanUrl}allocation/getNoticeStockInfoList`,//查询待分货列表
  getAllocateGoods:`${transPlanUrl}allocation/getAllocateGoods`,//查询分货车次
  allocateGoods:`${transPlanUrl}allocation/allocateGoods`,//执行分货算法
  getAllocateGoodsDetail:`${transPlanUrl}allocation/getAllocateGoodsDetail`,//查询分货车次明细
  insertAllocateGoods:`${transPlanUrl}allocation/insertAllocateGoods`,//新增分货车次
  updateAllocateGoods:`${transPlanUrl}allocation/updateAllocateGoods`,//修改分货车次
  deleteAllocateGoods:`${transPlanUrl}allocation/deleteAllocateGoods`,//删除分货车次
  saveAllocateGoodsResult:`${transPlanUrl}allocation/saveAllocateGoodsResult`,//保存分货结果
  confirmAllocateGoods:`${transPlanUrl}allocation/confirm`,//确认接口
  cancelAllocateGoods:`${transPlanUrl}allocation/cancel`,//取消确认接口
  abolishAllocateGoods:`${transPlanUrl}allocation/abolish`,//作废接口
  isFinish:`${transPlanUrl}allocation/isFinish`,//判断当天分货是否全部完成
  exportnoticeStockInfo: `${transPlanUrl}allocation/exportStock`,//整体分货导出
  selectCity: `${transPlanUrl}deliveryNotice/selectCityList`,




}
