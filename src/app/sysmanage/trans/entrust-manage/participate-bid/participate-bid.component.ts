import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';
import {FormBuilder, FormGroup} from '@angular/forms';
import {format, differenceInCalendarDays} from 'date-fns';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-participate-bid',
  templateUrl: './participate-bid.component.html',
  styleUrls: ['./participate-bid.component.css']
})
export class ParticipateBidComponent implements OnInit {

  @ViewChild('modalContent') content;
  @ViewChild('modalFooter') footer;

  private title: string; // 弹窗标题
  private modal: NzModalRef; // 弹窗创建
  buttonId: string; // 按钮来源 Bid 修改  Viewbid 查看
  nzWidth = '60%'; // 弹窗宽度
  private modalCancel = new EventEmitter(); // 弹窗取消
  type: string; // 数据类型 均价:average CJLX10,流向:flow CJLX30,品名:product  CJLX20
  // 类型 均价:CJLX10,流向:CJLX30,品名:CJLX20

  // 明细相关
  // 货盘明细
  dataSetPallet: Array<any> = [];
  totalPagePallet: number = 0;

  // 捆包明细 bale
  dataSetBale: Array<any> = [];
  totalPageBale: number = 0;

  // 船期日期选择
  endOpen: boolean = false;
  today = new Date();

  // 流向表头
  flowHeader: Array<any> = [
    {cName: '货盘号', eName: 'palletNo', width: '40px', type: 'string', edit: false},
    {cName: '装货港-码头', eName: 'startAddressStr', width: '60px', type: 'string', edit: false},
    {cName: '流向', eName: 'flowDesc', width: '60px', type: 'string', edit: false},
    {cName: '重量（MT）', eName: 'goodsWeight', width: '60px', type: 'string', edit: false},
    {cName: '数量', eName: 'containerNo', width: '40px', type: 'string', edit: false},
    {cName: '是否含税', eName: 'settleTypeName', width: '40px', type: 'string', edit: false},
    {cName: `最高限价*单位`, eName: 'offerPriceTax', width: '80px', type: 'string', edit: false},
    // {cName: `最低出价*单位`, eName: 'h', width: '80px', type: 'string', edit: false},
    {cName: `出价*单位`, eName: 'markedPriceTax', width: '80px', type: 'string', edit: false},
    {cName: '箱数*个', eName: 'containerNo', width: '80px', type: 'string', edit: false},
  ];

  // 品名表头
  productNameHeader: Array<any> = [
    {cName: '货盘号', eName: 'palletNo', width: '40px', edit: false},
    {cName: '货盘明细号', eName: 'tenderPalletNos', width: '40px', edit: false},
    {cName: '竞价子单号集合', eName: 'tenderItemNos', width: '40px', edit: false},
    {cName: '流向', eName: 'flowDesc', width: '40px', edit: false},
    {cName: '品名', eName: 'productName', width: '40px', edit: false},
    {cName: '规格', eName: 'specDesc', width: '40px', edit: false},
    {cName: '重量（MT）', eName: 'goodsWeight', width: '40px', edit: false},
    {cName: '数量', eName: 'containerNo1', width: '40px', edit: false},
    {cName: '是否含税', eName: 'settleTypeName', width: '40px', edit: false},
    {cName: '集装箱类别', eName: 'containerType', width: '40px', edit: false},
    {cName: '集装箱个数', eName: 'containerNo1', width: '40px', edit: false},
    {cName: `最高限价*单位`, eName: 'markedPriceTax', width: '40px', edit: false},
    {cName: `最低出价*单位`, eName: 'offerPriceTax1', width: '40px', edit: false},
    {cName: `出价*单位`, eName: 'offerPriceTax', width: '40px', edit: false},
    {cName: '箱数*个', eName: 'containerNo', width: '40px', edit: false},
  ];

  dataHeader: Array<any> = [];

  // 主表单
  dataSet: Array<any> = []; // 表格数据
  searchParam: Array<any> = []; //搜索数据缓存
  listLoading: boolean = true; // 主列表加载状态
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  selectedData: any;  // 选中的数据

  // 弹窗表格数据
  dataSetModal: Array<any> = [];

  btnDisable: any = {      // 禁用按钮
    Bid: true,
    Viewbid: true
  };

  private tplModal: NzModalRef;//操作成功后弹窗属性

