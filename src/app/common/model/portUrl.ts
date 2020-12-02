import {environment} from '../../../environments/environment';

export const portUrl = {
  //船舶配载
  shipStowageList: `${environment.baseUrlPort}tTransPlanDay/selectTtransPlanDay`,//列表
  shipStowageSave: `${environment.baseUrlPort}tTransPlanDay/updateTtransPlanDay`,//列表

  // 船舶需求
  shipDemandGetList: `${environment.baseUrlPort}boatReq/selectBoatReq`,//列表
  shipDemandAdd: `${environment.baseUrlPort}boatReq/insertBoatReq`,//新增
  shipDemandUpdate: `${environment.baseUrlPort}boatReq/updateBoatReq`,//修改
  shipDemandDelete: `${environment.baseUrlPort}boatReq/deleteBoatReqAndDetail`,//删除
  shipDemandDetailGetList: `${environment.baseUrlPort}boatReq/selectBoatReqDetail`,//查询明细列表
  shipDemandDetailUpdate: `${environment.baseUrlPort}boatReq/updateBoatReqAndDetail`,


  //船舶计划
  shipPlanGetList: `${environment.baseUrlPort}boatSchedule/selectBoatSchedule`,//列表
  shipPlanAdd: `${environment.baseUrlPort}boatSchedule/insertBoatSchedule`,//新增
  shipPlanUpdate: `${environment.baseUrlPort}boatSchedule/updateBoatSchedule`,//修改
  shipPlanDelete: `${environment.baseUrlPort}boatSchedule/deleteBoatSchedule`,//删除
  shipPlanOther: `${environment.baseUrlPort}boatSchedule/auditBoatScheduleStatus`,//靠泊，离泊，到港，离港
  shipPlanGetModalList: `${environment.baseUrlPort}boatSchedule/selectBoatScheduleDetail`,//弹窗列表

  //装船计划
  shipAllocateGetList: `${environment.baseUrlPort}boatStowage/selectBoatStowage`,//列表
  shipAllocateGetList2: `${environment.baseUrlPort}boatStowage/selectBoatStowageDetail`,//明细列表
  shipAllocateImport: `${environment.baseUrlStock}stockInfo/selectStockInfoAndPlan`,//船舶配载对应的库存信息
  shipAllocateSave: `${environment.baseUrlPort}boatStowage/insertBoatStowage`,//船舶配载新增保存
  shipAllocateSave2: `${environment.baseUrlPort}boatStowage/updateBoatStowage`,//船舶配载修改保存
  shipAllocateDelete: `${environment.baseUrlPort}boatStowage/deleteBoatStowage`,//船舶配载删除
  shipAllocateDeliver: `${environment.baseUrlPort}boatStowage/sendBoatStowage`,//船舶配载下发

  //调度计划
  shipDispatchList: `${environment.baseUrlPort}boatDisSchedule/selectDisBoatSchedule`,//调度计划主列表
  shipDispatchModalList: `${environment.baseUrlPort}boatStowage/selectDisDetail`,//调度计划弹窗列表
  shipDispatchAdd: `${environment.baseUrlPort}boatDisSchedule/insertBoatDisSchedule`,//调度计划新增
  shipDispatchUpdate: `${environment.baseUrlPort}boatDisSchedule/updateBoatDisSchedule`,//调度计划修改
  shipDispatchDelete: `${environment.baseUrlPort}boatDisSchedule/deleteBoaDisSchedule`,//调度计划删除
  shipDispatchDeliver: `${environment.baseUrlPort}boatDisSchedule/auditBoatDisStatus`,//调度计划下发
  shipDispatchDelDetail: `${environment.baseUrlPort}boatDisSchedule/updateDisDetailStatus`,//调度计划删除明细

  //作业计划
  shipWorkList: `${environment.baseUrlPort}boatWorkSchedule/selectBoatWorkSchedule`,//作业计划主列表
  shipWorkModalList: `${environment.baseUrlPort}boatWorkSchedule/selectBoatStowageDetailForWork`,//作业计划弹窗明细列表
  shipWorkAdd: `${environment.baseUrlPort}boatWorkSchedule/insertBoatWorkSchedule`,//作业计划新增
  shipWorkUpdate: `${environment.baseUrlPort}boatWorkSchedule/updateBoatWorkSchedule`,//作业计划修改
  shipWorkDelete: `${environment.baseUrlPort}boatWorkSchedule/deleteBoatWorkSchedule`,//作业计划删除
  // shipWorkModalList:`${environment.baseUrlPort}boatWorkSchedule/selectBoatStowageDetailForWork`,//作业计划提交作业


  //装船确认
  shipMentList: `${environment.baseUrlPort}boatUpBill/selectBoatUpBill`,//装船确认主列表
  shipMentAdd: `${environment.baseUrlPort}boatUpBill/insertBoatUpAndBill`,//装船新增确定
  shipMentDelete: `${environment.baseUrlPort}boatUpBill/deleteBoatUpAndBill`,//装船删除
  shipMentModalList: `${environment.baseUrlPort}boatUp/selectBoatUp`,//装船确认弹窗明细列表
  shipMentDeliver: `${environment.baseUrlPort}boatWorkSchedule/doSubmit`,//装船确认提交作业
  shipColletAudit: `${environment.baseUrlPort}boatWorkSchedule/doSubmit`,//装船确认提交作业

  shipWorkPackList: `${environment.baseUrlPort}boatWorkScheduleItem/getPage`,//装船采集作业计划捆包主列表
  // pdaWorkPackList: `${environment.baseUrlPort}pdaCollect/getPage`,//pda装船采集捆包主列表
  matchPdaCollect: `${environment.baseUrlPort}boatWorkScheduleItem/matchPdaCollect`,//匹配pda采集信息
  confirmLoad: `${environment.baseUrlPort}boatWorkScheduleItem/confirmLoad`,//采集确认
  unloadConfirmLoad: `${environment.baseUrlPort}boatWorkScheduleItem/unloadConfirmLoad`,//卸船采集确认
  confirmNotLoad: `${environment.baseUrlPort}boatWorkScheduleItem/confirmNotLoad`,//取消采集
  unloadConfirmNotLoad: `${environment.baseUrlPort}boatWorkScheduleItem/unloadConfirmNotLoad`,//卸船取消采集
  createWaybill: `${environment.baseUrlPort}boatWorkScheduleItem/createWaybill`,//装船确认（生成运单）
  unloadCreateWaybill: `${environment.baseUrlPort}boatWorkScheduleItem/unloadCreateWaybill`,//卸船确认（生成运单）

  boatPlan: `${environment.baseUrlPort}boatPlan/getPage`,//装船计划分页查询
  unloadBoatPlan: `${environment.baseUrlPort}boatPlan/getUnloadPage`,//卸船计划分页查询
  workScheduleMain: `${environment.baseUrlPort}boatWorkScheduleMain/getPage`,//装船作业计划分页查询
  unloadWorkScheduleMain: `${environment.baseUrlPort}boatWorkScheduleMain/getUnloadPage`,//卸船作业计划分页查询
  workSchedulePack: `${environment.baseUrlPort}boatWorkScheduleItem/getPage`,//装船作业计划捆包分页查询
  unloadWorkSchedulePack: `${environment.baseUrlPort}boatWorkScheduleItem/getUnloadPage`,//卸船作业计划捆包分页查询
  pdaCollectPack: `${environment.baseUrlPort}pdaCollect/getPage`,//pda装船采集捆包分页查询
  unloadPdaCollectPack: `${environment.baseUrlPort}pdaCollect/getUnloadPage`,//pda卸船采集捆包分页查询


  //周发运
  shipWeekDeliverList: `${environment.baseUrlPort}tTransPlanWeek/selectTtransPlanWeek`,//周发运

  //调港作业
  selectLoadscheduleready: `${environment.baseUrlPort}loadscheduleready/selectLoadscheduleready`,//调港查询
  selectLoadschedulereadyDetail: `${environment.baseUrlPort}loadscheduleready/selectLoadschedulereadyDetail`,//调港查询
  deleteLoadschedulereadyAndDetail: `${environment.baseUrlPort}loadscheduleready/deleteLoadschedulereadyAndDetail`,//删除调港及明细
  insertLoadscheduleready: `${environment.baseUrlPort}loadscheduleready/insertLoadscheduleready`,//新增调港

// 停工采集
  selectCollectLockout: `${environment.baseUrlPort}collectLockout/selectCollectLockout`,//查询
  insertCollectLockout: `${environment.baseUrlPort}collectLockout/insertCollectLockout`,//新增
  updateBoatStowage: `${environment.baseUrlPort}collectLockout/updateBoatStowage`,//  更新
  deleteCollectLockout: `${environment.baseUrlPort}collectLockout/deleteCollectLockout`,//  删除
  selectTBoatPlanModel: `${environment.baseUrlPort}collectLockout/selectTBoatPlanModel`,//  船批查询

//门机实绩采集
  selectCollectPortalLockout: `${environment.baseUrlPort}collectPortalcrane/selectCollectLockout`,//  查询
  insertCollectPortalcrane: `${environment.baseUrlPort}collectPortalcrane/insertCollectPortalcrane`,//新增
  deleteCollectPortalcrane: `${environment.baseUrlPort}collectPortalcrane/deleteCollectPortalcrane`,//  删除
  updateCollectPortalcrane: `${environment.baseUrlPort}collectPortalcrane/updateCollectPortalcrane`,//  更新
  selectTBoatWorkScheduleModel: `${environment.baseUrlPort}collectOperationteam/selectTBoatWorkScheduleModel`, //弹框数据查询

//操作人员实绩采集
  selectOperationList: `${environment.baseUrlPort}collectOperationteam/selectCollectOperationteam`,//  查询
  insertOperation: `${environment.baseUrlPort}collectOperationteam/insertCollectOperationteam`,//  新增
  updateOperation: `${environment.baseUrlPort}collectOperationteam/updateCollectOperationteam`,//  修改
  deleteOperation: `${environment.baseUrlPort}collectOperationteam/deleteCollectOperationteam`,//  删除
  selectWorkScheduleforOperation: `${environment.baseUrlPort}collectOperationteam/selectTBoatWorkScheduleMainModel `,//  查询作业计划号
  selectTeam: `${environment.baseUrlPort}collectOperationteam/selectTTeamModel`,//  查询班组名称
  selectTeamUser: `${environment.baseUrlPort}collectOperationteam/selectTTeamUserModel `,//  查询操作用户


  //叉车进出舱管理
  forkLiftGetList: `${environment.baseUrlPort}forklift/getList`,//  查询
  forkLiftAddList: `${environment.baseUrlPort}forklift/addList`,//  新增
  forkLiftUpdateList: `${environment.baseUrlPort}forklift/updateList`,//  修改
  forkLiftDeleteList: `${environment.baseUrlPort}forklift/deleteList`,//  删除
  forkLiftExport: `${environment.baseUrlPort}forklift/export`,//  导出

  // 叉车进出仓时间
  exportInOutTime: `${environment.baseUrlPort}forklift/exportInOutTime`,//  导出

  //锚地、在泊、作业时长分析
  timeExport:`${environment.baseUrlPort}berthReport/timeExport`,//  导出

  //泊位使用分析
  berthUseExport:`${environment.baseUrlPort}berthReport/berthUseExport`,//  导出

  // 车辆不足停工统计
  withoutCar: `${environment.baseUrlPort}shutDownExport/withoutCar`,//导出
  selectwithoutCar: `${environment.baseUrlPort}shutDownExport/selectwithoutCar`,//查询

  //船舶数据统计
  boatDataStatistics: `${environment.baseUrlPort}shutDownExport/boatDataStatistics`,//导出
  selectboatData: `${environment.baseUrlPort}shutDownExport/selectboatData`,//查询
 //  加水、接电统计
  waterAndPower: `${environment.baseUrlPort}excelPoiExport/waterAndPower`,//导出
  selectwaterAndPower: `${environment.baseUrlPort}excelPoiExport/selectwaterAndPower`,//查询

//  昼夜船舶靠离港计划
  berth: `${environment.baseUrlPort}excelPoiExport/berth`,//导出
  selectshipData: `${environment.baseUrlPort}excelPoiExport/selectboatData`,//查询

 // 吞吐量分货种统计
  throughput: `${environment.baseUrlPort}excelPoiExport/throughput`,//导出
  selectHandlingCapacity: `${environment.baseUrlPort}excelPoiExport/selectHandlingCapacity`,//吞吐量查询

  // 单舱效率
  cabinEfficiency: `${environment.baseUrlPort}excelPoiExport/cabinEfficiency`,//导出
  selectCabinEfficiency: `${environment.baseUrlPort}excelPoiExport/selectCabinEfficiency`,//查询船批号
  selectBybatchNum: `${environment.baseUrlPort}singleEfficiency/selectBybatchNum`,//根据船批号查询单舱效率


//单舱效率维护
  selectSingleEfficiency: `${environment.baseUrlPort}singleEfficiency/selectSingleEfficiency`,  //查询
  insertSingleEfficiency: `${environment.baseUrlPort}singleEfficiency/insertSingleEfficiency`,  //新增
  updateSingleEfficiency: `${environment.baseUrlPort}singleEfficiency/updateSingleEfficiency`,  //修改
  deleteSingleEfficiency: `${environment.baseUrlPort}singleEfficiency/deleteSingleEfficiency`,  //删除

  //停时数据统计
  shutDownStatistics: `${environment.baseUrlPort}shutDownExport/shutDownStatistics`,//导出
  selectcollectEfficient: `${environment.baseUrlPort}shutDownExport/selectcollectEfficient`,//查询


};
