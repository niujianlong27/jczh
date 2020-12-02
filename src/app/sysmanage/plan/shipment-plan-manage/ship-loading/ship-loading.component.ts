import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService, UploadChangeParam, UploadFile} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {planUrl} from '../../../../common/model/planUrls';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';
import {UploadFiles} from '../../../../common/services/upload-files';
import {HttpClient} from '@angular/common/http';
import {ShipPlan, ShipPlanStatus} from './ship-plan-status.enum';


@Component({
  selector: 'app-ship-loading',
  templateUrl: './ship-loading.component.html',
  styleUrls: ['./ship-loading.component.css']
})
export class ShipLoadingComponent implements OnInit {

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

  detailModalSearchData: any = {page: 1}; // 分页数据
  detailModalSelectData: Array<any> = []; // 弹窗明细选中
  detailModalSelectDataMap: Map<any, Array<any>> = new Map<any, Array<any>>(); //调度明细选择数据存储

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  rowid: string = '';
  schedulingPlanModalSelectData: Array<any>;
  schedulingPlanModal: NzModalRef;

  detailDataModalList: Array<any> = []; // 弹窗未修改明细数据
  detailDataModalPageSize: number = 30;
  detailDataModalTotalPage: number = 0;

  loadingSequenceStatus: boolean = false; // 装船顺序是否保存

  modifiedDataModal: Array<any> = []; // 弹窗已修改保存后的数据
  modifiedDataSelect: Array<any> = []; // 弹窗已修改保存后的数据

  btnDisable: any = {
    LoadingSequence: this.detailModalSelectData.length === 0,
    LoadingSequenceDelete: this.modifiedDataSelect.length === 0
  };

  schedulingPlanModalList: Array<any> = []; // 船舶计划数据
  schedulingPlanModalTotal: number = 0; //数据总条数
  schedulingPlanModalPageSize: number = 30; //数据总条数

  showChildrenList: boolean = false;//初始不显示子列表
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';

  importUrl = planUrl.import + '?requestCompanyId=' + this.userInfo.get('USER').companyId;
  fileList: UploadFile[] = [];

  clickParam: any = {
    companyId: '',
    boatBatchNum: ''
  }; //点击数据

