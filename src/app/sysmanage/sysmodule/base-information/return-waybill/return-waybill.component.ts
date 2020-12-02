import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '@model/url';

@Component({
  selector: 'app-return-waybill',
  templateUrl: './return-waybill.component.html',
  styleUrls: ['./return-waybill.component.css']
})
export class ReturnWaybillComponent implements OnInit {

  dataSet: Array<any> = [];
  buttonID: string = ''; // button id
  updateDiasabled = false;
  spinning = false;
  @ViewChild('waybillType') waybillType;

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.getListData();
  }

  /**
   * 数据获取
   */
  getListData(): void {
    this.spinning = true;
    const url = urls.getStaticByValueSetCodeGroupByValue;
    const param = {};
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.dataSet = res.data.data || [];
        }
      }
    ).finally(
      () => {
        this.spinning = false;
      }
    );
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data) {
    this.buttonID = data.buttonId;
    switch (this.buttonID) {
      case 'Update': {
        this.btnUpdate();
      }
        break;
      default:
        this.nm.warning('按钮未定义!');
    }
  }

  /**
   * 保存点击
   */
  btnUpdate(): void {
    this.updateDiasabled = true;
    this.updateData();
  }

  /**
   * 保存请求
   */
  updateData(): void {
    const url = urls.updateGroupByValue;
    this.dataSet.forEach(
      value => {
        value.kmRemind = value.kmRemind * 1;
      }
    );
    const param = {
      tStaticModels: this.dataSet
    };
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nm.success('保存成功!');
          this.getListData();
        }
      }
    ).finally(
      () => {
        this.updateDiasabled = false;
      }
    );
  }

}
