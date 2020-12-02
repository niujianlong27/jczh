import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {localUrls} from '@model/localUrls';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {isAlphanumeric, isNum} from '@validator/validator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {contractUrl} from '@model/contractUrl';
import {Utils} from '@util/utils';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {format as dateformat} from 'date-fns';
import {UploadFiles} from '@service/upload-files';
import {Observable} from 'rxjs';
import {ImgViewerService} from '@component/img-viewer/img-viewer.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-collect-information',
  templateUrl: './collect-information.component.html',
  styleUrls: ['./collect-information.component.css'],
  providers: [
    XlsxService
  ]
})
export class CollectInformationComponent implements OnInit {
  tplModal: NzModalRef;
  isMutli: boolean = true;
  dataSet: Array<any> = [];
  dataSetList: Array<any> = [];
  totalPages: Number = 1;
  pageSize: Number = 30;
  userHeader: Array<any> = [];
  listLoading: boolean = false;
  // addData:any = [];
  modalTitle: any = '收票管理 > 导入';
  importFile: any;
  implistLoading: boolean = false;
  columnsArr: any;
  priceTotal: number = 0;
  taxPriceTotal: number = 0;
  companyFeeArr: Array<any> = [];
  segmentList: Array<any> = []; //业务板块数据
  searchCache: any; //搜索框数据缓存
  segmentMap: Map<string, string> = new Map<string, string>();

  childlistLoading: boolean = false;
  childrenDataSet: Array<any> = [];
  childrenDataSetList: Array<any> = [];
  //currentSelectedListData: Array<any> = []; //点击列表当前条数据
  multiNo: any;

  @ViewChild('fileInput') fileInput: ElementRef; // 隐藏文件选框
  @ViewChild('tplTitle') tplTitle: TemplateRef<any>;
  @ViewChild('tplContent') tplContent: TemplateRef<any>;
  @ViewChild('tplFooter') tplFooter: TemplateRef<any>;

  @ViewChild('urlImg') urlImg: TemplateRef<any>; //图片预览

  fileList: Array<any> = []; //扫描文件列表
  uploadStatus: boolean = false;
  uploadDisabled: boolean;
  uploadingFileName: string = '';
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('updateFooter') updateFooter: TemplateRef<any>;
  fileRemove = (): (boolean | Observable<boolean>) => {
    return new Observable<boolean>(
      res => {
        this.nm.confirm(
          {
            nzTitle: '提示消息',
            nzContent: '是否确认删除文件？',
            nzOnOk: () => {
              if (this.fileList.length === 1) {
                this.uploadDisabled = true;
              }
              res.next(true);
            },
            nzOnCancel: () => {
              res.next(false);
            }
          }
        );
      }
    );
  }; //文件移除操作

  private searchData: any = {};
  templateUrl: string = 'https://another2.oss-cn-hangzhou.aliyuncs.com/seadoc/20191023090427_收票导入模板.xlsx';

