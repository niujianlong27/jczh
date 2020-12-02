import { Component, OnInit } from '@angular/core';
import {environment} from '@env/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {Utils} from '@util/utils';

import {messageUrl} from '@model/messageUrl.ts';
import {format as dateformat} from 'date-fns';

@Component({
  selector: 'app-message-publish',
  templateUrl: './message-publish.component.html',
  styleUrls: ['./message-publish.component.css']
})
export class MessagePublishComponent implements OnInit {
  appNameArr:Array<any> = [];
  dataSet: Array<any>;
  pageSize: number = 30;//条数
  totalPage: number = 0;//数据总条数
  listLoading:boolean = false;
  searchData:any;
  private tplModal: NzModalRef;
  deleteVisible: boolean = false;//删除弹窗显示控制
  status:string;
  selectedData:Array<any> = [];
  deleteCon:string;
  modalTitle:string;
  modalFormVisible:boolean = false;
  modalValidateForm: FormGroup;
  modalFormData : Array<any>= [
    {
      name: '标题', eName: 'title', type: 'text', validateCon: '请输入标题', require: true,disabled:false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '',
        patternErr: ''
      }
    },
    {
      name: '内容', eName: 'text', type: 'textarea', validateCon: '请输入内容', require: true,disabled:false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '',
        patternErr: ''
      }
    },
    {
      name: '发布位置', eName: 'appVersion', type: 'select', validateCon: '请选择发布位置', require: true,disabled:false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '',
        patternErr: ''
      }
    },
    {
      name: '开始时间', eName: 'beginTime', type: 'data', validateCon: '请选择开始时间', require: true,disabled:false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '',
        patternErr: ''
      }
    },
    {
      name: '结束时间', eName: 'endTime', type: 'data', validateCon: '请选择结束时间', require: true,disabled:false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '',
        patternErr: ''
      }
    },
  ];

  constructor(
    private http: HttpUtilService,
    private fb: FormBuilder,
    private nm: NzModalService,
    private nn: NzNotificationService,
  ) { }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getAppName();
    this.modalValidateForm = this.fb.group({});

    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '',disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }

  getAppName(){ // 获取发布位置数据
    let url = messageUrl.selectAppName;
    this.http.post(url,{}).then(res => {
      if (res.success){
       this.appNameArr = res.data && res.data.data;
      }
    })
  }

  // 列表获取
  listSearch(param: any): void {
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.searchData = param;
    this.getListSearch(param);
  }

  getListSearch(data){
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url =messageUrl.selectNoticeMessage;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet =  res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }

  selectedList(data){
    this.selectedData = data;
    }

  btnClick(data: any): void {
    switch (data.type.buttonId) {
      case 'Add': { // 新增
        this.btnAdd();
      }
        break;
      case 'Update': {  //修改
        this.btnUpdate();
      }
        break;
      case 'Delete': { // 删除
        this.btnDelete();
      }
        break;
    }

  }

  btnAdd(){
    this.modalFormVisible = true;
    this.modalTitle = `消息内容发布 > 新增`;
    this.status = 'add';
  }

  btnUpdate(){
    if (!this.selectedData || this.selectedData.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = `消息内容发布 > 修改`;
    this.status = 'update';
    this.modalValidateForm.patchValue(this.selectedData[0]);
  }

  btnDelete(){
    if (!this.selectedData || this.selectedData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中数据后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.status = 'delete';
  }

  // 确认框数据处理
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {noticeMessageModelList: []}, method: 'POST'};
    params.url = messageUrl.deleteNoticeMessage;
    for (const data of this.selectedData) {
      params.data.noticeMessageModelList.push({rowid: data.rowid});
    };
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let modalData = this.modalValidateForm.getRawValue();
   if (modalData.title && modalData.title.length < 2 || modalData.title.length > 12){
     this.nn.warning('提示消息', '标题输入应在2-12个字之间！');
     return
   }
    modalData.beginTime = modalData.beginTime && modalData.beginTime instanceof Date ? Utils.dateFormat(modalData.beginTime, 'yyyy-MM-dd HH:mm:ss') : modalData.beginTime || null;
    modalData.endTime = modalData.endTime && modalData.endTime instanceof Date ? Utils.dateFormat(modalData.endTime, 'yyyy-MM-dd HH:mm:ss') : modalData.endTime || null;

    'add' === this.status&& this.addData(modalData);
    'update' === this.status && this.updateData(modalData);

  }

  addData(data){
    let url= messageUrl.insertNoticeMessage;
    this.http.post(url,data).then(res =>{
      if (res.success){
        this.modalFormVisible = false;
        this.nn.success('提示消息', '新增成功！');
        this.selectedData = [];
        this.listSearch(this.searchData);
      }
    })
  }
  updateData(data){
    let url= messageUrl.updateNoticeMessage;
    data.rowid = this.selectedData[0].rowid;
    this.http.post(url,data).then(res =>{
      if (res.success){
        this.modalFormVisible = false;
        this.nn.success('提示消息', '修改成功！');
        this.selectedData = [];
        this.listSearch(this.searchData);
      }
    })
  }



  handleCancel(): void {
    this.modalFormVisible = false;
  }
  closeResult(): void {
    this.modalValidateForm.reset();
  }

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    let modalData = this.modalValidateForm.getRawValue();
    if (!startValue || !modalData.endTime) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof modalData.endTime === 'string') {
      let data = new Date(Date.parse(modalData.endTime));
      modalData.endTime = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > modalData.endTime.getTime());

  };

  disabledEndDate = (endValue: Date): boolean => {
    let modalData = this.modalValidateForm.getRawValue();

    if (!endValue || !modalData.beginTime) {
      return false;
    }
    if (typeof modalData.beginTime === 'string') {
      let data = new Date(Date.parse(modalData.beginTime));
      modalData.beginTime = data;
    }
    return endValue.getTime() <= modalData.beginTime.getTime();
  };

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

}
