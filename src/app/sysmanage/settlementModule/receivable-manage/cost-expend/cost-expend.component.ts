import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {localUrls} from '@model/localUrls';
import {Utils} from '@util/utils';
import {Observable} from 'rxjs';
import {ImgViewerService} from '@component/img-viewer/img-viewer.service';
import {UploadFiles} from '@service/upload-files';

@Component({
  selector: 'app-cost-expend',
  templateUrl: './cost-expend.component.html',
  styleUrls: ['./cost-expend.component.css']
})
export class CostExpendComponent implements OnInit {
  dataSet:any = [];
  updatedata:any = [];
  pageSize =30;
  listLoading = false;
  tempSearchParam:any;
  totalPage:any;
  bankName:any;
  columnsArr:any=[];
  old_data:any=[];
  tplModal: NzModalRef;
  validateForm:FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;
  implistLoading1 = false;
  importFile: any;
  modalTitle:any;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  @ViewChild('tplTitle') tplTitle: TemplateRef<any>;
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('updateFooter') updateFooter: TemplateRef<any>;
  fileList: Array<any> = []; //扫描文件列表
  uploadStatus: boolean = false;
  uploadDisabled: boolean;
  uploadingFileName: string = '';
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
  buttonId:any
  caculateEnameArr: any = [
    {field: 'amount', tipInfo: '已选总金额', tipInfoType: '元', demLength: 2},
    {field: 'invoiceTax', tipInfo: '已选总税额', tipInfoType: '元', demLength: 2},
  ];
  totalAmount:any =0;
  totalInvoiceTax:any=0;
  totalMoney:any=0;
  deleteVisible = false;
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
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,private anhttp: HttpClient,private imgService: ImgViewerService,
              private elRef: ElementRef, private xlsx: XlsxService,private fb:FormBuilder,public upload: UploadFiles,
              private info: UserinfoService,private cm: CommonService) { }

  ngOnInit() {
    this.searchList({page:1,length:30})
  }
  /*
 *  查询主列表
 */
  searchList(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize || data.length;
    this.getList1(data);
  }

  /*
  *   查询接口
  */
  getList1(data:any){
    let url = localUrls.selectCostIncome;
    this.listLoading = true;
    data.type = '1'
    this.tempSearchParam = data;
    this.updatedata = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;
      }
    });
  }

  /*
  *  按钮点击事件
  */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'export' :
        this.Export1();
        break;
      case 'import':
        this.Import1();
        break;
      case 'upload':
        this.Upload();
        break;
      case 'delete':
        this.delete();
        break;
      default:
        break;
    }
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any) {
    this.columnsArr .push.apply( this.columnsArr,data)
  }

  /*
  *  导出日记账
  */
  Export1(){
    if(this.updatedata.length<=0){
      this.nz.error('提示信息','请勾选数据')
      return;
    }
    if(!(this.updatedata.filter(x=>x.companyTaxNo).length===this.updatedata.length||this.updatedata.filter(x=>!x.companyTaxNo).length===this.updatedata.length)){
      this.nz.warning('提示信息','请勾选同为普票或者同为专票的数据!')
      return
    }
    let url:any = localUrls.exportCostIncome;
    let param:any = {};
    param.tInvoiceKingdees = this.updatedata
    param.type = '1'
    this.anhttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `结转成本金蝶导入.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }






  /*
  *  导入
  */
  Import1(){


    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading1 = false;
    this.modalTitle = "收入导入"
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }





  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
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
    //console.log(this.importFile);
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
    ;
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    let _data;
    let dataList: any = [];
    this.implistLoading1 = true;
    let headTemplate = ['发票代码','发票号码','销方名称','销方税号','开票日期','金额','税额','是否勾选(是/否)','有效抵扣税额','用途']

    this.xlsx.import(this.importFile, true).then((data: any) => {

      let keys = Object.keys(data);
      //_data.push( data[keys[i]]);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading1 = false;
        return;
      }
      ;
      this.old_data = _data;
      let headArr: any
      headArr = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        this.nzMess.remove();
        this.nzMess.error(`模板不正确，请下载正确模板`);
        return;
      }
      _data.forEach(item=>{
        for( let i in item){
          if(typeof  item[i] ==='string'){
            console.log(this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined)
            if(!item[i]||this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined){
              delete item[i];
            }
          }else{
            if(item[i]===''||item[i]===null||item[i]===undefined){
              delete item[i];
            }
          }

        }
      })
      console.log(_data)
      let _dataNew =[];
      _data.forEach(item=>{
        if(!(item.filter(x=>x!=undefined).length == 0||item.length===0)){
          _dataNew .push(item);
        }
      })
      _data = _dataNew
      console.log(_data)
      if(_data.length==1){
        this.nzMess.error(`请检查数据，第一个tab页为空`);
        this.implistLoading1 = false;
        return;
      }
      // if(!this.validateData(_data)){
      //   // this.nzMess.error("合同号不能为空！");
      //   this.implistLoading1 = false;
      //   return;
      // }
      //this.removeEmpty(_data).then(this.excelFilter(_data));
      //console.log(_data);
      dataList.push(_data);
      _data = [];

      //console.log(dataList);
      this.excelFilter(dataList);
    });


  }

  trim(str) {
    if(str == null){
      str = "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
  };

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    ;
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        console.log(item);
        flag = false;
      }
    });
    if (!flag) {

      this. implistLoading1= false;
    }
    return flag;
  }
  /*
  *   导入调接口
  * */

  excelFilter(data: any) {
    let param: any = [];
    let eNameHeader: any = [];
    let url:any
    let param1:any ={}

    for (let j = 0; j < data.length; j++) {
      //console.log(data[j][0]);
      console.log(data[j][0]);

      data[j][0].map((item, index) => {
          if (this.patchEname(item)) {
            eNameHeader.push({field: this.patchEname(item), index: index});
          }
        }
      );
      console.log(eNameHeader);
      for (let i = 1; i < data[j].length; i++) {
        let temp: any = {};
        eNameHeader.forEach((h) => {
          temp[h.field] = data[j][i][h.index];
        });
        param.push(temp);
      }
      ;
    }
    param1.tInvoiceKingdees = param;
    url = localUrls.importCostIncome;

    let count: any = [];
    console.log(param1);
    param1.type = '1'


    this.http.post(url,param1).then(res=>{
      if(res.success){
        this.nz.create('success','提示信息',res.data.data,{nzDuration: 3000})
        this.tplModal.destroy();
      }
      this.getList1(this.tempSearchParam);
      this. implistLoading1= false;
    })


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

  removeEmpty(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].length < 1) {
        data.splice(i, 1);
        i = i - 1;

      }
    }
    return data;
  }




  /**
   * 导入数据验证表头及必填字段
   * @param data
   */
  validateData(data:any):boolean{
    // 验证表头合同号必须存在
    let count :any
    let excelHeader:any = data && data[0] || [];
    let opt
    let tipMess = [];
    for(let j = 0;j < opt.length;j++){
      let op = opt[j];
      if(excelHeader.indexOf(op) < 0){
        tipMess.push(op);
      }else{
        // 验证必填字段不能为空
        for(let i=1;i<data.length;i++){
          count = this.old_data.indexOf(data[i])
          let index = excelHeader.indexOf(op);
          // console.log(data[i],data[i][index],index);
          if(!data[i][index] || data[i][index] == ''||data[i][index] == undefined||data[i][index] == null){
            this.nzMess.remove();
            this.nzMess.error(`必填字段“${op}”在行号为${count+1}处为空！`);
            return false;
          };
        };

      }
    };
    if(tipMess.length > 0){
      this.nzMess.remove();
      this.nzMess.error(`字段${tipMess.join('、')}必须存在！`);
      return false;
    };
    return true
  }

  handleCancel(){
    this.tplModal.destroy();
    this.validateForm.reset()
  }

  /*
  *   转日期格式
  */
  formatDate(numb, format="/") {
    let time:any = new Date((numb - 1) * 24 * 3600000 + 1)
    time.setYear(time.getFullYear() - 70)
    let year:any = time.getFullYear() + ''
    let month:any = time.getMonth() + 1 + ''
    let date:any = time.getDate() + ''
    if(format && format.length === 1) {
      return year + format + month + format + date
    }
    return year+(month < 10 ? '0' + month : month)+(date < 10 ? '0' + date : date)
  }


  /*
  *  勾选数据返回
  */
  updatedataResult(data:any){
    this.updatedata =data
    this.totalAmount = this.updatedata.map(item => item.amount).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalInvoiceTax = this.updatedata.map(item => item.invoiceTax).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalMoney = this.totalInvoiceTax+this.totalAmount;
  }

  /*
  *  扫描上传
  */
  Upload(){
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
  /**
   * 上传请求
   */
  updateRequest(): void {

    //console.log(segmentData)
    const param: any = {

      imgUrls: []
    };
    this.fileList.forEach(
      value => {
        param.imgUrls.push(value.url);
      }
    );
    //console.log(param)
    this.uploadDisabled = true;
    this.http.post(localUrls.costIncomeUpload, param).then(
      res => {
        if (res.success) {
          console.log(res);
          this.tplModal.destroy();
          this.tempSearchParam.page = 1;
          this.searchList({...this.tempSearchParam});
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
   * 跳转下载
   */

  aClick(){
    window.location.href="https://another2.oss-cn-hangzhou.aliyuncs.com/import/%E7%BB%93%E8%BD%AC%E6%88%90%E6%9C%AC%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls";
  }

  modalConfirmResult(data:any){
    if(data.type==='ok'){
      let param :any ={};
      param.tInvoiceKingdees = this.updatedata;
      this.http.post(localUrls.deleteCostIncome,param).then(res=>{
        if(res.success){
          this.nz.success('提示信息','删除成功');
          this.getList1(this.tempSearchParam);
          this.deleteVisible = false;
        }
      })
    }else{
      this.deleteVisible = false;
    }
  }

  delete(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选数据');
      return;
    }
    this.deleteVisible = true;
  }

}
