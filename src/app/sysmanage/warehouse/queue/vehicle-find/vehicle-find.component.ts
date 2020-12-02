import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { format} from 'date-fns';
import { Utils } from '@util/utils';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-vehicle-find',
  templateUrl: './vehicle-find.component.html',
  styleUrls: ['./vehicle-find.component.css']
})
export class VehicleFindComponent implements OnInit {
  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  tempSearchParam: any = {}; // 保存查询数据
  tplModal: NzModalRef; // 操作成功后弹窗属性
  tempUpdateParam: any = {}; // 修改参数保存
  public dataSetClone: any[] = [];
  public isUpdate: boolean;
  public visible: boolean;
  public modalForm: FormGroup;
  public modalLoading: boolean;
  public saveLoading: boolean;
  kindArr: Array<any> = []; // 品种数组
  warehouseCodeArr: Array<any> = [];
  warehouseArr: Array<any> = [] ; // 仓库数组
  @ViewChild('addWeight') addWeight: ElementRef; // 调度调整量
  constructor(
    private http: HttpClient,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private info: UserinfoService
  ) {
  }

  ngOnInit() {
      this.modalForm = this.fb.group({
        matCode: [null, [Validators.required]],
        matName: [null],
        warehouseCode: [null, [Validators.required]],
        warehouseName: [null],
        planDate: [null, [Validators.required]],
        planWeight: [null, [Validators.required]]
      })
      this.getWarehouse();
  }

   /**
   * 获取仓库
   */
  getWarehouse() {
    this.http.post( `${environment.baseUrlSystem}roleButton/getUserButtons`, {'userId' : this.info.get('USER').userId , 'formId':'form_queue_product_ware_right'}).subscribe(
      (res: any) => {
        console.log(res);
        if (res.code === 100) {
          res.data.map(x => {
            this.warehouseCodeArr.push('"' + x.buttonId + '"');
          });
            this.tempSearchParam.warehouseCode = this.warehouseCodeArr.join(',');
        }
      }
    );
  }

    // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code, observe);
})
private getStatic(code: string, ob?: any){
  let url = WAREHOUSEURL.GETALLCODESETS;
  let param:any = {codesetCode: code};
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
  } else if (code === 'product_disp.matkind') {
    url = WAREHOUSEURL.GETALLMAT;
    param = {};
    key = 'matKindName';
    value = 'matKindCode';
  }
 this.http.post(url, param).subscribe(
   (res: any) => {
     if (res.code === 100) {
         const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
         ob && ob.next(data);
     } else {
        ob && ob.error();
     }
   }
 )
}

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length;
    const param = Utils.deepCopy(data);
    if (param.queryParameterList) {
      const planDate = param.queryParameterList.filter(x => x.parameter === 'planDate');
      if (planDate[0] && planDate[0].format === 'yyyy-MM-dd') {
          planDate[0].value1 = format(planDate[0].value1, 'YYYY-MM-DD');
          planDate[0].value2 =  planDate[0].value1;
      }
    }
    param.warehouseCode = this.tempSearchParam.warehouseCode;
    this.getList(param);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any = {}): void {
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    // this.updateFlage = false;
    this.http.post(WAREHOUSEURL.PRODUCTFACTORYGET, data).subscribe((res: any) => {
      this.loading = false;
      if (res.code === 100) {
        this.updateData = [];
        this.dataSetClone = [];
        const dataSet = res.data && res.data.data || [];
        this.totalPage = res.data && res.data.total || 0;
        this.dataSet = [...dataSet];
        this.dataSet.map((x) => (x.editstate = 0));
        this.dataSet.map((x) => (x.actpalnWeight = Number(x.planWeight) + Number(x.addWeight)));
        this.dataSet.forEach(x => {x.selectShow = false; });
        dataSet.forEach((x: any) => {
          this.dataSetClone = [...this.dataSetClone, {...x}];
          x.editstate = 0;
        });
      }
    });
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
    switch (data.buttonId) {
      case 'Delete':
        this.delete();
        break;
    }
  }

  inputFormat = (val: string | number) => {
    if (val === '' || val === null || val === undefined) {
          return 0;
    }
    return val;
  }
  
  nzParser  = (val: string | number) => {
    if (val === '' || val === null || val === undefined) {
          return 0;
    }
    return val;
  }

  /**
   *取消保存
   */
  cancelUpdate(data: any) {
    const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
    Object.keys(data).forEach(x => data[x] = d[0][x]);
    data.editstate = 0;
    data.selectShow = false;
    data._setUpdate = false;
  }

  // 删除
  private delete(){
    if (this.updateData.length  === 0 ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选择至少一条数据进行修改'
      });
      return;
    }
    const param = this.updateData.map(x => ({rowid: x.rowid}));
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要将选中的数据进行删除操作?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.PRODUCTFACTORYSDEL, param).subscribe(
           (res: any) => {
             if (res.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: res.msg
                 })
             } else {
               reject();
             }
           }
         )
      })
    })
  }
 // 弹窗确定
 modalOk() {
    for (const i in this.modalForm.controls) {
        this.modalForm.controls[i].markAsDirty();
        this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.status === 'INVALID') return;
    this.modalLoading = true;
    this.modalForm.get('kindName').setValue('1212');
    this.modalForm.get('warehouseName').setValue('trtr');
    const param = {...this.modalForm.value};
    param.planDate = format(this.modalForm.get('planDate').value, 'YYYY-MM-DD')
    this.http.post(WAREHOUSEURL.PRODUCTEFACTORYINS, param).subscribe(
      (res: any) => {
        this.modalLoading = false;
         if (res.code === 100) {
              this.tempSearchParam.page = 1;
              this.getList(this.tempSearchParam);
              this.visible = false;
              this.nm.success({
                nzTitle: '信息提示',
                nzContent: res.msg
              });
         }
      }
    )
 }

  /*
  * 获取列名，修改掉调度调整量字段  可以输入负数
  * @param data
  */
  colName(data: any) {
    const addWeight = data.filter(x => x.colEname === 'addWeight');
    addWeight[0].tdTemplate = this.addWeight;
   }

  /*
  * 获取查询表头，给计划日期赋值 今天
  * @param data
  */
  searchComponent(data: any) {
    const planDate = data.controlArray.filter(x => x.parameter === 'planDate');
    const difflag = data.controlArray.filter(x => x.parameter === 'diffFlag');
    planDate[0].value1 = format(new Date(), 'YYYY-MM-DD');
    planDate[0].format = 'yyyy-MM-dd' ;
    planDate[0].checkBox = true;
    difflag[0].value1 = '否';
    difflag[0].checkBox = true;
  }

  /*
  * 修改方法
  * @param data
  */
  updateMethod(data: any) {
    console.log(data);
    data.editstate = 1;
    data._setUpdate = true;
    data.selectShow = true;
  }

   /*
  * 保存方法
  * @param data
  */
 saveMethod(data: any) {
  if ( data.other && data.other.length > 64) {
    this.tplModal = this.nm.warning({
      nzTitle: '警告信息',
      nzContent: '备注信息过长，最多填写64位'
    });
    return;
   }
    this.saveLoading = true;
    this.http.post(WAREHOUSEURL.PRODUCTFACTORYSUPD,{
      rowid: data.rowid,
      addWeight: data.addWeight,
      other: data.other
    }).subscribe((res: any) => {
        this.saveLoading = false;
        if (res.code === 100) {
          data.editstate = 0;
         // this.updateFlage = false;
          data.selectShow = !data.selectShow;
          this.getList(this.tempSearchParam);
          this.nm.success({
            nzTitle: '提示信息',
            nzContent: res.msg
          })
        }
    } )
 }

  // 按钮数据返回
public btnData(data: any[]){
  this.isUpdate = data.some(x => x.buttonId === 'Update');
}

}
