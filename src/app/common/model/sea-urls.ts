import { environment } from "../../../environments/environment";

export const SEA_URLS = {
  /** --------------------基础信息--------------------- */

  /** 海运公司启用 */
  getSystemCompanyList: `${environment.baseUrlSystem}company/selectCompanyList`,// 调用系统模块查询客户公司列表
  getSeaCompany: `${environment.baseUrlSea}companySea/getList`,// 分页查询海运业务公司列表
  getSeaCompanyAll: `${environment.baseUrlSea}companySea/getAll`,// 查询海运业务公司列表
  insertListCompany: `${environment.baseUrlSea}companySea/insertList`,// 批量新增海运业务公司列表
  updateSeaCompany: `${environment.baseUrlSea}companySea/update`,// 修改海运业务公司列表

  /** 货主承运商关联关系 */
  getCarrier: `${environment.baseUrlSea}concernedCarrier/getNotInConcernedList`,// 获取不在指定货主关注列表中的承运商
  getOwnerCarrier: `${environment.baseUrlSea}concernedCarrier/getList`,// 分页查询海运业务公司列表
  getOwnerCarrierAll: `${environment.baseUrlSea}concernedCarrier/getAll`,// 查询全部海运业务公司列表
  getBidCarrier: `${environment.baseUrlSea}concernedCarrier/getBidCarrier`,// 查询参与竞价的承运商（用于transfer控件）
  insertListCarrier: `${environment.baseUrlSea}concernedCarrier/insertList`,// 批量插入承运商
  updateCarrier: `${environment.baseUrlSea}concernedCarrier/update`,// 修改承运商
  deleteCarrier: `${environment.baseUrlSea}concernedCarrier/delete`,// 删除承运商

  /** 人员业务范围设置 */
  getSystemUserList: `${environment.baseUrlSystem}user/selectUserList`,// 调用系统模块查询公司人员列表
  getUser: `${environment.baseUrlSea}userBizScope/getList`,// 人员业务范围设置
  insertListUser: `${environment.baseUrlSea}userBizScope/insertList`,// 批量插入海运业务人员
  updateUser: `${environment.baseUrlSea}userBizScope/update`,// 修改人员信息
  deleteUser: `${environment.baseUrlSea}userBizScope/delete`,// 删除人员信息
  getUserBizScope: `${environment.baseUrlSea}userBizScope/getUserBizScope`,// 获取海运人员信息

  /** 港口码头 t_basic_harbor */
  getBasicHarborList: `${environment.baseUrlSea}harbor/getList`,// 分页查询
  getBasicHarborAll: `${environment.baseUrlSea}harbor/getAll`,// 根据条件查询全部
  insertHarbor: `${environment.baseUrlSea}harbor/insertHarbor`,// 插入一条新数据
  deleteHarbor: `${environment.baseUrlSea}harbor/updateStatus`,// 修改状态
  updateHarbor: `${environment.baseUrlSea}harbor/updateHarbor`,// 修改基本信息

  /** 根据港口获取码头 */
  getPierAll: `${environment.baseUrlSea}harborPier/getAll`,// 根据条件查询全部

  /** 资源信息 */
  getSetting: `${environment.baseUrlSea}setting/getPage`,//分页查询资源信息
  insertSetting:  `${environment.baseUrlSea}setting/insert`,// 新增资源信息
  updateSetting:  `${environment.baseUrlSea}setting/update`,// 修改资源信息
  deleteSetting:  `${environment.baseUrlSea}setting/delete`,// 删除资源信息
  getUserSetting: `${environment.baseUrlSea}setting/getUserSetting`,//获取用户设置信息
  saveUserSetting: `${environment.baseUrlSea}setting/saveUserSetting`,//保存用户设置信息

  getPolicy: `${environment.baseUrlSea}upload/getPolicy`, // OSS直传获取policy

  /** 货盘 */
  getPlate: `${environment.baseUrlSystem}plateCompany/getPlateByCompany`,//平台公司查询
  insertPallet:  `${environment.baseUrlSea}pallet/insertV2`,// 货盘新增
  updatePallet:  `${environment.baseUrlSea}pallet/updateV2`,// 货盘修改
  getPallets:  `${environment.baseUrlSea}pallet/getPalletV2`,// 货盘修改
  getPallet: `${environment.baseUrlSea}pallet/getPageV2`,// 货盘分页查询
  getPalletByTender: `${environment.baseUrlSea}pallet/getPalletByTenderV2`,// 根据招标单号/竞价单号查询竞价单关联货盘明细信息
  deletePallet: `${environment.baseUrlSea}pallet/deleteListV2`, //批量删除货盘信息
  directOrder: `${environment.baseUrlSea}pallet/directOrder`, //定向下单
  getUsedHarbor: `${environment.baseUrlSea}pallet/getUsedHarbor`, // 获取委托单位最近使用港口信息
  
  /** 货盘明细 */
  getPalletItemByTender: `${environment.baseUrlSea}palletItem/getPalletItemByTenderV2`,// 根据招标单号/竞价单号查询竞价单关联货盘明细信息

  /** 预招标 */
  insertPretender: `${environment.baseUrlSea}pretender/insertListV2`,// 新增预招标单
  getPretender: `${environment.baseUrlSea}pretender/getPageV2`,// 分页查询预招标单信息(货主、平台)
  getCarrierPretender: `${environment.baseUrlSea}pretender/getPageAppV2`,// 分页查询预招标单信息(承运商))
  deletePretender: `${environment.baseUrlSea}pretender/deleteListV2`,// 删除预招标单

  /** 预招标出价 */
  getPrebid: `${environment.baseUrlSea}prebid/getAllV2`,// 查询满足条件的出价记录
  prebid: `${environment.baseUrlSea}prebid/prebidV2`,// 预招标出价
  prebidWinning: `${environment.baseUrlSea}prebid/prebidWinningV2`,// 预招标评标
  

  /** 预招标出价历史 */
  getPrebidrecord: `${environment.baseUrlSea}prebidrecord/getAllV2`,// 查询满足条件的出价历史记录
  
  /** 竞价 */
  insertTender: `${environment.baseUrlSea}ordertender/insertListV2`,// 新增竞价单
  getTender: `${environment.baseUrlSea}ordertender/getPageV2`,// 分页查询竞价单信息(货主，平台)
  deleteTender: `${environment.baseUrlSea}ordertender/deleteListV2`,// 删除竞价单
  getCarrierTender: `${environment.baseUrlSea}ordertender/getPageAppV2`,// 分页查询竞价单信息(承运商)

  /** 竞价出价 */
  getBid: `${environment.baseUrlSea}orderbid/getAllV2`,// 查询满足条件的出价记录
  getCompanyBid: `${environment.baseUrlSea}orderbid/getCompanyBidV2`,// 获取公司最新出价信息（含最低阶）
  getMinPrice: `${environment.baseUrlSea}orderbid/getTenderMinPriceV2`,// 获取最低价
  bid: `${environment.baseUrlSea}orderbid/bidV2`,// 出价
  getDelayBidder: `${environment.baseUrlSea}orderbid/getDelayBidListV2`,// 根据竞价单获取暗标竞价公司列表
  isTwoBidder: `${environment.baseUrlSea}orderbid/isBidTwoV2`,// 是否有第二阶段出价资格
  isDelayBidder: `${environment.baseUrlSea}orderbid/isBidDelayV2`,// 是否有暗标出价资格
  bidWinning: `${environment.baseUrlSea}orderbid/bidWinningV2`,// 竞价评选
  
  /** 竞价出价历史 */
  getBidrecord: `${environment.baseUrlSea}orderbidrecord/getAllV2`,// 查询满足条件的出价历史记录


  /** 订单 */
  getOrder: `${environment.baseUrlSea}order/getPageV2`,// 分页查询订单信息
  updateOrder: `${environment.baseUrlSea}order/updateV2`,// 修改订单信息
  deleteOrder: `${environment.baseUrlSea}order/deleteListV2`,// 分页查询订单信息

  /** 订单明细 */
  getOrderItem: `${environment.baseUrlSea}orderItem/getOrderItem`,// 查询订单明细

  /** 运单 */
  getWaybill: `${environment.baseUrlSea}waybill/getPage`,// 分页查询运单信息
  getWaybillAll: `${environment.baseUrlSea}waybill/getAll`,// 分页查询运单信息
  insertWaybill: `${environment.baseUrlSea}waybill/insert`,// 新增运单信息
  updateWaybill: `${environment.baseUrlSea}waybill/update`,// 修改运单信息
  deleteWaybill: `${environment.baseUrlSea}waybill/deleteList`,// 分页查询运单信息

  /** 运单明细 */
  getWaybillItem: `${environment.baseUrlSea}waybillItem/getWaybillItem`,// 查询运单明细

  /** 承运商 */
  CARRIER_SELECTONE: `${environment.baseUrlSea}carrier/getOne`,
  CARRIER_QUERY: `${environment.baseUrlSea}carrier/getCarrierList`,
  CARRIER_INSERT: `${environment.baseUrlSea}carrier/insert`,
  CARRIER_DETAIL: `${environment.baseUrlSea}carrier/iran`,
  CARRIER_UPDATE: `${environment.baseUrlSea}carrier/update`,
  CARRIER_SUBMIT: `${environment.baseUrlSea}carrier/submit`,
  CARRIER_REJECTED: `${environment.baseUrlSea}carrier/rejected`,
  CARRIER_AUDIT: `${environment.baseUrlSea}carrier/audit`,
  CARRIER_DELETE: `${environment.baseUrlSea}carrier/delete`,
  CARRIER_RESTART: `${environment.baseUrlSea}carrier/restart`,

  /** 船只*/
  SHIP_QUERY: `${environment.baseUrlSea}ship/getShipList`,
  SHIP_INSERT: `${ environment.baseUrlSea }ship/insert`,
  SHIP_DETAIL: `${environment.baseUrlSea}ship/getShipByShipId`,
  SHIP_UPDATE: `${environment.baseUrlSea}ship/update`,
  SHIP_DELETE: `${environment.baseUrlSea}ship/delete`,
  SHIP_SELECTONE: `${environment.baseUrlSea}ship/getShipOne`,
};



