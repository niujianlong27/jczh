/**
 * 合同管理功能
 */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Router} from '@angular/router';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {Utils} from '../../../../common/util/utils';
import {UploadFiles} from '../../../../common/services/upload-files';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from '../../../../common/services/global-service.service';


/*
 * @Title: order.component.ts
 * @Description:
 * @Created: zhaozeping  2019/2/20
 * @Modified:
 */
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [
    XlsxService
  ]
})
export class OrderComponent implements OnInit {

  // 委托相关信息
  orderData: Array<any> = [];
  itemData: Array<any> = [];
  packData: Array<any> = [];
  columnsArr: any = [];
  listclickArr: any = [];
  tplModal: NzModalRef;
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedOrderData: Array<any> = [];
  modalTitle: any;
  importFile: any;
  implistLoading: boolean = false;
  totalWeightWaybill: any;
  totalWeight: number = 0;
  totalSheet: number = 0;
  totalPrice: number = 0;
  caculateEnameArr1: any = [
    {field: 'totalSheet', tipInfo: '已选件数', tipInfoType: '件', demLength: 3},
    {field: 'totalWeight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalPrice', tipInfo: '已选金额', tipInfoType: '元', demLength: 3},
  ];
  FileUrl: any;
  uploadData: any = {};
  new_multipart_params: any = {};
  order: any = {};
  geturls: string;
  urlList: Array<any> = [];
  tempSearchParam: any = {};

  fileList: Array<any> = [];
  previewImage = '';
  previewVisible = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;

