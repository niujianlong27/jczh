import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzNotificationService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ENgxPrintComponent } from '@component/e-ngx-print';
import { element } from 'protractor';
import { Goods_Allocation_Url } from '@model/goodsAllocation-url';
import { log } from 'util';
import { Utils } from '@util/utils';
import { Router } from '@angular/router';
// tslint:disable-next-line:import-spacing
import { ActivatedRoute, Params } from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-bill-of-manage',
  templateUrl: './bill-of-manage.component.html',
  styleUrls: ['./bill-of-manage.component.css']
})
export class BillOfManageComponent implements OnInit {
  dataSet: any = []; // 结果集
  loading: any; // 页面查询加载
  pageSize: any = 100 ; // 页面显示数据条数
  totalPage: any; // 总页数
  totalPage233: any;
  updatedata: any = []; // 选中的数据
  gridOneHeight: string;
  gridTwoHeight: string;
  tplModal: NzModalRef;
  tplModal1: NzModalRef;
  tplModal2: NzModalRef;
  printVisible = false;
  deleteVisible :boolean = false;
  printConfirmLoading = true;
  deliveryNo: any;
  totalWeight = 0;
  pparm: any = {};

  @ViewChild('printModalTitle') printModalTitle: ElementRef;
  @ViewChild('printModalContent') printModalContent: ElementRef;
  @ViewChild('printModalFooter') printModalFooter: ElementRef;
  updateVisible = false;
  itemTable: any = [];
  mainTable: any = [];
  loadTaskId: any;
  totalWeight22 = 0;
  // totalWeight33: string;
  totalQuantity = 0;
  weight: any;
  currentTime: any;
  print: any = {};
  showHead = false;
  salesArr: any = [];
  deptArr: any = [];
  custArr: any = [];
  billingPrintVisible = false;
  cname: any;
  maname: any;
  custName: any;
  name: any;
  shareBillingArr: any = [];
  shareBillingVisible = false;
  shareTotalWeight: number;
  shareUpdateWeight = 0;
  shareItem = 0;
  shareParse = 0;
  totalWeight11: any = 0; // 确认开单时的总重量
  saveLoading:boolean = false
  deleteLoading:boolean = false;
  totalPcs22 = 0;

  dept: string;
  saleman: string;
  custUnit: string;
  gsper: any = [];
  custId: string;
  @ViewChild('print1') printComponent1: ENgxPrintComponent;

  isShareBilling = false;

  itemCloneArr: any = [];

  shareBillingArr2: any;

  custIdPrint: any;
  custNamePrint: any;

  status: any;

  calcuEnameArr: any = [
    { field: 'weight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3 },
    { field: 'totalWeight', tipInfo: '已选根数', tipInfoType: '根', demLength: 3 }
  ];

  optionArr = [
    {
      key: '预留',
      value: 'FHZT00'
    }, {
      key: '生成提货单',
      value: 'FHZT10'
    }
  ];

  kaipiaorenPrint: any;
  yewukePrint: any;
  yewuyuanPrint: any;

  sharePcs: number;

  shareItem1: any = [];
  tempSearchParam: any;

  printparam: any = [];
  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private router: Router,
              private activateInfo: ActivatedRoute,
              private info: UserinfoService,) {
  }

