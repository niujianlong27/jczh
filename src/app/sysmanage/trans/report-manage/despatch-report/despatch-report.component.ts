import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormControl, FormGroup} from '@angular/forms';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {Utils} from '../../../../common/util/utils';
import {EChartOption} from 'echarts';
import {NzMessageService} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";

/**
 * Title: despatch-report.component.ts
 * Description: 发运量报表
 * Created: pengzitong 2019/2/26
 * Modified:
 */
@Component({
  selector: 'app-despatch-report',
  templateUrl: './despatch-report.component.html',
  styleUrls: ['./despatch-report.component.css']
})
export class DespatchReportComponent implements OnInit {
  validateForm: FormGroup;
  options: any;
  tabIndex: any = 0;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  pageSize1: any = 30;
  pageSize2: any = 30;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPage1: any = 0;
  totalPage2: any = 0;
  updateData1: any = [];
  updateData2: any = [];
  typeList: any = [];
  dataList: any = [];
  canbtn:boolean = true;
  // loadingOpts:any = {
  //   text: 'loading',
  //   color: '#c23531',
  //   textColor: '#000',
  //   maskColor: 'rgba(0, 0, 0, 0.8)',
  //   zlevel: 0
  // }
  // @ViewChild('echart') echart;
  ehcart: any;

  searchFormHidden: boolean = false;

  showloading: boolean = false;
  selectedLength: any = 0;
  chartOption: EChartOption;
  height: number; //自适应高度
  reqData:any;//查询条件缓存
  shipmentTotal:number = 0;
  constructor(
    private http: HttpUtilService,
    private tplbtnService: TplButtonsService,
    private msg: NzMessageService,
    private http1: HttpClient
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit() {

    this.validateForm = new FormGroup({
      chooseTime: new FormControl('', [])
    });

    this.tplbtnService.formReset.subscribe((data: any) => {
      this.validateForm.reset();
    });

    this.tplbtnService.collaspedSearch.subscribe((data: any) => {
      this.searchFormHidden = data.searchFormHidden;
    });

    // this.setOptions(this.typeList,this.dataList);
    this.listSearch(this.tabIndex == 0 ? {page: 1, length: this.pageSize1} : {page: 1, length: this.pageSize2});

  }

  /**
   * 重置
   * @param data
   */
  reset(data: any) {
    this.validateForm.reset();
    // this.lineName = undefined;
  };

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
    this.canbtn = true;
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    // let time = this.validateForm.value.chooseTime;
    // data.beginDate = time && time[0] instanceof Date ? Utils.dateFormat(time[0],'yyyy-MM-dd'):'';
    // data.endDate = time && time[1] instanceof Date ? Utils.dateFormat(time[1],'yyyy-MM-dd'):'';

    this.getData(data, this.tabIndex);
  }

  chartInit(chart: any) {
    this.ehcart = chart;
    this.ehcart.showLoading('default', {
        text: 'loading',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255,0.8)',
        zlevel: 100000000
      }
    );
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    // console.log(data.buttonId);
    switch (data.buttonId) {
      case "Export" :
        this.export();
        break;
      default:
        this.msg.error("按钮未绑定方法");

    }
  }

  //导出功能
  export() {
    //按区域或者按品种
    let url: any = this.tabIndex == 0 ? TRANS_URLS.exportShipmentByCity : TRANS_URLS.exportShipmentByType;
    let fileName = this.tabIndex == 0 ? '发运量报表(按区域).xlsx' :'发运量报表(按品种).xlsx'
    this.http1.post(url,this.reqData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    })
  }

  /**
   * 渲染数据
   * @param type
   * @param data
   */
  setOptions(type, data) {
    this.options = {
      title: {
        text: '发运量报表统计图',
        subtext: '',
        x: 'center',
        y: '40pxpx'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 50,
        bottom: 20,
        data: type
      },
      series: [
        {
          name: '品种',
          type: 'pie',
          radius: '55%',
          center: ['50%', '55%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   * 获取数据
   * @param data
   * @param index
   */
  getData(data: any, index?) {
    let url = index == 1 ? TRANS_URLS.getShipmentReportByType : TRANS_URLS.getShipmentReportByCity;

    index == 1 ? this.listLoading2 = true : this.listLoading1 = true;
    this.showloading = true;
    this.reqData = {...data};
    this.http.post(url, data).then((res: any) => {
      index == 1 ? this.listLoading2 = false : this.listLoading1 = false;
      this.showloading = false;
      if (res.success) {
        this.canbtn = false;
        let data = res.data.data && res.data.data.data || [];
        if (index == 1) {
          // this.listLoading2 = false;
          this.dataSet2 = data;
          this.totalPage2 = res.data.data && res.data.data.total || 0;
        } else {
          // this.listLoading1 = false;
          this.dataSet1 = data;
          this.totalPage1 = res.data.data && res.data.data.total || 0;
        }
        // index == 1 ? this.listLoading2 = false : this.listLoading1 = false;
        // index == 1 ? this.dataSet2 = data : this.dataSet1 = data;
        // index == 1 ? this.totalPage2 =  res.data.data && res.data.data.total || 0 :this.totalPage1 =  res.data.data && res.data.data.total || 0;
        this.typeList = [];
        this.dataList = [];
        data.forEach(item => {
          this.typeList.push(index == 1 ? item.productType : item.cityName);
          this.dataList.push({
            name: index == 1 ? item.productType : item.cityName,
            value: item.shipment
          })
        });
        this.setOptions(this.typeList, this.dataList);
      }
    })
  }

  /**
   * 类别改变
   * @param dex
   */
  tabResultFun(dex){
    if(this.tabIndex !== dex){
      this.shipmentTotal = 0;
    }
    this.tabIndex = dex;
    this.getData(dex == 0 ? {page: 1, length: this.pageSize1} : {page: 1, length: this.pageSize2}, dex);
  };

  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult1(data){
    this.updateData1 = data;
    this.shipmentTotal = this.updateData1.map((x:any)=>x.shipment).reduce((x:string,y:string)=> Number(x) + Number(y),0);
  }

  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult2(data){
    this.updateData2 = data;
    this.shipmentTotal = this.updateData2.map((x:any)=>x.shipment).reduce((x:string,y:string)=> Number(x) + Number(y),0);
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getData({ page: page, length: this.pageSize1 },this.tabIndex);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getData({ page: 1, length: this.pageSize1 },this.tabIndex);
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getData({ page: page, length: this.pageSize1 },this.tabIndex);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getData({ page: 1, length: this.pageSize2 },this.tabIndex);
  }

  currentTableHeightFun(height: number) {

  }
}
