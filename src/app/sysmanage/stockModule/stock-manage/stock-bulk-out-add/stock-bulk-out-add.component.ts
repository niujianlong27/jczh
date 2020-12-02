import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
import {Utils as SeaUtils} from '../../../sea/common/utils';

@Component({
  selector: 'app-stock-bulk-out-add',
  templateUrl: './stock-bulk-out-add.component.html',
  styleUrls: ['./stock-bulk-out-add.component.css']
})
export class StockBulkOutAddComponent implements OnInit {

  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id
  operTeam: string;
  operTeamCode:string;
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能

  btnStatus: any;
  inpValidate: any;
  showExplainFlag: boolean = false;
  teamInpValidate: any;
  teamShowExplainFlag: boolean = false;

  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];

  private rowid: string;

  // 代码错误，无法打包发布，修改代码
  outWsNo: any;
  outWsTime: any;

  popData: any = {
    wsLocation: {},
    consigneeName: {}
  };
  detailList: any = [];
  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {
    let nowDate = new Date();
    let loginName = this.appInfo.APPINFO.USER.loginName;
    this.validateForm = this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      outWsNo: ['', []],
      operUser: ['', [Validators.required]],
      operTeam: ['', [Validators.required]],
      operTeamCode:['', [Validators.required]],
      operTime: [nowDate, [Validators.required]],
      outWsTime: [nowDate, [Validators.required]],
      travelno: ['', []],
      tallyman: ['', []],
      craneOper: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    });
    this.validateForm.get('operUser').setValue(loginName);

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    let status;
    this.route.queryParams.subscribe(x => {
      status = x.status;
    });
    let topInfo = JSON.parse(sessionStorage.getItem("stockBulkOutTopInfo") || "{}"); //获取顶部的输入信息

    if (status == 'update') { //获取该出库单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
      this.rowid =topInfo.rowid;
    }

    this.validateForm.patchValue(topInfo);
    this.customerName = topInfo.customerName || '';
    this.customerCode = topInfo.customerCode || topInfo.customerId || '';
    this.operTeam = topInfo.operTeam || '';
    this.operTeamCode = topInfo.operTeamCode || '';
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []; //从库存里导入的明细
    this.dataSet1 = [...this.dataSet1, ..._dataSet];  //从session中带入导入的库存信息到列表中

  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = stockUrl.selectStockBulkInDetailOut;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;

        this.dataSet1.forEach((item) => {

          this.popTableData.push(
            {
              wsLocation: {
                name: item.wsLocation,
                value: ''
              },
              consigneeName: {
                name: item.consigneeName,
                value: item.consigneeCode
              }
            }
          )
        })
      }
    })

  }

  /**
   * 删除列表明细
   * @param data
   * @param i
   */
  delete(data: any, i: number) {
    this.dataSet1.splice(i, 1);
    this.dataSet1 = [...this.dataSet1];
    this.theorySheetNumber();
    this.theoryWeightNumber();
  }


  /**
   * 数据弹框组件内容发生改变时触发的方法
   * @param data
   */
  inpEmit(data: any) {

    this.inpValidate = data.inpValidate;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }


  //数据弹框组件内容发生改变时触发的方法
  teamInpEmit(data: any) {
    this.teamShowExplainFlag = false;
    this.teamInpValidate = data.inpValidate;
    this.validateForm.get('operTeam').setValue(data.inpName);
    this.validateForm.get('operTeamCode').setValue(data.inpValue);

  }

  /**
   * 数据弹框组件内容发生改变时触发的方法
   * @param data
   */
  inpEmitDetail(data: any): void {

    if (data.eName === 'consigneeName') {
      this.dataSet1[data.index].consigneeName = data.inpName;
      this.dataSet1[data.index].consigneeCode = data.inpValue;
    } else if (data.eName === 'wsLocation') {

      this.dataSet1[data.index].wsLocation = data.inpName;
      this.dataSet1[data.index].wsLocationId = data.selData[0] && data.selData[0].rowid || '';
      this.dataSet1[data.index].wsArea = data.selData[0] && data.selData[0].areaName || '';
      this.dataSet1[data.index].wsName = data.selData[0] && data.selData[0].stockName || '';
    } else if (data.header.colEname === 'weight') {
      this.theoryWeightNumber();
    } else if (data.header.colEname === 'packageNum') {
      this.theorySheetNumber();
    }

  }


  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /**
   * 新增明细
   * @param data
   */
  btnAdd(data: any): void {
    //sessionStorage存储顶部维护信息
    let obj: any = {};
    obj = Utils.deepCopy(this.validateForm.value);
    obj.status = this.btnStatus;
    obj.outWsTime = obj.outWsTime && obj.outWsTime instanceof Date ? Utils.dateFormat(obj.outWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.outWsTime || '';
    sessionStorage.setItem("stockBulkOutTopInfo", JSON.stringify(obj));
    sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
    this.router.navigate(['/system/stock/stockBulkAddDetail'], {queryParams: {from: 'stock_bulk_out'}});
  }


  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      this.btnAdd(data);
    }
    if (data.buttonId === 'save') {

      this.btnSave(data);
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockBulkOut']);
    }
  }


  /**
   * 保存
   * @param data
   */
  btnSave(data: any): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.inpValidate != 'VALID') {
      this.showExplainFlag = true;
    }
    if (this.teamInpValidate != 'VALID') {
      this.teamShowExplainFlag = true;
    }
    if (this.validateForm.status == 'INVALID' || this.inpValidate != 'VALID' || this.teamInpValidate != 'VALID') {
      return;
    }
    if (this.dataSet1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请添加明细后操作！'
      });
      this.destroyTplModal();
      return;
    }

    let url = this.btnStatus.status == 'Add' ? stockUrl.insertStockBulkOut : stockUrl.updateStockBulkOut;
    let param: any = {shStockOutDetails: '', rowid: ''};
    param = this.validateForm.getRawValue();
    param.shStockOutDetails = this.dataSet1;
    param.rowid = this.rowid;
    param.totalWeight = 0;
    param.totalPackageNum = 0;
    param.totalBranchNum = 0;

    param.totalWeight = this.dataSet1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    param.totalBranchNum = this.dataSet1.map(item => item.branchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    param.totalPackageNum = this.dataSet1.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    param.outWsTime = SeaUtils.format(param.outWsTime, 's');
    param.operTime = SeaUtils.format(param.operTime, 's');
    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockBulkOut'])
        }
      }
    );
  }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  /**
   * 计算理论重量
   */
  theoryWeightNumber() {
    var totalWeight = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalWeight += Number(this.dataSet1[i].weight)
    }
    this.validateForm.get("totalWeight").setValue(totalWeight);
  }

  /**
   * 计算理论件数
   */
  theorySheetNumber() {
    let totalPackageNum = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalPackageNum += Number(this.dataSet1[i].packageNum)
    }
    this.validateForm.get("totalPackageNum").setValue(totalPackageNum);
  }
  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

}


