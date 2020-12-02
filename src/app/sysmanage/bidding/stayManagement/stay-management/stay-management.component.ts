import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {localUrls} from '@model/localUrls';

@Component({
  selector: 'app-stay-management',
  templateUrl: './stay-management.component.html',
  styleUrls: ['./stay-management.component.css']
})
export class StayManagementComponent implements OnInit {

  listLoading: boolean = false;
  //主列表
  totalPages: number = 0;
  selecetedData: Array<any> = [];
  pageSize: number = 30;
  dataSet: Array<any> = [];
  //子列表
  dataChildSet: Array<any> = [];
  totalChildPages: number = 0;
  pageChildSize: number = 30;
  selecetedChildData: Array<any> = [];

  tempSearchParam: any = {};//查询缓存

  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;

  //定向委托
  @ViewChild('directionalContent') directionalContent: TemplateRef<any>;
  directionalRadioValue: string = 'toFleet'; //司机车队选择

  buttonID: string;
  dataFleetSet: Array<any> = []; //车队数据
  dataFleetDisplaySet: Array<any> = []; //车队显示数据
  dataDriverSet: Array<any> = []; // 司机数据
  dataDriverDisplaySet: Array<any> = []; // 司机显示数据
  remark: string; //备注

  constructor(
    private router: Router,
    private http: HttpUtilService,
    private fb: FormBuilder,
    private nm: NzModalService,
    private nz: NzNotificationService,
    private msg: NzMessageService,
    private info: UserinfoService,
  ) {
  }

  ngOnInit() {
  }

  /**
   * 主列表搜索事件
   * @param data
   */
  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  /**
   * 主列表查询
   * @param data
   */
  getList(data: any): void {
    this.listLoading = true;
    this.tempSearchParam = data;
    let url = localUrls.getPaymentRegListUrl;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data.data;
          this.totalPages = res.data.data.total;
        }
      }
    );
  }

  /**
   * 子列表查询
   * @param data
   */
  getChildList(data: any): void {
    this.listLoading = true;
    let url = localUrls.getPaymentRegListUrl;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataChildSet = res.data.data.data || [];
          this.totalChildPages = res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    this.buttonID = data.buttonId;
    switch (this.buttonID) {
      case 'Add': { //添加
        this.btnAdd();
      }
        break;
      case 'Update': { //修改
        this.btnUpdate();
      }
        break;
      case 'Delete': { //删除
        this.btnDelete();
      }
        break;
      case 'Import': {

      }
        break;
      case 'Directional': { //定向委托
        this.btnDirectional();
      }
        break;
      case 'Driver': {

      }
        break;

      case 'OrderBid': {//竞价委托
        this.btnOrderBid();
      }
        break;
      case 'Rob': { //抢单委托
        this.btnRob();
      }
        break;
      case 'DriverGrab': {//司机抢单
        this.btnDriverGrab();
      }
        break;

    }
  }

  /**
   * 添加点击
   */
  btnAdd(): void {
    this.router.navigateByUrl('system/bidding/StayManageItem');
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
    if (this.selecetedData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认删除当前选中数据？',
      nzOnOk: () => this.deleteRequest()
    });
  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<any> {
    const url = '';
    const param = '';
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '删除成功！');
          this.listSearch({...this.tempSearchParam});
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 定向委托
   */
  btnDirectional(): void {
    this.nm.create({
      nzTitle: '待发资源管理 > 定向委托',
      nzContent: this.directionalContent,
      nzMaskClosable: false,
      nzWidth: '80%',
      nzOnOk: () => this.directionalRequest()
    });
  }

  /**
   * 定向委托请求
   */
  directionalRequest(): Promise<any> {
    const url = '';
    const param: any = {};
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '定向委托成功！');
          this.listSearch({...this.tempSearchParam});
        } else {
          return false;
        }
      }
    );
  }


  /**
   * 竞价委托
   */
  btnOrderBid(): void {

  }

  /**
   * 抢单委托
   */
  btnRob(): void {

  }

  /**
   * 司机抢单
   */
  btnDriverGrab(): void {

  }

  /**
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * 主列表选择
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selecetedData = param;
  }

  /**
   * 子列表选择
   * @param param
   */
  updateDataChildResult(param: Array<any>) {
    this.selecetedChildData = param;
  }

  /**
   * 定向委托，选中变化时回调
   * @param param
   */
  directionalRadioChange(param: string) {
    this.dataFleetSet = [];
    this.dataFleetDisplaySet = [];
    this.dataDriverSet = [];
    this.dataDriverDisplaySet = [];
    switch (param) {
      case 'toFleet': {
        this.getFleetData({});
      }
        break;
      case 'toDriver': {
        this.getDriverData({});
      }
        break;

    }
  }

  /**
   * 获取车队数据
   * @param data
   */
  getFleetData(data: any): void {
    let url = '';
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataFleetSet = res.data.data.data || [];
          // this.totalChildPages = res.data.data.total;
        }
      }
    );
  }

  /**
   * 获取司机数据
   * @param data
   */
  getDriverData(data: any): void {
    let url = '';
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataDriverSet = res.data.data.data || [];
          // this.totalChildPages = res.data.data.total;
        }
      }
    );
  }

  /**
   * 车队选中事件
   * @param param
   */
  updataDataFleetResult(param: Array<any>) {

  }

  /**
   * 司机选中事件
   * @param param
   */
  updataDataDriverResult(param: Array<any>) {

  }

  /**
   * 车队数据修改事件
   * @param param
   */
  modelFleetChange(param: Array<any>) {

  }

  /**
   * 司机数据修改事件
   * @param param
   */
  modelDriverChange(param: Array<any>) {

  }
}
