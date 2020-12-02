import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
import {urls} from "../../../../common/model/url";
import {isLineBreak} from "codelyzer/angular/sourceMappingVisitor";

@Component({
  selector: 'app-portal-crane-manage',
  templateUrl: './portal-crane-manage.component.html',
  styleUrls: ['./portal-crane-manage.component.css']
})
export class PortalCraneManageComponent implements OnInit {
  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;
  confimCon: string;
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false;  //弹框显示
  status: string; // 当前按钮的状态
  modalTitle: string; // 提示框标题
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = false;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中数据
  tempSearchParam: any;  //列表数据缓存
  rowid: string;

  addModalFormData: Array<any> = [  //新增弹框项
    {
      name: '港口名称', eName: 'portName', type: 'text', validateCon: '请输入港口名称', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '门机编号', eName: 'portalCraneId', type: 'text', validateCon: '请输入门机编号', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },


    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }

  ];

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.modalValidateForm = this.fb.group({});
    for (let i = 0; i < this.addModalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.addModalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.addModalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.addModalFormData[i].validators.patternStr));
      }
      this.modalValidateForm.addControl(this.addModalFormData[i].eName, new FormControl(
        {value: '', disabled: this.addModalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }


  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectPortalCrane;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }

  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case "Add" :
        this.add();
        break;
      case "Update":
        this.update();
        break;
      case "Delete":
        this.delete();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  };

  add() {
    this.modalFormVisible = true;
    this.modalTitle = '门机管理 > 新增';
    this.status = 'add';
  };

  update() {
    if (!this.selectedData || !this.selectedData[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if (!this.selectedData || this.selectedData.length > 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }

    this.modalFormVisible = true;
    this.modalTitle = '门机管理 > 修改';
    this.status = 'update';
    this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
  };

  updateData(data: any) { // 添加数据
    let diff: boolean = true;
    for (let key in data) {
      if (data[key] !== this.selectedData[0][key]) {
        diff = false;
        break;
      }
    }
    if (diff) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请修改数据后进行操作！'
      });
      return;
    }
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updatePortalCrane;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
        } else {
          // this.nzMess.error('提示消息', '修改失败！');
          this.status = 'update';
        }
      }
    );
  }

  delete() {
    if (this.selectedData.length < 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.confimCon = "确定删除该条记录？";
    this.tplModal = this.nzModal.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    });
    this.status = 'delete';
  }

  deleteData() {   // 删除数据
    this.status = "";
    const params = {url: '', data: {portalCraneModels: []}, method: 'POST'};
    params.url = urls.deletePortalCrane;
    let arr = this.selectedData.map(item => {
      return {rowid: item.rowid}
    });
    params.data.portalCraneModels = [...arr];
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nzMess.success('提示消息', '删除成功！');
          this.selectedData = [];
          this.handleCancel();
        } else {
          // this.nzMess.error('提示消息', '删除失败！');
          this.status = 'delete';

        }
      }
    );
  }


  handleOk() {  // 弹出框相关确认
    if ('delete' === this.status) {
      this.deleteData();
    }
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    if ('add' === this.status) {
      this.addData(this.modalValidateForm.value);
    }
    if ('update' === this.status) {
      this.updateData(this.modalValidateForm.value);
    }

  }

  addData(data: any) { // 添加数据
    this.status = "";
    this.http.post(urls.insertPortalCrane, data).then(res => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '添加成功！');
        } else {
          // this.nzMess.error('提示消息', '添加失败！');
          this.status = 'add';
        }
      }
    );
  }


  selectData(data: any) {  //勾选数据
    this.selectedData = data;
  }

  closeResult() { //重置
    this.modalValidateForm.reset();
  };

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
    this.closeResult();
  };

  addhandleCancel() {  //弹出框消失
    this.modalFormVisible = false;
  }

}
