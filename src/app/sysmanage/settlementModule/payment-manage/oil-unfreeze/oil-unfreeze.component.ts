import { Component, OnInit } from '@angular/core';
import { localUrls } from "../../../../common/model/localUrls";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from '../../../../common/util/utils';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-oil-unfreeze',
  templateUrl: './oil-unfreeze.component.html',
  styleUrls: ['./oil-unfreeze.component.css']
})
export class OilUnfreezeComponent implements OnInit {
  tplModal:NzModalRef;
  // isMutli: boolean = true;
  dataSet: any = [];
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages: Number = 1;
  totalPage1:Number = 1;
  totalPage2: Number = 1;
  // gridId:String = 'grid1';
  listLoading:boolean = false;
  pageSize:number=30;
  paymentNo:string;
  selectedData:any = [];

  tabArr = [
    { name: '油款已冻结', index: 0 },
    { name: '油款未冻结', index: 1 },
  ];
  tabIndex:Number =0;
  modalFormVisible = false; // 表单弹窗
  modalTitle: string = '解除冻结';
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '解冻金额', eName: 'thawAmount', type: 'text', validateCon: '请输入解冻金额', require: false,
      validators: {
        require: true,
        pattern: true,
        patternStr:'^(0|[1-9][0-9]*)$',
        patternErr:'请输入大于零的数字'
      }
    },
    {
      name: '付款单号', eName: 'paymentNo', type: 'text', validateCon: '请输入付款单号', require: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[A-Za-z0-9]+$',
        patternErr: '请输入字母、数字的组合'
      }
    },
    {
      name: '加油公司编号', eName: 'refuelCode', type: 'text', validateCon: '请输入加油公司编号', require: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[A-Za-z0-9]+$',
        patternErr: '请输入字母、数字的组合'
      }
    },
    {
      name: '加油公司名称', eName: 'refuelName', type: 'text', validateCon: '请输入加油公司名称', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '加油量', eName: 'refuelWeight', type: 'text', validateCon: '请输入加油量', require: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^(0|[1-9][0-9]*)$',
        patternErr: '请输入大于零的数字'
      }
    },
    {
      name: '加油详情', eName: 'refuelDetail', type: 'text', validateCon: '请输入加油详情', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '加油时间', eName: 'refuelDate', type: 'time', validateCon: '请选择加油时间', require: false,
      validators: {
        require:true
      }
    },
    {
      name: '发票号', eName: 'invoiceNo', type: 'text', validateCon: '请输入发票号', require: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[A-Za-z0-9]+$',
        patternErr: '请输入字母、数字的组合'
      }
    },
  ]
  private searchData: any = {};

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nz: NzNotificationService) { }

  ngOnInit() {
  //  this.listSearch({ page: 1, length: this.pageSize});
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
   
  }

  listSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.tabIndex = 0;
    this.searchData = data;
    this.getList(data);
  }

  getList(data: any): void {
    let url = this.tabIndex == 0 ? localUrls.oilUnfreezeListUrl1 : localUrls.oilUnfreezeListUrl2;
    console.log(data,this.tabIndex);
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
      }
    })
  }

  btnClick(data: any): void {
    if (this.selectedData.length != 1) {
      let nzContent = this.selectedData.length < 1 ? '请选择后操作' : '请单选操作';
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: nzContent
      });
      this.destroyTplModal();
      return;
    }
    if (data.buttonId === "relieve") {   //解除冻结
      // console.log(this.tabIndex);
      // if(this.tabIndex!=0){
      //   this.tplModal = this.nm.warning({
      //     nzTitle: '提示信息',
      //     nzContent: '请选择已冻结数据进行操作！'
      //   });
      //   this.destroyTplModal();
      //   return;
      // }
      this.paymentNo = this.selectedData[0].paymentNo;
      this.modalValidateForm.patchValue({ paymentNo: this.paymentNo });
      this.modalFormVisible = true;
    } else if (data.buttonId === 'afresh'){
      // if (this.tabIndex != 1) {
      //   this.tplModal = this.nm.warning({
      //     nzTitle: '提示信息',
      //     nzContent: '请选择未冻结数据进行操作！'
      //   });
      //   this.destroyTplModal();
      //   return;
      // }
      let url = localUrls.oilRefreezeAddUrl;
      let param = { paymentNo: this.selectedData[0].paymentNo};
      this.http.post(url,param).then((res:any)=>{
        if(res.success){
          this.nz.create('success', '提示信息', '冻结成功', { nzDuration: 3000 });
         // this.listSearch({ page: 1, length: this.pageSize });
         this.searchData.page = 1;
         this.getList({...this.searchData});
        }
      })

    }
  }


  selectData(data:any){
    this.selectedData = data;
    console.log(data);
  }

  tabChange(data: any): void {
    this.selectedData = [];
    this.tabIndex = data.index;
   // this.getList({ page: 1, length: this.pageSize });
    this.searchData.page = 1;
    this.getList({...this.searchData});
  }

  handleCancel(): void {
    this.modalValidateForm.reset();
    this.modalFormVisible = false;

  }

  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if(this.modalValidateForm.status !== "VALID"){
      return;
    }

    let obj: any = {};
    Object.assign(obj, this.modalValidateForm.value);
    obj.refuelDate = obj.refuelDate && Utils.dateFormat(obj.refuelDate,'yyyy-MM-dd');
    let url = localUrls.oilUnfreezeAddUrl;
    let param = obj;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '解冻成功', { nzDuration: 3000 });
        this.modalValidateForm.reset();
        this.modalFormVisible = false;
       // this.listSearch({ page: 1, length: this.pageSize });
       this.searchData.page = 1;
       this.getList({...this.searchData});
      }
    })
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


}
