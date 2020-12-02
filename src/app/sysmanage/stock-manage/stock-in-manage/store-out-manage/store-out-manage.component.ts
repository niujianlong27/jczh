/**
 * 出库管理
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import {GlobalService} from '@service/global-service.service';
@Component({
  selector: 'app-store-out-manage',
  templateUrl: './store-out-manage.component.html',
  styleUrls: ['./store-out-manage.component.css']
})
export class StoreOutManageComponent implements OnInit {
  public data: any[] = [];
  public downData: any[] = [];
  public loading = false;
  public total = 0;
  private searchParam: any = {};
  public downLoading = false;
  public downTotal = 0;
  private outWsNos: any = {};
  private downPage = 1;
  private downLength = 100;
  public upHeight: string;
  public downHeight: string;
  private upUpdateDate: any[] = [];
  constructor(
    private http: HttpClient,
    private modal: NzModalService,
     private router: Router,
    private glo: GlobalService,
  ) { }

  ngOnInit() {
    this.getData();
    this.searchReloadEvent();
  }

  searchReloadEvent(): void {
    this.glo.searchReload.subscribe(
      value => {
        if (value['target'] === 'stockOutDetail') {
          this.data = [];
          this.upUpdateDate = [];
          this.getData();
        }
      }
    );
  }
  // 表格高度事件
  public heightResult(data: any) {
    this.upHeight = `${data.one}px`;
    this.downHeight = `${data.two}px`;
  }

  // 页面主表查询
  public search(param: any) {
    this.searchParam = param;
    this.getData();
  }

  // 获取主表数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockout/getStockOut`,
      this.searchParam
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.data = res.data.data || [];
        this.downData = [];
        this.outWsNos = {};
        this.total = res.data.total || 0;
      }
    });
  }

  // 主表选择数据
  public selectFun(data: any[]) {
    if (data.length) {
      this.upUpdateDate = data;
      const param = data.map((x: any) => x.outWsNo).join(',');
      this.outWsNos = { outWsNos: param };
      this.getDownData();
    } else {
      this.outWsNos = {};
      this.downData = [];
    }
  }

  // 主表页码事件
  public pageIndexGrid(page: number) {
    this.searchParam.page = page;
    this.getData();
  }

  // 主表条数事件
  public pageSizeGrid(len: number) {
    this.searchParam.length = len;
    this.searchParam.page = 1;
    this.getData();
  }

  // 子表数据获取
  private getDownData() {
    this.downLoading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockoutdetail/getStockOutDetail`,
      {
        ...this.outWsNos,
        page: this.downPage,
        length: this.downLength
      }
    ).subscribe((res: any) => {
      this.downLoading = false;
      if (res.code === 100) {
        this.downData = res.data.data || [];
        this.downTotal = res.data.total || 0;
      }
    });
  }

  // 子表页码事件
  public pageIndex(page: number) {
    this.downPage = page;
    this.getDownData();
  }

  // 子表条数事件
  public pageSize(len: number) {
    this.downLength = len;
    this.downPage = 1;
    this.getDownData();
  }

  // 页面功能按钮事件
  public btnClick(data: any) {
    const selectData = this.data.filter((x: any) => x.checked);
    if (!selectData.length) {
      this.modal.error({
        nzTitle: '信息提示',
        nzContent: '请选择要要操作的数据'
      });
      return;
    }
    switch (data.buttonId) {
      case 'update':
        this.btnUpdate();
        break;
      case 'delete':
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行删除操作？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockout/deleteStockOutOneList`,
              this.outWsNos
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.getData();
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.data
                });
              }
            });
          }
        });
        break;
      case 'audit':
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行审核操作？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockout/auditOut`,
              this.outWsNos
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.getData();
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.data
                });
              }
            });
          }
        });
        break;
      case 'repeal':
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行撤销审核操作？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockout/revokeAuditOut`,
              this.outWsNos
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.getData();
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.data
                });
              }
            });
          }
        });
        break;
      default:
        break;
    }
  }

  // 修改事件
  btnUpdate() {
    if (this.upUpdateDate.length !== 1) {
      this.modal.error({
        nzTitle: '信息提示',
        nzContent: '请选择要要操作的数据'
      });
      return;
    }
    if (this.upUpdateDate.filter(x => x.status === '20').length > 0) {
      this.modal.error({
        nzTitle: '信息提示',
        nzContent: '请勾选待出库数据'
      });
      return;
    }
    sessionStorage.setItem('data', JSON.stringify(this.upUpdateDate));
    sessionStorage.setItem('item', JSON.stringify(this.downData));
    this.router.navigate(['/system/stock-manage/stock-in-manage/stockOutRegistration'], {
      queryParams: {
        buttonId: 'Update'
      }
    }).then(r => console.log(r)); }
}
