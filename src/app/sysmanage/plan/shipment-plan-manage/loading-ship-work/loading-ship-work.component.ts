import {Component, OnInit} from '@angular/core';
import {stockUrl} from '../../../../common/model/stockUrl';
import {portUrl} from '../../../../common/model/portUrl';
import {planUrl} from '../../../../common/model/planUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../../common/util/utils';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpClient} from '@angular/common/http';
import * as util from 'util';

@Component({
  selector: 'app-loading-ship-work',
  templateUrl: './loading-ship-work.component.html',
  styleUrls: ['./loading-ship-work.component.css'],
})
export class LoadingShipWorkComponent implements OnInit {

  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

  gridOneHeight: string;
  gridTwoHeight: string;

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  totalPages1: number = 0;
  pageSize1: number = 30;

  listLoading2: boolean = false;
  totalPages2: number = 0;
  pageSize2: number = 30;

  modalOkLoading: boolean = false; //弹窗确定 加载

  listLoading3: boolean = false;//调度计划查询loding
  totalPages3: number = 0;//调度计划查询
  pageSize3: number = 30;//调度计划查询

  //新增待选列表
  modelRightSize: number = 1000000;
  modelLeftSize: number = 1000000;
  modelRighttotal: number = 0;
  modelLefttotal: number = 0;
  modellistLoading1: boolean = false;
  modellistLoading2: boolean = false;
  deepList: Array<any> = [];

  dataSet1: Array<any> = [];
  dataSet2: Array<any> = [];
  modelLeft: Array<any> = [];
  modelRight: Array<any> = [];
  insertList: Array<any> = [];
  deleteList: Array<any> = [];
  moduleDataSet: Array<any> = [];//调度计划选择数据
  modalSelectDataMap: Map<any, Array<any>> = new Map<any, Array<any>>();//调度计划选择数据
  PlanModalList: Array<any> = []; // 调度计划数据
  PlanModalSelectData: Array<any> = [];
  PlanModalTotal: number = 0; //数据总条数
  PlanModalPageSize: number = 30; //数据总条数
  listClickData: Array<any> = [];//点击列缓存数据
  updateData: Array<any> = [];
  updateData2: any = [];//调度计划列表数据变化赋值
  rowid: string = '';
  modalValidateForm: FormGroup;//弹窗表格
  modalFormVisible = false; // 表单弹窗
  modalFormVisible1 = false; // 选择调度计划
  modalTitle: string; // 弹窗标题
  modalTitle2: string; // 弹窗标题
  status: string = ''; //弹窗状态
  deleteVisible = false;//删除弹窗显示控制
  deleteCon: string;
  tempSearchParam: any;
  boatTeam: Array<any> = [];
  x: any;
  loadingSequenceTmp: any;
  modalSping: boolean = false;
  selectedParam: string = '';

  modelLeftSelectData: Array<any> = []; //modal table选择数据
  modelRightSelectData: Array<any> = [];

  //调度计划明细 未选列表

  constructor(private router: Router, private  angularHttp: HttpClient,
              private http: HttpUtilService, private nm: NzModalService,
              private nz: NzNotificationService, private fb: FormBuilder,) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    this.modalValidateForm = this.fb.group({
      // disNum: [{value: null, disabled: true}, [Validators.required]],
      // scheduleNum: [{value: null, disabled: true}, [Validators.required]],//没明确字段，先这样写着：调度计划号
      boatBatchNum: [{value: null, disabled: true}, [Validators.required]],
      boatName: [{value: null, disabled: true}, [Validators.required]],
      captain: [{value: null, disabled: true}, [Validators.required]],
      optTeamNum: ['', [Validators.required]],
      // expectStartTime: ['', [Validators.required]],
      // expectEndTime: ['', [Validators.required]],
    });

