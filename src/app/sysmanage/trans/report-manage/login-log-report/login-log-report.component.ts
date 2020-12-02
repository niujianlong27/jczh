import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzMessageService, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {TRANS_URLS} from "../../../../common/model/trans-urls";
import {format} from 'date-fns';
import {TplButtonsService} from "../../../../components/tpl-buttons/tpl-buttons.service";
import {HttpClient} from "@angular/common/http";

/**
 * Title: login-log-report.component.ts
 * Description: 用户登录日志报表
 * Created: pengzitong 2019/2/26
 * Modified:
 */
@Component({
  selector: 'app-login-log-report',
  templateUrl: './login-log-report.component.html',
  styleUrls: ['./login-log-report.component.css']
})

export class LoginLogReportComponent implements OnInit {

  listLoading: boolean = false;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tempSearchParam: any;  //列表数据缓存
  dataSet: Array<any> = []; // 表单数据
  selectData: Array<any> = [];
  validateForm: FormGroup;
  endDate: string;
  startDate: string;
  StartTime: string; //搜索日期
  EndTime: string;
  searchFormHidden:boolean = false;
  reqData:any ;
  constructor(private http: HttpUtilService,
              private fb: FormBuilder,
              private nzModal: NzModalService,
              private nzMess: NzNotificationService,
              private tplbtnService: TplButtonsService,
              private http1: HttpClient,
              private msg: NzMessageService,) {
  }

  ngOnInit() {

    // let date = new Date();
    // this.endDate = format(date, 'YYYY-MM-DD HH:mm:ss');
    // this.startDate = format(new Date(date.setMonth(date.getMonth() - 1)), 'YYYY-MM-DD HH:mm:ss');
    // this.validateForm = this.fb.group({
    //   chooseTime: [null, [Validators.required]],
    // });

    // this.tplbtnService.formReset.subscribe((data: any) => {
    //   this.validateForm.reset();
    // });

    this.listSearch({page: 1, length: this.pageSize})
  }


  // 列表查询
  listSearch(data: any) {

    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    //
    //  if (!this.validateForm.value.chooseTime){
    //    return;
    //  }
    // }
    // let time = this.validateForm.value.chooseTime;
    // let StartTime = time && time[0] instanceof Date ? format(time[0], 'YYYY-MM-DD HH:mm:ss') : '';
    // let EndTime = time && time[1] instanceof Date ? format(time[1], 'YYYY-MM-DD HH:mm:ss') : '';
    // data.startTime = StartTime || this.startDate;
    // data.endTime = EndTime || this.endDate;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = TRANS_URLS.arrivalReport;
    params.data = data;
    this.reqData = {...data};
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }


  /**
   * 重置
   * @param data
   */
  reset(data:any){
    this.validateForm.reset();
  };

  /**
   * 是否显示查询条件
   * @param data
   */
  btnSearch(data:any){
    this.searchFormHidden = data;
  }

  btnClick(button: any) {
    // console.log(button.buttonId)

    switch (button.buttonId) {
      case "export" :
        this.out();
        break;
      default:
        this.msg.error("按钮未绑定方法");

    }
  }

  out() {
    let url: any = TRANS_URLS.exportArrivalReport;
    this.http1.post(url,this.reqData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = '用户登录日志报表.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    })
  }

  selectlist(data) {
    this.selectData = data;
  }


}
