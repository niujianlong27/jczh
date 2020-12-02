import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {gcDispatchURL} from '@model/gcDispatchURL';
import {UploadFiles} from '@service/upload-files';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-timeout-rule-maintenance',
  templateUrl: './timeout-rule-maintenance.component.html',
  styleUrls: ['./timeout-rule-maintenance.component.css']
})
export class TimeoutRuleMaintenanceComponent implements OnInit {

  validateForm: FormGroup;
  dealTypeArr: Array<any> = [];
  spinning = false; //全局加载状态
  saveLoading = false; //保存按钮加载状态

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.formInitialization();
    this.getEntryQueueSetting();
    this.getStatic(this.dealTypeArr, 'GCTODT');
  }

  /**
   * 表单提交
   */
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === 'VALID') {
      this.updateEntryQueueSetting();
    }
  }

  /**
   *  超时处理方修改
   * @param data
   */
  modelChange(data: any) {
    switch (data) {
      case 'gc_addMinutes': { //顺延时长
        this.validateForm.get('dealValue').reset('');
        this.validateForm.get('dealCount').reset('');
        this.validateForm.get('dealValue').setValidators(Validators.required);
        this.validateForm.get('dealCount').setValidators(Validators.required);
      }
        break;
      case 'gc_cancel': { // 取消排队
        this.validateForm.get('dealValue').reset('');
        this.validateForm.get('dealValue').clearValidators();
        this.validateForm.get('dealCount').reset('');
        this.validateForm.get('dealCount').clearValidators();
      }
        break;
    }
  }

  /**
   * 获取静态数据
   * @param data
   * @param valueSetCode
   */
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  /**
   * 表单初始化
   */
  formInitialization(): void {
    this.validateForm = this.fb.group({
      noticeMinute: [null, [Validators.required]],
      noticeCount: [null, [Validators.required]],
      noticeInterval: [null, [Validators.required]],
      dealType: [null, [Validators.required]],
      dealValue: [null],
      dealCount: [null],
    });
  }

  /**
   * 页面数据获取
   */
  getEntryQueueSetting(): void {
    const url = gcDispatchURL.getEntryQueueSetting;
    this.spinning = true;
    this.http.post(url, {}).then(
      res => {
        this.spinning = false;
        if (res.success) {
          this.validateForm.patchValue(res.data.data);
        }
      }
    );
  }

  /**
   * 修改请求
   */
  updateEntryQueueSetting(): void {
    const url = gcDispatchURL.updateEntryQueueSetting;
    const params = this.validateForm.getRawValue();
    this.saveLoading = true;
    this.http.post(url, params).then(
      res => {
        this.saveLoading = false;
        if (res.success) {
          this.nm.success('修改成功!');
          this.getEntryQueueSetting();
        }
      }
    );
  }
}
