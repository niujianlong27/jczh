import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import { environment } from '@env/environment';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserinfoService } from '@service/userinfo-service.service';
import { NzModalService } from 'ng-zorro-antd';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-messagemanage',
  templateUrl: './messagemanage.component.html',
  styleUrls: ['./messagemanage.component.css']
})
export class MessagemanageComponent implements OnInit {

  dataSet: any = []; // 结果集
  public dataSetClone: any[] = [];
  loading: any; // 页面查询加载
  totalPage: any; // 总页数
  tempSearchParam: any = {}; // 保存查询数据
  updateData: Array<any> = []; // 选中的数据
  InsertFormVisible = false; // 新增弹框
  modalValidateForm: FormGroup; // 新增代码集弹窗
  modalFormData: Array<any> = []; // form数据
  isOkLoading = false; // 新增弹框loading
  currentDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss'); // 当前时间
  matArr: Array<any> = []; // 物料数组
  queueStatusArr: Array<any> = []; // 排队状态数组
  param: any;
  messageTypeArr: any[] = []; // 消息类型
  public isUpdate: boolean;
 // private isEdit: any = {};
  constructor(private fb: FormBuilder,
     private modal: NzModalService,
     private http: HttpClient,
     private info: UserinfoService) {
  }

  ngOnInit() {
  }
   // 按钮数据返回
public btnData(data: any[]) {
  this.isUpdate = data.some(x => x.buttonId === 'Update');
}
  // 弹窗哪种数据
  private modalForm(flag: number): any[] {
        // 公告弹框
    const  modalFormData1: Array<any> = [
        {
          name: '消息类型', eName: 'messageType', type: 'select', require: true,
          allowclear: true,
          value: 'product_disp_messageType_1',
          data: this.messageTypeArr,
          validators: [Validators.required]
        },
        {
          name: '消息标题', eName: 'title', type: 'text', require: true,
          value: null,
          validators: [Validators.required]
        },
        {
          name: '消息内容', eName: 'body', type: 'textarea', require: true,
          value: null,
          validators: [Validators.required]
        }
      ];
      // 群发弹框
     const modalFormData2: Array<any> = [
        {
          name: '消息类型', eName: 'messageType', type: 'select', require: true,
          allowclear: true,
          value: 'product_disp_messageType_1',
          data: this.messageTypeArr,
          validators: [Validators.required]
        },
        {
          name: '消息标题', eName: 'title', type: 'text', require: true,
          value: null,
          validators: [Validators.required]
        },
        {
          name: '消息内容', eName: 'body', type: 'textarea', require: true,
          value: null,
          validators: [Validators.required]
        },
        {
          name: '开始时间', eName: 'startTime', type: 'date', require: true,
          value: null,
          error: '开始时间不能大于结束时间',
          validators: [Validators.required, (control: AbstractControl) => {
              if (control.value) {
                if (this.modalValidateForm.get('endTime') && this.modalValidateForm.get('endTime').value) {
                  return Date.parse(control.value) > Date.parse(this.modalValidateForm.get('endTime').value) ?
                   {message: '开始时间不能大于结束时间'} : null;
                }
                return null;
              }
              return null;
          }]
        },
        {
          name: '结束时间', eName: 'endTime', type: 'date', require: true,
          value: null,
          error: '结束时间不能小于开始时间',
          validators: [Validators.required, (control: AbstractControl) => {
            if (control.value) {
              if (this.modalValidateForm.get('startTime') && this.modalValidateForm.get('startTime').value) {
                return Date.parse(control.value) < Date.parse(this.modalValidateForm.get('startTime').value) ?
                 {message: '结束时间不能小于开始时间'} : null;
              }
              return null;
            }
            return null;
        }]
        },
        {
          name: '品种', eName: 'kindCode', type: 'select', require: true,
          value: null,
          data: this.matArr,
          validators: [Validators.required]
        },
        {
          name: '排队状态', eName: 'queueStatus', type: 'select', require: true,
          value: null,
          data: this.queueStatusArr,
          validators: [Validators.required]
        },
        {
          name: '间隔时间', eName: 'timeInterval', type: 'inputNumber', require: true,
          value: null,
          error: '间隔时间不能等于0',
          validators: [Validators.required, (control: AbstractControl) => {
              if (control.value === 0) {
                return {message: '间隔时间不能等于0'};
              }
              return null;
          }]
        },
        {
          name: '提示次数', eName: 'maxCount', type: 'inputNumber', require: true,
          value: null,
          error: '提示次数不能等于0且为整数',
          validators: [Validators.required, (control: AbstractControl) => {
              if (control.value === 0 || control.value % 1 !== 0) {
                return {message: '提示次数不能等于0且为整数'};
              }
              return null;
          }]
        }
      ];
      // 通知弹框
     const modalFormData3: Array<any> = [
        {
          name: '消息类型', eName: 'messageType', type: 'select', require: true,
          allowclear: true,
          value: 'product_disp_messageType_1',
          data: this.messageTypeArr,
          validators: [Validators.required]
        },
        {
          name: '消息标题', eName: 'title', type: 'text', require: true,
          value: null,
          validators: [Validators.required]
        },
        {
          name: '消息内容', eName: 'body', type: 'textarea', require: true,
          value: null,
          validators: [Validators.required]
        },
        {
          name: '接收人手机', eName: 'receiver', type: 'text', error: '手机号码格式不正确', require: true,
          value: null,
          validators: [Validators.required, Validators.pattern('^1\\d{10}$')] 
        }
      ];
      return flag === 1 ? modalFormData1 : flag === 2 ? modalFormData2 : modalFormData3;
  }
  /**
   * 获取静态数据
   * @param data
   * @param valueSetCode
   */
    public staticData = (code: string) => new Observable((ob) => {
      let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
      let param: any = { codesetCode: code };
      let key = 'itemCname';
      let value = 'itemCode';
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
            if (code === 'product_disp.mesQueueStatus') {
               this.queueStatusArr = [...data];
            } else if (code === 'product_disp.messageType') {
               this.messageTypeArr = [...data];
            } else if (code === 'getKindName') {
              this.matArr = [...data];
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

   /**
   * 获取主列表方法
   * @param data
   */
  public getList(data: any): void {
    const url = WAREHOUSEURL.MESSAGEGETRECORDS;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).subscribe((res: any) => {
      if (res.code === 100) {
        this.loading = false;
        this.updateData = [];
        this.dataSetClone = [];
        const dataSet = res.data && res.data.data || [];
        this.totalPage = res.data && res.data.total || 0;
        dataSet.forEach((x: any) => {
          this.dataSetClone = [...this.dataSetClone, {...x}];
          x.editstate = 0;
        });
        this.dataSet = [...dataSet];
      }
    });
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {  // 通知没有修改 当然也没有保存按钮
    this.updateData = data;
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'Add' :
        this.add();
        break;
      case 'Delete':
        this.deleteBtn();
        break;
    }
  }

// 新增
private add(){
  this.modalValidateForm = this.fb.group({});
  this.modalFormData = this.modalForm(1); // 初始化第一个tab页
  this.modalFormData.forEach((x: any) => {
    this.modalValidateForm.addControl(x.eName, new FormControl(x.value, x.validators))
  })
  this.InsertFormVisible = true;
}
// 弹窗选择
public selectChange(data: any) {
  if (data.eName === 'messageType') {
       switch(this.modalValidateForm.get('messageType').value) {
          case 'product_disp_messageType_1':
            this.modalFormData = this.modalForm(1);
            break;
          case 'product_disp_messageType_2':
            this.modalFormData = this.modalForm(2);
            break;
          case 'product_disp_messageType_3':
            this.modalFormData = this.modalForm(3);
            break;
       }
       this.modalControl(this.modalFormData);
  }
}
// 弹窗控制器
private modalControl(data: any[]) {
     // tslint:disable-next-line: forin
     for (const i in this.modalValidateForm.controls) {
          const bool = data.some((x: any) => x.eName === i);
          if (!bool) {
            this.modalValidateForm.removeControl(i);
          }
     }
     data.forEach((x: any) => {
       if (!this.modalValidateForm.get(x.eName)) {
         this.modalValidateForm.addControl(x.eName, new FormControl(x.value, x.validators));
       }
     });
}
  /**
   * 新增方法
   * 不需要参数
   */
  handleOk() {
    // tslint:disable-next-line: forin
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status === 'INVALID') {
      return;
    }
    const param: any = {};
    let url = WAREHOUSEURL.MESSAGESEND;
    param.sender = this.info.APPINFO.USER.name;
    if (this.modalValidateForm.get('messageType').value === 'product_disp_messageType_1') {
      url = WAREHOUSEURL.MESSAGEINSERT;
    }
    if (this.modalValidateForm.get('startTime')) {
       param.startTime =  format(this.modalValidateForm.get('startTime').value, 'YYYY-MM-DD HH:mm:ss');
    }
    if (this.modalValidateForm.get('endTime')) {
      param.startTime =  format(this.modalValidateForm.get('endTime').value, 'YYYY-MM-DD HH:mm:ss');
   }
   if (this.modalValidateForm.get('kindCode')) {
      const kindName = this.matArr.filter((x: any) => x.value === this.modalValidateForm.get('kindCode').value);
      param.kindName = kindName[0] && kindName[0].name;
   }
   this.isOkLoading = true;
   this.http.post(url, {...this.modalValidateForm.getRawValue(), ...param}).subscribe(
     (res: any) => {
       this.isOkLoading = false;
       if (res.code === 100) {
          this.modal.success({
            nzTitle: '提示信息',
            nzContent: res.msg
          });
          this.InsertFormVisible = false;
          this.getList(this.tempSearchParam);
       }
     }
   );
  }

  /**
   * 删除按钮
   */
  private deleteBtn() {

    if (this.updateData.length !== 1) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行删除操作'
      })
      return;
    }
    this.modal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要将选中的数据进行删除操作?',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.http.post(WAREHOUSEURL.MESSAGEDELETE, {rowid: this.updateData[0] && this.updateData[0].rowid}).subscribe(
          (res: any) => {
              if (res.code === 100) {
                 this.modal.success({
                   nzTitle: '提示信息',
                   nzContent: res.msg
                 });
                 this.getList(this.tempSearchParam);
                 resolve();
              } else {
                reject();
              }
          }
        );
      })
    });
  }
  // 表头
  public columns(data: any) {
     // this.isEdit.startTime = data.filter((x: any) => x.colEname === 'startTime')[0] || {};
    //  this.isEdit.endTime = data.filter((x: any) => x.colEname === 'endTime')[0] || {};
   //   this.isEdit.kindName = data.filter((x: any) => x.colEname === 'kindName')[0] || {};
   //   this.isEdit.queueStatusName = data.filter((x: any) => x.colEname === 'queueStatusName')[0] || {};
   //   this.isEdit.timeInterval = data.filter((x: any) => x.colEname === 'timeInterval')[0] || {};
   //   this.isEdit.maxCount = data.filter((x: any) => x.colEname === 'maxCount')[0] || {};
  }
  // 修改
  public update(data: any, flag: number){
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      if (data.messageType === 'product_disp_messageType_1') {
       // Object.keys(this.isEdit).forEach((x: any) => this.isEdit[x].edit = 'BJBJ20');
       data.inputDisabled = {
         startTime: true,
         endTime: true,
         kindName: true,
         queueStatusName: true,
         timeInterval: true,
         maxCount: true
       };
      } else if (data.messageType === 'product_disp_messageType_2') {
         data.kindName = data.kindCode;
         data.queueStatusName = data.queueStatus;
      }
    } else {
      const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
     // Object.keys(this.isEdit).forEach((x: any) => this.isEdit[x].edit = 'BJBJ10');
     data.inputDisabled = {
      startTime: false,
      endTime: false,
      kindName: false,
      queueStatusName: false,
      timeInterval: false,
      maxCount: false
    };
      data.editstate = 0;
      data._setUpdate = false;
    }
  }
   // 保存
   public save(data: any) {
      let param = {...data};
      if (data.messageType === 'product_disp_messageType_1') {
        if (!data.title || !data.body) {
          this.modal.error({
            nzTitle: '提示信息',
            nzContent: '消息标题、消息内容为必填项!'
          });
          return;
        }
      } else if (data.messageType === 'product_disp_messageType_2') {
          if (!data.title || !data.body || !data.startTime || !data.endTime ||
             !data.kindName || !data.queueStatusName || !data.timeInterval || data.timeInterval <= 0 ||
              !data.maxCount || data.maxCount <= 0 || (data.maxCount && data.maxCount % 1 !== 0)) {
                this.modal.error({
                  nzTitle: '提示信息',
                  nzContent: `消息标题、消息内容、开始时间、结束时间、品种、排队状态、间隔时间、次数为必填项
                  且间隔时间和次数不能小于等于0、次数必须为整数!`
                });
                return;
              }
          if (Date.parse(data.startTime) > Date.parse(data.endTime)) {
            this.modal.error({
              nzTitle: '提示信息',
              nzContent: '开始时间不能大于结束时间!'
            });
            return;
          }
          param.kindCode = data.kindName;
          param.queueStatus = data.queueStatusName;
          const kindName = this.matArr.filter((x: any) => x.value === param.kindCode);
          const queueStatusName = this.queueStatusArr.filter((x: any) => x.value === param.queueStatus);
          param.kindName = kindName[0] && kindName[0].name;
          param.queueStatusName = queueStatusName[0] && queueStatusName[0].name;
          param = {...data};
          param.startTime = format(data.startTime, 'YYYY-MM-DD HH:mm:ss');
          param.endTime = format(data.endTime, 'YYYY-MM-DD HH:mm:ss');
      }
      data.btnloading = true;
      this.http.post(WAREHOUSEURL.MESSAGEUPDATE, {...param}).subscribe(
        (res: any) => {
          data.btnloading = false;
          if (res.code === 100) {
            this.modal.success({
              nzTitle: '提示信息',
              nzContent: res.msg
            });
            data.startTime = param.startTime;
            data.endTime = param.endTime;
            data.kindCode = param.kindCode;
            data.kindName = param.kindName;
            data.queueStatus = param.queueStatus;
            data.queueStatusName = param.queueStatusName;
            data.updateName = this.info.APPINFO.USER.name;
            data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
            const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
            Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
           // Object.keys(this.isEdit).forEach((x: any) => this.isEdit[x].edit = 'BJBJ10');
           data.inputDisabled = {
            startTime: false,
            endTime: false,
            kindName: false,
            queueStatusName: false,
            timeInterval: false,
            maxCount: false
          };
            data.editstate = 0;
            data._setUpdate = false;
          }
        }
      );
   }
}