  // 船舶表单
  boatForm: FormGroup;

  // 按均价表单
  averageForm: FormGroup;

  constructor(private http: HttpUtilService, private nm: NzModalService, private info: UserinfoService, private notification: NzNotificationService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.listMainSearch({page: 1, length: this.pageSize});
    this.modalCancel.subscribe(
      () => {
        this.modal.destroy();
      }
    );

    // 船舶表单初始化
    this.boatForm = this.fb.group({
      boatName: ['', Validators.required],
      loadDateStart: ['', Validators.required],
      loadDateEnd: ['', Validators.required],
      capacity: ['', Validators.required],
    });

    // 按均价表单初始化
    this.averageForm = this.fb.group({
      settleType: [{value: '', disabled: true}],
      max: [{value: '', disabled: true}],
      min: [{value: '', disabled: true}],
      containerNo: ['', Validators.required],
      offerPriceTax: ['', Validators.required],
    });
  }

  listMainSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListMainSearch(data);
  }

  getListMainSearch(data: any): void {
    let url = TRANS_URLS.getOrderTender;
    this.searchParam = data;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
       //   this.longPollingFun();
        }
        this.listLoading = false;
      }
    );
  }
  // private longPollingFun(){
  //   let pollParams = {redisTenders:[]};
  //   this.dataSet.map((y:any)=>{
  //     let o:any = {};
  //     o.tenderNo = y.tenderNo;
  //     o.status = y.status;
  //     pollParams.redisTenders.push(o);
  //   })
  //   if(!pollParams.redisTenders[0]){
  //     return;
  //   }
  //   this.http.post(TRANS_URLS.longPolling,pollParams).then((x:any)=>{

  //     if(x.success){
  //       if(x.data.data){
  //         switch(x.data.data.code){
  //           case '20':
  //           x.data.data.stringList && x.data.data.stringList[0] && (this.dataSet = this.filterData(this.dataSet,x.data.data.stringList));
  //           break;
  //           case '10':

  //           break;
  //           case '30':

  //           break;
  //           default:

  //           break;
  //         }

  //       }

  //     }
  //     window.setTimeout(()=>{
  //       this.longPollingFun && this.longPollingFun();
  //     },1000)
  //   })
  // }
  private filterData(data:any[],list:any[]){
      return data.filter((y:any)=>{
        return list.every((x:string) => y.tenderNo !== x);
      })
  }
  // 货盘明细
  getListPallet(data: any): void {
    let url = TRANS_URLS.selelctPalletItemByContent;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSetPallet = res.data.data || [];
        }
      }
    );
  }

  // 捆包明细
  getListBale(data: any): void {
    const url = TRANS_URLS.selectpalletPackContent;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSetBale = res.data.data || [];
        }
      }
    );
  }

  // 出价表单数据查询结果
  getEntrustBundled(): void {
    const url = TRANS_URLS.getBidTwo;
    this.http.post(url, {tenderNo: this.selectedData.tenderNo,tenderType:this.selectedData.tenderType}).then(
      (res: any) => {
        if (res.success) {
          this.dataSetModal = res.data.data || [];
        }
      }
    );
  }

  // 查看出价结果 流向 品名
  getMsgByFlowRightList(): void {
    this.http.post(TRANS_URLS.getMsgByFlowRightList, {tenderNo: this.selectedData.tenderNo}).then(
      (res: any) => {
        if (res.success) {
          this.dataSetModal = res.data.data || [];
          this.dataSetModal[0] && this.boatForm.patchValue(this.dataSetModal[0]);
          if (this.type === 'CJLX10') {
            if (this.dataSetModal[0]) {
              this.dataSetModal[0] && this.averageForm.patchValue(this.dataSetModal[0]);
              this.averageForm.get('offerPriceTax').setValue(this.dataSetModal[0].offerPriceTax || this.dataSetModal[0].offerPriceTaxNo);
            }

            this.getTenderBidInfo();
          }
        }
      }
    );
  }

  boatName;

  // 出价弹框获取最低出价
  getTenderBidInfo(): void {
    this.http.post(TRANS_URLS.getTenderBidInfo, {tenderNo: this.selectedData.tenderNo}).then(
      (res: any) => {
        if (res.success) {
          this.averageForm.patchValue(res.data.data || res.data.data.data || []);
          this.boatForm.patchValue(res.data.data || res.data.data.data || []);   // 给
          console.log(this.boatForm.value.loadDateStart)
          console.log(typeof this.boatForm.value.loadDateStart)

          //  var startDate = this.boatForm.patchValue(res.data.data.loadDateStart);


          // this.boatForm.loadDateStart = format(this.addenForm.value.loadDateEnd, 'YYYY-MM-DD HH:mm:ss');
          // params.loadDateStart = format(this.addenForm.value.loadDateStart, 'YYYY-MM-DD HH:mm:ss');
          this.averageForm.get('settleType').setValue(this.averageForm.get('settleType').value === 'JSFS10' ? '含税' : '不含税');

          console.log(res.data.data.boatName);
        }
      }
    );
  }

  // 货盘明细 捆包明细查询
  getPalletFind(data?): void {
    this.http.post(urls.palletFind, {palletNo: data.palletNo || ''}).then(
      (res: any) => {
        if (res.success) {
          this.dataSetPallet = res.data.data.palletItemModelList;
          this.dataSetBale = res.data.data.palletPackModelList;
        } else {
          this.dataSetPallet = [];
          this.dataSetBale = [];
        }
      }
    );
  }

  // 按钮点击事件
  btnClick(data: any) {
    if (!this.selectedData) {
      this.tplModal = this.nm.warning(
        {
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        }
      );
      this.destroyTplModal();
      return;
    }

    this.buttonId = data.buttonId;
    this.type = this.selectedData.tenderType || '';

    if (data.buttonId === 'Bid') {
      this.title = '竞价参与管理 > 出价';
      this.boatFormStatus(false);

      switch (this.type) {
        case 'CJLX10': {
          this.averageFormStatus(false);
          this.getTenderBidInfo();
        }
          break;
        case 'CJLX20': {
          this.dataHeader = Utils.deepCopy(this.productNameHeader);
          this.dataHeader[13].edit = true;
          this.dataHeader[14].edit = true;
          this.getEntrustBundled();
        }
          break;
        case 'CJLX30': {
          this.dataHeader = Utils.deepCopy(this.flowHeader);
          this.dataHeader[7].edit = true;
          this.dataHeader[8].edit = true;
          this.getEntrustBundled();
        }
          break;
        default: {
          this.notification.error('提示消息', '选择数据非法');
          return;

        }
      }

      this.creatModal();

      return;
    }
    if (data.buttonId === 'Viewbid') {
      this.title = '竞价参与管理 > 查看出价结果';
      this.buttonId = data.buttonId;
      this.boatFormStatus(true);

      switch (this.type) {
        case 'CJLX10': {
          this.averageFormStatus(true);
          this.getMsgByFlowRightList();
        }
          break;
        case 'CJLX20': {
          this.dataHeader = Utils.deepCopy(this.productNameHeader);
          this.getMsgByFlowRightList();
        }
          break;
        case 'CJLX30': {
          this.dataHeader = Utils.deepCopy(this.flowHeader);
          this.getMsgByFlowRightList();
        }
          break;
        default: {
          this.notification.error('提示消息', '选择数据非法');
          return;

        }
      }

      this.creatModal();

      return;
    }

  }

  // 创建弹窗
  creatModal(): void {
    this.modal = this.nm.create(
      {
        nzTitle: this.title,
        nzContent: this.content,
        nzFooter: this.footer,
        nzClosable: false,
        nzMaskClosable: false,
        nzWidth: this.nzWidth,
        nzOnCancel: () => {
          this.modalCancel.emit();
        }
      }
    );
  }

  // 取消 关闭触发
  close(): void {
    this.modalCancel.emit();
  }

  // 主列表选择数据结果
  updateDataResult(data: any): void {
    this.selectedData = data[0];
    switch (data[0] ? data[0].status : '') {
      case 'JJZZ10': {
        this.btnDisable = {
          Bid: true,
          Viewbid: true,
        };
      }
        break;
      case 'JJZZ20':
      case 'JJZZ30': {
        this.btnDisable = {
          Bid: false,
          Viewbid: true,
        };
      }
        break;
      case 'JJZZ40':
      case 'JJZZ50':
      case 'JJZZ60': {
        this.btnDisable = {
          Bid: true,
          Viewbid: false,
        };
      }

        break;
      default: {
        this.btnDisable = {
          Bid: true,
          Viewbid: true,
        };
      }
    }
    // if (this.selectedData) {
    //   // this.getListPallet({pretenderNo: this.selectedData.pretenderNo});
    //   // this.getListBale({pretenderNo: this.selectedData.pretenderNo});
    //   this.getPalletFind();
    // } else {
    //   this.dataSetPallet = [];
    //   this.dataSetBale = [];
    // }


  }

  // 提示消息弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  // 出价确认
  confirm() {
    for (const i in this.boatForm.controls) {
      this.boatForm.controls[i].markAsDirty();
      this.boatForm.controls[i].updateValueAndValidity();
    }

    if (this.boatForm.status !== 'VALID') {
      return;
    }
    const params = this.boatForm.getRawValue();
    params.loadDateStart = format(params.loadDateStart, 'YYYY-MM-DD HH:mm:ss');
    params.loadDateEnd = format(params.loadDateEnd, 'YYYY-MM-DD HH:mm:ss');

    switch (this.type) {
      case 'CJLX10': {
        for (const i in this.averageForm.controls) {
          this.averageForm.controls[i].markAsDirty();
          this.averageForm.controls[i].updateValueAndValidity();
        }
        if (this.averageForm.status !== 'VALID') {
          return;
        }

        Object.assign(
          params,
          this.averageForm.getRawValue(),
          {
            tenderNo: this.selectedData.tenderNo,
            // tenderNo: 'JJ1812240018',
            bidderCompanyId: this.info.get('USER').companyId
          }
        );
      }
        break;
      case 'CJLX20':
      case 'CJLX30': {
        const blankStatus = this.dataSetModal.every(
          res => {
            return res.offerPriceTax && res.containerNo;
          }
        );

        if (!blankStatus) {
          console.log('未填全');
          this.notification.warning('提示消息', '请填全数据！');
          return;
        }

        Object.assign(
          params,
          {aggregates: this.dataSetModal, tenderNo: this.selectedData.tenderNo}
        );
      }
        break;
      default: {
        this.notification.error('提示消息', '选择数据非法');
        return;

      }
    }

    this.http.post(TRANS_URLS.insertOrderBid, params).then(
      (res: any) => {
        if (res.success) {
          this.notification.success('提示消息', '出价成功！');
          this.modalCancel.emit();

        }
      }
    );

  }

  // 船舶表单状态更改
  boatFormStatus(status: boolean): void {
    this.boatForm.reset({
      boatName: {value: '', disabled: status},
      loadDateStart: {value: '', disabled: status},
      loadDateEnd: {value: '', disabled: status},
      capacity: {value: '', disabled: status},
    });
  }

  averageFormStatus(status: boolean): void {
    this.averageForm.reset({
      settleType: {value: '', disabled: true},
      max: {value: '', disabled: true},
      min: {value: '', disabled: true},
      containerNo: {value: '', disabled: status},
      offerPriceTax: {value: '', disabled: status},
    });
  }

  // 船期日期相关
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.boatForm.get('loadDateEnd').value) {
      return differenceInCalendarDays(startValue, this.today) < 0;
    }

    if (typeof this.boatForm.value.loadDateEnd === "string") {
      let data = new Date(Date.parse(this.boatForm.value.loadDateEnd));
      this.boatForm.value.loadDateEnd = data;
    }
    return (startValue.getTime() > this.boatForm.value.loadDateEnd.getTime()) || (differenceInCalendarDays(startValue, this.today) < 0);
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.boatForm.get('loadDateStart').value) {
      return false;
    }
    if (typeof this.boatForm.value.loadDateStart === "string") {
      let data = new Date(Date.parse(this.boatForm.value.loadDateStart));
      this.boatForm.value.loadDateStart = data;
    }

    return endValue.getTime() <= this.boatForm.value.loadDateStart.getTime();
  };

  onStartChange(date: Date): void {
    this.boatForm.get('loadDateStart').setValue(date);
  }

  onEndChange(date: Date): void {
    this.boatForm.get('loadDateEnd').setValue(date);
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }


  listClick(data: any) {
    // this.getPalletFind(data);
    this.getListPallet(data);
    this.getListBale(data);
  }
  // ngOnDestroy(){
  //   this.longPollingFun = null;
  // }
}
