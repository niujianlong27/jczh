import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {Utils} from '../../../../common/util/utils';
import {HttpClient} from "@angular/common/http";

/**
 * Title: split-cargo-trace.component.ts
 * Description:
 * Created: pengzitong 2019/2/22
 * Modified:
 */
@Component({
  selector: 'app-split-cargo-trace',
  templateUrl: './split-cargo-trace.component.html',
  styleUrls: ['./split-cargo-trace.component.css']
})
export class SplitCargoTraceComponent implements OnInit {
  // paramCity:any;
  // paramCar:any;
  // cityArr:any = [
  //   {name:1,value:1}
  // ];
  // cityOpt:any = [
  //   {value:'1',name:'1'}
  // ]
  reqdata: any;
  lineName: any;
  lineArr: any = [];

  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1: Number = 30;

  listLoading2: boolean = false;
  dataSet2: any = [];
  totalPages2: Number = 0;
  pageSize2: Number = 30;

  btnDis: any = {
    'Save': true
  };

  listLoading3: boolean = false;
  dataSet3: any = [{}];
  totalPages3: Number = 0;
  pageSize3: Number = 30;

  updateData: any = [];
  tempSearchParam: any;
  columnsArr: any;

  headerArr: any = [];
  headerArr2: any = [];
  isCheckBox2: boolean = false;

  updateData2: any = [];
  updateData3: any = [];
  columnsArr2: any;

  gridOperateStatus: boolean = false;
  validateForm: FormGroup;
  buttonId: any;
  tplModal: NzModalRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  modalTitle: any = '省内分货 > 详情';

  searchFormHidden: boolean = false;
  gridOneHeight: string;
  gridTwoHeight: string;
  constructor(
    private nm: NzModalService,
    private fb: FormBuilder,
    private anhttp: HttpClient,
    private http: HttpUtilService,
    private tplbtnService: TplButtonsService
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }
  /**
   * 是否显示查询条件
   * @param data
   */
  btnSearch(data: any) {
    this.searchFormHidden = data;
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {

    let url = TRANS_URLS.cargoTraceList;
    let param: any = data;
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;

    this.dataSet1 = [];
    // param.cargoDate = time instanceof Date ? Utils.dateFormat(time,'yyyy-MM-dd'):'';
    this.listLoading1 = true;
    this.listLoading2 = true;
    this.reqdata = {...data};
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      this.listLoading2 = false;
      if (res.success) {
        this.handelData(res.data.data || []);
      }
    })

  }

  /**
   * 处理数据
   * @param data
   */
  handelData(data): boolean {
    this.headerArr = [];
    this.dataSet1 = [];
    this.dataSet2 = [];
    this.headerArr2 = [];
    this.gridOperateStatus = false;
    if (data.length < 1) {
      return false;
    }
    let obj1: any = {};
    data.forEach(item => {
      //解析数据生成列表1表头和列表1数据
      let obj: any = {};
      item.deliveryNoticeModels.forEach(data => {
        let tempArr: any = [];
        this.headerArr.forEach(h => {
          tempArr.push(h.colCname);
        });
        if (tempArr.indexOf(data.varieties) < 0) {
          this.headerArr.push({
            colCname: data.varieties,
            colEname: data.varieties,
            visible: 'XSBJ10'
          });
        }

        obj['城市'] = item.city;
        obj['区名'] = item.endPoint;
        obj['总计'] = item.allWeight || '';
        obj[data.varieties] = data.inventory;
        obj[`计划(${data.varieties})`] = data.amountPlanning;

      })
      this.dataSet1.push(obj);

      //根据城市去重，汇总重量生成列表2数据
      if (!obj1[item.city]) {
        this.dataSet2.push({
          city: item.city,
          carInfo: item.vehicleInformation,
          goodsInfo: item.cargoInformation,
          cargoInfo: item.splitFreightinformation
          // totalWeight:item.allWeight,
          // remark:item.remark
        });
        obj1[item.city] = true;
      }
    });

    //列表1表头排序
    let t;
    for (let i = 0; i < this.headerArr.length; i++) {
      for (let j = i + 1; j < this.headerArr.length; j++) {
        if (this.headerArr[i].colEname > this.headerArr[j].colEname) {
          t = this.headerArr[i];
          this.headerArr[i] = this.headerArr[j];
          this.headerArr[j] = t;
        }
      }
    }
    ;

    let tempHeader: any = [];
    this.headerArr.forEach(h1 => {
      tempHeader.push(h1);
      tempHeader.push({
        colCname: `计划(${h1.colCname})`,
        colEname: `计划(${h1.colEname})`,
        visible: 'XSBJ10'
      })
    });

    this.headerArr = [
      {colCname: '城市', colEname: '城市', visible: 'XSBJ10'},
      {colCname: '区名', colEname: '区名', visible: 'XSBJ10'},
      ...tempHeader,
      {colCname: '总计', colEname: '总计', visible: 'XSBJ10'}
    ];


    //列表2表头
    this.isCheckBox2 = true;
    this.headerArr2 = [
      {
        "colEname": "city",
        "colCname": "城市",
        "visible": "XSBJ10",
        "edit": "BJBJ20",
      },
      {
        "colCname": '车辆信息',
        "colEname": 'carInfo',
        "visible": 'XSBJ10'
      },
      {
        "colCname": '货物信息',
        "colEname": 'goodsInfo',
        "visible": 'XSBJ10'
      },
      {
        "colEname": "cargoInfo",
        "colCname": "分货信息",
        "visible": "XSBJ10",
        "edit": "BJBJ20",
      }
    ];
    this.gridOperateStatus = true;
    this.dataSet2 = [...this.dataSet2];
    return true;
  }

  getList(data: any) {

  }

  getList2(data: any) {

  }

  getList3(data: any) {

  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data: any): void {
    this.updateData = data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  /**
   * 当前选中数据发生改变2
   * @param data
   */
  updateDataResult2(data: any): void {
    this.updateData2 = data;
    this.btnDis = this.updateData2.length > 0 ? {} : {
      'Save': true
    };
  }

  /**
   * 当前选中数据发生改变3
   * @param data
   */
  updateDataResult3(data: any): void {
    this.updateData3 = data;
  }

  /**
   * 保存表头2
   * @param data
   */
  userColumnsEmit2(data: any): void {
    this.headerArr2 = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Save':
        this.btnSave();
        break;
      case 'export':
        this.export();
        break;
      default:
        break;
    }
  }

  /**
   * 保存
   */
  btnSave() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "INVALID") {
      return;
    }
  }

  export() { //导出
    let url: any = TRANS_URLS.splitProdExport;
    this.anhttp.post(url, this.reqdata, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `调度跟踪.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  /**
   * 详情
   * @param data
   * @param index
   */
  showDetail(data: any, index: any) {
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  /**
   * 弹窗取消
   */
  handleCancel(): void {
    this.tplModal.destroy();

  }

  /**
   * 导入弹窗确定
   */
  importConfirm(): void {
    this.tplModal.destroy();

  }


  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.listSearch({page: page, length: this.pageSize1});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2});
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex3(page: any): void {
    this.getList3({page: page, length: this.pageSize3});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize3(pageSize: any): void {
    this.pageSize3 = pageSize;
    this.getList3({page: 1, length: this.pageSize3});
  }
  searchDataReturn(data:any){
    let myData = new Date();
    console.log(1111)
    let b =data.filter(x=>x.parameter==='cargoDate')
    b[0].value1 = myData.toLocaleDateString();
  }
}
