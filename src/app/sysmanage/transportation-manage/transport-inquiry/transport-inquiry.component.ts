import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../common/util/utils";
import {NzModalRef, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {HttpUtilService} from "../../../common/services/http-util.service";
import {portUrl} from "../../../common/model/portUrl";
import {UserinfoService} from "../../../common/services/userinfo-service.service";
import {urls} from "../../../common/model/url";

@Component({
  selector: 'app-transport-inquiry',
  templateUrl: './transport-inquiry.component.html',
  styleUrls: ['./transport-inquiry.component.css']
})
export class TransportInquiryComponent implements OnInit {

  dataSet1: any = [];
  pageSize1: any = 30;
  totalPages1: any = 0;
  listLoading1: boolean = false;

  tempCondition: any = {};
  updateData: any = [];
  tplModal: NzModalRef;
  buttonId: any;

  boatBatchNum: any;
  boatNum: any;
  showExplainFlag: boolean = false;
  boatInfo: any = {};
  arr: [];
  lockoutTypeArr: any = [];
  istrue: boolean = false;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  modelList: any = [];
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '车牌号', eName: 'vehicleNo', type: 'text', validateCon: '请输入车票号', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },

    {
      name: '司机姓名', eName: 'driverName', type: 'text', validateCon: '请填写司机名称', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '提运类型', eName: 'status', type: 'select', validateCon: '请选择提运类型', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '入库时间', eName: 'warehouseEntryTime', type: 'date', validateCon: '请选择入库时间', require: false,
      validators: {
        require: false,
        pattern: false
      }
    },

    {
      name: '出库时间', eName: 'warehouseOutTime', type: 'date', validateCon: '请选择出库时间', require: false, readOnly: false,
      validators: {
        require: false
      }
    },
    {
      name: '前沿作业开始时间', eName: 'frontierStartTime', type: 'date', validateCon: '请选择前沿作业开始时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '前沿作业结束时间', eName: 'frontierEndTime', type: 'date', validateCon: '请选择前沿作业结束时间', require: false,
      validators: {
        require: false
      }
    },
  ];
  // modalBackFormData: Array<any> = [  //倒货
  //
  // ];
  modalRaiseFormData: Array<any> = [ // 提货
    {
      name: '入港时间', eName: 'enterPortTime', type: 'date', validateCon: '请选择入港时间', require: false,
      validators: {
        require: false,
        pattern: false
      }
    },

    {
      name: '出港时间', eName: 'leavePortTime', type: 'date', validateCon: '请选择出港时间', require: false, readOnly: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '入库时间', eName: 'warehouseEntryTime', type: 'date', validateCon: '请选择入库时间', require: false,
    //   validators: {
    //     require: true,
    //     pattern:false
    //   }
    // },
    //
    // {
    //   name: '出库时间', eName: 'warehouseOutTime', type: 'date', validateCon: '请选择出库时间', require: false,readOnly:false,
    //   validators: {
    //     require: false
    //   }
    // },
    // {
    //   name: '前沿作业开始时间', eName: 'frontierStartTime', type: 'date', validateCon: '请选择前沿作业开始时间', require: true,
    //   validators: {
    //     require: true
    //   }
    // },
    // {
    //   name: '前沿作业结束时间', eName: 'frontierEndTime', type: 'date', validateCon: '请选择前沿作业结束时间', require: true,
    //   validators: {
    //     require: true
    //   }
    // },
  ];


  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private fb: FormBuilder,
              private info: UserinfoService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
    this.getStatic(this.lockoutTypeArr, 'TYCL')
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.tempCondition = data;
    this.getList(data);
  };


  /**
   * 获取主列表数据
   * @param data
   */
  getList(data: any) {
    this.listLoading1 = true;
    let url = urls.selectTVehiclebat;
    let param: any = data;
    this.http.post(url, param).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.updateData = [];

      }
    })
  };


  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {

    if (data.buttonId !== 'Add' && this.updateData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd(data);
        break;
      case 'Delete':
        this.btnDelete(data);
        break;
      case 'Update':
        this.btnUpdate(data);
        break;
      default:
        break;
    }
  };

  /**
   * 新增
   * @param data
   */
  btnAdd(data: any) {
    this.modalValidateForm.reset();

    this.tplTitle = '提运车辆查询> 新增';
    this.tipModalCreat();
    this.boatBatchNum = '';
    this.boatNum = '';

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data: any) {

    let url = urls.deleteTVehiclebat;
    let param: any = {tVehiclebatModelList: []};
    this.updateData.forEach(item => param.tVehiclebatModelList.push({
      vehicleBat: item.vehicleBat
    }));
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempCondition);
      }
    })

  }

  /**
   * 修改
   * @param data
   */
  btnUpdate(data: any) {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.tplTitle = '提运车辆查询 > 修改';
    this.tipModalCreat();
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.boatBatchNum = this.updateData[0].boatBatchNum;

  }

  //
  // /**
  //  * 主列表当前页码变化
  //  * @param page
  //  */
  // getPageIndex1(page: any): void {
  //   this.getList({page: page, length: this.pageSize1});
  // }
  //
  // /**
  //  * 主列表每页展示条数变化
  //  * @param pageSize
  //  */
  // getPageSize1(pageSize: any): void {
  //   this.pageSize1 = pageSize;
  //   this.getList({page: 1, length: this.pageSize1});
  // }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
  }

  /**
   * 弹窗确定
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let url = this.buttonId === 'Add' ? urls.insertTVehiclebat : urls.updateTVehiclebat;
    let param = Utils.deepCopy(this.modalValidateForm.value);
    this.buttonId === 'Update' && (param.vehicleBat = this.updateData[0].vehicleBat);
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    param.warehouseEntryTime = param.warehouseEntryTime instanceof Date ? Utils.dateFormat(param.warehouseEntryTime, 'yyyy-MM-dd HH:mm:ss') : param.warehouseEntryTime || null;
    param.leavePortTime = param.leavePortTime instanceof Date ? Utils.dateFormat(param.leavePortTime, 'yyyy-MM-dd HH:mm:ss') : param.leavePortTime || null;
    param.enterPortTime = param.enterPortTime instanceof Date ? Utils.dateFormat(param.enterPortTime, 'yyyy-MM-dd HH:mm:ss') : param.enterPortTime || null;
    param.frontierEndTime = param.frontierEndTime instanceof Date ? Utils.dateFormat(param.frontierEndTime, 'yyyy-MM-dd HH:mm:ss') : param.frontierEndTime || null;
    param.frontierStartTime = param.frontierStartTime instanceof Date ? Utils.dateFormat(param.frontierStartTime, 'yyyy-MM-dd HH:mm:ss') : param.frontierStartTime || null;
    param.warehouseOutTime = param.warehouseOutTime instanceof Date ? Utils.dateFormat(param.warehouseOutTime, 'yyyy-MM-dd HH:mm:ss') : param.warehouseOutTime || null;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', tipInfo, {nzDuration: 3000});
        this.listSearch(this.tempCondition);
        this.tplModal.destroy();
      }
    })
  }

  change(data: any) {
    if (data == 'TYCL10') {  //提货
      this.modalRaiseFormData.forEach(item => {
        let validatorOpt = [];
        item.validators.require && validatorOpt.push(Validators.required);
        item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
        this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
      });
      this.modelList = [...this.modalRaiseFormData]
    } else {
      this.modelList = []
    }
  }

  /**
   * 创建弹窗
   */
  tipModalCreat(): void {
    this.istrue = true;
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '75%',
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  getStatic(data: Array<any>, valueSetCode: string): void {  //获取车辆类型
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        } else {
          Array.prototype.push.apply(data, []);
        }

      }
    );
  }
}
