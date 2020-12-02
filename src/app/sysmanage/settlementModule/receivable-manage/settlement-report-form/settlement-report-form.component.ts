import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {NzNotificationService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {localUrls} from '../../../../common/model/localUrls';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
declare var JSONH: any;

@Component({
  selector: 'app-settlement-report-form',
  templateUrl: './settlement-report-form.component.html',
  styleUrls: ['./settlement-report-form.component.css']
})
export class SettlementReportFormComponent implements OnInit {
  modalRef: NzModalRef;
  modalTitle: string = '生成结算报表确认';
  findset: any = {formId: 'company_pop', name: '付款单位', parameter: 'companyName', parameterSend: 'companyId'};
  settleCompany: any;
  settleCompanyId: any;
  carrierCompany:any;
  carrierCompanyId:any;
  reportName: any;
  reportRemark: any;
  isDifferent: boolean = false;
  selectArr: any = [];
  inpData: any = {};
  tempSerachData: any;


  tplModal: NzModalRef;
  pageSize: number = 100;
  totalPage: number;
  totalPage2: number;
  listLoading: boolean = true;
  dataSet: any[] = [];
  dataSet1: any[] = [];
  dataSet2: any[] = [];
  /*caculateEnameArr: any = [
    {field: 'weight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalPrice', tipInfo: '总价', tipInfoType: '元', demLength: 2},
  ];*/
  tabIndex: Number = 0;
  buttonType: string;
  dateRange: any;

  consignorCompanyName: any;
  consignorCompanyId: any;
  businessType: any;
  feeType: any;
  calInfo: any = {};
  workPart: any = [];
  feeArr: any = [];

  startCreateDate: any;
  endCreateDate: any;
  // currIndex = 0;
  btnDis: boolean = false;
  btnLoading: any ={addall: false};
  totalWeight: number;
  totalPrice: number;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  constructor(private http: HttpUtilService,
              private ngHttp: HttpClient,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private modal: NzModalService,
              private info: UserinfoService) {
  }

  ngOnInit() {
   // this.listSearch({length: this.pageSize, page: 1});

    this.http.post(localUrls.getWorkPart, {}).then((res: any) => { //业务板块
      if (res.success) {
        this.workPart = res.data.data && res.data.data.data || [];
      }
    });
    this.http.post(urls.getFee, {companyId: this.info.APPINFO.USER.companyId}).then((res: any) => { //获取费用类型
      if (res.success) {
        this.feeArr = res.data.data;
      }
    });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.tabIndex = 0;
    this.tempSerachData = data;
    this.getList(data);
  }

  getList(data: any) {
    this.listLoading = true;
    this.http.post(urls.ReceivableReportList, data).then(
      (res: any) => {
        this.totalWeight = 0;
        this.totalPrice = 0;
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.packData && JSONH.unpack(JSON.parse(res.data.data.packData)) || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        console.log(this.dataSet)
      }
    );
  }

  btnClick(data: any) {
    this.buttonType = data.buttonId;
    if (this.selectArr.length < 1 && data.buttonId !== 'Export' ) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择结算单后操作！'
      });
      this.destroyTplModal();
      return;
    }
    if (data.buttonId === 'Add') {
      const bool = this.selectArr.some(x => x.consignorCompanyId !== this.selectArr[0].consignorCompanyId);
      if(bool){
        this.nm.error({
          nzTitle: '提示信息',
          nzContent: '请选择相同的付款单位进行操作'
        });
        return;
      }
      this.http.post(localUrls.judgmentReport, {generateSettlementReportModels: this.selectArr}).then(
        res => {
          if (res.success) {
            this.insertSettleReport({data: this.selectArr});
          }
        }
      );
    } else if (data.buttonId === 'BatchAdd') {
      //批量生成结算报表
      this.modalTitle = '批量生成结算报表确认';
      this.createModal();
    }
    if(data.buttonId === 'AddAll'){
        this.addAll();
    }
    if(data.buttonId === 'Export'){
      this.Export();
    }
  }
  private addAll(){ //批量生成报表
    const settleFeeList = this.selectArr.map(x => ({settleSubno: x.settleSubno}));
    const params = {settleFeeList: settleFeeList};
    this.btnLoading.addall = true;
     this.http.post(localUrls.insertSettleReportV2,params).then((res:any) => {
       this.btnLoading.addall = false;
        if(res.success){
          this.selectArr = [];
          this.nz.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
          this.getList(this.tempSerachData);
        }
     })
  }
  insertSettleReport(data: any) {
    console.log(data);
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择结算单后操作！'
      });
      this.destroyTplModal();
      return;
    }
   /* if (this.isDifferent) {
      this.nz.create('error', '提示信息', '选择了不同的付款单位，无法生成结算报表', {nzDuration: 3000});
      return;
    }*/
    const oneCarrier = this.selectArr.every((x:any) => x.carrierCompanyId !== this.selectArr[0].carrierCompanyId );
    this.inpData = {inpName: this.selectArr[0].consignorCompanyName, inpValue: this.selectArr[0].consignorCompanyId};
    this.settleCompany = this.inpData.inpName;
    this.settleCompanyId = this.inpData.inpValue;
    this.carrierCompany = '';
    this.carrierCompanyId = '';
    this.reportName = '';
    this.reportRemark = '';
    this.modalTitle = '生成结算报表确认';
    if(!oneCarrier){
      this.carrierCompany = this.selectArr[0].carrierCompanyName;
      this.carrierCompanyId = this.selectArr[0].carrierCompanyId;
    }
    this.createModal();
    /* if(data.type.buttonId !== 'Add'){
        return;
     };*/


  }

  tabResultFun(dex: any) {
    this.tabIndex = dex;
    switch (dex) {
      case 0:
        // this.listSearch({ length: this.pageSize, page: 1 });
        break;
      case 1:
      case 2:
        this[`dataSet${dex}`] = [];
        if (this.selectArr.length < 1) {
          this.nz.create('warning', '提示信息', '未选择结算单！', {nzDuration: 3000});
          return;
        }
        let url = localUrls[`getFormUrl${dex}`];
        let param = {settleFeeModelList: []};
        this.selectArr.forEach(element => {
          param.settleFeeModelList.push({settleNo: element.settleNo});
        });
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this[`dataSet${dex}`] = res.data && res.data.data || [];
            // this.totalPage2 = res.data && res.data.total || 0;
          }
        });
        break;

      default:
        break;
    }
    // this.selectArr = [];
  }

  selectData(data: any, dex: any) {
    switch (dex) {
      case 0:
       // this.isDifferent = false;
       this.totalWeight = 0;
       this.totalPrice = 0;
        this.selectArr = data;
       /* let obj = {},arr = [];
        data.forEach((d:any) => {
           if(!obj[d.settleNo]){
               arr = [...arr,d];
               obj[d.settleNo] = true;
           };
           this.totalWeight = arr.filter(x=> x.feeType === 'F001').map(x => x.weight).reduce((x,y)=>Number(x||0) + Number(y),0);
           this.totalPrice = data.map(x => x.totalPrice).reduce((x,y)=>Number(x||0) +Number(y),0);
        });*/
        this.totalWeight = data.filter(x=> x.feeType === 'F001').map(x => x.weight).reduce((x,y)=>Number(x||0) + Number(y),0);
        this.totalPrice = data.map(x => x.totalPrice).reduce((x,y)=>Number(x||0) +Number(y),0);
       /* let obj = [];
        obj.push(data[0]);
        for (let d of data) {
          if (d.consignorCompanyId != obj[0].consignorCompanyId) {  //委托单位不一致
            this.isDifferent = true;
            this.nz.create('warning', '提示信息', '选择了不同的付款单位', {nzDuration: 3000});
            return;
          }
        }*/
        break;
      case 2:

        break;
      default:
        break;
    }

  }

  createModal(width?: string) {

    this.calInfo = {};
    this.consignorCompanyName = '';
    this.consignorCompanyId = '';
    this.businessType = '';
    this.feeType = '';
    this.dateRange = '';
    this.startCreateDate = '';
    this.endCreateDate = '';
    this.reportName = '';
    this.reportRemark = '';

    this.modalRef = this.modal.create({ //弹窗
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: width || 520,
      nzMaskClosable: false,
      nzClosable: true,
      nzOnCancel: () => {
        this.settleCompany = '';
        this.settleCompanyId = '';
      }
    });
  }

  modalGetInfo() {
    //统计
    console.log(this.dateRange, this.consignorCompanyName, this.consignorCompanyId, this.businessType);

    let url = localUrls.selectStatisticalInfo;

    let param: any = {type: '10'};
    param.startCreateDate = this.startCreateDate = this.dateRange && this.dateRange[0] ? Utils.dateFormat(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : '';
    param.endCreateDate = this.endCreateDate = this.dateRange && this.dateRange[1] ? Utils.dateFormat(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : '';
    param.consignorCompanyId = this.consignorCompanyId || '';
    param.businessType = this.businessType;
    param.feeType = this.feeType || '';
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.calInfo = res.data.data || {};

      }
    });


  }

  modalConfirm() {
    // if(this.buttonType === 'Add'){
    //生成结算报表
    let param: any = {};
    if (this.buttonType === 'Add') {
      let settleFeeList = [];
      this.selectArr.map((r: any) => {
        let obj: any = {};
        obj.settleSubno = r.settleSubno;
        settleFeeList.push(obj);
      });
      param.settleFeeList = settleFeeList;
      param.carrierCompanyId = this.carrierCompanyId;
    }

    param.settleCompanyId = this.inpData.inpValue || '';
    param.reportName = this.reportName;
    param.remark = this.reportRemark;

    if (this.buttonType === 'Add') {
      this.insertReport(urls.insertSettleReport, param);
    } else if (this.buttonType === 'BatchAdd') {
      param.consignorCompanyId = this.consignorCompanyId;
      param.businessType = this.businessType;
      param.feeType = this.feeType || '';

      param.startCreateDate = this.startCreateDate = this.dateRange && this.dateRange[0] ? Utils.dateFormat(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : '';
      param.endCreateDate = this.endCreateDate = this.dateRange && this.dateRange[1] ? Utils.dateFormat(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : '';
      // param.startCreateDate = this.startCreateDate;
      // param.endCreateDate = this.endCreateDate;

      param.type = '10';
      this.insertReport(localUrls.insertBatchSettleReport, param);

    }

    // }else{
    //   //批量生成结算报表
    //
    // }

  }

  insertReport(url: any, param: any) {
    this.btnDis = true;
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDis = false;

        if (res.success) {
          this.modalRef.destroy();
          this.nz.create('success', '提示信息', '生成结算报表成功', {nzDuration: 3000});
          this.getList(this.tempSerachData);
        }
      }
    );
  }


  modalCancel() {
    this.settleCompany = '';
    this.settleCompanyId = '';

    this.modalRef.destroy();
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmitCon(data: any) {
    this.consignorCompanyName = data.inpName || '';
    this.consignorCompanyId = data.inpValue || '';

    this.inpData = data;
    // console.log(data,'inpData:',this.inpData);
    if (data.inpValue) {

      this.settleCompany = data.inpName || '';
      this.settleCompanyId = data.inpValue || '';
    }


  }

  inpEmit(data: any) {
    // console.log(data);
    this.inpData = data;
    this.settleCompany = data.inpName || '';
    this.settleCompanyId = data.inpValue || '';
    // console.log('inpData:',this.inpData);
  }
  inpEmitCarrier(data:any){
    this.carrierCompany = data.inpName || '';
    this.carrierCompanyId = data.inpValue || '';
  }
  // loadAll(data:any){
  //   let groups = this.group(data);
  //   for(let i=0;i<groups.length;i++){
  //     setTimeout((() => {
  //       // console.log(this);
  //       let group = groups[i];
  //       let index = i+1;
  //       return () => {
  //         console.log(this);
  //         this.loadPart(group,index);
  //       }
  //     })(),100);
  //   }
  // }

  // group(data:any){
  //   let result:any[] = [];
  //   let groupItem;
  //   for(let i=0;i<data.length;i++){
  //     if(i % 100 == 0){
  //       groupItem != null && result.push(groupItem);
  //       groupItem = [];
  //     }
  //     groupItem.push(data[i]);
  //   }
  //   result.push(groupItem);
  //   return result;
  // }

  // loadPart(group, index) {
  //   console.log('loadPart',index);
  //   let item: any = [];
  //   for (var i = 0; i < group.length; i++) {
  //     // this.dataSet.push(group[i]);
  //     item.push(group[i]);
  //     console.log(item);
  //     console.log( group[i]);

  //   }
  //   while (index - this.currIndex == 1) {
  //     // console.log(item,222);
  //     // item.forEach(element => {
  //     //   this.dataSet.push(element);
  //     // });
  //     for(let elem of item){
  //       this.dataSet.push(elem)
  //     }
  //     // this.dataSet = this.dataSet.concat(item);
  //     this.currIndex = index;
  //   }
  // }

  Export(){ //导出
    let url = localUrls.exportReceiveSettle;
    this.ngHttp.post(url, this.tempSerachData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `应收报表生成.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }
}
