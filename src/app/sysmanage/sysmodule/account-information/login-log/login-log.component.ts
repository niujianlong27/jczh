import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {NzModalService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  searchData: any;  //存储查询的数据
  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测


  constructor(private httpUtilService: HttpUtilService, private info: UserinfoService) {
  }

  ngOnInit() {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}logLogin/getLogLogin`;
    params.data = data;
    this.httpUtilService.request(params).then(
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
    this.searchData = data;
    this.listLoading = true;
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.getListSearch(data);
  }

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

}
