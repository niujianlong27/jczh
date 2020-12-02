import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css']
})
export class TimeoutComponent implements OnInit {

  constructor(private http: HttpClient,
              private modal: NzModalService,
              private info: UserinfoService,
              private fb: FormBuilder) { }
  private searchParam: any = {};
  public list: any[] = [];
  private listclone: any[] = [];
  public total = 0;
  public loading: boolean;
  public modalForm: FormGroup;
  public visible: boolean;
  public modalFormData: any[] = [];
  private kind: any[] = [];
  private gate: any[] = [];
  private dealType: any[] = [];
  private status: any[] = [];
  public isUpdate: boolean;
  public okloading: boolean;
  // private headerDealValue: any;
  // private headerDealCount: any;
  private dealArr: any[] = [
    {eName: 'dealValue', cName: '顺延时长(分)', validators: [Validators.required, (control: AbstractControl) => {
      if (control.value <= 0) {
        return {message: '顺延时长(分)不能为0或负数'};
      } else if (control.value % 1 !== 0) {
        return {message: '顺延时长(分)不能为小数'};
      }
      return null;
  }], require: true, type: 'inputNumber'},
    {eName: 'dealCount', cName: '顺延次数', validators: [Validators.required, (control: AbstractControl) => {
      if (control.value <= 0) {
        return {message: '顺延次数不能为0或负数'};
      } else if (control.value % 1 !== 0) {
        return {message: '提示次数不能为小数'};
      }
      return null;
  }], require: true, type: 'inputNumber'}
  ];
  ngOnInit() {
  }
  // 按钮数据返回
public btnData(data: any[]){
  this.isUpdate = data.some(x => x.buttonId === 'Update');
}
  // 静态数据
  public staticData = (code: string) => new Observable((ob) => {
    let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
    let param: any = {codesetCode: code};
    let key = 'itemCname';
    let value = 'itemCode';
    if (code === 'getKindName') {
      url = `${environment.baseUrlRzsteelWarehouse}productMatKind/matAll`;
      param = {};
      key = 'matKindName';
      value = 'matKindCode';
    } else if (code === 'product_disp.gate') {
      param.status = 'product_disp.codeset_status_10';
    }
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
            const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
            if (code === 'getKindName') { // 分类名称
                 this.kind = [...data];
            } else if (code === 'product_disp.gate') { // 可入厂大门
                 this.gate = [...data];
            } else if (code === 'product_disp.dealType') { // 处理方式
              this.dealType = [...data];
            } else if (code === 'product_disp.entryTimeout_status') {
              this.status = [...data];
            }
           // tslint:disable-next-line: no-unused-expression
           ob && ob.next(data);
        } else {
           // tslint:disable-next-line: no-unused-expression
           ob && ob.error();
        }
      }
    )
  })
  // 列表数据获取
  public getData(param: any = {}) {
    this.searchParam = {...param};
    this.loading = true;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/getPageProductGate`, param).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.code === 100) {
            const list = res.data.data || [];
            this.total = res.data.total;
            this.listclone = [];
            list.forEach((x: any) => {
              this.listclone = [...this.listclone, {...x}];
              x.editstate = 0;
            })
            this.list = [...list];
        }
      }
    );
  }
  // 按钮功能
  public click(data: any) {
     switch (data.buttonId) {
       case 'Add':
         this.add();
         break;
       case 'Delete':
         this.delete();
         break;
     }
  }
  // 新增
  private add () {
    this.visible = true;
    this.modalForm = this.fb.group({});
    this.modalFormData = [
      {eName: 'kindCode', cName: '分类名称', validators: [Validators.required], require: true, type: 'select',
       data: this.kind},
      {eName: 'gateCode', cName: '进厂大门', validators: [Validators.required], require: true, type: 'select',
       data: this.gate},
      {eName: 'timeout', cName: '超时时长(分)', validators: [Validators.required, (control: AbstractControl) => {
        if (control.value <= 0) {
          return {message: '超时时长(分)不能为0或负数'};
        } else if (control.value % 1 !== 0) {
          return {message: '超时时长(分)不能为小数'};
        }
        return null;
    }], require: true, type: 'inputNumber'},
      {eName: 'dealType', cName: '超时处理方式', validators: [Validators.required], require: true, type: 'select',
       data: this.dealType}
    ];
    this.modalFormData.forEach((x: any) => {
      this.modalForm.addControl(x.eName, new FormControl(null, x.validators));
    });
  }
  // selectChange
  public selectChange(data: any) {
    if (data.eName === 'dealType') {
       if (this.modalForm.get('dealType').value === 'product_disp_dealType_addMinutes') {
          this.modalFormData = [...this.modalFormData, ...this.dealArr];
          this.dealArr.forEach((x: any) => {
            this.modalForm.addControl(x.eName, new FormControl(null, x.validators));
          });
       } else {
          this.modalFormData = this.modalFormData.filter((x: any) => x.eName !== 'dealValue' && x.eName !== 'dealCount');
          // tslint:disable-next-line: no-unused-expression
          this.modalForm.get('dealValue') && this.modalForm.removeControl('dealValue');
          // tslint:disable-next-line: no-unused-expression
          this.modalForm.get('dealCount') && this.modalForm.removeControl('dealCount');
       }
    }
  }
  // 删除  单条操作
  private delete(){
     const data = this.list.filter((x: any) => x.checked);
     if (!data.length) {
       this.modal.error({
         nzTitle: '提示信息',
         nzContent: '请选择数据进行删除操作'
       });
       return;
     }
     this.modal.confirm({
       nzTitle: '提示信息',
       nzContent: '确定要将选中的数据进行删除操作？',
       nzOnOk: () => new Promise((resolve, reject) => {
        this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/deleteProductGate`,
        {rowid: data[0] && data[0].rowid}).subscribe(
          (res: any) => {
              if (res.code === 100) {
                this.modal.success({
                  nzTitle: '提示信息',
                  nzContent: res.msg
                })
                this.getData(this.searchParam);
                resolve();
              } else {
                reject();
              }
          }
        );
       })
     });
  }
  // 新增弹窗确认
  public ok() {
    // tslint:disable-next-line: forin
    for (const i in this.modalForm.controls) {
         this.modalForm.controls[i].markAsDirty();
         this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.status === 'INVALID') { return; }
    this.okloading = true;
    const param: any = {};
    const kindName = this.kind.filter((x: any) => x.value === this.modalForm.get('kindCode').value);
    const gateName = this.gate.filter((x: any) => x.value === this.modalForm.get('gateCode').value);
    param.kindName = kindName[0] && kindName[0].name;
    param.gateName = gateName[0] && gateName[0].name;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/insertProductGate`,
    {
      ...this.modalForm.getRawValue(),
      ...param
    }).subscribe((res: any) => {
      this.okloading = false;
      if (res.code === 100) {
         this.modal.success({
           nzTitle: '提示信息',
           nzContent: res.msg
         })
         this.visible = false;
         this.getData(this.searchParam);
      }
    });
  }
  // b表头
  public columns(header: any) {
      // this.headerDealCount = header.filter((x: any) => x.colEname === 'dealCount')[0] || {};
      // this.headerDealValue = header.filter((x: any) => x.colEname === 'dealValue')[0] || {};
  }
  // 处理方式改变
  public modalChange(data: any){
    if (data.header && data.header.colEname === 'dealTypeName') {
        if (data.val === 'product_disp_dealType_addMinutes') {
          // this.headerDealValue.edit = 'BJBJ10';
          // this.headerDealCount.edit = 'BJBJ10';
          data.data.inputDisabled = {
            dealValue: false,
            dealCount: false
          };
        } else {
          // this.headerDealValue.edit = 'BJBJ20';
          // this.headerDealCount.edit = 'BJBJ20';
          data.data.inputDisabled = {
            dealValue: true,
            dealCount: true
          };
          const d = this.listclone.filter((x: any) => x.rowid === (data.data && data.data.rowid));
          if (data.data) {
            data.data.dealValue = d[0] && d[0].dealValue;
            data.data.dealCount = d[0] && d[0].dealCount;
          }
        }
    }
  }
  // 修改
  public update(data: any, flag: number) {
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      data.gateName = data.gateCode;
      data.dealTypeName = data.dealType;
      data.statusName = data.status;
      if (data.dealType !== 'product_disp_dealType_addMinutes') {
          // this.headerDealValue.edit = 'BJBJ20';
          // this.headerDealCount.edit = 'BJBJ20';
          data.inputDisabled = {
            dealValue: true,
            dealCount: true
          };
      }
    } else {
      const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
      data.editstate = 0;
      data._setUpdate = false;
      // this.headerDealValue.edit = 'BJBJ10';
      // this.headerDealCount.edit = 'BJBJ10';
      data.inputDisabled = {
        dealValue: false,
        dealCount: false
      };
    }
  }
  // 保存
  public save(data: any) {
    if (!data.gateName || !data.statusName || (!data.timeout && data.timeout !== 0) || !data.dealTypeName) {
       this.modal.error({
         nzTitle: '提示信息',
         nzContent: '进厂大门、状态、超时时长、处理方式为必填项!'
       })
       return;
    }
    if (data.dealTypeName === 'product_disp_dealType_addMinutes' && ((!data.dealValue && data.dealValue !== 0)
    ||(!data.dealCount && data.dealCount !== 0))) {
       this.modal.error({
         nzTitle: '提示信息',
         nzContent: '顺延次数、顺延时长为必填项!'
       });
       return;
    }
    if (data.timeout == 0 || data.timeout % 1 !== 0) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '超时时长不能为小数或0!'
      });
      return;
    }
    if (data.dealTypeName === 'product_disp_dealType_addMinutes' && (data.dealValue == 0 || data.dealValue % 1 !== 0 
      || data.dealCount == 0 || data.dealCount % 1 !== 0)) {
        this.modal.error({
          nzTitle: '提示信息',
          nzContent: '顺延次数、顺延时长不能为小数或0!'
        });
      return;
    }
    data.btnloading = true;
    const param = {...data};
    const gateName = this.gate.filter((x: any) => x.value === data.gateName);
    const statusName = this.status.filter((x: any) => x.value === data.statusName);
    const dealTypeName = this.dealType.filter((x: any) => x.value === data.dealTypeName);
    param.gateCode = data.gateName;
    param.dealType = data.dealTypeName;
    param.status = data.statusName;
    param.gateName = gateName[0] && gateName[0].name;
    param.dealTypeName = dealTypeName[0] && dealTypeName[0].name;
    param.statusName = statusName[0] && statusName[0].name;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/updateProductGate`, param).subscribe(
      (res: any) => {
        data.btnloading = false;
        if (res.code === 100){
          data.editstate = 0;
          data._setUpdate = false;
          // this.headerDealValue.edit = 'BJBJ10';
          // this.headerDealCount.edit = 'BJBJ10';
          data.inputDisabled = {
            dealValue: false,
            dealCount: false
          };
          data.gateCode = param.gateCode;
          data.dealType = param.dealType;
          data.status = param.status;
          data.gateName = param.gateName;
          data.dealTypeName = param.dealTypeName;
          data.statusName = param.statusName;
          data.updateName = this.info.APPINFO.USER.name;
          data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
          const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
          Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
        }
      }
    );
 }
}
