import {environment} from '@env/environment';

export const gcDispatchURL = {
  // 进厂管理
  getEnterFactoryRecord: `${environment.baseUrlGCDispatch}gcEntryQueue/getEnterFactoryRecord`,// 查询
  gcEnterFactory: `${environment.baseUrlGCDispatch}gcEntryQueue/gcEnterFactory`,// 车辆进厂
  getOrderItemByPlan: `${environment.baseUrlCommission}order/getOrderItemByPlan`,// 装车明细

  // 出厂管理
  getLeaveFactoryRecord: `${environment.baseUrlGCDispatch}gcEntryQueue/getLeaveFactoryRecord`,// 查询
  LeaveFactory: `${environment.baseUrlGCDispatch}gcEntryQueue/gcLeaveFactory`,// 车辆出厂

  // 入厂车辆规则
  getRecords: `${environment.baseUrlGCDispatch}gcEntryCars/getRecords`,// 查询
  getRecordsUpdate: `${environment.baseUrlGCDispatch}gcEntryCars/update`,// 修改

  // 超时规则
  getEntryQueueSetting: `${environment.baseUrlGCDispatch}gcSetting/getEntryQueueSetting`,// 查询
  updateEntryQueueSetting: `${environment.baseUrlGCDispatch}gcSetting/updateEntryQueueSetting`,// 修改

  // 预约规则
  bookRuleSearch: `${environment.baseUrlBooking}bookRule/search`,// 查询
  bookRuleUpdate: `${environment.baseUrlBooking}bookRule/update`,// 修改

  // 预约大屏
  getBigScreen: `${environment.baseUrlCommission}plan/getBigScreen`,// 主列表

};
