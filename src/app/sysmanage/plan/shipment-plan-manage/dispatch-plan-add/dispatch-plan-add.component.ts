import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {format} from 'date-fns';
import {planUrl} from "../../../../common/model/planUrls";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../../../../common/util/utils";

@Component({
  selector: 'app-dispatch-plan-add',
  templateUrl: './dispatch-plan-add.component.html',
  styleUrls: ['./dispatch-plan-add.component.css']
})
export class DispatchPlanAddComponent implements OnInit {
  name: string;
  driverId: string;
  vehicleNo: string;
  addModalFormData: Array<any> = [
    {
      name: '泊位', eName: 'berthageName', type: 'text', validateCon: '请输入泊位', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '车牌号', eName: 'travelNo', type: 'inputModal', validateCon: '请选择车牌号', require: true,
      findset: {
        formId: 'form_vehice_model',
        name: '车牌号',
        parameter: 'vehicleNo',
        parameterSend: 'vehicleNo',
        url: 'getVehicle'
      },
      validate: {},
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '司机姓名', eName: 'driverName', type: 'inputModal', validateCon: '请选择司机', require: true,
      findset: {
        formId: 'form_driver_model',
        name: '司机姓名',
        parameter: 'name',
        parameterSend: 'userId',
        url: 'selectDriver'
      },
      validate: {},

      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '联系电话', eName: 'driverPhone', type: 'text', validateCon: '请输入联系电话', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

  ];
  isAdd: boolean = false;
  isAddPack: boolean = false;
  formId: any = 'form_dispatch_path';
  DinpValidate: any;
  TinpValidate: any;
  showExplainFlag: boolean = false;
  searchData: any;//查询条件缓存
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = false;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  selectDatas: any = [];
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;
  btnStatus: any;
  topStatus: any;
  topInfo: any;
  rowid: string;
  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  detailList: Array<any> = [];

  constructor(private http: HttpUtilService,
              private fb: FormBuilder,
              private nzMess: NzNotificationService,
              private router: Router,
              private route: ActivatedRoute,
              private nm: NzModalService) {
  }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    this.addModalFormData = this.addModalFormData ? this.addModalFormData : [];
    for (let i = 0; i < this.addModalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.addModalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.addModalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.addModalFormData[i].validators.patternStr));

