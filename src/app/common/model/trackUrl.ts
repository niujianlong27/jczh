import { environment } from '../../../environments/environment';
export const trackUrl = {
    selectPlanBySingleCar:`${environment.baseUrlTrack}plan/selectPlanBySingleCar`,//派车单列表查询接口
    selectBoatScheduleListByBoat:`${environment.baseUrlTrack}boatSchedule/selectBoatScheduleListByBoat`,//派船单列表查询接口
    selectBoatOrderListByBoat:`${environment.baseUrlTrack}boatOrder/selectBoatOrderListByBoat`,//派船单列表查询接口
    selectTransPlanBusinessOverview:`${environment.baseUrlTrack}transPlanDay/selectTransPlanBusinessOverview`,//列表查询接口
    selectWaybillPackTransInfo:`${environment.baseUrlTrack}waybillPack/selectWaybillPackTransInfo`,//捆包查询接口
    getPlanBySingleCarItemInfo:`${environment.baseUrlTrack}planItem/getPlanBySingleCarItemInfo`,//派车单详情接口
    selectOrderBusinessOverview:`${environment.baseUrlTrack}order/selectOrderBusinessOverview`,//订单详情接口
    selectBusinessSearchListByBoat:`${environment.baseUrlTrack}businessSearch/selectBusinessSearchListByBoat`,//业务查询接口
}
