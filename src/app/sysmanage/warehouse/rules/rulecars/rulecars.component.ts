import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-rulecars',
  templateUrl: './rulecars.component.html',
  styleUrls: ['./rulecars.component.css']
})


export class RulecarsComponent implements OnInit {
  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId: string;
  tabs: Array<any> = []; // 页面数组
  private searchData: any[] = [];
  private dataSetClone: any[] = [];
  private searchParam: any = {};
  public modalForm: FormGroup;
  public modalFormData: any[] = [];
  public visible: boolean;
  public modalTitle: string;
  public okloading: boolean;
  private warehouse: any[] = [];
  private gate: any[] = [];
  public isUpdate: boolean[] = [];
  private status: any[] = [];
  private warehouseCode: string;
  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private fb: FormBuilder,
    private info: UserinfoService
  ) {
  }

  ngOnInit() {
    this.getTabs();
    this.getList({}, 1);
  }
 // 静态数据获取
 public staticData = (code: string) => new Observable((ob) => {
  let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
  let param:any = {codesetCode: code};
  let key = 'itemCname';
  let value = 'itemCode';
  if (code === 'form_queue_product_ware_right') {
    url = `${environment.baseUrlSystem}roleButton/getUserButtons`;
    param = {
      formId: code,
      userId: this.info.get('USER').userId
    };
    key = 'buttonName';
    value = 'buttonId';
   } else if (code === 'product_disp.gate') {
    param.status = 'product_disp.codeset_status_10';
   }
   this.http.post(url, param).subscribe(
     (res: any) => {
       if (res.code === 100) {
        const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
        if (code === 'form_queue_product_ware_right') { // 仓库名称
                this.warehouse = [...data];
                const warehouseCode = this.warehouse.map(x => x.value);
                this.warehouseCode = warehouseCode.join(',');
          } else if (code === 'product_disp.gate') { // 可入厂大门
                this.gate = [...data];
          } else if (code === 'product_disp.entryCars') {
              this.status = [...data];
          }
          ob.next(data);
       } else {
         ob.error();
       }
     }
   );
 })
 // 按钮功能数据获取
 public btnData(data: any, index: number) {
  this.isUpdate[index] = data.some(x => x.buttonId === 'Update');
 }
  public getList(param: any = {}, ruleType?: number) {
     param.page = param.page || 1;
     param.length = param.length || 100;
     param.ruleType = ruleType || this.searchParam.ruleType;
     const warehouseCode = param.ruleType == 3 ? {warehouseCode: this.warehouseCode} : {}
     this.searchParam = {...param};
     this.loading = true;
     this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryCars/getRecords`, {...param,
    ...warehouseCode}).subscribe(
       (res: any) => {
         this.loading = false;
         if (res.code === 100) {
            const dataSet = res.data.data || [];
            this.totalPage = res.data.total;
            dataSet.forEach((x: any) => {
              this.dataSetClone = [...this.dataSetClone, {...x}];
              x.editstate = 0;
            });
            this.dataSet = [...dataSet];
         }
       }
     );
  }
  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.add();
        break;
      case 'Delete':
        this.delete();
    }
  }

  // 获取表头
  getTabs(): void {
    this.tabs.push({ itemCname: '厂内车辆上限设置', itemCode: 'PZYXJ', formId: 'form_queue_product_rulecars0', ruleType: 1 });
    this.tabs.push({ itemCname: '大门在途车辆上限设置', itemCode: 'PZKRCDM', formId: 'form_queue_product_rulecars1' , ruleType: 2});
    this.tabs.push({ itemCname: '仓库可排队车辆上限设置', itemCode: 'PZKRCDM', formId: 'form_queue_product_rulecars2' , ruleType: 3});
  }
 // 获取查询数据
 public searchdataFun(data: any) {
   this.searchData = [...this.searchData, ...data];
 }
  // tab切换
  selectChange(data: any) {
   window.setTimeout(() => {
      this.searchParam = {};
      this.searchData.forEach((x: any) => {
        x.checkBox = false;
        x.value1 = null;
        x.value2 = null;
      });
      this.getList(this.searchParam, data.ruleType);
    });
 }
 // 添加
 private add() {
   this.visible = true;
   this.modalForm = this.fb.group({});
   if (this.searchParam.ruleType === 2) {
     this.modalTitle = '大门在途车辆上限设置新增';
     this.modalFormData = [
       {eName: 'gateCode', cName: '进厂大门', validators: [Validators.required], require: true, type: 'select',
        data: this.gate},
       {eName: 'maxCount', cName: '车辆最大数', validators: [Validators.required, (control: AbstractControl) => {
          if (control.value < 0) {
            return {message: '车辆最大数不能为负数'};
          }
          return null;
      }], require: true, type: 'inputNumber'}
     ];
   } else if (this.searchParam.ruleType === 3) {
     this.modalTitle = '仓库可排队车辆上限设置新增';
     this.modalFormData = [
       {eName: 'warehouseCode', cName: '仓库名称', validators: [Validators.required], require: true, type: 'select',
        data: this.warehouse},
       {eName: 'maxCount', cName: '车辆最大数', validators: [Validators.required, (control: AbstractControl) => {
          if (control.value < 0) {
            return {message: '车辆最大数不能为负数'};
          }
          return null;
      }], require: true, type: 'inputNumber'}
     ];
   }
   this.modalFormData.forEach((x: any) => {
     this.modalForm.addControl(x.eName, new FormControl(null, x.validators));
   });
 }
 // 弹窗确定
  public ok() {
     // tslint:disable-next-line: forin
     for (const i in this.modalForm.controls) {
       this.modalForm.controls[i].markAsDirty();
       this.modalForm.controls[i].updateValueAndValidity();
     }
     if (this.modalForm.status === 'INVALID') { return; }
     this.okloading = true;
     const param: any = {};
     param.ruleType = this.searchParam.ruleType;
     if (param.ruleType === 2) {
       const gateName = this.gate.filter((x: any) => x.value === this.modalForm.get('gateCode').value);
       param.gateName = gateName[0] && gateName[0].name;
     } else if (param.ruleType === 3) {
       const warehouseName = this.warehouse.filter((x: any) => x.value === this.modalForm.get('warehouseCode').value);
       param.warehouseName = warehouseName[0] && warehouseName[0].name;
     }
     this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryCars/insert`, {...param, ...this.modalForm.getRawValue()}).subscribe(
       (res: any) => {
         this.okloading = false;
         if (res.code === 100) {
           this.modal.success({
             nzTitle: '提示信息',
             nzContent: res.msg
           });
           this.visible = false;
           this.getList(this.searchParam);
         }
       }
     );
  }
   // 修改
   public update(data: any, flag: number){
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      if (this.searchParam.ruleType !== 1) {
          data.statusName = data.status;
        }
    } else {
      const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
      data.editstate = 0;
      data._setUpdate = false;
    }
  }
  // 保存
  public save(data: any) {
    const param = {...data};
    if (!param.maxCount && param.maxCount !== 0) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '车辆最大数不能为空!'
      });
      return;
    }
    if (this.searchParam.ruleType !== 1) {
      if (!data.statusName) {
        this.modal.error({
          nzTitle: '提示信息',
          nzContent: '状态不能为空!'
        });
        return;
      }
      param.status = data.statusName;
      const status = this.status.filter((x: any) => x.value === param.status);
      param.statusName = status[0] && status[0].name;
    }
    data.btnloading = true;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryCars/update`, {...param}).subscribe(
      (res: any) => {
        data.btnloading = false;
        if (res.code === 100) {
          data.editstate = 0;
          data.status = param.status;
          data.statusName = param.statusName;
          data._setUpdate = false;
          data.updateName = this.info.APPINFO.USER.name;
          data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
          const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
          Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
        }
      }
    );
  }
  // 删除
  private delete() {
    const data = this.dataSet.filter((x: any) => x.checked);
    if (data.length !== 1) {
        this.modal.error({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行删除操作!'
        });
        return;
    }
    this.modal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要将选中的数据进行删除操作?',
      nzOnOk: () => new Promise((resolve, reject) => {
              this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryCars/delete`, {rowid: data[0] && data[0].rowid}).subscribe(
                (res: any) => {
                  if (res.code === 100) {
                    this.modal.success({
                      nzTitle: '提示信息',
                      nzContent: res.msg
                    });
                    this.getList(this.searchParam);
                    resolve();
                  } else {
                    reject();
                  }
                }
              );
        })
    });
  }
}
