/**
 * 移库管理
 */
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { GlobalService } from '@service/global-service.service';
@Component({
  selector: 'app-store-move-manage',
  templateUrl: './store-move-manage.component.html',
  styleUrls: ['./store-move-manage.component.css']
})
export class StoreMoveManageComponent implements OnInit {
  public searchParam: any = {};
  public loading = false;
  public downLoading = false;
  public upData: any[] = [];
  public upTotal = 0;
  public upHeight: string;
  public downHeight: string;
  public downData: any[] = [];
  constructor(
    private http: HttpClient,
    private glo: GlobalService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.glo.searchReload.subscribe((obj: any) => {
      if (obj.target === 'storeMoveCheck') {
        this.getData();
      }
    });
  }

  public search(data: any) {
    this.searchParam = data;
    this.getData();
  }

  // 表格高度
  public heightResult(data: any) {
    this.upHeight = `${data.one}px`;
    this.downHeight = `${data.two}px`;
  }

  // 选择主表数据事件
  public selectData(data: any) {
    if (data.length) {
      const moveWsIds = data.map((x: any) => x.moveWsNo);
      this.getDetail({ moveWsIds: moveWsIds.join(','), page: 1, length: 1000000 });
    } else {
      this.downData = [];
    }
  }

  // 获取主表数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockmove/getStockMove`,
      this.searchParam
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.downData = [];
        this.upData = (res.data && res.data.data) || [];
        this.upTotal = (res.data && res.data.total) || 0;
      }
    });
  }

  // 获取明细表数据
  private getDetail(param: any) {
    this.downLoading = true;
    this.http.post(
      `${environment.baseUrlStorage}stockmovedetail/getStockMoveDetail`,
      param
    ).subscribe((res: any) => {
      this.downLoading = false;
      if (res.code === 100) {
        this.downData = (res.data && res.data.data) || [];
      }
    });
  }

  // 按钮事件
  public btnClick(data: any) {
    switch (data.buttonId) {
      case 'export':
        this.http.post(
          `${environment.baseUrlStorage}stockmove/stockMoveOneExcel`,
          this.searchParam,
          { responseType: 'blob' }
        ).subscribe((res: any) => {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = '移库管理.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        break;
      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const selected = this.upData.filter((x: any) => x.checked);
        if (selected.length !== 1) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择一条数据进行删除操作'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行删除操作？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}stockmove/delMoveStock`,
              {
                moveWsNo: selected[0].moveWsNo,
                moveWsTime: selected[0].moveWsTime,
                stockMoveDetailModels: this.downData
              }
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
