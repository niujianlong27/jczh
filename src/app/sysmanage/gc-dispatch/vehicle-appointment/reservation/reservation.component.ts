import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {gcDispatchURL} from '@model/gcDispatchURL';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  pageSize = 30; // 条数
  dataSet: Array<any> = []; // 列表数据
  totalPage = 0; // 数据总数
  listLoading = false; // list加载
  searchData: any = {}; // 搜索数据
  selectData: Array<any> = []; // 搜索数据

  tmp: any; // 修改数据缓存

  appointmentFrequencyList: Array<any> = [
    {name: 1, value: '1'},
    {name: 2, value: '2'},
    {name: 3, value: '3'},
    {name: 4, value: '4'},
    {name: 6, value: '6'},
    {name: 8, value: '8'},
  ];


  modalFormData: Array<any> = [
    {
      name: '预约车辆最大数', eName: 'maxVehicleNum', type: 'number', validateCon: '请输入预约车辆最大数', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '预约频率', eName: 'frequency', type: 'select', validateCon: '请选择预约频率', require: true,
      validators: {
        require: true,
        pattern: false,
      },
      selectList: this.appointmentFrequencyList
    },
    {
      name: '倒班时间', eName: 'shiftTime', type: 'timePicker', validateCon: '请输入倒班时间', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

  ];


  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  nzOkLoading = false;

  // 确认框
  modalTitle: string; // 弹出框标题

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.formInitialization();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    const url = gcDispatchURL.bookRuleSearch;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total || 0;
          this.selectData = [];
        }
        this.listLoading = false;
      }
    );
  }

  /**
   * 点击修改
   * @param params
   */
  btnUpdate(params: any): void {
    this.tmp = Utils.deepCopy(params);
    if (this.tmp.shiftTime) {
      let [hour, minute] = this.tmp.shiftTime.split(':');
      let tmpDate = new Date();
      tmpDate.setHours(hour);
      tmpDate.setMinutes(minute);
      this.tmp.shiftTime = tmpDate;
    }
    this.modalValidateForm.patchValue(this.tmp);
    this.modalFormVisible = true;
    this.modalTitle = '预约规则 > 修改';
  }

  // 数据弹出框相关
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status) {
      this.bookRuleUpdateRequest();
    }

  }

  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框关闭后回调
  closeResult(): void {
    this.modalValidateForm.reset();
  }

  /**
   * 修改请求
   */
  bookRuleUpdateRequest(): void {
    this.nzOkLoading = true;
    const url = gcDispatchURL.bookRuleUpdate;
    const param = this.modalValidateForm.getRawValue();
    param.shiftTime = Utils.dateFormat(param.shiftTime, 'HH:mm');
    param.companyId = this.tmp.companyId;
    this.http.post(url, param).then(
      res => {
        this.nzOkLoading = false;
        if (res.success) {
          this.nm.success('修改成功！');
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   *  数据弹出框表单初始化
   */
  formInitialization() {

    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }

}
