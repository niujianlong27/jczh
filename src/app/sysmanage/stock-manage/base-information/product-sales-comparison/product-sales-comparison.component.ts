import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import { stockManageURL } from '@model/stockManage'


@Component({
  selector: 'app-product-sales-comparison',
  templateUrl: './product-sales-comparison.component.html',
  styleUrls: ['./product-sales-comparison.component.css']
})
export class ProductSalesComparisonComponent implements OnInit {

  dataSet:any=[];
  updateData:any=[];
  pageSize1:any =30;
  totalPage:any =0;
  listLoading1 = false;
  tempSearchParam:any
  deleteVisible:boolean = false;
  buttonId:any
  modalTitle:any
  implistLoading:boolean = false;
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  validateForm: FormGroup;
  tplModal: NzModalRef;

  productionVarietyArr:any =[];
  salsesVarietyArr:any =[]

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private anhttp: HttpClient,) { }

  ngOnInit() {
    this.searchList({page: 1, length: this.pageSize1});
    //生产品种
    this.http.post(stockManageURL.selectProduct, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          let arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({name: item.productName, value: item.productId});
          });
          this.productionVarietyArr = [...arr];

        }
      }
    );
    //销售品种
    this.http.post(stockManageURL.selectSales, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          let arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({name: item.cname, value: item.itemId});
          });
          this.salsesVarietyArr = [...arr];

        }
      }
    )
  }

  searchList(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  getList1(data:any){
    let url = stockManageURL.selectData
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updateData = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;

      }
    });
  }

  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add' :
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete' :
        this.btnDelete();
        break;
      case 'Export':
        this.btnExport();
        break;
      default:
        break;
    }
  }

  btnAdd(){
    this.validateForm = this.fb.group({
      productArea:[null, [Validators.required]],
      productId:[null, [Validators.required]],
      itemId:[null, [Validators.required]],
    })
    this.modalTitle = '生产销售品种=>新增'
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,
    });
  }

  btnUpdate(){
    debugger
    if(this.updateData.length!=1){
      this.nz.warning('提示信息','请勾选一条数据！')
      return;
    }
    this.validateForm = this.fb.group({
      productArea:[null, [Validators.required]],
      productId:[null, [Validators.required]],
      itemId:[null, [Validators.required]],
      rowid:[null],
    })
    this.modalTitle = '生产销售品种=>修改'
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,
    });
    this.validateForm.patchValue(this.updateData[0]);
  }

  btnDelete(){
    if(this.updateData.length<=0){
      this.nz.warning('提示信息','请勾选一条数据！');
      return
    }
      this.deleteVisible = true;
  }

  btnExport(){
    let url = stockManageURL.exportData;
    let param = this.tempSearchParam;
    this.anhttp.post(url,param , {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `生产销售品种对照.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  updateDataResult(data:any){
      this.updateData = data
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
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }


  modalConfirmResult(data:any){
    if(data.type==='ok'){
      let url =stockManageURL.deleteData;
      let param:any ={}
      param.productConfigModels = this.updateData;
      this.http.post(url,param).then(res=>{
        if(res.success){
          this.nz.success('提示信息','删除成功！');
          this.deleteVisible = false;
          this.getList1(this.tempSearchParam);
        }
      })
    }else{
      this.deleteVisible = false
    }
  }

  handleCancel(){
      this.tplModal.destroy();
      this.validateForm.reset();
  }

  importConfirm2(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === 'INVALID') {
      return;
    }
    this.implistLoading = true;
    let url;
    if(this.buttonId==='Add'){
      url = stockManageURL.addData
    }else{
      url= stockManageURL.updateData
    }
    let param :any={};
    param = this.validateForm.getRawValue();
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data);
        this.getList1(this.tempSearchParam);
        this.tplModal.destroy();
        this.validateForm.reset();
      }
      this.implistLoading = false;
    })
  }
}
