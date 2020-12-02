import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {urls} from '@model/url';
import  { contractUrl } from '@model/contractUrl'
import {UploadFiles} from '@service/upload-files';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {format as dateformat} from 'date-fns';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-sale-settlement',
  templateUrl: './sale-settlement.component.html',
  styleUrls: ['./sale-settlement.component.css']
})
export class SaleSettlementComponent implements OnInit {
  modalValidateForm: FormGroup;
  private tplModal: NzModalRef;
  modalFormVisible: boolean = false;
  modalTitle: string;
  listLoading: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  searchData: any; // 查询条件缓存
  selectList: Array<any> = []; // 勾选数据
  isConfirmLoading:boolean = false;
  implistLoading:boolean;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplbody') tplbody;
  @ViewChild('tplFooter') tplFooter;
  validateForm1:FormGroup;
  deleteVisible:boolean = false;
  modalTitle2:any;
  deleteCon:any
  buttonId:any;
  tempSearchParam:any
  docunoDisabled:any = false;
  hxdhDisabled:any = false;
  modalFormData: Array<any> = [
    {
      name: '同步时间', eName: 'syncData', type: 'date', require: true, validateCon: '请选择同步时间',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];

  constructor(private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private nm: NzModalService,
              private msg: NzMessageService,
              public upload: UploadFiles,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
  }

  listSearch(data) { // 查询
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data) {
    this.searchData = {...data};
    let url = urls.selectOrderhd;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data.total ? res.data.data.total : 0;

      }
    });
  }

  btnClick(data) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case  'Sync': //数据同步
        this.dataSync();
        break;
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      default:
        break;
    }
  }

  selectData(data) {
    this.selectList = data;
  }

  dataSync() {
    this.modalFormVisible = true;
    this.modalTitle = '销售结算单查询> 数据同步';
  }

  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    this.isConfirmLoading = true;
    let params = this.modalValidateForm.getRawValue();
    let url = urls.addOrderDataByTime;
    let data = {};
    data['begintime']  =params.syncData[0]  && dateformat(params.syncData[0] , 'YYYY-MM-DD HH:mm:ss');
    data['endtime']  =params.syncData[1] && dateformat(params.syncData[1] , 'YYYY-MM-DD HH:mm:ss');

    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.isConfirmLoading = false;
        this.modalFormVisible = false;
        this.nzMess.success('提示信息','数据同步成功！');
        this.listSearch(this.searchData);
      }
    });
  }

  handleCancel(): void {
    this.modalFormVisible = false;
  }

  nzAfterClose() {
    this.modalValidateForm.reset();
  }


  importConfirm(){
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }

    let url ;
    if(this.buttonId==='Add'){
      url = contractUrl.addSalesStock;
    }else{
      url = contractUrl .updateSalesStock;
    }
    let param = this.validateForm1.getRawValue();
    param.trxDate = param.trxDate && param.trxDate instanceof Date ? Utils.dateFormat(param.trxDate, 'yyyy-MM-dd') : param.trxDate || '';
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nzMess.create('success', '提示信息', res.data.data, {nzDuration: 6000});
        this.tplModal.destroy();
        this.validateForm1.reset();
        this.listSearch(this.searchData);
        this.docunoDisabled = false;
        this.hxdhDisabled = false;
      }
    })
  }


  handleCancel1(){
    this.tplModal.destroy();
    this.validateForm1.reset();
    this.docunoDisabled = false;
    this.hxdhDisabled = false;
  }


  btnAdd(){
    this.validateForm1 = this.fb.group({
      docuno: [null, [Validators.required]],
      hxdh: [null, [Validators.required]],
      sjgbsl: [null, [Validators.required]],
      trxDate: [null, [Validators.required]],
    });
    this.modalTitle = '销售结算单 > 新增';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplbody,
      nzFooter: this.tplFooter,
      nzWidth: '60%',
      nzMaskClosable: false,
      nzClosable: false,
    });
  }


  btnUpdate(){
    if(this.selectList.length!==1){
      this.nzMess.error('提示信息','请勾选一条数据');
      return;
    }
    this.validateForm1 = this.fb.group({
      docuno: [{value:null,disabled:true}, [Validators.required],],
      hxdh: [{value:null,disabled:true}, [Validators.required]],
      sjgbsl: [null, [Validators.required]],
      trxDate: [null, [Validators.required]],
    });
    // this.validateForm1.get('docuno').reset({value:null,disable:true})
    this.validateForm1.patchValue(this.selectList[0]);
    this.modalTitle = '销售结算单 > 新增';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplbody,
      nzFooter: this.tplFooter,
      nzWidth: '60%',
      nzMaskClosable: false,
      nzClosable: false,
    });
  }


  btnDelete(){
    if(this.selectList.length<1){
      this.nzMess.error('提示信息','请至少勾选一条数据');
      return;
    }
    this.modalTitle2 = '销售结算单删除'
    this.deleteCon = '是否删除?'
    this.deleteVisible = true;
  }


  modalConfirmResult(data:any){
    if (data.type == 'ok') {
      this.http.post(contractUrl.deleteSalesStock,this.selectList).then(res=>{
        if(res.success){
          this.nzMess.create('success', '提示信息', res.data.data, {nzDuration: 6000});
          this.deleteVisible = false;

          this.listSearch(this.searchData);
        }
      })
    }else{
      this.deleteVisible = false;
    }

  }
}
