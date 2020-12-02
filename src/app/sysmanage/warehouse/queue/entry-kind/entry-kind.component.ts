import {Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { format} from 'date-fns';
import { Utils } from '@util/utils';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-entry-kind',
  templateUrl: './entry-kind.component.html',
  styleUrls: ['./entry-kind.component.css']
})
export class EntryKindComponent implements OnInit {

  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  tempSearchParam: any = {}; // 保存查询数据
  tplModal: NzModalRef; // 操作成功后弹窗属性
 //  updateFlage = false; // 控制按钮状态 修改和保存
  public dataSetClone: any[] = [];
  tempUpdateParam: any = {}; // 修改参数保存
  warehouseArrr: Array<any> = []; // 仓库数组
  matArr: Array<any> = []; // 物料数组
  warehouseCodeArr: Array<any> = [];
  public isUpdate: boolean;
  public visible: boolean;
  public modalForm: FormGroup;
  public modalLoading: boolean;
  public saveLoading: boolean;
  @ViewChild('addWeight') addWeight: ElementRef; // 调度调整量
  constructor(
    private http: HttpClient,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private info: UserinfoService,
    private cf:ChangeDetectorRef
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
      });
      // this.getData(WAREHOUSEURL.GETALLWAREHOUSE, this.warehouseArrr);
      // this.getData(WAREHOUSEURL.GETALLMAT, this.matArr);
      this.getWarehouse();
  }
     // 按钮数据返回
public btnData(data: any[]){
  this.isUpdate = data.some(x => x.buttonId === 'Update');
}

/**
   * 获取仓库
   */
  getWarehouse(){
    this.http.post( `${environment.baseUrlSystem}roleButton/getUserButtons`, {'userId' : this.info.get('USER').userId , 'formId':'form_queue_product_ware_right'}).subscribe(
      (res: any) => {
        console.log(res);
        if (res.code === 100) {
          res.data.map(x => {
            this.warehouseCodeArr.push('"' + x.buttonId + '"');
          });
            this.tempSearchParam.warehouseCode = this.warehouseCodeArr.join(',');
            // this.listSearch({page:1,pageSize:30}); 
        }
      }
    );
  }

  /**
   * 用调接口的数据取代static
   * @param data
   */
  getData(url, arr): void {
    this.http.post(url, {}).subscribe(
      (res: any) => {
        console.log(res.data);
        if (res.code === 100) {
          res.data.forEach(item => {
            arr.push(item);
          });
        }
      }
    );
  }

      // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code,observe);
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
  } else if (code === 'getKindName') {
    url = WAREHOUSEURL.GETALLMAT;
    param = {};
    key = 'matKindName';
    value = 'matKindCode';
  }
 this.http.post(url, param).subscribe(
   (res: any) => {
     if (res.code === 100) {
         const data = (res.data || []).map((x: any) => ({name: x[key], value: x[value]}));
        //  if (code === 'product_disp.queueClass') { // 排队优先级
        //       this.queueClass = [...data];
        //  } else if (code === 'product_disp.ruleStatus') { // 状态
        //       this.ruleStatus = [...data];
        //  } else if (code === 'getKindName') { // 分类名称
        //       this.kindArr = [...data];
        //  } else if (code === 'getWarehouseName') { //仓库名称
        //       this.warehouseArr = [...data];
        //  } else if (code === 'product_disp.gate') { // 可入厂大门
        //       this.gateArr = [...data];
        //  }
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
    this.getList(param);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any = {}): void {
    this.loading = true;
    this.dataSet = [];
    // this.updateFlage = false;
    this.tempSearchParam = data;
    this.http.post(WAREHOUSEURL.PRODUCTWAREHOUSEGET, data).subscribe((res: any) => {
     
      this.loading = false;
      if (res.code === 100) {
        this.updateData = [];
        this.dataSetClone = [];
        const dataSet = res.data && res.data.data || [];
        this.totalPage = res.data && res.data.total || 0;
        this.dataSet = [...dataSet];
        this.dataSet.map((x) => (x.editstate = 0));
        this.dataSet.map((x) => (x.actpalnWeight = Number(x.planWeight) + Number(x.addWeight)));
        dataSet.forEach((x: any)=>{
          this.dataSetClone = [...this.dataSetClone, {...x}];
          x.editstate = 0;
        });
        // this.dataSet = [...dataSet];
        // this.dataSet.map((x) => (x.editstate = 0));
        // this.dataSet.map((x) => (x.actpalnWeight = Number(x.planWeight) + Number(x.addWeight)));
        this.dataSet.forEach(x => {x.selectShow = false; });
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
      // case 'Update':
      //   this.updateMethod(this.updateData);
      //   break;
      // case 'Save':
      //   this.saveMethod(this.dataSet.filter(x => x.editstate === 1)[0]);
      //   break;
      // case 'Add':
      //   this.modalForm.reset();
      //   this.visible = true;
      //   break;
      case 'Delete':
        this.delete();
        break;
        // case 'Cancel':
        //     this.cancelUpdate(this.dataSet.filter(x => x.editstate === 1)[0]);
        //     break;
    }
  }

    /**
   *取消保存 
   */
  cancelUpdate(data:any){
    // const data = this.dataSet.filter( x => x.selectShow === true)[0];
    // data.gateName = this.tempUpdateParam.gateName;
    // data.gateCode=this.tempUpdateParam.gateCode;
    // data.other = this.tempUpdateParam.other;
    // data.addWeight = this.tempUpdateParam.addWeight;
    // this.updateFlage = false;
    const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
    Object.keys(data).forEach(x => data[x] = d[0][x]);
    data.editstate = 0;
    data.selectShow = false;
    data._setUpdate = false;
  }


  //删除
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
         this.http.post(WAREHOUSEURL.PRODUCTWAREHOUSESDEL, param).subscribe(
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
 //弹窗确定
 modalOk() {
    for (const i in this.modalForm.controls) {
        this.modalForm.controls[i].markAsDirty();
        this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.status === 'INVALID') return;
    this.modalLoading = true;
    this.modalForm.get('matName').setValue('1212');
    this.modalForm.get('warehouseName').setValue('trtr');
    const param = {...this.modalForm.value};
    param.planDate = format(this.modalForm.get('planDate').value, 'YYYY-MM-DD');
   // debugger;
    this.http.post(WAREHOUSEURL.PRODUCTEWAREHOUSEINS, param).subscribe(
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

  /**
  * onChange
  *  */ 
 onChange(number:any,data2:any){
  if(data2.addWeight === '' || data2.addWeight === null || data2.addWeight === undefined){
    console.log("true");
    // data = 0;
    console.log(number);
    //number.displayValue = 0;
    data2.addWeight=0;
    this.cf.markForCheck();
  //  data2.addWeight=1;
  //  this.cf.markForCheck();
 //   data2.addWeight=0;
//    this.cf.markForCheck();
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
    // if (data.length  !== 1 ) {
    //   this.tplModal = this.nm.info({
    //     nzTitle: '提示信息',
    //     nzContent: '请选择一条数据进行修改'
    //   });
    //   return;
    // }
    // this.tempUpdateParam = { ...data };
    data.editstate = 1;
    data.selectShow = true;
    data._setUpdate = true;
   // window.setTimeout(() => this.updateFlage = true, 500)
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
    this.http.post(WAREHOUSEURL.PRODUCTWAREHOUSESUPD,{
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

}
