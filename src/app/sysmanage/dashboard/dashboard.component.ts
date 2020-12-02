/**
 * 系统主版页面
 */
import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardInfo: any;
  QuickEntryData: Array<any> = [];
  validateForm: FormGroup;
  formData: any[] = [];
  isConfirmLoading: boolean;
  private modalRef: NzModalRef;
  private modalType: string;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalFooter') modalFooter: TemplateRef<any>;
  codeObj: any = {
    hidden: false,
    num: 59
  };
  private timer: Subscription;
  constructor(private info: UserinfoService,
              private http: HttpUtilService,
              private fb: FormBuilder,
              private modal: NzModalService,
              private no: NzNotificationService,
              private cookie: CookieService) {
  }
  ngOnInit() {
    this.dashboardInfo = this.info.get('USER') || {};
    this.getQuickEntryData();
  }

  getQuickEntryData(): void {
    this.http.post(urls.selectQuickEntry, {}).then(
      res => {
        if (res.success) {
          this.QuickEntryData = res.data.data || [];
        }
      }
    );
  }
  getCode() {
    this.codeObj.hidden = true;
    if (this.timer) { this.timer.unsubscribe(); }
    this.timer = interval(1000).subscribe(
          x => {
            this.codeObj.num = 59 - x;
            if (this.codeObj.num <= 0) {
              this.timer.unsubscribe();
              this.codeObj.num = 59;
              this.codeObj.hidden = false;
            }
          }
        );
    this.http.post(urls.sendVerificationCode, {mobile: this.validateForm.get('mobile').value}).then(
      (res: any) => {
              if (res.success) {
                 this.no.success('提示信息', res.data.msg);
              } else {
                this.timer.unsubscribe();
                this.codeObj.num = 59;
                this.codeObj.hidden = false;
              }
      }
    );
  }
  setInfo(type: string): void {
    this.validateForm = this.fb.group({});
      if (type === 'phone') {
        if (this.timer) { this.timer.unsubscribe(); }
         this.codeObj.num = 59;
         this.codeObj.hidden = false;
         this.formData = [
           {eName: 'oldMobile', cName: '原手机号', disabled: true, value: this.dashboardInfo.mobile, sm: 14},
           {eName: 'mobile', cName: '新手机号', Validators: [Validators.required, Validators.pattern('^1\\d{10}$')], error: '手机格式不正确!', sm: 14},
           {eName: 'code', cName: '验证码', value: null, sm: 7, Validators: [Validators.required]},
         ];
      } else if ( type === 'email') {
        this.formData = [
          {eName: 'oldEmail', cName: '原邮箱', disabled: true, value: this.dashboardInfo.email, sm: 14},
          {eName: 'email', cName: '新邮箱', Validators: [Validators.required, Validators.email], error: '邮箱格式不正确！', sm: 14}
        ];
      }
      this.formData.map((x: any) => {
        this.validateForm.addControl(x.eName, new FormControl({value: x.value, disabled: x.disabled}, x.Validators));
      });
      this.modalType = type;
     this.modalRef = this.modal.create({
        nzTitle: type === 'phone' ? '修改手机' : '修改邮箱',
        nzContent: this.modalContent,
        nzFooter: this.modalFooter
      });
  }
  handleCancel(): void {
    this.modalRef.destroy();
  }
  handleOk(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
         this.validateForm.controls[i].markAsDirty();
         this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    this.updateMobileOrEmail();
    // this.modalRef.destroy();
  }
  private updateMobileOrEmail() {
    const params = {...this.validateForm.value};
     // params.requestUserId = this.info.APPINFO.USER.userId;
     const url = this.modalType === 'phone' ? urls.updatePhone : urls.updateEmail;
     this.isConfirmLoading = true;
     this.http.post(url, params).then((res: any) => {
       this.isConfirmLoading = false;
       if (res.success) {
          this.no.success('提示信息', `${this.modalType === 'phone' ? '修改手机号成功!' : '修改邮箱成功!'}`);
          const infomation = this.info.get('USER');
          if (this.modalType === 'phone') {
              infomation.mobile = params.mobile;
              this.dashboardInfo.mobile = params.mobile;
          } else if (this.modalType === 'email') {
              infomation.email = params.email;
              this.dashboardInfo.email = params.email;
          }
          this.info.set('USER', infomation);
          this.cookie.set('INFO', JSON.stringify(infomation), new Date(Date.parse(new Date().toString()) + 7200000));
          this.modalRef.destroy();
       }
     });
  }
}
