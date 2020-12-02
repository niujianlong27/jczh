import { Component, OnInit } from '@angular/core';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CodesetService } from '../../common/codeset.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Utils } from '../../common/utils';
import { Page } from '../../common/page.model';

@Component({
  selector: 'app-order-dispatch',
  templateUrl: './order-dispatch.component.html',
  styleUrls: ['../../common/sea-common.css', './order-dispatch.component.css']
})
export class OrderDispatchComponent implements OnInit {
  page: Page = new Page();
  queryLoading: boolean = false;
  result: Array<any> = [];

  orderItem: Array<any> = [];
  queryItemLoading: boolean = false;

  waybill: Array<any> = [];
  queryWaybillLoading: boolean = false;

  modalIsVisible: boolean; //派单弹框是否显示
  saveLoading: boolean;

  bizScope: Array<any> = [];  //  业务范围
  inqu: any = { createDateStart: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) }; // 追加查询条件

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private codeset: CodesetService,
    private appInfo: UserinfoService, ) { }

  ngOnInit() {
    this.codeset.reFetchSeaUserInfo().then(() => {
      this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
      if (this.bizScope && this.bizScope.length > 0) {
        this.inqu.transType = this.bizScope[0].value;
        this.query();
      }else {
        this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
      }
    });
  }


  /**
   * 分页查询
   * @param data 
   */
  query(): void {
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.queryLoading = true;
    this.http.post(SEA_URLS.getOrder, { ...this.inqu, ...this.page.getPagingObj() }).then(
      (res: any) => {
        if (res.success) {
          this.result = res.data.data.data || [];
          this.page.total = res.data.data.total || 0;
        }
        this.queryLoading = false;
      }
    );
  }

  /**
   * 根据订单查询关联运单
   * @param data 
   */
  queryWaybill(data: any): void {
    if(data.expand){
      this.waybill = [];
      data.expand = false;
      return;
    }
    this.queryWaybillLoading = true;
    this.http.post(SEA_URLS.getWaybillAll, { orderNo: data.orderNo }).then(
      (res: any) => {
        if (res.success) {
          this.waybill = res.data.data;
          if (!this.waybill || this.waybill.length == 0) {
            this.msg.warning("该订单无关联运单");
            data.expand = false;
          } else {
            data.expand = true;
          }
        }
        this.queryWaybillLoading = false;
      }
    );
  }


  /**
   * 查询订单关联订单明细信息
   * @param data 
   */
  getOrderItem(data: any) {
    this.queryItemLoading = true;
    this.http.post(SEA_URLS.getOrderItem, { orderNo: data.orderNo }).then(
      (res: any) => {
        if (res.success) {
          this.orderItem = res.data.data || [];
          this.orderItem.forEach(item => {
            item.goodsWeight = 0;
            item.goodsNo = 0;
          });
          this.checkAll(true);
        }
        this.queryItemLoading = false;
      }
    );
  }


  order: any;
  /**
   * 派单
   * @param data 
   */
  insert(data: any): void{
    this.modalIsVisible = true;
    this.getOrderItem(data);
    this.order = data;
  }


  /**
   * 保存
   */
  save(): void{
    const waybillItem = this.orderItem.filter(item => item.checked);

    const waybill = {...this.order};
    waybill.sourceType = '10';
    waybill.sourceNo = this.order.orderNo;
    waybill.totWeight = Utils.sumByKey(waybillItem, 'goodsWeight');
    waybill.totSheet = Utils.sumByKey(waybillItem, 'goodsNo');
    waybill.productName = Utils.distinct(waybillItem.map(item => item.productName)).join(',');
    waybill.actTotWeight = 0;
    waybill.actTotSheet = 0;

    this.saveLoading = true;
    this.http.post(SEA_URLS.insertWaybill, {...waybill, waybillItemModels: waybillItem}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success("派单成功");
          this.modalIsVisible = false;
        }
        this.saveLoading = false;
      }
    );

  }


  /**
  * 修改每页显示数量
  * @param pageSize 
  */
  pageSizeChange(pageSize: any) {
    this.page.pageSize = pageSize;
    this.query();
  }

  /**
   * 修改页码
   * @param pageIndex 
   */
  pageIndexChange(pageIndex: any) {
    this.page.pageIndex = pageIndex;
    this.query();
  }

  allChecked: boolean = false;
  indeterminate: boolean = false;

  refreshStatus(orderItem?: any): void {
    const allChecked = this.orderItem.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.orderItem.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    if(orderItem){
      orderItem.goodsWeight = orderItem.checked ? orderItem.diffGoodsWeight : 0;
      orderItem.goodsNo = orderItem.checked ? orderItem.diffGoodsNo : 0;
    }
  }

  checkAll(value: boolean): void {
    this.orderItem.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
    
    this.orderItem.forEach(item => {
      item.goodsWeight = value ? item.diffGoodsWeight : 0;
      item.goodsNo = value ? item.diffGoodsNo : 0;
    })
  }

}
