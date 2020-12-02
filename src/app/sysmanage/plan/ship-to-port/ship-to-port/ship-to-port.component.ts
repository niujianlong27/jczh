import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService, UploadChangeParam} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFiles} from '../../../../common/services/upload-files';
import {planUrl} from '../../../../common/model/planUrls';
import {Utils} from '../../../../common/util/utils';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-ship-to-port',
  templateUrl: './ship-to-port.component.html',
  styleUrls: ['./ship-to-port.component.css']
})
export class ShipToPortComponent implements OnInit {

  //文件
  boatPhotoList: Array<any> = []; // 船证
  captainIDCardList: Array<any> = []; //船长身份证


  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  total: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  updateData: Array<any> = [];//选中的数据  主表
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  searchData: any;  //存储查询的数据缓存
  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalFormVisible1 = false;//船舶计划选择弹框
  boatPlanList: Array<any> = []; //返回的list集合  船舶计划
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  rowid: string = '';
  userHeader: any;//新增的时候的列表数据变化
  inpValidate: any;
  pageSize1: number = 30;
  total1: number = 0;

  listLoading1: boolean = false;
  modalSelectData: Array<any> = [];
  berthList: Array<any> = [];

  uploadStatus: boolean = false;//上传状态控制
  uploadingFileName: string = '';

