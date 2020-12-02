import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {DISPURL} from '../../../../common/model/dispUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {FormBuilder, Validators} from '@angular/forms';

declare var XLSX: any;

@Component({
  selector: 'app-query-cars',
  templateUrl: './query-cars.component.html',
  styleUrls: ['./query-cars.component.css'],
  providers: [
    {
      provide: DatePipe,
      useFactory: (locale) => new DatePipe('en-US'),
      deps: []
    },
  ],
})
export class QueryCarsComponent implements OnInit {

  constructor(private http: HttpUtilService, private modal: NzModalService, private datePipe: DatePipe, private info: UserinfoService, private nn: NzNotificationService, private fb: FormBuilder) {
    this.interval = setInterval(() => {
      this.listSearch(this.searchParam);
    }, 1000 * 60);
  }


  searchData: any;  // 存储查询的数据
  listLoading = true;
  dataSet: any;
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数

  isVisible = false; // 运输过程弹框显示控制
  vehicleIsVisible = false; // 车辆轨迹弹框
  modalTitle: string; // 弹框的标题
  tplModal: NzModalRef;  // 提示弹框
  carNum = 0;
  dataSet1: Array<any> = [];
  tabs: Array<any> = [];
  // sum:number = 0;
  interval: any;
  searchFormData: any = [];
  httpInfo: any;
  taskId: string;

  finishVisible = false; // 完成出厂弹窗显示控制
  finishCon: string; // 完成出厂弹窗文字内容
  selectedData: string;

  private status: string;

  searchParam: any;

  reason: any;

  updatedata: any = [];
  flag = false;

  columns: any[] = [
    {title: '预报号/发运号', index: 'dealId'},
    {title: '供应商/客户', index: 'vendor'},
    {title: '车牌号', index: 'truckNo'},
    {title: '司机', index: 'driverName'},
    {title: '车型', index: 'truckKindName'},
    {title: '品种', index: 'kindName'},
    {title: '毛重', index: 'grassWeight'},
    {title: '皮重', index: 'tareWeight'},
    {title: '净重', index: 'netWeight'},
    {title: '优先级', index: 'queueClassName'},
    {title: '大门', index: 'gateName'},
    {title: '状态', index: 'statusName'},
    {title: '入厂时间', index: 'entryTime'},
  ];

  // vehicleHandleCancel(): void {
  //   this.lineArr=[];
  //   this.marker.stopMove();
  //   this.vehicleIsVisible=false;
  // }
  isCloseVisible = false;


  // 当tab页改变时自动查询当前页面的数据
  validateForm: any;

  ngOnInit() {
    this.getCodeset();
    this.validateForm = this.fb.group({

      reason: [null, [Validators.required]],



    });
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);

  }

  listSearch(data: any) {

    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.bk2 = 'true'; // 给后台一个判断条件
    this.searchData = data;
    this.listLoading = true;
    // this.getNumber();
    if (this.carNum === 1) {
      data.statusType = 0;
    } else if (this.carNum === 2) {
      data.statusType = 1;
    } else if (this.carNum === 3) {
      data.statusType = 2;
    } else if (this.carNum === 4) {
      data.statusType = 3;
    } else if (this.carNum === 5) {
      data.statusType = 4;
    } else if (this.carNum === 6) {
      data.statusType = 5;
    }
    this.getListSearch(DISPURL.GETQUERYCARSURL, data);
    this.getNumber(data);
    this.searchParam = data;
  }

  getListSearch(url: string, param: any): void {
    // console.log(this.tabs[1]);
    // 获取列表
    this.listLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
        // console.log(this.carNum);
      }
    });


  }


  updateDataResult(data: any) {
    this.httpInfo = {url: DISPURL.GETVEHICLETRAJECTORY, param: data[0]};
  };

  modalShow(data: any) {
    if (data) {
      this.vehicleIsVisible = false;
    }
  }

  // 车辆轨迹按钮
  btnUpdate(data: any): void {


    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作!'
      });
      this.destroyTplModal();
      return;
    } else if (data.data.length > 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作!'
      });
      this.destroyTplModal();
      return;
    } else {
      this.modalTitle = '车辆轨迹';
      this.vehicleIsVisible = true;
      // this.getMap(data.data[0]);
    }


  }


  process(data: any): void {
    // console.log(data.type.buttonId);
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作!'
      });
      this.destroyTplModal();
      return;
    } else if (data.data.length > 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作!'
      });
      this.destroyTplModal();
      return;
    } else {
      this.isVisible = true;
      this.modalTitle = '运输过程:';
      // console.log(data.data[0].taskId);
      this.taskId = data.data[0].taskId;
      this.getTranProcess(DISPURL.GETTRANSTASKLISTBYTASKID);
    }
  }

  finish(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作!'
      });
      this.destroyTplModal();
      return;
    } else if (data.data.length > 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作!'
      });
      this.destroyTplModal();
      return;
    } else {
      console.log(data.data[0]);
      if (data.data[0].status != '40') {
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '请选择已入厂的数据进行操作!'
        });
        this.destroyTplModal();
        return;
      }
      this.modalTitle = '提示信息';
      this.finishVisible = true;
      this.finishCon = '确定要操作此记录?';
      this.selectedData = data.data[0].taskId;
      this.status = 'finish';
    }
  }

