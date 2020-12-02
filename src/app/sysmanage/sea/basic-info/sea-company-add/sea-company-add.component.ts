import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sea-company-add',
  templateUrl: './sea-company-add.component.html',
  styleUrls: ['../../common/sea-common.css', './sea-company-add.component.css' ]
})
export class SeaCompanyAddComponent implements OnInit {

  page: Page = new Page();
  platPage: Page = new Page();

  // 主界面
  inqu: any = {};
  queryLoading: boolean = false;
  result: Array<any> = [];
  loading: boolean = false;

  // 选择/新增公司弹框
  inquCompany: any = {};
  companyIsVisible: boolean = false;
  companyData: Array<any> = [];
  companyLoading: boolean = false;
  insertLoading: boolean = false;

  status: Array<any> = [];
  bizScope: Array<any> = [];
  companyType: Array<any> = [];

  constructor(private http: HttpUtilService,
    private msg: NzMessageService, 
    private appInfo: UserinfoService,
    private codeset: CodesetService,
    private route: ActivatedRoute, 
    private router: Router, ) { }

  ngOnInit() {
    this.status = this.codeset.get('status');
    this.bizScope = this.codeset.get('bizScope');
    this.companyType = this.codeset.get('companyType');

    this.query();
  }

  /**
   * 分页查询方法
   */
  query() {
    this.queryLoading = true;
    this.http.post(SEA_URLS.getSeaCompany, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.result = res.data.data.data;
        this.page.total = res.data.data.total;

        this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(",") : []);
      }
      this.queryLoading = false;
    });
  }

  /**
   * 跳转到平台公司权限管理界面
   */
  toPlateCompanyManage(){
    this.router.navigate(['/system/systemSet/companyPermission']);
  }

  /**
   * 打开公司选择弹框
   */
  openCompanyModal(){
    this.companyIsVisible = true;
    this.queryCompany();
  }

  /**
   * c查询公司列表
   */
  queryCompany(){
    this.companyLoading = true;
    this.http.post(SEA_URLS.getSystemCompanyList, {queryParameterList: this.getQueryParam(), ...this.platPage.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.companyData = res.data.data.data;
        this.platPage.total = res.data.data.total;
      }
      this.companyLoading = false;
    });
  }

  getQueryParam(): Array<any>{
    const param = [{"parameter": "plateCompanyId", "query":"等于", "postQuery":"且", "value1": this.appInfo.APPINFO.USER.companyId}];
    if(this.inquCompany.companyName){
      param.push({"parameter": "companyName", "query":"包含", "postQuery":"且", "value1": this.inquCompany.companyName});
    }
    return param;
  }

  /**
   * 保存公司信息
   */
  insertList(){
    this.insertLoading = true;
    const data = this.companyData.filter(item => item.checked);
    data.forEach(item => {
      if(item.bizScope && Array.isArray(item.bizScope)){
        item.bizScope = item.bizScope.join(",")
      }
    });
    if(data.length < 1){
      this.msg.error("请至少选择一条公司信息！");
      return;
    }
    this.http.post(SEA_URLS.insertListCompany, {companySeas: data}).then((res: any) => {
      if (res.success) {
        this.msg.success("添加成功");
        this.companyIsVisible = false;
        this.query()
      }
      this.insertLoading = false;
    });
  }

  /**
   * 修改保存
   */
  save(data: any){
    this.loading = true;
    data.bizScope = data.bizScope && Array.isArray(data.bizScope)? data.bizScope = data.bizScope.join(",") : data.bizScope = '';
    this.http.post(SEA_URLS.updateSeaCompany, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
        data.isEditing = false;
        data.bizScope = data.bizScope ? data.bizScope = data.bizScope.split(",") : [];
      }
      this.loading = false;
    });
  }

  /**
   * 添加承运商
   * @param data 
   */
  addCarrier(data){
    this.router.navigate(['/system/sea/basic/owner-carrier'], {queryParams: {'ownerCompanyId': data.companyId}});
  }


  allChecked: boolean = false;
  indeterminate: boolean = false;

  platAllChecked: boolean = false;
  platIndeterminate: boolean = false;

  refreshStatus(type?: string): void {
    if(type === 'plat'){
      const allChecked = this.companyData.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this.companyData.filter(value => !value.disabled).every(value => !value.checked);
      this.platAllChecked = allChecked;
      this.platIndeterminate = (!allChecked) && (!allUnChecked);
    }else{
      const allChecked = this.result.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this.result.filter(value => !value.disabled).every(value => !value.checked);
      this.allChecked = allChecked;
      this.indeterminate = (!allChecked) && (!allUnChecked);
    }
  }

  checkAll(value: boolean, type?: string): void {
    const data = type === 'plat' ? this.companyData : this.result;
    data.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus(type);
  }

  /**
   * 下拉框中文值设置
   * @param val 选中值
   * @param data 值存放的对象
   * @param options 下拉数据源
   * @param key 对象key值
   */
  setDisplayName(val: any[], data: any, options: Array<any>, key: string){
    if(!Array.isArray(val)){
      val = [val]
    }
    data[key] = options.filter(opt => val && val.some(item => item == opt.value)).map(item => item.label).join(",");
  }


  /**
    * 修改每页显示数量
    * @param pageSize 
    */
  pageSizeChange(pageSize: any, type?: string) {
    if(type === 'plat'){
      this.platPage.pageSize = pageSize;
      this.queryCompany();
    }else{
      this.page.pageSize = pageSize;
      this.query();
    }
  }

  /**
   * 修改页码
   * @param pageIndex 
   */
  pageIndexChange(pageIndex: any, type?: string) {
    if(type === 'plat'){
      this.platPage.pageIndex = pageIndex;
      this.queryCompany();
    }else{
      this.page.pageIndex = pageIndex;
      this.query();
    }
  }

}

