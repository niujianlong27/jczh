import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpUtilService } from '../../../../common/services/http-util.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  // 主界面
  inqu: any = {};
  loading: boolean = false;

  // 新增资源弹框
  form: FormGroup;

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    public fb: FormBuilder, ) {

    this.form = this.fb.group({
      "oneTime": [null, [Validators.required]],
      "twoTime": [null, [Validators.required]],
      "delay": [null, [Validators.required]],
      "maxNo": [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.query();
  }

  /**
   * 分页查询方法
   */
  query() {
    this.http.post(SEA_URLS.getUserSetting, {}).then((res: any) => {
      if (res.success) {
        this.form.patchValue(res.data.data);
      }
    });
  }

 
  /**
   * 保存
   */
  save() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
    this.loading = true;
    const data = this.form.value;
    this.http.post(SEA_URLS.saveUserSetting, data).then((res: any) => {
      if (res.success) {
        this.msg.success("保存成功");
        this.form.reset();
        this.form.patchValue(data);
      }
      this.loading = false;
    });
  }

}
