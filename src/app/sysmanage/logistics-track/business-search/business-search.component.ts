import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../common/services/http-util.service';//引入自定义封装的http,实现与后台服务器接口对接
import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment'; //引入环境配置
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';//引入ngzorro库的相关组件，从而实现弹窗，信息提示和文件上传功能
import {trackUrl} from '../../../common/model/trackUrl';

@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.css']
})
export class BusinessSearchComponent implements OnInit {

  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }

   // 列表查询数据获取
   getListSearch(data: any): void {
    // const params = {url: '', data: {}, method: 'POST'};
    // params.url = `${environment.baseUrl}formButton/selectFormButtonList`;
    // params.data = data;
    const url = trackUrl.selectBusinessSearchListByBoat;
    this.tempSearchParam = data;
    this.httpUtilService.post(url,data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }

}
