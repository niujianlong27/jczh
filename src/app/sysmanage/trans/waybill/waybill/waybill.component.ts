import { Component, OnInit, ViewChild } from '@angular/core';
import { TRANS_URLS } from '../../../../common/model/trans-urls';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { GridBlockComponent } from '../../../../components/simple-page/grid-block/public-api';
import { InquBlockComponent } from '../../../../components/simple-page/inqu-block/public-api';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waybill',
  templateUrl: './waybill.component.html',
  styleUrls: ['./waybill.component.css']
})
export class WaybillComponent implements OnInit {

  @ViewChild(InquBlockComponent) inquBlock: InquBlockComponent;

  @ViewChild('grid_waybill') waybillGrid: GridBlockComponent;
  waybillData: Array<any> = [];
  total: number = 0;
  loading: boolean = false;

  packData: Array<any> = [];
  driverData: Array<any> = [];

  constructor(private http: HttpUtilService,
    public router: Router,
    private msg: NzMessageService,) { }

  ngOnInit() {
  }

  /**
   * 运单分页查询
   */
  query() {
    this.loading = true;
    const param = { queryParameterList: this.inquBlock.getSelectedCondition(), ...this.waybillGrid.getQueryPaginationObj() };
    this.http.post(TRANS_URLS.SELECT_WAYBILL, param).then(
      (res: any) => {
        if (res.success) {
          this.waybillData = res.data.data.data;
          this.total = res.data.data.total;
        }
        this.loading = false;
      }
    );
  }

  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(waybillNo: string) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, { waybillNo: waybillNo }).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据运单查询运单司机信息
   */
  queryDriver(waybillNo: string) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, { waybillNo: waybillNo }).then(
      (res: any) => {
        if (res.success) {
          this.driverData = res.data.data;
        }
      }
    );
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param buttonId 
   */
  buttonClick(buttonId: string){
    switch(buttonId){
      case "print": this.print(); break;
      case "update": this.update(); break;
      case "delete": this.delete(); break;
      default: this.msg.error("按钮未绑定方法");
    }
  }

  /**
   * 打印
   */
  print(){
    this.msg.warning("功能待开发");
  }

  /**
   * 修改
   */
  update(){
    const data = this.waybillGrid.getSelectedRowData();
    if(!data || data.length !== 1){
      this.msg.error("请选择一条运单记录！");
      return;
    }
    if(data[0].settleFlag === 'FYDJ20' || data[0].priceFlag === 'HJBJ20'){
      this.msg.error("运单已登记运费或已核价不能修改");
      return;
    }
    this.router.navigate(['/system/trans/waybill/waybill-add'], {queryParams: {'operateType': 'update', 'waybillNo': data[0].waybillNo}});
  }

  /**
   * 作废
   */
  delete(){
    const data = this.waybillGrid.getSelectedRowData();
    if(!data || data.length !== 1){
      this.msg.error("请选择一条运单记录！");
    }
    if(data[0].settleFlag === 'FYDJ20' || data[0].priceFlag === 'HJBJ20'){
      this.msg.error("运单已登记运费或已核价不能作废");
      return;
    }

    this.http.post(TRANS_URLS.DELETE_WAYBILL, {tWaybills: data}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success("作废成功！")
          this.query();
          // this.driverData = res.data.data;
        }
      }
    );

  }

  /**
   * 行点击事件
   * @param res 
   */
  rowClick(res: any){
    this.waybillGrid.setRowChecked(res.index, !res.item.checked);
    if(res.item.checked){
      this.queryPack(res.item.waybillNo);
      this.queryDriver(res.item.waybillNo);
    }
    
  }

  /**
   * checkbox 点击事件
   * @param res 
   */
  checkboxClick(res: any){
    if(res.item.checked){
      this.queryPack(res.item.waybillNo);
      this.queryDriver(res.item.waybillNo);
    }
  }

}
