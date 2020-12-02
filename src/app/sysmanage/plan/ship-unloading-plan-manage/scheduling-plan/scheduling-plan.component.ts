import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {planUrl} from '../../../../common/model/planUrls';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {UploadFiles} from '../../../../common/services/upload-files';
import {ShipPlan} from '../../shipment-plan-manage/ship-loading/ship-plan-status.enum';
import {ShipUnloading} from '../ship-unloading.enum';

@Component({
  selector: 'app-scheduling-plan',
  templateUrl: './scheduling-plan.component.html',
  styleUrls: ['./scheduling-plan.component.css']
})
export class SchedulingPlanComponent implements OnInit {

  buttonId: string;
  tmpButtonId: string;
  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  total: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  packPageSize: number = 30;//条数
  packTotal: number; // 数据总条数


  dataSet: Array<any> = []; // 主列表数据
  selectedData: Array<any> = []; // 主列表选中的数据
  packDataSet: Array<any> = []; // 子列表数据
  packSelectedData: Array<any> = [];//子列表选中数据
  searchData: any;  //存储查询的数据缓存

  detailModalSelectData: Array<any> = []; // 弹窗明细选中

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  rowid: string = '';
  shipPlanModalSelectData: Array<any>;
  shipPlanModal: NzModalRef;

  detailDataModalList: Array<any> = []; // 弹窗明细数据
  shipPlanModalList: Array<any> = []; // 船舶计划数据
  shipPlanModalTotal: number = 0; //数据总条数
  shipPlanModalPageSize: number = 30; //数据总条数

  showChildrenList: boolean = false;//初始不显示子列表
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  modalSpinning: boolean = false; // 弹窗加载状态

  importUrl = planUrl.import + '?requestCompanyId=' + this.userInfo.get('USER').companyId;
  updateImport = planUrl.updateImport + '?requestCompanyId=' + this.userInfo.get('USER').companyId + '&requestUserId=' + this.userInfo.get('USER').userId;
  fileList: UploadFile[] = [];
  clickParam: any = {
    companyId: '',
    scheduleNum: ''
  }; //点击数据

  scheduleTypeList: Array<any> = [];
  modalFormData: Array<any> = [
    // {
    //   name: '调度计划号', eName: 'scheduleNum', type: 'text', validateCon: '请填写船舶计划号', require: false, disabled: true,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    // {
    //   name: '调度类型', eName: 'scheduleType', type: 'select', validateCon: '请选择调度类型', require: true,
    //   validators: {
    //     require: true
    //   },
    //   selectList: this.scheduleTypeList
    // },

    {
      name: '船长', eName: 'captain', type: 'text', validateCon: '请填写船长', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '联系电话', eName: 'contactsPhone', type: 'text', validateCon: '请填写联系电话', require: true, disabled: true,
      validators: {
        require: true
      }
    },
  ];

  inputDisabled: any = {
    createId: true,
    createDate: true,
    updateId: true,
    updateDate: true,
    companyId: true,
    scheduleNum: true,
    boatBatchNum: true,
  };