  scheduleTypeList: Array<any> = [];
  modalFormData: Array<any> = [
    // {
    //   name: '配载号', eName: 'stowageNum', type: 'text', validateCon: '请填写船舶计划号', require: false, disabled: true,
    //   validators: {
    //     require: false
    //   }
    // },
    // {
    //   name: '调度计划号', eName: 'scheduleNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
    //   validators: {
    //     require: true
    //   }
    // },
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请选择调度类型', require: true, disabled: true,
      validators: {
        require: true
      },
      selectList: this.scheduleTypeList
    },

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
    }, {
      name: '配载图', eName: 'imgStowage', type: 'img', validateCon: '请选择配载图', require: true, disabled: false,
      validators: {
        require: true
      }
    },
  ];

  shipingSpaceNumber: number;
  orderNumber: number;
  @ViewChild('schedulingPlan') schedulingPlanRef: TemplateRef<any>;
  @ViewChild('importDataModal') importRef: TemplateRef<any>;

  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private userInfo: UserinfoService,
    public upload: UploadFiles,
    private angularHttp: HttpClient
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

    this.getStatic(this.scheduleTypeList, 'ZXLX');
    this.upload.setUpload();
  }

  /**
   * 查询
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    param.planType = 'ZXLX10';
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询
   * @param param
   */
  getListSearch(param: any) {

    this.listLoading = true;
    const url = planUrl.getList;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.packDataSet = [];
          this.packSelectedData = [];
          this.selectedData = [];
          this.dataSet = res.data.data.data || [];
          this.total = res.data.data.total || 0;
        }
      }
    );

  }

  /**
   * 子列表查询
   */
  getPackList(param: any): void {
    param.companyId = this.clickParam.companyId;
    param.boatBatchNum = this.clickParam.boatBatchNum;
    this.http.post(planUrl.getPackListByBoatBatchNum, param).then(
      res => {
        if (res.success) {
          this.tmpButtonId = '';
          this.packSelectedData = [];
          this.packDataSet = res.data.data.data || [];
          this.packTotal = res.data.data.total || 0;
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
      case 'Add': // 添加
        // this.btnAdd();
        this.btnUpdate();
        break;
      case 'Update': //修改
        this.btnUpdate();
        break;
      case 'Delete': //删除
        this.btnDelete();
        break;
      case 'Save': // 保存
        this.btnSave();
        break;
      case 'BoatSchedule': // 选择调度计划
        this.selectSchedulingPlan();
        break;
      case 'DoIssue': // 下发
        this.doIssue();
        break;
      case 'Cancellation': // 撤销下发
        this.cancellation();
        break;
      case 'AddPack': // 新增明细
        this.addDetailData();
        break;
      case 'Import': // 导入明细
        this.import();
        break;
      case 'Copy': // 复制明细
        this.copyDetailData();
        break;
      case 'AddPack1': // 新增捆包
        this.tmpButtonId = 'AddPack1';
        this.addPackData();
        break;
      case 'UpdatePack': // 修改捆包
        this.tmpButtonId = 'UpdatePack';
        this.updatePackData();
        break;
      case 'RemovePack': // 删除捆包
        this.removePack();
        break;
      case 'SavePack': // 保存
        this.savePack();
        break;
      case 'LoadingSequence': // 装船顺序保存
        this.loadingSequence();
        break;
      case 'LoadingSequenceDelete': // 装船顺序删除
        this.LoadingSequenceDelete();
        break;
      case 'Export':
        this.export();
        break;
      case 'ExportDetails':
        this.exportDetails();
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
    this.modalTitle = '装船船舶配载 > 新增';
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
    if (!ShipPlan.ShipPlanReleaseableStatus(this.selectedData[0].status)) {
      this.nn.warning('提示消息', '请选择未下发数据操作！');
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '装船船舶配载 > 配船';
    this.status = 'update';
    this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
    this.getDetailDataModalList({page: 1, length: this.detailDataModalPageSize});
    this.imgStowageList = this.upload.getFileList(this.selectedData[0].imgStowage);
  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (!ShipPlan.ShipPlanReleaseableStatus(this.selectedData[0].status)) {
      this.nn.warning('提示消息', '请选择未下发数据操作！');
      return;
    }

    if (!ShipPlan.ShipPlanStowageClear(this.selectedData[0].status)) {
      this.nn.warning('提示消息', '请选择配载过的数据进行清除！');
      return;
    }

    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认清除配载信息么？',
      nzOnOk: () => this.deleteData()
    });
  }

  /**
   * 保存
   */
  btnSave() {
    // if (!this.modalValidateForm.get('stowageNum').value) {
    //   this.nn.warning('提示消息', '请填写完整后操作！');
    //   return;
    // }
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status !== 'VALID') {
      return;
    }
    this.modalSpinning = true;
    const param = this.modalValidateForm.getRawValue();

    this.detailDataModalList.filter(
      res => {
        if (res.shipingSpaceNumber && res.orderNumber) {
          this.modifiedDataModal = [...this.modifiedDataModal, res];
          return false;
        } else {
          return true;
        }
      }
    );

    if (this.modifiedDataModal.length === 0) {
      param['status'] = ShipPlanStatus.CreatedBale;
    } else if (this.modifiedDataModal.length !== this.detailDataModalList.length) {
      param['status'] = ShipPlanStatus.PartStowage;
    } else {
      param['status'] = ShipPlanStatus.HasLoading;

    }


    // if (this.detailDataModalList.length === 0) {
    //   param['status'] = 20;
    // } else if (this.modifiedDataModal.length === 0) {
    //   param['status'] = 10;
    // } else {
    //   param['status'] = 16;
    // }
    const url = planUrl.updateList;
    this.http.post(url, {boatPlanModelList: [param]}).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '配船成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 删除请求
   */
  deleteData(): Promise<any> {
    const url = planUrl.boatStowageMainDeleteList;
    return this.http.post(url, {boatPlanModelList: this.selectedData}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '清除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 下发
   */
  issued(): void {
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认下发吗？',
      nzOnOk: this.issuedData
    });
  }

  /**
   * 下发请求
   */
  issuedData(): Promise<any> {
    const url = '';
    return this.http.post(url, {}).then(
      res => {
        if (res.success) {

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
    if (this.loadingSequenceStatus) {
      this.nn.warning('提示消息', '请点击保存！');
    } else {
      this.modalFormVisible = false;
    }
  }

  /**
   * 弹窗关闭回调
   */
  closeResult() {
    this.modalValidateForm.reset({});
    this.detailDataModalList = [];
    this.status = '';
    this.shipingSpaceNumber = null;
    this.orderNumber = null;
    this.detailModalSelectDataMap.clear();
    this.detailDataModalTotalPage = 0;
    this.imgStowageList = [];
    this.loadingSequenceStatus = false;
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
    this.detailDataModalList = [{EDIT: true}, ...this.detailDataModalList];
  }

  /**
   * 选择调度计划
   */
  selectSchedulingPlan(): void {
    this.getSchedulingPlanData({page: 1, length: this.schedulingPlanModalPageSize});
    this.schedulingPlanModal = this.nm.create(
      {
        nzTitle: '选择调度计划',
        nzContent: this.schedulingPlanRef,
        nzStyle: {top: '10px'},
        nzOnOk: () => {
          this.modalValidateForm.patchValue(this.schedulingPlanModalSelectData[0]);
          this.getDetailDataModalList({page: 1, length: this.detailDataModalPageSize});
        }
      }
    );

    this.schedulingPlanModal.afterClose.subscribe(() => {
      this.schedulingPlanModalList = [];
      this.schedulingPlanModalSelectData = [];
    });

  }

  /**
   * 调度计划数据获取
   */
  getSchedulingPlanData(param: any): void {
    const url = planUrl.getMainStatusList;
    param.scheduleType = 'ZXLX10';
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.schedulingPlanModalList = res.data.data.data;
          this.schedulingPlanModalTotal = res.data.data.total;
          // this.selectedData = [];
        }
      }
    );
  }

  /**
   * 船舶计划条数事件
   * @param param
   */
  schedulingPlanModalPageSizeChange(param: any) {
    this.schedulingPlanModalPageSize = param;
    this.getSchedulingPlanData({page: 1, length: this.schedulingPlanModalPageSize});
  }

  /**
   * 船舶计划页码更改事件
   * @param param
   */
  schedulingPlanModalPageIndexChange(param: any) {
    this.getSchedulingPlanData({page: param, length: this.schedulingPlanModalPageSize});
  }

  /**
   * 船舶计划选择数据
   * @param param
   */
  schedulingPlanModalUpdateChange(param: Array<any>) {
    this.schedulingPlanModalSelectData = param;
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
    if (this.selectedData.length == 0) {
      this.buttonId = '';
      this.nn.warning('提示消息', '请选择调度计划后操作!');
    } else {
      this.packDataSet = [{EDIT: true}, ...this.packDataSet];
    }
  }

  /**
   * 捆包明细修改
   */
  updatePackData(): void {
    if (this.selectedData.length === 0) {
      this.buttonId = '';
      this.tmpButtonId = '';
      this.nn.warning('提示消息', '请选择调度计划后操作!');
    } else if (this.packSelectedData.length === 0) {
      this.buttonId = '';
      this.tmpButtonId = '';
      this.nn.warning('提示消息', '请选择明细后操作!');
    } else {
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
    const url = this.tmpButtonId === 'AddPack1' ? planUrl.addPackIntoSchedule : planUrl.updatePackList;
    const param =
      {
        companyId: this.selectedData[0].companyId,
        scheduleNum: this.selectedData[0].scheduleNum,
        boatSchedulePackModelList: paramData
      };
    this.http.post(url, param).then(
      res => {
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
    return this.http.post(planUrl.removePack, {boatSchedulePackModelList: this.packSelectedData}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除明细成功!');
          this.getPackList({page: 1, length: this.packPageSize});
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
    // this.detailModalSelectDataMap.set(this.detailModalSearchData.page, this.detailModalSelectData);
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
      nzOnOk: () => this.handleUpload()
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
  previewVisible: boolean = false;
  previewImage: string;
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };
  imgStowageList: Array<any> = [];
  modalSpinning: boolean = false; //弹窗加载状态

  /**
   * 确认上传
   */
  handleUpload(): Promise<any> {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
        formData.append('file', file);
      }
    );

    return this.http.post(this.importUrl, formData).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '上传成功!');
        }
      }
    );

  }


  /**
   * 获取弹窗明细
   */
  getDetailDataModalList(param): void {
    this.modalSpinning = true;
    param.boatBatchNum = this.modalValidateForm.get('boatBatchNum').value;
    param.companyId = this.selectedData[0].companyId;
    this.detailModalSearchData = param;
    this.detailModalSelectData = [];
    this.shipingSpaceNumber = null;
    this.orderNumber = null;
    this.modifiedDataModal = [];
    this.http.post(planUrl.getRecordsByScheduleNum, param).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.detailDataModalList = res.data.data.data || [];
          // this.detailDataModalTotalPage = res.data.data.total || 0;
          // if (this.detailDataModalList.length > 0) {
          //   // if (this.status === 'add') {
          //   //   this.modalValidateForm.patchValue({stowageNum: this.detailDataModalList[0].stowageNum});
          //   // }
          //   this.detailDataModalList = this.detailDataModalList.filter(
          //     res => {
          //       if (res.shipingSpaceNumber && res.orderNumber) {
          //         this.modalValidateForm.patchValue({stowageNum: res.stowageNum});
          //         this.modifiedDataModal = [...this.modifiedDataModal, res];
          //         return false;
          //       } else {
          //         return true;
          //       }
          //     }
          //   );
          //   // const map = new Map();
          //   // this.detailDataModalList.forEach(
          //   //   res => {
          //   //     map.set(res.contractNum + res.goodsName + res.spec + res.outStock, res);
          //   //   }
          //   // );
          //   // const tmp = this.detailModalSelectDataMap.get(this.detailModalSearchData.page);
          //   // tmp && tmp.forEach(
          //   //   res => {
          //   //     const tmp2 = map.get(res.contractNum + res.goodsName + res.spec + res.outStock);
          //   //     if (tmp2) {
          //   //       tmp2.checked = true;
          //   //       tmp2.shipingSpaceNumber = res.shipingSpaceNumber;
          //   //       tmp2.orderNumber = res.orderNumber;
          //   //       this.detailModalSelectData.push(tmp2);
          //   //     }
          //   //   }
          //   // );
          //
          // }


        }
      }
    );
  }

  /**
   * 弹窗明细大小
   * @param param
   */
  detailModalPageSizeChange(param: number) {
    if (this.modalValidateForm.get('boatBatchNum').value) {
      this.detailDataModalPageSize = param;
      this.detailModalSelectDataMap.clear();
      this.getDetailDataModalList({page: 1, length: this.detailDataModalPageSize});
    }

  }

  /**
   * 弹窗明细页码更改
   * @param param
   */
  detailModalPageIndexChange(param: number) {
    if (this.modalValidateForm.get('boatBatchNum').value) {
      this.getDetailDataModalList({page: param, length: this.detailDataModalPageSize});
    }
  }

  /**
   * 明细输入更改
   * @param param
   */
  detailModalChange(param: any) {
    if (!param.data.checked) {
      param.data.checked = true;
      param.data.disabled = true;
      this.detailModalSelectData.push(param.data);
      // this.detailModalSelectDataMap.set(this.detailModalSearchData.page, this.detailModalSelectData);
    } else {
      // if (!(param.data.shipingSpaceNumber || param.data.orderNumber)) {
      //   param.data.checked = false;
      //   param.data.disabled = false;
      // }
    }

  }

  /**
   * 明细顺序保存
   */
  loadingSequence(): void {
    if (this.detailModalSelectData.length === 0) {
      this.nn.warning('提示消息', '请选择明细后操作!');
    }
    this.modalSpinning = true;
    this.loadingSequenceStatus = true;
    // const param = {stowageNum: '', boatBatchNum: this.modalValidateForm.get('boatBatchNum').value, tBoatStowageItemModels: []};
    const param = {boatSchedulePackModelList: this.detailModalSelectData};

    // param.stowageNum = this.modalValidateForm.get('stowageNum').value;
    // this.detailModalSelectData.forEach(
    //   res => {
    //     param.tBoatStowageItemModels.push(res);
    //   }
    // );

    this.http.post(planUrl.boatScheduleUpdatePackList, param).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.nn.success('提示消息', '保存明细顺序成功!');
          this.getDetailDataModalList({page: 1, length: this.detailDataModalPageSize});
        }
      }
    );
  }

  /**
   * 装船顺序删除
   * @constructor
   */
  LoadingSequenceDelete() {
    const param = {tBoatStowageItemModels: []};
    this.modifiedDataSelect.forEach(
      res => {
        res.boatBatchNum = this.modalValidateForm.get('stowageNum').value;
        param.tBoatStowageItemModels.push(res);
      }
    );
    this.modalSpinning = true;
    this.http.post(planUrl.boatStowageItemDeleteList, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '明细顺序删除成功!');
          this.modifiedDataSelect = [];
          this.getDetailDataModalList({page: 1, length: this.detailDataModalPageSize});
        }
      }
    );
  }

  /**
   * 舱位 顺序号修改
   * @param param
   * @param mark
   */
  numberChange(param: any, mark: string) {
    if (mark === 'shipingSpaceNumber') {
      this.detailModalSelectData.forEach(
        res => {
          res.shipingSpaceNumber = param;
        }
      );
    } else {
      this.detailModalSelectData.forEach(
        res => {
          res.orderNumber = param;
        }
      );
    }
  }

  /**
   * 图片更改
   * @param info
   * @param name
   */
  handleChange(info: UploadChangeParam, name: string) {
    if (name == 'imgStowage') {
      // 单图片
      this.imgStowageList = this.imgStowageList.map(item => item.originFileObj ? item.originFileObj : item);
      this.modalValidateForm.patchValue({imgStowage: this.imgStowageList[0].url});
    }
    if (info.file.status === 'removed') {
      if (name == 'imgStowage') {
        this.modalValidateForm.patchValue({imgStowage: ''});
      }
    }

  }

  /**
   * 主列表导出
   */
  export(): void {
    this.angularHttp.post(planUrl.mainExport, {}, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `船舶配载.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

  }

  /**
   * 明细导出
   */
  exportDetails(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    this.angularHttp.post(planUrl.itemExport, this.selectedData[0], {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `船舶配载明细.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

  }

  /**
   * 已选列表选择事件
   * @param param
   */
  modifiedDataModalUpdateDataResult(param: Array<any>) {
    this.modifiedDataSelect = param;
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
    this.clickParam.boatBatchNum = param.boatBatchNum;
    this.getPackList({page: 1, length: this.packPageSize});
  }

  /**
   * 下发
   */
  doIssue() {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }
    if ((this.selectedData[0].status !== ShipPlanStatus.HasLoading) && (this.selectedData[0].status !== ShipPlanStatus.BackoutIssued)) {
      this.nn.warning('提示消息', '请选择已配载数据进行下发!');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认下发吗？',
      nzOnOk: () => this.doIssueRequest()
    });
  }

  /**
   * 下发事件请求
   */
  doIssueRequest(): Promise<any> {
    const url = planUrl.issued;
    const params = {boatPlanModelList: []};
    this.selectedData.forEach(
      res => {
        params.boatPlanModelList.push({boatBatchNum: res.boatBatchNum});
      }
    );
    return this.http.post(url, params).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '下发成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 撤销下发
   */
  cancellation() {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    if (this.selectedData[0].status !== ShipPlanStatus.GendIssued) {
      this.nn.warning('提示消息', '请选择已下发数据进行撤销下发!');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认撤销下发吗？',
      nzOnOk: () => this.cancellationRequest()
    });
  }

  /**
   * 撤销下发请求
   */
  cancellationRequest(): Promise<any> {

    const url = planUrl.revocationIssued;
    const params = {boatPlanModelList: this.selectedData};
    return this.http.post(url, params).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '撤销下发成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );

  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

}
