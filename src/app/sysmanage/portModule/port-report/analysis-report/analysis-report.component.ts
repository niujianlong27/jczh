import {Component, OnInit} from '@angular/core';
import {planUrl} from '@model/planUrls';
import {HttpUtilService} from '@service/http-util.service';
import {portUrl} from '@model/portUrl';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.css']
})
export class AnalysisReportComponent implements OnInit {

  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  buttonId: string;

  searchTmp: any;//搜索框缓存

  constructor(
    private http: HttpUtilService,
    private angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any): void {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.listLoading = true;
    this.searchTmp = param;
    this.getListSearch(param);
  }

  /**
   * 查询请求
   * @param data
   */
  getListSearch(data: any): void {
    const url = planUrl.getList;
    this.http.post(url, data).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );

  }

  /**
   * 点击事件
   * @param param
   */
  btnClick(param) {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Export': {
        this.btnExport();
      }
        break;
    }
  }

  /**
   * 点击导出
   */
  btnExport() {
    this.angularHttp.post(portUrl.timeExport,
      {
        formId: 'form_boat_analysis_report',
        gridId: 'grid1',
        ...this.searchTmp
      },
      {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `锚地、在泊、作业时长分析报表.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }
}
