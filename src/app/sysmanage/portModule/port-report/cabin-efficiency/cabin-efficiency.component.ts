import { Component, OnInit } from '@angular/core';
import {portUrl} from "../../../../common/model/portUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-cabin-efficiency',
  templateUrl: './cabin-efficiency.component.html',
  styleUrls: ['./cabin-efficiency.component.css']
})
export class CabinEfficiencyComponent implements OnInit {
  gridOneHeight: string;
  gridTwoHeight: string;
  tplModal: NzModalRef;
  listLoading: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  listLoading2: boolean = false;
  dataSet2: any = [];
  updateData2: any = [];//选中的数据
  totalPages2: number = 0;
  pageSize2: number = 30;
  selectedList: any = [];
  temGetListData:any;//查询条件缓存

  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private appInfo: UserinfoService,
              private ngHttp: HttpClient,) {
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.temGetListData = data;
    this.getList1(data);
  }

  getList1(data: any): void {
    let url = portUrl.selectCabinEfficiency;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data&& res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
      }
    })
  }

  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Export':
        this.export();
        break;
      default:
        break;
    }
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
    this.dataSet2 = [];
    this.updateData.length > 0 && this.getList2({ page: 1, length: this.pageSize2 });
  }


  getList2(data): void {
    let arr= [];
    this.updateData.forEach(item => {
      arr.push({
        boatBatchNum:item.boatBatchNum,
        companyId:item.companyId
      })
    });
    let params = {tSingleEfficiencyModelList:arr,...data};
    let url = portUrl.selectBybatchNum;
    this.listLoading2 = true;
    this.http.post(url, params).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
      }
    })
  }
  /**
   * 明细列表当前页数改变的方法
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2});
  }


  /**
   * 明细列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2});
  }

  export(){  //导出
    let url: any = portUrl.cabinEfficiency;
    this.ngHttp.post(url, this.temGetListData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `单舱效率.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  //左右上下分栏
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }


}
