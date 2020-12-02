/**
 * c仓库超时处理没有超时处理
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-park-timeout',
  templateUrl: './park_timeout.component.html',
  styleUrls: ['./park_timeout.component.css']
})
export class ParkTimeoutComponent implements OnInit {
  private isNeedLoadDetail: any[] = [];
  private isQueueName: any[] = [];


  constructor(private http: HttpClient,
    private modal: NzModalService,
    private fb: FormBuilder,
    private info: UserinfoService) { }
  private searchParam: any = {};
  public list: any[] = [];
  private listclone: any[] = [];
  public total = 0;
  public loading: boolean;
  public modalForm: FormGroup;
  public visible: boolean;
  public modalFormData: any[] = [];
  private kind: any[] = [];
  private warehouse: any[] = [];
  /*private dealType: any[] = [];*/
  private status: any[] = [];
  public isUpdate: boolean;
  public okloading: boolean;
  private warehouseCode: string;
  private callTypeArr: any[] = [];
 /* private headerDealValue: any;
  private headerDealCount: any;
  private dealArr: any[] = [
    { eName: 'dealValue', cName: '顺延时长(分)', validators: [Validators.required], require: true, type: 'inputNumber' },
    { eName: 'dealCount', cName: '顺延次数', validators: [Validators.required], require: true, type: 'inputNumber' }
  ];*/
  ngOnInit() {
    this.loading = true;
    window.setTimeout(() => {
      this.getData({page: 1, length: 100});
    }, 1500);
  }
  // 按钮数据返回
  public btnData(data: any[]) {
    this.isUpdate = data.some(x => x.buttonId === 'Update');
  }
  // 静态数据
  public staticData = (code: string) => new Observable((ob) => {
    let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
    let param: any = { codesetCode: code };
    let key = 'itemCname';
    let value = 'itemCode';
    if (code === 'form_queue_product_ware_right') {
      url = `${environment.baseUrlSystem}roleButton/getUserButtons`;
      param = {
        userId: this.info.get('USER').userId,
        formId: code
      };
      key = 'buttonName';
      value = 'buttonId';
  }
  if (code === 'getKindName') {
    url = `${environment.baseUrlRzsteelWarehouse}productMatKind/matAll`;
    param = {};
    key = 'matKindName';
    value = 'matKindCode';
  }
    this.http.post(url, param).subscribe(
      (res: any) => {
        if (res.code === 100) {
          const data = (res.data || []).map((x: any) => ({ name: x[key], value: x[value] }));
          if (code === 'getKindName') { // 分类名称
            this.kind = [...data];
          } else if (code === 'form_queue_product_ware_right') { // 仓库
            this.warehouse = [...data];
            const warehouseCode = this.warehouse.map(x => x.value);
            this.warehouseCode = warehouseCode.join(',');
          } /*else if (code === 'product_disp.dealType') { // 处理方式
            this.dealType = [...data];
          }*/ else if (code === 'product_disp.entryTimeout_status') {
            this.status = [...data];
          } else if ( code === 'product_disp.entryTimeout_callType'){
            this.callTypeArr = [...data];
          } else if (code === 'product_disp.entryTimeout_isNeedLoadDetail') {
            this.isNeedLoadDetail = [...data];
          } else if (code === 'product_disp.entryTimeout_isQueue') {
            this.isQueueName = [...data];
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
    this.searchParam = { ...param };
    this.loading = true;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/getPageProductWarehouse`, {
      ...param,
      warehouseCode: this.warehouseCode
    }).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.code === 100) {
          const list = res.data.data || [];
          this.total = res.data.total;
          this.listclone = [];
          list.forEach((x: any) => {
            this.listclone = [...this.listclone, { ...x }];
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
  };
  // 新增
  private add() {
    this.visible = true;
    this.modalForm = this.fb.group({});
    this.modalFormData = [
      {
        eName: 'kindCode', cName: '分类名称', validators: [Validators.required], require: true, type: 'select',
        data: this.kind
      },
      {
        eName: 'warehouseCode', cName: '仓库', validators: [Validators.required], require: true, type: 'select',
        data: this.warehouse
      },
      { eName: 'timeout', cName: '超时时长(分)', validators: [Validators.required, (control: AbstractControl) => {
        if (control.value < 0) {
          return {message: '超时时长(分)不能为负数'};
        } else if (control.value % 1 !== 0) {
          return {message: '超时时长(分)不能为小数'};
        }
        return null;
    }], require: true, type: 'inputNumber' },
    {
      eName: 'callType', cName: '叫号方式', validators: [Validators.required], require: true, type: 'shortselect',
      data: this.callTypeArr
    },
    { eName: 'inWarehouseCount', cName: '作业最大数', validators: [Validators.required, (control: AbstractControl) => {
      if (control.value < 0) {
        return {message: '作业最大数不能为负数'};
      } else if (control.value % 1 !== 0) {
        return {message: '作业最大数不能为小数'};
      }
      return null;
    }], require: true, type: 'inputNumber' },
    { eName: 'preCallCount', cName: '预叫号数', validators: [Validators.required, (control: AbstractControl) => {
    if (control.value < 0) {
      return {message: '预叫号数不能为负数'};
    } else if (control.value % 1 !== 0) {
      return {message: '预叫号数不能为小数'};
    }
    return null;
    }], require: true, type: 'inputNumber' },
      {
        eName: 'isNeedLoadDetail', cName: '是否需要装车明细', validators: [Validators.required], require: true, type: 'select',
        data: this.isNeedLoadDetail
      }, {
        eName: 'isQueue', cName: '是否允许签到', validators: [Validators.required], require: true, type: 'select',
        data: this.isQueueName
      },
    { eName: 'queueDelay', cName: '排队延迟时间(分)', validators: [ (control: AbstractControl) => {
      if (control.value < 0) {
        return {message: '排队延迟时间(分)不能为负数'};
      } else if (control.value % 1 !== 0) {
       return {message: '排队延迟时间(分)不能为小数'};
   }
    return null;
  }], require: false, type: 'inputNumber' }
     /* {
        eName: 'dealType', cName: '超时处理方式', validators: [Validators.required], require: true, type: 'select',
        data: this.dealType
      }*/
    ];
    this.modalFormData.forEach((x: any) => {
      this.modalForm.addControl(x.eName, new FormControl(null, x.validators));
    });
  }
  // selectChange
  public selectChange(data: any) {
   /* if (data.eName === 'dealType') {
      if (this.modalForm.get('dealType').value === 'product_disp_dealType_addMinutes') {
        this.modalFormData = [...this.modalFormData, ...this.dealArr];
        this.dealArr.forEach((x: any) => {
          this.modalForm.addControl(x.eName, new FormControl(null, x.validators))
        })
      } else {
        this.modalFormData = this.modalFormData.filter((x: any) => x.eName !== 'dealValue' && x.eName !== 'dealCount');
        console.log(this.modalFormData);
        this.modalForm.get('dealValue') && this.modalForm.removeControl('dealValue');
        this.modalForm.get('dealCount') && this.modalForm.removeControl('dealCount');
      }
    }*/
  }
  // 删除  单条操作
  private delete() {
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
        this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/deleteProductWarehouse`,
        { rowid: data[0] && data[0].rowid }).subscribe(
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
    // debugger;
    // tslint:disable-next-line: forin
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();

    }
    if (this.modalForm.status === 'INVALID') { return; }
    this.okloading = true;
    const param: any = {};
    const d = { ...this.modalForm.getRawValue()};
    console.log(d);
    if (Number(d.timeout) > 9999999999) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的超时时长字段超长了，请重新输入!'
      });
      return ;
    }
    if (Number(d.inWarehouseCount) > 9999999999) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的作业最大数超长了，请重新输入!'
      });
      return ;
    }
    if (Number(d.preCallCount) > 9999999999) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的预叫号数超长了，请重新输入!'
      });
      return ;
    }
    if (Number(d.queueDelay) > 9999999999) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的排队延时时间超长了，请重新输入!'
      });
      return ;
    }
    const kindName = this.kind.filter((x: any) => x.value === this.modalForm.get('kindCode').value);
    const warehouseName = this.warehouse.filter((x: any) => x.value === this.modalForm.get('warehouseCode').value);
    param.kindName = kindName[0] && kindName[0].name;
    param.warehouseName = warehouseName[0] && warehouseName[0].name;

    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/insertProductWarehouse`,
      {
        ...this.modalForm.getRawValue(),
        ...param
      }).subscribe((res: any) => {
        this.okloading = false;
        if (res.code === 100) {
          this.modal.success({
            nzTitle: '提示信息',
            nzContent: res.msg
          });
          this.visible = false;
          this.getData(this.searchParam);
        }
      });
  }
  // b表头
  public columns(header: any) {
   /* this.headerDealCount = header.filter((x: any) => x.colEname === 'dealCount')[0] || {};
    this.headerDealValue = header.filter((x: any) => x.colEname === 'dealValue')[0] || {};*/
  }
  // 处理方式改变
  public modalChange(data: any) {
   /* if (data.header && data.header.colEname === 'dealTypeName') {
      if (data.val === 'product_disp_dealType_addMinutes') {
        this.headerDealValue.edit = 'BJBJ10';
        this.headerDealCount.edit = 'BJBJ10';
      } else {
        this.headerDealValue.edit = 'BJBJ20';
        this.headerDealCount.edit = 'BJBJ20';
        const d = this.listclone.filter((x: any) => x.rowid === (data.data && data.data.rowid));
        if (data.data) {
          data.data.dealValue = d[0] && d[0].dealValue;
          data.data.dealCount = d[0] && d[0].dealCount;
        }
      }
    }*/
  }
  // 修改
  public update(data: any, flag: number) {
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      data.warehouseName = data.warehouseCode;
    /*  data.dealTypeName = data.dealType;*/
      data.statusName = data.status;
      data.callTypeName = data.callType;
      data.isNeedLoadDetailName = data.isNeedLoadDetail;
      data.isQueueName = data.isQueue;
     /* if (data.dealType !== 'product_disp_dealType_addMinutes') {
        this.headerDealValue.edit = 'BJBJ20';
        this.headerDealCount.edit = 'BJBJ20';
      }*/
    } else {
      const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
      data.editstate = 0;
      data._setUpdate = false;
     /* this.headerDealValue.edit = 'BJBJ10';
      this.headerDealCount.edit = 'BJBJ10';*/
    }
  };
  // 保存
  public save(data: any) {
    // debugger;
    console.log(data);
    // tslint:disable-next-line:max-line-length
    if (!data.warehouseName || !data.statusName  || data.timeout === null) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '仓库、状态、超时时长为必填项!'
      })
      return;
    }
    if (data.timeout % 1 !== 0) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '超时时长不能为小数!'
      });
      return ;
    }
    if (data.timeout < 0) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '超时时长不能为负数!'
      });
      return ;
    }
    if (!data.isQueueName){
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '是否允许签到为必填项'
      });
      return ;
    }
    if (!data.isNeedLoadDetailName) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '是否需要装车明细为必填项!'
      });
      return ;
    }
    // --------
    if (data.timeout.length > 10) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的超时时长超长了，请重新输入!'
      });
      return ;
    }
    if (data.inWarehouseCount.length > 10) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的作业最大数超长了，请重新输入!'
      });
      return ;
    }
    if (data.preCallCount.length > 10) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的预叫号数超长了，请重新输入!'
      });
      return ;
    }
    if (data.queueDelay.length > 10) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的排队延时时间超长了，请重新输入'
      });
      return ;
    }
  /*  if (data.dealTypeName === 'product_disp_dealType_addMinutes' && ((!data.dealValue && data.dealValue !== 0)
  || (!data.dealCount && data.dealCount !== 0))) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '顺延次数、顺延时长为必填项!'
      })
      return;
    }*/
    data.btnloading = true;
    const param = {...data};
    param.isQueue = param.isQueueName;
    param.isNeedLoadDetail = param.isNeedLoadDetailName;
    console.log(param);
    const warehouseName = this.warehouse.filter((x: any) => x.value === data.warehouseName);
    const statusName = this.status.filter((x: any) => x.value === data.statusName);
    const callTypeName = this.callTypeArr.filter((x: any) => x.value === data.callTypeName);
   /* const dealTypeName = this.dealType.filter((x: any) => x.value === data.dealTypeName);*/
    const isNeedLoadDetailName = this.isNeedLoadDetail.filter((x: any) => x.value === param.isNeedLoadDetail );
    const isQueueName = this.isQueueName.filter((x: any) => x.value === param.isQueue );
   param.warehouseCode = data.warehouseName;
  /*  data.dealType = data.dealTypeName;*/
  param.status = data.statusName;
  param.callType = data.callTypeName;
  param.callTypeName = callTypeName[0] && callTypeName[0].name;
  param.warehouseName = warehouseName[0] && warehouseName[0].name;
  param.isNeedLoadDetailName = isNeedLoadDetailName[0] && isNeedLoadDetailName[0].name;
  param.isQueueName = isQueueName[0] && isQueueName[0].name;
  console.log(param.isNeedLoadDetailName);
   /* data.dealTypeName = dealTypeName[0] && dealTypeName[0].name;*/
   param.statusName = statusName[0] && statusName[0].name;
    this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryTimeout/updateProductWarehouse`, param).subscribe(
      (res: any) => {
        console.log(res);
        data.btnloading = false;
        if (res.code === 100) {
          data.editstate = 0;
          data._setUpdate = false;
          data.warehouseCode = param.warehouseCode;
          data.status = param.status;
          data.callType = param.callType;
          data.callTypeName = param.callTypeName;
          data.warehouseName = param.warehouseName;
          data.statusName = param.statusName;
          data.isQueueName = param.isQueueName;
          data.isNeedLoadDetailName = param.isNeedLoadDetailName;
          data.updateName = this.info.APPINFO.USER.name;
          data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
          const d = this.listclone.filter((x: any) => x.rowid === data.rowid);
          Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
        }
      }
    );
  }
}
