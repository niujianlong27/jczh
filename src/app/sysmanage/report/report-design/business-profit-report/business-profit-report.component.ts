import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {localUrls} from '../../../../common/model/localUrls';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-business-profit-report',
  templateUrl: './business-profit-report.component.html',
  styleUrls: ['./business-profit-report.component.css']
})
export class BusinessProfitReportComponent implements OnInit {

  dataSet: Array<any> = []; // 主列表
  pageSize: number = 30; // 每页数量
  totalPage: number = 0; //数据总数
  listLoading: boolean = true; //加载状态
  searchData: any; //搜索缓存
  selectDataArray: Array<any> = []; //选择数据
  private buttonId: string;
  startValue: Date | null = null;
  endValue: Date | null = null;
  selectedValue: string; //查询下拉选中值
  selectedArray: Array<any> = [];

  //搜索缓存

  constructor(private http: HttpUtilService, private nm: NzModalService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    // this.getSegment();
  }

  /**
   * 搜索时间
   * @param {any} data
   */
  listSearch(data: any) {
    this.listLoading = true; //list加载
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getListSearch(data);
  }

  /**
   * 列表查询数据获取
   * @param {any} data
   */
  getListSearch(data: any): void {
    const params = {url: localUrls.selectBusProReport, data: data || {}, method: 'POST'};
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  /**
   * 列表选中数据
   * @param data
   */
  updateDataResult(data: any) {
    this.selectDataArray = data;
  }

  /**
   * 按钮点击事件
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Export': {
        this.exportExcel();
      }
        break;
    }
  }

  /**
   * excel导出
   */
  exportExcel(): void {
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认导出Excel？',
      nzOnOk: () => {
        return this.http.post(localUrls.busProExcel, this.searchData).then(
          res => {
            if (res.success) {
              window.open(res.data.data);
            }
          }
        );
      }
    });

  }

  /**
   * 业务板块查询
   */
  getSegment(): void {
    this.http.post(localUrls.getSegment, {}).then(
      res => {
        if (res.success) {
          this.selectedArray = res.data.data;
        }
      }
    );
  }

  /**
   * 搜索数据抛出
   * @param data
   */
  searchDataReturn(data: Array<any>) {
    this.http.post(localUrls.getSegment, {}).then(
      res => {
        if (res.success) {
          this.selectedArray = res.data.data;
          this.selectDataArray.forEach(
            res=>{
              res.name = res.segmentName;
              res.value = res.segmentName;
            }
          );

          data.forEach(
            res=>{
              if (res.parameter === 'lineName'&& res.queryBoxType === 'select' ) {
                Array.prototype.push.apply(res.apiParameter.optionList,this.selectedArray);
              }
            }
          )

        }
      }
    );
  }
}
