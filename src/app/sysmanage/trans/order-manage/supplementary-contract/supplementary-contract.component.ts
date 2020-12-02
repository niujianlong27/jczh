import {Component, DoCheck, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-supplementary-contract',
  templateUrl: './supplementary-contract.component.html',
  styleUrls: ['./supplementary-contract.component.css']
})
export class SupplementaryContractComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  tempSearchParam: any; // 查询条件缓存
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹出框标题
  modalFormData: Array<any> = [
    {
      name: '补录合同号', eName: 'orderNo', type: 'text', validateCon: '请输入合同号', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    }

  ];
  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private route: ActivatedRoute,
              private router: Router,
              private nz: NzNotificationService,
              private info: UserinfoService,
              private fb: FormBuilder,

  ) {
  }

  ngOnInit() {
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

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList1(data);
  }

  getList1(data: any): void {
    // let url = ;
    // this.listLoading = true;
    // this.tempSearchParam = data;
    // this.http.post(url, data).then((res: any) => {
    //   if (res.success) {
    //     this.listLoading = false;
    //     this.dataSet = res.data.data && res.data.data.data || [];
    //     this.totalPages = res.data.data && res.data.data.total;
    //   }
    // });
  }

  btnClick(data) {
   console.log(data);
    switch (data.buttonId) {
      case 'Repair' :
        this.repair();
        break;
    }
  }

  repair(){ // 补录合同弹框
    this.modalFormVisible = true;
    this.modalTitle = '补录合同 > 补录合同';
  }


  handleOk() {  // 弹出框确认
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let params = this.modalValidateForm.getRawValue();
    // let url = ;
    // this.http.post(url, params).then((res: any) => {
    //   if (res.success) {
    //     this.modalFormVisible = false;
    //     this.msg.success('合同补录成功！');
    //     this.listSearch(this.tempSearchParam);
    //   }
    // });
  }


  handleCancel() {  // 关闭弹框
    this.modalFormVisible = false;
  }

  closeResult() {
    this.modalValidateForm.reset();
  }


}
