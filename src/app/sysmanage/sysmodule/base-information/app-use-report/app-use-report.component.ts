import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NzModalService, NzNotificationService} from "ng-zorro-antd";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {urls} from "../../../../common/model/url";
import {format} from 'date-fns';
import {TplButtonsService} from "../../../../components/tpl-buttons/tpl-buttons.service";
import {Utils} from "../../../../common/util/utils";
import {TRANS_URLS} from "../../../../common/model/trans-urls";
import {HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-app-use-report',
  templateUrl: './app-use-report.component.html',
  styleUrls: ['./app-use-report.component.css']
})
export class AppUseReportComponent implements OnInit {

  listLoading: boolean = false;
  validateForm: FormGroup;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tempSearchParam: any;  //列表数据缓存
  dataSet: Array<any> = []; // 表单数据
  selectData: Array<any> = [];
  num: number = 0;
  startDate: string;
  endDate: string;
  StartTime: string; //搜索日期
  EndTime: string;
  reqdata:any ={};


  constructor(private http1: HttpClient, private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private tplbtnService: TplButtonsService) {
  }

  ngOnInit() {
    let date = new Date();
    this.endDate = format(date, 'YYYY-MM-DD HH:mm:ss');
    this.startDate = format(new Date(date.setMonth(date.getMonth() - 1)), 'YYYY-MM-DD HH:mm:ss');

    this.validateForm = new FormGroup({
      chooseTime: new FormControl('', [])
    });
    this.tplbtnService.formReset.subscribe((data: any) => {
      this.validateForm.reset();
    });
    this.listSearch({page: 1, length: this.pageSize});

  }


  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    let time = this.validateForm.value.chooseTime;
    this.StartTime = time && time[0] instanceof Date ? format(time[0], 'YYYY-MM-DD HH:mm:ss') : '';
    this.EndTime = time && time[1] instanceof Date ? format(time[1], 'YYYY-MM-DD HH:mm:ss') : '';
    data.queryStartTime = this.StartTime || this.startDate;
    data.queryEndTime = this.EndTime || this.endDate;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.num = 0;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getLogLoginNum;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
          this.dataSet.map(item => {
            this.num += Number(item.loginNum)
          })
        }
      }
    );
  }

  btnClick(button: any) {
    switch (button.buttonId) {
      case "Export" :
        this.out();
        break;
    }
  }

  out() {

    //   data['queryStartTime'] =  this.StartTime || this.startDate;
    //   data['queryEndTime'] = this.EndTime || this.endDate;

    let url: any = urls.exportLoginNum + `?queryStartTime=${this.StartTime || this.startDate}&queryEndTime=${this.EndTime || this.endDate}`;

    this.http1.get(url, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `APP登录次数报表.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    })

  }

  selectlist(data) {
    this.selectData = data;
  }

}
