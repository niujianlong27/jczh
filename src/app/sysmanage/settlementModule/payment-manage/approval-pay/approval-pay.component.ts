import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {UserinfoService} from '@service/userinfo-service.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';

@Component({
  selector: 'app-approval-pay',
  templateUrl: './approval-pay.component.html',
  styleUrls: ['./approval-pay.component.css']
})
export class ApprovalPayComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false; // 弹框显示
  modalTitle: string; // 弹框标题
  listLoading: boolean = false;
  dataSet: any = [];
  itemData: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  searchData: any; // 查询条件缓存
  selectList: Array<any> = []; // 勾选数据
  buttonId: string;
  status: any;
  modalFormData: Array<any> = [
    {
      name: '备注', eName: 'remark', type: 'textarea', require: false, validateCon: '请输入备注',
      disabled: false,
      required: false,
    }
  ];

  constructor(private fb: FormBuilder,
              private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private nm: NzModalService,
              private msg: NzMessageService,
              private info: UserinfoService,) {
  }

  ngOnInit() {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: null, disabled: control.disabled}, control.required ? Validators.required : null
      ));
    }
    this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data) { // 查询
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data) { // 查询
    this.selectList = [];
    this.searchData = {...data};
    let url = urls.getApprovalRecordList;
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
      case 'Detail': // 查看详情
        this.Detail();
        break;
      case 'Pass': // 通过
        this.pass();
        break;
      case 'Reject': // 驳回
        this.reject();
        break;
      default:
        break;
    }
  }

  selectData(data) { // 选择数据
    this.selectList = data;
  }

  Detail() {
    if (!this.selectList || this.selectList.length != 1) {
      this.msg.warning('请选择一条数据进行操作！');
      return;
    }
    this.status = 'detail';
    this.modalTitle = '付款审批 > 查看详情';
    this.modalFormVisible = true;
    this.getDetail();
  }

  getDetail() {
    let url = urls.getApprovalRecordDetail;
    let params = {};
    params['companyId'] = this.selectList[0].companyId;
    params['approvalNo'] = this.selectList[0].approvalNo;
    params['documentsTypeId'] = this.selectList[0].documentsTypeId;
    params['rowid'] = this.selectList[0].rowid;
    this.http.post(url, params).then((res: any) => {
      if (res.success) {
        this.itemData = res.data.data || [];
      }
    });
  }

  pass() {
    this.modalFormData.forEach(item => {
      if (item.eName == 'remark') {
        item.require = false;
      }
    });
    if (!this.selectList || this.selectList.length < 1) {
      this.msg.warning('请选择数据后进行操作！');
      return;
    }
    for (let i = 0; i < this.selectList.length; i++) {
      if (this.selectList[i].result !== '待审核') {
        this.msg.warning('请选择审核结果为待审核的数据！');
        return;
      }
    }

    this.status = 'pass';
    this.modalTitle = '付款审批 > 通过';
    this.modalFormVisible = true;
  }

  reject() {
    this.modalFormData.forEach(item => {
      if (item.eName == 'remark') {
        item.require = true;
      }
    });
    if (!this.selectList || this.selectList.length < 1) {
      this.msg.warning('请选择数据后进行操作！');
      return;
    }
    for (let i = 0; i < this.selectList.length; i++) {
      if (this.selectList[i].result !== '待审核') {
        this.msg.warning('请选择审核结果为待审核的数据！');
        return;
      }
    }
    this.status = 'reject';
    this.modalTitle = '付款审批 > 驳回';
    this.modalFormVisible = true;
  }

  handleCancel() { // 取消弹框
    this.modalFormVisible = false;
  }

  nzAfterClose() { // 弹框关闭触发
    this.itemData = [];
    this.status = '';
    this.modalValidateForm.reset();
  }

  nzOnOk() {
    if (this.status == 'detail') { // 查看详情
      this.getList(this.searchData);
      this.modalFormVisible = false;
    } else {
      let data = this.modalValidateForm.getRawValue();
      if (this.status == 'reject' && !data.remark) { // 驳回
        this.msg.warning('请填写备注信息！');
        return;
      }
      if (data.remark.length > 25) {
        this.msg.warning('备注信息不能超过25个字！');
        return;
      }
      let params = {approvalRecordModels: []};
      this.selectList.forEach(item => {
        params.approvalRecordModels.push({
          'companyId': item.companyId,
          'approvalNo': item.approvalNo,
          'userId': item.userId,
          'level': item.level,
          'documentsTypeId': item.documentsTypeId,
          'documentsNo': item.documentsNo,
          'result': item.result,
          'remark': data.remark,
          'rowid': item.rowid
        });
      });
      let url = this.status == 'pass' ? urls.updateApprovalPass : urls.updateApprovalReject;
      this.http.post(url, params).then(res => {
        if (res.success) {
          this.nzMess.success('提示消息', res.data.data);
        }
        this.modalFormVisible = false;
        this.selectList = [];
        this.getList(this.searchData);
      });

    }

  }

  onmouseMove(data: any) {
    data.isShow = true;
  }

  onmouseLever(item) {
    item.isShow = false;
  }

}
