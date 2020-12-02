import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {portUrl} from "../../../../common/model/portUrl";
import {FormBuilder, FormControl, Validators, FormGroup} from "@angular/forms";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {Utils as SeaUtils} from "../../../sea/common/utils";
import {urls} from "../../../../common/model/url";

@Component({
  selector: 'app-cabin-efficiency-maintain',
  templateUrl: './cabin-efficiency-maintain.component.html',
  styleUrls: ['./cabin-efficiency-maintain.component.css']
})
export class CabinEfficiencyMaintainComponent implements OnInit {
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
  shipingSpaceArr: any = [];

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
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
    // {
    //   name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false, disabled: true,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '舱位', eName: 'shippingSpace', type: 'select', validateCon: '请填写舱位', require: false, disabled: false,
      validators: {
        require: false
      }
    },
    {
      name: '单舱配载量', eName: 'singleStowageCapacity', type: 'number',unit:'吨', validateCon: '请填写单舱匹配量', require: false, disabled: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划单舱完货时间', eName: 'expectSingleFinishedTime', type: 'number',unit:'小时',  validateCon: '请填写计划单舱完货时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '实际单舱完货时间', eName: 'actualSingleFinishedTime', type: 'number',unit:'小时',  validateCon: '请填写实际单舱完货时间', require: false,
      validators: {
        require: false
      }
    }
  ];

  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
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
    let url = portUrl.selectSingleEfficiency;
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
    this.tplTitle = '单舱效率维护 > 新增';
    this.tipModalCreat();
    this.boatBatchNum = '';
    this.boatNum = '';

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data: any) {
    let url = portUrl.deleteSingleEfficiency;
    let param: any = {tSingleEfficiencyModelList: []};
    this.updateData.forEach(item => param.tSingleEfficiencyModelList.push({
      rowid: item.rowid,
      // boatBatchNum: item.boatBatchNum
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

    this.tplTitle = '单舱效率维护 > 修改';
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
    let url = this.buttonId === 'Add' ? portUrl.insertSingleEfficiency : portUrl.updateSingleEfficiency;
    let param = this.modalValidateForm.getRawValue();
    this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    console.log(param)
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
      nzWidth: '35%',
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