  @ViewChild('tplTitle3') tplTitle3;
  @ViewChild('tplContent3') tplContent3;
  @ViewChild('tplFooter3') tplFooter3;
  public uploadDisabled: boolean;
  validateForm: FormGroup;
  validateForm1: FormGroup;
  deleteVisable: boolean = false;
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];
  modalFormData2: Array<any> = [
    {
      name: '请选择委托单位',
      eName: 'consignorCompanyName',
      type: 'inputModal',
      validateCon: '请选择委托单位',
      require: true,
      readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];
  modalFormData3: Array<any> = [
    {
      name: '销售结案量', eName: 'finishWeight', type: 'text', validateCon: '请输入销售结案量', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '实际发货量', eName: 'totalWeightWaybill', type: 'text', validateCon: '请输入实际发货量', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    }, {
      name: '合同重量', eName: 'totalWeight', type: 'text', validateCon: '请输入合同总重量', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];

  gridOneHeight: string;
  gridTwoHeight: string;

  businessModuleArr: Array<any> = [];
  uploadStatus: boolean = false;
  uploadingFileName: string = '';
  buttonId: string;
  btnLoading: any = {
    valid: false,
    itemValid: false,
    download: false,
    export: false,
    print: false,
    saleClose: false,
    back: false,
    integrated: false,
    pick: false
  };

  constructor(private http: HttpUtilService,
              private globalSer: GlobalService,
              public router: Router,
              private msg: NzMessageService,
              private nm: NzModalService,
              private fb: FormBuilder, private xlsx: XlsxService,
              private nzMess: NzMessageService,
              private nz: NzNotificationService,
              public upload: UploadFiles,
              private  angularHttp: HttpClient) {
  }

  /*
  *  初始化
  */
  ngOnInit() {
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  /**
   * 查询委托
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.tempSearchParam = pageParam;
    this.http.post(TRANS_URLS.SELECT_ORDER, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.orderData = res.data.data && res.data.data.data;
        this.total = res.data.data && res.data.data.total;
        this.orderData.forEach((item, index) => item.rowIndex = index + 1);
        this.itemData = [];
      }
      this.loading = false;
    });
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any): void {

    this.columnsArr = data;
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    this.buttonId = button.buttonId;
    switch (button.buttonId) {
      case 'print':
        this.print();
        break;
      case 'File':
        this.btnFile('chack');
        break;
      case 'Check':
        this.btnCheck();
        break;
      case 'Import':
        this.btnImport();
        break;
      case 'Back':
        this.btnBack();
        break;
      case 'Pick':
        this.btnPick();
        break;
      case 'Integrated':
        this.btnIntegrated();
        break;
      case 'Download':
        this.btnDownload();
        break;
      case 'Match':
        this.btnMatch();
        break;
      case 'saleClose':
        this.btnSaleClose();
        break;
      case 'Export':
        this.btnExport();
        break;
      case 'Valid':
        this.orderValid();
        break;
      case 'ItemValid':
        this.itemValid();
        break;
      case 'AllFile':
        this.allFile();
        break;
      case 'CancelMerger':
        this.CancelMerger(); // 取消合同合并
        break;
      default:
        break;
    }
  }

  /**合同作废 */
  private orderValid() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择合同数据后操作！'
      });
      return;
    }
    const tOrders = this.selectedOrderData.map(x => ({'orderNo': x.orderNo}));
    this.btnLoading.valid = true;
    this.angularHttp.post(TRANS_URLS.invalid, {tOrders: tOrders}).subscribe(
      (res: any) => {
        this.btnLoading.valid = false;
        if (res.code === 100) {
          this.nz.create('success', '提示信息', res.msg, {nzDuration: 3000});
          this.query(this.tempSearchParam);
          this.selectedOrderData = [];
          this.itemData = [];
        }
      }
    );
  }

  /**
   * 明细作废
   */
  private itemValid() {
    if (!this.selectedOrderData || this.selectedOrderData.length !== 1) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条合同数据后操作！'
      });
      return;
    }
    const itemDataChecked = this.itemData.filter(x => x.checked);
    if (itemDataChecked.length < 1) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择合同明细数据后操作！'
      });
      return;
    }
    const tOrderItemModels = itemDataChecked.map(x => ({'orderItemNo': x.orderItemNo}));
    this.btnLoading.itemValid = true;
    this.angularHttp.post(TRANS_URLS.itemValid, {orderNo: this.selectedOrderData[0].orderNo, tOrderItemModels: tOrderItemModels}).subscribe(
      (res: any) => {
        this.btnLoading.itemValid = false;
        if (res.code === 100) {
          this.nz.create('success', '提示信息', res.msg, {nzDuration: 3000});
          this.query(this.tempSearchParam);
          this.selectedOrderData = [];
          this.itemData = [];
        }
      }
    );
  }

  /*
  *   销售结案
  */
  btnSaleClose() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    // this.modalTitle = '结案';
    // if (this.selectedOrderData.length == 1) {
    //   this.saleCloseOne();
    // } else {
    this.saleCloseMore();
    // }
  }

  // /*
  // *    点击一条数据的销售结案
  // */
  // saleCloseOne() {
  //   this.validateForm1 = this.fb.group({});
  //   this.modalFormData3.forEach(item => {
  //     let validatorOpt = [];
  //     item.validators.require && validatorOpt.push(Validators.required);
  //     item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
  //     this.validateForm1.addControl(item.eName, new FormControl('', validatorOpt));
  //   });
  //   this.tplModal = this.nm.create({
  //     nzTitle: this.tplTitle3,
  //     nzContent: this.tplContent3,
  //     nzFooter: this.tplFooter3,
  //     nzWidth: '30%',
  //     nzMaskClosable: true,
  //     nzClosable: true
  //   });
  //   let url = TRANS_URLS.getOrderFinishWeight;
  //   let param: any = this.selectedOrderData[0];
  //   this.http.post(url, param).then((res: any) => {
  //     if (res.success) {
  //       this.validateForm1.patchValue(this.selectedOrderData[0]);
  //       this.totalWeightWaybill = res.data.data;
  //       this.validateForm1.patchValue({totalWeightWaybill: this.totalWeightWaybill});
  //     }
  //   });
  // }

  /*
  *    勾选多条数据的销售结案
  */
  saleCloseMore() {
    let url = TRANS_URLS.saleClosemore;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.btnLoading.saleClose = true;
    this.http.post(url, param).then((res: any) => {
      this.btnLoading.saleClose = false;
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.query(this.tempSearchParam);
        this.destroyTplModal();
        this.selectedOrderData = [];
      }
    });
  }


  /*
   *   价格匹配
   */

  btnMatch() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    for (var i = 0; i < this.selectedOrderData.length; i++) {
      if (this.selectedOrderData[i].businessNature != 'YWXZ30') {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '选中数据必须是一票制状态！'
        });
        return;
      }
    }
    let url = TRANS_URLS.matchDraftOrderList;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.selectedOrderData = [];
        this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: res.data.data
          }
        );
        this.query(this.tempSearchParam);
      }
    });
  }

  /*
  *   下载
  */
  btnDownload() {

    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    for (let i = 1; i < this.selectedOrderData.length; i++) {  //协议号有重复的取第一条
      for (let j = 0; j < i; j++) {
        if (this.selectedOrderData[i].printContractNo == this.selectedOrderData[j].printContractNo) {
          this.selectedOrderData.splice(i, 1);
          i--;
          break;
        }
      }
    }
    this.selectedOrderData.forEach(item => {
      let salesDept: any = item.salesDept || '';
      let consignorCompanyName: any = item.consignorCompanyName || [];
      let orderNo: any = item.orderNo || '';
      let printContractNo = item.printContractNo || '';
      let salesName: string = item.salesName ? '-' + item.salesName : '';
      let url: any = TRANS_URLS.printOrder + `?orderNo=${item.orderNo}&requestCompanyId=${item.companyId}`;
      this.btnLoading.download = true;
      this.angularHttp.get(url, {responseType: 'blob'}).subscribe((res: any) => {
        this.btnLoading.download = false;
        var blob = new Blob([res], {type: 'application/pdf'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `${printContractNo}-${consignorCompanyName}${salesName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.selectedOrderData[0].checked = false;
        this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'order', checked: false});
      });
    });

  }

  /*
  *   一票制
  */
  btnIntegrated() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    this.selectedOrderData.map((item: any) => {
      item.consignorCompanyId = this.order.consignorCompanyId;
    });
    let url = TRANS_URLS.integratedOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.btnLoading.integrated = true;
    this.http.post(url, param).then((res: any) => {
      this.btnLoading.integrated = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '修改成功', {nzDuration: 3000});
        //  this.query({});
        this.query(this.tempSearchParam);
        this.order = {};
        this.destroyTplModal();
      }
    });


  }

  /*
  *   自提
  */
  btnPick() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    let url = TRANS_URLS.pickOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.btnLoading.pick = true;
    this.http.post(url, param).then((res: any) => {
      this.btnLoading.pick = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '修改成功', {nzDuration: 3000});
        // this.query({});
        this.query(this.tempSearchParam);
        this.destroyTplModal();
      }
    });
  }

  /*
  *  退回
  */
  btnBack() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    let url = TRANS_URLS.backOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.btnLoading.back = true;
    this.http.post(url, param).then((res: any) => {
      this.btnLoading.back = false;
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        // this.query({});
        this.query(this.tempSearchParam);
      }
    });
  }

  /**
   * 批量附件上传
   */
  private allFile() {
    this.modalTitle = '批量附件上传';
    this.uploadDisabled = true;
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: true,
      // nzAfterClose
    });
    this.tplModal.afterClose.subscribe(res => {
      this.fileList = [];
      this.uploadStatus = false;
      this.uploadDisabled = false;
      this.uploadingFileName = '';
    });
  }

  /*
  *     存档
  */
  btnFile(data?: any) {

    if (data === 'chack') {
      if (!this.selectedOrderData || this.selectedOrderData.length !== 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择条一条数据操作！'
        });
        return;
      }
      this.getviewContractDetail(this.selectedOrderData[0].orderNo);
    } else {

      this.getviewContractDetail(this.orderData[data].orderNo);
    }

    this.modalTitle = '附件上传';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: true,
      // nzAfterClose
    });
    this.tplModal.afterClose.subscribe(res => {
      this.fileList = [];
      this.uploadStatus = false;
      this.uploadingFileName = '';
    });
  }

  getviewContractDetail(data) {
    let params = {};
    params['orderNo'] = data;
    this.http.post(TRANS_URLS.viewContractDetail, params).then(
      (res: any) => {
        if (res.success) {
          if (res.data.data && res.data.data.contractPic) {
            this.urlList = res.data.data.contractPic.split(',');
            this.fileList = this.urlList.map((item, index) => {
              return ({
                uid: index,
                url: item,
                status: 'done',
                name: this.upload.getRealFileName(item)
              });
            });
          }
        }
      }
    );

  }

  /*
  *     查看
  */
  btnCheck() {
    if (!this.selectedOrderData || this.selectedOrderData.length !== 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    //
    // // if(this.selectedOrderData[0].settleFlag === 'FYDJ20' || this.selectedOrderData[0].priceFlag === 'HJBJ20'){
    // //   this.msg.error("该委托已登记运费或已核价不能修改");
    // //   return;
    // // }
    this.router.navigate(['/system/trans/order-manage/order-add'], {
      queryParams: {
        'operateType': 'view',
        'orderNo': this.selectedOrderData [0].orderNo
      }
    });
  }

  /*
  *   结案信息导入
  */

  btnImport() {
    this.modalTitle = '结案信息导入';
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: true
    });
  }

  /*
  *   获取上传得到的url
  */
  getFileUrl(data: any) {
    if (data.file.status === 'done') {
      // if (this.uploadingFileName === data.file.name) {
      this.uploadStatus = false;
      this.uploadDisabled = false;
      // }
      this.fileList = this.fileList.map(item => (item.originFileObj ? item.originFileObj : item));
      // this.FileUrl = data.file.originFileObj ? data.file.originFileObj.url : '';
    }
    if (data.file.status === 'removed') {
      if (this.uploadingFileName === data.file.name) {
        this.uploadStatus = false;
      }
      if (!data.fileList.length && this.buttonId === 'AllFile') {
        this.uploadDisabled = true;
      }
    }
    if (data.file.status === 'uploading') {
      this.uploadStatus = true;
      this.uploadingFileName = data.file.name;
    }

  }

  /**
   * 选择excel
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  /**
   * 导入弹窗确定
   */
  importConfirm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    this.implistLoading = true;
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      // if(!this.validateData(_data)){
      //   // this.nzMess.error("合同号不能为空！");
      //   this.implistLoading = false;
      //   return;
      // }
      //this.removeEmpty(_data);
      this.excelFilter(_data);

    });
  }

  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data: any) {
    let url = TRANS_URLS.importOrder;
    let param: any = {tOrders: []};
    // param.contractList = this.updateData;
    let eNameHeader: any = [];
    // console.log(data);
    data[1].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    // console.log(eNameHeader);
    for (let i = 2; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.tOrders.push(temp);
    }
    param.tOrders.forEach((item) => {
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });

    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});

        this.query(this.tempSearchParam);
      }
    });

  }

  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }

  /*
  *    去空
  */
  removeEmpty(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] == ' ' || data[i] == null || typeof (data[i]) == 'undefined') {
        data.splice(i, 1);
        i = i - 1;

      }
    }
  }

  /**
   * 打印
   */
  print() {
    if (!this.selectedOrderData || this.selectedOrderData.length !== 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    let url: any = TRANS_URLS.printOrder + `?orderNo=${this.selectedOrderData[0].orderNo}&requestCompanyId=${this.selectedOrderData[0].companyId}`;
    this.btnLoading.print = true;
    this.angularHttp.get(url, {responseType: 'blob'}).subscribe((res: any) => {
      this.btnLoading.print = false;
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);

      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 修改
   */
  update() {
    // if(!this.selectedOrderData || this.selectedOrderData.length !== 1){
    //   this.msg.error("请选择选择一条委托记录！");
    // }
    //
    // // if(this.selectedOrderData[0].settleFlag === 'FYDJ20' || this.selectedOrderData[0].priceFlag === 'HJBJ20'){
    // //   this.msg.error("该委托已登记运费或已核价不能修改");
    // //   return;
    // // }
    // this.router.navigate(['/system/trans/order-manage/order-add'], {queryParams: {'operateType': 'update', 'orderNo': this.selectedOrderDataedOrderData [0].orderNo}});
  }

  /**
   * 作废
   */
  delete() {
    // if(!this.selectedOrderData || this.selectedOrderData.length === 0){
    //   this.msg.error("请选择至少选择一条委托记录！");
    //   return;
    // }
    // this.selectedOrderData.forEach((item, index) => item.rowIndex = (index+1));
    // const errArr = this.selectedOrderData.filter(item => item.status !== 'WTZT10');
    // if(errArr.length > 0){
    //   this.msg.error(`选中的第${errArr.map(item => item.rowIndex).join(",")}已派单不能作废！`);
    //   return;
    // }
    //
    // this.deleteVisable = true;
  }

  // modalConfirmResult(flag: any) {
  //   if (flag.type === 'cancel') {
  //     this.deleteVisable = false;
  //   } else {
  //
  //     this.http.post(TRANS_URLS.DELETE_ORDER, { tOrders: this.selectedOrderData }).then(
  //       (res: any) => {
  //         if (res.success) {
  //           this.msg.success(`作废成功！作废委托${this.selectedOrderData.length}条`);
  //           this.selectedOrderData = [];
  //           this.query({});
  //           this.deleteVisable = false;
  //         }
  //       }
  //     );
  //   }
  // }


  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.orderData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        data.checked = !data.checked;
      }
    });
    this.selectedOrder(this.orderData.filter(item => {
      return item.checked;
    }));
  }


  /**
   * 选中数据
   * @param data
   */
  selectedOrder(data: any) {
    this.selectedOrderData = data;
    this.totalWeight = this.selectedOrderData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalSheet = this.selectedOrderData.map(item => item.totalSheet).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPrice = this.selectedOrderData.map(item => item.totalPrice).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    if (this.selectedOrderData.length > 0) {
      this.queryItem();
      this.queryPack();
    } else {
      this.itemData = [];
      this.packData = [];
    }
  }


  /**
   * 根据委托查询委托明细信息
   */
  queryItem() {
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId
      };
    });
    param.tOrders = arr;
    this.http.post(TRANS_URLS.SELECT_ORDERITEM_BY_ORDER, param).then(
      (res: any) => {
        if (res.success) {
          this.itemData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据委托查询委托捆包信息
   */
  queryPack() {
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId
      };
    });
    param.tOrders = arr;
    this.http.post(TRANS_URLS.SELECT_ORDERPACK_BY_ORDER, param).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
        }
      }
    );
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();

  }

  /*
  *   将url保存
  */
  importConfirm1() {

    /*  if (!this.selectedOrderData || this.selectedOrderData.length !== 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据后操作！'
        });
        return;
      }*/
    if (this.fileList.length == 0) {
      this.msg.error('文件不能为空');
      return;
    }
    let urls: Array<any> = [];

    if (this.uploadStatus) {
      this.nz.warning('提示消息', '请等待上传结束！');
      return;
    }
    urls = this.fileList.map(item => {
      return item.url;
    });
    let param: any = {};
    let url: string = null;
    if (this.buttonId === 'AllFile') {
      url = TRANS_URLS.uploadOrderList;
      const tOrderModelList = urls.map(x => ({contractPic: x}));
      param.tOrderModelList = tOrderModelList;
    } else {
      url = TRANS_URLS.uploadOrder;
      param.contractPic = urls.join();
      param.orderNo = this.selectedOrderData[0].orderNo;
      param.printContractNo = this.selectedOrderData[0].printContractNo;
    }

    // if (!param.contractPic) {
    //   this.nz.warning('提示消息','请等待上传结束！');
    //   return;
    // }
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.selectedOrderData = [];
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', '存档成功', {nzDuration: 3000});
        //  this.query({});
        this.query(this.tempSearchParam);
      }
    });
  }

  /*
  *   下载保存的文档
  */
  See(data: any, i: number) {
    let url = TRANS_URLS.seeOrder;
    let param: any;
    param = this.orderData[i];
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        //   this.query({});
        this.query(this.tempSearchParam);
        let a = document.createElement('a');
        a.href = res.data.data.contractPic;
        a.click();
      }
    });
  }


  /**
   * 公司弹框设置公司ID
   * @param data
   * @param fieldName
   */
  setCompanyId(data: any, fieldName: string, fieldTextName?: string) {
    this.order[fieldName] = data.inpValue;
    if (fieldTextName) {
      this.order[fieldTextName] = data.inpName;
    }
  }


  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

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

  /*
  *    销售结案一条
  */
  handleOk1() {
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status === 'INVALID') {
      return;
    }

    let url = TRANS_URLS.saleCloseOne;
    let param: any = {};
    param = this.validateForm1.value;
    param.orderNo = this.selectedOrderData[0].orderNo;
    if (Number(param.totalWeightWaybill) != Number(param.finishWeight)) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '实际发货量和销售结案量必须保持一致！'
      });
      return;
    }
    this.implistLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '结案成功', {nzDuration: 3000});
        //this.query({});
        this.query(this.tempSearchParam);
        this.order = {};
        this.destroyTplModal();
        this.selectedOrderData = [];
      }
    });
  }

  /*
  *       导出
  */
  btnExport() {
    let url: any = TRANS_URLS.exportOrder;
    this.btnLoading.export = true;
    this.angularHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      this.btnLoading.export = false;
      let blob = new Blob([res], {type: 'application/pdf'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同管理.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  CancelMerger() { //取消合同合并
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    let params = {tOrderModel: []};
    params.tOrderModel = this.selectedOrderData.map(item => {
      return {
        companyId: item.companyId,
        printContractNo: item.printContractNo
      };
    });
    this.http.post(TRANS_URLS.cancelMerger, params).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`取消合同合并成功`);
          this.selectedOrderData = [];
          this.query({});
        }
      }
    )

  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  fileRemove = (file: UploadFile): (boolean | Observable<boolean>) => {
    return new Observable<boolean>(
      res => {
        this.nm.confirm(
          {
            nzTitle: '提示消息',
            nzContent: '是否确认删除文件？',
            nzOnOk: () => {
              res.next(true);
            },
            nzOnCancel: () => {
              res.next(false);
            }
          }
        );
      }
    );
  };

}

