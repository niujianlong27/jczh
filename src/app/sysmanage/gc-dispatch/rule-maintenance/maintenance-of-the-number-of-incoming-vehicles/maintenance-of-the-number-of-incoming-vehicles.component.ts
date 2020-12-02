import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {gcDispatchURL} from '@model/gcDispatchURL';

@Component({
  selector: 'app-maintenance-of-the-number-of-incoming-vehicles',
  templateUrl: './maintenance-of-the-number-of-incoming-vehicles.component.html',
  styleUrls: ['./maintenance-of-the-number-of-incoming-vehicles.component.css']
})
export class MaintenanceOfTheNumberOfIncomingVehiclesComponent implements OnInit {

  pageSize = 30; // 条数
  dataSet: Array<any> = []; // 列表数据
  totalPage = 0; // 数据总数
  listLoading = false; // list加载
  searchData: any = {}; // 搜索数据
  selectData: Array<any> = [];
  buttonId: string;   // 按钮ID

  spinning = false; //  对话框加载状态

  modalIsVisible = false; // 弹窗状态
  modalTitle = ''; // 弹窗标题
  modalDataSet: Array<any> = []; // 弹窗数据

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    const url = gcDispatchURL.getRecords;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total || 0;
        }

      }
    ).finally(() => {
      this.listLoading = false;
      this.selectData = [];

    });
  }


  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Update': {  //修改
        this.btnUpdate();
      }
        break;
      default: {
        this.nm.warning('点击按钮功能未定义!');
      }
        break;
    }
  }

  /**
   * 点击修改
   */
  btnUpdate(): void {
    // this.modalTitle = '入厂车辆数规则维护>修改';
    this.selectData[0].EDIT = true;
    this.selectData[0].inputDisabled = {
      statusName: true,
      updateName: true,
      updateDate: true,
    };
  }

  /**
   * 点击保存
   * @param data
   */
  btnSave(data: any): void {
    if (data.maxCount === '' || data.maxCount.toString().indexOf('.') !== -1) {
      this.nm.warning('请填写整数');
      return;
    }
    this.saveRequest(data);
  }

  /**
   * 保存请求
   */
  saveRequest(data: any): void {
    const url = gcDispatchURL.getRecordsUpdate;
    const param = data;
    this.listLoading = true;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.nm.success('保存成功!');
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectData = param;
  }

  /**
   * 弹窗确定
   */
  modalOk(): void {
    this.modalIsVisible = false;
  }

  /**
   * 弹窗取消
   */
  modalCancel(): void {
    this.modalIsVisible = false;
  }

  modelChange(params) {
    if (params.val && params.header.colEname === 'maxCount' && params.val * 1 > 99999) {
      params.input.value = 99999;
      params.data.maxCount = 99999;
    }
  }

}
