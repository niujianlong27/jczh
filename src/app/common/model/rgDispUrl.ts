import { environment } from "../../../environments/environment";

//let baseurl = 'http://192.168.23.50:9044/'; // 本地
let baseurl = 'https://uat.jczh56.com/api/rg-dispatch/'; // uat

if (environment.production) {
  baseurl = environment.baseUrlRgDispatch; // 测试
}
export const RGDISPURL = {
  GETCODESET: `${baseurl}rule/codeset/getItemsByCodeset`,//获取小代码集

  ENTRYRULEGETRECORDS: `${baseurl}rule/entryRuleCars/getRecords`,//入厂规则维护查询接口
  ENTRYRULEUPDATE: `${baseurl}rule/entryRuleCars/update`,//入厂规则车辆数修改接口
  ENTRYRULEINSERT: `${baseurl}rule/entryRuleCars/insert`,//入厂车辆数新增接口
  ENTRYRULEDELETE:`${baseurl}rule/entryRuleCars/delete`,//入厂车辆数删除接口


  MATKINDGETRECORDS: `${baseurl}rule/matKind/getRecords`,//物料分类维护查询接口
  MATKINDUPDATE: `${baseurl}rule/matKind/update`,//物料分类维护修改接口
  MATKINDUPDATEFZ: `${baseurl}rule/matKind/updateAuxiliary`,//物料分类维护修改接口
  MATKINDINSERT: `${baseurl}rule/matKind/insert`,//物料分类维护新增接口
  MATKINDDELETE:`${baseurl}rule/matKind/delete`,//物料分类维护删除接口
  MATKINDGETALL: `${baseurl}rule/matKind/getAll`,//得到所有物料接口
  GETFZKIND:`${baseurl}rule/codesetDesc/getAuxiliary`,//获取所有辅助分类

  TIMEOUTGETRECORDS: `${baseurl}rule/entryRuleTimeout/getRecords`,//入厂超时处理查询接口
  TIMEOUTINSERT: `${baseurl}rule/entryRuleTimeout/insert`,//入厂超时处理插入接口
  TIMEOUTUPDATE: `${baseurl}rule/entryRuleTimeout/update`,//入厂超时处理修改接口
  TIMEOUTDELETE:`${baseurl}rule/entryRuleTimeout/delete`,//入厂超时处理删除

  RULEGETRECORDS: `${baseurl}rule/entryRule/getRecords`,//规则维护查询接口
  RULEUPDATE: `${baseurl}rule/entryRule/update`,//规则维护修改接口
  RULEINSERT: `${baseurl}rule/entryRule/insert`,//规则维护新增接口
  RULEDELETE:`${baseurl}rule/entryRule/delete`,//规则维护删除接口
  GETAUXILIARYBYKINDCODE:`${baseurl}rule/matKind/getMatKind`,//根据物料分类编码找到辅助分类编码
  GETRESTAUILIARY:`${baseurl}rule/entryRule/ruleAuxiliary`,//获取剩余的可选辅助分类名称

  SELECTDEALQUERY: `${baseurl}procure/procureDeal/getRecords`,//查询业务号
  UPDATEDEALQUERY: `${baseurl}procure/procureDeal/updateDispKind`,//修改业务号

  selectScheduleParameter: `${baseurl}systemsetting/setting/getEntryQueueSetting`,//查询调度参数
  selectJGWLParameter: `${baseurl}systemsetting/setting/getJgwlSetting`,//查询金港物流参数
  updateScheduleParameter: `${baseurl}systemsetting/setting/updateEntryQueueSetting`,//查询调度参数
  updateJGWLParameter: `${baseurl}systemsetting/setting/updateJgwlSetting`,//查询金港物流参数

  getRecordsJgwl: `${baseurl}queue/entryQueue/getRecordsJgwl`,//京港物流车辆分页查询
  getStatsJgwl: `${baseurl}queue/entryQueue/getStatsJgwl`,//京港物流车辆统计查询
  updateStatsJgwl: `${baseurl}queue/entryQueue/confirmQueue`,//确认进场


  getRecordsByKind: `${baseurl}queue/entryQueue/getRecordsByKind `,//查询品种
  getStataByKindCount: `${baseurl}queue/entryQueue/getStataByKind2 `,//查询各品种数量
  CONFIRMOUT:`${baseurl}queue/entryCard/outFactory`,//确认出厂


  getRecords: `${baseurl}queue/entryRecord/getRecords`,//查询


  SELECTERROR: `${baseurl}queue/entryQueueSynErr/getRecords`,


  GETWAREHOUSE: `${baseurl}queue/entryPlanDay/getWarehouse`,//获取仓库


  CODESETGETRECORDS: `${baseurl}rule/codeset/getRecords`,//代码管理查询
  CODESETUPDATE: `${baseurl}rule/codeset/update`,//代码管理修改
  CODESETDESCINSERT: `${baseurl}rule/codesetDesc/insert`,//新增代码集
  CODESETINSERT: `${baseurl}rule/codeset/insert`,//新增子项
  CODESETGETALL: `${baseurl}rule/codesetDesc/getAll`,//获取所有代码集

  TRANSGETRECORDS: `${baseurl}queue/entryRecord/getRecords`,//运输任务过程查询

  JGSETCONFIGUREDGET: `${baseurl}systemsetting/setting/getJgwlSetting`,// 查询调金港物流参数配置`
  JGSETCONFIGUREDUPDATE: `${baseurl}systemsetting/setting/updateJgwlSetting`,//修改金港物流参数配置
  SETCONFIGUREDGET: `${baseurl}systemsetting/setting/getEntryQueueSetting`,//查询调度参数配置
  SETCONFIGUREDUPDATE: `${baseurl}systemsetting/setting/updateEntryQueueSetting`,//修改调度参数配置

  MESSAGEGETRECORDS: `${baseurl}factory/message/getRecords`,//消息查询
  MESSAGEINSERT: `${baseurl}factory/message/insert`,//公告新增
  MESSAGESEND: `${baseurl}factory/message/send`,//通知群发发送
  MESSAGEUPDATE: `${baseurl}factory/message/update`,//消息更改
  MESSAGEDELETE:`${baseurl}factory/message/delete`,//消息删除

  ENTRYQUEUEGET: `${baseurl}queue/entryQueue/getRecords`,//车辆排队调度查询
  ENTRYQUEUEGETNUMBER: `${baseurl}queue/entryQueue/getStataByGate`,//获取大门车辆数目
  FASTTRACK: `${baseurl}queue/entryQueue/fastTrack`,//加入绿色通道
  ENTRYQUEUEUPDATE: `${baseurl}queue/entryQueue/updateGoto`,//修改大门和仓库
  ENTRYQUEUEUPDATEALL: `${baseurl}queue/entryQueue/batchUpdateGate`,//批量修改入厂大门
  ENTRYNOTICE: `${baseurl}queue/entryQueue/entryNotice`,//直接入厂

  WAREHOUSEGET: `${baseurl}queue/entryPlanDay/getRecords`,//仓库需求计划查询
  WAREHOUSEUPDATE: `${baseurl}queue/entryPlanDay/update`,//仓库需求计划修改

  VEHICLEGET: `${baseurl}queue/entryQueue/getRecordsByVendor`,//车辆查询接口
  VEHICLEGETNUM: `${baseurl}queue/entryQueue/getStataByStatusType2`,//查询各个状态车辆数
  TRANSRECORD: `${baseurl}queue/entryRecord/getRecords`,//获取运输记录
  VEHICLEDELETEBYTASKID: `${baseurl}queue/entryQueue/deleteRecordByTaskId`,//根据taskid删除数据
  EXPORT: `${baseurl}queue/entryQueue/queueExcel`,//导出接口
  VEHICLEDELETE: `${baseurl}ueue/entryQueue/delete`,//删除数据
  PAUSEVEHICLE: `${baseurl}queue/entryQueue/IsSuspend`,//暂停

  exportTransQuery: `${baseurl}queue/entryRecord/recordModelExport`,//运输任务过程查询导出

  PARKGETRECORDS: `${baseurl}rule/entryParkingTimeout/getRecords`,//停车场查询
  PARKINSERT: `${baseurl}rule/entryParkingTimeout/insert`,//停车场新增
  PARKUPDATE: `${baseurl}rule/entryParkingTimeout/update`,//停车场修改
  PARKDELETE: `${baseurl}rule/entryParkingTimeout/delete`,//停车场删除


  getDriverManage: `${baseurl}queue/userTruck/getQueueDriver`,//查询司机
  clearDriver: `${baseurl}queue/userTruck/unbindQueueDriverMobile`,//解绑设备码
  deleteDriver: `${baseurl}queue/userTruck/delete`,//解绑车牌
  blockDriver: `${baseurl}queue/userTruck/updateUserTruck`,//拉黑


}
