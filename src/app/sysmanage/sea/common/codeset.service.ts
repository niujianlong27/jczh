import { Injectable } from '@angular/core';
import { SeaUserInfoService } from './sea-user-info.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
@Injectable({
  providedIn: 'root'
})
export class CodesetService {

  public codeset = { };
  private specialBizeScopeProcessFlag = false;
  constructor(private seaUserInfoServ: SeaUserInfoService, 
    private appInfo: UserinfoService){

  }

  public set(key: string, value: any) {
    this.codeset[key] = value;
  }

  public get(key: string): Array<any> {
    return this.codeset[key] ? this.codeset[key] : CODESET_MAP[key];
  }

  public getItems(key: string, values: string | Array<string>) {
    if (!values) {
      return [];
    }

    const arr = [];
    if (values && typeof values === 'string') {
      arr.push(...values.split(","));
    } else if (values && Array.isArray(values)) {
      arr.push(...values);
    }
    return this.get(key).filter(item => arr.some(v => v == item.value));
  }

  // 特殊处理海运bizeScope
  public reFetchSeaUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const bizScope = this.appInfo.APPINFO.USER.requestUserSegmentId || this.appInfo.APPINFO.USER.seaUserBizScope;
      if (bizScope) {
        resolve(bizScope);
      } else {
        // this.seaUserInfoServ.setSeaUserInfo().then(() => resolve(this.appInfo.APPINFO.USER.seaUserBizScope));
      }
    });
  }
}

const CODESET_MAP = {
  status: [ {value: "10", label: "启用"}, {value: "20", label: "停用"} ],

  statusValid: [ {value: "10", label: "有效"}, {value: "20", label: "无效"} ],

  statusHarbor: [{value:"国内",label:"国内"},{value:"国际",label:"国际"}],
  
  statusHarborselect: [{value:"国内",label:"国内"},{value:"国际",label:"国际"},{value:"",label:"不做选择"}],

  statusBlacklist: [ {value: "10", label: "正常"}, {value: "20", label: "黑名单"} ],

  bizScope: [ {value: "10", label: "外贸"}, {value: "20", label: "内贸"}, {value: "30", label: "内河"} ],

  companyType: [ {value: "10", label: "平台"}, {value: "20", label: "货主"}, {value: "30", label: "承运商"} ],

  pretenderStatus: [{ value: "ZTZT10", label: "未开始" }, { value: "ZTZT20", label: "待投标" }, { value: "ZTZT30", label: "投标中" },
  { value: "ZTZT40", label: "结束" }, { value: "ZTZT50", label: "撤回" }, { value: "ZTZT60", label: "已评标" },
  { value: "YTZT70", label: "未中标" }, { value: "YTZT80", label: "已中标" }],

  pretenderStatus2: [{ value: "ZTZT10", label: "未开始" }, { value: "ZTZT20", label: "展示中" }, { value: "ZTZT30", label: "展示中" },
  { value: "ZTZT40", label: "结束" }],

  pretenderStatusFlag: [{value: "11", label: "未开始"}, {value: "12", label: "待投标"}, {value: "13", label: "已投标"}, 
    {value: "21", label: "未参与"}, {value: "22", label: "待确认"},  {value: "23", label: "未中标"}, {value: "24", label: "已中标"},],

  settleType: [ {value: "JSFS10", label: "含税"}, {value: "JSFS20", label: "不含税"} ],

  calculation: [ {value: "JJJS10", label: "元/MT"}, {value: "JJJS20", label: "美元/MT"}, {value: "JJJS30", label: "元/箱"}, {value: "JJJS40", label: "美元/箱"} ],


  shipSociety: [ {value: "无限制", label: "无限制"}, {value: "ABS", label: "ABS"}, {value: "BV", label: "BV"}, {value: "DNV", label: "DNV"}, 
    {value: "GL", label: "GL"}, {value: "KR", label: "KR"}, {value: "CCS", label: "CCS"}, {value: "LR", label: "LR"}, 
    {value: "NK", label: "NK"}, {value: "RS", label: "RS"}, {value: "RINA", label: "RINA"}, {value: "IACS", label: "IACS"} ],

  shipmentTerm: [ {value: "无限制", label: "无限制"}, {value: "FILO", label: "FILO"}, {value: "FIO", label: "FIO"}, {value: "FLT", label: "FLT"}, {value: "LIFO", label: "LIFO"} ],

  settleNode: [ {value: "卸空前", label: "卸空前"}, {value: "卸空后", label: "卸空后"} ],

  demurrageFeeType: [ {value: "元/天", label: "元/天"}, {value: "元/天/吨", label: "元/天/吨"} ],

  demurrageFeePoing: [ {value: "起始位置:码头", label: "起始位置:码头"}, {value: "起始位置:锚地", label: "起始位置:锚地"} ],

  tenderStatus: [{value: "JJZZ10", label: "未开始"}, {value: "JJZZ20", label: "竞价中"}, {value: "JJZZ30", label: "已出价"}, 
    {value: "JJZZ40", label: "待确认"}, {value: "JJZZ50", label: "竞价成功"}, {value: "JJZZ60", label: "竞价失败"} ],

  tenderStatusFlag: [{value: "11", label: "未开始"}, {value: "12", label: "待出价"}, {value: "13", label: "已出价"}, 
    {value: "21", label: "未参与"}, {value: "22", label: "待确认"}, {value: "23", label: "竞价成功"}, {value: "24", label: "竞价失败"}],

  sourceType: [ {value: "10", label: "定向单"}, {value: "20", label: "竞价单"} ],

}