      this.modalValidateForm.addControl(this.addModalFormData[i].eName, new FormControl(
        {value: '', disabled: this.addModalFormData[i].disabled}, validatorOrOpts
      ));
    }

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")).status; //当前的按钮状态新增、修改
    let status;
    this.route.queryParams.subscribe(x => {
      status = x.status;
    });
    this.topInfo = JSON.parse(sessionStorage.getItem("dispatchPlanTopInfo") || "{}");//获取顶部的输入信息
    this.topStatus = this.topInfo.btnstatus;

    if (status == 'update') { //获取该出库单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet = [...this.detailList];
    }
    this.rowid = this.topInfo.rowid;
    this.modalValidateForm.patchValue(this.topInfo);
    this.modalValidateForm.get('travelNo').setValue(this.topInfo.travelNo);
    this.modalValidateForm.get('driverName').setValue(this.topInfo.driverName);
    this.name = this.topInfo.driverName || '';
    this.driverId = this.topInfo.driverId || '';
    this.vehicleNo = this.topInfo.travelNo || '';
    let _dataSet = JSON.parse(sessionStorage.getItem('dispatchPlan') || "{}").dispatchPlanList || []; //从库存里导入的明细
    this.dataSet = [...this.dataSet, ..._dataSet];  //从session中带入导入的库存信息到列表中

    this.totalWeight = this.dataSet.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.dataSet.map(item => item.packCount).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);

    if ((this.btnStatus == 'Add' && this.topStatus == 'add') ||
      (this.btnStatus == 'Update' && this.dataSet[0].isBulkcargo == 'ISSH20')) { //新增并且点击新增钢卷明细 按钮禁用
      this.isAddPack = true;
      this.isAdd = false;
      this.formId = 'form_dispatch_path'
    }
    if ((this.btnStatus == 'Add' && this.topStatus == 'addPack') ||
      (this.btnStatus == 'Update' && this.dataSet[0].isBulkcargo == 'ISSH10')) {//新增并且点击新增散货明细 或修改且为散货
      this.isAdd = true;
      this.isAddPack = false;
      this.formId = 'form_dispatch_path_b'
    }
    if (this.btnStatus == 'Add' && this.dataSet.length == 0) { //新增并且明细为空
      this.isAdd = false;
      this.isAddPack = false;
      this.formId = 'form_dispatch_path'

    }


  }

  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case "Add" :
        this.add();
        this.isAddPack = true;
        break;
      case "AddPack" :
        this.addPack();
        this.isAdd = true;
        break;
      case "Cancel" :
        this.router.navigate(['/system/plan/shipmentPlanManage/dispatchPlan']);
        break;
      case "Save" :
        this.save();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }

  addPack() {
    let obj: any = {};
    obj = Utils.deepCopy(this.modalValidateForm.value);
    obj.status = {status: this.btnStatus};
    obj.rowid = this.rowid;
    obj.btnstatus = 'addPack';
    obj.driverId = this.driverId;

    sessionStorage.setItem("dispatchPlanTopInfo", JSON.stringify(obj));
    sessionStorage.setItem('dispatchPlan', JSON.stringify({dispatchPlanList: this.dataSet}));
    this.router.navigate(['/system/plan/shipmentPlanManage/dispatchAddPath'], {queryParams: {from: 'planAddPack'}});
  }

  add() {
    let obj: any = {};
    obj = Utils.deepCopy(this.modalValidateForm.value);
    obj.status = {status: this.btnStatus};
    obj.rowid = this.rowid;
    obj.btnstatus = 'add';
    obj.driverId = this.driverId;
    sessionStorage.setItem("dispatchPlanTopInfo", JSON.stringify(obj));
    sessionStorage.setItem('dispatchPlan', JSON.stringify({dispatchPlanList: this.dataSet}));
    this.router.navigate(['/system/plan/shipmentPlanManage/dispatchAddPath'], {queryParams: {from: 'planAdd'}});
  };

  save() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    // if (this.TinpValidate != 'VALID' || this.DinpValidate != 'VALID') {
    //   this.showExplainFlag = true;
    // }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    if (this.dataSet.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请添加明细后操作！'
      });
      return;
    }

    let url = this.btnStatus == 'Add' ? planUrl.vehicleinsert : planUrl.vehicleupdate;
    let param: any = {vehicleSchedulePacks: '', rowid: ''};
    param = this.modalValidateForm.getRawValue();
    param.driverId = this.driverId;
    param.vehicleSchedulePacks = this.dataSet;
    param.rowid = this.rowid;
    param.boatBatchNum = this.dataSet[0].boatBatchNum;
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nzMess.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/plan/shipmentPlanManage/dispatchPlan'])
        }
      }
    );
  }

  selectData(data: any) { // 主列表数据多选框选择
    this.selectDatas = data;
  }

  inpEmit(data: any, type: any) {
    if (type == 'travelNo') {
      this.modalValidateForm.get('travelNo').setValue(data.inpValue);
      this.TinpValidate = data.inpValidate;
    } else if (type == 'driverName') {
      this.DinpValidate = data.inpValidate;
      this.modalValidateForm.get('driverName').setValue(data.inpName);
      this.driverId = data.inpValue;
      data.selData && this.modalValidateForm.get('driverPhone').setValue(data.selData[0].mobile);
    }


  }

  columns(data: any) {
    if (this.btnStatus == 'Update' && this.dataSet[0].isBulkcargo == 'ISSH10' || this.topStatus == 'addPack') {
      data.forEach(item => {
        if (item.colEname == "packCount" || item.colEname == "weight") {
          item.edit = 'BJBJ10';
        }
      })
    }
  }
  modelChange(data:any){

    this.dataSet[data.index].weight = data.data.weight;
    this.dataSet[data.index].packCount = data.data.packCount;
    this.totalWeight = this.dataSet.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.dataSet.map(item => item.packCount).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 删除列表明细
   * @param data
   * @param i
   */
  delete(data: any, i: number) {
    this.dataSet.splice(i, 1);
    this.dataSet = [...this.dataSet];
    if (this.btnStatus == 'Add' && this.dataSet.length == 0) {
      this.isAdd = false;
      this.isAddPack = false;
    }
    this.totalWeight = this.dataSet.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.dataSet.map(item => item.packCount).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  // 数字NAN修改为0
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

}
