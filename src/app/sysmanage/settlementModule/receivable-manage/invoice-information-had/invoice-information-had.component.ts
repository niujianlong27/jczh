import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {localUrls} from '@model/localUrls';
import {ENgxPrintComponent} from '@component/e-ngx-print';
import {DatePipe} from '@angular/common';
import {GlobalService} from '@service/global-service.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CacheService} from '@service/cache.service';
@Component({
  selector: 'app-invoice-information-had',
  templateUrl: './invoice-information-had.component.html',
  styleUrls: ['./invoice-information-had.component.css'],
  providers: [DatePipe]
})
export class InvoiceInformationHadComponent implements OnInit {
  dataSet:any = []
  updatedata:any = [];
  pageSize =30;
  listLoading = false;
  tempSearchParam:any
  totalPage:any
  invoiceData:any
  sellerName:any
  prints:any
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  @ViewChild('print1') printComponent1: ENgxPrintComponent;
  tplModal: NzModalRef;
  printVisible = false
  printStyle:any='@page{' +
    'height:138mm' +
    '}'+
    '@media print {\n' +
    '  .invNo{\n' +
    '    position: absolute;\n' +
    '    top:12mm;\n' +
    '    left:211.5mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .invNum{\n' +
    '    position: absolute;\n' +
    '    top:15mm;\n' +
    '    left:211.5mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .gmtCreate{\n' +
    '    position: absolute;\n' +
    '    top:20mm;\n' +
    '    left:200mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .buyerName{\n' +
    '    position: absolute;\n' +
    '    top:29mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .taxCtrlNo{\n' +
    '    position: absolute;\n' +
    '    top:32mm;\n' +
    '    left:142mm;\n' +
    '    width:82mm;\n' +
    '    height: 22mm;\n' +
    '    word-wrap: break-word;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .buyerTaxCode{\n' +
    '    position: absolute;\n' +
    '    top:35mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .buyerAddress{\n' +
    '    position: absolute;\n' +
    '    top:42mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .buyerBankName{\n' +
    '    position: absolute;\n' +
    '    top:47mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .itemTable{\n' +
    '    position: absolute;\n' +
    '    top:55mm;\n' +
    '    left:19.5mm;\n' +
    '    height: 44mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .totalMoneyChina{\n' +
    '    position: absolute;\n' +
    '    top:106mm;\n' +
    '    left:72mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .totalMoney{\n' +
    '    position: absolute;\n' +
    '    top:106mm;\n' +
    '    left:185mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .remark{\n' +
    '    position: absolute;\n' +
    '    top:117mm;\n' +
    '    left: 142mm;\n' +
    '    width:82mm;height: 20mm;\n' +
    '    word-wrap: break-word;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .sellerTaxCode{\n' +
    '    position: absolute;\n' +
    '    top:124mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .sellerAddress{\n' +
    '    position: absolute;\n' +
    '    top:129mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .sellerBankName{\n' +
    '    position: absolute;\n' +
    '    top:134mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .payee{\n' +
    '    position: absolute;\n' +
    '    top:140mm;\n' +
    '    left:28mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .reviewer{\n' +
    '    position: absolute;\n' +
    '    top:140mm;\n' +
    '    left:85mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '  .creator{\n' +
    '    position: absolute;\n' +
    '    top:140mm;\n' +
    '    left:138mm;\n' +
    '    font-size: 10pt;\n' +
    '  }\n' +
    '}\n' +
    '.sellerName{\n' +
    '    position: absolute;\n' +
    '    top:117mm;\n' +
    '    left:42mm;\n' +
    '    font-size: 10pt;\n' +
    '  }' +
    '.pageSize{\n' +
    '    page-break-before:always;\n' +
    '    position:relative;' +
    '       top:0mm;' +
    '      left:0mm;' +
    '    width: 242mm ;\n' +
    '    height: 138mm;' +
    '  }' +
    '.align-right{' +
    'text-align:right;' +
    '}' +
    ' .bottom-down{' +
    '    vertical-align:bottom;' +
    '}'
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,private glo: GlobalService,private _route:ActivatedRoute,
              private fb:FormBuilder, private elRef: ElementRef,private datepipe: DatePipe,private cache: CacheService,
              private info: UserinfoService,private cm: CommonService) {

  }

