import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {Utils} from '../../../../common/util/utils';
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd";

/**
 * Title: trace-report.component.ts
 * Description:运输跟踪报表
 * Created: pengzitong 2019/2/26
 * Modified:
 */
@Component({
  selector: 'app-trace-report',
  templateUrl: './trace-report.component.html',
  styleUrls: ['./trace-report.component.css']
})
export class TraceReportComponent implements OnInit {
  lineName:any;
  lineArr:Array<any> = [];
  validateForm:FormGroup;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;
  updateData1:any = [];
  reqData:any;//查询条件信息
  canbtn:boolean = true;

  searchFormHidden:boolean = false;

  constructor(
    private http:HttpUtilService,
    private tplbtnService:TplButtonsService,
    private http1: HttpClient,
    private msg: NzMessageService,

  ) { }

  /**
   * 初始化
   */
  ngOnInit() {
    // this.validateForm = new FormGroup({
    //   chooseTime: new FormControl('',[])
    // });
    //
    // this.tplbtnService.formReset.subscribe((data:any)=>{
    //   this.validateForm.reset();
    //   this.lineName = undefined;
    // });
    //
    // this.tplbtnService.collaspedSearch.subscribe((data:any)=>{
    //   this.searchFormHidden = data.searchFormHidden;
    // });

    this.listSearch({page:1,length:this.pageSize1});
  }

  /**
   * 重置
   * @param data
   */
  reset(data:any){
    this.validateForm.reset();
    this.lineName = undefined;
  };

  /**
   * 是否显示查询条件
   * @param data
   */
  btnSearch(data:any){
    this.searchFormHidden = data;
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    this.canbtn = true;
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    // let time = this.validateForm.value.chooseTime;
    // data.beginDate = time && time[0] instanceof Date ? Utils.dateFormat(time[0],'yyyy-MM-dd'):'';
    // data.  = time && time[1] instanceof Date ? Utils.dateFormat(time[1],'yyyy-MM-dd'):'';
    // data.lineName = this.lineName || '';
    this.getData(data);
  };

  /**
   * 获取数据解析显示
   * @param data
   */
  getData(data){
    let url = TRANS_URLS.traceReportList;
    this.dataSet1 = [];
    this.listLoading1 = true;
    this.reqData = {...data};
    this.http.post(url,data).then((res:any)=>{
      this.listLoading1 = false;
      if(res.success){
        this.canbtn = false;
        this.dataSet1 = res.data.data && res.data.data.page && res.data.data.page.data || [];
        this.totalPages1 = res.data.data && res.data.data.page && res.data.data.page.total || 0;
        let tempData = res.data.data && res.data.data.monthSum || [];
        let _dataArr:any = [];
        let _dataObj:any = {};
        console.log(this.dataSet1,tempData);
        tempData.forEach((item)=>{
          this.dataSet1.forEach((data,index)=>{
            // console.log(data.city,data.endPoint,data.tDate && data.tDate.slice(0,7));
            if(item.city == data.city && item.endPoint == data.endPoint && item.tDate == data.tDate.slice(0,7)){
              // console.log(item,index);

              _dataArr.push({item:item,index:index});
              let _item = item;
              item.replaceCheckBox = '月度汇总';
              _dataObj[`${item.city}${item.endPoint}${item.tDate}`] = {
                item:item,
                index:index
              }
            }
          })
        });
        console.log(_dataArr,_dataObj);
        let arr = Object.keys(_dataObj);
        console.log(arr)
        for(let i = arr.length - 1;i >= 0;i--){
          this.dataSet1.splice(_dataObj[arr[i]].index + 1,0,_dataObj[arr[i]].item);
        }

      }
    });

  }

  btnClick(data: any) {
    console.log(data.buttonId);
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
    let url: any = TRANS_URLS.exportTransTrack;
    this.http1.post(url,this.reqData, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = '运输跟踪报表.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    })
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData1 = data;
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.listSearch({ page: page, length: this.pageSize1 });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 查询数据返回
   * @param {Array<any>} data
   */
  searchDataReturn(data: Array<any>) {
    let url = TRANS_URLS.cargoTraceLine2;
    this.http.post(url,{}).then((res:any)=>{
      if(res.success){

        this.lineArr = res.data && res.data.data || [];
        this.lineArr.forEach(
          res=>{
            res.name = res.lineName;
            res.value = res.lineName;
          }
        )

        data.forEach(
          res=>{
            if (res.parameter === 'lineName'&& res.queryBoxType === 'select' ) {
              Array.prototype.push.apply(res.apiParameter.optionList,this.lineArr);
            }
          }
        )

      }
    })

  }

}
