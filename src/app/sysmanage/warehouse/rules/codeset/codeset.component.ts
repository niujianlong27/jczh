import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { format } from 'date-fns';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-codeset',
  templateUrl: './codeset.component.html',
  styleUrls: ['./codeset.component.css']
})
export class CodesetComponent implements OnInit {
  public list: any[] = [];
  private listclone: any[] = [];
  public loading: boolean;
  public total = 0;
  private searchParam: any = {};
  public visible: boolean;
  public modalForm: FormGroup;
  public modalFormData: any[] = [];
  public modalTitle: string;
  public buttonId: string;
  public okloading: boolean;
  public codesetCodeArr: any[] = [];
  public isUpdate: boolean;
  private status: any[] = [];
  private tplModal: NzModalRef;
  constructor(private http: HttpClient,
              private modal: NzModalService,
              private info: UserinfoService,
              private fb: FormBuilder,
              private nm: NzModalService,
              ) { }

 ngOnInit(){
  // this.codesetCode();
 }
 // 静态数据获取
 public staticData = (code: string) => new Observable((ob) => {
  let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
  let param: any = {codesetCode: code};
  let key = 'itemCname';
  let value = 'itemCode';
  if (code === 'getCodesetDesc') {
    url = `${environment.baseUrlRzsteelWarehouse}productCodesetDesc/getAll`;
    param = {};
    key = 'codesetDesc';
    value = 'codesetCode';
  }
  this.http.post(url, param).subscribe(
    (res: any) => {
      if (res.code === 100) {
        const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
        if (code === 'product_disp.codeset_status') {
            this.status = [...data];
        } else if (code === 'getCodesetDesc') {
            this.codesetCodeArr = [...data];
        }
        ob.next(data);
      } else {
        ob.error();
      }
    }
  );
 })
 // 获取代码集
  private codesetCode() {
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productCodesetDesc/getAll`,{}).pipe(
      retry(3)
    ).subscribe((res: any) => {
       this.codesetCodeArr = (res.data || []).map((x: any) => ({name: x.codesetDesc, value: x.codesetCode}));
    })
  }
 // 获取列表
  public getData(param: any = {}) {
    this.searchParam = {...param};
    this.loading = true;
     this.http.post(`${environment.baseUrlRzsteelWarehouse}productCodeset/getPage`, param).subscribe(
       (res: any) => {
         this.loading = false;
         if (res.code === 100) {
             this.listclone = [];
             const data = res.data.data || [];
             this.total = res.data.total || 0;
             data.forEach((x: any) => {
                 this.listclone = [...this.listclone, {...x}];
                 x.editstate = 0;
             });
             this.list = [...data];
         }
       }
     );
  }
  // 功能按钮数据
  public btnData(data: any[]) {
    this.isUpdate = data.some(x => x.buttonId === 'Update');
  }
  // 功能按钮
  public click(data: any) {
    this.buttonId = data.buttonId;
     switch (data.buttonId) {
        case 'Add':
          this.add(data);
        break;
        case 'AddCodeset':
          this.add(data);
        break;

     }
  }
  private add(param: any) {
    this.visible = true;
    this.modalTitle = param.buttonName;
    this.modalForm = this.fb.group({});
    if (param.buttonId === 'Add') {
      this.modalFormData = [
        {eName: 'codesetCode', cName: '代码集编码', type: 'text', validators: [Validators.required, (control: AbstractControl) => {
          if (control.value && control.value.length > 64) {
              return {
                message: '代码集编码长度不能大于64位'
              };
          }
          return null;
      }], required: true},
        {eName: 'codesetDesc', cName: '代码集名称', type: 'text', validators: [Validators.required], required: true},
        {eName: 'remark', cName: '备注', type: 'textarea'}
      ];
    } else if (param.buttonId === 'AddCodeset') {
      this.modalFormData = [
        {eName: 'codesetCode', cName: '代码集名称', type: 'select', validators: [Validators.required],
        required: true, data: this.codesetCodeArr},
        {eName: 'itemCode', cName: '代码编码', type: 'text', validators: [Validators.required, (control: AbstractControl) => {
          if (control.value && control.value.length > 64) {
              return {
                message: '代码集编码长度不能大于64位'
              };
          }
          return null;
      }], required: true},
        {eName: 'itemCname', cName: '代码名称', type: 'text', validators: [Validators.required], required: true},
        {eName: 'sortId', cName: '序号', type: 'text', validators: [Validators.required], required: true},
        {eName: 'remark', cName: '备注', type: 'textarea'}
      ]
    }
    this.modalFormData.forEach((x: any) => {
        this.modalForm.addControl(x.eName, new FormControl(null, x.validators));
    });
  }
  public ok() {
    // tslint:disable-next-line: forin
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.status === 'INVALID') { return; }
    const url = this.buttonId === 'Add' ? `${environment.baseUrlRzsteelWarehouse}productCodesetDesc/insert` : `${environment.baseUrlRzsteelWarehouse}productCodeset/insert`;
    this.http.post(url,{...this.modalForm.getRawValue()}).subscribe(
      (res: any) => {
        this.okloading = false;
        if (res.code === 100) {
          // tslint:disable-next-line: no-unused-expression
          this.buttonId === 'AddCodeset' && this.getData(this.searchParam);
          // tslint:disable-next-line: no-unused-expression
          this.buttonId === 'Add' && this.codesetCode();
          this.visible = false;
          this.modal.success({
              nzTitle: '提示信息',
              nzContent: res.msg
          });
        }
      }
    );
  }
  // 修改
  public update(data: any, flag: number) {
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      data.statusName = data.status;
    } else {
      const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
      data.editstate = 0;
      data._setUpdate = false;
    }
  }
  // 保存
 public save(data: any) {
   if (!data.sortId) {
     this.tplModal = this.nm.warning({
       nzTitle: '提示信息',
       nzContent: '请填写序号',
     });
     data.btnloading = false;
     return;
   }
    data.btnloading = true;
    const param = {...data};
    console.log(param);
    param.status = data.statusName;
    const status = this.status.filter((x: any) => x.value === param.status);
    param.statusName = status[0] && status[0].name;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productCodeset/update`,{
      ...param
    }).subscribe((res: any) => {
      data.btnloading = false;
      if (res.code === 100) {
        data.editstate = 0;
        data._setUpdate = false;
        data.status = param.status;
        data.statusName = param.statusName;
        data.updateName = this.info.APPINFO.USER.name;
        data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
        Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
      }
    });
 }
}
