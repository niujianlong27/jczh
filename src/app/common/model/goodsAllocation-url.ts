import { environment } from "../../../environments/environment";

let goodsAllocationUrl='http://180.167.249.246:8084/api/goods-allocation/'  ; //邵鲁玉本地
if (environment.production) {
  goodsAllocationUrl = environment.baseUrlGoodsAllocation; // 测试
}


export const Goods_Allocation_Url = {

  //销售开单
  getSaleMan: `${goodsAllocationUrl}salesman/getList`,//获取业务员
  getCustomerId:`${goodsAllocationUrl}warehouse/getNameAndId`,//获取购货单位
  directOrder:`${goodsAllocationUrl}tgaDelivery/billImmediately`,//直接开单
  recommendOrder:`${goodsAllocationUrl}tgaDelivery/billRecommend`,//推荐开单
  spellOrder:`${goodsAllocationUrl}tgaDelivery/billMerge`,//拼单
  saveOrder:`${goodsAllocationUrl}tgaDelivery/saveSheet`,//保存


//  销售管理
  selectSheet: `${goodsAllocationUrl}tgaDelivery/getAllTGADeliverySheets`, // 查询主表
  selectItem: `${goodsAllocationUrl}tgaDelivery/getAllTGADeliveryItems`,   // 查询子表
  deleteSheet: `${goodsAllocationUrl}tgaDelivery/deleteSheets`,  // 删除主表
  deleteItem: `${goodsAllocationUrl}tgaDelivery/deleteItem`, // 删除子表
  billReverse: `${goodsAllocationUrl}deliverySheet/billReserve`, // 车次预留
  updateItem: `${goodsAllocationUrl}tgaDelivery/deleteItemV2`, // 修改明细
  shareBillSearch: `${goodsAllocationUrl}tgaDelivery/billMerge`, // 拼单查询
  billAppera: `${goodsAllocationUrl}tgaDelivery/orderGenerate`, // 开单生成
  getCust: `${goodsAllocationUrl}customer/getList`, // 获取购买单位
  getDept: `${goodsAllocationUrl}salesorg/getList`, // 获取部门
  printCount: `${goodsAllocationUrl}tgaDelivery/printCountAdd`, // 打印次数
  updateRemark: `${goodsAllocationUrl}tgaDelivery/billUpdateRemark`,

//  库存查询
  getProduction: `${environment.baseUrlStorage}manufactureRecord/getList`, // 生产记录查询
  okProduction:`${goodsAllocationUrl}manufactureRecord/updateStatus`,
}