  ngOnInit() {
    this._route.queryParams.subscribe((params: Params) => {
      console.log(params)
      this.sellerName = params.sellerName
    } )
    this.searchList({page:1,length:30})
    this.searchReloadEvent();
  }
  searchReloadEvent(): void {
    this.glo.searchReload.subscribe(
      value => {
        if (value['target'] === 'invoiceInformationHad') {
          this.dataSet = [];
          this.updatedata = [];
          this.searchList({page:1,length:30})
        }
      }
    );
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
    let url = localUrls.selectInvoiceInformationHad;
    this.listLoading = true;
    data.sellerName = this.sellerName
    data.invoiceStatusCode ='FPZT30'
   data. invoiceStatus= "开票成功"
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
  *  按钮响应
  */
  btnClick(data:any){
    switch (data.buttonId) {
      case 'See' :
        this.btnSee();
        break;
      case 'Print':
        this.Print();
        break;
      case'Delete':
        this.Delete();
        break;
    }
  }

  /*
  * 作废
  */
  Delete(){
    if(this.updatedata.length!==1){
      this.nz.warning('提示信息','请勾选一条数据!');
      return;
    }
    console.log(this.updatedata[0].gmtCreate.slice(this.updatedata[0].gmtCreate.search('(\\d{2})月'),this.updatedata[0].gmtCreate.search('(\\d{2})月')+2))
    if(this.updatedata[0].invoiceType===3){
      this.nz.warning('提示信息','请勾选普票或者专票');
      return;
    }
    console.log(new Date().getMonth())
    if(Number(this.updatedata[0].gmtCreate.slice(this.updatedata[0].gmtCreate.search('(\\d{2})月'),this.updatedata[0].gmtCreate.search('(\\d{2})月')+2))!==Number(new Date().getMonth()+1)){
      this.nz.warning('提示信息','只能作废本月发票!')
      return;
    }
    if(this.updatedata[0].cancelStatus==='已作废'){
      this.nz.warning('提示信息','已作废发票不可重复作废')
      return;
    }
    let url = localUrls.deleteInvoiceInformationHad;
    let param :any = this.updatedata[0];
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','作废成功!')
        this.getList1(this.tempSearchParam)
      }
    })


  }


  /*
  *   打印按钮
  */
  Print(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据!');
      return;
    }
    if(this.cm.canOperate(this.updatedata,'cancelStatus',['已作废'],'勾选数据中含有已作废数据，请重新勾选！')){
      return;}
    let arr:any = [];
    this.updatedata.forEach(item=>{
      arr.push(Number(item.invNum))
    })
    arr = arr.sort();
    if(arr[arr.length-1]-arr[0]!==arr.length-1){
      this.nz.warning('提示信息','勾选数据票号不连续，请重写选择！')
      return;
    }
    this.printVisible = true
  }

  /*
  *  预览按钮
  */
  btnSee(){
    if(this.updatedata.length!==1){
      this.nz.warning('提示信息','请勾选一条数据!');
      return;
    }
    let url = localUrls.seeInvoiceInformationHad;
    let param :any = {};
    param = this.updatedata[0];
    this.http.post(url,param).then(res=>{
      console.log(res)
      if(res.success){
        this.invoiceData = res.data&&res.data.data||[];
        this.tplModal = this.nm.create({
          nzTitle: this.tplTitle2,
          nzContent: this.tplContent2,
          nzFooter: this.tplFooter2,
          nzWidth: '90%',
          nzMaskClosable: true,
          nzClosable: true,
        });
      }
    })
  }

  /*
  *  勾选数据
  */
  updateDataResult(data:any){
    this.updatedata = data
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


  /*
*打印完成
*/
  printComplete() {
    console.log('打印完成！');
    this.prints = []
  }

  /*
  * 打印确定
  */

  modalConfirmResult(data:any){
    if(data.type=='ok'){
      let url = localUrls.printInvoiceInformationHad;
      let param :any =[];
      this.updatedata.forEach(item=>{
        param.push({companyId:item.companyId,invoiceItemId:item.invoiceItemId,invoiceId:item.invoiceId})
      })
      this.http.post(url,param).then(res=>{
        if(res.success){
          this.nz.success('提示信息','打印成功');
          this.printVisible = false
        }
      })

    }else{
      this.printVisible = false
    }
  }

  /*
 * 打印
  */

  customPrint() {

    const printHTML: HTMLElement = document.getElementById('print')
    console.log(document.getElementById('document1'))
    this.printComponent1.print(printHTML);


  }

  /*
  * 提取年月日格式
  */
  dataChange(data:any){
  }

  get_time_diff(time) {
    var diff = '';
    var time_diff =time - new Date().getTime(); //时间差的毫秒数

    //计算出相差天数
    var days = Math.floor(time_diff / (24 * 3600 * 1000));
    if (days > 0) {
      diff += days + '天';
    }}

}
