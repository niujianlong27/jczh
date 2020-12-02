import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { GlobalService } from '../../../../common/services/global-service.service';
import { ImgViewerService } from '@component/img-viewer/img-viewer';
import { urls } from '@model/url';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-vehicle-manage',
  templateUrl: './vehicle-manage.component.html',
  styleUrls: ['./vehicle-manage.component.css']
})
export class VehicleManageComponent implements OnInit {
  dataSet: any;// 表格里数据
  deleteVisible = false;// 删除弹窗显示控制
  modalTitle: string;// 删除弹窗标题
  deleteCon: string;// 删除弹窗文字内容
  // pageSize: number = 10;//条数
  totalPage: number;// 数据总条数
  listLoading: boolean = true;// 表格是否在加载中
  selectedData: Array<any> = [];
  searchData: any = {};
  status: string;
  public visible: boolean;
  public checkLoading: boolean;
  public rejectLoading: boolean;
  public modalForm: FormGroup;
  public auditStatusArr: any[] = [];
  @ViewChild('urlImg1') urlImg1: TemplateRef<any>;
  @ViewChild('urlImg2') urlImg2: TemplateRef<any>;
  @ViewChild('urlImg3') urlImg3: TemplateRef<any>;
  @ViewChild('urlImg4') urlImg4: TemplateRef<any>;
  @ViewChild('urlImg5') urlImg5: TemplateRef<any>;
  @ViewChild('urlImg6') urlImg6: TemplateRef<any>;
  @ViewChild('auditStatus') auditStatus: TemplateRef<any>;
  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  private tplModal: NzModalRef; // 弹窗相关

  constructor(private router: Router,
              private httpUtilService: HttpUtilService,
              private info: UserinfoService,
              private nm: NzModalService,
              private msg: NzMessageService,
              private nn: NzNotificationService,
              private fb: FormBuilder,
              private imgService: ImgViewerService,
              private global: GlobalService) {
  }

  ngOnInit(): void {
    this.global.searchReload.subscribe((x: any) => {
      if (x.target === 'vehicleManage') {
        this.listSearch({ ...this.searchData });
      }
    });
    this.getAuditStatus();
  }

  private getAuditStatus() {
    this.httpUtilService.post(
      `${environment.baseUrl}static/getStatic`,
      {
        valueSetCode: 'SHZT'
      }
    ).then((res: any) => {
      if (res.success) {
        this.auditStatusArr = (res.data.data && res.data.data.data) || [];
      }
    });
  }

  public statusName(flag: string) {
    const data = this.auditStatusArr.filter((x: any) => x.value === flag);
    if (data[0]) {
      return data[0].name;
    }
    return '';
  };