//   validateForm: FormGroup;
//   inpData: any = {};
//   customerCode: string;
//   totalWeight: number = 0;
//   totalPackageNum: number = 0;
//   totalBranchNum: number = 0;


//   listLoading1: boolean = false;
//   dataSet1: any = [];
//   totalPages1: Number = 1;
//   pageSize1: Number = 30;
//   selectedList1: any = [];
//   userHeader: any;
//   stockInfoModels: Array<any> = [];
//   insertList: Array<any> = [];
//   updateList: Array<any> = [];
//   deleteList: Array<any> = [];
//   customerName: any;
//   customerId: any;
//   detailList: any = [];
//   customerNameData: any = {};//客户名称
//   btnStatus: any;
//   showExplainFlag: boolean = false;
//   private rowid: string;

//   // 代码错误，无法打包发布，修改代码
//   outWsNo: any;
//   outWsTime: any;
//   btnDisable: any = {};
//   popTableData: any = [];
//   constructor(private fb: FormBuilder, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService) {
//   }

//   /**
//    * 初始化
//    */
//   ngOnInit() {
//     let loginName =  this.appInfo.APPINFO.USER.loginName;
//     this.validateForm = this.fb.group({
//       customerCode: ['', [Validators.required]],
//       customerName: ['', []],
//       outWsNo: ['', []],
//       operUser: ['', [Validators.required]],
//       operTeam: ['', [Validators.required]],
//       operTime: ['', [Validators.required]],
//       outWsTime: ['', [Validators.required]],
//       travelno: ['', [Validators.required]],
//       tallyman: ['', [Validators.required]],
//       craneOper: ['', [Validators.required]],
//       remark: ['', []],
//       theoryWeight:['',[Validators.required]],
//       theorySheet:['',[Validators.required]]
//     })
//     //从session中带入顶部维护信息
//     let topInfo = JSON.parse(sessionStorage.getItem("stockOutTopInfo") || "{}");
//     this.btnStatus = topInfo.status;
//     this.validateForm.patchValue(topInfo);
//     this.customerName = topInfo.customerName || '';
//     this.customerId = topInfo.customerCode || topInfo.customerId || '';

