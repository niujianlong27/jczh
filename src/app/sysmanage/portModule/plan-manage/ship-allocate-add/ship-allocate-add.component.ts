import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../../common/util/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {stockUrl} from '../../../../common/model/stockUrl';
import {portUrl} from '../../../../common/model/portUrl';

/**
 * Title: ship-allocate-add.component.ts
 * Description: 装船计划新增页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-ship-allocate-add',
  templateUrl: './ship-allocate-add.component.html',
  styleUrls: ['./ship-allocate-add.component.css']
})
export class ShipAllocateAddComponent implements OnInit {
  dataSet:any = [];
  pageSize:any = 30;
  totalPages:any = 0;
  listLoading:boolean = false;

  buttonId:any;
  updateData:any = [];
  status:any = 'Add';

  boatBatchNum:any;
  boatNum:any;
  shipData:any = {}; //存放船批信息
  detailList:any = [];

  // status:any;//标识页面是新增还是修改

  showExplainFlag:boolean = false;
  inpValidate:any;

  validateForm:FormGroup;
  formData: Array<any> = [
    {
      name: '调度计划号', eName: 'scheduleNum', type: 'text', validateCon: '请输入调度计划号', require: false,readOnly:true,placeholder:'自动生成',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '船批', eName: 'boatBatchNum', type: 'inputModal', validateCon: '请选择船批', require: true,
      findset:{ formId: 'boat_pop', name: '船批', parameter: 'boatBatchNum',parameterSend:'boatNum',url:'boat' },
      validate:{validateOpt:'inpValue',validateCon:'请选择船批'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '船号', eName: 'boatNum', type: 'text', validateCon: '请输入船号', require: false,readOnly:true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '是否下发作业', eName: 'isSend', type: 'text', validateCon: '请输入界面ID', require: false,readOnly:true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '下发作业人', eName: 'sendUserCode', type: 'text', validateCon: '请输入下发作业人', require: false,readOnly:true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '下发时间', eName: 'sendDateTime', type: 'text', validateCon: '请输入下发时间', require: false,readOnly:true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '备注', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ]

  constructor(private http:HttpUtilService,private nz:NzNotificationService,private nm:NzModalService,private fb:FormBuilder,private router: Router,private routerInfo:ActivatedRoute) { }

  /**
   * 初始化
   */
  ngOnInit() {
    // this.status = this.routerInfo.snapshot.queryParams['status'];

    this.listSearch({page:1,length:this.pageSize});

    this.validateForm = this.fb.group({});
    this.formData.forEach( item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });

    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("shipAllocateTopInfo") || "{}");
    this.status = topInfo.status;
    this.validateForm.patchValue(topInfo);
    this.boatNum = topInfo.boatNum || '';
    this.boatBatchNum = topInfo.boatBatchNum || '';

    if(topInfo){
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet = [...this.detailList];
      // console.log(this.dataSet ,JSON.parse(sessionStorage.getItem('detailList')));

    }

    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut')||"{}").stockOutDetailList || []
    this.dataSet = [...this.dataSet,..._dataSet];
    this.dataSet.forEach( item => {
      // item.newConsigneeCode2 = this.customerId1;
      // item.newConsigneeName2 = this.customerName1;
      // item.newConsigneeAaddress2 = topInfo.newConsigneeAddress2 || '';
      // item.newDestination = topInfo.newDestination || '';
    })


    //列表根据packNo去重
    let obj = {};
    let arr = [];
    this.dataSet.map(item => {
      if(!item.packNo || item.packNo == ''){
        arr.push(item);
      }else{
        if(!obj[item.packNo]){
          arr.push(item);
          obj[item.packNo] = true;
        }
      }
    });
    this.dataSet = arr;
    this.dataSet.forEach(item => {    //字段转换
      item.orderId = item.orderNo || '';
      item.varieties = item.productName || '';
      item.brand = item.shopsign || '';
      item.netweight = item.weight || '';
    });
  }

  /**
   * 获取列表数据
   * @param data
   */
  getList(data:any){
    // this.listLoading = true;
    // let url = portUrl.shipPlanGetList;
    // let param:any = data;
    // this.http.post(url,param).then((res:any) => {
    //   this.listLoading = false;
    //   if(res.success){
    //     this.dataSet = res.data.data && res.data.data.data || [];
    //     this.totalPages = res.data.data && res.data.data.total;
    //   }
    // })
  };

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  };

  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult(data:any){
    this.updateData = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd(data);
        break;
      case 'Cancel':
        this.btnCancel(data);
        break;
      case 'Save':
        this.btnSave(data);
        break;

      default:
        break;
    }
  };

  /**
   * 新增明细
   * @param data
   */
  btnAdd(data:any) {
    sessionStorage.setItem('stockOut',JSON.stringify({stockOutDetailList:this.dataSet}));
    this.router.navigate(['/system/stock/stockAddDetail'],{queryParams:{from:'planManage_allocate'}});

    //sessionStorage存储顶部维护信息
    let obj:any = {};
    obj = Utils.deepCopy(this.validateForm.value);
    obj.boatBatchNum = this.boatBatchNum || '';
    obj.status = this.status;
    // obj.customerId = this.customerNameData.inpValue || '';
    // obj.customerName1 = this.customerNameData1.inpName || '';
    // obj.customerId1 = this.customerNameData1.inpValue || '';
    sessionStorage.setItem("shipAllocateTopInfo",JSON.stringify(obj));
  }

  /**
   * 关闭
   * @param data
   */
  btnCancel(data:any) {
    this.router.navigate(['/system/planManage/shipAllocate']);
  }

  /**
   * 保存
   * @param data
   */
  btnSave(data:any): void {
    let url = this.status === 'Update' ? portUrl.shipAllocateSave2 : portUrl.shipAllocateSave;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    // param.stockTransferDetailList.forEach(item=>{
    //   item.oldConsigneeName = item.consigneeName;
    //   item.oldConsigneeCode = item.consigneeCode;
    // })
    // param.rowid = this.rowid;
    // param.oldConsigneeName = this.customerNameData.inpName || '';
    // param.oldConsigneeCode = this.customerNameData.inpValue || '';
    // console.log(this.customerName1);
    // param.newConsigneeName = this.customerNameData1.inpName || '';
    // param.newConsigneeCode = this.customerNameData1.inpValue || '';

    if(!this.inpValidate || this.inpValidate === 'INVALID'){
      this.showExplainFlag = true;
      return;
    };

    if (this.validateForm.status == 'INVALID') {
      console.log(this.validateForm);
      return;
    }
    let param:any = {};
    param = this.validateForm.getRawValue();
    param.boatStowageList =  this.dataSet;
    param.boatBatchNum = this.boatBatchNum;
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
          this.router.navigate(['/system/planManage/shipAllocate']);
        }
      }
    );
  }

  /**
   * 删除
   * @param data
   * @param i
   */
  delete(data:any,i:number){
    this.detailList.forEach((item,index)=>{
      if(item.packNo == this.dataSet[i].packNo){
        this.detailList.splice(index,1);
      }
    });
    this.dataSet.splice(i,1);
    sessionStorage.setItem('stockOut',JSON.stringify({stockOutDetailList:this.dataSet}));

    sessionStorage.setItem('detailList',JSON.stringify(this.detailList));

    this.dataSet = [...this.dataSet];
  }

  /**
   * 数据弹窗内容改变
   * @param data
   */
  inpEmit(data:any){
    console.log(data);
    this.validateForm.get('boatNum').setValue(data.inpValue);
    this.boatBatchNum = data.inpName || '';
    this.inpValidate = data.inpValidate;
  }

}
