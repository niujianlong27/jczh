import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '@service/common.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { WAREHOUSEURL } from '../../../../common/model/warehouseUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';


@Component({
  selector: 'app-synerr',
  templateUrl: './synerr.component.html',
  styleUrls: ['./synerr.component.css']
})
export class SynerrComponent implements OnInit {

  dataSet: any = []; // 结果集
  loading: any; // 页面查询加载
  pageSize: any = 30; // 页面显示数据条数
  totalPage: any; // 总页数
  updatedata: any = []; // 选中的数据

  tplModal: NzModalRef; // 操作成功后弹窗属性
  saveflag = true;
  private gateNameArr: any = [];   // 保存大门列表的数组
  private warehouseArr: any = [];   // 保存仓库名称的数组


  warehouseName: string;
  toGateName: any;

  toGateNameArr: any = [];

  warehouseArr1: any = [];


  @ViewChild('gate') gate: ElementRef;
  @ViewChild('warehouse') warehouse: ElementRef;
  private tempUpdateParam: any;
  matKindArr: any = [];


  tempSearchData: any = {};

  // 保存标记

  constructor(private fb: FormBuilder,
    private modal: NzModalService,
    private http: HttpUtilService,
    private info: UserinfoService,
    private nm: NzModalService,
    private nz: NzNotificationService,
    private cm: CommonService,
    private http1: HttpClient,
              ) {
  }

  ngOnInit() {

    this.listSearch(this.tempSearchData);
    // console.log(this.info);
    this.http.post(WAREHOUSEURL.GETALLCODESETS, { codesetCode: 'product_disp.gate' }).then(res => {
      // console.log(res);
      if (res.success) {
        res.data.data.forEach((item: { itemCname: string; itemCode: string; }) => {
          const data = { name: '', value: '' };
          data.name = item.itemCname;
          data.value = item.itemCode;
          this.gateNameArr.push(data);
        });
      }
    });
    this.http.post(WAREHOUSEURL.GETALLWAREHOUSE, {
      requestCompanyId: this.info.APPINFO.USER.requestCompanyId,
      requestCompanyName: this.info.APPINFO.USER.requestCompanyId,
      requestUserId: this.info.APPINFO.USER.requestUserId,
      requestCompanyType: this.info.APPINFO.USER.requestCompanyType,
      requestUserSegmentId: this.info.APPINFO.USER.requestUserSegmentId,
      page: 1
    }).then(res => {

      if (res.success) {
        console.log(res);
        res.data.data.forEach((item: { warehouseName: string; warehouseCode: string; }) => {
          const data1 = { name: '', value: '' };
          data1.name = item.warehouseName;
          data1.value = item.warehouseCode;
          this.warehouseArr.push(data1);
        });
        // console.log(this.warehouseArr[1] + '0000');
      }
    });
    // console.log(this.warehouseArr + '00000000');
    // console.log(this.warehouseArr+'--');

  }
  public staticData = (code: string) => new Observable((observe) => {
    this.getStatic(code, observe);
  })

  private getStatic(code: string, ob?: any) {
    let url = WAREHOUSEURL.GETALLCODESETS;
    let param: any = {codesetCode: code, status: 'product_disp.codeset_status_10'};
    let key = 'itemCname';
    let value = 'itemCode';
    if (code === 'getWarehouseName') {
      url = WAREHOUSEURL.GETALLWAREHOUSE;
      param = {};
      key = 'warehouseName';
      value = 'warehouseCode';
    } else if (code === 'product_disp.matkind') {
      url = WAREHOUSEURL.GETALLMAT;
      param = {};
      key = 'matKindName';
      value = 'matKindCode';
    }
    this.http1.post(url, param).subscribe((res: any) => {
        if (res.code === 100) {
          const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
          if (code === 'product_disp.gate') { // 状态
            this.toGateNameArr = [...data];
          }
          ob && ob.next(data);
        } else {
          ob && ob.error();
        }
      }
    );



  }



  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    // console.log('进入查询方法');


    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.tempSearchData = data;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.SEARCHTRANSPROG;
    this.loading = true;
    this.dataSet = [];
    // this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.map(x => (x.selectShow = false));
        // this.dataSet.map(x => {x.editstate = 0});
      }
    });


  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updatedata = data;
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.getList({ page: 1, length: this.pageSize });
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex(page: any): void {
    this.getList({ page: page, length: this.pageSize });
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */


  update(data: any, flag: number) {
    this.tempUpdateParam = { ...data };
    if (flag === 1) {
      // data.editstate = 1;
      data.selectShow = true;
      data.saveflag = true;
    } else {
      data.saveflag = false;
      data.toGateName = this.tempUpdateParam.toGateName;
      data.toGate = this.tempUpdateParam.toGate;
      data.warehouseName = this.tempUpdateParam.warehouseName;
      data.warehouseCode = this.tempUpdateParam.warehouseCode;
      data.saveflag = false;
  }
  }




  colName(data: any) {
    const gate = data.filter(x => x.colEname === 'toGateName');
    const warehouse = data.filter(x => x.colEname === 'warehouseName');
    gate[0].tdTemplate = this.gate;
    warehouse[0].tdTemplate = this.warehouse;
  }

  public btnData(data: any[]) {
    this.saveflag = data.some(x => x.buttonId === 'Update');
  }

  save(data: any) {
    const param = {...data};
    this.http1.post(WAREHOUSEURL.UPDATETRANSPROG, {...param}).subscribe(
      (res: any) => {
        data.btnloading = false;
        if (res.code === 100) {
          this.modal.success({
            nzTitle: '提示信息',
            nzContent: res.msg
          });
          data.selectShow = false;
          data.saveflag = false;
  }
});
  }
}
