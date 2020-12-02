import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {GlobalService} from '@service/global-service.service';
import {SearchformComponent} from '@component/searchform/searchform.component';
import {localUrls} from '@model/localUrls';
import {urls} from '@model/url';

@Component({
  selector: 'app-car-manage',
  templateUrl: './car-manage.component.html',
  styleUrls: ['./car-manage.component.css']
})
export class CarManageComponent implements OnInit, OnDestroy {

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
    private router: Router,
    private glo: GlobalService
  ) {
  }

  pageSize = 30; // 条数
  dataSet: Array<any> = []; // 列表数据
  totalPage = 0; // 数据总数
  listLoading = false; // list加载
  searchData: any = {}; // 搜索数据
  selectData: Array<any> = [];
  buttonId: string; // 按钮ID
  products: Array<any> = []; // 品种

  modal: NzModalRef;


  ngOnInit() {
    this.searchReloadEvent(); // searchReload事件订阅，用于处理页面保存选项开启时，页面跳转数据传递
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

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(localUrls.getVehicleInfoList, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
          this.selectData = [];
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
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.type.buttonId;
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
    }
  }

  /**
   * 添加点击
   */
  btnAdd(): void {
    sessionStorage.removeItem('carManageData');
    this.router.navigate(['system/baseInformation/carManageAdd']).then(value => {
      if (value) {
        const data = JSON.stringify({status: 'add'});
        sessionStorage.setItem('carManageData', data);
        this.glo.searchReload.emit({target: 'carManageDataAdd'});
      } else {
        this.nm.error('路由跳转异常！');
      }
    });
  }

  /**
   * 修改点击
   */
  btnUpdate(): void {
    if (this.selectData.length !== 1) {
      this.nm.warning('请选择一条数据后操作！');
      return;
    }
    sessionStorage.removeItem('carManageData');
    this.router.navigate(['system/baseInformation/carManageAdd']).then(value => {
      if (value) {
        const data = JSON.stringify({status: 'update', data: this.selectData[0]});
        sessionStorage.setItem('carManageData', data);
        this.glo.searchReload.emit({target: 'carManageDataAdd'});
        this.dataSet = [];
        this.selectData = [];
        this.listLoading = true;
      } else {
        this.nm.error('路由跳转异常！');
      }
    });
  }

  /**
   * 删除点击
   */
  btnDelete(): void {
    if (this.selectData.length === 0) {
      this.nm.warning('请选择数据后操作！');
      return;
    }
    this.modal = this.nzModal.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认删除当前选中数据？',
      nzMaskClosable: false,
      nzOnOk: () => this.deleteRequest()
    });
  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<any> {
    const url = localUrls.deleteVehicleInfoByNo;
    const param = {
      rowid: this.selectData[0].rowid,
      vehicleNo: this.selectData[0].vehicleNo,
      businessType: this.selectData[0].businessType,
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nm.success('删除成功!');
          this.listSearch(this.searchData);
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 查询区域数据返回
   * @param param
   */
  searchComponent(param: SearchformComponent) {
    console.log(param.controlArray);
  }

  /**
   * 静态集值获取
   * @param valueSetCode
   * @param parameter
   */
  getStatic(valueSetCode: string, parameter: Array<any>): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      res => {
        if (res.success) {
          const data = (res.data.data.data || []).map(item => ({name: item.name, value: item.name}));
          Array.prototype.push.apply(parameter, data);
        }
      }
    );
  }

  /**
   * 获取品种
   */
  getProd(): void {
    this.http.post(urls.selectProdNew, {}).then(
      res => {
        const data = (res.data.data || []).map(item => ({name: item.prodKindPrice, value: item.prodKindPrice}));
        Array.prototype.push.apply(this.products, data);
      }
    );
  }

  /**
   * searchReload事件订阅
   */
  searchReloadEvent(): void {
    this.glo.searchReload.subscribe(
      value => {
        if (value['target'] === 'carManageData') {
          this.dataSet = [];
          this.selectData = [];
          this.listSearch(this.searchData);
        }
      }
    );
  }

  ngOnDestroy(): void {

  }

}
