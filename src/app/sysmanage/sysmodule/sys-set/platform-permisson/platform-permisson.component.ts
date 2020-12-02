import {Component, OnInit} from '@angular/core';
import {environment} from '@env/environment';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-platform-permisson',
  templateUrl: './platform-permisson.component.html',
  styleUrls: ['./platform-permisson.component.css']
})
export class PlatformPermissonComponent implements OnInit {

  modalFormData: Array<any> = [
    {name: '公司名字', eName: 'companyName', type: '', require: true, ErroInf: '请输入公司名字!'},
  ];

  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数存储查询的数据
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  // 数据弹出框
  modalFormVisible = false; // 数据弹窗
  modalValidateForm: FormGroup;
  private status: string;// add添加，update更新
  private rowid: number;//记录rowid;
  // 提示信息
  tplModal: NzModalRef;

  bizCompanyId: string;

  searchData: any;  //

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private router: Router, private info: UserinfoService, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit(): void {
    this.listSearch({page: 1, length: this.pageSize});

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (const data of this.modalFormData) {
      this.modalValidateForm.addControl(data.eName, new FormControl(
        '', data.require ? Validators.required : null
        )
      );
    }
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}BizCompany/getBizCompany`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  //添加
  btnAdd(data: any): void {
    if (!(this.bizCompanyId = this.info.get('USER').companyId)) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择要操作的公司后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.modalTitle = '代办业务公司 > 新增';
    this.modalFormVisible = true;

    /*sessionStorage.removeItem('bizformPermissonData');
    this.router.navigate(['/system/systemSet/bizformPermissonAdd']);
    if (!data.data[0]) {

    }
    else {
      sessionStorage.setItem('bizformPermissonData',JSON.stringify(data.data[0]));
    }*/
  }

  //更新
  btnUpdate(data: any): void {
    if (!data || data.data.length < 1) {
      return;
    }
    this.modalTitle = `业务公司设置 > 修改`;
    this.modalFormVisible = true;
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
  }

  //删除
  btnDelete(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.selectedData = data.data;
    this.status = 'delete';
  }

  // 添加数据
  addData() {
    const params = {
      url: '',
      data: {companyName: this.modalValidateForm.get('companyName').value.replace(/(^\s*)|(\s*$)/g, ''), bizCompanyId: this.bizCompanyId},
      method: 'POST'
    };
    params.url = `${environment.baseUrl}BizCompany/addBizCompany`;

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.create('success', '提示消息', '添加成功');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}BizCompany/updateBizCompany`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tBizCompanyModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}BizCompany/deleteBizCompany`;
    params.data.tBizCompanyModels = this.selectedData;

    this.httpUtilService.request(params).then(
      (res: any) => {
        this.nn.create('success', '提示消息', '删除成功');
        this.selectedData = [];
        this.listSearch({});
      }
    );
  }

  //删除框确认
  modalConfirmResult(data: any): void {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status) {
      this.addData();
    }
  }

  handleCancel(): void {
    this.modalFormVisible = false;
  }

  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 弹出框销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

}
