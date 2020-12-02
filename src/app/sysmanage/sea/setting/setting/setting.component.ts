import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../common/sea-common.css', './setting.component.css']
})
export class SettingComponent implements OnInit {

  page: Page = new Page();

  // 主界面
  inqu: any = {};
  queryLoading: boolean = false;
  result: Array<any> = [];
  loading: boolean = false;

  // 新增资源弹框
  form: FormGroup;
  modalIsVisible: boolean = false;
  insertLoading: boolean = false;

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    public fb: FormBuilder, ) {

    this.form = this.fb.group({
      "resource": [null, [Validators.required]],
      "value": [null, [Validators.required]],
      "bk1": [null, []],
    });
  }

  ngOnInit() {
    this.query();
  }

  /**
   * 分页查询方法
   */
  query() {
    this.queryLoading = true;
    this.http.post(SEA_URLS.getSetting, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.result = res.data.data.data;
        this.page.total = res.data.data.total;

        this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(",") : []);
      }
      this.queryLoading = false;
    });
  }



  /**
   * 批量资源信息
   */
  insert(){
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return ;
    }
    
    this.insertLoading = true;
    this.http.post(SEA_URLS.insertSetting, this.form.value).then((res: any) => {
      if (res.success) {
        this.msg.success("添加成功");
        this.modalIsVisible = false;
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
    this.http.post(SEA_URLS.updateSetting, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
        data.isEditing = false;
      }
      this.loading = false;
    });
  }

  /**
   * 删除
   */
  delete(data: any){
    this.loading = true;
    this.http.post(SEA_URLS.deleteSetting, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("删除成功");
        this.query();
      }
      this.loading = false;
    });
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



