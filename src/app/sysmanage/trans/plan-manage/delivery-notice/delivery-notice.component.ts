import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import { TRANS_URLS } from '../../../../common/model/trans-urls';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {Utils} from '../../../../common/util/utils';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {empty} from 'rxjs/internal/Observer';
import {type} from 'os';
declare var JSONH: any;
import {HttpClient, HttpRequest, HttpHeaders} from '@angular/common/http';

/*
 * @Title: deliver-notice.component.ts
 * @Description: 可发库存
 * @Created: zhaozeping
 * @Modified:
 */
@Component({
  selector: 'app-delivery-notice',
  templateUrl: './delivery-notice.component.html',
  styleUrls: ['./delivery-notice.component.css'],
  providers:[
    XlsxService
  ]

})
export class DeliveryNoticeComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;
  buttonId:any;
  updateData:any = [];
  tempSearchParam:any;
  columnsArr:any;
  searchFormHidden:any

  modalTitle:any = '可发库存 > 导入';
  importFile:any;
  implistLoading:boolean = false;
  @ViewChild('fileInput') fileInput:ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  validateForm:FormGroup;
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true,readOnly:true,
      validators: {
        require: true,
        pattern:false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true,hidden:true,
      validators: {
        require: true,
        pattern:false
      }
    },
  ]

  constructor(
    private http: HttpUtilService,
    private nm:NzModalService,
    private fb:FormBuilder,
    private nz:NzNotificationService,
    private xlsx:XlsxService,
    private nzMess:NzMessageService,
    private tplbtnService:TplButtonsService,
    private  angularHttp: HttpClient
    ) { }
  /**
   * 初始化
   */
  ngOnInit() {
    this.validateForm = new FormGroup({
      chooseTime: new FormControl('',[ Validators.required ]),
    });
    this.listSearch({ page: 1, length: this.pageSize1 });
    // this.tplbtnService.collaspedSearch.subscribe((data:any)=>{
    //   this.searchFormHidden=data.searchFormHidden;
    // })
    // this.tplbtnService.formReset.subscribe((data:any)=>{
    //   this.validateForm.reset();
    // });

  }
  /**
   * 重置
   * @param data
   */
  reset(data:any){
    this.validateForm.reset();
  };

  /**
   * 是否显示查询条件
   * @param data
   */
  btnSearch(data:any){
    this.searchFormHidden = data;
  }
  /**
   * 查询
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1||data.length;
    this.getList1(data);
  }

  /*
  *    调用查询接口
  */

  getList1(data: any): void {
    let url=TRANS_URLS.selectDeliveryNotice ;
    this.listLoading1 = true;
    this.tempSearchParam=data;

    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.dataSet1.forEach((item)=>{
          item.editstate = 0;
        })
      }
    })
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data:any):void{
    this.columnsArr = data;
  }
  /**
   * 按钮
   */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Import':
        this.btnImport();
        break;
      case 'Export':
        this.btnExport();
        break;
      default:
        break;
    }
  }
  /*
  *        导入按钮
  */
  btnImport(){
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach( item => {
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
  /**
   * 选择excel
   */
  selectFile(){
    this.fileInput.nativeElement.click();
  }
  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file:any){
    this.importFile = file.target.files[0];
    console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }
  /**
   * 导入弹窗确定
   */
  importConfirm(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    };
    if(this.validateForm.status === 'INVALID'){
      return;
    }
    if(!Utils.isExcel(this.importFile.name)){
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    this.implistLoading = true;
    this.xlsx.import(this.importFile,true).then((data:any)=>{
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if(!_data){
        this.nzMess.remove();
        this.nzMess.error("未读取到sheet页！读取数据Excel失败！");
        this.implistLoading = false;
        return;
      };

      let headArr1 = ['发货通知单','订单号','合同号','内外销','品级','收货用户','品名名称','牌号','规格','待发件数','待发重量','可发件数','可发重量','窄带捆包数','冷轧库号','需开单件数','需开单重量','需挂单件数','需挂单重量','是否短溢装','需短溢重量','定尺','运输方式','出库仓库','品名代码','型码','港口批号','入库仓库','承运公司代码','承运公司','城市','终点','物流公司类型','包装形式','卸货地址','销售经理','销售部门','最新挂单时间','公司别','正负差','母单号','付款比例','到货码头','是否到港定价','合同收货人','联系人','联系人电话','合同约定交货日期','订单性质','棒线库存','过磅类型','发货通知单计划重量','订单重量','自动生单类型','合同未发总重量'];
      let headArr2 :any= _data&&_data[1]||[];
    //  console.log(this.validateHead(headArr1,headArr2))
     // console.log(headArr2);
      if(!this.validateHead(headArr1,headArr2)){
       return;
      }

      this.removeEmpty(_data);
      this.excelFilter(_data);
    });
  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head,receiptHead):boolean{
    let count :string='';
    let flag = true;
    if(head.length != receiptHead.length){
      flag = false;
    };
    receiptHead.forEach(item=>{
      if(typeof item !="string"){
        flag = false;
        count = item;
       // console.log(count);
        return;
      }
      if(head.indexOf(item.trim()) < 0){
        flag = false;
        count = item;
        console.log(count)
        return;
      }
    });
    if(!flag){
      this.nzMess.remove();
      this.nzMess.error("表头"+count+"与模板不匹配，请选择正确模板！");
      this.implistLoading = false;
    }
    return flag;
  }
  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data:any){
    let url = TRANS_URLS.importDeliveryNotice;
    let param:any = {deliveryNoticeListJson :[]};
    let eNameHeader:any = [];
      data[1].map((item,index) => {
          if(this.patchEname(item)){
            eNameHeader.push({field:this.patchEname(item),index:index});
          }
        }
      );
      for (let i = 2; i < data.length; i++) {
        let temp:any = {};
        eNameHeader.forEach((h) => {
          temp[h.field] = data[i][h.index];
        });
        param.deliveryNoticeListJson.push(temp);
      };

 //   console.log(param);
    param.deliveryNoticeListJson = JSONH.pack(param.deliveryNoticeListJson);
      //  console.log(param.deliveryNoticeListJson);
        this.http.post(url,param).then((res:any) => {
          this.implistLoading = false;
          if(res.success){
            this.tplModal.destroy();
            this.nz.create('success','提示信息',res.data.data,{nzDuration:3000});

        this.listSearch({ page: 1, length: this.pageSize1 });
      }
    })

  }
  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName:any){
    for(let i = 0;i < this.columnsArr.length;i++ ){
      if(this.columnsArr[i].colCname.trim() == cName.trim()){
        return this.columnsArr[i].colEname;
      }
    }
  }
