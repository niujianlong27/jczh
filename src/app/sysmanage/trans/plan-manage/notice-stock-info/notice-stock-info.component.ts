import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Router} from '@angular/router';
import {TRANS_PLAN_URLS} from '../../../../common/model/transPlan-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../../common/util/utils';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-notice-stock-info',
  templateUrl: './notice-stock-info.component.html',
  styleUrls: ['./notice-stock-info.component.css']
})
export class NoticeStockInfoComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData: any = [];//选中的数据
  totalPages1: Number = 1;
  modalForm: any = {};
  modalValidateForm: FormGroup;
  defaultOption: any;
  selectStatus: any;
  canSendDate:any;
  lineName:any
  pageSize1: Number = 30;
  selectedList1: any = [];
  selectArr: any[] = [{name: '未分货货物', value: '00'}, {name: '已分货未确认货物', value: '10'}, {name: '以上全选', value: '20'}];
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  constructor(private router: Router,private anhttp: HttpClient, private http: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private appInfo: UserinfoService) {
  }

  ngOnInit() {


    this.listSearch({page: 1, length: this.pageSize1});
  }

  getList1(data: any): void {
    let url = TRANS_PLAN_URLS.getNoticeStockInfo;
    this.listLoading1 = true;

    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
    console.log(data.queryParameterList);
    if(data.queryParameterList != undefined && data.queryParameterList != '') {
      data.queryParameterList.forEach((item: any) => {
        if (item.parameter == 'canSendDate') {
          this.canSendDate = item.value1.slice(0, 10);

        }
      })
    }else {
      this.canSendDate ='';
    }
  }

  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  btnClick(data: any): void {

    switch (data.buttonId) {
      case 'allocate':
        this.tipModalCreat();
        break;
      case 'export':
        this.btnExport();
        break;
      default:
        break;
    }
  }

  modelChange(data:any){
    console.log(data)
    data.queryParameterList.forEach(item=>{
      if(item.parameter==='lineName'){
        this.lineName = item.value1
      }
    })
  }

  btnExport(){
    let url: any =TRANS_PLAN_URLS.exportnoticeStockInfo;
    let param:any={};
    param.lineName = this.lineName
    this.anhttp.post(url,param , {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `整体分货导出.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }


  duration(data: any) {
    this.selectStatus = data;
    console.log(data);
  }

  /**
   * 创建弹窗
   */
  tipModalCreat(): void {
    this.defaultOption = '00';
    this.selectStatus = '00';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '400px',
      nzMaskClosable: false,
      nzClosable: true
    });
  }

  allocate(data: any) {

        // this.listLoading1 = false;
        // this.dataSet1 = res.data.data && res.data.data.data ||[];
        // this.totalPages1 = res.data.data && res.data.data.total;
       // sessionStorage.setItem('allocation', JSON.stringify({status: this.selectStatus, source: 'Add'}));
        this.handleCancel();
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '正在进行分货，请稍后......'
        });
        let url = TRANS_PLAN_URLS.allocateGoods;
        let param: any = data;
        param.cargoDate = Utils.dateFormat(new Date(),'yyyy-MM-dd');
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.router.navigate(['/system/trans/plan-manage/allocateGoods']);
            this.tplModal.destroy();

          }
          this.tplModal.destroy();
        });






  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    // this.modalValidateForm.reset();
  }


  /**
   * 弹窗确定
   */
  handleOk() {

    // if ('INVALID' === this.modalValidateForm.status) {
    //   return;
    // }

    // this.selectStatus == ''?'00':this.selectStatus;
    console.log(this.selectStatus);

    this.allocate({status: this.selectStatus});

    // this.http.post(TRANS_PLAN_URLS.cancelAllocateGoods, param).then((res: any) => {
    //   if (res.success) {
    //     this.nz.success('提示消息', '');
    //     this.listSearch(this.tempSearchParam);
    //     this.handleCancel()
    //   }
    // })


  }
}
