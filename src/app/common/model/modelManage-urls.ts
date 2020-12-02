import { environment } from "../../../environments/environment";


let modelManageUrl = 'http://localhost:9230/'; // 本地

if (environment.production) {
  modelManageUrl = environment.baseUrlModelManage; // 测试
}





export const MODEL_MANAGE = {


//Python后端接口
  getModelList: `${modelManageUrl}modelManage`,   //获取模型列表
  getModelItemList: `${modelManageUrl}modelItemManage`,  //获取子服务列表
  getModelParamList:`${modelManageUrl}modelParamManage`, //获取模型参数列表
  addModelParam:`${modelManageUrl}addModelParam`,//新增/修改参数
  deleteParam:`${modelManageUrl}delModelParam` ,//删除参数
  addModel:`${modelManageUrl}addModel`,//新增/修改模型
  deleteModel:`${modelManageUrl}delModel` ,//删除模型
  updateStockParam:`${modelManageUrl}adjustNoticeStockDate` ,//修改库存监控模型参数

}
