import {environment} from '../../../environments/environment';

export const planUrl = {
  // 装船计划管理
  boatWorkaddList: `${environment.baseUrlPort}boatWorkScheduleMain/selectBoatWorkScheduleMain`,//查询(旧，作废)
  getWorkList: `${environment.baseUrlPort}boatPlan/getWorkList`,//查询（新）
  boatWorkinsert: `${environment.baseUrlPort}boatWorkScheduleMain/insert`,//新增保存
  updateWorkPackList: `${environment.baseUrlPort}boatSchedule/updateWorkPackList`,//新增保存
  boatWorkupdateByDisNum: `${environment.baseUrlPort}boatWorkScheduleMain/updateByDisNum`,//修改
  boatWorkdeleteByDisNum: `${environment.baseUrlPort}boatWorkScheduleMain/deleteByDisNum`,//删除
  boatWorkexport: `${environment.baseUrlPort}boatWorkScheduleMain/export`,//导出主表
  itemWorkexport: `${environment.baseUrlPort}boatWorkScheduleItem/export`,//导出详情
  boatWorkissued: `${environment.baseUrlPort}boatWorkScheduleMain/issued`,//下发
  boatWorkcancelIssued: `${environment.baseUrlPort}boatWorkScheduleMain/cancelIssued`,//取消下发
  boatWorkScheduleItem: `${environment.baseUrlPort}boatWorkScheduleItem/selectBoatWorkScheduleItem`,//查询详细
  selectTTeamModel: `${environment.baseUrlPort}collectOperationteam/selectTTeamModel`,//录入班组接口
  loadingSequence: `${environment.baseUrlPort}boatWorkScheduleItem/loadingSequence`,//调度计划接口 没有作业计划号的
  selectByDisNum: `${environment.baseUrlPort}boatWorkScheduleItem/selectByDisNum`,//调度计划接口有作业计划号的


  // 船舶计划
  addList: `${environment.baseUrlPort}boatPlan/addList`,//添加
  getList: `${environment.baseUrlPort}boatPlan/getList`,//装船列表
  getList2: `${environment.baseUrlPort}boatPlan/getList2`,//卸船列表
  updateList: `${environment.baseUrlPort}boatPlan/updateList`,// 更新
  issued: `${environment.baseUrlPort}boatPlan/issued`,// 下发
  deleteList: `${environment.baseUrlPort}boatPlan/deleteList`,// 删除
  revocationIssued: `${environment.baseUrlPort}boatPlan/revocationIssued`,// 撤销下发

  //调度计划
  getMainList: `${environment.baseUrlPort}boatSchedule/getMainList`,//主列表
  getPackList: `${environment.baseUrlPort}boatSchedule/getPackList`,//子列表
  addMainList: `${environment.baseUrlPort}boatSchedule/addMainList`,//新增调度计划和捆包
  addPackIntoSchedule: `${environment.baseUrlPort}boatSchedule/addPackIntoSchedule`,//新增明细
  updatePackList: `${environment.baseUrlPort}boatSchedule/updatePackList`,//更新明细
  removePack: `${environment.baseUrlPort}boatSchedule/removePack`,//删除明细
  import: `${environment.baseUrlPort}boatSchedule/import`,//导入
  updateImport: `${environment.baseUrlPort}boatSchedule/updateImport`,//修改导入
  sendMain: `${environment.baseUrlPort}boatSchedule/sendMain`,//下发
  selectListByStatus: `${environment.baseUrlPort}boatPlan/selectListByStatus`,//选择船舶计划
  revocationMain: `${environment.baseUrlPort}boatSchedule/revocationMain`,//撤销下发
  boatScheduleDeleteList: `${environment.baseUrlPort}boatSchedule/deleteList`,//撤销下发
  insertBoatSchedulePack: `${environment.baseUrlPort}boatSchedule/insertBoatSchedulePack`,//卸船调度计划 新增
  selectBoatSchedulePack: `${environment.baseUrlPort}boatSchedule/selectBoatSchedulePack`,//卸船调度计划 子列表查询
  deleteXCList: `${environment.baseUrlPort}boatSchedule/deleteXCList`,//卸船调度计划 删除
  addPackXcSchedule: `${environment.baseUrlPort}boatSchedule/addPackXcSchedule`,//卸船调度计划 新增捆包
  updateXcPackList: `${environment.baseUrlPort}boatSchedule/updateXcPackList`,//卸船调度计划 更新捆包

  //派车计划
  vehiclegetPage: `${environment.baseUrlPort}vehicleScheduleMain/getPage`,//查询
  vehiclePackgetPage: `${environment.baseUrlPort}vehicleSchedulePack/getPage`,//查询
  vehicleinsert: `${environment.baseUrlPort}vehicleScheduleMain/insert`,//新增
  vehicleupdate: `${environment.baseUrlPort}vehicleScheduleMain/update`,//修改
  vehicledelete: `${environment.baseUrlPort}vehicleScheduleMain/deleteList`,//删除
  boatStowageList: `${environment.baseUrlPort}boatStowageItem/getList`,//配载查询


  //船舶配载
  selectBoatStowageMain: `${environment.baseUrlPort}boatStowageMain/selectBoatStowageMain`,//主列表查询
  selectBoatStowageItem: `${environment.baseUrlPort}boatStowageItem/selectBoatStowageItem`,//子列表查询（作废）
  getPackListByBoatBatchNum: `${environment.baseUrlPort}boatSchedule/getPackListByBoatBatchNum`,//子列表查询(新）
  insertBoatStowageMain: `${environment.baseUrlPort}boatStowageMain/insertBoatStowageMain`,//新增
  updateBoatStowageMain: `${environment.baseUrlPort}boatStowageMain/updateBoatStowageMain`,//修改
  saveSequence: `${environment.baseUrlPort}boatStowageItem/saveSequence`,//保存装船顺序(作废）
  boatScheduleUpdatePackList: `${environment.baseUrlPort}boatSchedule/updatePackList`,//保存装船顺序(新）
  boatStowageItemDeleteList: `${environment.baseUrlPort}boatStowageItem/deleteList  `,//装船顺序删除
  getRecordsByScheduleNum: `${environment.baseUrlPort}boatStowageItem/getRecordsByScheduleNum`,//弹窗装船明细获取
  mainExport: `${environment.baseUrlPort}boatStowageMain/export`,//导出
  itemExport: `${environment.baseUrlPort}boatStowageItem/export`,//明细导出
  getMainStatusList: `${environment.baseUrlPort}boatSchedule/getMainStatusList`,//已下发调度明细列表
  getWorkListByBoatBatchNum: `${environment.baseUrlPort}boatSchedule/getWorkListByBoatBatchNum`,//弹窗明细查询
  boatStowageMainDeleteList: `${environment.baseUrlPort}boatStowageMain/deleteList`,//船舶配载删除

  //船舶报港
  selectPredictPort: `${environment.baseUrlPort}predictPortController/selectPredictPort`,//查询
  updatePredictPort: `${environment.baseUrlPort}predictPortController/updatePredictPort`,//修改
  insertPredictPort: `${environment.baseUrlPort}predictPortController/insertPredictPort`,//插入
  deletePredictPort: `${environment.baseUrlPort}predictPortController/deletePredictPort`,//删除
  selectBoatPlan: `${environment.baseUrlPort}predictPortController/selectBoatPlanByBoatName`,//查询船舶计划

  //船舶水尺
  insertWaterGuage: `${environment.baseUrlPort}BoatWaterGuage/insertWaterGuage`,//水尺保存
  selectWaterGuage: `${environment.baseUrlPort}BoatWaterGuage/selectWaterGuage`,//水尺查询
  deleteWaterGuage: `${environment.baseUrlPort}BoatWaterGuage/deleteWaterGuage`,//水尺清除
  selectListByToPortStatus: `${environment.baseUrlPort}boatPlan/selectListByToPortStatus`,// 船舶水尺查询传播计划

  // 导出
  boatWorkScheduleItemExport: `${environment.baseUrlPort}boatWorkScheduleItem/export`,//导出捆包详细
  boatWorkScheduleMainExport: `${environment.baseUrlPort}boatWorkScheduleMain/export`,//导出捆包主列表

  // 商检水尺
  selectInspectGauge: `${environment.baseUrlPort}BoatInspectGauge/selectInspectGauge`,//商检水尺查询
  insertInspectGauge: `${environment.baseUrlPort}BoatInspectGauge/insertInspectGauge `,//商检水尺新增

};