    //清除相关session
    // sessionStorage.setItem("stockOut","");
    // sessionStorage.setItem("stockMoveTopInfo",JSON.stringify({status:'Add'}));
    // sessionStorage.setItem("detailList","[]");
    this.getList1({page: 1, length: this.pageSize1});

  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = planUrl.getWorkList;//查询界面查询接口
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.updateData = [];
    data.scheduleType = 'ZXLX10';
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    });
  }

  /**
   * 获取调度计划表
   * @param data
   */
  getList3(data: any): void {
    let url = '';//查询调度计划表
    this.listLoading1 = true;
    this.dataSet1 = [];
    data.planType = 'ZXLX10';
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    });
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    data.planType = 'ZXLX10';
    this.getList1(data);
  }

  /**
   * 查询调度计划表
   * @param data
   */
  listSearch3(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    data.planType = 'ZXLX10';
    this.getList3(data);
  }

  /**
   * 获取明细列表
   * @param data
   */
  getList2(data: any) {
    this.dataSet2 = [];
    let params = data;
    params.companyId = this.listClickData[0].companyId;
    params.boatBatchNum = this.listClickData[0].boatBatchNum;
    let url = planUrl.getPackListByBoatBatchNum;
    this.listLoading2 = true;
    this.http.post(url, params).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
      }
    });
  }

  /**
   * 列表选中数据发生变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 调度明细 已选 列表点击
   */
  leftupdateDataResult() {
    this.selectedParam = this.modalValidateForm.get('optTeamNum').value;
    this.modelLeftSelectData.forEach(
      value => {
        this.modelLeft.forEach((item, index) => {
          if (value && value.rowIndex == item.rowIndex) {
            value.expectEndTime = null;
            value.expectStartTime = null;
            value.checked = false;
            let list = this.modelLeft.splice(index, 1);
            this.modelLeft = [...this.modelLeft];
            this.modelRight.push(list[0]);
            this.modelRight = [...this.modelRight];
            this.modelLefttotal = this.modelLeft.length;
          }
        });

      }
    );
    this.modelLeftSelectData = [];
  }

  /**
   * 调度明细 待选 列表点击
   */
  rightupdateDataResult() {
    // if (!this.modalValidateForm.get('optTeamNum').value) {
    //   this.nz.warning('提示消息', '请选择作业班组后操作');
    //   return;
    // }
    this.selectedParam = this.modalValidateForm.get('optTeamNum').value;
    this.modelRightSelectData.forEach(
      value => {
        this.modelRight.forEach((item, index) => {
          if (value && value.rowIndex == item.rowIndex) {
            value.expectEndTime = null;
            value.expectStartTime = null;
            value.checked = false;

            let list = this.modelRight.splice(index, 1);
            this.modelRight = [...this.modelRight];
            this.modelLeft.push(list[0]);
            this.modelLeft = [...this.modelLeft];
            this.modelRighttotal = this.modelRight.length;
          }
        });
      }
    );
    this.modelRightSelectData = [];
  }

  /**
   * 调度计划列表选中数据发生变化
   * @param data
   */
  updateDataResult2(data: any) {
    this.updateData2 = data;
  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data: any): void {
    this.listClickData[0] = data;

    this.getList2({page: 1, length: this.pageSize2});

  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId != 'Export' && this.updateData.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      return;
    }

    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Del':
        this.delete();
        break;
      case 'Export':
        this.export();
        break;
      case 'ExportDetail':
        this.exportDetail();
        break;
      case 'Issued':
        this.issued();
        break;
      case 'Cancellation':
        this.cancellation();
        break;
      default:
        break;
    }
  }

  /**
   * 新增点击
   */
  btnAdd(): void {
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.modalFormVisible = true;
    this.modalTitle = '班组作业计划 > 作业分配';
    this.status = 'add';
    this.getTeamModel();
    this.getWorkListByBoatBatchNum();
  }

  /**
   * 修改点击
   */
  btnUpdate() {
    if (this.updateData.length > 1) {
      this.nz.warning('提示消息', '请选择一条数据后操作');
      return;
    }
    this.modalValidateForm.get('optTeamNum').reset({value: null, disabled: true});
    this.status = 'update';
    this.modalFormVisible = true;
    this.modalTitle = '装船作业计划 > 修改';
    this.modalValidateForm.patchValue(this.updateData[0]);//form表单赋值
    this.rowid = this.updateData[0].rowid;
    let params = {
      scheduleNum: this.updateData[0].scheduleNum,
      disNum: this.updateData[0].disNum,
      optTeamNum: this.updateData[0].optTeamNum
    };
    this.getloadingSequence(params);
    this.getselectByDisNum(params);
  }


  /**
   * 删除弹窗
   */
  delete() {
    this.status = 'delete';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = '是否确定清除作业信息？';
  }

  /**
   * 导出事件
   */
  export() {
    let url: any = planUrl.boatWorkScheduleMainExport;
    this.angularHttp.post(url, {}, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `班组作业计划.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 下发弹窗事件
   */
  issued() {
    this.status = 'issued';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = '是否确定下发';
  }

  /**
   * 撤销下发
   */
  cancellation(): void {
    if (this.updateData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
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

    const url = '';
    const params = {boatPlanModelList: []};
    this.updateData.forEach(
      res => {
        params.boatPlanModelList.push({boatBatchNum: res.boatBatchNum});
      }
    );
    return this.http.post(url, params).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '撤销下发成功!');
          this.listSearch({page: 1, length: this.pageSize1});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 导出明细
   */
  exportDetail() {
    if (this.updateData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
      return;
    }
    let url: any = planUrl.boatWorkScheduleItemExport;
    // this.tempSearchParam.disNum = this.updateData[0].disNum;
    this.angularHttp.post(url, this.updateData[0], {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `班组作业计划详情.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 作业班组获取
   * @param param
   */
  getTeamModel(param: any = {}) {
    let url = planUrl.selectTTeamModel;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.boatTeam = res.data.data.data && res.data.data.data || [];
        }
      }
    );
  }


  handleCancel() {
    this.modalFormVisible = false;
  }


  /**
   * 新增 修改弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if (this.modalValidateForm.status !== 'VALID' && this.modalValidateForm.status !== 'DISABLED') {
      this.nz.warning('提示消息', '请把表单填写完整！');
      return;
    }

    // 数据处理
    let param: any;
    param = this.modalValidateForm.getRawValue();
    param.boatSchedulePackModelList = Utils.deepCopy(this.modelLeft);
    // this.modalSelectDataMap.forEach( // map遍历
    //   res => {
    //     param.tBoatWorkScheduleItemModelList = [...param.tBoatWorkScheduleItemModelList, ...res];
    //   }
    // );
    // param.tBoatWorkScheduleItemModelList = this.moduleDataSet;
    param.rowid = this.rowid;
    // param.expectStartTime = param.expectStartTime && param.expectStartTime instanceof Date ? Utils.dateFormat(param.expectStartTime, 'yyyy-MM-dd HH:mm:ss') : param.expectStartTime || '';
    // param.expectEndTime = param.expectEndTime && param.expectEndTime instanceof Date ? Utils.dateFormat(param.expectEndTime, 'yyyy-MM-dd HH:mm:ss') : param.expectEndTime || '';
    param.scheduleType = 'ZXLX10';

    const status = param.boatSchedulePackModelList.some(
      res => {
        if (res.expectEndTime && res.expectStartTime && res.expectEndTime) {
          res.expectStartTime = Utils.dateFormat(new Date(res.expectStartTime), 'yyyy-MM-dd HH:mm:ss');
          res.expectEndTime = Utils.dateFormat(new Date(res.expectEndTime), 'yyyy-MM-dd HH:mm:ss');
          return false;
        } else {
          return true;
        }
      }
    );

    if (status) {
      this.nz.warning('提示消息', '请填写完整!');
      return;
    }

    if ((this.modalValidateForm.status === 'VALID' || this.modalValidateForm.status === 'DISABLED') && this.status === 'add') {
      this.add(param);
    }

    if ((this.modalValidateForm.status === 'VALID' || this.modalValidateForm.status === 'DISABLED') && this.status === 'update') {
      this.update(param);
    }

  }

  /**
   * 新增请求
   * @param param
   */
  add(param: any): void {
    this.modalOkLoading = true;
    const url = planUrl.updateWorkPackList;
    this.http.post(url, param).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.nz.success('提示消息', '保存成功');
          this.getWorkListByBoatBatchNum(this.modalValidateForm.get('optTeamNum').value);
          // this.modalFormVisible = false;
          // this.getList1({page: 1, length: this.pageSize1});
          this.moduleDataSet = [];
        }
      }
    ).catch(reason => this.modalOkLoading = false);
  }

  /**
   * 修改请求
   * @param param
   */
  update(param: any): void {
    param.rowid = this.rowid;
    this.modelLeft.forEach((item, index) => {
      if (item.from == 'right') {
        this.insertList.push(item);
      } else if (item.from == 'left') {
        this.deepList.forEach((data, ind) => {
          if (item.rowIndex == data.rowIndex) {
            this.deepList.splice(ind, 1);
            this.deleteList = [...this.deepList];
          }
        });
      }
    });
    const url = planUrl.boatWorkupdateByDisNum;
    param.insertList = [...this.insertList];
    param.deleteList = [...this.deleteList];
    this.http.post(url, param).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.nz.warning('提示消息', '修改数据成功');
          this.getList1({page: 1, length: this.pageSize1});
          this.modalFormVisible = false;
        }
      }
    );

  }

  /**
   * 弹窗关闭回调
   */
  closeResult() {
    this.modalValidateForm.reset();
    this.modelRight = [];
    this.modelLeft = [];
    this.insertList = [];
    this.deleteList = [];
    this.deepList = [];
    this.modelLeftSelectData = [];
    this.modelRightSelectData = [];
    this.modalOkLoading = false;
  }

  /**
   * 调度计划弹窗
   */
  openModule() {
    this.modalFormVisible1 = true;
    this.modalTitle2 = '调度计划 > 选择';
    this.getSchedulingPlanData({page: 1, length: this.PlanModalPageSize});

  }

  /**
   * 确认框 结果事件
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let url = planUrl.boatWorkdeleteByDisNum;

      if (this.status == 'delete') {
        let params = {boatPlanModelList: this.updateData};

        this.http.post(url, params).then(
          (res: any) => {
            if (res.success) {
              this.nz.success('提示消息', '删除成功！');
              this.getList1({page: 1, length: this.pageSize1});
              this.deleteVisible = false;
            }
          }
        );
      } else if (this.status == 'issued') {
        let url = planUrl.boatWorkissued;
        let params = {tBoatWorkScheduleMainModelList: []};
        this.updateData.forEach(item => {
          params.tBoatWorkScheduleMainModelList.push({disNum: item.disNum, status: item.status});
        });
        this.http.post(url, params).then(
          (res: any) => {
            if (res.success) {
              this.nz.success('提示消息', '下发成功！');
              this.getList1({page: 1, length: this.pageSize1});
              this.deleteVisible = false;
            }
          });
      }
    } else {
      this.deleteVisible = false;
    }
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
          this.PlanModalList = res.data.data.data;
          this.PlanModalTotal = res.data.data.total;
        }
      }
    );
  }

  /**
   * 调度计划取消
   */
  handleCancel1() {
    this.modalFormVisible1 = false;
    this.PlanModalSelectData = [];
    this.PlanModalList = [];
  }

  /**
   * 调度计划确认弹窗
   */
  handleOk1() {
    this.modalValidateForm.patchValue(this.PlanModalSelectData[0]);
    let params = {page: 1, length: this.modelRightSize, scheduleNum: this.PlanModalSelectData[0].scheduleNum};
    this.modalFormVisible1 = false;
    this.getloadingSequence(params);
  }

  /**
   * 调度计划明细 未选择列表
   * @param data
   */
  getloadingSequence(data) {
    data.companyId = this.updateData[0].companyId;
    data.boatBatchNum = this.updateData[0].boatBatchNum;
    const url = planUrl.getWorkListByBoatBatchNum;
    this.loadingSequenceTmp = data;
    this.modellistLoading2 = true;
    this.http.post(url, data).then(
      res => {
        this.modellistLoading2 = false;
        if (res.success) {
          this.modelRight = res.data.data && res.data.data.data || [];
          this.modelRighttotal = res.data.data && res.data.data.total;
          this.modelRight.forEach((item, index) => {
            item.rowIndex = `right${index}`, item.from = 'right';
            console.log(item);
          });

          // if (this.status === 'add' && this.modelRight.length > 0) {
          //   const map = new Map<string, any>();
          //   this.modelRight.forEach(
          //     res => {
          //       map.set(res.packNo, res);
          //     }
          //   );
          //   const tmp = this.modalSelectDataMap.get(this.loadingSequenceTmp.page);
          //   tmp && tmp.forEach(
          //     res => {
          //       const tmp2 = map.get(res.packNo);
          //       if (tmp2) {
          //         tmp2.checked = true;
          //         this.moduleDataSet.push(tmp2);
          //       }
          //     }
          //   );
          //
          // }

        }
      }
    );
  }

  /**
   * 新增时调度计划明细页量更改
   * @param param
   */
  modalPageSize(param: number) {
    this.modelRightSize = param;
    this.loadingSequenceTmp.length = this.modelRightSize;
    if (this.status === 'add') {
      this.modalSelectDataMap.clear();

    }
    this.getloadingSequence(this.loadingSequenceTmp);
  }

  /**
   * 新增时调度计划明细页码更改
   * @param param
   */
  modalPageIndex(param: number) {
    this.loadingSequenceTmp.page = param;
    this.getloadingSequence(this.loadingSequenceTmp);
  }

  /**
   * 新增时，调度计划明细选择事件
   * @param data
   */
  itemSelect(data) {
    this.moduleDataSet = data;
    this.modalSelectDataMap.set(this.loadingSequenceTmp.page, this.moduleDataSet);
  }

  /**
   * 调度计划明细 未选列表
   * @param data
   */
  getselectByDisNum(data) {

    const url = planUrl.selectByDisNum;
    this.http.post(url, data).then(
      res => {
        if (res.success) {
          this.modalFormVisible1 = false;
          this.modelLeft = res.data.data && res.data.data.data || [];
          this.modelLefttotal = res.data.data && res.data.data.total;
          this.modelLeft.forEach((item, index) => {
            item.rowIndex = `left${index}`;
            item.from = 'left';
          });
          this.deepList = Utils.deepCopy(this.modelLeft);
        }
      }
    );
  }


  //提示弹窗自动销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  //主列表当前页码改变
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  /**
   * 主列表每页展示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2});
  }

  /**
   * 调度计划当前页码改变
   * @param page
   */
  getPageIndex3(page: any): void {
    this.getList3({page: page, length: this.pageSize3});
  }

  /**
   * 调度计划列表每页展示条数改变
   * @param pageSize
   */
  getPageSize3(pageSize: any): void {
    this.pageSize3 = pageSize;
    this.getList3({page: 1, length: this.pageSize3});
  }

  /**
   * 船舶计划条数事件
   * @param param
   */
  PlanModalPageSizeChange(param: any) {
    this.PlanModalPageSize = param;
    this.getSchedulingPlanData({page: 1, length: this.PlanModalPageSize});
  }

  /**
   * 船舶计划页码更改事件
   * @param param
   */
  PlanModalPageIndexChange(param: any) {
    this.getSchedulingPlanData({page: param, length: this.PlanModalPageSize});
  }

  /**
   * 船舶计划选择数据
   * @param param
   */
  PlanModalUpdateChange(param: Array<any>) {
    this.PlanModalSelectData = param;
  }


  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
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
   * grid高度事件
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * 弹窗明细
   */
  getWorkListByBoatBatchNum(parameter?: string): void {
    this.modalSping = true;
    const url = planUrl.getWorkListByBoatBatchNum;
    const param: any = {};
    param.companyId = this.updateData[0].companyId;
    param.boatBatchNum = this.updateData[0].boatBatchNum;
    this.http.post(url, param).then(
      res => {
        this.modelRight = [];
        this.modelLeft = [];
        this.modalSping = false;
        this.modelRight = res.data.data.data || [];
        this.modelRighttotal = res.data.data && res.data.data.total || 0;
        this.modelRight.forEach((item, index) => {
          if (parameter && item.optTeamNum) {
            if (item.optTeamNum === parameter) {
              item.rowIndex = `left${index}`;
              item.from = 'left';
              this.modelLeft = [...this.modelLeft, item];
            }
          } else {
            item.rowIndex = `right${index}`;
            item.from = 'right';
          }

        });

        this.modelRight = this.modelRight.filter(
          res => res.from === 'right'
        );
      }
    );
  }

  /**
   * 作业班组修改
   * @param param
   */
  selectModelChange(param: any) {
    if (param) {
      const rightStatus = this.modelRight.some(
        res => res.from == 'left'
      );
      const leftStatus = this.modelLeft.some(
        res => res.from == 'right'
      );
      if (rightStatus || leftStatus) {
        if (this.selectedParam !== param) {
          this.nz.warning('提示消息', '有未保存数据，请点击确认保存后操作!');
          // this.modalValidateForm.get('optTeamNum').setValue(this.selectedParam);
          setTimeout(
            () => {
              this.modalValidateForm.get('optTeamNum').setValue(this.selectedParam);
              // this.modalValidateForm.patchValue({optTeamNum: this.selectedParam});
            }, 1
          );
        }
      } else {
        this.modelLeft = [];
        this.modelRight = [];
        this.getWorkListByBoatBatchNum(param);
      }

    }
  }

  /**
   * 弹窗table选择
   * @param param
   */
  modelRightSelect(param: Array<any>) {
    this.modelRightSelectData = param;
  }

  /**
   * 弹窗table选择
   * @param param
   */
  modelLeftSelect(param: Array<any>) {
    this.modelLeftSelectData = param;

  }

  /**
   * modal table输入更改事件
   * @param param
   */
  modelChange(param: any) {
    switch (param.header.colEname) {
      case 'expectStartTime': {
        if (param.data.expectEndTime && param.val) {
          if (!(param.val - param.data.expectEndTime)) {
            param.data.expectStartTime = param.data.expectEndTime;
          }
        }
      }
        break;
      case 'expectEndTime': {

      }
        break;
    }
  }
}
