import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { CodesetService } from '../../common/codeset.service';
import { differenceInCalendarDays } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-owner-carrier',
  templateUrl: './owner-carrier.component.html',
  styleUrls: ['../../common/sea-common.css', './owner-carrier.component.css']
})
export class OwnerCarrierComponent implements OnInit {

  page: Page = new Page();
  platPage: Page = new Page();

  // 主界面
  inqu: any = {};
  queryLoading: boolean = false;
  result: Array<any> = [];
  loading: boolean = false;
  isShowCancelButton: boolean = false;
  // 选择/新增承运商公司弹框
  form: FormGroup;
  companyIsVisible: boolean = false;
  insertLoading: boolean = false;

  statusBlacklist: Array<any> = [];
  bizScope: Array<any> = [];
  companyType: Array<any> = [];

  ownerCompany: Array<any> = [];
  carrierCompany: Array<any> = [];

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private codeset: CodesetService,
    public fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,) {

    this.form = this.fb.group({
      "ownerCompanyId": [null, [Validators.required]],
      "carrierCompanyIds": [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams.ownerCompanyId){
        this.inqu.ownerCompanyId = queryParams.ownerCompanyId;
        this.isShowCancelButton = true;
        this.openModal();
      }
    });

    this.statusBlacklist = this.codeset.get('statusBlacklist');
    this.bizScope = this.codeset.get('bizScope');
    this.companyType = this.codeset.get('companyType').filter(item => item.value != '10');

    this.queryOwner();

    this.query();
  }
  /**
     * 返回海运公司管理界面
     */
  cancel() {
    this.router.navigate(['system/sea/basic/sea-company-add'], {});
  }
  /**
   * 分页查询方法
   */
  query() {
    this.queryLoading = true;
    this.http.post(SEA_URLS.getOwnerCarrier, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.result = res.data.data.data;
        this.page.total = res.data.data.total;

        this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(",") : []);
      }
      this.queryLoading = false;
    });
  }

  /**
   * 查询所有货主公司
   */
  queryOwner(){
    this.http.post(SEA_URLS.getSeaCompanyAll, {status: 10, companyType: 20}).then((res: any) => {
      if (res.success) {
        this.ownerCompany = res.data.data;
      }
    });
  }

  /**
   * 查询所有承运公司
   */
  queryCarrier(){
    const ownerCompanyId = this.form.value.ownerCompanyId;
    if(!ownerCompanyId){
      this.msg.warning("请选择货主！");
      return ;
    }
    
    this.http.post(SEA_URLS.getCarrier, {ownerCompanyId: ownerCompanyId}).then((res: any) => {
      if (res.success) {
        this.carrierCompany = res.data.data;
      }
    });
  }


  /**
   * 打开公司选择弹框
   */
  openModal(){
    this.form.reset();
    this.companyIsVisible = true;
    if(this.inqu.ownerCompanyId){
      this.form.patchValue({ownerCompanyId: this.inqu.ownerCompanyId});
    }
    this.queryCarrier();
  }

  

  /**
   * 批量插入承运商
   */
  insertList(){
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return ;
    }
    
    const data = this.form.value;
    const concernedCarriers = data.carrierCompanyIds.map(item => {
      return {
        ownerCompanyId: data.ownerCompanyId,
        ownerCompanyName: this.getCompanyName(this.ownerCompany, data.ownerCompanyId),
        carrierCompanyId: item,
        carrierCompanyName: this.getCompanyName(this.carrierCompany, item),
      }
    });
    this.insertLoading = true;
    this.http.post(SEA_URLS.insertListCarrier, {concernedCarriers: concernedCarriers}).then((res: any) => {
      if (res.success) {
        this.msg.success("添加成功");
        this.companyIsVisible = false;
        this.query()
      }
      this.insertLoading = false;
    });
  }

  getCompanyName(companys: Array<any>, companyId: string){
    const company = companys.find(item => item.companyId === companyId);
    if(company){
      return company.companyName;
    }
    console.error("获取公司名称失败")
  }

  /**
   * 修改保存
   */
  save(data: any){
    this.loading = true;
    if(data.blacklistEndDate){
      data.blacklistEndDate = format(data.blacklistEndDate, 'YYYY-MM-DD');
    }
    this.http.post(SEA_URLS.updateCarrier, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
        data.isEditing = false;
      }
      this.loading = false;
    });
  }


  /**
   * 删除
   * @param data 
   */
  delete(data: any){
    this.http.post(SEA_URLS.deleteCarrier, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("删除成功");
        this.query();
      }
    });
  }


  allChecked: boolean = false;
  indeterminate: boolean = false;

  refreshStatus(): void {
    const allChecked = this.result.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.result.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean, type?: string): void {
    this.result.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
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
   * 黑名单日期只能选择今日之后的日期
   */
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) < 0;
  };


  /**
    * 修改每页显示数量
    * @param pageSize 
    */
  pageSizeChange(pageSize: any) {
    this.page.pageSize = pageSize;
    this.query();
  }

  /**
   * 修改页码
   * @param pageIndex 
   */
  pageIndexChange(pageIndex: any) {
    this.page.pageIndex = pageIndex;
    this.query();
  }

}


