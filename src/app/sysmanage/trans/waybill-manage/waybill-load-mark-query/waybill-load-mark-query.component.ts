import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';

@Component({
  selector: 'app-waybill-load-mark-query',
  templateUrl: './waybill-load-mark-query.component.html',
  styleUrls: ['./waybill-load-mark-query.component.css']
})
export class WaybillLoadMarkQueryComponent implements OnInit {

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = false; //list加载
  searchData: any; // 搜索数据
  selectData: Array<any> = []; //选中数据
  selectDataOld: Array<any> = []; //旧选中数据
  selectStatus: boolean = true; //首次进行数据选中
  buttonId: string; // 按钮ID

  rowid: string = '';

  status: string = '';

  timeQuantumStatus: boolean = false; // 时间间隔
  times: number = 0;

  selectedValue: string = ''; //大载标载选择值
  selectedValueValidateStatus: string = ''; //大载标载校验
  selectArray: Array<any> = []; //大载小载数组数据
  @ViewChild('loadMark') loadMark;

  /**
   * 搜索条件处理，判断是否包含timeQuantum
   */
  searchProcess = (param: any): boolean => {
    if (param.queryParameterList && param.queryParameterList.length !== 0) {
      return param.queryParameterList.some(
        value => {
          return value.parameter === 'timeQuantum';
        }
      );
    } else {
      return false;
    }
  };

  constructor(private http: HttpUtilService,
              public upload: UploadFiles,
              private fb: FormBuilder,
              private nn: NzNotificationService,
              private nm: NzModalService,) {
  }

  ngOnInit() {
    this.getStatic(this.selectArray, 'ZZBJ');
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    console.log(param);
    this.listLoading = true; //list加载
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(TRANS_URLS.wayBillsByCondition, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.selectData = [];
          this.timeQuantumStatus = this.searchProcess(data);
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
        }
      }
    );
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>) {
    console.log(++this.times);
    if (param.length === 0) {
      this.selectStatus = true;
      this.selectData = [];
      this.selectDataOld = [];
      return;
    }
    //判断搜索条件是否是出库间隔
    if (this.timeQuantumStatus) {
      // 对勾选是否第一次判断
      if (this.selectStatus) { //第一次不符合条件直接赋值，符合则遍历添加
        if (param[0].same !== '0') {
          this.selectData = this.dataSet.filter(
            value => (value.same === param[0].same) && (value.checked = true)
          );
        } else {
          this.selectData = param;
        }
        this.selectStatus = false;
        this.selectDataOld = this.selectData;
      } else {//若非首次勾选，先计算本次是添加还是删除,并找出变动数据进行处理
        const oldSet = new Set(this.selectDataOld);
        const paramSet = new Set(param);
        const addStatus = (param.length > this.selectDataOld.length);
        let minus = addStatus ? (param.filter(value => !oldSet.has(value))) : (this.selectDataOld.filter(value => !paramSet.has(value)));
        this.selectDataOld = param;
        this.selectData = param;
        //若是添加，则遍历数据找寻其余符合条件添加
        addStatus && minus[0].same !== '0' && this.dataSet.forEach(
          value => {
            if (minus[0].same === value.same && !value.checked) {
              value.checked = true;
              this.selectData.push(value);
            }
          }
        );
      }
    } else {
      this.selectData = param;
    }

  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Update': {
        this.btnUpdate();
      }
        break;
      case '1': {

      }
        break;
      default: {
        this.nn.warning('提示消息', '按钮未定义');
      }
    }
  }

  /**
   * 修改点击
   */
  btnUpdate(): void {
    if (this.selectData.length == 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }


    this.nm.create({
      nzTitle: '运单载重标记查询>修改',
      nzContent: this.loadMark,
      nzMaskClosable: false,
      nzOnOk: () => this.updateRequest()
    }).afterClose.subscribe(value => {
      this.selectedValue = '';
      this.selectedValueValidateStatus = '';
      this.selectData = [];
    });
  }

  /**
   * 修改请求
   */
  updateRequest(): Promise<any> {
    if (!this.selectedValue) {
      this.selectedValueValidateStatus = 'error';
      this.nn.warning('提示消息', '请选择载重标记后操作!');
      return new Promise<any>((resolve, reject) => reject(false));
    } else {
      this.selectedValueValidateStatus = '';
    }
    const url = TRANS_URLS.updatewayBillsByCondition;
    const param: any = {tWaybillModels: []};
    this.selectData.forEach(
      value => param.tWaybillModels.push({rowid: value.rowid, loadType: this.selectedValue})
    );
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '修改成功！');
          this.listSearch({page: 1, length: this.pageSize});
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 获取静态集值
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

}
