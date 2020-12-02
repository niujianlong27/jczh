import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
import {TRANS_PLAN_URLS} from '../../../../common/model/transPlan-urls';

/**
 * Title: allocate-goods-add.componment.ts
 * Description: 车次新增页面
 * Created: shaoluyu 2019/5/17
 * Modified:
 */
@Component({
  selector: 'app-allocate-goods-add',
  templateUrl: './allocate-goods-add.component.html',
  styleUrls: ['./allocate-goods-add.component.css']
})
export class AllocateGoodsAddComponent implements OnInit {
  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id


  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能

  status: any;
  inpValidate: any;
  showExplainFlag: boolean = false;

  totalWeight: number = 0;

  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];

  private rowid: string;


  loadTaskCode: any;
  planStartTime: any;


  popData: any = {
    wsLocation: {},
    consigneeName: {}
  }

  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;
  constructor(private fb: FormBuilder, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }


 /**
    * 页面初始化
    * @paramxein
    */
  ngOnInit() {

   // let loginName = this.appInfo.APPINFO.USER.loginName;
    this.validateForm = this.fb.group({
      loadTaskCode: ['', []],
      planStartTime: ['', [Validators.required]],
      truckFleet: ['', [Validators.required]],
      truckType: ['', [Validators.required]],
      lineName: ['', [Validators.required]],
      taskPriority: ['', [Validators.required]],
     // remark: ['', []]
    });
    let topInfo = JSON.parse(sessionStorage.getItem('allocateGoods') || '{}');
    this.status = topInfo.status;
    if (topInfo.status == 'Update') {
     // this.popData.wsLocation.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].wsLocation || '' : '';
     // this.popData.consigneeName.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].consigneeName || '' : '';
      this.validateForm.patchValue(topInfo);
      this.customerName = topInfo.customerName;
      this.customerCode = topInfo.customerCode;
      this.getList({page: 1, length: this.pageSize1, loadTaskCode: topInfo.loadTaskCode});
    }
   // this.validateForm.get('operUser').setValue(loginName);
  }


  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = TRANS_PLAN_URLS.getAllocateGoodsDetail;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;

        // this.dataSet1.forEach((item) => {
        //
        //   this.popTableData.push(
        //     {
        //       wsLocation: {
        //         name: item.wsLocation,
        //         value: ''
        //       },
        //       consigneeName: {
        //         name: item.consigneeName,
        //         value: item.consigneeCode
        //       }
        //     }
        //   )
        // })
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
  }


  /**
   * 数据弹框组件内容发生改变时触发的方法
   * @param data
   */
  // inpEmit(data: any) {
  //
  //   this.inpValidate = data.inpValidate;
  //   this.validateForm.get('customerCode').setValue(data.inpValue);
  //   this.validateForm.get('customerName').setValue(data.inpName);
  // }

  // /**
  //  * 数据弹框组件内容发生改变时触发的方法
  //  * @param data
  //  */
  // inpEmitDetail(data: any): void {
  //   if (data.eName === 'consigneeName') {
  //     this.dataSet1[data.index].consigneeName = data.inpName;
  //     this.dataSet1[data.index].consigneeCode = data.inpValue;
  //   } else if (data.eName === 'wsLocation') {
  //
  //     this.dataSet1[data.index].wsLocation = data.inpName;
  //     this.dataSet1[data.index].wsLocationId = data.selData[0] && data.selData[0].rowid || '';
  //     this.dataSet1[data.index].wsArea = data.selData[0] && data.selData[0].areaName || '';
  //     this.dataSet1[data.index].wsName = data.selData[0] && data.selData[0].stockName || '';
  //   }
  // }


  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /**
   * 新增明细
   * @param data
   */
  btnAdd(data: any): void {
    this.dataSet1.unshift({});
    // this.popTableData.unshift(
    //   {
    //     wsLocation: {
    //       name: '',
    //       value: ''
    //     },
    //     consigneeName: {
    //       name: '',
    //       value: ''
    //     }
    //   }
    // );

    this.userHeader.map((item) => {
      this.dataSet1[0][item.colEname] = '';
    });
    this.dataSet1 = [...this.dataSet1]
    // this.dataSet1[0].EDIT = true;
    // this.addData.push(this.dataSet[0]);
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
      this.router.navigate(['/system/trans/plan-manage/allocateGoods']);
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

    let url = this.status == 'Add' ? TRANS_PLAN_URLS.insertAllocateGoods : TRANS_PLAN_URLS.updateAllocateGoods;
    console.log(url);
    let param: any = {detailList: '', rowid: ''};

    param = this.validateForm.getRawValue();
    param.detailList = this.dataSet1;
    param.rowid = this.rowid;
    param.planStartTime = param.planStartTime && param.planStartTime instanceof Date ? Utils.dateFormat(param.planStartTime, 'yyyy-MM-dd HH:mm:ss') : param.planStartTime || '';
  //  param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';


    // if (this.inpValidate != 'VALID') {
    //   console.log('sss')
    //   this.showExplainFlag = true;
    // }
    if (this.validateForm.status == 'INVALID') {
      console.log('888')
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
    // for (let i = 0; i < this.dataSet1.length; i++) {
    //
    //   if (!this.dataSet1[i].packNo) {
    //     this.nm.info({
    //       nzTitle: '提示信息',
    //       nzContent: '不能为空！'
    //     })
    //     return;
    //   }
    // }

    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/trans/plan-manage/allocateGoods']);
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

}
