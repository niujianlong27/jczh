import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpUtilService } from '@service/http-util.service';
import { urls } from '@model/url';
import { UserinfoService  } from '@service/userinfo-service.service';
@Component({
  selector: 'app-reset-psw',
  templateUrl: './reset-psw.component.html',
  styleUrls: ['./reset-psw.component.css']
})
export class ResetPswComponent implements OnInit {
  modal: NzModalRef; // 弹窗创建
  // @Input() userInfo:any = {'userId':'','name':''};
  @Input() title = '密码修改';
  @Input() nzClosable = true;
  @Input() nzMaskClosable = true;
  @Input() cancelBtnShow = true;
  private _pswModalOpen = false;
  @ViewChild('passwordModalContent') passwordModalContent;
  @ViewChild('passwordModalFooter') passwordModalFooter;
  @Input() set pswModalOpen(val: boolean) {
      this._pswModalOpen = val;
      this._pswModalOpen ? this.passwordChange() : (this.modal && this.modal.destroy());
  }
  get pswModalOpen() {
    return this._pswModalOpen;
  }
  @Output() pswCancel = new EventEmitter(); // 弹窗取消
  @Output() pswResult = new EventEmitter<boolean>(); // 修改成功true;失败false;
  passwordForm: FormGroup;
  constructor(private http: HttpUtilService, private nm: NzModalService, private fb: FormBuilder, private nn: NzNotificationService,
    private info: UserinfoService) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      username: [{value: '', disabled: true}, [ Validators.required ]],
      oldPassword:['', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      confirm : [ '', [ this.confirmValidator ] ],
    });
  }

  passwordChange() {
    window.setTimeout(() => {
      this.passwordForm.reset();
      this.passwordForm.get('username').setValue(this.info.APPINFO.USER.name);
      this.modal = this.nm.create(
        {
          nzTitle: this.title,
          nzContent: this.passwordModalContent,
          nzFooter: this.passwordModalFooter,
          nzClosable: this.nzClosable,
          nzMaskClosable: this.nzMaskClosable,
          nzOnCancel: () => {
            this.pswCancel.emit();
          }
        }
      );
    });
   /* this.modal.afterClose.subscribe((res:any) => {
        this.passwordForm.reset();
        this.modal.destroy();
    }
    )*/

  }

  validateConfirmPassword(): void {
    setTimeout(() => this.passwordForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  modalCancel(): void {
    // this.modal.destroy();
   // this._pswModalOpen = false;
   this.pswCancel.emit();
  }

  modalConfirm(): void {
    // tslint:disable-next-line: forin
    for (const key in this.passwordForm.controls) {
      this.passwordForm.controls[ key ].markAsDirty();
      this.passwordForm.controls[ key ].updateValueAndValidity();
    }

    if (this.passwordForm.status === 'VALID') {
      const param: any = this.passwordForm.value || {};
      this.http.post(urls.updatePwd, {password: param.password, userId: this.info.APPINFO.USER.userId, passwordOld: param.oldPassword})
        .then(
          (res: any) =>{
            if (res.success) {
              this.nn.create('success', '提示信息', '保存成功', {nzDuration: 3000});
             // this.modal.destroy();
             this.pswResult.emit(true);
            } else {
              this.pswResult.emit(false);
            }
          }
        );
    }

  }
}