  @ViewChild('boatPlan') boatPlanRef: TemplateRef<any>;
  @ViewChild('importDataModal') importRef: TemplateRef<any>;
  spinning: boolean = false; //加载状态


  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private userInfo: UserinfoService,
    public upload: UploadFiles
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(
      res => {
        let validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        res.validators.pattern ? validatorOrOpts.push(Validators.required) : null;
        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    // this.getStatic(this.scheduleTypeList, 'ZXLX');
  }

  /**
   * 查询
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询
   * @param param
   */
  private getListSearch(param: any) {
    param.scheduleType = 'ZXLX20';
    this.listLoading = true;
    const url = planUrl.getMainList;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.packDataSet = [];
          this.packSelectedData = [];
          this.selectedData = [];
          this.dataSet = res.data.data.data;
          this.total = res.data.data.total;
        }
      }
    );

  }

  /**
   * 子列表查询
   */
  getPackList(param: any): void {
    this.spinning = true;
    param.companyId = this.clickParam.companyId;
    param.scheduleNum = this.clickParam.scheduleNum;
    this.http.post(planUrl.selectBoatSchedulePack, param).then(
      res => {
        this.spinning = false;
        if (res.success) {
          this.tmpButtonId = '';
          this.packSelectedData = [];
          this.packDataSet = res.data.data && res.data.data.data || [];
          // this.packTotal = res.data.data.total;
          this.packDataSet.forEach(
            (value, index) => {
              value.index = index;
            }
          );
        }
      }
    );
  }


  /**
   * 按钮点击事件
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.buttonId;
    switch (this.buttonId) {
      case 'Add':// 新增按钮
        this.btnAdd();
        break;
      case 'SaveAdd': //弹窗列表保存
        this.SaveAdd();
        break;
      case 'Update': // 修改
        this.btnUpdate();
        break;
      case 'Del': //删除
        this.btnDelete();
        break;
      case 'Save': // 保存
        this.btnSave();
        break;
      case 'Select': // 选择船舶计划
        this.selectShipPlan();
        break;
      case 'DoIssue': // 下发
        this.issued();
        break;
      case 'AddPack': // 新增明细
        this.addDetailData();
        break;
      case 'DeletePack': // 新增明细
        this.deletePack();
        break;
      case 'Import': // 导入明细
        this.import();
        break;
      case 'Copy': // 复制明细
        this.copyDetailData();
        break;
      case 'AddPack1': // 新增捆包
        this.addPackData();
        break;
      case 'UpdatePack': // 修改捆包
        this.updatePackData();
        break;
      case 'RemovePack': // 删除捆包
        this.removePack();
        break;
      case 'SavePack': // 保存
        this.savePack();
        break;
      case 'Cancellation': // 撤销下发
        this.cancellation();
        break;
    }
  }

  /**
   * 选中数据
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectedData = param;
    this.packDataSet = [];
    this.buttonId = '';
    this.tmpButtonId = '';

    if (this.selectedData.length !== 0) {
      this.clickParam.companyId = param[0].companyId;
      this.clickParam.scheduleNum = param[0].scheduleNum;
      this.getPackList({page: 1, length: this.packPageSize});
    } else {
      this.clickParam.companyId = '';
      this.clickParam.scheduleNum = '';
    }
  }

  /**
   * 添加
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '卸船调度计划 > 新增';
    this.status = 'add';
  }

  /**
   * 修改按钮点击
   */
  btnUpdate(): void {
    if (this.selectedData.length === 0 || this.selectedData.length > 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }

    const status = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status) {
      this.nn.warning('提示消息', '请撤销下发后再修改！');
      return;
    }
    this.nm.create({
      nzTitle: '修改明细导入',
      nzContent: this.importRef,
      nzOnOk: () => this.updateFile()
    }).afterClose.subscribe(() => {
      this.fileList = [];
    });
    // this.modalFormVisible = true;
    // this.modalTitle = '卸船调度计划 > 修改';
    // this.status = 'update';
    // this.rowid = this.selectedData[0].rowid;
    // this.modalValidateForm.patchValue(this.selectedData[0]);

  }

  /**
   * 主列表修改请求
   */
  updateFile(): Promise<any> {
    // const modalFormData = this.selectedData[0];
    // modalFormData.scheduleType = 'ZXLX10';
    // const formData = new FormData();
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
        formData.append('file', file);
      }
    );

    // formData.append('mainModelStr', JSON.stringify(modalFormData));

    return this.http.post(this.updateImport + '&scheduleNum=' + this.selectedData[0].scheduleNum, formData).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '上传成功!');
          this.modalFormVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
          return true;
        } else {
          return false;
        }
      }
    );

  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    const status = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status) {
      this.nn.warning('提示消息', '选中数据有已下发数据，不能删除！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认删除吗？',
      nzOnOk: () => this.deleteData()
    });
  }

  /**
   * 保存
   */
  btnSave() {
    const modalFormData = this.modalValidateForm.getRawValue();
    modalFormData.scheduleType = 'ZXLX20';
    if (!modalFormData.boatBatchNum) {
      this.nn.warning('提示消息', '请选择船舶计划后操作！');
      return;
    }
    const param = {
      boatScheduleMainModelList: [],
      boatSchedulePackModelList: this.detailDataModalList
    };

    param.boatScheduleMainModelList.push(modalFormData);
    this.http.post(planUrl.addMainList, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '新增成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 删除请求
   */
  deleteData(): Promise<any> {
    const url = planUrl.deleteXCList;
    return this.http.post(url, {boatScheduleMainModelList: this.selectedData}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 下发
   */
  issued(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后下发！');
      return;
    }
    const status = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status) {
      this.nn.warning('提示消息', '选中数据有已下发数据，不能再次下发！');
      return;
    }

    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认下发吗？',
      nzOnOk: () => this.issuedData()
    });
  }

  /**
   * 下发请求
   */
  issuedData(): Promise<any> {
    const url = planUrl.sendMain;
    return this.http.post(url, {scheduleNum: this.selectedData[0].scheduleNum}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '下发成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 撤销下发
   */
  cancellation(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }
    if (this.selectedData[0].status === 'CBDD70') {
      this.nn.warning('提示消息', '已下发，请勿重复操作！');
      return;
    }

    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认撤销下发吗？',
      nzOnOk: () => this.cancelRequest()

    });

  }

  /**
   * 取消下发请求
   */
  cancelRequest(): Promise<any> {

    const url = planUrl.revocationMain;
    // const params = {scheduleNum: []};
    // this.selectedData.forEach(
    //   res => {
    //     params.scheduleNum.push({boatBatchNum: res.boatBatchNum});
    //   }
    // );
    return this.http.post(url, {scheduleNum: this.selectedData[0].scheduleNum}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '撤销下发成功!');
          this.listSearch({page: 1, length: this.pageSize});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  //弹窗控制
  /**
   * 弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {

    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {

    }

  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭回调
   */
  closeResult() {
    this.modalValidateForm.reset({});
    this.detailDataModalList = [];
  }


  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }


  rightShowFun() {
    this.showChildrenList = !this.showChildrenList;
    if (this.showChildrenList) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
  }

  /**
   * 新增明细
   */
  addDetailData(): void {
    this.detailDataModalList = [{
      index: this.detailDataModalList.length,
      EDIT: true,
      inputDisabled: this.inputDisabled,
      EDITSTATUS: true
    }, ...this.detailDataModalList];
  }

  /**
   * 弹窗删除明细
   */
  deletePack() {
    if (this.detailModalSelectData.length === 0) {
      this.nn.warning('提示消息', '请选择明细后操作');
      return;
    }
    this.detailModalSelectData.forEach(
      res1 => {
        this.detailDataModalList = this.detailDataModalList.filter(
          res => res.index !== res1.index
        );
      }
    );
  }

  /**
   * 选择船舶计划
   */
  selectShipPlan(): void {
    this.getShipPlanData({page: 1, length: this.shipPlanModalPageSize});
    this.shipPlanModal = this.nm.create(
      {
        nzTitle: '选择船舶计划',
        nzContent: this.boatPlanRef,
        nzOnOk: () => {
          this.modalValidateForm.patchValue(this.shipPlanModalSelectData[0]);
        }
      }
    );

    this.shipPlanModal.afterClose.subscribe(() => {
      this.shipPlanModalList = [];
      this.shipPlanModalSelectData = [];
    });

  }

  /**
   * 卸船船舶计划数据获取
   */
  getShipPlanData(param: any): void {
    const url = planUrl.selectListByStatus;
    param.planType = 'ZXLX20';
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.shipPlanModalList = res.data.data || [];
          // this.shipPlanModalTotal = res.data.data.total;
          // this.selectedData = [];
        }
      }
    );
  }

  /**
   * 船舶计划条数事件
   * @param param
   */
  shipPlanModalPageSizeChange(param: any) {
    this.shipPlanModalPageSize = param;
    this.getShipPlanData({page: 1, length: this.shipPlanModalPageSize});
  }

  /**
   * 船舶计划页码更改事件
   * @param param
   */
  shipPlanModalPageIndexChange(param: any) {
    this.getShipPlanData({page: param, length: this.shipPlanModalPageSize});
  }

  /**
   * 船舶计划选择数据
   * @param param
   */
  shipPlanModalUpdateChange(param: Array<any>) {
    this.shipPlanModalSelectData = param;
  }

  /**
   * 明细页码更改事件
   * @param param
   */
  packPageIndex(param: any) {
    if (this.clickParam.companyId) {
      this.getPackList({page: param, length: this.packPageSize});
    }
  }

  /**
   * 明细条数修改事件
   * @param param
   */
  packPageSizeChange(param: any) {
    this.packPageSize = param;

    if (this.clickParam.companyId) {
      this.getPackList({page: 1, length: this.packPageSize});

    }
  }

  /**
   * 获取静态数据
   * @param data
   * @param valueSetCode
   */
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  /**
   * 捆包明细选中
   * @param param
   */
  packUpdateDataResult(param: Array<any>) {
    this.packSelectedData = param;
  }

  /**
   * 捆绑明细增加
   */
  addPackData(): void {
    const status = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status) {
      this.nn.warning('提示消息', '请撤销下发后再修改！');
      return;
    }

    if (this.selectedData.length == 0) {
      this.buttonId = '';
      this.nn.warning('提示消息', '请选择调度计划后操作!');
    } else {
      this.tmpButtonId = 'AddPack1';
      this.packDataSet = [{
        index: this.packDataSet.length,
        EDIT: true,
        inputDisabled: this.inputDisabled,
        EDITSTATUS: true
      }, ...this.packDataSet];
    }
  }

  /**
   * 捆包明细修改
   */
  updatePackData(): void {

    const status = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status) {
      this.nn.warning('提示消息', '请撤销下发后再修改！');
      return;
    }
    if (this.selectedData.length === 0) {
      this.buttonId = '';
      this.tmpButtonId = '';
      this.nn.warning('提示消息', '请选择调度计划后操作!');
    } else if (this.packSelectedData.length === 0) {
      this.buttonId = '';
      this.tmpButtonId = '';
      this.nn.warning('提示消息', '请选择明细后操作!');
    } else {
      this.tmpButtonId = 'UpdatePack';
      this.packSelectedData.forEach(
        res => {
          res.EDIT = true;
        }
      );
    }

  }

  /**
   * 保存捆包
   */
  savePack(): void {
    const paramData = this.packDataSet.filter(res => res.EDIT);
    if (paramData.length === 0) {
      this.nn.warning('提示消息', '明细无变动!');
      return;
    }
    const url = this.tmpButtonId === 'AddPack1' ? planUrl.addPackXcSchedule : planUrl.updateXcPackList;
    const param =
      {
        companyId: this.selectedData[0].companyId,
        scheduleNum: this.selectedData[0].scheduleNum,
        boatBatchNum: this.selectedData[0].boatBatchNum,
        boatSchedulePackModelList: paramData
      };
    this.spinning = true;
    this.http.post(url, param).then(
      res => {
        this.spinning = false;
        if (res.success) {
          this.nn.success('提示消息', '保存成功!');
          this.getPackList({page: 1, length: this.packPageSize});
          this.tmpButtonId = '';
        }
      }
    );
  }

  /**
   * 删除捆包
   * @constructor
   */
  removePack() {
    if (this.packSelectedData.length === 0) {
      this.nn.warning('提示消息', '请选择明细后操作!');
      return;
    }
    const status2 = this.selectedData.some(
      res => ShipUnloading.Dischage === res.unloadStatus
    );
    if (status2) {
      this.nn.warning('提示消息', '请撤销下发后再修改！');
      return;
    }
    // const status = this.packSelectedData.some(
    //   res =>
    //     res.EDITSTATUS
    // );
    // if (status) {
    //   this.nn.warning('提示消息', '有未保存数据，不可删除！');
    //   return;
    // }

    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认删除明细',
        nzOnOk: () => this.removePackData()

      }
    );

  }

  /**
   * 删除捆包请求
   */
  removePackData(): Promise<any> {
    this.spinning = true;
    const boatSchedulePackModelList = this.packSelectedData.filter(
      res => {
        this.packDataSet = this.packDataSet.filter(
          value1 => value1.index !== res.index
        );
        return res.rowid;
      }
    );

    if (boatSchedulePackModelList.length === 0) {
      return new Promise<boolean>(
        resolve => {
          this.spinning = false;
          this.packSelectedData = [];
          resolve(true);
        }
      );
    }
    return this.http.post(planUrl.removePack, {boatSchedulePackModelList: boatSchedulePackModelList}).then(
      res => {
        this.spinning = false;
        if (res.success) {
          this.nn.success('提示消息', '删除明细成功!');
          this.packSelectedData = [];
          // this.getPackList({page: 1, length: this.packPageSize});
        }
      }
    );
  }

  /**
   * 弹窗明细 选中
   * @param param
   */
  detailModalUpdateDataResult(param: Array<any>) {
    this.detailModalSelectData = param;
  }

  /**
   * 复制明细
   */
  copyDetailData(): void {
    if (this.detailModalSelectData.length === 0) {
      this.nn.warning('提示消息', '请选择要复制的明细后操作!');
      return;
    } else {
      const tmp = [];
      this.detailModalSelectData.forEach(
        res => {
          const tmp2 = Utils.deepCopy(res);
          tmp2.EDIT = true;
          tmp.push(tmp2);
        }
      );
      this.detailDataModalList = [...tmp, ...this.detailDataModalList];
    }

  }

  /**
   * 导入
   */
  import(): void {
    this.nm.create({
      nzTitle: '明细导入',
      nzContent: this.importRef,
      nzOnOk: () => this.handleUpload(),
    }).afterClose.subscribe(() => {
      this.fileList = [];
    });
  }

  /**
   * 文件上传处理
   * @param file
   */
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  /**
   * 确认上传
   */
  handleUpload(): Promise<any> {

    const modalFormData = this.modalValidateForm.getRawValue();
    if (!modalFormData.boatBatchNum) {
      this.nn.warning('提示消息', '请选择船舶计划后上传!');
      return new Promise<boolean>(
        (resolve, reject) => reject(false)
      );
    }
    modalFormData.scheduleType = 'ZXLX20';
    modalFormData.requestUserId = this.userInfo.get('USER').userId;
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
        formData.append('file', file);
      }
    );

    formData.append('mainModelStr', JSON.stringify(modalFormData));

    return this.http.post(this.importUrl, formData).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '上传成功!');
          this.modalFormVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        } else {
          return false;
        }
      }
    );

  }

  /**
   * 子列表 pop弹窗事件
   * @param param
   */
  childModalChange(param: any) {
    switch (param.eName) {
      case 'consignor':
        this.packDataSet[param.index].consignorId = param.inpValue;
        break;
      case 'receiver':
        this.packDataSet[param.index].receiverId = param.inpValue;
        break;
    }
  }

  /**
   * 主列表点击事件
   * @param param
   */
  listClick(param: any) {
    this.dataSet.forEach(
      res => {
        res.checked = false;
      }
    );
    this.selectedData = [];
    this.selectedData[0] = param;
    param.checked = true;
    this.clickParam.companyId = param.companyId;
    this.clickParam.scheduleNum = param.scheduleNum;
    this.getPackList({page: 1, length: this.packPageSize});
  }


  /**
   * 保存
   */
  SaveAdd() {
    this.modalSpinning = true;
    this.saveRequest();
  }

  /**
   * 弹窗保存请求
   */
  saveRequest(): void {
    const url = planUrl.insertBoatSchedulePack;
    const param: any = this.modalValidateForm.getRawValue();
    param.scheduleType = 'ZXLX20';
    param.boatSchedulePackModelList = this.detailDataModalList;
    this.http.post(url, param).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '保存成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );

  }

  /**
   * 弹窗pop事件
   * @param param
   */
  modalPop(param): void {
    switch (param.eName) {
      case 'consignor':
        this.detailDataModalList[param.index].consignorId = param.inpValue;
        break;
      case 'receiver':
        this.detailDataModalList[param.index].receiverId = param.inpValue;
        break;
    }
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }


}
