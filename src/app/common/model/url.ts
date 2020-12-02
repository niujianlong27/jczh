import {environment} from '@env/environment';

export const urls: any = {
  login: `${environment.baseUrl}user/login`,//3.0登陆

  loginV2: `http://47.98.161.134:61924/bclp/user/signIn`,//2.0登陆
  loginV1: `http://114.215.78.194/info/user/signIn`,//1.0登陆
  loginHZD: `${environment.baseUrlShipper}/user/login`,//货主端登录
  loginOut: `${environment.baseUrl}user/loginOut`,//登陆
  updatePwd: `${environment.baseUrl}user/updatePwd`,//修改密码
  sendVerificationCode: `${environment.baseUrl}user/sendVerificationCode`,//发送验证码
  sendVerificationCodeWeb: `${environment.baseUrl}user/sendVerificationCodeWeb`,//发送验证码
  selectVehicleCount: `${environment.baseUrl}vehicle/selectVehicleCount`,//车源查询合作车辆数
  selectDriverCount: `${environment.baseUrl}vehicle/selectDriverCount`,//车源查询合作司机数
  checkCode: `${environment.baseUrl}applicationAccount/checkCode`,//验证码校验
  insertApplicationAcc: `${environment.baseUrl}applicationAccount/insertApplicationAcc`,//官网申请注册
  updateApplicationAcc: `${environment.baseUrl}applicationAccount/updateApplicationAcc`,//官网修改注册信息
  exchangePassword: `${environment.baseUrl}applicationAccount/exchangePassword`,//官网忘记密码
  selectApplicationAcc: `${environment.baseUrl}applicationAccount/selectApplicationAcc`,//官网查询用户信息

  getRealBid: `${environment.baseUrlManage}bid/getRealBid`,//官网首页查询
  getSeaWaybillList: `${environment.baseUrlManage}SeaWaybill/getSeaWaybillList`,//官网首页查询
  getRealWaybillList: `${environment.baseUrlManage}waybill/getRealWaybillList`,//官网首页查询

  switchingCompany: `${environment.baseUrl}user/switchingCompany`,//切换公司
  getCompanyBizCompany: `${environment.baseUrl}BizCompany/getCompanyBizCompany`,//获取可操作的公司
  getUserSet: `${environment.baseUrl}userSet/getUserSet`,//获取用户设置
  updateUserSet: `${environment.baseUrl}userSet/updateUserSet`,//用户自定义设置
  userMenus: `${environment.baseUrl}menu/getUserMenus`,  //菜单
  finds: `${environment.baseUrl}userFind/getUserFinds`,//查询框
  static: `${environment.baseUrl}static/getStatic`,//值集
  userBusiSegment: `${environment.baseUrl}userBusiSegment/selectByRequestUserId`,//值集
  companyStatic: `${environment.baseUrl}staticCompany/getStaticCompanyByValueSetCodeTwo`,
  button: `${environment.baseUrl}roleButton/getUserButtons`,//界面按钮
  columns: `${environment.baseUrl}userColumn/getUserColumns`,//表头列
  mnemonicCode: `${environment.baseUrl}company/mnemonicCode`,//助记码
  selectUser: `${environment.baseUrl}user/selectUser`,// APP查询用户
  selectUserList: `${environment.baseUrl}user/selectUserList`, //业务板块设置数据1
  getRoleUserByName: `${environment.baseUrl}roleUser/getRoleUserByName`, //业务板块搜索查询
  getRoleUserByNameNew: `${environment.baseUrl}roleUser/getRoleUserByNameNew`, //业务板块搜索查询
  msSelectRecord: `${environment.baseUrl}messageSet/selectRecord`, //竞价人招标设置查询
  msSaveRecord: `${environment.baseUrl}messageSet/saveRecord`, //竞价人招标设置保存

  //平台公司权限新
  copyCompanyForm: `${environment.baseUrl}companyForm/copyCompanyForm`, //平台公司权限 复制公司权限
  confirmCopyCompanyForm: `${environment.baseUrl}companyForm/confirmCopyCompanyForm`, //确认 复制公司权限
  deleteCompanyFormRole: `${environment.baseUrl}companyForm/deleteCompanyFormRole`, //删除复制公司权限

  getPlataCompany: `${environment.baseUrl}plateCompany/getPlataCompany`, //主表查询
  setCompanyAdmin: `${environment.baseUrl}plateCompany/setCompanyAdmin`, //添加管理员数据
  deletePlateCompany: `${environment.baseUrl}plateCompany/deletePlateCompany`, //删除数据
  updatePlateCompany: `${environment.baseUrl}plateCompany/updatePlateCompany`, //修改
  insertPlateCompanyBase: `${environment.baseUrl}plateCompany/insertPlateCompanyBase`, //新增
  getUserNameByCompanyId: `${environment.baseUrl}user/getUserNameByCompanyId`,//查询公司
  getLoginCompanyAdmins: `${environment.baseUrl}user/getLoginCompanyAdmins`,//查询公司

  selectRecord: `${environment.baseUrl}userBusiSegment/selectRecord`,// 业务板块设置数据2已选
  getBusiSegment: `${environment.baseUrl}busiSegment/getBusiSegment`,// 业务板块设置数据2
  insertRecord: `${environment.baseUrl}userBusiSegment/insertRecord`,//业务板块设置 保存
  selectAppUserForm: `${environment.baseUrl}appUserForm/selectAppUserForm`,// APP 根据公司ID查询公司员工信息
  updatePasswordInitialization: `${environment.baseUrl}user/updatePasswordInitialization`,// 重置为默认密码123456
  updateAppUserForm: `${environment.baseUrl}appUserForm/updateAppUserForm`,// APP更新用户FormId
  getUserForm: `${environment.baseUrl}appUserForm/getUserForm`,// APP查询用户已有界面
  getUserFromBK: `${environment.baseUrl}appUserForm/getUserFromBK`,// APP查询用户没有的界面
  getSegmentInformation: `${environment.baseUrlSystem}busiSegment/getCompanyBusiSegment`,// 查询登陆人公司业务板块
  getCompanySegment: `${environment.baseUrlSystem}busiSegment/getCompanySegment`,// 查询指定公司业务板块
  selectProdSections: `${environment.baseUrlSystem}prodSpection/selectProdSections`,// 品种规格 查询接口
  addProdSerctions: `${environment.baseUrlSystem}prodSpection/addProdSerctions`,// 品种规格 新增接口
  updateProdSerctions: `${environment.baseUrlSystem}prodSpection/updateProdSerctions`,// 品种规格 修改接口
  deleteProdSerctions: `${environment.baseUrlSystem}prodSpection/deleteProdSerctions`,// 品种规格 删除接口

  //线路价格管理(应收)
  getTransInprice: `${environment.baseUrlSystem}transInprice/getTransInprice`,// 线路价格管理(应收) 价格数据 查询接口
  selectSpaceMoney: `${environment.baseUrlSystem}transInprice/selectSpaceMoney`,// 线路价格管理(应收) 地点价格 查询接口
  addTransInprice: `${environment.baseUrlSystem}transInprice/addTransInprice`,// 线路价格管理(应收) 新增接口
  updateTransInprice: `${environment.baseUrlSystem}transInprice/updateTransInprice`,// 线路价格管理(应收) 修改接口
  deleteTransInprice: `${environment.baseUrlSystem}transInprice/deleteTransInprice`,// 线路价格管理(应收) 删除接口
  exportExcel: `${environment.baseUrlSystem}transInprice/exportExcel`,//线路价格管理(应收)导出接口

  //线路价格管理(应付)
  selectProd: `${environment.baseUrlSystem}transOutprice/selectProd`,// 线路价格管理(应付) 查询接口
  transOutpriceImport: `${environment.baseUrlSystem}/transOutprice/import`,// 线路价格管理(应付) 导入接口
  insertProdList: `${environment.baseUrlSystem}transOutprice/insertProdList`,// 线路价格管理(应付) 新增接口
  updateProdList: `${environment.baseUrlSystem}transOutprice/updateProdList`,// 线路价格管理(应付) 修改接口
  deleteProdList: `${environment.baseUrlSystem}transOutprice/deleteProdList`,// 线路价格管理(应付) 删除接口
  ModifyPrice: `${environment.baseUrlSystem}transOutprice/ModifyPrice`, //线路价格管理(应付) 提价接口
  outexportExcel: `${environment.baseUrlSystem}/transOutprice/exportExcel`,// 线路价格管理(应付) 导出接口

  // 公里单价管理
  selectKilo: `${environment.baseUrlSystem}tLineKileprice/selectRecord`,// 公里单价管理 查询接口
  insertKiloList: `${environment.baseUrlSystem}tLineKileprice/insertRecord`,// 公里单价管理 新增接口
  updateKiloList: `${environment.baseUrlSystem}tLineKileprice/updateRecord`,// 公里单价管理 修改接口
  deleteKiloList: `${environment.baseUrlSystem}tLineKileprice/deleteRecord`,// 公里单价管理 删除接口

  // 支付通道管理
  getPayChannel: `${environment.baseUrlSystem}payChannel/getPayChannel`,// 支付通道管理 查询
  insertPayChannel: `${environment.baseUrlSystem}payChannel/insertPayChannel`,// 支付通道管理 增加
  updatePayChannel: `${environment.baseUrlSystem}payChannel/updatePayChannel`,// 支付通道管理 修改
  deletePayChannel: `${environment.baseUrlSystem}payChannel/deletePayChannel`,// 支付通道管理 删除
  getPayChannels: `${environment.baseUrlSystem}payChannel/getPayChannels`,// 支付通道 查询无分页

  // 公司结算账户维护
  getCompanySettle: `${environment.baseUrlSystem}companySettle/getCompanySettle`,// 公司结算账户维护 查询接口
  updateCompanySettle: `${environment.baseUrlSystem}companySettle/updateCompanySettle`,// 公司结算账户维护 修改接口
  deleteCompanySettle: `${environment.baseUrlSystem}companySettle/deleteCompanySettle`,// 公司结算账户维护 删除接口
  addCompanySettle: `${environment.baseUrlSystem}companySettle/addCompanySettle`,// 公司结算账户维护 新增接口
  selectProvices: `${environment.baseUrlSystem}point/selectProvices`,// 获取 省 市 区 乡的

  selectByArea: `${environment.baseUrlSystem}transOutprice/selectByArea`,//调价单独获取乡
  getprodKindPrice: `${environment.baseUrlSystem}prodSpection/getprodKindPrice`,// 获取品种

  selectQuickEntry: `${environment.baseUrlSystem}quickEntry/selectQuickEntry`,// 首页信息获取
  updatePhone: `${environment.baseUrlSystem}user/updatePhone`,// 首页修改手机号
  updateEmail: `${environment.baseUrlSystem}user/updateEmail`,// 首页修改邮箱
  getMsgByBankId: `${environment.baseUrlSystem}companyBank/getMsgByBankId`,// 通过bankId查询银行账户
  generateMnemonicCode: `${environment.baseUrlSystem}company/updateEasyCode`,// 客户管理批量生成助记码
  getCompanyFlow: `${environment.baseUrlSystem}flow/getCompanyFlow`,// 获取运输方式
  getMsgByCompanyId: `${environment.baseUrlSystem}companyBank/getMsgByCompanyId`,// 通过公司ID查一条银行账户信息
  getTaxNoByCompanyId: `${environment.baseUrlSystem}company/getTaxNoByCompanyId`,// 通过公司ID查当前公司税号
  getAllMsgByCompanyId: `${environment.baseUrlSystem}staticCompany/getAllMsgByCompanyId`,// 查当前公司的公司静态集值
  getPointOnly: `${environment.baseUrlSystem}point/getPointOnly`,// 判断地点是否能删除

  addPointDistance: `${environment.baseUrlSystem}point/addPoint2`,
  selectDistance: `${environment.baseUrlSystem}point/selectDistance`,

  //
  getCommonAddress: `${environment.baseUrlSystem}commonAddress/getCommonAddress`,// 查询常用地址
  addCommonAddress: `${environment.baseUrlSystem}commonAddress/insertpointAddress`,// 新增常用地址
  updateCommonAddress: `${environment.baseUrlSystem}commonAddress/updateCommonAddress`,// 新增常用地址
  deleteCommonAddress: `${environment.baseUrlSystem}commonAddress/deleteCommonAddress`,// 删除常用地址


  //单车分货承运人获取
  getPlateCompanyName: `${environment.baseUrlTrans}order/getPlateCompanyName`,

  //费用登记
  WaybillFeeRegisterList: `${environment.baseUrlTrans}waybill/selectWaybillFeeRegisterList`,//费用登记列表
  getWaybillFeeUpdateInfo: `${environment.baseUrlSettle}settleFee/getWaybillSettleFeeInfo`,//费用登记列表
  addFeeRegister: `${environment.baseUrlSettle}settle/addFeeRegister`,//费用登记
  informationFeeRegistration: `${environment.baseUrlSettle}settle/informationFeeRegistration`,//费用登记信息费登记
  updateFeeRegister: `${environment.baseUrlSettle}settle/updateFeeRegister`,//费用登记修改
  feeName: `${environment.baseUrlSettle}settleFee/getFeeName`,//费用类型

  ReceivableReportList: `${environment.baseUrlSettle}settleFee/selectSettleFeeByReceivableReportList`,//应收报表形成列表
  insertSettleReport: `${environment.baseUrlSettle}settleReport/insertSettleReport`,//生成结算报表
  settleRec: `${environment.baseUrlSettle}settleRec/selectReceivableVerificationSettleRec`, //收款核销获取收款信息列表接口1
  settleReport: `${environment.baseUrlSettle}settleReport/selectReceivableVerificationSettleReport`, //收款核销获取收款信息列表接口2
  divisionMoney: `${environment.baseUrlSettle}settleRec/insertDivisionMoney`, //分款
  updateDivisionMoneyToVoid: `${environment.baseUrlSettle}settleRec/updateDivisionMoneyToVoid`,//收款核销作废
  selectCanLeveledAccountSettleReport: `${environment.baseUrlSettle}settleReport/selectCanLeveledAccountSettleReport`, //申请平账列表
  financialConfirm: `${environment.baseUrlSettle}settleRec/getAffirm`, //财务确认列表
  updateFinancialConfirmation: `${environment.baseUrlSettle}settleRec/updateFinancialConfirmation`,//收款确认
  updateCancelConfirmation: `${environment.baseUrlSettle}settleRec/updateCancelConfirmation`,//收款取消确认
  waybillSettlement: `${environment.baseUrlSettle}waybill/getWaybillSettlement`, //运单结算信息
  getOrdersSettleInfo: `${environment.baseUrlSettle}order/getOrdersSettleInfo`, //合同结算信息查詢

  //费用登记
  selectSettleByOrder: `${environment.baseUrlSettle}settle/selectSettleByOrder`,//费用登记 结算单
  selectFee: `${environment.baseUrlSettle}settleFee/getSettleFeeByNoList`,//费用登记 费用信息（可操作）
  selectOrderFee: `${environment.baseUrlSettle}settleOrder/getSettleOrderByNoList`, //费用登记 费用明细
  settleAccounts: `${environment.baseUrlSettle}settleReport/updateAutoLeveledAccount`,//自动平账
  applyFlatfee: `${environment.baseUrlSettle}flatfee/insertApplyFlatfee`,//申请平账


  deleteSettleWaybill: `${environment.baseUrlSettle}settle/deleteSettleWaybill`,//
  //应付报表
  accountsPayable: `${environment.baseUrlSettle}settleFee/getAccountsPayable`,//应付报表结算形成
  insertPayReport: `${environment.baseUrlSettle}payreport/insertPayReport`,//应付报表结算形成生成结算报表
  printPayReport: `${environment.baseUrlSettle}print/payReport`,//应付报表 分组打印接口 按车队展示
  carriageContract: `${environment.baseUrlSettle}print/carriageContract`,//应付报表 分组打印接口 按合同展示
  subExport: `${environment.baseUrlSettle}payreport/subExport`,//应付报表 分组导出接口
  payReportExportXlsx: `${environment.baseUrlSettle}payreport/payReportExportXlsx`,//应付报表 报表导出
  exportSettleFees: `${environment.baseUrlSettle}settleFee/exportSettleFees`,//应付报表 费用导出

  //应收报表
  settleReportPrintExport: `${environment.baseUrlSettle}settleReport/settleReportPrintExport`,//应收结算报表导出打印列表接口
  carriageContractBySettleReport: `${environment.baseUrlSettle}print/carriageContractBySettleReport`,//应收结算报表导 合同打印
  settleReportPrint: `${environment.baseUrlSettle}settleReport/settleReportPrint`,//应收结算报表导出打印
  printSelect: `${environment.baseUrlSettle}payreport/printSelect`,//应付计算报表导出打印列表接口
  printSettleReport: `${environment.baseUrlSettle}print/settleReport`,//应收报表 分组打印接口
  settleReportSubExport: `${environment.baseUrlSettle}settleReport/subExport`,//应收报表 分组打印接口
  exportReportFees: `${environment.baseUrlSettle}settleFee/exportReportFees`,//应收报表 费用明细导出

  getPage: `${environment.baseUrlSettle}order/getPage`,//委托配款列表委托记录
  getListSettle: `${environment.baseUrlSettle}order/get-list-settle`,//委托配款列表委托记录
  selectSettleRecForOrder: `${environment.baseUrlSettle}settleRec/select-settleRec-for-order`,//委托配款列表收款登记记录
  selectSettleRecForOrder2: `${environment.baseUrlSettle}settleRec/select-settleRec-for-order2`,//委托配款列表收款登记记录
  getListBySettleRec: `${environment.baseUrlSettle}order/getListBySettleRec`,//委托配款列表合同记录
  settleRecexport: `${environment.baseUrlSettle}settleRec/select-settleRec-for-export`,//委托配款列表合同记录
  forceConfirm: `${environment.baseUrlSettle}order/forceConfirm`,//合同配款新页面强制分款接口
  flatAccountOrder: `${environment.baseUrlTrans}order/flatAccountOrder`,//客户平账 列表1
  flatAccountSettleRecI: `${environment.baseUrlTrans}order/flatAccountSettleRecI`,//客户平账 列表2
  flatAccount: `${environment.baseUrlSettle}settleRec/flatAccount`,//自动平账
  manualFlatAccount: `${environment.baseUrlSettle}settleRec/manualFlatAccount`,//手动平账

  allocateFunds: `${environment.baseUrlSettle}settleRec/allocate-funds`,//委托配款手动分款
  allocateFundsV2: `${environment.baseUrlSettle}settleRec/allocateFundsV2`,//委托配款手动分款
  allocateFundsV3: `${environment.baseUrlSettle}settleRec/allocateFundsV3`,//委托配款手动分款 合同配款操作新页面手动分款

  getDiffMoney: `${environment.baseUrlSettle}settleRec/getDiffMoney`,//委托配款手动分款
  selectSettleRecConfirmInfo: `${environment.baseUrlSettle}settleRec/select-settleRec-confirm-info`,//委托配款确认列表(旧)
  selectOrderConfirmInfo: `${environment.baseUrlSettle}order/select-order-confirm-info`,//委托配款确认列表(新)
  autoAllocateFunds: `${environment.baseUrlSettle}settleRec/auto-allocate-funds`,//委托配款自动分款
  autoAllocateFunds2: `${environment.baseUrlSettle}settleRec/auto-allocate-funds2`,//委托配款自动分款
  fundsCancelConfirm: `${environment.baseUrlSettle}settleRec/cancel-confirm`,//委托配款取消确认 (旧)
  cancelConfirm: `${environment.baseUrlSettle}order/cancel-confirm`,//委托配款取消确认(新)
  confirm: `${environment.baseUrlSettle}order/confirm`,//委托配款确认(新)
  confirmOrderRefund: `${environment.baseUrlSettle}order/confirmOrderRefund`,//委托配款取消(新)
  orderConfirmExport: `${environment.baseUrlSettle}order/orderConfirmExport`,//合同配款确认导出

  //委托配款结算
  fundsConfirm: `${environment.baseUrlSettle}settleRec/confirm`,//委托配款确认(旧)
  selectClientMoney: `${environment.baseUrlSettle}settleRec/select-client-money`,//客户资金管理列表接口
  selectClientMoneyDetail: `${environment.baseUrlSettle}settleRec/select-client-money-detail`,//客户资金管理列表详细接口
  batchRefund: `${environment.baseUrlSettle}settleRec/batch-refund`,//客户资金管理 退款
  selectAllocateFundsDetail: `${environment.baseUrlSettle}settleRec/select-allocate-funds-detail`,// 委托配款结算
  getListByOrderNo: `${environment.baseUrlSettle}settleReport/get-list-by-orderNo`,//委托配款结算

  // 合同结算管理
  settle: `${environment.baseUrlSettle}order/settle`,//合同结算管理 委托配款结算
  orderStatements: `${environment.baseUrlSettle}print/orderStatements`,// 合同结算管理，打印委托单
  checkout: `${environment.baseUrlSettle}order/checkout`,// 合同结算管理，结算详情数据

  getFee: `${environment.baseUrlSystem}companyFee/getCompanyFeeList`,//获取公司费用类型

  getPierBy: `${environment.baseUrlSystem}pier/getPierBy`,//获取港口
  getPierBytwo: `${environment.baseUrlSystem}pier/getPierByTwo`,//获取港口

  pretenderpalletAdd: `${environment.baseUrlBid}pallet/add`,//预招投标新增资源
  palletCopy: `${environment.baseUrlBid}pallet/copy`,//预招标复制资源
  batchUpdate: `${environment.baseUrlBid}pallet/batch-update`,//预招投标修改资源
  pretenderpalletList: `${environment.baseUrlBid}pallet/get-list`,//发布预招标列表
  palletItemList: `${environment.baseUrlBid}palletItem/get-list`,//发布预招标明细列表
  palletFind: `${environment.baseUrlBid}pallet/find`,//发布预招标明细列表
  getPlateByCompany: `${environment.baseUrlSystem}plateCompany/getPlateByCompany`,//预招标新增平台查询
  getCompanyByCompanyId: `${environment.baseUrlSystem}companyBase/getCompanyByCompanyId`, //预招标新增公司查询
  batchDelete: `${environment.baseUrlBid}pallet/batch-delete`,//删除预招标
  separatePublishInfo: `${environment.baseUrlBid}pretender/separate-publish-info`,//分别发布预招标弹窗列表
  separatePublish: `${environment.baseUrlBid}pretender/separate-publish`,//发布预招标分别发布
  onePricePublish: `${environment.baseUrlBid}pretender/one-price-publish`,//发布预招标捆绑发布按均价报价
  publishByNameDir: `${environment.baseUrlBid}pretender/publish-by-name-dir`,//发布预招标捆绑发布按分别报价
  palletClassification: `${environment.baseUrlTrans}ordertender/palletClassification`,//捆绑发布预招标弹窗列表
  selectCompanyUserBid: `${environment.baseUrl}companyUser/selectCompanyUserBid`,//投标人列表
  selectBidRecord: `${environment.baseUrlBid}prebid/select-bid-record`,//投标结果接口
  selectAssess: `${environment.baseUrlBid}pretender/select-assess`,//预评标招标单查询
  selectAgg: `${environment.baseUrlBid}prebid/select-agg`,//预评标发布竞价
  selelctPalletItemByContent: `${environment.baseUrlBid}palletItem/selelctPalletItemByContent`,//货盘明细查询
  selectpalletPackContent: `${environment.baseUrlBid}palletPack/selectpalletPackContent`,//捆包明细查询
  selectAverage: `${environment.baseUrlBid}prebid/select-average`,// 查询投标结果-按均价
  recordDetail: `${environment.baseUrlBid}pretender/record-detail`,// 查看标单详情(按品名、流向)
  undo: `${environment.baseUrlBid}pretender/undo`,// 撤销预招标资源
  prebidSelectMessage: `${environment.baseUrlBid}prebid/select-message`,// 展示投标结果（投标人基本信息）
  prebidrecordSelectMessage: `${environment.baseUrlBid}prebidrecord/select-message`,// 展示投标历史（按流向，品名）
  prebidrecordselectHistory: `${environment.baseUrlBid}prebidrecord/select-history`,// 展示投标历史-按均价
  getWeightContainer: `${environment.baseUrlBid}pretender/get-weight-container`,// 汇总重量获取
  palletPreview: `${environment.baseUrlBid}report/preview2`,// 报表预览

  entrustPublic: `${environment.baseUrlTrans}ordertenderpallet/getOrderTenderPallet`,//发布待委托资源主页面查询
  entrustBundled: `${environment.baseUrlTrans}ordertender/palletClassification`,//发布待委托页面捆绑发布查询

  //获取地点的接口
  pointUrl: `${environment.baseUrl}address/getAddress`,//获取地址的接口
  addPoint: `${environment.baseUrl}point/insertPoint`,//添加地址的接口
  confirmIsses: `${environment.baseUrlTrans}ordertender/insertOrderTender`,  // 发布待委托确认发布
  entrustIsses: `${environment.baseUrlTrans}ordertenderpallet/getIssuedSeparately`,  //分别发布列表查询
  pretenderSelectList: `${environment.baseUrlBid}pretender/select-list`,//预投标管理列表接口
  pretenderSelectListDetail: `${environment.baseUrlBid}pretender/select-detail`,//预投标管理明细接口

  getOnBusinessBoatInfo: `${environment.baseUrlTrack}boatSchedule/getOnBusinessBoatInfo`,
  getOnBusinessVehicleInfo: `${environment.baseUrlTrack}plan/getOnBusinessVehicleInfo`,
  getSingleShipPosition: `${environment.baseUrlTrack}position/getSingleShip`,
  getShipTrack: `${environment.baseUrlTrack}position/getShipTrack`,
  getCarTrack: `${environment.baseUrlTrack}position/getCarTrack`,
  getSingleCar: `${environment.baseUrlTrack}position/getSingleCar`,

  //基础信息品种车型对照
  getVechileProd: `${environment.baseUrlSystem}vechileProd/getVechileProd`,//查询
  insertVechileProd: `${environment.baseUrlSystem}vechileProd/insertVechileProd`,//新增
  deleteVechileProd: `${environment.baseUrlSystem}vechileProd/deleteVechileProd`,//删除
  updateVechileProd: `${environment.baseUrlSystem}vechileProd/updateVechileProd`,//修改

  //基础信息评标管理
  getFleetRatio: `${environment.baseUrlSystem}fleetRatio/getFleetRatio`,//查询
  insertFleetRatio: `${environment.baseUrlSystem}fleetRatio/insertFleetRatio`,//插入
  deleteFleetRatio: `${environment.baseUrlSystem}fleetRatio/deleteFleetRatio`,//删除
  updateFleetRatio: `${environment.baseUrlSystem}fleetRatio/updateFleetRatio`,//修改
  importFleetRatio: `${environment.baseUrlSystem}fleetRatio/importFleetRatio`,//导入

  insertFleetRatioV2: `${environment.baseUrlSystem}fleetRatio/insertFleetRatioV2`,//插入
  getFleetRatioItem: `${environment.baseUrlSystem}fleetRatio/getFleetRatioItem`,//子列表
  setlectDistinctProd: `${environment.baseUrlSystem}transOutprice/setlectDistinctProd`,//查询
  selectProdNew: `${environment.baseUrlSystem}prodSpection/selectPriceOutToSplitProd`,

  updateFleetRatioV2: `${environment.baseUrlSystem}fleetRatio/updateFleetRatioV2`,//修改
 // insertFleetRatio: `${environment.baseUrlSystem}fleetRatio/insertFleetRatio`,//插入
 // insertFleetRatioV2: `${environment.baseUrlSystem}fleetRatio/insertFleetRatioV2`,//插入
 // getFleetRatioItem: `${environment.baseUrlSystem}fleetRatio/getFleetRatioItem`,//子列表
 // deleteFleetRatio: `${environment.baseUrlSystem}fleetRatio/deleteFleetRatio`,//删除
  deleteFleetRatioV2: `${environment.baseUrlSystem}fleetRatio/deleteFleetRatioV2`,//删除
  deleteFleetRatioV3: `${environment.baseUrlSystem}fleetRatio/deleteFleetRatioV3`,//删除
 // updateFleetRatio: `${environment.baseUrlSystem}fleetRatio/updateFleetRatio`,//修改
 // updateFleetRatioV2: `${environment.baseUrlSystem}fleetRatio/updateFleetRatioV2`,//修改
 // importFleetRatio: `${environment.baseUrlSystem}fleetRatio/importFleetRatio`,//导入
  selectDriver: `${environment.baseUrlSystem}company/getCompanyListBySettleType`,//查询车队列表

  //基础信息线路和城市对照
  getLineCity: `${environment.baseUrlSystem}lineCity/getLineCity`,//查询
  insertLineCity: `${environment.baseUrlSystem}lineCity/insertLineCity`,//新增
  deleteLineCity: `${environment.baseUrlSystem}lineCity/deleteLineCity`,//删除
  updateLineCity: `${environment.baseUrlSystem}lineCity/updateLineCity`,//修改

  getLogLoginNum: `${environment.baseUrlSystem}logLogin/getLogLoginNum`,//app使用报表查询
  exportLoginNum: `${environment.baseUrlSystem}logLogin/exportLoginNum`,//app使用报表导出

  //  出库单管理
  getBclpStackingInfoMain: `${environment.baseUrlInter}bclpStackingInfoMain/getBclpStackingInfoMain`,
  useStackingInfoMain: `${environment.baseUrlInter}lmsStockOut/used`, //使用//http://127.0.0.1:9106/lmsStockOut/used
  nouseStackingInfoMain: `${environment.baseUrlInter}lmsStockOut/unUsed`,//http://127.0.0.1:9106/lmsStockOut/unUsed
  getLocationInformation: `${environment.baseUrlTrans}generatedWaybill/getLocationInformation`,//生成运单
  createwayBill: `${environment.baseUrlTrans}waybillGenerate/waybillGenerate`,//生成运单http://127.0.0.1:9034/waybillGenerate/waybillGenerate
  // getBclpStackingInfoMainSW: `${environment.baseUrlInter}bclpStackingInfoMain/getBclpStackingInfoMainSW`,

  // 退库出库信息
  getBclpStackingInfoDetailUnion: `${environment.baseUrlInter}bclpStackingInfoDetailUnion/selectRecord`,
  exportBclpStackingInfoDetailUnion: `${environment.baseUrlInter}bclpStackingInfoDetailUnion/export`,

  //省外出库信息
  // getBclpStackingInfoMainSW: `${environment.baseUrlInter}bclpStackingInfoMain/getBclpStackingInfoMainSW`,
  getBclpStackingInfoMainSW: `${environment.baseUrlInter}lmsStockOut/getPage`,//http://127.0.0.1:9106/lmsStockOut/getPage
  getBclpStackingInfoMainSWItem: `${environment.baseUrlInter}lmsStockOut/getDetails`,//http://127.0.0.1:9106/lmsStockOut/getDetails
  exportExcelSW: `${environment.baseUrlInter}bclpStackingInfoMain/exportExcelSW`,

  //  出库单维护
  getBclpStackingInfoDetail: `${environment.baseUrlInter}bclpStackingInfoMain/getBclpStackingInfoDetail `,  //查询
  updateBclpStackingInfoDetail: `${environment.baseUrlInter}bclpStackingInfoMain/updateBclpStackingInfoDetail `, //保存
  importBclpStackingInfoDetail: `${environment.baseUrlInter}bclpStackingInfoMain/importBclpStackingInfoDetail `, //运单查询导入
  exportBclpStackingInfoDetail: `${environment.baseUrlInter}bclpStackingInfoMain/exportBclpStackingInfoDetail `, //保存


  //地磅登记和地磅查询
  getListScaleLoadManagement: `${environment.baseUrlInter}scaleLoadManagement/getListScaleLoadManagement `,//查询主表
  getListScaleLoadManagementSon: `${environment.baseUrlInter}scaleLoadManagement/getListScaleLoadManagementSon  `,//查询子表
  insertScaleLoadManagement: `${environment.baseUrlInter}scaleLoadManagement/insertScaleLoadManagement  `,//增加主表    地磅登记
  updateScaleLoadManagement: `${environment.baseUrlInter}scaleLoadManagement/updateScaleLoadManagement   `,//修改主表
  deleteListScaleLoadManagement: `${environment.baseUrlInter}scaleLoadManagement/deleteListScaleLoadManagement  `,//删除主表
  importListScaleLoadManagement: `${environment.baseUrlInter}scaleLoadManagement/importListScaleLoadManagement `,//导入主表
  getListScaleLoadManagementExport: `${environment.baseUrlInter}scaleLoadManagement/getListScaleLoadManagementExport `,//导出主表

  confirmationOfContractPrice: `${environment.baseUrlTrans}waybill/confirmationOfContractPrice`, //线路分货比例产品查询
  waybillExport: `${environment.baseUrlTrans}waybillPack/waybillExport`,//运单返单导出
  waybillDetailExport: `${environment.baseUrlTrans}waybillPack/waybillDetailExport`,//运单返单明细导出

  getSettleCompany: `${environment.baseUrlSystem}companySettle/getSettleCompanyId`,

  //汽运招投标
  insertPalletAndItem: `${environment.baseUrlTender}pallet/insertPalletAndItem`,//汽运新增待发布资源
  getPalletAll: `${environment.baseUrlTender}pallet/getPalletAll`,//复制/修改获取信息
  updatePalletAndItem: `${environment.baseUrlTender}pallet/updatePalletAndItem`,//修改货盘
  getTenderPriceList: `${environment.baseUrlTender}tenderPrice/getTenderPriceList`,//招标单价格列表
  getTenderListForConsignor: `${environment.baseUrlTender}tender/getTenderListForConsignor`,//汽运评标管理列表
  updateTenderToPublish: `${environment.baseUrlTender}tender/updateTenderToPublish`,//手动发布招标单
  updateTenderToRepeal: `${environment.baseUrlTender}tender/updateTenderToRepeal`,//撤回招标单
  updateTenderToFailed: `${environment.baseUrlTender}tender/updateTenderToFailed`,//招标单流标
  getTenderListForBidder: `${environment.baseUrlTender}tender/getTenderListForBidder`,//投标管理列表
  getBidInfoByTenderNoAndCompany: `${environment.baseUrlTender}bid/getBidInfoByTenderNoAndCompany`,//查看投标结果
  insertBid: `${environment.baseUrlTender}bid/insertBid`,//出价
  updateTenderToSure: `${environment.baseUrlTender}tender/updateTenderToSure`,//评标
  tenderResultExport: `${environment.baseUrlTender}tender/tenderResultExport`,//评标导出
  getPalletItemAggregateByTenderNos: `${environment.baseUrlTender}palletItemAggregate/getPalletItemAggregateByTenderNos`,//货盘明细


  // 汽运招标
  getPalletList: `${environment.baseUrlTender}pallet/getPalletList`, //主列表查询
  importPalletAndItem: `${environment.baseUrlTender}pallet/importPalletAndItem`, //导入
  getPalletItemByPalletNos: `${environment.baseUrlTender}palletItem/getPalletItemByPalletNos`, // 货盘明细查询
  deletePalletAndItem: `${environment.baseUrlTender}pallet/deletePalletAndItem`, //删除
  classification: `${environment.baseUrlTender}pallet/palletClassification`, //按品名/按流向查询汇总
  getBidderCompany: `${environment.baseUrlTender}tender/getBidderCompany`, //投标人获取
  insertOrderTender: `${environment.baseUrlTender}tender/insertOrderTender`,//招标发布
  getTenderByTenderNo: `${environment.baseUrlTender}tender/getTenderByTenderNo`,//获取招标单信息
  updateTender: `${environment.baseUrlTender}tender/updateTender`,//修改招标单信息
  getBidInfoByTenderNo: `${environment.baseUrlTender}bid/getBidInfoByTenderNo`,//查看投标结果-详情
  getBidRecordInfoByTenderNo: `${environment.baseUrlTender}bidRecord/getBidRecordInfoByTenderNo`,//查看投标结果-历史
  updateTenderToAgain: `${environment.baseUrlTender}tender/updateTenderToAgain`,//重新发布
  tenderExport: `${environment.baseUrlTender}tender/tenderExport`,//评标报表
  setTenderStatus: `${environment.baseUrlTender}tender/setTenderStatus`,//成功招标


  //竞价抢单
  getJjTenderListForBidder: `${environment.baseUrlTender}jjTender/getJjTenderListForBidder`,//竞价管理列表
  getJjTenderListForConsignor: `${environment.baseUrlTender}jjTender/getJjTenderListForConsignor`,//评定竞价列表
  getJJTenderItemByTenderNos: `${environment.baseUrlTender}jjTenderItem/getJJTenderItemByTenderNos`,//区域2列表
  getBidderCompanyData: `${environment.baseUrlTender}tender/getBidderCompany`,//获取承运人
  getDriver: `${environment.baseUrlTender}tender/getDriver`,//获取司机
  selectUserId: `${environment.baseUrl}userBusiSegment/selectUserId`,//获取司机
  selectUserIdbyLocationId:`${environment.baseUrl}userBusiSegment/selectUserIdWithEndPoint`,
  getTStaticCompany: `${environment.baseUrlTender}robbed/getTStaticCompany  `,//获取
  getDriverCommon: `${environment.baseUrlTender}tender/getDriverCommon`, // 委托调度获取所有司机
  insertJjTender: `${environment.baseUrlTender}jjTender/insertJjTender`,//发布竞价
  updateForCancel: `${environment.baseUrlTender}jjTender/updateForCancel`,//发布竞价
  getBidInfo: `${environment.baseUrlTender}jjTender/getBidInfo`,//发布竞价
  updateForAbandon: `${environment.baseUrlTender}jjTender/updateForAbandon`,//放弃竞价
  getJjBidInfoByTenderNo: `${environment.baseUrlTender}jjBid/getJjBidInfoByTenderNo`,//查看竞价结果
  getJjBidRecordInfoByTenderNo: `${environment.baseUrlTender}jjBidRecord/getJjBidRecordInfoByTenderNo`,//查看历史竞价结果
  insertTjjBid: `${environment.baseUrlTender}jjBid/insertTjjBid`,//出价
  updateForSelect: `${environment.baseUrlTender}jjTender/updateForSelect`,//选择承运人/司机
  insertTrobbed: `${environment.baseUrlTender}robbed/insertTrobbed`,//抢单委托
  getRobbedInfo: `${environment.baseUrlTender}robbed/getRobbedInfo`,//抢单委托
  insertDriverGrab: `${environment.baseUrlTender}robbed/insertTrobbedByItem`, //司机抢单
  getRobbedInfoByRobbedNo: `${environment.baseUrlTender}robbedBidder/getRobbedInfoByRobbedNo`, // 抢单查看
  assessmentForSelect: `${environment.baseUrlTender}robbed/updateForSelect`, // 评定抢单
  getRobbedListForConsignor: `${environment.baseUrlTender}robbed/getRobbedListForConsignor`,//评定抢单列表
  withdrawForAbandon: `${environment.baseUrlTender}robbed/updateForAbandon`, // 抢单撤回
  getRobbedListForBidder: `${environment.baseUrlTender}robbed/getRobbedListForBidder`,//抢单管理列表
  updateForCancel1: `${environment.baseUrlTender}robbed/updateForCancel`,//撤回
  getRobbedItemByRobbedNos: `${environment.baseUrlTender}robbedItem/getRobbedItemByRobbedNos`,//抢单明细
  getRobbery: `${environment.baseUrlTender}robbed/getRob`,//获取抢单界面信息
  updateRob: `${environment.baseUrlTender}robbed/updateRob`,//抢单
  insertCirculationTrobbed: `${environment.baseUrlTender}robbed/insertCirculationTrobbed`,//循环抢单下发
  updateTotalTrainNum: `${environment.baseUrlTender}robbed/updateTotalTrainNum`,//调整抢单车次
  updateForStop: `${environment.baseUrlTender}robbed/updateForStop`,// 停止抢单

  //发货通知单
  selectDeliveryNotice: `${environment.baseUrlInter}deliveryNotice/selectDeliveryNotice`,//主表查询
  selectKeeperln: `${environment.baseUrlInter}deliveryNotice/selectKeeperln`,//子表查询

  //app界面设置
  selectAppForm: `${environment.baseUrl}appform/selectAppForm`,// APP界面查询
  insertAppForm: `${environment.baseUrl}appform/insertAppForm`,// APP界面插入
  updateAppForm: `${environment.baseUrl}appform/updateAppForm`,// APP界面更新
  deleteAppForm: `${environment.baseUrl}appform/deleteAppForm`,// APP界面删除

  //app角色管理
  selectAppRole: `${environment.baseUrl}approle/selectAppRole`,// APP角色管理查询
  insertAppRole: `${environment.baseUrl}approle/insertAppRole`,// APP角色添加
  updateAppRole: `${environment.baseUrl}approle/updateAppRole`,// APP角色修改
  deleteList: `${environment.baseUrl}approle/deleteList`,// APP角色删除

  //app版本维护
  getAppVersion: `${environment.baseUrl}appversion/getAppVersion`,// APP版本查询
  insertAppVersion: `${environment.baseUrl}appversion/insertAppVersion`,// APP版本添加
  updateAppVersion: `${environment.baseUrl}appversion/updateAppVersion`,// APP版本更新
  deleteAppVersion: `${environment.baseUrl}appversion/deleteList`,// APP版本删除
  getNewAppVersion: `${environment.baseUrl}appversion/getAppAddress`,//查询最新app版本

  //app角色用户
  getAppRoleUser: `${environment.baseUrl}approle/getAppRoleUser`,// APP角色查询
  getuser: `${environment.baseUrl}approleuser/getuser`,// APP未选用户
  getHasUser: `${environment.baseUrl}approleuser/getHasUser`,// APP已选用户
  insertList: `${environment.baseUrl}approleuser/insertList`,// 添加
  approleUserDeleteList: `${environment.baseUrl}approleuser/deleteList`,// 移除

  //app权限
  roleForm: `${environment.baseUrl}appform/roleForm`,// 未选权限
  appRoleForm: `${environment.baseUrl}appuserform/appRoleForm`,// 已选权限
  insertRoleFormList: `${environment.baseUrl}appuserform/insertRoleFormList`,// 添加
  deleteRoleList: `${environment.baseUrl}appuserform/deleteRoleList`,// 移除
  moveFoem: `${environment.baseUrl}appuserform/moveFoem`,// 移动
  move: `${environment.baseUrl}appuserform/exchangeSortId`,// 移动

  //基础信息班组管理
  teamGetPage: `${environment.baseUrlSystem}team/getPage`,//查询
  teamInsert: `${environment.baseUrlSystem}team/insert`,//新增
  teamDelete: `${environment.baseUrlSystem}team/deleteList`,//删除
  teamUpdate: `${environment.baseUrlSystem}team/update`,//删除
  getTeamUser: `${environment.baseUrlSystem}teamUser/getTeamUser`,//查询班组中已选择
  getnotTeamUser: `${environment.baseUrlSystem}teamUser/getNotTeamUser`,//查询班组中未选择
  insertListTeamUser: `${environment.baseUrlSystem}teamUser/insertList`,//查询班组中添加用户
  deleteListTeamUser: `${environment.baseUrlSystem}teamUser/deleteList`,//查询班组中删除用户

//  门机管理
  selectPortalCrane: `${environment.baseUrlSystem}portalCrane/selectPortalCrane`,//查询,
  insertPortalCrane: `${environment.baseUrlSystem}portalCrane/insertPortalCrane`,// 新增
  updatePortalCrane: `${environment.baseUrlSystem}portalCrane/updatePortalCrane`,// 修改
  deletePortalCrane: `${environment.baseUrlSystem}portalCrane/deletePortalCrane`,// 删除

  //泊位管理
  selectBerthage: `${environment.baseUrlSystem}berthage/selectBerthage`,// 查询
  insertBerthage: `${environment.baseUrlSystem}berthage/insertBerthage`,//新增
  updateBerthage: `${environment.baseUrlSystem}berthage/updateBerthage`,//修改
  deleteBerthage: `${environment.baseUrlSystem}berthage/deleteBerthage`,//删除
  getberthageNamebyCompanyId: `${environment.baseUrlSystem}berthage/getberthageNamebyCompanyId`,//泊位查询

  // 提送车辆查询
  selectTVehiclebat: `${environment.baseUrlPort}vehiclebat/selectTVehiclebat`,//查询
  insertTVehiclebat: `${environment.baseUrlPort}vehiclebat/insertTVehiclebat`, //新增
  deleteTVehiclebat: `${environment.baseUrlPort}vehiclebat/deleteTVehiclebat`, //删除
  updateTVehiclebat: `${environment.baseUrlPort}vehiclebat/updateTVehiclebat`, //修改

  // 银行信息
  selectBasicBankInformation: `${environment.baseUrlSystem}companyBank/selectBasicBankInformation`,// 查询
  insertBasicBankInformation: `${environment.baseUrlSystem}companyBank/insertBasicBankInformation`,// 新增
  updateBasicBankInformation: `${environment.baseUrlSystem}companyBank/updateBasicBankInformation`,// 修改
  deleteCollectOperationteam: `${environment.baseUrlSystem}companyBank/deleteCollectOperationteam`,// 删除
  selectBank: `${environment.baseUrlSystem}bank/selectBank`,// 银行支行获取
  selectBankBase: `${environment.baseUrlSystem}bankBase/selectBankBase`,// 银行获取

  //线路品种载重
  selectlineProd: `${environment.baseUrlSystem}prodLoad/getProdLoad`,//查询
  addlineProd: `${environment.baseUrlSystem}prodLoad/addProdLoad`,
  updatelineProd: `${environment.baseUrlSystem}prodLoad/updateProdLoad`,//新增
  deletelineProd: `${environment.baseUrlSystem}prodLoad/deleteList`,


  selectFlowId: `${environment.baseUrlSystem}flow/getCompanyFlow`,//运输方式
  selectBusiSegment: `${environment.baseUrlSystem}busiSegment/getCompanyBusiSegment`,//业务板块
  selectCompany: `${environment.baseUrlSystem}company/getCompanyBySettleType`,//  收货单位
  getUserBusinessModuleId: `${environment.baseUrlSystem}userBusiSegment/selectByRequestUserId`,


  // 叉车管理
  getForkliftList: `${environment.baseUrlSystem}forklift/getForkliftList`, //查询
  insertForklift: `${environment.baseUrlSystem}forklift/insertForklift`, //新增
  updateForklift: `${environment.baseUrlSystem}forklift/updateForklift`, //修改
  deleteForklift: `${environment.baseUrlSystem}forklift/deleteForklift`, //删除


  // 银行基础信息管理
  selectBankBasePage: `${environment.baseUrlSystem}bankBase/selectBankBasePage`, //查询
  insertBankBase: `${environment.baseUrlSystem}bankBase/insertBankBase`, //插入
  updateBankBase: `${environment.baseUrlSystem}bankBase/updateBankBase`, //更新
  bankBaseDeleteList: `${environment.baseUrlSystem}bankBase/deleteList`, //删除
  selectifBankIcon: `${environment.baseUrlSystem}bankBase/selectifBankIcon`, //查询
  selectifBankBase: `${environment.baseUrlSystem}bankBase/selectifBankBase`, //查询

  // 用户管理
  appUserImport: `${environment.baseUrlSystem}user/appUserImport`,//app司机导入

//  驾驶员管理导入
  importDriver: `${environment.baseUrlSystem}user/importDriver`,

  getOrdersExport: `${environment.baseUrlSettle}order/getOrdersSettleInfoExport`,//合同跟踪导出

  getDriverByFleet: `${environment.baseUrlSystem}userBusiSegment/selectUserId`,
  getDefaultAddress: `${environment.baseUrlSystem}commonAddress/getCommonAddressThree`,
  selectConsigneeCompanyId: `${environment.baseUrl}commonAddress/getCommonAddressTwo`,//常用收货单位
  selectDriverData: `${environment.baseUrl}user/getDriverAndVehicle`,//查询司机信息

 //结算单
  getWaybillFeeList: `${environment.baseUrlSettle}settle/getWaybillFeeList`,//结算单查询
  updateWaybillFee: `${environment.baseUrlSettle}settle/updateWaybillFee`,//结算单查询
  feeByImport: `${environment.baseUrlSettle}settle/updateWaybillFeeByImport`,//结算单导入
  statementsExport: `${environment.baseUrlSettle}settle/statementsExport`,//结算单导出
  generateReports: `${environment.baseUrlSettle}settleV2/generateReports`,//价格匹配
  paymentRequest: `${environment.baseUrlSettle}settle/paymentRequest`,//付款申请
  updateIsEffect: `${environment.baseUrlSettle}settleV2/updateIsEffect`,//结算单生效


//  公司静态数据
  insertExcludeWeightMachine: `${environment.baseUrlSystem}staticCompany/insertExcludeWeightMachine`, //排除地磅
  getBusinessModuleId: `${environment.baseUrlSystem}userBusiSegment/getSameSegmentId`,


//业务板块配置
  getBusiSegmentConfigById: `${environment.baseUrlSystem}busiSegmentCon/getBusiSegmentConfigById`,    //查询接口
  insertBusiSegmentConfig: `${environment.baseUrlSystem}busiSegmentCon/insertBusiSegmentConfig`,      //新增接口
  updateBusiSegmentConfig: `${environment.baseUrlSystem}busiSegmentCon/updateBusiSegmentConfig`,      //修改接口
  deleteBusiSegmentConfig: `${environment.baseUrlSystem}busiSegmentCon/deleteBusiSegmentConfig`,      //删除接口
  insertBusiSegmentConfigByone: `${environment.baseUrlSystem}busiSegmentCon/insertBusiSegmentConfigByone`,// 角色配置设置
  //getBusiSegment: `${environment.baseUrl}busiSegment/getBusiSegment`,// 业务板块设置数据2

  selectOrderhd: `${environment.baseUrlInter}orderhd/selectOrderhd`,//销售结算单查询
  addOrderDataByTime: `${environment.baseUrlInter}Repertory/addOrderDataByTime`,//销售结算单查询

  //车队结算账户
  transGroupMapUpdate: `${environment.baseUrlSystem}transGroupMap/update`,//车队结算账户修改
  transGroupMapInsert: `${environment.baseUrlSystem}transGroupMap/insert`,//车队结算账户新增
  transGroupMapDelete: `${environment.baseUrlSystem}transGroupMap/delete`,//车队结算账户删除
  transGroupMapgetRecord: `${environment.baseUrlSystem}transGroupMap/getRecord`,//车队结算账户查询

  getStyleValue: `${environment.baseUrlSystem}busiSegmentCon/getBusiConfig`,//查询风格代码
  getPriceByLocationId: `${environment.baseUrlSystem}transOutprice/getBySegmentId`,
  getShouldPayPrice: `${environment.baseUrlSystem}transInprice/getTransInpriceByPCA`,   // 查应收金额

  //  w117车辆管理
  updateSubmit: `${environment.baseUrlSystem}vehicle/updateSubmit`,//提交审核
  updateAuth: `${environment.baseUrlSystem}vehicle/updateAuth`,//审核
  getVehicle: `${environment.baseUrlSystem}vehicle/getVehicle`, // 查询
  deleteTvehicle: `${environment.baseUrlSystem}vehicle/deleteTvehicle`, //删除
  updateBack: `${environment.baseUrlSystem}vehicle/updateBack`, //驳回

  // 承运商管理
  selectCompanyListV1: `${environment.baseUrl}company/selectCompanyListV1`, // 查询
  deleteListV1: `${environment.baseUrl}company/deleteListV1`,//删除
  submitUpdate: `${environment.baseUrl}company/submitUpdate`,//提交审核
  authUpdate: `${environment.baseUrl}company/authUpdate`,//审核
  backUpdate: `${environment.baseUrl}company/backUpdate`,//驳回
  endUpdate: `${environment.baseUrl}company/endUpdate`,//终止
  updateCompany:`${environment.baseUrl}company/updateCompany`,// 修改
  addCompany: `${environment.baseUrl}company/addCompany`,// 新增

  // 客户基本信息
  companydeleteList: `${environment.baseUrl}company/deleteList`, // 删除
  selectCompanyList:`${environment.baseUrl}company/selectCompanyList`, //查询
  companyExportExcel:`${environment.baseUrl}company/exportExcel`, // 导出

  // 客户结算账户
  companyBankExportExcel:`${environment.baseUrl}companyBank/exportExcel`, // 导出

  // 审核配置
  getUsers: `${environment.baseUrlSystem}approval/getUsers`,// 查询审核人
  getApproConfigList: `${environment.baseUrlSystem}approval/getApproConfigList`,// 主查询
  getApproConfigDetail: `${environment.baseUrlSystem}approval/getApproConfigDetail`,// 修改查询
  insertApprovalConfig: `${environment.baseUrlSystem}approval/insertApprovalConfig`,//新增
  updateApproConfig: `${environment.baseUrlSystem}approval/updateApproConfig`,//修改
  deleteApproConfig: `${environment.baseUrlSystem}approval/deleteApproConfig`,//删除

//  审批付款
  getApprovalRecordList: `${environment.baseUrlSystem}approval/getApprovalRecordList`,//查询
  updateApprovalPass: `${environment.baseUrlSystem}approval/updateApprovalPass`,//审批通过
  updateApprovalReject: `${environment.baseUrlSystem}approval/updateApprovalReject`,//审批驳回
  getApprovalRecordDetail: `${environment.baseUrlSystem}approval/getApprovalRecordDetail`,//查看详情

  selectCount: `${environment.baseUrlSystem}logLogin/selectCount`,//登陆用户统计查询
  getUserforStatistics: `${environment.baseUrlSystem}user/getUserforStatistics`,//注册用户统计查询

  // 返单设置
  getStaticByValueSetCodeGroupByValue: `${environment.baseUrl}static/getStaticByValueSetCodeGroupByValue`,//查询
  updateGroupByValue: `${environment.baseUrl}static/updateGroupByValue`,//保存

  // 日钢大屏
  selectRgProd: `${environment.baseUrlInter}rgPriceTendency/selectRgProd`,//品种查询
  selectAll: `${environment.baseUrlInter}rgPriceTendency/selectAll`,//主表查询
  selectAllByCity: `${environment.baseUrlInter}rgPriceTendency/selectAllByCity`,//数据弹窗查询
  insertPriceList: `${environment.baseUrlInter}rgPriceTendency/insertPriceList`,//数据弹窗插入
  selectRgPriceDisplay: `${environment.baseUrlInter}rgPriceTendency/selectRgPriceDisplay`,//显示弹窗查询
  insertRgPriceDisplay: `${environment.baseUrlInter}rgPriceTendency/insertRgPriceDisplay`,//显示弹窗插入

  // 地点路程维护
  getPagePointDistance:`${environment.baseUrlSystem}point/getPagePointDistance`,//查询数据
  insertPointDistance:`${environment.baseUrlSystem}point/insertPointDistance`,//插入数据
  updatePointDistance:`${environment.baseUrlSystem}point/updatePointDistance`,//更新数据
  deletePointDistance:`${environment.baseUrlSystem}point/deletePointDistance`,//删除数据

  //注册审核
  selectUserData:`${environment.baseUrlSystem}checkInfo/selectAll`,//查询数据
  viewUserData:`${environment.baseUrlSystem}checkInfo/selectInfo`,//查看或审核用户时查询接口
  auditPass:`${environment.baseUrlSystem}checkInfo/checkInAccess`,//审核通过
  auditreject:`${environment.baseUrlSystem}checkInfo/checkInReject`,//审核驳回
  //黑名单
  checkBlackList:`${environment.baseUrlSystem}blacklist/isInBlackList`,//校验司机
  getBlackList:`${environment.baseUrlSystem}blacklist/getVehicleNo`,//获取黑名单

  selectAttationCarTeam: `${environment.baseUrl}staticCompany/selectAttationCarTeam`, // 当前公司的单车车队列表
  attentionCarTeam: `${environment.baseUrl}staticCompany/attentionCarTeam`, // 关注

  // W538-费用登记(新)
  getWaybillFeeRegister: `${environment.baseUrlSettle}settleV2/getWaybillFeeRegister`, // 查询
  getFeeType: `${environment.baseUrlSettle}settleV2/getFeeType`, // 费用类型查询
  settleV2AddFeeRegister: `${environment.baseUrlSettle}settleV2/addFeeRegister`, // 登记

};