//     this.customerNameData = {
//       inpName: this.customerName,
//       inpValue: this.customerId
//     }

//     if (topInfo) {
//       this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
//       this.dataSet1 = [...this.detailList];

//       // this.getList2({ page: 1, length: this.pageSize1,transferId:topInfo.transferNo });
//     }

//     //从session中带入导入的库存信息到列表中
//     let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []
//     this.dataSet1 = [...this.dataSet1, ..._dataSet];
//     //  this.dataSet1.forEach( item => {
//     //    item.newConsigneeCode2 = this.customerId1;
//     //    item.newConsigneeName2 = this.customerName1;
//     //    item.newConsigneeAaddress2 = topInfo.newConsigneeAddress2 || '';
//     //    item.newDestination = topInfo.newDestination || '';
//     //  })
//     let obj = {};
//     let arr = [];
//     this.dataSet1.map(item => {
//       if (!item.packNo || item.packNo == '') {
//         arr.push(item);
//       } else {
//         if (!obj[item.packNo]) {
//           arr.push(item);
//           obj[item.packNo] = true;
//         }
//       }
//     });
//     this.dataSet1 = arr;
//     this.validateForm.get('operUser').setValue(loginName);

//   }

//   /**
//    * 删除
//    * @param data
//    * @param i
//    */

//   delete(data: any, i: number) {
//     this.detailList.forEach((item, index) => {
//       if (item.rowid == this.dataSet1[i].rowid) {
//         this.detailList.splice(index, 1);
//       }
//     });
//     this.dataSet1.splice(i, 1);
//     sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));

//     sessionStorage.setItem('detailList', JSON.stringify(this.detailList));

//     this.dataSet1 = [...this.dataSet1];

//     this.theorySheetNumber();
//     this.theoryWeightNumber();
//   };

//   /**
//    * 数据弹窗内容变化
//    * @param data
//    */
//   inpEmit(data: any) {
//     this.inpData = data;
//     this.validateForm.get('customerCode').setValue(data.inpValue);
//     this.validateForm.get('customerName').setValue(data.inpName);
//   }

//   /**
//    * 数据弹窗内容变化
//    * @param data
//    */
//   inpEmitDetail(data: any): void {
//     if (data.eName === 'consigneeName') {
//       this.dataSet1[data.index].consigneeName = data.inpName;
//       this.dataSet1[data.index].consigneeCode = data.inpValue;
//     }else if(data.header.colEname=== 'weight'){
//       this.theoryWeightNumber();
//      } else if(data.header.colEname === 'packageNum'){
//        this.theorySheetNumber();
//      }
//   }

