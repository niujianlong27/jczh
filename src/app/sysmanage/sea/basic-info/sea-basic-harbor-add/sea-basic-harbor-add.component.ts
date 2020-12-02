import { Component, OnInit ,Input} from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';
import { differenceInCalendarDays } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sea-basic-harbor-add',
  templateUrl: './sea-basic-harbor-add.component.html',
  styleUrls: ['../../common/sea-common.css', './sea-basic-harbor-add.component.css']
})
export class SeaBasicHarborAddComponent implements OnInit {

  @Input() user:any;
/**
 * 时间框
 */
onChange(result: Date): void {
  console.log('Selected Time: ', result);
}

onOk(result: Date): void {
  console.log('onOk', result);
}

  page: Page = new Page();
  platPage: Page = new Page();

  // 主界面
  inqu: any = {};
  queryLoading: boolean = false;
  result: Array<any> = [];
  loading: boolean = false;

  //新增港口码头
  form: FormGroup;
  basicHarborNew :any ={};
  companyIsVisible: boolean = false;
  insertLoading: boolean = false;

  statusHarbor : Array<any> = [];

  statusHarborselect: Array<any> = [];

  statusBlacklist: Array<any> = [];
  bizScope: Array<any> = [];
  companyType: Array<any> = [];

  ownerCompany: Array<any> = [];
  carrierCompany: Array<any> = [];

  

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private info: UserinfoService,
    private codeset: CodesetService,
    public fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,) {

    this.form = this.fb.group({
      "type": [null, [Validators.required]],
      "continent": [null, [Validators.required]],
      "country": [null, [Validators.required]],
      "harborName": [null, [Validators.required]],
      "harborCode": [null, [Validators.required]],
      "remark": [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams.ownerCompanyId){
        this.inqu.ownerCompanyId = queryParams.ownerCompanyId
        this.openModal();
      }
    });

    this.statusHarbor = this.codeset.get('statusHarbor');
    this.statusHarborselect = this.codeset.get('statusHarborselect');

    //this.queryOwner();

    this.query();
  }

  /**
   * 分页查询方法
   */
  query() {
    this.queryLoading = true;
    this.http.post(SEA_URLS.getBasicHarborList, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
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
    this.http.post(SEA_URLS.getBasicHarborAll, {status: 10, companyType: 20}).then((res: any) => {
      if (res.success) {
        this.ownerCompany = res.data.data;
      }
    });
  }


  /**
   * 打开公司选择弹框
   */
  openModal(){
    this.form.reset();
    this.companyIsVisible = true;

  }

  

  /**
   * 批量新的港口码头
   */
  insertList(){
    
    var id = this.info.APPINFO.USER.name;
    this.basicHarborNew.createId = id;
    if(this.basicHarborNew.type==undefined || this.basicHarborNew.type==""){
        this.msg.error("请选择国内外类型");
        return;
    }
    if(this.basicHarborNew.continent==undefined || this.basicHarborNew.continent==""){
      this.msg.error("请输入所在区域（省）");
      return;
    }
    if(this.basicHarborNew.country==undefined || this.basicHarborNew.country==""){
      this.msg.error("请输入所在国家（市）");
      return;
    } 
    if(this.basicHarborNew.harborName==undefined || this.basicHarborNew.harborName==""){
      this.msg.error("请输入港口名称）");
      return;
    }
    this.http.post(SEA_URLS.insertHarbor, this.basicHarborNew).then((res: any) => {
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
    //console.info(this.info.APPINFO.USER.name+"123456");
    var id = this.info.APPINFO.USER.name;
    data.updateId = id;
    this.http.post(SEA_URLS.updateHarbor, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
        data.isEditing = false;
        this.query()
      }
      this.loading = false;
    });
  }


  /**
   * 修改状态
   * @param data 
   */
  delete(data: any){
    var id = this.info.APPINFO.USER.name;
    data.updateId = id;
    this.http.post(SEA_URLS.deleteHarbor, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
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
