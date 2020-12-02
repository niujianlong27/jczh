/**
 * 开票并打印
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '@service/global-service.service';
import { takeWhile } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@service/cache.service';
import { environment } from '@env/environment';
@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent implements OnInit, OnDestroy {
  public visvible = false;
  public detailVisible = false;
  public data: any[] = [];
  public total = 0;
  private searchParam: any = {};
  private alive = true;
  private invoiceStatus = '未开票';
  private invoiceStatusCode = 'FPZT10';
  public tabIndex = 0;
  public btnData: any = {
    StatusConfirm: false,
    Detail: false,
    Preview: false
  };

  private billParam: any[] = [];
  public loading = false;
  public taxData: any = {};
  public billLoading = false;
  constructor(
    private http: HttpClient,
    private glo: GlobalService,
    private modal: NzModalService,
    private cache: CacheService
  ) { }

  ngOnInit() {
    this.glo.searchReload.pipe(
      takeWhile(() => this.alive)
    ).subscribe((res: any) => {
      if (res.target === 'Invoice-print') {
        this.searchParam = {};
        this.invoiceStatus = '未开票';
        this.invoiceStatusCode = 'FPZT10';
        if (this.tabIndex === 0) {
          this.getData();
        }
        this.tabIndex = 0;
      }
    });
  }

  // 按钮数据返回
  public getBtnData(data: any[]) {
    this.btnData.StatusConfirm = data.some((x: any) => x.buttonId === 'StatusConfirm');
    this.btnData.Detail = data.some((x: any) => x.buttonId === 'Detail');
    this.btnData.Preview = data.some((x: any) => x.buttonId === 'Preview');
  }

  // tab标签切换
  public tabSelect(data: any) {
    this.invoiceStatus = data.index === 0 ? '未开票' : data.index === 1 ? '开票中' : '开票失败';
    this.invoiceStatusCode = data.index === 0 ? 'FPZT10' : data.index === 1 ? 'FPZT20' : 'FPZT25';
    this.searchParam.page = 1;
    this.getData();
  }

  public tabIndexChange(index: number) {
    this.tabIndex = index;
  }

  // 页面数据查询
  public search(param: any) {
    this.searchParam = param;
    this.getData();
  }

  // 页面按钮功能
  public btnClick(data: any) {
    const selectData = this.data.filter((x: any) => x.checked);
    switch (data.buttonId) {
      case 'Export':
        break;
      case 'Delete':
        if (!selectData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择数据进行删除操作'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行删除操作？',
          nzOnOk: () => {
            const param = selectData.map((x: any) => ({
              companyId: x.companyId,
              invoiceId: x.invoiceId,
              invoiceItemId: x.invoiceItemId
            }));
            return new Promise((resolve, reject) => {
              this.http.post(
                `${environment.baseUrlSettle}invoice/invoiceDelete`,
                param
              ).subscribe((res: any) => {
                if (res.code === 100) {
                  resolve();
                  this.modal.success({
                    nzTitle: '信息提示',
                    nzContent: res.msg
                  });
                  this.getData();
                } else {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject();
                }
              });
            });
          }
        });
        break;
      case 'Billing':
        // eslint-disable-next-line no-case-declarations
        const bool = selectData.some((x: any) => x.invoiceStatus !== '未开票' && x.invoiceStatus !== '开票失败');
        if (!selectData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择数据进行开票操作'
          });
          return;
        }
        if (bool) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择未开票的数据进行开票操作'
          });
          return;
        }
        this.billParam = selectData;
        this.billing();
        break;
      case 'Print':
        break;
    }
  }

  // 预览 详情
  public detail(param: any, flag: string) {
    this.http.post(
      `${environment.baseUrlSettle}invoice/invoiceView`,
      {
        ...param
      }
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.taxData = res.data;
        if (flag === 'preview') {
          this.visvible = true;
        } else {
          this.billParam = [param];
          this.detailVisible = true;
        }
      }
    });
  }

  // 开票
  public billing(flag?: string) {
    this.modal.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要将选中的数据进行开票操作?',
      nzOnOk: () => {
        this.billLoading = true;
        const param = this.billParam.map((x: any) => ({
          companyId: x.companyId,
          invoiceId: x.invoiceId,
          invoiceItemId: x.invoiceItemId
        }));
        return new Promise((resolve, reject) => {
          this.http.post(
            `${environment.baseUrlSettle}invoice/invoiceCreate`,
            param
          ).subscribe((res: any) => {
            this.billParam = [];
            this.billLoading = false;
            if (res.code === 100) {
              resolve();
              this.modal.success({
                nzTitle: '信息提示',
                nzContent: res.msg
              });
              this.getData();
              if (flag === 'modal') {
                this.detailVisible = false;
              }
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject();
            }
          });
        });
      }
    });
  }

  // 列表数据获取
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlSettle}invoice/invoiceQuery`,
      {
        invoiceStatus: this.invoiceStatus,
        ...this.searchParam,
        sellerName: this.cache.getSession('invoice_print_sellerName')
      }
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.data = (res.data && res.data.data) || [];
        this.total = (res.data && res.data.total) || 0;
      }
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.alive = false;
  }
}