  // modalFormData: Array<any> = [
  //   {
  //     name: '报港号', eName: 'sda', type: 'text', validateCon: '请填写船舶计划号', require: false, disabled: true,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '船舶计划号', eName: 'gadsa23', type: 'text', validateCon: '请填写船舶计划号', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '船批号', eName: 'boatNum1', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
  //     validators: {
  //       require: true
  //     }
  //   },
  //   {
  //     name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: true,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '船名', eName: 'boatName', type: 'text', validateCon: '请填写船号', require: true,
  //     validators: {
  //       require: false
  //     }
  //   },
  //
  //
  //   {
  //     name: '船长', eName: 'boatName', type: 'text', validateCon: '请填写船长', require: true, disabled: true,
  //     validators: {
  //       require: true
  //     }
  //   },
  //
  //   {
  //     name: '载重', eName: 'load', type: 'number', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '停靠泊位', eName: 'sdada', type: 'select', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '是否加水', eName: 'dsafda', type: 'select', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '是否加电', eName: 'dsaadasda', type: 'select', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '是否拖轮', eName: 'dax', type: 'select', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '船证', eName: 'dax2', type: 'upload1', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     },
  //     fileList: this.boatPhotoList,
  //     length: 1
  //   },
  //   {
  //     name: '船长身份证', eName: 'dax3', type: 'upload2', validateCon: '请填写船舶公司', require: false,
  //     validators: {
  //       require: false
  //     },
  //     fileList: this.captainIDCardList,
  //     length: 2
  //   },
  //
  //
  //   {
  //     name: '靠港时间', eName: 'expectPortTime', type: 'date', validateCon: '请填写计划靠港时间', require: true,
  //     validators: {
  //       require: true
  //     }
  //   },
  //   {
  //     name: '锚地时间', eName: 'expectPortTime2', type: 'date', validateCon: '请填写计划锚地时间', require: true,
  //     validators: {
  //       require: true
  //     }
  //   },
  //   {
  //     name: '靠泊时间', eName: 'expectBerthTime', type: 'date', validateCon: '请填写计划靠泊时间', require: true,
  //     validators: {
  //       require: true
  //     }
  //   }
  // ];

  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    public upload: UploadFiles
  ) {
  }


  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({
      // preNum: [{value: null, disabled: true}, [Validators.required]],
      companyId: ['', []],
      boatBatchNum: [{value: null, disabled: true}, [Validators.required]],
      imgBoatId: ['', null],
      captain: [{value: null, disabled: true}, [Validators.required]],
      // boatNum: ['', [Validators.required]],
      boatName: [{value: null, disabled: true}, [Validators.required]],
      loadWeight: [{value: null, disabled: true}, [Validators.required]],
      dockBerth: ['', null],
      addWater: ['', null],
      powerUp: ['', null],
      tug: ['', null],
      imgCaptainId: ['', null],
      pilot: ['', null],
      // actualAnchorageTime: ['', null],
      // actualToportTime: ['', null],
      // actualBerthingTime: ['', null],
    });
    this.listSearch({page: 1, length: this.pageSize});
    this.upload.setUpload();
    this.getberthageNamebyCompanyId();
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
   * 查询船舶计划
   * @param param
   */
  listSearch1(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize1; //最好有
    const url = planUrl.selectBoatPlan;
    this.listLoading1 = true;
    this.http.post(url, param).then(
      res => {
        this.listLoading1 = false;
        if (res.success) {
          this.boatPlanList = res.data.data.data;
          this.total1 = res.data.data.total;
        }
      }
    );
  }

  /**
   * 查询船舶计划页码
   * @param page
   */
  getPageIndex1(page: any): void {
    this.listSearch1({page: page, length: this.pageSize1});
  }

  /**
   * 查询船舶计划页面数量大小
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.listSearch1({page: 1, length: this.pageSize1});
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
  }

  /**
   * 弹窗选中数据
   * @param data
   */
  selectData1(data: Array<any>) {
    this.modalSelectData = data;
  }


  /**
   * 列表查询
   * @param param
   */
  getListSearch(param: any) {

    this.listLoading = true;
    const url = planUrl.selectPredictPort;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.total = res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮点击事件
   * @param param
   */
  btnClick(param: any) {
    const buttonId = param.buttonId;
    switch (buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'selectBoat': // 选择船舶计划
        this.selectBoat();
        break;
      case 'Del':
        this.btnDelete();
        break;
    }
  }

  /**
   * 选中数据
   * @param param
   */
  updateDataResult(param: any) {
    this.selectedData = param;
  }

  /**
   * 添加
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '船舶报港 > 新增';
    this.status = 'add';
  }

  /**
   * 修改按钮点击
   */
  btnUpdate(): void {
    if (this.updateData.length === 0 || this.updateData.length > 1) {
      this.nm.confirm({
        nzTitle: '提示消息',
        nzContent: '请选择一条数据后操作！',
      });
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '船舶报港 > 修改';
    this.status = 'update';
    this.rowid = this.updateData[0].rowid;
    this.modalValidateForm.patchValue(this.updateData[0]);
    // this.modalValidateForm.patchValue(this.updateData[0].tBoatPlanModel);
    this.boatPhotoList = this.upload.getFileList(this.updateData[0].imgBoatId);
    this.captainIDCardList = this.upload.getFileList(this.updateData[0].imgCaptainId);

  }


  /**
   * 删除
   */
  btnDelete(): void {
    if (this.updateData.length === 0 || this.updateData.length < 1) {
      this.nm.confirm({
        nzTitle: '提示消息',
        nzContent: '请选择数据后操作！',
      });
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认删除吗？',
      nzOnOk: () => this.deleteData()
    });
  }

  /**
   * 删除请求
   */
  deleteData(): Promise<any> {
    const url = planUrl.deletePredictPort;
    const param = {
      predictPortModelList: this.updateData
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }


  /**
   * 弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if (!this.modalValidateForm.get('boatBatchNum').value) {
      this.nn.warning('提示消息', '请选择调度计划！');
      return;
    }

    if (this.uploadStatus) {
      this.nn.warning('提示消息', '请等待上传完成后操作！');
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {
      this.add();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
      this.update();
    }

  }

  /**
   * 添加请求
   */
  add(): void {
    this.listLoading = true;
    const url = planUrl.insertPredictPort;
    let param: any = {};
    param = this.modalValidateForm.getRawValue();

    param.rowid = this.rowid;
    // param.tBoatPlanModel = {
    //   actualAnchorageTime: '',
    //   actualToportTime: '',
    //   actualBerthingTime: ''
    // };
    // param.tBoatPlanModel.actualAnchorageTime = param.actualAnchorageTime && param.actualAnchorageTime instanceof Date ? Utils.dateFormat(param.actualAnchorageTime, 'yyyy-MM-dd HH:mm:ss') : param.actualAnchorageTime || '';
    // param.tBoatPlanModel.actualToportTime = param.actualToportTime && param.actualToportTime instanceof Date ? Utils.dateFormat(param.actualToportTime, 'yyyy-MM-dd HH:mm:ss') : param.actualToportTime || '';
    // param.tBoatPlanModel.actualBerthingTime = param.actualBerthingTime && param.actualBerthingTime instanceof Date ? Utils.dateFormat(param.actualBerthingTime, 'yyyy-MM-dd HH:mm:ss') : param.actualBerthingTime || '';
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.nn.warning('提示消息', '插入数据成功');
          this.modalFormVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 修改请求
   */
  update() {
    this.listLoading = true;
    const url = planUrl.updatePredictPort;
    let param: any = {};
    param = this.modalValidateForm.getRawValue();
    param.rowid = this.rowid;
    // param.tBoatPlanModel = {
    //   actualAnchorageTime: '',
    //   actualToportTime: '',
    //   actualBerthingTime: ''
    // };
    // param.tBoatPlanModel.actualAnchorageTime = param.actualAnchorageTime && param.actualAnchorageTime instanceof Date ? Utils.dateFormat(param.actualAnchorageTime, 'yyyy-MM-dd HH:mm:ss') : param.actualAnchorageTime || '';
    // param.tBoatPlanModel.actualToportTime = param.actualToportTime && param.actualToportTime instanceof Date ? Utils.dateFormat(param.actualToportTime, 'yyyy-MM-dd HH:mm:ss') : param.actualToportTime || '';
    // param.tBoatPlanModel.actualBerthingTime = param.actualBerthingTime && param.actualBerthingTime instanceof Date ? Utils.dateFormat(param.actualBerthingTime, 'yyyy-MM-dd HH:mm:ss') : param.actualBerthingTime || '';
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.nn.warning('提示消息', '修改数据成功');
          this.modalFormVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );

  }

  /**
   * 第二个弹窗的确认
   */
  handleOk1() {
    this.modalValidateForm.patchValue(this.modalSelectData[0]);
    this.modalValidateForm.get('loadWeight').setValue(this.modalSelectData[0].capacity);
    this.modalFormVisible1 = false;
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗取消
   */
  handleCancel1() {
    this.modalFormVisible1 = false;
  }

  /**
   * 弹窗关闭回调
   */
  closeResult() {
    this.modalValidateForm.reset();
    this.boatPhotoList = [];
    this.captainIDCardList = [];
  }

  /**
   * 弹窗关闭回调
   */
  closeResult1() {
    this.modalSelectData = [];
  }

  /**
   * 上传处理
   * @param param
   * @param eName
   */
  getFileUrl(param: UploadChangeParam, eName: string) {
    switch (param.file.status) {
      case 'done': {
        if (this.uploadingFileName === param.file.name) {
          this.uploadStatus = false;
        }
        if (eName == 'imgBoatId') {
          this.boatPhotoList = this.boatPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
          this.modalValidateForm.patchValue({imgBoatId: this.boatPhotoList.map(item => item.url).join(';')});
        }
        if (eName == 'imgCaptainId') {
          this.captainIDCardList = this.captainIDCardList.map(item => item.originFileObj ? item.originFileObj : item);
          this.modalValidateForm.patchValue({imgCaptainId: this.captainIDCardList.map(item => item.url).join(';')});
        }
      }
        break;
      case 'removed': {
        if (this.uploadingFileName === param.file.name) {
          this.uploadStatus = false;
        }

        if (eName == 'imgBoatId') {
          this.modalValidateForm.patchValue({imgBoatId: this.boatPhotoList.map(item => item.url).join(';')});
        }
        if (eName == 'imgCaptainId') {
          this.modalValidateForm.patchValue({imgCaptainId: this.captainIDCardList.map(item => item.url).join(';')});
        }
      }
        break;
      case 'uploading': {
        this.uploadStatus = true;
        this.uploadingFileName = param.file.name;
      }
        break;
    }

  }

  // /**
  //  * 数据弹框组件内容发生改变时触发的方法
  //  * @param data
  //  */
  // inpEmit(data: any) {
  //
  //   this.inpValidate = data.inpValidate;
  //   this.modalValidateForm.get('customerCode').setValue(data.inpValue);
  //   this.modalValidateForm.get('customerName').setValue(data.inpName);
  //
  // }

  //选择船舶计划
  selectBoat() {
    this.modalFormVisible1 = true;
    this.listSearch1({page: 1, length: this.pageSize1});
  }

  /**
   * 泊位查询
   */
  getberthageNamebyCompanyId(): void {
    this.http.post(urls.getberthageNamebyCompanyId, {}).then(
      res => {
        if (res.success) {
          Array.prototype.push.apply(this.berthList, res.data.data);
        }
      }
    );
  }


}