  listSearch(data: any) { // 查询
    data.page = data.page || 1; // 最好有
    data.length = data.length;
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.searchData = data;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.selectedData = [];
    this.listLoading = true;
    const params = { url: '', data: {}, method: 'POST' };
    params.url = urls.getVehicle;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = (res.data.data && res.data.data.data) || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  btnClick(data) {
    switch (data.type.buttonId) {
      case 'Submit' : // 审核
        this.Auth();
        break;
      case 'Auth' : // 批量审核
        this.submit();
        break;
      case 'Back' :
        this.Back();
        break;
    }
  }

  selected(data) {
    this.selectedData = data;
  }

  // 添加
  btnAdd(): void {
    sessionStorage.removeItem('vehicleData');
    // this.router.navigate(['/system/baseInformation/vehicleAdd'], {queryParams: {vehicleData: false}});
    this.router.navigate(['/system/baseInformation/vehicleAdd']);
  }

  // 更新
  btnUpdate(data: any): void {
    if (!data || data.data.length !== 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    sessionStorage.removeItem('vehicleData');
    // this.router.navigate(['/system/baseInformation/vehicleAdd'], {queryParams: {vehicleData: true}});
    sessionStorage.setItem('vehicleData', JSON.stringify(data.data[0] || {}));
    this.router.navigate(['/system/baseInformation/vehicleUpdate']);
  }

  // 删除
  btnDelete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.status = 'delete';
  }

  deleteData() {
    const params = { url: '', data: { tVehicleModels: [] }, method: 'POST' };
    params.url = urls.deleteTvehicle;
    params.data.tVehicleModels = this.selectedData;

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.searchData.page = 1;
          this.listSearch({ ...this.searchData });
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  submit() { // 批量审核
    const data = this.dataSet.filter((x: any) => x.checked);
    if (!data[0] || data.length < 1) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '请选择数据进行批量审核'
      });
      return;
    }
    const bool = data.some((x: any) => x.auditStatus === 'SHZT10');
    const boo = data.some((x: any) => x.auditStatus === 'SHZT30');
    if (bool && boo) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '已通过和未通过车辆无法同时审批!'
      });
      return;
    }
    this.visible = true;
    this.modalForm = this.fb.group({
      remark: [null],
      backReason: [null]
    });
    /* this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认提交审核?',
      nzOnOk: () => {
        const data = this.selectedData.map(item => {
          return {
            rowid: item.rowid,
            vehicleNo: item.vehicleNo
          };
        });
        this.httpUtilService.post(urls.updateSubmit, { tVehicleModels: data }).then(
          (res: any) => {
            if (res.success) {
              this.nn.success('提示消息', res.data.data);
              this.listSearch(this.searchData);
            }
          });
      }

    }); */
  }

  public check() {
    const bool = this.selectedData.some((x: any) => x.auditStatus === 'SHZT10');
    if (bool) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '请选择未审核和未通过状态的车辆'
      });
      return;
    }
    if (this.modalForm.get('backReason').value) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '通过操作不要录入驳回理由！'
      });
      return;
    }
    this.checkLoading = true;
    this.httpUtilService.post(
      `${environment.baseUrl}vehicle/checkAccess`,
      {
        remark: this.modalForm.get('remark').value,
        tVehicleModels: [
          ...this.selectedData
        ]
      }
    ).then((res: any) => {
      this.checkLoading = false;
      if (res.success) {
        this.visible = false;
        this.nm.success({
          nzTitle: '信息提示',
          nzContent: res.data.msg
        });
        this.listSearch(this.searchData);
      }
    });
  }

  public reject() {
    const bool = this.selectedData.some((x: any) => x.auditStatus === 'SHZT30');
    if (bool) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '选择未审核和已通过状态的车辆'
      });
      return;
    }
    if (!this.modalForm.get('backReason').value) {
      this.nm.error({
        nzTitle: '信息提示',
        nzContent: '驳回操作必须录入驳回理由！'
      });
      return;
    }
    this.rejectLoading = true;
    this.httpUtilService.post(
      `${environment.baseUrl}vehicle/checkReject`,
      {
        remark: this.modalForm.get('remark').value,
        backReason: this.modalForm.get('backReason').value,
        tVehicleModels: [
          ...this.selectedData
        ]
      }
    ).then((res: any) => {
      this.rejectLoading = false;
      if (res.success) {
        this.visible = false;
        this.nm.success({
          nzTitle: '信息提示',
          nzContent: res.data.msg
        });
        this.listSearch(this.searchData);
      }
    });
  }

  Auth() { // 审核
    const data = this.dataSet.filter((x: any) => x.checked);
    if (!data[0] || data.length !== 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行审核！'
      });
      this.destroyTplModal();
      return;
    }
    sessionStorage.removeItem('vehicleData');
    sessionStorage.setItem('vehicleData', JSON.stringify(data[0] || {}));
    this.router.navigate(['/system/baseInformation/vehicleCheck']);
    /* if (!this.selectedData || this.selectedData.length < 1) {
      this.msg.error('请至少选择一条数据操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认审核?',
      nzOnOk: () => {
        let data = this.selectedData.map(item => {
          return {
            rowid: item.rowid,
            vehicleNo: item.vehicleNo
          };
        });
        this.httpUtilService.post(urls.updateAuth, {tVehicleModels: data}).then(
          (res: any) => {
            if (res.success) {
              this.nn.success('提示消息', res.data.data);
              this.listSearch(this.searchData);
            }
          });
      }

    }); */
  }

  Back() { // 驳回
    if (!this.selectedData || this.selectedData.length < 1) {
      this.msg.error('请至少选择一条数据操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否将选中的数据驳回?',
      nzOnOk: () => {
        const data = this.selectedData.map(item => {
          return {
            rowid: item.rowid,
            vehicleNo: item.vehicleNo
          };
        });
        this.httpUtilService.post(urls.updateBack, { tVehicleModels: data }).then(
          (res: any) => {
            if (res.success) {
              this.nn.success('提示消息', res.data.data);
              this.listSearch(this.searchData);
            }
          });
      }

    });
  }

  // 删除框确认
  modalConfirmResult(data: any): void {
    if (data.type === 'ok') {
      if (this.status === 'delete') {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  columns(data: any) {
    // const url = data.filter((x: any) => x.type === 'url');
    data.forEach(item => {
      if (item.colEname === 'drivingPhotos') {
        item.type = 'url';
        item.tdTemplate = this.urlImg1;
      }
      if (item.colEname === 'drivingPhotos2') {
        item.tdTemplate = this.urlImg2;
        item.type = 'url';
      }
      if (item.colEname === 'vehicleImgUrl2') {
        item.tdTemplate = this.urlImg3;
        item.type = 'url';
      }
      if (item.colEname === 'vehicleImgUrl') {
        item.tdTemplate = this.urlImg4;
        item.type = 'url';
      }
      if (item.colEname === 'drivelicenseImg') {
        item.tdTemplate = this.urlImg5;
        item.type = 'url';
      }
      if (item.colEname === 'drivelicenseImg2') {
        item.tdTemplate = this.urlImg6;
        item.type = 'url';
      }
      if (item.colEname === 'auditStatus') {
        item.tdTemplate = this.auditStatus;
        item.type = 'self'; // 自定义
      }
      // item.colEname == 'commercialInsuranceImg' && (item.tdTemplate = this.urlImg5);
    });
  }

  // 预览图片
  getView(e: MouseEvent, data: string) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({ url: urls });
    }
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  companyChange(): void {
    this.searchData.page = 1;
    this.listSearch({ ...this.searchData });
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };
}
