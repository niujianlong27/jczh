import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';
import {HttpClient} from '@angular/common/http';
import {urls} from '@model/url';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-userlogin-statistics',
  templateUrl: './userlogin-statistics.component.html',
  styleUrls: ['./userlogin-statistics.component.css']
})
export class UserloginStatisticsComponent implements OnInit {
  tempSearchParam: any;
  times:any = 0;
  businessModuleArr:Array<any> =[];

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private fb: FormBuilder,
              private cm: CommonService) {
  }

  ngOnInit() {
    this.listSearch({});
  }

  listSearch(data: any) {
    this.getList1(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = urls.selectCount;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.times =res.data && res.data.data || 0;
      }else{
        this.times = 0;
      }
    });
  }
  reset(data){
   this.times = 0
  }

  /**
   * 查询数据返回
   * @param {Array<any>} data
   */
  searchDataReturn(data: Array<any>) {
    data.forEach(item => {
      if (item.parameter === 'loginType') {
        item.queryBoxType = 'select';
        item.apiParameter = {optionList:[]}
      }
    });

    let url = urls.static;
    if (!this.businessModuleArr[0]) {
      this.http.post(url, {valueSetCode: 'DLLX'}).then((res: any) => {
        if (res.success) {
          this.businessModuleArr = res.data.data && res.data.data.data || [];
         let dataArr =  this.businessModuleArr.filter(
            res => {
              return res.value != 'DLLX50' && res.value != 'DLLX40' && res.value != 'DLLX12'
            }
          );
          data.forEach(
            res => {
              if (res.parameter === 'loginType' && res.queryBoxType === 'select') {
                Array.prototype.push.apply(res.apiParameter.optionList, dataArr);
                res.value2 = 'DLLX60';
                res.value1 = "全部"
              }
            }
          );

        }
      });
    } else {
      data.forEach(
        res => {
          if (res.parameter === 'loginType' && res.queryBoxType === 'select') {
            Array.prototype.push.apply(res.apiParameter.optionList, this.businessModuleArr);
          }
        }
      );
    }

  }

}
