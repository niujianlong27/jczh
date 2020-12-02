import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {CacheService} from '../../../../../common/services/cache.service';
import {Router} from '@angular/router';
import {HttpUtilService} from '../../../../../common/services/http-util.service';
import {urls} from '../../../../../common/model/url';
import {UserinfoService} from '../../../../../common/services/userinfo-service.service';
import {UploadFiles} from '../../../../../common/services/upload-files';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-pay-channel-add',
  templateUrl: './pay-channel-add.component.html',
  styleUrls: ['./pay-channel-add.component.css']
})
export class PayChannelAddComponent implements OnInit {

  payChannelForm = this.fb.group({
      channelId: ['', Validators.required],
      channelName: ['', Validators.required],
      logo: ['', Validators.required],
      remark: ['', Validators.required],
    },
  );

  private rowid: string;

  private payChannelData; // payChannelData数据

  //上传
  logoList: Array<any> = [];
  previewImage: string;
  previewVisible: boolean;


  constructor(private fb: FormBuilder, private cache: CacheService, private http: HttpUtilService, private nn: NzNotificationService, public upload: UploadFiles) {
  }

  ngOnInit() {
    this.payChannelData = this.cache.getSession('payChannelData');
    this.cache.clearSession('payChannelData');
    if (this.payChannelData) {
      this.payChannelForm.patchValue(this.payChannelData);
      this.rowid = this.payChannelData.rowid;
      this.logoList = this.payChannelData.logo.split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `logo${index + 1}.png`,
          status: 'done',
          url: url
        };
      });
    } else {

    }
  }

  add() {
    for (const key in this.payChannelForm.controls) {
      this.payChannelForm.controls[key].markAsDirty();
      this.payChannelForm.controls[key].updateValueAndValidity();
    }
    if (this.payChannelForm.status == 'INVALID') {
      return;
    }
    this.addData();
  }

  save() {
    for (const key in this.payChannelForm.controls) {
      this.payChannelForm.controls[key].markAsDirty();
      this.payChannelForm.controls[key].updateValueAndValidity();
    }
    if (this.payChannelForm.status == 'INVALID') {
      return;
    }
    if (this.rowid) {
      this.updateData();
    } else {
      this.nn.warning('提示消息', '请新增后保存！');
    }
  }

  addData() {
    const param = this.payChannelForm.getRawValue();
    this.http.post(urls.insertPayChannel, param).then(
      (res: any) => {
        if (res.success) {
          this.nn.success('提示消息', '添加成功！');
          this.rowid = res.data.data.rowid || '';
        }
      }
    );
  }

  updateData() {
    const param = this.payChannelForm.getRawValue();
    param.rowid = this.rowid;
    this.http.post(urls.updatePayChannel, param).then(
      (res: any) => {
        if (res.success) {
          this.nn.success('提示消息', '更新成功！');
        }
      }
    );
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) {

    if (info.file.status === 'done') {
      if (name == 'logo') {
        // 单图片
        this.logoList = [info.file.originFileObj];
        this.payChannelForm.patchValue({logo: this.logoList[0].url});
        // 多图片
        // this.logoList = this.logoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.payChannelForm.patchValue({logo: this.logoList.map(item => item.url).join(';')});
      }

    }
    if (info.file.status === 'removed') {

      if (name == 'logo') {
        // 单图片
        this.payChannelForm.patchValue({logo: ''});
        // 多图片
        // this.payChannelForm.patchValue({logo: this.logoList.map(item => item.url).join(';')});
      }

    }
  }

}
