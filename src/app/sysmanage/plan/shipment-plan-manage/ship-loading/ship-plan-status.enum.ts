// 船舶状态
export enum ShipPlanStatus {
  Created = 'CPZT10', //已生成
  CreatedBale = 'CPZT20',  //已生成捆包
  PartStowage = 'CPZT30', //部分配载
  HasLoading = 'CPZT40', //已配载
  GendIssued = 'CPZT50', //已下发
  CreatedWaybill = 'CPZT60', //生成运单
  BackoutIssued = 'CPZT70', //撤销下发

}

// 船舶状态判断
export class ShipPlan {

  //可修改 删除 状态判断
  static ShipPlanReleaseableStatus(param: string): boolean {
    if (param) {
      return param === ShipPlanStatus.Created || param === ShipPlanStatus.CreatedBale || param === ShipPlanStatus.PartStowage || param === ShipPlanStatus.HasLoading || param === ShipPlanStatus.BackoutIssued;
    } else {
      return false;

    }
  }

  // 可清除配载信息判断
  static ShipPlanStowageClear(param: string): boolean {
    if (param) {
      return param === ShipPlanStatus.PartStowage || param === ShipPlanStatus.HasLoading || param === ShipPlanStatus.BackoutIssued;
    } else {
      return false;
    }
  }
}

// 捆包状态
export enum BundleStatus {

  NotLoading = 'KBZT10', //未配载
  PartStowage = 'KBZT20', //部分配载
  HasLoading = 'KBZT30', //已配载
  AssignedTeam = 'KBZT40', //已分配班组
  Spidered = 'KBZT50', //已采集
  Unload = 'KBZT60', //未装船
  Loaded = 'KBZT70', //已装船
}

// 捆包状态判断
export class Bundle {

  //可修改 删除 状态判断
  static BundleReleaseableStatus(param: string): boolean {
    if (param) {
      return param === BundleStatus.NotLoading || param === BundleStatus.PartStowage || param === BundleStatus.HasLoading;
    } else {
      return false;

    }
  }

}

// 报港状态
export enum ReportingStatus {
  NotPort = 'BGZT10',//未报港
  EndPort = 'BGZT20',//已报港
}