//   /**
//    * 表头
//    * @param data
//    */
//   getUserHeader(data: any): void {
//     this.userHeader = data;
//   }

//   /**
//    * 保存
//    */
//   btnSave(): void {
//     if (!this.validateForm.value.customerCode || this.validateForm.value.customerCode == "") {
//       this.showExplainFlag = true;
//     }
//     for (const i in this.validateForm.controls) {
//       this.validateForm.controls[i].markAsDirty();
//       this.validateForm.controls[i].updateValueAndValidity();
//     }
//     if (this.validateForm.status == 'INVALID') {
//       return;
//     }

//     let url = this.btnStatus == 'Add' ? stockUrl.insertStockOut : stockUrl.updateStockOutAndDetail;
//     let param: any = {stockOutDetailList: '', rowid: ''};

//     param = this.validateForm.getRawValue();
//     param.stockOutDetailList = this.dataSet1;
//     param.rowid = this.rowid;

//     //let param = this.validateForm.getRawValue();


//     param.outWsTime = param.outWsTime && Utils.dateFormat(new Date(param.outWsTime), 'yyyy-MM-dd HH:mm:ss');
//     param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';

//     this.btnDisable = {'Save': true};
//     this.http.post(url, param).then(
//       (res: any) => {
//         this.btnDisable = {};
//         if (res.success) {
//           // this.router.navigate(['/system/stock/stockOut']);
//           this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
//           this.router.navigate(['/system/stock/stockBulkOut']);
//         }
//       }
//     );
//   }

//   /**
//    * 按钮点击
//    * @param data
//    */
//   btnClick(data: any): void {
//     if (data.buttonId === 'Add') {

//       // sessionStorage.setItem('stockBulkOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
//       // this.router.navigate(['/system/stock/stockBulkOut'], {queryParams: {from: 'stockBulkOut'}});
//       this.btnAdd(data);
//       //sessionStorage存储顶部维护信息
//       // let obj: any = {};
//       // obj = Utils.deepCopy(this.validateForm.value);
//       // obj.status = this.btnStatus;
//       // obj.outWsTime = obj.outWsTime && obj.outWsTime instanceof Date ? Utils.dateFormat(obj.outWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.outWsTime || '';

//       // sessionStorage.setItem("stockOutTopInfo", JSON.stringify(obj));

//     }
//     if (data.buttonId === 'save') {
//       this.btnSave();
//     }
//     if (data.buttonId === 'cancel') {
//       this.router.navigate(['/system/stock/stockBulkOut']);
//     }
//   }

//     /**
//    * 计算理论重量
//    */
//   theoryWeightNumber(){
//     var theoryWeight = 0;
//     for (let i = 0; i < this.dataSet1.length; i++) {
//       theoryWeight += Number(this.dataSet1[i].weight)
//     }
//     this.validateForm.get("theoryWeight").setValue(theoryWeight) ;
//   }
//   /**
//   * 计算理论件数
//   */
//   theorySheetNumber(){
//     var theorySheet = 0;
//     for (let i = 0; i < this.dataSet1.length; i++) {
//       theorySheet += Number(this.dataSet1[i].packageNum)
//     }
//     this.validateForm.get("theorySheet").setValue(theorySheet) ;
//   }
//   btnAdd(data: any): void {
//     this.dataSet1.unshift({});
//     this.popTableData.unshift(
//       {
//         wsLocation: {
//           name: '',
//           value: ''
//         },
//         consigneeName: {
//           name: '',
//           value: ''
//         }
//       }
//     );

//     this.userHeader.map((item) => {
//       this.dataSet1[0][item.colEname] = '';
//     });
//     this.dataSet1 = [...this.dataSet1]
//     // this.dataSet1[0].EDIT = true;
//     // this.addData.push(this.dataSet[0]);
//   }


// }