  ngOnInit() {
    this.getPurchasingUnit();
    this.getSalesMan();
    this.getDept();
    this.listSearch({ page: 1, length: this.pageSize });
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log('进入查询方法');
    data.page = data.page || 0;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = Goods_Allocation_Url.selectSheet;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    console.log(data);
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.itemTable = [];
        // for (let i = 0; i < this.dataSet.length; i++) {
        //   if (this.dataSet[i].status === 'FHZT00') {
        //     this.dataSet[i].status = '已预留';
        //   }
        //   if (this.dataSet[i].status === 'FHZT10') {
        //     this.dataSet[i].status = '已生成';
        //   }
        //   // if (this.dataSet[i].status === 'FHZT20') {
        //   //   this.dataSet[i].status = '已打印';
        //   // }
        //   if (this.dataSet[i].status === 'FHZT30') {
        //     this.dataSet[i].status = '已结算';
        //   }
        // }
        this.updatedata = [];
        this.dataSet.forEach(item => {
          if (item.status === 'FHZT00') {
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; // 字体颜色
          } else if(item.status === 'FHZT10'){
            item._bgColor = '#EEEE00'
          }
          else{
            item._bgColor = '#FFFFFF'
          }
          item.editstate = 0;
        });
      }
    });
    this.totalWeight22 = 0;
    this.totalPcs22 = 0;
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  // updatedata    已勾选    data
  updateDataResult(data: any) {
    console.log('data', data);

    console.log('length', data.length);
    if (data.length === 0) {
      this.updatedata = [];
      this.itemTable = [];
      this.totalWeight22 = 0;
      this.totalPcs22 = 0;
    } else {
      this.custName = data[0].custName;
      this.loadTaskId = data[0].loadTaskId;
      this.custIdPrint = data[0].customerId;
      this.custNamePrint = data[0].custname;
      this.kaipiaorenPrint = data[0].name;
      this.yewuyuanPrint = data[0].maname;
      this.yewukePrint = data[0].cname;
      if (data.length > this.updatedata.length) {
        // this.filter(function(i) {return arr.indexOf(i) < 0;})
        const arr: any = data.filter(x => this.updatedata.indexOf(x) < 0);
        this.dataSet.forEach(item => {
          if (arr[0].loadTaskId === item.loadTaskId && item.loadTaskId) {
            item.checked = true;

            console.log(this.updatedata);
          // data = this.updatedata;
          // this.updateDataResult(this.updatedata);
          }
        });
      } else {
        const arr: any = this.updatedata.filter(x => data.indexOf(x) < 0);
        this.updatedata.forEach(item => {
          if (item.checked && arr[0].loadTaskId === item.loadTaskId && item.loadTaskId) {
            item.checked = false;
            console.log(arr[0].loadTaskId, item.loadTaskId);
          }
        });
      }
      // debugger;
      this.updatedata = this.dataSet.filter(x => x.checked);
      if (this.updatedata.length > 0) {
        this.getItem(this.updatedata);
      } else {
        this.totalPcs22 = 0;
        this.totalWeight22 = 0;
      }
      if (this.updatedata.length === 1) {
        this.totalWeight22 = Number(this.updatedata[0].weight);
        this.totalPcs22 = this.updatedata[0].totalPcs;
      } else {
        this.totalPcs22 = 0;
        this.totalWeight22 = 0;
        this.updatedata.forEach(
          item => {
            if (item.totalPcs === '' || item.totalPcs === null || item.totalPcs === undefined || item.totalPcs === ' ') {
              item.totalPcs = 0;
            }
            if (item.weight === '' || item.weight === null || item.weight === undefined || item.weight === ' ') {
              item.weight = 0;
            }
            // console.log(this.updatedata);
            this.totalPcs22 = Utils.add(item.totalPcs, this.totalPcs22);
            // console.log(item.weight, '555555555555');
            // console.log(Number(item.weight));
            // console.log(this.totalWeight22);

            this.totalWeight22 += Utils.add(item.weight || 0, 0);
            // console.log(this.totalWeight22);
          }
        );
      }
      this.totalWeight22 = this.totalWeight22 / 1000;
    }
    this.dataSet.forEach(item=>{
      item.editstate = 0;
    })
    this.updatedata.forEach(item=>{
      item.editstate = 1;
    })
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchParam.length = pageSize
    this.getList(this.tempSearchParam);
  }

  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex(page: any): void {
    this.tempSearchParam.page = page
    this.getList(this.tempSearchParam);
  }

  isOurUser(){
    console.log(this.info)
    let flag:boolean = false;
    debugger
    this.updatedata.forEach(item=>{
      if(item.createId !==this.info.APPINFO.USER.userId){
        flag = true
      }
    })
    return flag ;
  }


  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnclick(data: any) {
    console.log(data.buttonId);
    if (this.updatedata.length === 0) {
      this.nz.warning(
        '提示信息',
        '请选择一条数据'
      );
      return;
    }
    if(this.isOurUser()){
      this.nz.error('提示信息','当前登陆人无权限操作勾选数据,请重新勾选!')
      return
    }
    switch (data.buttonId) {
      case 'Update':
        this.doUpdate(this.updatedata);
        break;
      case 'Delete':
        this.deleteVisible = true;
        break;
      case 'Print':
        this.doPrint(this.updatedata);
        break;
      case 'Reserved':
        this.doReserved(this.updatedata);
        break;
      case 'BillingPrint':
        this.doBillingPrint(this.updatedata);
        break;
      case 'OrderRecommend':
        this.doRecommend(this.updatedata);
        break;
      case 'SaveRemark':
        this.doSaveRemark();
        break;
    }
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  private doUpdate(data: any) {
    // debugger;
    if (this.updatedata.length === 0) {
      this.nz.warning(
        '提示信息',
        '请选择一条数据'
      );
      return;
    }
    if(this.canOperate(data,'status',['FHZT00','FHZT10'],'提货单已结算，不可进行修改')){
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 'FHZT30') {
        this.nz.warning(
          '提示信息',
          '提货单已结算，不可进行修改'
        );
        return;
      }
    }

    if (this.updatedata.length > 1) {
      for (let i = 0; i < this.updatedata.length; i++) {
        for (let j = i + 1; j < this.updatedata.length; j++) {
          if (this.updatedata[i].loadTaskId !== this.updatedata[j].loadTaskId) {
            this.nz.warning(
              '提示信息',
              '请选择车次号相同的数据'
            );
            return;
          }
        }
      }
    }
    if (data.length > 1 && data[0].loadTaskId === '') {
      this.nz.warning('提示信息',
        '勾选预留车次多条，无法进行修改');
      return;
    }
    this.status = data[0].status;
    // if (data[0].status === '已生成') {
    //     this.status = 'FHZT10';
    // }
    // if (data[0].status === '已预留') {
    //   this.status = 'FHZT00';
    // }
    // if (data[0].status === '已打印') {
    //   this.status = 'FHZT10';
    // }
    // const arr: any = this.updatedata.filter(x => data.indexOf(x) < 0);
    this.updateVisible = true;
  }

  private doDelete(data: any) {

    const url = Goods_Allocation_Url.deleteSheet;
    this.http.post(url, { tgaDeliverySheets: data }).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        this.nz.success(
          '提示信息',
          res.data.data
        );
        this.deleteVisible = false
        this.listSearch({ page: 1, length: 30 });
      }
      this.deleteLoading = false;
      // } else {
      //   this.nz.error(
      //     '提示信息',
      //     res.data.data
      //   );
      // }
    });
  }

  private doPrint(data: any) {
    if (this.updatedata.length === 0) {
      this.nz.warning(
        '提示信息',
        '请选择一条或多条数据'
      );
      return;
    }

    if(this.canOperate(data,'status',['FHZT10'],'只有生成状态的单子才可打印')){
      return;
    }

    const date = new Date();
    const seperator1 = '-';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const strDate = date.getDate();
    let m;
    let d;
    if (month >= 1 && month <= 9) {
      m = '0' + month;
    } else {
      m = month;
    }
    if (strDate >= 0 && strDate <= 9) {
      d = '0' + strDate;
    } else {
      d = strDate;
    }
    this.currentTime = year + seperator1 + m + seperator1 + d;
    // this.printVisible = true;

    console.log(this.itemTable);
    this.http.post(Goods_Allocation_Url.printCount, { tgaDeliverySheets: data }).then(
      (res: any) => {
        console.log(res);
      }
    );
    this.tplModal1 = this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '是否进行打印',
      nzOnOk: () => {
        console.log(this.itemTable);
        this.handlePrintSave();
        console.log(this.itemTable);
      }
    });
  }

  private doBillingPrint(data: any) {
    console.log(data);
    if (this.updatedata.length === 0) {
      this.nz.warning(
        '提示信息',
        '请选择一条数据'
      );
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 'FHZT10' || data[i].status === 'FHZT30') {
        this.nz.warning(
          '提示信息',
          '提货单状态为已生成或已结算'
        );
        return;
      }
    }

    console.log(data, '+-');
    for (let i = 0; i < this.updatedata.length; i++) {
      if (this.updatedata[i].weight === null || this.updatedata[i].weight === undefined) {
        this.updatedata[i].weight = 0;
      } else {
        this.totalWeight11 += Number(this.updatedata[i].weight) / 1000;
        continue;
      }
    }

    this.tplModal1 = this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: `共选择${this.totalWeight11}吨，是否确认开单`,
      nzOnOk: () => {
        const url = Goods_Allocation_Url.billAppera;
        this.http.post(url, { tgaDeliverySheets: [...this.updatedata] }).then((res: any) => {
          if (res.success) {
            console.log(res);
            this.nz.success(
              '提示信息',
              res.data.data
            );
            this.getList(this.tempSearchParam);
            this.totalWeight11=0;
          } else {
            this.nz.error(
              '提示信息',
              res.data.data
            );
          }
        });
      },
      nzOnCancel: () => {
        this.totalWeight11 = 0;
      }
    });
  }

  handlePrintCancel() {
    this.printVisible = false;
  }

  handlePrintSave() {
    this.printConfirmLoading = false;
    // this.printparam
    // this.printparam.forEach(
    //   item => {
    //     item.freePcs1 = 0;
    //     item.currentTime = this.currentTime;
    //     item.totalQuantity = item.items.map(item1 => item1.quantity).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    //     // item.totalPCS = item.items.map(item1 => item1.freePcs).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    //     for (let i = 0; i < item.items.length; i++) {
    //       console.log(item.items[i].freePcs);
    //       if (item.items[i].freePcs === '' || item.items[i].freePcs === null || item.items[i].freePcs === undefined) {
    //         item.items[i].freePcs = 0;
    //       }
    //       item.freePcs1 += Number(Number(item.items[i].freePcs));
    //     }
    //   }
    // );
    this.updatedata.forEach(item=>{
      let test1 :any = {};
      test1.deliveryNo = item.deliveryNo;
      test1.currentTime =this.currentTime;
      test1.customerId = item.customerId;
      test1.custname = item.custname;
      test1.maname = item.maname ;
      test1.cname =item. cname;
      test1.name = item.name;
      test1.items=[]
      test1.remark = item.remark&&item.remark||''
      test1.page = 0
      test1.totalPage = 0;
      this.printparam.push(test1);
    })
    this.itemTable.forEach((item,index)=>{
      this.printparam.forEach(item1=>{
        if(item.deliveryNo === item1.deliveryNo){
          item.no = item.deliveryItemNo
          item1.items.push(item);
        }
      })
    })
    this.printparam.forEach(item=>{
      item.totalQuantity =item.items.map(item1 => item1.quantity).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0);
      item.totalPcs =item.items.map(item1 => item1.freePcs).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0);
    })
    let print1:any=[]
    this.printparam.forEach(item=>{
      for(let i = 0;i<Number(Math.floor(item.items.length/9+1));i++){
        let items = this.deepClone(item)
        items.items = this.deepClone(item.items.slice(i*9,(i+1)*9))
        items.page = i+1;
        items.totalPage = Number(Math.floor(item.items.length/9+1));
        print1.push(items);
      }
    })
    this.printparam = print1

    this.customPrint(document.getElementById('print1'));
  }

  handleUpdateCancel() {
    this.updateVisible = false;
    this.itemTable = this.deepClone(this.itemCloneArr);
    this.optionArr = [
      {
        key: '预留',
        value: 'FHZT00'
      }, {
        key: '生成提货单',
        value: 'FHZT10'
      }
    ];
  }

  updateDataResultItem(data: any) {
    if (data.length === 0) {
      this.itemTable = [];
    }
  }

  printComplete() {
    this.printparam=[]
  }

  /*
* 打印
 */

  customPrint(print: any) {
    console.log(print);
    console.log(this.itemTable);
    this.showHead = true;
    const printHTML: HTMLElement = print;
    this.printComponent1.print(printHTML);
  }

  getPurchasingUnit() {
    const url = Goods_Allocation_Url.getCust;
    this.http.post(url, {}).then((res: any) => {
      if (res.success) {
        console.log(res);
        // tslint:disable-next-line:no-unused-expression
        this.salesArr = res.data;
        // this.loading = false;
        // this.dataSet = res.data.data.tgaDeliverySheets || [];
        // this.totalPage = res.data.data && res.data.data.total || 0;
        // this.itemTable = [];
      }
    });
  }

  getSalesMan() {
    const url = Goods_Allocation_Url.getSaleMan;
    this.http.post(url, {}).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        // this.loading = false;
        // this.dataSet = res.data.data.tgaDeliverySheets || [];
        // this.totalPage = res.data.data && res.data.data.total || 0;
        // this.itemTable = [];
      }
    });
  }

  getDept() {
    const url = Goods_Allocation_Url.getDept;
    this.http.post(url, {}).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        // this.loading = false;
        // this.dataSet = res.data.data.tgaDeliverySheets || [];
        // this.totalPage = res.data.data && res.data.data.total || 0;
        // this.itemTable = [];
      }
    });
  }

  doDeleteItem(data: any) {
    console.log(data.Itemstatus);
    console.log(data);
    debugger;
    this.totalWeight = (Number(this.totalWeight) * 1000 - Number(data.weight)) / 1000;
    this.totalQuantity = Number(this.totalQuantity) - Number(data.totalPcs);
    this.itemTable = this.itemTable.filter(
      d => d.rowid !== data.rowid);
    this.itemCloneArr.filter(x => x.rowid === data.rowid).map(y => y.deleteFlag = 1);
    console.log(this.itemCloneArr);
  }

  private doReserved(data: any) {
    // debugger;
    // this.itemTable.forEach();
    console.log(data);
    if (data.length === 0) {
      this.nz.warning(
        '提示信息',
        '请选择一条数据'
      );
      return;
    }
    debugger
    if (this.canOperate(data,'status',['FHZT10','FHZT00'],'该订单已结算，不支持预留')) {

      return;
    }
    if (this.canOperate(data,'status',['FHZT10','FHZT30'],'该车次已预留,请选择其他车次')) {

      return;
    }
    this.tplModal1 = this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '是否进行车次预留？',
      nzOnOk: () => {
        const url = Goods_Allocation_Url.billReverse;
        this.http.post(url, { tgaDeliverySheets: this.updatedata }).then((res: any) => {
          if (res.success) {
            console.log('++++');
            console.log(res);
            // this.tplModal = this.nm.warning(
            //   {
            //     nzTitle: '提示信息',
            //     nzContent: res.data.data
            //   }
            // );
            this.nz.success(
              '提示信息',
              res.data.data
            );
            this.getList(this.tempSearchParam);
          } else {
            this.nz.error(
              '提示信息',
              res.data.data
            );
          }
        });
      }
    });
  }

  handleUpdateSave() {
    const url = Goods_Allocation_Url.updateItem;
    this.saveLoading = true;
    for (let i = 0; i < this.itemTable.length; i++) {
      for (let j = 0; j < this.itemCloneArr.length; j++) {
        if (this.itemTable[i].rowid === this.itemCloneArr[j].rowid) {
          this.itemCloneArr[j] = this.itemTable[i];
        }
      }
    }
    console.log(this.itemCloneArr);
    this.itemCloneArr.forEach(
      (item) => {
        // item.totalPcs = 0;
        item.totalPcs = Number(Number(item.quantity) * Number(item.gsPer) + Number(item.freePcs));
      }
    );
    for (let i = 0; i < this.itemCloneArr.length; i++) {
      console.log(this.itemCloneArr);
      if (this.itemCloneArr[i].quantity === '0' && this.itemCloneArr[i].freePcs === '0') {
        this.nz.warning(
          '提示信息',
          '您输入的数据有误，请重新输入'
        );
        return;
      }
    }
    this.http.post(url, { tgaDeliverySheets: this.itemCloneArr, loadTaskId: this.loadTaskId, status: this.status }).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        this.nz.success(
          '提示信息',
          res.data.data
        );
        this.saveLoading = false;
        this.updateVisible = false;
        this.getList(this.tempSearchParam);
      }
    });
    this.optionArr = [
      {
        key: '预留',
        value: 'FHZT00'
      }, {
        key: '生成提货单',
        value: 'FHZT10'
      }
    ];

  }

  handlePrintBillingCancel() {
    this.billingPrintVisible = false;
  }

  getItem(data: any) {
    const url = Goods_Allocation_Url.selectItem;
    this.http.post(url, { tgaDeliverySheets: this.updatedata }).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        // this.deliveryNo = res.data.data.deliveryNo
        this.itemTable = res.data.data;
        this.itemTable.map(x=>x.totalPrice = (this.isNotANumber(Number(x.unitPrice))*(this.isNotANumber(Number(x.weight))/1000)).toFixed(3))
        // this.getGsPer(res.data.data[0]);
        // this.loadTaskId = this.up[0].loadTaskId;
        // this.printparam = this.updatedata;
        //
        // for (let i = 0; i < this.printparam.length; i++) {
        //   for (let j = 0; j < res.data.data.length; j++) {
        //     if (this.printparam[i].deliveryNo === res.data.data[j].deliveryNo) {
        //       this.printparam[i].items = [];
        //       this.printparam[i].items.push(res.data.data[j]);
        //     }
        //   }
        // }
        this.itemTable.map(x => x.deleteFlag = 0);
        this.totalQuantity = this.totalPcs22;
        this.totalWeight = this.totalWeight22;
        this.custId = this.updatedata[0].customerId;
        // this.totalQuantity = this.itemTable[0].totalQuantity;
        this.itemTable.forEach((item) => {
          item.custDept = this.updatedata[0].custname; // 购货单位
          item.cname = this.updatedata[0].maname; // 业务员
          item.dept = this.updatedata[0].cname; // 业务部门
        });
      }
      this.itemCloneArr = this.deepClone(this.itemTable);
    });
  }

  handleShareBilling() {
    this.shareTotalWeight = 0;
    this.shareBillingVisible = true;
    const url = Goods_Allocation_Url.shareBillSearch;
    this.http.post(url, { items: this.itemTable, customerId: this.custId }).then((res: any) => {
      if (res.success) {
        console.log('++++');
        console.log(res);
        // this.deliveryNo = res.data.data.deliveryNo
        this.shareBillingArr = res.data.data;
        // tslint:disable-next-line:no-shadowed-variable
        res.data.data.forEach(element => {
          if (element.weight === null || element.weight === undefined || element.weight === '') {
            element.weight = 0;
          }
          console.log('weight', Number(element.weight));
          this.shareTotalWeight = this.totalWeight;
        });
        this.totalPage233 = res.data.data.length;
        this.shareBillingArr.forEach(
          (item: any) => {
            if (item.remark === 'true') {
              item.checked = true;
              this.shareItem1.push(item);
              // this.shareBillingArr2 = this.shareBillingArr.filter(x => x.checked);
            }
          }
        );
        const weigth = this.totalWeight;
        this.shareItem = this.shareItem1.length;
        this.shareItem1.forEach(
          item => {
            console.log(item.weight);
            this.shareUpdateWeight += Number(item.weight);
          }
        );
        console.log(this.shareUpdateWeight);
        // this.shareUpdateWeight = this.shareUpdateWeight / 1000;
        // this.shareUpdateWeight = Number(this.shareUpdateWeight);
        this.shareTotalWeight = weigth + this.shareUpdateWeight;
      }
    });
  }

  doShareBilling() {
    this.sharePcs = 0;
    this.tplModal1 = this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: `共选择${this.shareUpdateWeight}吨，是否进行拼单?`,
      nzOnOk: item => {
        this.shareBillingArr.forEach((item: any) => {
          if (item.checked === true) {
            console.log(item);
            item.Itemstatus = 1;
            item.deleteFlag = 2;
            this.sharePcs += Number(item.totalPcs);
            // this.itemTable.push(item);
            this.totalWeight = Number((this.totalWeight + this.shareUpdateWeight).toFixed(3));
            console.log(this.shareUpdateWeight);
            this.totalQuantity = Number(this.totalQuantity) + Number(this.sharePcs);
            item.dept = item.maname;
            item.custDept = item.custname;
            this.itemTable = [...this.itemTable,
              item];
            this.itemCloneArr = [...this.itemCloneArr, item];
            item.editstate = 0;
          }
          console.log(this.itemTable);
          this.shareBillingVisible = false;
          this.shareTotalWeight = 0;
          this.shareUpdateWeight = 0;
          this.shareItem = 0;
          this.isShareBilling = true;
          this.optionArr = [{
            key: '生成提货单',
            value: 'FHZT10'
          }];
        });
      }
    });
  }

  doShareCancel() {
    this.shareItem = 0;
    this.shareUpdateWeight = 0;
    this.shareTotalWeight = 0;
    this.shareBillingVisible = false;
  }

  shareDataResult(data: any) {
    // console.log(data);
    // this.shareBillingArr2 = data.filter(x => x.checked);
    // // console.log(this.shareBillingArr2);
    // this.shareItem = this.shareBillingArr2.length;
    // // console.log(this.shareItem1);
    // let updateWeight = 0;
    // for (let i = 0; i < this.shareBillingArr2.length; i++) {
    //   updateWeight += Number(this.shareBillingArr2[i].weight);
    //   this.shareParse = updateWeight;
    //   console.log(updateWeight);
    // }
    //
    // const weight = this.totalWeight22;
    // console.log(27847 + 20014);
    // console.log(this.shareUpdateWeight, this.shareTotalWeight);
    // this.shareUpdateWeight = updateWeight / 1000;
    // this.shareUpdateWeight = Number(this.shareUpdateWeight.toFixed(3));
    // this.shareTotalWeight = weight + this.shareUpdateWeight;
    // this.shareTotalWeight = Number(this.shareTotalWeight.toFixed(3));
    // if (this.shareBillingArr2.length === 0) {
    //   this.shareUpdateWeight = 0;
    //   this.shareTotalWeight = weight;
    // }
    data.forEach(item=>{
      this.shareBillingArr.forEach(item1=>{
        if(item.deliveryNo === item1.deliveryNo){
          item1.checked = true;
        }
      })
    })
    this.shareBillingArr2 = this.shareBillingArr.filter(x=>x.checked);
    this.shareUpdateWeight = Number(((this.shareBillingArr2.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))/1000).toFixed(3));
    this.shareTotalWeight = Number((((this.shareBillingArr2.map(item => item.weight).reduce((acc, cur) => Number(acc) + Number(cur), 0))/1000+Number(this.totalWeight))).toFixed(3));

  }

  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

  // 深拷贝

  deepClone(data: any = {}) {
    if (typeof data !== 'object' || data == null) {
      //  obj是null ，或者不是对象和数组  直接返回
      return data;
    }

    //  初始化返回结果
    let result;
    if (data instanceof Array) {
      result = [];
    } else {
      result = {};
    }
    for (const key in data) {
      //  保证key不是原型的属性
      if (data.hasOwnProperty(key)) {
        // 递归调用
        result[key] = this.deepClone(data[key]);
      }
    }
    //  返回结果
    return result;
  }

  tableModelChange2(data: any) {
    console.log(data);
    this.totalWeight = 0;
    this.totalQuantity = 0;
    let weight = 0;
    let pcs = 0;
    if (data.data.freePcs >= Number(data.data.gsPer)) {
      data.data.quantity = Number(data.data.quantity) + Math.floor(Number(data.data.freePcs) / Number(data.data.gsPer));
      data.data.freePcs = Number(data.data.freePcs) % Number(data.data.gsPer);
    }
    this.itemTable.forEach(item => {
      item.weight = Number(((Number(item.quantity) * Number(item.gsPer) + Number(item.freePcs)) * Number(item.gbgzl)));
      weight += Number(item.weight);
      pcs += Number(item.quantity) * Number(item.gsPer) + Number(item.freePcs);

    });
    this.totalQuantity = pcs;
    this.totalWeight = weight / 1000;
    this.totalWeight = Number(this.totalWeight.toFixed(3));
    this.itemCloneArr.filter(x => x.deleteFlag !== 0);
    console.log(this.itemCloneArr);
  }

  doRecommend(data: any) {
    if (data.length !== 1) {
      this.nz.warning(
        '提示信息',
        '请选择一条预留的数据'
      );
      return;
    }
    console.log(data);
    if (this.canOperate(data,'status',['FHZT00'],'请选择预留状态的数据')) {

      return;
    }
    debugger
    const url = Goods_Allocation_Url.selectItem;
    this.http.post(url, { tgaDeliverySheets: data }).then((res: any) => {
      console.log(res);
      this.pparm = res.data.data;
      this.pparm.forEach(item => {
        item.fWhs = item.fWhsId;
        item.itemId = item.productId;
        item.cName = item.productName;
      });
      console.log(this.pparm);
      sessionStorage.setItem('abcd', JSON.stringify({ status: 'FHZT00' }));
      this.router.navigate(['/system/goods-allocation/goods-allocation/billOfLading'], {
        queryParams: {
          state: JSON.stringify({main:data[0],item:this.pparm})
        }
      }).then(r => console.log(r));
    });
  }
  canOperate(list:Array<any>,option:string,statusArr:Array<any>,tipInfo:string):boolean{
    let flag = false;
    list.forEach((item) => {
      if(statusArr.indexOf(item[option]) < 0){
        flag = true;
      }
    });
    if(flag){
      this.nz.warning('提示信息',tipInfo)
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag
  }
  listClick(data:any){
    if(data.checked){
      data.checked = false;
    }else{
      data.checked = true;
    }
    this.shareDataResult(this.shareBillingArr.filter(x=>x.checked));
  }

  listClick1(data:any){
    console.log(data)
    if(data.checked){
      data.checked = false;
    }else{
      data.checked = true;
    }
    console.log(this.shareBillingArr)
    this.updateDataResult(this.dataSet.filter(x=>x.checked));
  }

  modalConfirmResult(data:any){
    if(data.type=='ok'){
      this.deleteLoading = true
      this.doDelete(this.updatedata)

    }else{
      this.deleteLoading = false;
      this.deleteVisible = false
    }
  }

  doSaveRemark(){
    let url = Goods_Allocation_Url.updateRemark;
    let param :any = {}
    param.tgaDeliverySheets=this.updatedata;
    param.tgaDeliverySheets.forEach(item=>{
      item.items=[]
        this.itemTable .forEach(item2=>{
          if(item.deliveryNo===item2.deliveryNo){
            item.items.push(item2);
          }
        })
    })
    console.log(JSON.stringify(param))
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','修改成功')
        this.getList(this.tempSearchParam);
      }
    })
  }

}