// 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.finishVisible = true;
    this.finishCon = `${data}`;
  }

  // 完成出厂
  finishData() {
    const params = {url: '', data: {taskId: this.selectedData}, method: 'POST'};
    params.url = DISPURL.MANUALUPDATESTATUS;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = '';
          this.listSearch(this.searchParam);
          this.nn.success('提示消息', '完成出厂成功！');
        } else {
          this.nn.error('提示消息', '完成出厂失败！');
        }
      }
    );
  }

  // 完成出厂框确认
  modalConfirmResult(data: any): void {
    if ('ok' === data.type) {
      if ('finish' === this.status) {
        this.finishData();
        this.status = '';
      }
    }
    this.finishVisible = false;
  }


  getTranProcess(url: string): void { // 获取列表
    this.listLoading = true;
    this.http.post(url, {taskId: this.taskId, enterpriseId: this.info.APPINFO.USER.companyId}).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet1 = res.data.data;
      }
    });
  }

  // 小代码
  getCodeset(): void {

    const tab: any = {};
    tab.itemCname = '全部';
    tab.itemCode = 'root';
    tab.itemCount = 0;
    this.tabs.push(tab);
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId: this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            // debugger;
            if (element.codesetCode == 'disp.queueStatus') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              item.itemCount = 0;
              this.tabs.push(item);
              // console.log(this.tabs);
            }

          });
          this.listSearch({page: 1, length: this.pageSize});
          // this.getNumber({ page: 1, length: this.pageSize });
        }
      }
    );
  }

  getNumber(data: any): void {
    let sum = 0;
    this.http.post(DISPURL.GETQUERYCARSNUMURL, data).then(
      (res: any) => {
        if (res.success) {
          if (res.data.data.length === 0) {
            this.tabs.forEach(element => {
              element.itemCount = 0;
            });
          } else if (res.data.data.length > 0) {
            for (const reElement in this.tabs) {
              for (const element in res.data.data) {
                if (this.tabs[reElement].itemCode === res.data.data[element].statusType) {
                  if (res.data.data[element].ct !== null) {
                    this.tabs[reElement].itemCount = res.data.data[element].ct;
                    sum += Number(res.data.data[element].ct);
                  }
                  break;
                } else {
                  this.tabs[reElement].itemCount = 0;
                }
              }
            }
          }
          this.tabs[0].itemCount = sum;
        }
      }
    );
  }


  btnAdd(data: any): void {

    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中一条或多条后进行操作!'
      });
      this.destroyTplModal();
      return;
    }
    const filename = '车辆查询' + this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') + '.xlsx';
    const exportData = [this.columns.map(item => item.title)];
    data.data.forEach(d => exportData.push(this.columns.map(c => d[c.index])));

    const ws_name = 'SheetJS';
    const wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }

  selectChange(data: any): void {
    this.searchFormData.map((x: any) => {
      x.value1 = '';
      x.value2 = '';
      x.checked = false;
    });
    this.listSearch1({page: 1, length: this.pageSize});
  }

  listSearch1(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.bk2 = 'true';
    this.listLoading = true;
    if (this.carNum === 0) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = null;
    } else if (this.carNum === 1) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 0;
    } else if (this.carNum === 2) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 1;
    } else if (this.carNum === 3) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 2;
    } else if (this.carNum === 4) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 3;
    } else if (this.carNum === 5) {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 4;
    } else {
      if (this.searchData.queryParameterList) {
        data = this.searchData;
      }
      data.statusType = 5;
    }
    this.getListSearch(DISPURL.GETQUERYCARSURL, data);
    this.getNumber(data);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  destroyTplModal(): void {// 提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  searchDataFun(data: any) {
    // console.log(data);
    this.searchFormData = data;
  }

  btnClick(data: any) {
    console.log(data);
    const buttonId = data.type.buttonId;
    switch (buttonId) {
      case 'process':
        this.process(data);
        break;
      case 'Update':
        this.btnUpdate(data);
        break;
      case 'CloseTask':
        this.btnClose(data);
        break;
      case 'Add':
        this.btnAdd(data);
        break;
      case 'finish':
        this.finish(data);
        break;
    }
  }

  btnClose(data: any) {
    if (data.data.length !== 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据',
      });
      return;
    }
    this.isCloseVisible = true;

  }

  CloseCancel() {
    this.isCloseVisible = false;
  }

  CloseConfirm() {
    console.log(this.updatedata);
    console.log(this.info.APPINFO);
    console.log(this.reason);
    const param = this.updatedata[0];
    param.bk5 = this.validateForm.get('reason').value;
    // debugger;
    if (param.bk5 === null || param.bk5 === '' || param.bk5 === undefined) {
      this.tplModal = this.modal.error({
        nzTitle: '提示信息',
        nzContent: '请填写关闭任务的原因'
      });
      return;
    }
    if (param.bk5.length > 50) {
      this.tplModal = this.modal.error({
        nzTitle: '提示信息',
        nzContent: '您输入的原因超长了'
      });
      return;
    }
    param.operator = this.info.APPINFO.USER.name;
    this.http.post(DISPURL.CLOSETASK, param).then(res => {
      console.log(param);
      if (res.success) {
        this.tplModal = this.modal.success({
          nzTitle: '提示信息',
          nzContent: res.data.data
        });
        console.log(this.validateForm);
        this.validateForm.reset();
        this.isCloseVisible = false;
        this.listSearch(this.searchParam);
      }
    });
  }

  updateDataResult1(data: any) {
    this.updatedata = data;
  }
}
