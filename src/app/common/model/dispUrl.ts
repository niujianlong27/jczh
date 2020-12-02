import { environment } from '../../../environments/environment';
export const DISPURL = {
  //GETALLTASKLIST: `${environment.baseUrl}user/login`,//获取排队数据
  GETTIMEOUTLIST: `${environment.baseUrlDisp}timeoutController/selectAny`,//获取超时处理列表
  INSERTTIMEOUTLIST: `${environment.baseUrlDisp}timeoutController/insertTimeout`,//增加超时处理列表
  UPDATETIMEOUTLIST: `${environment.baseUrlDisp}timeoutController/updateTimeout`,//修改超时处理列表
  DELETETIMEOUTLIST: `${environment.baseUrlDisp}timeoutController/deleteTimeout`,//作废超时处理列表

  SETCONFIGURE: `${environment.baseUrlDisp}systemsetting/setting/updateEntryQueueSetting`,//设置参数列表

  GETMESSAGEURL: `${environment.baseUrlDisp}messageController/selectAll`,//获取消息管理列表
  INSERTMESSAGEURL: `${environment.baseUrlDisp}messageController/insert`,//插入消息
  UPDATEMESSAGEURL: `${environment.baseUrlDisp}messageController/update`,//更新消息

  SELECTCARLIMITURL: `${environment.baseUrlDisp}ruleCars/selectCarLimitList`,//查询厂内车辆上限
  UPDATECARLIMITURL: `${environment.baseUrlDisp}ruleCars/update`,//更新厂内车辆上限
  INSERTVARCARLIMITURL: `${environment.baseUrlDisp}ruleCars/insert`,//插入厂内品种车辆上限


  GETCONFIGURE: `${environment.baseUrlDisp}systemsetting/setting/getEntryQueueSetting`,//获取调度参数配置
  GETMATKINDLIST: `${environment.baseUrlDisp}matKind/getRecords`,//查询物料分类维护列表
  INSERTKINDLIST: `${environment.baseUrlDisp}matKind/insert`, //新增物料分类维护列表
  UPDATEKINDLIST: `${environment.baseUrlDisp}matKind/update`,//更新物料分类维护列表

  GETCODESETLIST: `${environment.baseUrlDisp}codesetController/getRecords`,//获取种类代码集和代码明细列表
  INSERTCODESETDESC: `${environment.baseUrlDisp}codesetDesc/insertCodesetDesc`,//添加种类代码集
  INSERTCODESET: `${environment.baseUrlDisp}codesetController/insertCodeset`,//添加子项
  GETCODESETDESCLIST: `${environment.baseUrlDisp}codesetDesc/getAll`,//动态获取代码集名称
  DELETECODESET: `${environment.baseUrlDisp}codesetController/deleteCodeset`,//作废状态
  UPDATECODESET: `${environment.baseUrlDisp}codesetController/updateCodeset`,//修改代码明细

  GETQUEUERULELIST: `${environment.baseUrlDisp}entryRuleController/selectEntryRule`,//获取品种优先级设置/品种可入厂大门列表
  GETQUEUERULECLASSLIST: `${environment.baseUrlDisp}entryRuleController/selectEntryRuleClass`,//获取品种优先级设置列表
  GETQUEUERULEGATESLIST: `${environment.baseUrlDisp}entryRuleController/selectEntryRuleGates`,//品种可入厂大门列表
  INSERTQUEUERULE: `${environment.baseUrlDisp}entryRuleController/insertEntryRule`,//添加品种优先级设置/品种可入厂大门
  UPDATEQUEUERULE: `${environment.baseUrlDisp}entryRuleController/updateEntryRule`,//修改品种优先级设置/品种可入厂大门
  DELETEQUEUERULE: `${environment.baseUrlDisp}entryRuleController/deleteEntryRule`,//作废品种优先级设置/品种可入厂大门
  GETMATKIND: `${environment.baseUrlDisp}matKind/selectByMatKindOne`,//分类名称的动态下拉列表


  GETTRANSTASKLIST: `${environment.baseUrlDisp}transtaskController/getRecords`, //获得与运输任务列表

  QueueScheduling: `${environment.baseUrlDisp}entryQueueTask/getAllTaskList`,//车辆排队调度查询
  GETQUEUEDETAIL: `${environment.baseUrlDisp}entryQueueTask/getQueueDetail`,//送货车辆排队调度修改
  UPDATEDETAIL: `${environment.baseUrlDisp}entryQueueTask/updateDetail`, //送货车辆修改确认
  ENTRYNOTICE: `${environment.baseUrlDisp}entryQueueTask/entryNotice`,//车辆调度的直接入厂
  FASTTRACK: `${environment.baseUrlDisp}entryQueueTask/fastTrack`, //车辆调度的绿色通道
  GETAllCODESET: `${environment.baseUrlDisp}codesetController/getAllCodeset`,//下拉框
  GETPICKTASKLIST: `${environment.baseUrlDisp}entryQueueTask/getPickTaskList`,//仓库车辆调度
  GETSECONDkIND: `${environment.baseUrlDisp}matKind/selectByMatKindOne`,//二级列表信息

  GETWAREHOUSESTOW: `${environment.baseUrlDisp}warehousestow/getRecords`,//获取仓库装载位关系集合
  INSERTWAREHOUSE: `${environment.baseUrlDisp}warehouse/insertWareHouse`,//新增仓库
  INSERTWAREHOUSESTOW: `${environment.baseUrlDisp}warehousestow/insertWareHouseStow`,//新增装载位
  GETWAREHOUSE: `${environment.baseUrlDisp}warehouse/getAll`,//获取仓库集合
  GETWAREHOUSELIST:`${environment.baseUrlDisp}warehouse/getRecords`,//获取仓库集合列表
  UPDATEWAREHOUSESTOW: `${environment.baseUrlDisp}warehousestow/updateWareHouseStow`,//修改仓库装载位关系
  DELETEWAREHOUSESTOW: `${environment.baseUrlDisp}warehousestow/deleteWareHouseStow`,//作废仓库装载位关系
  DELETEWAREHOUSE:`${environment.baseUrlDisp}warehouse/deleteWareHouse `,//获取装车位
  GETALLSTOW: `${environment.baseUrlDisp}warehousestow/getItemsByWareHouseStowCode `,//获取装车位
  STOWNOTICE: `${environment.baseUrlDisp}entryQueueTask/stowNotice` ,  //仓库调度保存
  GETTRANSTASKLISTBYTASKID:`${environment.baseUrlDisp}transtaskController/selectByTransTaskCode`, //依据taskid获得运输过程

  GETQUERYCARSURL:`${environment.baseUrlDisp}entryQueueTask/getRecordsByVendor`, //获取车辆查询数据
  GETQUERYCARSNUMURL:`${environment.baseUrlDisp}entryQueueTask/getStataByStatusType2`, //获取车辆查询数据
  GETSTATABYGATE:`${environment.baseUrlDisp}entryQueueTask/getStataByGate`, // 获取获取全部老区新区数据数据
  GETRECORDSBYKIND: `${environment.baseUrlDisp}entryQueueTask/getRecordsByKind`,//厂内品种列表
  GETSTATABYKIND2:`${environment.baseUrlDisp}entryQueueTask/getStataByKind2`,//厂内品种统计数据
  GETWAREHOUSELISTDATA:`${environment.baseUrlDisp}warehouse/getWarehouse `,//仓库车辆调度表头数据
  GETDATABYWAREHOUSECODE:`${environment.baseUrlDisp}entryQueueTask/getDataByWareHouseCode`,  //仓库车辆调度统计
  MANUALUPDATESTATUS:`${environment.baseUrlDisp}entryQueueTask/manualUpdateStatus`,  //完成出厂
  DRIVERUNBIND:`${environment.baseUrlDisp}deviceController/update`,// 司机解绑

  GETUSERTRUCKLIST:`${environment.baseUrlDisp}UserTruckController/selectUserTruck `,//获取用户管理列表
  INSERTUSERTRUCK:`${environment.baseUrlDisp}UserTruckController/insertUserTruck `,//新增用户管理
  DELECTUSERTRUCK:`${environment.baseUrlDisp}UserTruckController/deleteUserTruck `,//删除用户管理
  UPDATEUSERTRUCK:`${environment.baseUrlDisp}UserTruckController/updateUserTruck `,//修改用户管理

  UPDATEWAREHOUSE:`${environment.baseUrlDisp}warehouse/updateWareHouse`,//更新仓库

  GETAllWAREHOUSE: `${environment.baseUrlDisp}warehouse/getAllWareHouse`,//获取仓库集合

  GETVEHICLETRAJECTORY: `${environment.baseUrlDisp}entryQueueTask/getVehicleTrajectory`,//获取车辆轨迹

  INSERTCOMPANYTRUCK: `${environment.baseUrlDisp}CompanyTruckController/insertCompanyTruck`,//新增公司-车队维护关系
  DELETECOMPANYTRUCK: `${environment.baseUrlDisp}CompanyTruckController/deleteCompanyTruck`,//作废公司-车队维护关系
  UPDATECOMPANYTRUCK: `${environment.baseUrlDisp}CompanyTruckController/updateCompanyTruck`,//修改公司-车队维护关系
  SELECTCOMPANYTRUCK: `${environment.baseUrlDisp}CompanyTruckController/selectAll`,//查询公司-车队维护关系

  GETRECORDSVENDOR: `${environment.baseUrlDisp}vendor/getRecords`,//获取供应商基础数据
  INSERTVENDOR: `${environment.baseUrlDisp}vendor/insertVendor`,//添加供应商基础数据
  UPDATEVENDOR: `${environment.baseUrlDisp}vendor/updateVendor`,//修改供应商基础数据
  CANCELLATIONVENDOR : `${environment.baseUrlDisp}vendor/cancellationVendor`,//作废供应商基础数据

  GETRECORDSVENDORKIND: `${environment.baseUrlDisp}vendorKind/getRecords`,//获取供应商和品种车辆上限设置数据
  GETVENDORRECORDS: `${environment.baseUrlDisp}vendor/getVendorRecords`,//查询全部启用的供应商(下拉)
  INSERTVENDORKIND: `${environment.baseUrlDisp}vendorKind/insertVendorKind`,//添加供应商和品种车辆上限数据
  UPDATEVENDORKIND: `${environment.baseUrlDisp}vendorKind/updateVendorKind`,//修改供应商和品种车辆上限
  CANCELLATIONVENDORKIND : `${environment.baseUrlDisp}vendorKind/cancellationVendorKind`,//作废供应商和品种车辆上限数据

  DRIVERUNBINDSEARCH: `${environment.baseUrlDisp}deviceController/selectPhone`, // 司机解绑查询根据手机号查询

  DRIVERUNBINDSEARCHALL: `${environment.baseUrlDisp}deviceController/select`,    // 司机解绑查询全部

  EXPORTEXCEL: `${environment.baseUrlDisp}entryQueueTask/queueExcel`,   //  导出Excel接口

  CLOSETASK: `${environment.baseUrlDisp}entryQueueTask/closeTask`, // 关闭任务


}
