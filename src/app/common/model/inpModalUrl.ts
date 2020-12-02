import {environment} from '@env/environment';

// 数据弹窗url地址
export const inpModalUrl = {
  default: `${environment.baseUrl}company/getCompanyByName`,//默认url
  stock: `${environment.baseUrlStock}stockLocationSet/selectStockLocationSet`, //储位
  point: `${environment.baseUrl}point/getPoint`, //地点
  boat: `${environment.baseUrlPort}boatSchedule/selectBoatSchedule`, //船批
  boat2: `${environment.baseUrlPort}boatWorkSchedule/selectBoatDisScheduleForWork`, //船批
  selectTBoat:`${environment.baseUrlPort}collectLockout/selectTBoatPlanModel`,//  停工采集船批查询
  companyUserBid: `${environment.baseUrl}plateCompany/getplateCompanyById`,//竞价人选择中选择公司
  getBusiSegment: `${environment.baseUrl}busiSegment/getBusiSegment`,//竞价人选择中选择公司
  getBankMsgByRecCompanyName: `${environment.baseUrl}companyBank/getBankMsgByRecCompanyName`,//银行选择
  transSettleCompany: `${environment.baseUrl}companySettle/getCompanySettle`,//运输合同->承运结算单位、吊装结算单位
  getRec: `${environment.baseUrl}companyBank/getRec`,//获取收款单位
  getFormIDAndName: `${environment.baseUrl}form/getFormIDAndName`,//界面ID
  getCompanyByRecOrPay: `${environment.baseUrl}company/getCompanyByRecOrPay`,//获取代收公司
  getRecCompany: `${environment.baseUrl}companySettle/getRecCompany`,//获取收款单位，加默认账户
  getPayCompany: `${environment.baseUrl}companyBank/getPayCompany`,//获取付款银行
  getCompanyBankThree:`${environment.baseUrl}companyBank/getCompanyBankThree`,//获取bank表数据
  getUserBusinessModuleIdV2: `${environment.baseUrlSystem}company/getCompanyBySettleTypeV2`,//获取收货单位
  getListByBoatName:`${environment.baseUrl}boat/getListByBoatName`,//获取船舶数据
  teamGetPage: `${environment.baseUrl}team/getPage`,//班组查询
  getVehicle: `${environment.baseUrl}vehicle/getVehicle`,// 车辆信息查询
  selectDriver: `${environment.baseUrl}user/selectDriver`,//司机信息查询
  selectStockAreaSet: `${environment.baseUrlStock}stockAreaSet/selectStockAreaSet`,//仓库库区查询
  boatGetList: `${environment.baseUrlPort}boatPlan/selectUnloadList`,//散货出入库卸船船批查询
  getForkliftList: `${environment.baseUrl}forklift/getForkliftList`,//叉车管理查询
  selectConsigneeCompanyId: `${environment.baseUrl}commonAddress/getCommonAddressTwo`,//常用收货单位
  selectCompany: `${environment.baseUrl}company/getCompanyBySettleType`,//  收货单位
  getAppRoleById: `${environment.baseUrlSystem}approle/getAppRoleById`,// 角色配置设置
  getMenuV2: `${environment.baseUrlSystem}menu/getMenuV2`,// 角色配置设置
  selectDriverData: `${environment.baseUrl}user/getDriverAndVehicleV2`,//查询司机信息
  selectCompanyList: `${environment.baseUrl}company/selectCompanyList`,//查询收货单位 [extraParam]="{settleType:'JSLX10'}"
  getmanCode:`${environment.baseUrlGoodsAllocation}customer/getCustomerBySalesmanId`,
  getitemid:`${environment.baseUrlGoodsAllocation}itema/getListByWarehouse`,
  getReverseData:`${environment.baseUrlGoodsAllocation}deliverySheet/getItemAndModel`,
  getCompanyId: `${environment.baseUrl}transGroupMap/getCompanyId`,
  getCompanySettle: `${environment.baseUrl}transGroupMap/getCompanySettle`,
  getAllUsers:  `${environment.baseUrl}blacklist/getAllUsers`,
  getUserListByNameNew: `${environment.baseUrl}user/getUserListByNameNew`,
  getAllDriver: `${environment.baseUrlSystem}user/getAllDriverByPhoneOrName`,

  selectBankName: `${environment.baseUrlSystem}bankBase/getBankByIndistinctName`,//查询银行信息

};