/*
*    把导入信息终点空去除
*/
  removeEmpty(data:any){
    for (let i = 0;i<data.length;i++){
      if(data[i] == " " || data[i] == null || typeof(data[i]) == "undefined")
      {
        data.splice(i,1);
        i= i-1;

      }
    }
  }

  /**
   * 当前页码发生改变
   */
  getPageIndex1(page:any){
    this.tempSearchParam.page=page;
    this.listSearch(this.tempSearchParam);


  }
  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize:any){
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any){
    this.updateData = data;
  }
  /**
   * 弹窗取消
   */
  handleCancel(){
    this.tplModal.destroy();

  }

  /*
  *  导出
  */
  btnExport(){
    let url: any=TRANS_URLS.exportSchedulePlan ;
    // url =`http://192.168.123.101:9034/report/previewTransContract?orderNo=${this.selectedOrderData[0].orderNo}`;
    this.angularHttp.post(url, this.tempSearchParam,{responseType: 'blob'}).subscribe((res: any) => {
      // console.log(`requestCompanyId=${this.selectedOrderData[0].companyD}`);
      // console.log(`file size : ${res.size}`);
      var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      var objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `可发库存.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  searchDataReturn(data:any){
    let myData = new Date();
    console.log(1111)
    let b =data.filter(x=>x.parameter==='canSendDate')
    b[0].value1 = myData.toLocaleDateString();
  }
}