  validateForm: FormGroup;
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
        require: false,
        pattern: false
      }
    },
  ];


  importColumns: Array<any> = [
    {ename: 'invoiceDate', cname: '开票日期', required: true},
    {ename: 'segmentName', cname: '业务板块', required: true},
    {ename: 'invoiceCompanyName', cname: '开票单位', required: true},
    {ename: 'commodityUnit', cname: '单位', required: true},
    {ename: 'commodityPrice', cname: '单价', required: true},
    {ename: 'commodityNum', cname: '数量', required: true},
    {ename: 'feeName', cname: '费用类型', required: true},
    {ename: 'amountNoTax', cname: '不含税金额', required: true, validator: 'number'},
    {ename: 'tax', cname: '税率', required: true},
    {ename: 'taxAmount', cname: '税额（元）', required: true},
    {ename: 'invoiceAmount', cname: '发票金额（元）', required: true},
    {ename: 'invoiceTitleName', cname: '收票单位'},
    {ename: 'invoiceNo', cname: '发票号码', required: true},
    {ename: 'gggggg', cname: '收到日期', required: false},
    {ename: 'invoiceDesc', cname: '发票备注', required: false},
    {ename: 'payFlag', cname: '付款标记', required: false},
  ];
  matchCheckArr: Array<any> = [
    {
      name: '已核对',
      value: 'H001'
    },
  ];

  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private nn: NzNotificationService,
              private fb: FormBuilder,
              private xlsx: XlsxService,
              private nzMess: NzMessageService,
              private nz: NzNotificationService,
              public upload: UploadFiles,
              private imgService: ImgViewerService,
              private angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
    //  this.listSearch({page: 1, length: this.pageSize});
    this.getCompanyFee();
  }

  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = this.pageSize || data.length; // 如果是自己写的页码条数事件就把用自己定义的变量，如果不是自己的就用组件的
    this.searchData = {...data};
    this.getList(data);
  }

  getUserHeader(data: any): void {
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg;
    this.userHeader = data;
    console.log(this.userHeader)
  }

  getList(data: any): void {
    let url = localUrls.collectInformationGetUrl;
    this.listLoading = true;
    this.priceTotal = 0;
    this.taxPriceTotal = 0;
    this.dataSet = [];
    this.totalPages = 0;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        //this.dataSet = res.data.data && res.data.data.data || [];
        this.dataSetList = res.data.data && res.data.data.data || [];

        this.dataSetList.forEach(
          value => value.editstate = 0
        );

        this.dataSetList.map(item => {
          //console.log(item.multi)
          item.cellClassName = {};
          item.template = false;
          if (item.multi == 1) {
            item.feeName = undefined;
            item.commodityAmount = undefined;
            item.commodityTaxRate = undefined;
            item.taxAmount = undefined;
            item.commodityUnit = undefined;
            item.commodityNum = undefined;
            item.commodityPrice = undefined;
            item.commodityType = undefined;
            item.template = true;
            item.cellClassName.invoiceSerialNumber = 'invoiceSerialNumber-multi';
          } else {
            item.cellClassName.invoiceSerialNumber = 'invoiceSerialNumber-sig';
          }
        });
        //console.log(this.dataSetList)
        // this.dataSet.forEach(
        //   value =>  value.multi=this.multiNo
        // );
        // console.log(this.multiNo)
        // if( this.multiNo===1 ){
        //   this.dataSet.forEach(
        //     value =>  value.feeName=undefined
        //   );
        //   this.dataSet.forEach(
        //     value => value.commodityAmount=undefined
        //   );
        //   this.dataSet.forEach(
        //     value => value.commodityTaxRate=undefined
        //   );
        //   this.dataSet.forEach(
        //     value => value.taxAmount=undefined
        //   );
        // }
        this.dataSet = this.dataSetList;
        //console.log(this.dataSet)
        this.totalPages = res.data.data && res.data.data.total;
        //this.setColor();
      }
    });
  }

  getPageIndex(page: any): void {
    this.searchData.page = page;
    //this.listSearch({page: page, length: this.pageSize});
    this.listSearch({...this.searchData});
  }

  getPageSize(pageSize: any): void {
    this.pageSize = pageSize;
    // this.listSearch({page: 1, length: this.pageSize});
    this.searchData.page = 1;
    this.searchData.length = this.pageSize;
    this.listSearch({...this.searchData});
  }

  gridOneHeight: string;
  gridTwoHeight: string;

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  //invoiceNumber:any;

  setColor() {
    console.log(this.selectedData);
    this.selectedData.map(item => {
      //this.invoiceNumber=item.invoiceSerialNumber;
      item._bgColor = '#82c3de';
      // if (item.multi==1) {
      //
      //   item._bgColor = '#5d65de';
      // } else {
      //   item._bgColor = " ";
      // }
    });
  }

  selectedData: Array<any> = [];//存储勾选中的数据

  selectData(data: any[]) {
    this.priceTotal = data.map((x: any) => x.invoiceAmount).reduce((a, b) => Number(a) + Number(b || 0), 0);
    this.taxPriceTotal = data.map((x: any) => x.taxAmount).reduce((a, b) => Number(a) + Number(b || 0), 0);

    this.selectedData = data;
    if (this.selectedData.length !== 0) {
      //this.childrenListSearch();
      this.selectedData.forEach(
        res => {
          if (res.multi == 1) {
            this.childrenListSearch();
          }
        }
      );
    } else {
      this.childrenDataSet = [];
    }

  }

  children_totalPages: Number = 1;

  childrenListSearch(): void {
    //console.log(215)
    this.childrenDataSet = [];
    this.children_totalPages = 1;
    this.childlistLoading = true;
    let url = localUrls.collectGetUrl;
    const param = {
      items: [],
    };

    this.selectedData.forEach(
      res => {
        if (res.multi == 1) {
          param.items.push({invoiceId: res.invoiceId});
          param.items.push({invoiceNo: res.invoiceNo});
        }
      }
    );
    //console.log(param)
    //console.log(this.selectedData)
    //this.selectedData && this.http.post(url, param).then(
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          //console.log(res)
          this.childlistLoading = false;
          this.childrenDataSet = res.data.data.items || [];

        }
      }
    );
    // this.dataSet.map(item => {
    //   if (item.multi !=1) {
    //     this.childrenDataSet = [];
    //   }
    // });
  }

  btnAdd(): void {
    //console.log(314)
    const addData: any = {};
    if (this.segmentMap.size === 0) {
      this.segmentList.forEach(
        value => this.segmentMap.set(value.name, value.value)
      );
    }
    if (this.companyFeeArr) {
      this.userHeader.forEach(
        res => {
          if (res.colEname === 'feeName') {
            res.apiParameter.optionList = [];
            res.apiParameter.optionList = [...this.companyFeeArr];
            console.log(this.companyFeeArr);
          }

          if (res.colEname === 'matchCheck') {
            res.apiParameter.optionList = [];
            res.apiParameter.optionList = this.matchCheckArr;
            console.log(this.matchCheckArr);
          }

          if (res.colEname === 'segmentName') {
            res.apiParameter.optionList = [...this.segmentList];
            this.searchCache.controlArray.some(
              value => {
                if (value.parameter === 'segmentName') {
                  addData.segmentName = this.segmentMap.get(value.value1);
                  return true;
                }
              }
            );
          }
        }
      );
    }
    this.dataSet.unshift(addData);
    // this.userHeader.map((item) => {
    //   this.dataSet[0][item.colEname] = '';
    // });
    this.dataSet[0].EDIT = true;
    // this.addData.push(this.dataSet[0]);
    this.dataSet = [...this.dataSet];
  }

  btnClick(data: any): void {
    //console.log(349)
    //console.log(data)
    const selectArr = this.dataSet.filter(x => x.checked);
    //switch (data.type.buttonId) {
    switch (data.buttonId) {
      case 'insert': {//保存 按钮
        this.btnInsert(selectArr);
      }
        break;
      case 'Import': {   //导入
        //console.log(360)
        this.btnImport();
      }
        break;
      case 'upload': {    //扫描
        this.btnUpdate(selectArr);
      }
        break;
      case 'edit': {  //修改
        this.btnEdit(selectArr);
      }
        break;
      case 'export': {  //导出
        this.btnExport();
      }
        break;
      case 'Add': {    //新增
        //console.log(378)
        this.btnAdd();
      }
        break;
    }

  }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit(data: any): void {
    //console.log((data));

    if (data.eName === 'invoiceCompanyName') {
      this.dataSet[data.index].invoiceCompanyName = data.inpName;
      this.dataSet[data.index].invoiceCompanyId = data.inpValue;
    }
    if (data.eName === 'deliverCompanyName') {
      //console.log(data);
      this.dataSet[data.index].deliverCompanyId = data.inpValue;
      this.dataSet[data.index].deliverCompanyName = data.inpName;
    }
  }

  modelChange(data: any): void {
    switch (data.header.colEname) {
      case 'invoiceSerialNumber':
        data.input.value = '';
        data.data.invoiceSerialNumber = '';
        break;
      case 'invoiceAmount':
      case 'taxAmount':
        // if (!isNum(data.val)) {
        //   data.input.value = '';
        //   data.data[data.header.colEname] = '';
        // }
        break;
      case 'invoiceTax':
      case 'invoiceId':

        if (!isAlphanumeric(data.val)) {
          data.input.value = '';
          data.data[data.header.colEname] = '';
        }

    }

  }

  /**
   * 导入按钮
   */
  btnImport(): void {
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
      nzClosable: false
    });
  }

  queryParameterList: any = {};

  /**
   * 导出按钮
   */
  btnExport(): void {
    // const param = {
    //   queryParameterList: [],
    // };
    // this.dataSet.forEach(item => {
    //   param.queryParameterList.push({invoiceSerialNumber: item.invoiceSerialNumber});
    //   param.queryParameterList.push({segmentName: item.segmentName});
    //   param.queryParameterList.push({invoiceCompanyName: item.invoiceCompanyName});
    // });
    // console.log(param)
    this.angularHttp.post(localUrls.exportSave, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `发票信息.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }

  /**
   * 选择excel
   */
  selectFile(): void {
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
  importConfirm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === 'INVALID') {
      return;
    }

    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    this.implistLoading = true;
    this.xlsx.import(this.importFile).then(res => {
      const keys = Object.keys(res);
      if (!keys || keys.length == 0) {
        this.implistLoading = false;
        this.nzMess.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      const data = res[keys[0]];
      console.log(data)
      if (!data || data.length < 2) {
        this.implistLoading = false;
        this.nzMess.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      // 模板必要字段验证
      if (this.validateColumns(data[0]) === false) {
        this.implistLoading = false;
        return;
      }
      // 导入数据校验
      const recList = this.toSettleRec(data);
      if (this.validateData(recList) === false) {
        this.implistLoading = false;
        return;
      }

      this.http.post(localUrls.importSave, {tPaymentInvModelList: recList}).then((res: any) => {
        if (res.success) {
          this.tplModal.destroy();
          this.implistLoading = false;
          // this.isVisible = false;
          this.nzMess.success(`导入收款登记信息成功!共导入${recList.length}条`);
          // this.listSearch({page: 1, length: this.pageSize});
          this.searchData.page = 1;
          this.listSearch({...this.searchData});
        }
        this.implistLoading = false;
        // this.importLoading = false;
      });

    });
  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    if (head.length != receiptHead.length) {
      flag = false;
    }

    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        return;
      }
    });
    if (!flag) {
      this.nzMess.remove();
      this.nzMess.error('上传数据格式不正确，请下载标准模板!');
      this.implistLoading = false;
    }
    return flag;
  }


  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data: any): void {
    //console.log(data);
    let url = contractUrl.importSales;
    let param = {saledList: []};
    // param.contractList = this.updateData;
    let eNameHeader: any = [];
    data[1].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 2; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.saledList.push(temp);
    }


    param.saledList.forEach((item) => {
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });

    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      //console.log(res);
      if (res.success) {
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.searchData.page = 1;
        this.listSearch({...this.searchData});
        // this.listSearch({page: 1, length: this.pageSize});
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
  };


  /**
   * 列头验证
   * @param header
   */
  validateColumns(header: Array<any>): boolean {
    const invalid = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (invalid && invalid.length > 0) {
      // this.nzMess.error(`导入失败！模板错误："${invalid.map(item => item.cname).join('","')}"字段必须存在！`);
      this.nzMess.error(`上传数据格式不正确，请下载标准模板!`);
      return false;
    }
    return true;
  }

  /**
   * 将csv数组转为收款登记
   * @param data
   */
  toSettleRec(data: any): Array<any> {
    console.log(data)
    if (!data || data.length < 2) {
      this.nzMess.error('上传数据格式不正确，请下载标准模板!');
      return;
    }
    let dataArray = [];
    const header = data[0].map(item => this.getEname(item));
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => obj[key] = data[i][index]);
      dataArray.push(obj);
    }
    console.log(dataArray)
    dataArray = dataArray.filter(item => item.invoiceDate);
    // 将日期和时间拼接，并转为YYYY-MM-DD HH:mm:ss格式
    dataArray.forEach(item => item.invoiceDate = dateformat(`${item.invoiceDate}`, 'YYYY-MM-DD HH:mm:ss'));
    return dataArray;
  }

  /**
   * 根据列配置的中文名称获取英文名称
   * @param cname
   */
  getEname(cname: string): string {
    if (!cname) {
      return cname;
    }
    const col = this.importColumns.find(item => item.cname === cname.trim());
    if (col) {
      return col.ename;
    }
    return cname;
  }

  /**
   * 导入数据校验
   * @param data
   */
  validateData(data: Array<any>): boolean {
    const invalidColumn = this.importColumns.filter(item => item.required).filter(col => {
      return data.some((item, index) => {
        // 如果没有值或者值去空格后长度为0，返回true
        if (!item[col.ename] || item[col.ename].trim().length == 0) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 2})`;
          return true;
        }
        item[col.ename] = item[col.ename].trim();
        if (col.validator === 'number') {
          item[col.ename] = item[col.ename].replace(/,/g, '');
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
        }
        return false;
      });
    });

    if (invalidColumn && invalidColumn.length > 0) {
      // this.nzMess.error(`导入失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(',')}的数据`);
      this.nzMess.error(`上传数据格式不正确，请下载标准模板!`);
      return false;
    }
    return true;
  }

  /**
   * 弹窗取消
   */
  handleCancel(): void {
    this.tplModal.destroy();

  }

