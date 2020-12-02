import { environment } from "../../../environments/environment";


let allocateUrl = 'http://192.168.21.89:9206/'; // 本地

if (environment.production) {
  allocateUrl = environment.baseUrlAllocate; // 测试
}

export const ALLOCATE = {

  add_bicycle:`${allocateUrl}add_bicycle`,//单车分货新增
  get_bicycle_list:`${allocateUrl}get_bicycle_list`,//单车分货查询
  get_bicycle_detail:`${allocateUrl}get_bicycle_detail`,//装车清单查询

}
