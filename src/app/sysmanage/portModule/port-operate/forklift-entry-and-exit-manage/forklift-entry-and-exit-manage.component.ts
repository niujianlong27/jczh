import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';
import {portUrl} from '../../../../common/model/portUrl';
import {HttpClient} from '@angular/common/http';
import {planUrl} from '../../../../common/model/planUrls';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-forklift-entry-and-exit-manage',
  templateUrl: './forklift-entry-and-exit-manage.component.html',
  styleUrls: ['./forklift-entry-and-exit-manage.component.css']
})
export class ForkliftEntryAndExitManageComponent implements OnInit {

  selectedData: Array<any> = []; //选中数据
  selectedDataChild: Array<any> = []; //选中数据
  buttonId: string; //按钮ID
  tmpButtonId; // buttonId缓存
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 主列表数据
  dataChild: Array<any> = []; // 主列表数据

  searchTmp: any;//搜索框缓存

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  modalOkLoading: boolean = false; //弹窗确定按钮状态

  berthList: Array<any> = []; //泊位数组存储
  berthList2: Array<any> = []; //泊位数组存储

  userColomns: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '泊位', eName: 'actualBerth', type: 'select', validateCon: '请填写船批号', require: true, disabled: false,
      validators: {
        require: true
      },
      selectList: this.berthList
    },

    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请选择船只', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '舱别', eName: 'shipingSpaceNumber', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '车号', eName: 'forkliftNo', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },

    },
    {
      name: '入舱时间', eName: 'intoTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '入舱现场调度', eName: 'intoOperator', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '出舱时间', eName: 'outTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '出舱现场调度', eName: 'outOperator', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
  ];

  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(
      res => {
        const validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    this.getberthageNamebyCompanyId();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any): void {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.listLoading = true;
    this.searchTmp = param;
    this.getListSearch(param);
  }

  /**
   * 查询请求
   * @param data
   */
  getListSearch(data: any): void {
    const url = planUrl.getList;
    // const url = portUrl.forkLiftGetList;
    this.http.post(url, data).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.selectedData = [];
          this.dataChild = [];
          this.selectedDataChild = [];
        }
      }
    );

  }

  /**
   * 获取子列表数据
   */
  getChildList(param: string): void {
    const url = portUrl.forkLiftGetList;
    this.http.post(url, {boatBatchNum: param}).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataChild = res.data.data.data;
          // this.totalPage = res.data.data.total;
          this.selectedDataChild = [];
        }
      }
    );
  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any): void {
    this.buttonId = param.buttonId;
    switch (this.buttonId) {
      case 'Add': {
        this.btnAdd();
      }
        break;
      case 'Update': {
        this.btnUpdate();
      }
        break;
      case 'Delete': {
        this.btnDelete();
      }
        break;
      case 'Save': {
        this.btnSave();
      }
        break;
      case 'Export': {
        this.btnExport();
      }
    }
  }

  /**
   * 新增点击事件
   */
  btnAdd(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }
    this.tmpButtonId = this.buttonId;
    const param = {index: this.dataChild.length, EDIT: true, status: 'add', checked: true};
    this.userColomns.some(
      value => {
        if (value.colEname === 'actualBerth' && value.apiParameter.optionList.length === 0) {
          Array.prototype.push.apply(value.apiParameter.optionList, this.berthList2);
          return true;
        }
        return false;

      }
    );
    this.dataChild = [param, ...this.dataChild];
    this.selectedDataChild.push(param);
  }

  /**
   * 修改点击事件
   */
  btnUpdate(): void {
    if (this.selectedDataChild.length === 0) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }
    this.tmpButtonId = this.buttonId;
    this.selectedDataChild.forEach(
      res => {
        res.status = 'update';
        res.EDIT = true;
      }
    );

  }

  /**
   * 点击保存
   */
  btnSave() {

    switch (this.tmpButtonId) {
      case 'Add': {
        this.addData();
      }
        break;
      case 'Update': {
        this.updateData();
      }
        break;
    }
  }

  /**
   * 点击导出
   */
  btnExport(): void {
    this.angularHttp.post(portUrl.forkLiftExport,
      {
        formId: 'form_boat_forklift_eam',
        gridId: 'grid2',
        ...this.searchTmp
      },
      {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `叉车进出舱管理.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }

  /**
   * 删除点击事件
   */
  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认删除当前选中数据？',
        nzOnOk: () => this.deleteProcessingEvent()
      }
    );

  }

  /**
   * 删除处理事件
   */
  deleteProcessingEvent(): Promise<boolean> {
    switch (this.tmpButtonId) {
      case 'Add': {
        const addDataList: Array<any> = this.selectedDataChild.filter(
          value => value.status === 'add'
        );
        const addAllDataList: Array<any> = this.dataChild.filter(
          value => value.status === 'add'
        );
        const deleteDataList: Array<any> = this.selectedDataChild.filter(
          value => !value.status
        );

        addDataList.length > 0 && (this.dataChild = this.dataChild.filter(
            value =>
              !addDataList.some(value1 => value1.index === value.index)
          )
        );

        if (addAllDataList.length === addDataList.length) {
          this.tmpButtonId = '';
        }

        if (deleteDataList.length > 0) {
          return this.deleteRequest(deleteDataList);
        } else {
          return new Promise<boolean>(
            (resolve) => {
              resolve(true);
            }
          );
        }
      }

      case 'Update': {
        return this.deleteRequest(this.selectedDataChild);
      }
      default: {
        return this.deleteRequest(this.selectedDataChild);
      }

    }

  }

  /**
   * 删除请求事件
   */
  deleteRequest(deleteData: Array<any>): Promise<boolean> {
    const url = portUrl.forkLiftDeleteList;
    const param = {
      forkliftInOutTankModels: deleteData
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          // 删除成功后，手动从列表中删除数据
          if (deleteData.length > 0) {
            this.dataChild = this.dataChild.filter(
              value =>
                !deleteData.some(
                  value1 => value1.rowid === value.rowid
                )
            );
          }


          this.nn.success('提示消息', '删除成功！');
          return true;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>): void {
    this.selectedData = param;
    this.dataChild = [];
    if (this.selectedData.length === 1) {
      this.getChildList(this.selectedData[0].boatBatchNum);
    }
  }

  /**
   * 子列表选择
   * @param param
   */
  updateDataResultChild(param: Array<any>) {
    this.selectedDataChild = param;
  }

  /**
   * 泊位查询
   */
  getberthageNamebyCompanyId(): void {
    this.berthList2 = [];
    this.http.post(urls.getberthageNamebyCompanyId, {}).then(
      res => {
        if (res.success) {
          Array.prototype.push.apply(this.berthList, res.data.data);
          res.data.data.forEach(
            (value: any) => {
              this.berthList2.push({name: value, value: value});
            }
          );
        }
      }
    );
  }

  /**
   * 弹窗确定
   */
  handleOk() {

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }


    if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {
      this.addData();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
      this.updateData();
    }

  }

  /**
   * 新增
   */
  addData(): void {
    const url = portUrl.forkLiftAddList;
    this.selectedDataChild.forEach(
      value => value.boatBatchNum = this.selectedData[0].boatBatchNum
    );
    const param = {forkliftInOutTankModels: this.selectedDataChild};

    param.forkliftInOutTankModels[0].intoTime = param.forkliftInOutTankModels[0].intoTime && Utils.dateFormat(param.forkliftInOutTankModels[0].intoTime, 'yyyy-MM-dd HH:mm:ss');
    param.forkliftInOutTankModels[0].outTime = param.forkliftInOutTankModels[0].outTime && Utils.dateFormat(param.forkliftInOutTankModels[0].outTime, 'yyyy-MM-dd HH:mm:ss');
    this.modalOkLoading = true;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.tmpButtonId = '';
          this.nn.success('提示消息', '添加成功!');
          this.getChildList(this.selectedData[0].boatBatchNum);
        }
      }
    );
  }

  /**
   * 修改
   */
  updateData(): void {
    const url = portUrl.forkLiftUpdateList;
    this.selectedDataChild.forEach(
      value => value.boatBatchNum = this.selectedData[0].boatBatchNum
    );
    const param = {forkliftInOutTankModels: this.selectedDataChild};
    this.modalOkLoading = true;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.tmpButtonId = '';
          this.nn.success('提示消息', '修改成功!');
          this.getChildList(this.selectedData[0].boatBatchNum);
        }
      }
    );
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭后处理
   */
  closeResult() {
    this.modalValidateForm.reset({});
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * 子列表弹窗
   * @param param
   */
  inpEmit(param: any) {
    switch (param.eName) {
      case 'boatName': {
      }
        break;
      case 'forkliftNo': {
        this.dataChild[param.index].ton = param.selData[0] ? param.selData[0].ton : '';
        this.dataChild[param.index].brand = param.selData[0] ? param.selData[0].brand : '';
      }
        break;
    }
  }

  /**
   * 表格2表头获取
   * @param param
   */
  userColumns(param: Array<any>) {
    this.userColomns = param;

  }

}