//发票类型
  getCompanyFee(): void {
    this.http.post(localUrls.selectCompanyFee, {}).then(
      res => {
        if (res.success) {

          res.data.data.data && res.data.data.data.forEach(
            res => {
              const tmp = {name: '', value: ''};
              tmp.value = res.feeId;
              tmp.name = res.feeName;
              this.companyFeeArr.push(tmp);
              //console.log(this.companyFeeArr)
            }
          );
        }
      }
    );
  }

  /**
   * 查询数据返回
   * @param param
   */
  searchComponent(param) {
    //console.log(param)
    this.searchCache = param;
    if (this.searchCache.controlArray.length > 0) {
      this.searchCache.controlArray.some(
        value => {
          if (value.parameter === 'segmentName') {
            this.segmentList = value.apiParameter.optionList;
            // console.log(this.segmentList)
            return true;
          }
        }
      );
    }
  }

  /**
   * 扫描上传
   */
  btnUpdate(dataList: Array<any>): void {
    this.uploadDisabled = true;
    // if (dataList.length === 0) {
    //   this.nn.warning('提示消息', '请选择数据后操作！');
    //   return;
    // }
    // this.fileList = this.upload.getFileList(dataList[0].a || []) || [];
    this.tplModal = this.nm.create({
      nzTitle: '扫描上传',
      nzContent: this.updateContent,
      nzFooter: this.updateFooter,
      nzMaskClosable: false,
      nzWidth: '30%',
      nzClosable: false
    });
    this.tplModal.afterClose.subscribe(
      () => {
        this.fileList = [];
      }
    );
  }

  /*
 *   获取上传得到的url
 */
  getFileUrl(data: any) {
    //console.log(data)
    if (this.fileList.length === 0) {
      this.uploadStatus = true;
      this.uploadDisabled = true;
    }
    if (data.file.status === 'done') {
      // if (this.uploadingFileName === data.file.name) {
      this.uploadStatus = false;
      this.uploadDisabled = false;
      // }
      console.log(this.fileList);
      this.fileList = this.fileList.map(item => (item.originFileObj ? item.originFileObj : item));
      //console.log(this.fileList)
      // this.FileUrl = data.file.originFileObj ? data.file.originFileObj.url : '';
    }
    if (data.file.status === 'removed') {
      if (this.uploadingFileName === data.file.name) {
        this.uploadStatus = false;
      }

    }
    if (data.file.status === 'uploading') {
      this.uploadStatus = true;
      this.uploadDisabled = true;
      this.uploadingFileName = data.file.name;
    }

  }

  /**
   * 上传请求
   */
  updateRequest(): void {
    const segmentData = this.searchData.queryParameterList.filter(
      value => value.parameter === 'segmentName'
    );
    //console.log(segmentData)
    const param: any = {
      segmentName: '',
      imgUrls: []
    };
    param.segmentName = segmentData[0].value1;
    this.fileList.forEach(
      value => {
        param.imgUrls.push(value.url);
      }
    );
    //console.log(param)
    this.uploadDisabled = true;
    this.http.post(localUrls.invoiceScanAndUpload, param).then(
      res => {
        if (res.success) {
          console.log(res);
          this.tplModal.destroy();
          this.searchData.page = 1;
          this.listSearch({...this.searchData});
          //this.nzMess.success('扫描上传成功！');
          this.nzMess.success(res.data.data);
        }
      }
    );
  }

  /**
   * 上传请求取消
   */
  updateCancel(): void {
    this.tplModal.destroy();
    this.fileList = [];
  }

  /**
   * 表单图片预览
   * @param e
   * @param data
   */
  getView(e: MouseEvent, data: string) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls, initRotate: 180});
    }
  }

  /**
   * 点击修改
   */
  btnEdit(param: Array<any>): void {
    console.log(param);
    param.forEach(
      value => {
        value.editstate = 1;

      }
    );
    if (this.companyFeeArr) {
      this.userHeader.forEach(
        res => {
          if (res.colEname === 'matchCheck') {
            res.apiParameter.optionList = [];
            res.apiParameter.optionList = this.matchCheckArr;
          }
        }
      );
    }
    this.setColor();
  }

  /**
   * 点击保存
   */
  btnInsert(args: Array<any>): void {
    console.log(943);
    console.log(args);
    if (args.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }

    let canBeSave = args.every(element => element.EDIT);//判断当前选中数据是否都是新增的
    if (canBeSave) {
      console.log(canBeSave);
      let status = args.every(value => value.invoiceNo && value.deliverCompanyName && value.invoiceId && value.invoiceDate);
      if (!status) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请填写必填字段后操作！'
        });
        this.destroyTplModal();
        return;
      }
      args.forEach(
        res => {
          res.feeId = res.feeName;
          res.segmentId = res.segmentName;
          this.companyFeeArr.forEach(
            value => {
              if (value.value == res.feeId) {
                res.feeName = value.name;
              }
            });
          console.log(res.matchCheck);
          if (res.matchCheck) {
            this.matchCheckArr.forEach(
              val => {
                res.matchCheck = val.name;
                console.log(res.matchCheck);
              });
          }
          // this.matchCheckArr.forEach(
          //   val => {
          //       res.matchCheck=val.name
          //   });
          args.forEach(item => item.invoiceDate = dateformat(`${item.invoiceDate}`, 'YYYY-MM-DD HH:mm:ss'));
        }
      );

    } else {
      args.forEach(
        res => {
          console.log(res.matchCheck);
          if (res.matchCheck) {
            this.matchCheckArr.forEach(
              val => {
                res.matchCheck = val.name;
                console.log(res.matchCheck);
              });
          }
        }
      );

    }
    let url = localUrls.collectInformationSaveUrl;
    let param = {tPaymentInvModels: args};
    //console.log(param)
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nn.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        //this.listSearch({page: 1, length: this.pageSize});
        this.searchData.page = 1;
        this.listSearch({...this.searchData});
      }
    });

  }

}
