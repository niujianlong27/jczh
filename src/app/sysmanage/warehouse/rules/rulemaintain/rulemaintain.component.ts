import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import {HttpUtilService} from '@service/http-util.service';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
import { format } from 'date-fns';
// import {WAREHOUSEURL} from '@model/warehouseUrl';
@Component({
  selector: 'app-rulemaintain',
  templateUrl: './rulemaintain.component.html',
  styleUrls: ['./rulemaintain.component.css']
})
export class RulemaintainComponent implements OnInit {

  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';
  carNum: Number = 0; // 页面序号
  tabs: Array<any> = []; // 页面数组
  public isUpdate: boolean[] = []; // 是否有修改的权限
  public modalForm: FormGroup;
  public modalFormData: any[] = [];
  public modalVisible: boolean; // 弹窗显示隐藏
  public dataSetSource: any[] = []; // 保存初始的数据
  public tempSearchParam: any = {};
  public modalTitle: string;
  public okloading: boolean;
  private kindArr = [];
  private warehouseArr = [];
  private gateArr = [];
  private queueClass = [];
  private ruleStatus = [];
  private searchParam = []; // 查询数据集
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
     this.listSearch({}, 1);
  }
  // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
   this.getStatic(code, observe);
})
private getStatic(code: string, ob?: any){
  let url = `${environment.baseUrlRzsteelWarehouse}productCodeset/getAll`;
  let param: any = {codesetCode: code};
  let key = 'itemCname';
  let value = 'itemCode';
  if (code === 'getKindName') {
      url = `${environment.baseUrlRzsteelWarehouse}productMatKind/matAll`;
      param = {};
      key = 'matKindName';
      value = 'matKindCode';
  } else if (code === 'form_queue_product_ware_right') {
      url = `${environment.baseUrlSystem}roleButton/getUserButtons`;
      param = {formId: code, userId: this.info.get('USER').userId};
      key = 'buttonName';
      value = 'buttonId';
  } else if (code === 'product_disp.gate') {
    param.status = 'product_disp.codeset_status_10';
  }
  this.http.post(url, param).subscribe(
    (res: any) => {
      if (res.code === 100) {
          const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
          if (code === 'product_disp.queueClass') { // 排队优先级
               this.queueClass = [...data];
          } else if (code === 'product_disp.ruleStatus') { // 状态
               this.ruleStatus = [...data];
          } else if (code === 'getKindName') { // 分类名称
               this.kindArr = [...data];
          } else if (code === 'form_queue_product_ware_right') { //仓库名称
               this.warehouseArr = [...data];
               const warehouseCode = this.warehouseArr.map(x => x.value);
               this.warehouseCode = warehouseCode.join(',');
          } else if (code === 'product_disp.gate') { // 可入厂大门
               this.gateArr = [...data];
          }
         // tslint:disable-next-line: no-unused-expression
         ob && ob.next(data);
      } else {
         // tslint:disable-next-line: no-unused-expression
         ob && ob.error();
      }
    }
  );
}
  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any, ruleType: number) {
    data.page = data.page || 1;
    data.length = data.length || 100;
    data.ruleType = ruleType;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  public getList (data: any): void {
     this.dataSet = [];
     this.loading = true;
     this.tempSearchParam = data;
     const param =  data.ruleType == 2 ? {warehouseCode: this.warehouseCode} : {};
     this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryRule/getRecords`, { ...data,
    ...param}).subscribe(
       (res: any) => {
             if (res.code === 100) {
               this.loading = false;
               this.updateData = [];
               const dataSet = res.data.data || [];
               this.totalPage = res.data.total || 0;
               dataSet.forEach((x: any) => {
                   this.dataSetSource = [...this.dataSetSource, {...x}];
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
  // 查询数据返回
public searchData(data: any) {
    this.searchParam = [...this.searchParam, ...data];
}
// 按钮数据返回
public btnData(data: any[], index: number) {
   this.isUpdate[index] = data.some(x => x.buttonId === 'Update');
}
  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any, tab: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.modalVisible = true;
        this.add(tab);
        break;
      case 'Delete':
         this.del();
    }
  }
  // 删除
  private del() {
    if (this.updateData.length < 1) {
      this.modal.error({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作'
      });
      return;
    }
    this.modal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要将选中的数据进行删除操作?',
      nzOnOk: () =>  new Promise((resolve, reject) => {
         this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryRule/delete`, {rowid: this.updateData[0].rowid}).subscribe(
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
  // 修改
  public update(data: any, flag: number) {
    if (flag === 1) {
      data.editstate = 1;
      data._setUpdate = true;
      data.statusName = data.status;
      data.queueClassName = data.queueClass;
    } else {
      const d = this.dataSetSource.filter((x: any) => x.rowid === data.rowid);
      Object.keys(data).forEach(x => data[x] = d[0][x]);
      data.editstate = 0;
      data._setUpdate = false;
    }
  }
  // 保存
  public save(data: any) {
     data.btnloading = true;
     this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryRule/update`, {
       rowid: data.rowid,
       ruleType: data.ruleType,
       status: data.statusName,
       queueClass: data.queueClassName
     }).subscribe(
       (res: any) => {
         data.btnloading = false;
         if (res.code === 100) {
           data.editstate = 0;
           data._setUpdate = false;
           data.status = data.statusName;
           data.queueClass = data.queueClassName;
           const statusName = this.ruleStatus.filter((x: any) => x.value === data.status);
           const queueClass = this.queueClass.filter((x: any) => x.value === data.queueClass);
           data.statusName = statusName[0] && statusName[0].name;
           data.queueClassName = queueClass[0] && queueClass[0].name;
           data.updateName = this.info.APPINFO.USER.name;
           data.updateDate = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
           const d = this.dataSetSource.filter((x: any) => x.rowid === data.rowid);
           Object.keys(d[0]).forEach(x => d[0][x] = data[x]);
         }
       }
     );
  }
  // 新增
  private add (tab: any) {
    this.okloading = false;
    this.modalForm = this.fb.group({});
      if (1 == this.tempSearchParam.ruleType) {
        this.modalTitle = '品种优先级设置新增';
        this.modalFormData = [
          {eName: 'kindCode', cName: '分类名称', validator: [Validators.required], type: 'select',
           data: this.kindArr},
          {eName: 'queueClass', cName: '排队优先级', validator: [Validators.required], type: 'select',
           data: this.queueClass}
          ]
      } else if (2 == this.tempSearchParam.ruleType) {
        this.modalTitle = '仓库可入厂大门新增';
        this.modalFormData = [
          {eName: 'warehouseCode', cName: '仓库名称', validator: [Validators.required], type: 'select',
           data: this.warehouseArr},
          {eName: 'gateCode', cName: '可入厂大门', validator: [Validators.required], type: 'select',
           data: this.gateArr}
        ]
      }
      this.modalFormData.forEach( x => {
        this.modalForm.addControl(x.eName, new FormControl(null, x.validator));
      });
  }
  // 弹窗确定
  public ok(){
      // tslint:disable-next-line: forin
      for (const i in this.modalForm.controls){
          this.modalForm.controls[i].markAsDirty();
          this.modalForm.controls[i].updateValueAndValidity();
      }
      if (this.modalForm.status === 'INVALID') { return; }
      const param = {...this.modalForm.value};
      if (1 == this.tempSearchParam.ruleType) {
           const kindName = this.kindArr.filter((x: any) => x.value === this.modalForm.get('kindCode').value)
           param.kindName = kindName[0] && kindName[0].name;
           console.log(kindName);
      } else if (2 == this.tempSearchParam.ruleType) {
           const warehouseName = this.warehouseArr.filter((x: any) => x.value === this.modalForm.get('warehouseCode').value)
           param.warehouseName = warehouseName[0] && warehouseName[0].name;
           const gateName = this.gateArr.filter((x: any) => x.value === this.modalForm.get('gateCode').value)
           param.gateName = gateName[0] && gateName[0].name;
      }
      this.okloading = true;
      param.ruleType = this.tempSearchParam.ruleType;
      this.http.post(`${environment.baseUrlRzsteelWarehouse}productEntryRule/insert`, param).subscribe(
        (res: any) => {
          this.okloading = false;
          if (res.code === 100) {
              this.modal.success({
                nzTitle: '提示信息',
                nzContent: res.msg
              });
              this.getList(this.tempSearchParam);
              this.modalVisible = false;
          }
        }
      );
  }
    // 获取表头
  getTabs(): void {
      this.tabs.push({ itemCname: '品种优先级设置', itemCode: 'PZYXJ', formId: 'form_queue_product_rulemaintain0', ruleType: 1 });
      this.tabs.push({ itemCname: '仓库可入厂大门', itemCode: 'PZKRCDM', formId: 'form_queue_product_rulemaintain1' , ruleType: 2});
  }

  // tab切换
  selectChange(data: any) {
    window.setTimeout(() => {
      this.tempSearchParam = {};
      this.searchParam.forEach((x: any) => {
        x.checkBox = false;
        x.value1 = null;
        x.value2 = null;
      });
      this.listSearch(this.tempSearchParam,data.ruleType);
   //   if (this.tempSearchParam.ruleType == 2) this.getStatic('product_disp.gate'); //可入厂大门值集获取
    });
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.tempSearchParam = [];
    this.dataSet = [];
    this.updateData = [];
  }
}
