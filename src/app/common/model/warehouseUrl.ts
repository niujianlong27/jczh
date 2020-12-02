import { environment } from "../../../environments/environment";

//const baseurl = 'http://192.168.21.206:9045/'; // 本地
let baseurl = 'https://uat.jczh56.com/api/rzsteel-warehouse/'; // uat

if (environment.production) {
  baseurl = environment.baseUrlRzsteelWarehouse; // 测试
}
export const WAREHOUSEURL = {
  // GETCODESET: `${baseurl}rule/codeset/getItemsByCodeset`,//获取小代码集
  // ENTRYRULEGETRECORDS: `${baseurl}rule/entryRuleCars/getRecords`,//入厂规则维护查询接口
  // ENTRYRULEUPDATE: `${baseurl}rule/entryRuleCars/update`,//入厂规则车辆数修改接口
  // ENTRYRULEINSERT: `${baseurl}rule/entryRuleCars/insert`,//入厂车辆数新增接口
  // ENTRYRULEDELETE:`${baseurl}rule/entryRuleCars/delete`,//入厂车辆数删除接口
  // MATKINDGETRECORDS: `${baseurl}rule/matKind/getRecords`,//物料分类维护查询接口
  // MATKINDUPDATE: `${baseurl}rule/matKind/update`,//物料分类维护修改接口
  MATKINDUPDATEFZ: `${baseurl}rule/matKind/updateAuxiliary`,//物料分类维护修改接口
  // MATKINDINSERT: `${baseurl}rule/matKind/insert`,//物料分类维护新增接口
  // MATKINDDELETE:`${baseurl}rule/matKind/delete`,//物料分类维护删除接口
  // MATKINDGETALL: `${baseurl}rule/matKind/getAll`,//得到所有物料接口
  // GETFZKIND:`${baseurl}rule/codesetDesc/getAuxiliary`,//获取所有辅助分类
  // TIMEOUTGETRECORDS: `${baseurl}rule/entryRuleTimeout/getRecords`,//入厂超时处理查询接口
  // TIMEOUTINSERT: `${baseurl}rule/entryRuleTimeout/insert`,//入厂超时处理插入接口
  // TIMEOUTUPDATE: `${baseurl}rule/entryRuleTimeout/update`,//入厂超时处理修改接口
  // TIMEOUTDELETE:`${baseurl}rule/entryRuleTimeout/delete`,//入厂超时处理删除
  // RULEGETRECORDS: `${baseurl}rule/entryRule/getRecords`,//规则维护查询接口
  // RULEUPDATE: `${baseurl}rule/entryRule/update`,//规则维护修改接口
  // RULEINSERT: `${baseurl}rule/entryRule/insert`,//规则维护新增接口
  // RULEDELETE:`${baseurl}rule/entryRule/delete`,//规则维护删除接口
  // GETAUXILIARYBYKINDCODE:`${baseurl}rule/matKind/getMatKind`,//根据物料分类编码找到辅助分类编码
  // GETRESTAUILIARY:`${baseurl}rule/entryRule/ruleAuxiliary`,//获取剩余的可选辅助分类名称
  // SELECTDEALQUERY: `${baseurl}procure/procureDeal/getRecords`,//查询业务号
  // UPDATEDEALQUERY: `${baseurl}procure/procureDeal/updateDispKind`,//修改业务号
  selectScheduleParameter: `${baseurl}systemsetting/setting/getEntryQueueSetting`,//查询调度参数
  selectJGWLParameter: `${baseurl}systemsetting/setting/getJgwlSetting`,//查询金港物流参数
  updateScheduleParameter: `${baseurl}systemsetting/setting/updateEntryQueueSetting`,//查询调度参数
  updateJGWLParameter: `${baseurl}systemsetting/setting/updateJgwlSetting`,//查询金港物流参数
  getRecordsJgwl: `${baseurl}queue/entryQueue/getRecordsJgwl`,//京港物流车辆分页查询
  getStatsJgwl: `${baseurl}queue/entryQueue/getStatsJgwl`,//京港物流车辆统计查询
  // updateStatsJgwl: `${baseurl}queue/entryQueue/confirmQueue`,//确认进场
  // getRecordsByKind: `${baseurl}queue/entryQueue/getRecordsByKind `,//查询品种
  // getStataByKindCount: `${baseurl}queue/entryQueue/getStataByKind2 `, //查询各品种数量
  // CONFIRMOUT:`${baseurl}queue/entryCard/outFactory`,//确认出厂
  // getRecords: `${baseurl}queue/entryRecord/getRecords`,//查询
  // SELECTERROR: `${baseurl}queue/entryQueueSynErr/getRecords`,
  // GETWAREHOUSE: `${baseurl}queue/entryPlanDay/getWarehouse`,//获取仓库
  // CODESETGETRECORDS: `${baseurl}rule/codeset/getRecords`,//代码管理查询
  // CODESETUPDATE: `${baseurl}rule/codeset/update`,//代码管理修改
  // CODESETDESCINSERT: `${baseurl}rule/codesetDesc/insert`,//新增代码集
  // CODESETINSERT: `${baseurl}rule/codeset/insert`,//新增子项
  // CODESETGETALL: `${baseurl}rule/codesetDesc/getAll`,//获取所有代码集
  // TRANSGETRECORDS: `${baseurl}queue/entryRecord/getRecords`,//运输任务过程查询
  // JGSETCONFIGUREDGET: `${baseurl}systemsetting/setting/getJgwlSetting`,// 查询调金港物流参数配置`
  // JGSETCONFIGUREDUPDATE: `${baseurl}systemsetting/setting/updateJgwlSetting`,//修改金港物流参数配置
  // SETCONFIGUREDGET: `${baseurl}systemsetting/setting/getEntryQueueSetting`,//查询调度参数配置
  // SETCONFIGUREDUPDATE: `${baseurl}systemsetting/setting/updateEntryQueueSetting`,//修改调度参数配置
  // ENTRYQUEUEGET: `${baseurl}queue/entryQueue/getRecords`,//车辆排队调度查询
  // ENTRYQUEUEGETNUMBER: `${baseurl}queue/entryQueue/getStataByGate`,//获取大门车辆数目
  // FASTTRACK: `${baseurl}queue/entryQueue/fastTrack`,//加入绿色通道
  // ENTRYQUEUEUPDATE: `${baseurl}queue/entryQueue/updateGoto`,//修改大门和仓库
  // ENTRYQUEUEUPDATEALL: `${baseurl}queue/entryQueue/batchUpdateGate`,//批量修改入厂大门
  // ENTRYNOTICE: `${baseurl}queue/entryQueue/entryNotice`,//直接入厂
  // WAREHOUSEGET: `${baseurl}queue/entryPlanDay/getRecords`,//仓库需求计划查询
  // WAREHOUSEUPDATE: `${baseurl}queue/entryPlanDay/update`,//仓库需求计划修改
  // VEHICLEGET: `${baseurl}queue/entryQueue/getRecordsByVendor`,//车辆查询接口
  // VEHICLEGETNUM: `${baseurl}queue/entryQueue/getStataByStatusType2`,//查询各个状态车辆数
  // TRANSRECORD: `${baseurl}queue/entryRecord/getRecords`,//获取运输记录
  // VEHICLEDELETEBYTASKID: `${baseurl}queue/entryQueue/deleteRecordByTaskId`,//根据taskid删除数据
  // EXPORT: `${baseurl}queue/entryQueue/queueExcel`,//导出接口
  // VEHICLEDELETE: `${baseurl}ueue/entryQueue/delete`,//删除数据
  // PAUSEVEHICLE: `${baseurl}queue/entryQueue/IsSuspend`,//暂停
  // exportTransQuery: `${baseurl}queue/entryRecord/recordModelExport`,//运输任务过程查询导出
  // PARKGETRECORDS: `${baseurl}rule/entryParkingTimeout/getRecords`,//停车场查询
  // PARKINSERT: `${baseurl}rule/entryParkingTimeout/insert`,//停车场新增
  // PARKUPDATE: `${baseurl}rule/entryParkingTimeout/update`,//停车场修改
  // PARKDELETE: `${baseurl}rule/entryParkingTimeout/delete`,//停车场删除
  // getDriverManage: `${baseurl}queue/userTruck/getQueueDriver`,//查询司机
  // clearDriver: `${baseurl}queue/userTruck/unbindQueueDriverMobile`,//解绑设备码
  // deleteDriver: `${baseurl}queue/userTruck/delete`,//解绑车牌
  // blockDriver: `${baseurl}queue/userTruck/updateUserTruck`,//拉黑

  MESSAGEGETRECORDS: `${baseurl}productMessage/getRecords`, // 消息查询按钮
  MESSAGEINSERT: `${baseurl}productMessage/insert`, // 公告新增
  MESSAGESEND: `${baseurl}productMessage/send`, // 通知群发新增
  MESSAGEUPDATE: `${baseurl}productMessage/update`, // 消息修改
  MESSAGEDELETE: `${baseurl}productMessage/delete`, // 消息删除

  GETFINISHPRODUCT: `${baseurl}productMatKind/getRecords`,   // 仓库排队 成品分类维护 查询
  ADDFINISHPRODUCT: `${baseurl}productMatKind/insert`,   // 新增
  DELETEFINISHPRODUCT: `${baseurl}productMatKind/delete`,  // 删除
  UPDATEFINISHPRODUCT: `${baseurl}productMatKind/update`,  // 修改
  SETFZSORTFINISHPRODUCT: `${baseurl}productMatKind/updateAuxiliary`,   // 设置辅助分类

  MANAGERGETWAREHOUSE: `${baseurl}productWarehouse/getRecords`,   //  仓库维护  仓库管理  查询所有的仓库
  ADDNEWWAREHOUSE: `${baseurl}productWarehouse/insert`,   // 仓库管理  新增仓库
  UPDATEWAREHOUSEMANAGE: `${baseurl}productWarehouse/update`,   // 仓库管理   修改仓库
  DELETEWAREHOUSEMANAGE:  `${baseurl}productWarehouse/delete`,  // 仓库管理   删除仓库

  GETALLCODESETS:`${baseurl}productCodeset/getAll`,    //   获取代码集


  SEARCHTRANSPROG: `${baseurl}productProcureDeal/getRecords`,   // 运输过程查询
  UPDATETRANSPROG: `${baseurl}productProcureDeal/updateDispKind`, // 运输过程修改

  TRANSQUERYGETRECORDS: `${baseurl}productQueueRecord/getRecords`, // 成品运输任务过程查询
  TRANSQUERYEXPORT: `${baseurl}productQueueRecord/recordModelExport`, // 成品运输任务过程导出
  PRODUCTWAREHOUSEGET: `${baseurl}productWarehouseDemandPlan/getRecords`, // 成品仓库需求计划查询
  PRODUCTEWAREHOUSEINS: `${baseurl}productWarehouseDemandPlan/insert`, //  成品仓库需求计划新增
  PRODUCTWAREHOUSESUPD: `${baseurl}productWarehouseDemandPlan/update`, // 成品仓库需求计划修改
  PRODUCTWAREHOUSESDEL: `${baseurl}productWarehouseDemandPlan/delete`, // 成品仓库需求计划删除
  PRODUCTFACTORYGET: `${baseurl}productWarehouseDemandPlan/getProductRecords`, // 成品仓库需求计划查询
  PRODUCTEFACTORYINS: `${baseurl}productWarehouseDemandPlan/insertProduct`, //  成品仓库需求计划新增
  PRODUCTFACTORYSUPD: `${baseurl}productWarehouseDemandPlan/updateProduct`, // 成品仓库需求计划修改
  PRODUCTFACTORYSDEL: `${baseurl}productWarehouseDemandPlan/deleteProduct`, // 成品仓库需求计划删除
  GETALLWAREHOUSE: `${baseurl}productWarehouse/getWarehouse`, // 查询所有仓库
  GETALLMAT: `${baseurl}productMatKind/matAll`, // 获得所有物料
  GETPARAMETER: `${baseurl}productSetting/getEntryQueueSetting`,   // 调度参数设置   获取参数
  SETPARAMETER: `${baseurl}productSetting/updateEntryQueueSetting`,   // 调度参数设置  设置参数
  ENTRYQUEUEGETRECORDS: `${baseurl}productEntryQueue/getPageProductEntry`, // 入厂车辆排队调度查询
  ENTRYQUEUEUPDATE:  `${baseurl}productEntryQueue/updateProduct`, // 入场车辆修改接口
  BATCHUPDATEGATE:  `${baseurl}productEntryQueue/batchUpdateProduct`, // 批量修改大门
  ENTRYNOTICE: `${baseurl}productEntryQueue/entryProduct`, // 直接入厂
  GETNUMBYGATE: `${baseurl}productEntryQueue/getCountByGate`, // 获取各个大门的车辆数
  GREENCHANNNEL: `${baseurl}productEntryQueue/addPriorityProduct`, // 加入绿色通道
  INFACTORYGETRECORDS: `${baseurl}productEntryQueue/getPageProductEntryCars`, // 入厂车辆查询
  INFACTORYDEL: `${baseurl}productEntryQueue/deleteTask`, // 入厂车辆删除
  INFACTORYEXPORT: `${baseurl}productEntryQueue/queueExcel`, // 入厂车辆导出
  INFACTORYCONFIRM: `${baseurl}productEntryQueue/finishProduct`, // 入厂车辆确认出厂
  INFACTORYPRO: `${baseurl}productQueueRecord/getRecords`, // 获取运输任务过程
  INFACTGETNUMBYSTATUS:  `${baseurl}productEntryQueue/getCountByStatus`, // 入厂车辆获取车辆数
  WAREHOUSEGETRECORDS: `${baseurl}productEntryQueue/getPageProductWarehouse`, // 仓库车辆排队查询
  WAREHOUSEINFACTORY: `${baseurl}productEntryQueue/entryWarehouse`, // 仓库车辆排队直接入库
  WAREHOUSEBATCHUPDATE: `${baseurl}productEntryQueue/batchUpdateWarehouse`, // 批量修改仓库
  PASSQUEUE: `${baseurl}productEntryQueue/passQueue`, // 过号
  CALLQUEUE: `${baseurl}productEntryQueue/callProductWarehouse`, // 叫号
  WAREHOUSEGREEN: `${baseurl}productEntryQueue/addPriorityProductWarehouse`, // 仓库绿色通道
  GETRECORDBYWAREHOUSECODE: `${baseurl}productEntryQueue/getQueueStatsByWarehouse`, // 根据仓库编码获取数量
  GETNUMBYSTATUS: `${baseurl}productEntryQueue/getQueueStatsByStatus`, // 入库根据状态获取数量
  INWAREHOUSEGETRECORDS:`${baseurl}productEntryQueue/getPageProductWarehouseByStatus`, // 入库车辆查询
  CALLNUM: `${baseurl}productEntryQueue/callProductGate`, // 入厂车辆叫号
  INWAREHOUSEEXPORT: `${baseurl}productEntryQueue/exportWarehouseQueue`, // 入库导出
  MANUALOUTBOUND: `${baseurl}productEntryQueue/manualOutWarehouse`,   // 仓库车辆排队调度手动出库
}
