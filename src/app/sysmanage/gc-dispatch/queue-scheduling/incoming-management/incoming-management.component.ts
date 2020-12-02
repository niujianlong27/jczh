import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {gcDispatchURL} from '@model/gcDispatchURL';
import {isWithinRange, subDays, endOfDay, startOfDay} from 'date-fns';

@Component({
  selector: 'app-incoming-management',
  templateUrl: './incoming-management.component.html',
  styleUrls: ['./incoming-management.component.css']
})
export class IncomingManagementComponent implements OnInit {

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
  modalSpin = false; // 弹窗加载状态
  scanCodeData:any //扫码数据
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
    const url = gcDispatchURL.getEnterFactoryRecord;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
          this.selectData = [];
        }
        this.listLoading = false;
      }
    );
  }


  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.buttonId;
    switch (this.buttonId) {
      case 'Enter': {  //进厂
        this.btnEnter();
      }
        break;
      case 'Detail': { // 明细
        this.btnDetail();
      }
        break;
      default: {
        this.nm.warning('点击按钮功能未定义!');
      }
        break;
    }
  }

  /**
   * 点击进厂
   */
  btnEnter(): void {
    const expecedStartTime = this.selectData[0].expecedStartTime;
    const expecedEndTime = this.selectData[0].expecedEndTime;
    const status = isWithinRange(new Date(), expecedStartTime, expecedEndTime);
    if (status) {
      this.enterRequset();
    } else {
      this.nzModal.confirm({
        nzTitle: '提示消息',
        nzContent: '是否确定车辆进厂放行',
        nzOnOk: () => this.enterRequset()
      });
    }
  }

  /**
   * 车辆进厂请求
   */
  enterRequset() {
    const url = gcDispatchURL.gcEnterFactory;
    const param: any = {};
    param.transCompanyId = this.selectData[0].transCompanyId;
    param.planNo = this.selectData[0].planNo;
    param.companyId = this.selectData[0].companyId;
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nm.success('车辆进厂成功!');
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 装车明细
   */
  btnDetail(): void {
    this.modalTitle = '进厂管理 >装车明细';
    this.modalIsVisible = true;
    this.detailRequest();
  }

  /**
   * 明细获取
   */
  detailRequest() {
    this.modalSpin = true;
    const url = gcDispatchURL.getOrderItemByPlan;
    const param: any = {};
    param.planNo = this.selectData[0].planNo;
    param.companyId = this.selectData[0].transCompanyId;
    return this.http.post(url, param).then(
      res => {
        this.modalSpin = false;
        if (res.success) {
          this.modalDataSet = res.data.data || [];
          this.modalIsVisible = true;
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
    this.modalDataSet = [];
  }


  /**
   * 搜索抛出
   * @param params
   */
  searchDataReturn(params: Array<any>) {
    params.forEach(
      value => {
        if (value.parameter === 'queueStartTime') {
          value.checkBox = true;
          value.value1 = startOfDay(subDays(new Date(), 7));
          value.value2 = endOfDay(new Date());

        }
      }
    );
  }

  /*
  *  扫码结束调用
  */
  focus() {
    var j: any = document.getElementById('smq')
    j.focus()
  }
  scanCodeSuccess(){
  //  console.log('111111111111111111111');
   // console.log(data)
   // console.log('-----------------')
    let param :any ={};
    let arr:any = this.scanCodeData.split(';');
    param.transCompanyId = arr[0];
    param.planNo = arr[1];
    param.vehicleNo = arr[2];
    this.http.post(gcDispatchURL.gcEnterFactory,param).then(res=>{
      if(res.success){
        this.nm.success('车辆进厂成功!');
        this.getListSearch(this.searchData)
      }
      this.scanCodeData = undefined

    })
  }
}
