import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';
import {HttpUtilService} from '../../../../common/services/http-util.service';

@Component({
  selector: 'app-bidder-limit',
  templateUrl: './bidder-limit.component.html',
  styleUrls: ['./bidder-limit.component.css']
})
export class BidderLimitComponent implements OnInit {
  data: any[] = [];
  dataTmp: any[] = [];
  totalPage: number;
  sizeNumber: number = 100;
  dataChecked: any[] = [];
  btnSaveLoading: boolean = false;
  private isSelectData: any[] = [];
  temDate: any;
  // 选择的已选权限数据
  searchData: string = ''; // 搜索触发数据
  @ViewChild('isBiddingName') isBiddingName: TemplateRef<any>;

  constructor(
              private nzMess: NzNotificationService,
              private http: HttpUtilService,
              private message: NzMessageService) {
  }

  colName(data: any) {
    const isDefault = data.filter(x => (x.colEname === 'isBiddingName'));
    isDefault.forEach(item => {
      item.colEname == 'isBiddingName' && (item.tdTemplate = this.isBiddingName);
    });


  }

  ngOnInit() {
    this.getData({page: 1, length: this.sizeNumber});
  }

  private getData(params = {}) {  //查询接口
    this.http.post(urls.msSelectRecord, params).then(
      (res: any) => {
        if (res.success) {
          this.dataChecked = [];
          this.totalPage = res.data.data && res.data.data.total;
          this.dataTmp = res.data.data && res.data.data.data || [];
          this.dataTmp.forEach((item: any) => {
            item.isBidding = item.isBidding == '10' ? true : false;
          });
          this.temDate = Utils.deepCopy(this.dataTmp);
        }
      }
    );
  }

  selectData(data: any[]) { //勾选数据
    this.isSelectData = [...data];
  }

  // 按钮触发事件
  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Save':
        this.save();
        break;
    }
  }

  private save() {

    let temSelectData:any;
    temSelectData = Utils.deepCopy( this.isSelectData);
    temSelectData.forEach(item => {
      item.isBidding = item.isBidding ? '10' : '00';
    });
    this.btnSaveLoading = true;
    this.http.post(urls.msSaveRecord, {tMessageSetModels: temSelectData}).then(
      (res: any) => {
        this.btnSaveLoading = false;
        if (res.success) {
          this.getData({page: 1, length: this.sizeNumber});
          this.nzMess.success('提示消息', '设置成功');

        }
      }
    );
  }


  PermissionSearch() { //搜索框
    if (this.searchData) {
      this.dataTmp = this.temDate.filter(
        (res: any) => {
          return res.name &&  res.name.indexOf(this.searchData) >= 0;
        }
      );
    } else {
      this.dataTmp = Utils.deepCopy(this.temDate);
    }
  }

  pageSize(data: number) {
    this.sizeNumber = data;
    this.getData({page: 1, length: data});
  }

  pageIndex(data: number) {
    this.getData({page: data, length: this.sizeNumber});
  }

}
