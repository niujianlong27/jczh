import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';
import {HttpClient} from '@angular/common/http';
import {TRANS_URLS} from '@model/trans-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-track-report',
  templateUrl: './track-report.component.html',
  styleUrls: ['./track-report.component.css']
})
export class TrackReportComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible = false; //  表单弹窗
  listLoading = false;
  modalTitle: string; // 弹窗标题
  dataSet: any = [];
  totalPage: any;
  loading: boolean = false;
  tempSearchParam: any;
  pageSize1: number = 30;
  buttonId: any;
  selectList: any = [];
  caculateEnameArr: any = [
    {field: 'totalWeight', tipInfo: '已选委托总重量', tipInfoType: '吨', demLength: 3},
    {field: 'endWeight', tipInfo: '已选待委托重量', tipInfoType: '吨', demLength: 3},
    {field: 'weight', tipInfo: '已选销售结算重量', tipInfoType: '吨', demLength: 3},
    {field: 'transFee', tipInfo: '已选车队金额', tipInfoType: '元', demLength: 2},
    {field: 'rcvTransFee', tipInfo: '已选应收金额', tipInfoType: '元', demLength: 2},
    {field: 'preTotalWeight', tipInfo: '已选运单重量', tipInfoType: '吨', demLength: 3},
  ];
  modalFormData: Array<any> = [
    {
      name: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入备注',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }
  ];

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private fb: FormBuilder,private info: UserinfoService,
              private cm: CommonService, private httpp: HttpClient) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
  }

  listSearch(data: any) {
    this.getList1(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url:any = TRANS_URLS.getTrackReport


    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    });
  }

  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case  'Export' :
        this.exportExcel(this.tempSearchParam);
        break;
      case  'Remark' :
        this.updateRemarks();
        break;
      default:
        break;
    }
  }

  exportExcel(data: any[]) {
    let url:any = TRANS_URLS.exportTrackReport

    const currentTime = new Date();
    const month = currentTime.getMonth() + 1;
    // tslint:disable-next-line:max-line-length
    const formatDateTime = currentTime.getFullYear() + '-' + month + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    console.log(formatDateTime);
    // data = [{taskId: data[0].taskId}, {taskId: data[data.length - 1].taskId}];    //  设定格式
    //  发送http请求
    let param;
    /*    const tempArr: Array<any> = [];
        for (let i = 0; i <data.length ; i++) {

          const obj = {'orderNo': data[i].orderNo};
          tempArr.push(obj);
          // @ts-ignore

        }*/
    param = data;
    this.httpp.post(url, param, {
      responseType: 'blob', headers: {'Content-type': 'application/json'}
    }).subscribe((response: any) => {
      // 调用html5 中的api来接收后台回传的文件
      const blob = new Blob([response], {type: 'application/vnd.ms-excel'});
      //  定义文件的url
      const fileUrl = window.URL.createObjectURL(blob);
      // dom操作 定义a节点 然后 通过 a href download 来下载文件
      const a = window.document.createElement('a');
      a.href = fileUrl;
      // 定义存储的文件名为   车辆调度信息+“yyyy-mm-dd hh:mm:ss”
      a.download = '发货跟踪报表' + formatDateTime + '.xlsx';
      // dom操作  在body中添加节点 然后触发点击事件 并移除该节点
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }


  selectDate(data) {
    this.selectList = data;
  }

  updateRemarks() {
    if (this.selectList.length === 0) {
      this.msg.warning('请选择数据后操作!');
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '发货跟踪报表 > 修改备注';
  }

  handleOk(): Promise<any> | boolean {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    const data = this.modalValidateForm.getRawValue();
    const url = TRANS_URLS.updateRemark;
    const param: any = {
      tWaybillModels: [],...data
    };
    this.selectList.forEach(
      value =>
        param.tWaybillModels.push({
          noticeNum: value.noticeNum,
        })
    );
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', res.data.data);
          this.selectList = [];
          this.modalFormVisible = false;
          this.modalValidateForm.reset();
          this.listSearch(this.tempSearchParam);
        } else {
          return false;
        }
      }
    );
  }

  handleCancel() {
    this.modalFormVisible = false;
    this.modalValidateForm.reset();
  }

  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }
}
