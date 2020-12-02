/**
 * 黑名单管理
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '@env/environment';
import { retry } from 'rxjs/operators';
import { format } from 'date-fns';
import {urls} from '../../../../common/model/url';
@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.css']
})
export class BlackListComponent implements OnInit {
  public data: any[] = [];
  public loading: boolean;
  public total: number;
  private searchParam: any = {};
  public visible: boolean;
  public modalTitle: string;
  public modalForm: FormGroup;
  private buttonId: string;
  public modalLoading: boolean;
  public modalData: any[] = [
    { cName: '用户', eName: 'name', type: 'inputModal', required: true },
    { cName: '用户Id', eName: 'userId', type: '' },
    { cName: '手机号', eName: 'mobile', type: '' },
    { cName: '车牌号', eName: 'vehicleNo', type: 'select', required: true, list: [] },
    { cName: '封闭天数', eName: 'duration', type: 'number', required: true },
    { cName: '开始时间', eName: 'beginTime', type: 'date', required: true },
    { cName: '结束时间', eName: 'endTime', type: 'date', disabled: true },
    { cName: '是否有效', eName: 'effective', type: 'radio', required: true },
    { cName: '备注', eName: 'remark', type: 'areatext', required: true }
  ];

  public numberFormat = (val: string) => val ? Number(val) : val;
  // tslint:disable-next-line: radix
  public numberParser = (val: number) => val ? parseInt(val.toString()) : val;
  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateControl();
  }

  //
  private updateControl() {
    this.modalForm = this.fb.group({});
    this.modalData.forEach((item: any) => {
      this.modalForm.addControl(item.eName,
        new FormControl({ value: null, disabled: item.disabled }, item.required ? Validators.required : null));
    });
  }

  // 用户
  public inpEmit(data: any) {
    const nameObj = (data.selData && data.selData[0]) || {};
    this.modalForm.get('name').setValue(nameObj.name);
    this.modalForm.get('userId').setValue(nameObj.userId);
    this.modalForm.get('mobile').setValue(nameObj.mobile);
    if (nameObj.userId) {
      this.getVehicleNo(nameObj.userId);
    }
  }

  //
  public getEndTime(flag: string) {
    if (flag === 'endTime') {
      return;
    }
    if (this.modalForm.get('duration').value && this.modalForm.get('beginTime').value) {
      const endTime = new Date(Date.parse(this.modalForm.get('beginTime').value) + 86400000 * this.modalForm.get('duration').value);
      this.modalForm.get('endTime').setValue(endTime);
    }
  }

  // 获取车票号
  private getVehicleNo(id: string, flag?: string) {
    const data = this.modalData.filter((x: any) => x.eName === 'vehicleNo');
    this.http.post(
      urls.getBlackList,
      {
        userId: id
      }
    ).pipe(
      retry(3)
    ).subscribe((res: any) => {
      if (res.code === 100) {
        if (data[0] && data[0].list) {
          data[0].list = (res.data && res.data.data) || [];
          // 车牌号屏蔽相同的
          if (flag === 'update' && this.modalForm.get('vehicleNo').value) {
            data[0].list = [{
              vehicleNo: this.modalForm.get('vehicleNo').value
            }, ...data[0].list];
          }
        }
      }
    });
  }

  // 查询
  public search(data: any) {
    this.searchParam = data;
    this.getData();
  }

  // 页面功能
  public btnClick(data: any) {
    this.buttonId = data.buttonId;
    const selectData = this.data.filter((x: any) => x.checked);
    switch (data.buttonId) {
      case 'Add':
        this.modalForm.reset();
        this.modalTitle = '新增黑名单';
        this.visible = true;
        break;
      case 'Update':
        if (selectData.length !== 1) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择一条数据进行修改'
          });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const param = { ...selectData[0] || {} };
        param.effective = param.effective === '有效' ? 1 : param.effective === '无效' ? 0 : null;
        if (param.userId) {
          this.getVehicleNo(param.userId, 'update');
        }
        this.modalForm.reset();
        this.modalTitle = '修改黑名单';
        this.modalForm.patchValue(param);
        this.visible = true;
        break;
      case 'Delete':
        if (!selectData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要删除的数据'
          });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const tBlackListModels = selectData.map((x: any) => ({ rowid: x.rowid }));
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行删除操作？',
          nzOnOk: () => new Promise((resolve, reject) => {
            this.http.post(
              `${environment.baseUrlSystem}blacklist/deleteBlackLists`,
              {
                tBlackListModels: tBlackListModels
              }
            ).subscribe((res: any) => {
              resolve();
              if (res.code === 100) {
                this.getData();
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
              }
            });
          })
        });
        break;
      case 'Invalid':
        if (!selectData.length) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '请选择要进行失效操作的数据'
          });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const bool = selectData.some((x: any) => x.effective === '无效');
        if (bool) {
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: '您选中的数据中包含无效数据，请选择有效数据进行操作'
          });
          return;
        }
        // eslint-disable-next-line no-case-declarations
        const tBlackListModel = selectData.map((x: any) => ({ rowid: x.rowid }));
        this.modal.confirm({
          nzTitle: '信息提示',
          nzContent: '确定要将选中的数据进行无效操作？',
          nzOnOk: () => new Promise((resolve, reject) => {
            this.http.post(
              `${environment.baseUrlSystem}blacklist/invalidBlackLists`,
              {
                tBlackListModels: tBlackListModel
              }
            ).subscribe((res: any) => {
              resolve();
              if (res.code === 100) {
                this.getData();
                this.modal.success({
                  nzTitle: '信息提示',
                  nzContent: res.msg
                });
              }
            });
          })
        });
        break;
      default:
        break;
    }
  }

  // 获取数据
  private getData() {
    this.loading = true;
    this.http.post(
      `${environment.baseUrl}blacklist/getBlackLists`, //
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
    let url = `${environment.baseUrlSystem}blacklist/insertBlackList`;
    const modalValue = { ...this.modalForm.getRawValue() };
    const param: any = {};
    modalValue.beginTime = format(modalValue.beginTime, 'YYYY-MM-DD HH:mm:ss');
    modalValue.endTime = format(modalValue.endTime, 'YYYY-MM-DD HH:mm:ss');
    if (this.buttonId === 'Update') {
      url = `${environment.baseUrlSystem}blacklist/updateBlackList`;
      const d = this.data.filter((x: any) => x.checked);
      param.rowid = d[0] && d[0].rowid;
    }
    this.modalLoading = true;
    this.http.post(
      url,
      {
        ...modalValue,
        ...param
      }
    ).subscribe((res: any) => {
      this.modalLoading = false;
      if (res.code === 100) {
        this.getData();
        this.visible = false;
        this.modal.success({
          nzTitle: '信息提示',
          nzContent: res.msg
        });
      }
    });
  }
}
