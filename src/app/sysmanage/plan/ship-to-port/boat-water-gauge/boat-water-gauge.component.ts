import {Component, Host, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {planUrl} from '../../../../common/model/planUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService, UploadChangeParam, UploadFile} from 'ng-zorro-antd';
import {UploadFiles} from '../../../../common/services/upload-files';
import {GridRowSource} from '../../../../components/simple-page/grid-block/grid-row.directive';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-boat-water-gauge',
  templateUrl: './boat-water-gauge.component.html',
  styleUrls: ['./boat-water-gauge.component.css'],
  providers: [
    GridRowSource,
  ],
})
export class BoatWaterGaugeComponent implements OnInit {

  dataSet: Array<any> = []; //主列表数据
  pageSize: number = 30;//条数
  total: number;//数据总条数
  listLoading: boolean; //主列表加载状态

  dataSetChild: Array<any> = []; //子列表数据
  pageSizeChild: number = 100000;//子列表条数
  totalChild: number;//子列表数据总条数
  listLoadingChild: boolean; //子列表加载状态

  searchData: any; //搜索缓存

  selectData: Array<any> = []; // 主列表选中数据
  selectDataChild: Array<any> = []; // 主列表选中数据
  buttonId: string;

  //弹窗相关
  modalFormVisible: boolean = false; // 弹窗控制
  modalTitle: any; //弹窗标题
  modalOkLoading: any; //弹窗确定加载状态
  modalValidateForm: FormGroup; //弹窗表单
  modalFormData: Array<any> = [
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请选择船只', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '装卸类型', eName: 'planTypeName', type: 'text', validateCon: '请选择计划类型', require: false, disabled: true,
      validators: {
        require: false
      },
      selectList: [{label: '装船', value: 'ZXLX10',}, {label: '卸船', value: 'ZXLX20',},
      ]
    },
    // {
    //   name: '水尺图片', eName: 'imgWaterGauge', type: 'img', validateCon: '请上传水尺图片', require: true, disabled: false,
    //   validators: {
    //     require: true
    //   }
    // },
  ];

  modalDataSet: Array<any> = []; //弹窗数据
  selectDataModal: Array<any> = []; // 弹窗选中数据
  modalSpinning: boolean = false; //弹窗加载状态

  gridOneHeight: string;
  gridTwoHeight: string;

  private status: string;  //添加 删除状态

  modalDeleteData: Array<any> = [];  // 删除捆包缓存
  detailStatus$: Subject<boolean>;

  fileList: Array<any> = [];   // 图片地址缓存

  @ViewChild('importDataModal') importRef: TemplateRef<any>;
  @ViewChild('commodityWaterGauge') commodityWaterGaugeRef: TemplateRef<any>;
  obj: any;
  commodityWaterGaugeForm: FormGroup;
  commodityWaterGaugeFormData: Array<any> = [
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船只代码', eName: 'boatNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请选择船只', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '装卸类型', eName: 'planTypeName', type: 'text', validateCon: '请选择计划类型', require: false, disabled: true,
      validators: {
        require: false
      },
      selectList: [{label: '装船', value: 'ZXLX10',}, {label: '卸船', value: 'ZXLX20',},
      ]
    },
    {
      name: '商检水尺数', eName: 'gaugeValue', type: 'number', validateCon: '请输入商检水尺数', require: true, disabled: false,
      validators: {
        require: true
      }
    }, {
      name: '商检水尺证', eName: 'imgInspectGauge', type: 'img', validateCon: '请选择船只', require: false, disabled: false,
      validators: {
        require: false
      }
    },
  ];
  imgInspectGaugeList: Array<any> = [];
  tabArr = [
    {name: '水尺明细', index: 0},
    {name: '商检水尺明细', index: 1},
  ];
  gridId: string = 'grid2';//子表gridId
  tabIndex: number = 0; //子列表tab激活序号

  //当前激活tab


  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    public upload: UploadFiles,
    @Host() private rowSource: GridRowSource
  ) {
  }

  ngOnInit() {
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

    // 水尺维护初始化
    this.commodityWaterGaugeForm = this.fb.group({});
    this.commodityWaterGaugeFormData.forEach(
      res => {
        let validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        res.validators.pattern ? validatorOrOpts.push(Validators.required) : null;
        this.commodityWaterGaugeForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );


    this.listSearch({page: 1, length: this.pageSize});
    this.upload.setUpload();
  }

  /**
   * 查询
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  /**
   * 查询请求
   * @param param
   */
  getListSearch(param: any) {
    this.listLoading = true;
    const url = planUrl.selectListByToPortStatus;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.total = res.data.data.total;
        }
        this.dataSetChild = [];
        this.modalDataSet = [];
      }
    );
  }

  /**
   * 获取子列表数据
   * @param param
   */
  getListChild(param: any): void {
    this.dataSetChild = [];
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSizeChild; //最好有
    param.boatBatchNum = this.selectData[0].boatBatchNum;
    param.companyId = this.selectData[0].companyId;
    param.boatNum = this.selectData[0].boatNum;
    this.listLoadingChild = true;
    const url = this.tabIndex === 0 ? planUrl.selectWaterGuage : planUrl.selectInspectGauge;
    this.http.post(url, param).then(
      res => {
        this.listLoadingChild = false;
        if (res.success) {
          this.dataSetChild = res.data.data.data;
          this.totalChild = res.data.data.total;
          if (this.tabIndex === 1 && this.dataSetChild.length !== 0) {
            this.commodityWaterGaugeForm.patchValue(this.dataSetChild[0]);
            this.imgInspectGaugeList = this.upload.getFileList(this.dataSetChild[0].imgInspectGauge);
          }
        }
      }
    );

  }

  /**
   * 弹窗明细
   */
  getListModal(): void {
    const param: any = {};
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSizeChild; //最好有
    param.boatBatchNum = this.selectData[0].boatBatchNum;
    param.companyId = this.selectData[0].companyId;
    const url = planUrl.selectWaterGuage;
    this.http.post(url, param).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.modalDataSet = res.data.data && res.data.data.data || [];
          this.modalDataSet.forEach(
            (value, index) => {
              value.index = index;
            }
          );
        }
      }
    );

  }

  /**
   * 选择抛出数组
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectData = param;
    if (this.selectData.length !== 0) {
      this.getListChild({page: 1, length: this.pageSizeChild});
    }
  }

  /**
   * 子列表选中数据
   * @param param
   */
  updateDataChild(param: Array<any>) {
    this.selectDataChild = param;
  }

  /**
   * 弹窗选中数据
   * @param param
   */
  updateDataModal(param: Array<any>) {
    this.selectDataModal = param;

  }

  /**
   * 按钮点击事件
   */
  btnClick(param): void {
    this.buttonId = param.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'AddPack':
        this.btnAddPack();
        break;
      case 'UpdatePack':
        this.btnUpdatePak();
        break;
      case 'DeletePack':
        this.btnDeletePack();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'CommodityWaterGauge': //商检水尺维护
        this.btnCommodityWaterGauge();
        break;
    }

  }

  /**
   * 添加
   */
  btnAdd(): void {
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作');
      return;
    }
    this.tabIndex = 0;
    this.modalFormVisible = true;
    this.modalSpinning = true;
    this.getListModal();

    this.modalTitle = '船舶水尺 > 维护';
    this.status = 'add';
    // this.modalOkLoading = true;
    this.modalValidateForm.patchValue(this.selectData[0]);
    // const imgWaterGauge = this.modalValidateForm.get('imgWaterGauge').value;
    // if (imgWaterGauge) {
    //   this.imgWaterGaugeList = this.upload.getFileList(imgWaterGauge);
    // }
  }

  addRequest(): void {
    const url = '';
    const param = this.modalValidateForm.getRawValue();
    this.http.post(url, param).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 修改
   */
  btnUpdate(): void {

  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
    }
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: `是否删除已选${this.selectData[0].boatName}下的全部水尺信息？`,
        nzOnOk: () => this.deleteRequest()
      }
    );

  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<any> {
    const url = planUrl.deleteWaterGuage;
    return this.http.post(url, {tBoatWaterGuageModelList: this.selectData}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 商检水尺维护点击
   */
  btnCommodityWaterGauge() {
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作');
      return;
    }
    this.tabIndex = 1;
    this.commodityWaterGaugeForm.patchValue(this.selectData[0]);
    if (this.dataSetChild.length !== 0) {
      this.commodityWaterGaugeForm.patchValue(this.dataSetChild[0]);
      this.imgInspectGaugeList = this.upload.getFileList(this.dataSetChild[0].imgInspectGauge);
    }
    this.nm.create({
      nzTitle: '商检水尺维护',
      nzContent: this.commodityWaterGaugeRef,
      nzWidth: '70%',
      nzOnOk: () => this.commodityWaterGaugeRequest()
    }).afterClose.subscribe(res => {
      this.commodityWaterGaugeForm.reset({});
      this.imgInspectGaugeList = [];
    });
  }

  /**
   * 商检水尺请求
   */
  commodityWaterGaugeRequest(): Promise<any> {
    for (const i in this.commodityWaterGaugeForm.controls) {
      this.commodityWaterGaugeForm.controls[i].markAsDirty();
      this.commodityWaterGaugeForm.controls[i].updateValueAndValidity();
    }

    if (this.commodityWaterGaugeForm.status !== 'VALID') {
      return new Promise<boolean>(
        resolve => {
          resolve(false);
        }
      );
    }

    const url = planUrl.insertInspectGauge;
    const param: any = {
      boatBatchNum: this.commodityWaterGaugeForm.get('boatBatchNum').value,
      boatNum: this.commodityWaterGaugeForm.get('boatNum').value,
      tBoatInspectGaugeModelList: [{
        gaugeValue: this.commodityWaterGaugeForm.get('gaugeValue').value,
        imgInspectGauge: this.commodityWaterGaugeForm.get('imgInspectGauge').value,
      }]
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '商检水尺维护成功!');
          this.getListChild({page: 1, length: this.pageSizeChild});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 弹窗确定
   */
  handleOk() {

  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    const status = this.modalDataSet.some(
      res => res.from
    );
    if (status) {
      this.nm.confirm({
        nzTitle: '提示消息',
        nzContent: '有待保存数据，是否确认离开!',
        nzOnOk: () => {
          this.modalFormVisible = false;
          return true;
        }
      });
      return;
    }
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭后事件
   */
  closeResult() {
    this.modalValidateForm.reset({});
    this.modalDeleteData = [];
    this.modalDataSet = [];
  }

  /**
   * 主列表页码更改
   * @param param
   */
  pageIndexMain(param: any) {
    this.listSearch({page: param, length: this.pageSize});
  }

  /**
   * 主列表页量大小更改
   * @param param
   */
  pageSizeMain(param: any) {
    this.pageSize = param;
    this.listSearch({page: 1, length: this.pageSize});
  }

  /**
   * 子列表页码更改
   * @param param
   */
  pageIndexChangeChild(param: any) {
    this.getListChild({page: param, length: this.pageSizeChild});
  }

  /**
   * 子列表页量大小更改
   * @param param
   */
  pageSizeChangeChild(param: any) {
    this.pageSizeChild = param;
    this.getListChild({page: 1, length: this.pageSizeChild});

  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }


  /**
   * 水尺图获取
   * @param param
   */
  getFileUrl(param: UploadChangeParam) {
    if (param.file.status === 'done') {

      this.fileList = this.fileList.map(item => item.originFileObj ? item.originFileObj : item);
      // this.obj.imgWaterGauge = this.fileList.map(item => item.url).join(';');
    }

    if (param.file.status === 'removed') {
      // this.obj.imgWaterGauge = this.fileList.map(item => item.url).join(';');
    }

  }

  /**
   * 商检水尺图获取
   * @param param
   * @param eName
   */
  getImgInspectGaugeUrl(param: UploadChangeParam, eName: any) {
    if (param.file.status === 'done') {

      this.imgInspectGaugeList = this.imgInspectGaugeList.map(item => item.originFileObj ? item.originFileObj : item);
      this.commodityWaterGaugeForm.get('imgInspectGauge').setValue(this.imgInspectGaugeList.map(item => item.url).join(';'));
      // this.obj.imgWaterGauge = this.fileList.map(item => item.url).join(';');
    }

    if (param.file.status === 'removed') {
      this.commodityWaterGaugeForm.get('imgInspectGauge').setValue(this.imgInspectGaugeList.map(item => item.url).join(';'));
      // this.obj.imgWaterGauge = this.fileList.map(item => item.url).join(';');
    }
  }


  /**
   * 主列表点击
   * @param param
   */
  listMainClick(param: any) {
    this.dataSet.forEach(
      res => {
        res.checked = false;
      }
    );
    this.selectData = [];
    this.selectData[0] = param;
    param.checked = true;
    this.getListChild({page: 1, length: this.pageSizeChild});
  }


  /**
   * 添加水尺
   */
  btnAddPack() {
    const param = {index: this.modalDataSet.length, EDIT: true, from: 'add'};
    this.modalDataSet = [param, ...this.modalDataSet];
  }

  /**
   * 修改水尺
   */
  btnUpdatePak() {
    if (this.selectDataModal.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }
    this.selectDataModal.forEach(
      (res, index) => {
        if (!res['index']) {
          res.EDIT = true;
          res.index = index;
          res.from = 'update';
        }
      }
    );
  }

  /**
   * 删除水尺
   */
  btnDeletePack() {
    if (this.selectDataModal.length === 0) {
      this.nn.warning('提示消息', '请选择明细后操作！');
    }
    this.selectDataModal.forEach(
      res1 => {
        this.modalDataSet = this.modalDataSet.filter(
          res => res.index !== res1.index
        );
      }
    );
  }

  /**
   * 保存按钮点击事件
   */
  btnSave() {
    if (this.modalDataSet.length === 0) {
      this.nn.warning('提示信息', '请添加数据后保存！');
      return;
    }
    const status = this.modalDataSet.some(
      res => !(res.location && res.measureValue)
    );
    if (status) {
      this.nn.warning('提示信息', '请填写完整后保存！');
      return;
    }
    this.saveRequest();
  }

  /**
   * 保存请求
   */
  saveRequest(): void {
    const url = planUrl.insertWaterGuage;
    const param = this.modalValidateForm.getRawValue();
    param.tBoatWaterGuageModelList = this.modalDataSet;
    this.modalSpinning = true;
    this.http.post(url, param).then(
      res => {
        this.modalSpinning = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '保存成功');
          // this.listSearch({page: 1, length: this.pageSize});
          this.getListChild({page: 1, length: this.pageSizeChild});
          return true;
        } else {
          return false;
        }
      }
    );
  }


  /**
   * 弹窗上传图片按钮
   * @param obj
   * @param key
   */
  modalUpdate(obj, key) {
    this.obj = obj;

    if (obj.imgWaterGauge) {
      this.fileList = this.upload.getFileList(obj.imgWaterGauge);
    }
    const photoModal = this.nm.create(
      {
        nzTitle: '上传图片',
        nzContent: this.importRef,
        nzOnOk: () => this.obj.imgWaterGauge = this.fileList.map(item => item.url).join(';'),
      }
    );
    photoModal.afterClose.subscribe(res => {
      this.fileList = [];
    });
  }

  /**
   * 子列表tab切换事件
   * @param param
   */
  tabIndexChange(param: any) {
    switch (param) {
      case 0:
        this.gridId = 'grid2';
        break;
      case 1:
        this.gridId = 'grid3';
        break;
    }
    if (this.selectData.length !== 0) {
      this.getListChild({page: 1, length: this.pageSizeChild});
    }
  }


}
