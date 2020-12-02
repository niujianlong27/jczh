/**
 * 盘库管理
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NzModalService } from 'ng-zorro-antd';
import { GlobalService } from '@service/global-service.service';
@Component({
  selector: 'app-check-manage',
  templateUrl: './check-manage.component.html',
  styleUrls: ['./check-manage.component.css']
})
export class CheckManageComponent implements OnInit {
  public loading = false;
  public upData: any[] = [];
  public downData: any[] = [];
  public downLoading = false;
  private searchParam: any = {};
  public total = 0;
  public upHeight: string;
  public downHeight: string;
  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private glo: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.glo.searchReload.subscribe((obj: any) => {
      if (obj.target === 'checkInfo-checkManage') {
        this.getData();
      }
    });
  }

  public search(data: any) {
    this.searchParam = data;
    this.getData();
  }

  // 表格高度事件
  public heightResult(data: any) {
    this.upHeight = `${data.one}px`;
    this.downHeight = `${data.two}px`;
  }

  // 获取主表数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockcheck/getStockCheck`,
      this.searchParam
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.upData = (res.data && res.data.data) || [];
        this.total = (res.data && res.data.total) || 0;
        this.downData = [];
      }
    });
  }

  // 获取子表数据
  private getDatail(param: any) {
    this.downLoading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockcheckdetail/getCheckDetail`,
      param
    ).subscribe((res: any) => {
      this.downLoading = false;
      if (res.code === 100) {
        this.downData = (res.data && res.data.data) || [];
      }
    });
  }

  // 选择数据的事件
  public selectData(data: any[]) {
    if (data.length) {
      const checkWsNos = data.map((x: any) => x.checkWsNo);
      this.getDatail({ checkWsNos: checkWsNos.join(','), page: 1, length: 1000000 });
    } else {
      this.downData = [];
    }
  }

  public btnClick(data: any) {
    const selectedData = this.upData.filter((x: any) => x.checked);
    const param = selectedData.map((x: any) => x.checkWsNo);
    switch (data.buttonId) {
      case 'update':
        if (selectedData.length !== 1) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择一条数据进行修改操作'
          });
          return;
        }
        if (selectedData[0].autherStatus !== 'ATST10') {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择未审核的数据进行修改操作'
          });
          return;
        }
        this.router.navigate(['/system/stock-manage/stock-in-manage/checkInfo']).then(() => {
          this.glo.searchReload.emit({ target: 'checkManageTOcheckInfo', checkWsNo: selectedData[0].checkWsNo });
        });
        break;
      case 'delete':
        if (!selectedData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要删除的数据'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行删除？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockcheck/delCheckList`,
              { checkWsNos: param.join(',') }
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
                this.getData();
              }
            });
          }
        });
        break;
      case 'export':
        this.http.post(
          `${environment.baseUrlStorage}stockcheck/stockCheckOneExcel`,
          this.searchParam,
          { responseType: 'blob' }
        ).subscribe((res: any) => {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = '盘库管理.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        break;
      case 'audit':
        if (!selectedData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要审核的数据'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行审核？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockcheck/auditStock`,
              { checkWsNos: param.join(',') }
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
                this.getData();
              }
            });
          }
        });
        break;
      case 'detail':
        if (!selectedData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要导出明细表的数据'
          });
          return;
        }
        this.http.post(
          `${environment.baseUrlStorage}stockcheckdetail/checkDetailOneExcel`,
          { checkWsNos: param.join(',') },
          { responseType: 'blob' }
        ).subscribe((res: any) => {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '盘库管理明细.xlsx';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        break;
      case 'repeal':
        if (!selectedData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要撤销审核的数据'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行撤销审核？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockcheck/repealStock`,
              { checkWsNos: param.join(',') }
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
                this.getData();
              }
            });
          }
        });
        break;
      default:
        break;
    }
  }
}
