import {Component, OnInit, ViewChild} from '@angular/core';
import {portUrl} from '../../../../common/model/portUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from "../../../../common/model/url";
import {Utils as SeaUtils} from "../../../sea/common/utils";

@Component({
  selector: 'app-downtime-collect',
  templateUrl: './downtime-collect.component.html',
  styleUrls: ['./downtime-collect.component.css']
})
export class DowntimeCollectComponent implements OnInit {

  dataSet1: any = [];
  pageSize1: any = 30;
  totalPages1: any = 0;
  listLoading1: boolean = false;

  tempCondition: any = {};
  updateData: any = [];
  tplModal: NzModalRef;
  buttonId: any;

  boatBatchNum: any;
  boatNum: any;validate
  showExplainFlag: boolean = false;
  boatInfo: any = {};
  arr: [];
  shipingSpaceArr: any = [];
  lockoutTypeArr: any = [];

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '停工类型', eName: 'lockoutType', type: 'select', validateCon: '请填写停工结束时间', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '停工原因', eName: 'lockoutCause', type: 'text', validateCon: '请输入停工原因', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '船批号', eName: 'boatBatchNum', type: 'inputModal', validateCon: '请选择船批', require: true,
      findset: {
        formId: 'form_collect_boat',
        name: '船批号',
        parameter: 'boatBatchNum',
        parameterSend: 'boatNum',
        url: 'selectTBoat'
      },
      validate: {validateOpt: 'inpValue', validateCon: '请选择船批'},
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false, disabled: true,
      validators: {
        require: false
      }
    },
    {
      name: '舱位', eName: 'shippingSpace', type: 'select1', validateCon: '请填写舱位', require: false, disabled: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划到港时间', eName: 'expectPortTime', type: 'time', validateCon: '请填写计划到港时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划靠泊时间', eName: 'expectBerthTime', type: 'time', validateCon: '请填写计划靠泊时间', require: false,
      validators: {
        require: false
      }
    },

    {
      name: '停工开始时间', eName: 'lockoutStartTime', type: 'time', validateCon: '请填写停工开始时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '停工结束时间', eName: 'lockoutEndTime', type: 'time', validateCon: '请填写停工结束时间', require: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '码头合并情况', eName: 'dockMerged', type: 'text', validateCon: '请填写码头合并情况', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    // {
    //   name: '载重量', eName: 'loadWeight', type: 'text', validateCon: '请填写载重量', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '停工备注', eName: 'remark', type: 'text', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];


  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private fb: FormBuilder) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
    this.getStatic(this.lockoutTypeArr, 'TGLX');
    this.getStatic(this.shipingSpaceArr, 'CW');
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl({
        value: '',
        disabled: item.disabled
      }, validatorOpt));
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
    let url = portUrl.selectCollectLockout;
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

    this.tplTitle = '停工采集 > 新增';
    this.tipModalCreat();
    this.boatBatchNum = '';
    this.boatNum = '';

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data: any) {
    let url = portUrl.deleteCollectLockout;
    let param: any = {tCollectLockoutModelList: []};
    this.updateData.forEach(item => param.tCollectLockoutModelList.push({
      billNum: item.billNum,
      boatBatchNum: item.boatBatchNum
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

    this.tplTitle = '停工采集 > 修改';
    this.tipModalCreat();
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.boatBatchNum = this.updateData[0].boatBatchNum;

  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data: any) {
    this.boatInfo = data.selData ? data.selData[0] : {};
    this.boatBatchNum = data.inpName || '';
    this.boatInfo.expectPortTime = this.boatInfo.expectToportTime || null;
    this.boatInfo.expectBerthTime = this.boatInfo.expectBerthingTime || null;
    this.modalValidateForm.patchValue(this.boatInfo);
  }


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
    let url = this.buttonId === 'Add' ? portUrl.insertCollectLockout : portUrl.updateBoatStowage;
    let param = this.modalValidateForm.getRawValue();
    param.expectPortTime = SeaUtils.format(param.expectPortTime, 's');
    param.expectBerthTime = SeaUtils.format(param.expectBerthTime, 's');
    param.lockoutEndTime = SeaUtils.format(param.lockoutEndTime, 's');
    param.lockoutStartTime = SeaUtils.format(param.lockoutStartTime, 's');
    this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', tipInfo, {nzDuration: 3000});
        this.listSearch(this.tempCondition);
        this.tplModal.destroy();
      }
    })
  }

  /**
   * 创建弹窗
   */
  tipModalCreat(): void {
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

  getStatic(data: Array<any>, valueSetCode: string): void {  //获取停工类型
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
