/**
 * 仓库品种配置管理
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { retry } from 'rxjs/operators';
@Component({
  selector: 'app-warehouse-varieties-set',
  templateUrl: './warehouse-varieties-set.component.html',
  styleUrls: ['./warehouse-varieties-set.component.css']
})
export class WarehouseVarietiesSetComponent implements OnInit {
  public visible = false;
  public modalTitle: string;
  public modalForm: FormGroup;
  public total = 0;
  public loading = false;
  public data: any[] = [];
  private searchParam: any = {};
  private buttonId: string;
  private updateData: any[] = [];
  public storeData: any[] = [];
  public kbglData: any[] = [];
  public prodNameData: any[] = [];
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.modalForm = this.fb.group({
      storeCode: [null, [Validators.required]],
      prodName: [null, [Validators.required]],
      isPack: [null, [Validators.required]],
      remark: [null]
    });
    this.getStore();
    this.getKBGL();
    this.getProdName();
  }

  // 获取仓库数据
  private getStore() {
    this.http.post(
      `${environment.baseUrlStorage}store/selectAllStore`,
      {}
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.storeData = res.data;
      }
    });
  }

  // 获取品种数据
  private getProdName() {
    this.http.post(
      `${environment.baseUrlStorage}itema/selectAllItema`,
      {}
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.prodNameData = res.data;
      }
    });
  }

  // 获取是否捆包管理
  private getKBGL() {
    this.http.post(
      `${environment.baseUrlStorage}storeProdSet/getStaticCode`,
      { valueSetCode: 'KBGL' }
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.kbglData = res.data;
      }
    });
  }

  // 查询
  public search(data: any) {
    this.searchParam = data;
    this.getData();
  }

  // 获取数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrlStorage}storeProdSet/getStoreProdSet`,
      this.searchParam
    ).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.data = (res.data && res.data.data) || [];
        this.total = (res.data && res.data.total) || 0;
      }
    });
  }

  // 弹窗确认
  public ok() {
    // tslint:disable-next-line: forin
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.status === 'INVALID') {
      return;
    }
    const store = this.storeData.filter((x: any) => x.storeCode === this.modalForm.get('storeCode').value);
    // 默认是新增
    let url = 'storeProdSet/insertStoreProdSet';
    let param = { ...this.modalForm.value, storeName: store[0] && store[0].storeName };
    if (this.buttonId === 'update') {
      url = 'storeProdSet/updateStoreProdSet';
      param = { ...param, rowid: this.updateData[0].rowid };
    }
    this.http.post(
      `${environment.baseUrlStorage}${url}`,
      param
    ).subscribe((res: any) => {
      if (res.code === 100) {
        this.getData();
        this.visible = false;
        this.modal.success({
          nzTitle: '信息提示',
          nzContent: res.msg
        });
        this.updateData = [];
      }
    });
  }

  // 页面按钮
  public btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add':
        this.modalForm.reset();
        this.modalTitle = '仓库品种配置 > 新增';
        this.visible = true;
        break;
      case 'update':
        this.updateData = this.data.filter((x: any) => x.checked);
        if (this.updateData.length === 0) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要修改的数据'
          });
          return;
        }
        if (this.updateData.length > 1) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择一条数据进行修改操作'
          });
          return;
        }
        this.modalForm.reset();
        this.modalForm.get('storeCode').setValue(this.updateData[0].storeCode);
        this.modalForm.get('prodName').setValue(this.updateData[0].prodName);
        this.modalForm.get('isPack').setValue(this.updateData[0].isPack);
        this.modalForm.get('remark').setValue(this.updateData[0].remark);
        this.modalTitle = '仓库品种配置 > 修改';
        this.visible = true;
        break;
      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const param = this.data.filter((x: any) => x.checked).map((y: any) => ({ rowid: y.rowid }));
        if (!param.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要删除的数据'
          });
          return;
        }
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要删除选中的数据？',
          nzOnOk: () => {
            this.http.post(
              `${environment.baseUrlStorage}storeProdSet/deleteStoreProdSetList`,
              { storeProdSetModels: param }
            ).subscribe((res: any) => {
              if (res.code === 100) {
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
                this.searchParam.page = 1;
                this.getData();
              }
            });
          }
        });
        break;
      case 'export':
        this.http.post(
          `${environment.baseUrlStorage}storeProdSet/prodSetExcel`,
          this.searchParam,
          { responseType: 'blob' }
        ).subscribe((res: any) => {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = '仓库品种配置.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
        break;
    }
  }
}
