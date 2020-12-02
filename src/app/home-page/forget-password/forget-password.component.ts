import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  validateForm: FormGroup;
  timer: any;
  count: number = 60;
  codeClick: boolean = false;
  constructor(private fb: FormBuilder,
              private router: Router,
              private nz: NzNotificationService,
              private http: HttpUtilService,
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.pattern('^\\d{11}$')]], // 手机号
      password: [null, [Validators.required]], // 密码
      code: [null, [Validators.required]],  // 验证码
    });
  }

  mobile: string;

  getCode() {
    if (!this.validateForm.get('mobile').value) {
      this.nz.warning('提示消息', `请填写手机号!`);
      return;
    }
    let pattern = new RegExp(/^\d{11}$/);
    if (!pattern.test(this.validateForm.get('mobile').value)) {
      this.nz.warning('提示消息', `手机号格式不正确！!`);
      return;
    }
    this.mobile = this.validateForm.get('mobile').value;
    let startNUm = this.mobile.substr(0, 4);
    let endNum = this.mobile.substr(7);
    console.log(startNUm, endNum);
    this.mobile = `${startNUm}***${endNum}`;
    this.http.post(urls.sendVerificationCodeWeb, {mobile: this.validateForm.get('mobile').value}).then(
      (res: any) => {
        if (res.success) {
          this.countSub();
        }
      }
    );
  }

  countSub = () => { // 验证码获取控制
    this.codeClick = true;
    this.timer = setInterval(() => {
      this.count = this.count - 1;
      if (this.count == 0) {
        clearInterval(this.timer);
        this.count = 60;
        this.codeClick = false;
      }
    }, 1000);

  };

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let params = this.validateForm.getRawValue();
    this.http.post(urls.exchangePassword, params).then(
      (res: any) => {
        if (res.success) {
          this.nz.success('提示消息', `密码已重置请重新登录！`);

          this.router.navigate(['login']);
        }
      }
    );

  }


}
