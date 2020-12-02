import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpUtilService} from '../../../../common/services/http-util.service';

@Component({
  selector: 'app-busi-user',
  templateUrl: './busi-user.component.html',
  styleUrls: ['./busi-user.component.css']
})
export class BusiUserComponent implements OnInit {
  data: any[] = [];
  dataTmp: any[] = [];
  rightData: any[] = [];
  totalPage: number;
  sizeNumber: number = 100;
  dataChecked: any[] = [];
  btnSaveLoading: boolean = false;
  private staticRightData: any[] = [];
  private isSelectData: any[] = [];
  @ViewChild('isDefault') isDefault: TemplateRef<any>;

  constructor(private http1: HttpClient, private http: HttpUtilService, private message: NzMessageService) {
  }

  colName(data: any) {
    const isDefault = data.filter(x => x.colEname === 'isDefault');
    isDefault[0].tdTemplate = this.isDefault;
  }

  ngOnInit() {
    this.getData({page: 1, length: this.sizeNumber});
    this.getRightData(urls.getBusiSegment);
  }

  private getData(params = {}) {
    this.http1.post(urls.selectUserList, params).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.dataChecked = [];
          this.totalPage = res.data.total;
          this.data = res.data.data || [];
          this.dataTmp = res.data.data || [];
        }
      }
    );
  }

  pageSize(data: number) {
    this.sizeNumber = data;
    this.getData({page: 1, length: data});
  }

  pageIndex(data: number) {
    this.getData({page: data, length: this.sizeNumber});
  }

  selectData(data: any[]) {
    this.dataChecked = data;
    this.rightData = Utils.deepCopy(this.staticRightData);

    if (data.length === 1) {
      this.isSelectFun({userId: data[0].userId});
    } else {
      this.rightData = Utils.deepCopy(this.staticRightData);
    }

  }

  private getRightData(url: string, params = {}) {
    this.http1.post(url, params).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.rightData = res.data.data || [];
          this.staticRightData = Utils.deepCopy(this.rightData);
        }
      }
    );
  }

  private isSelectFun(params = {}) {
    this.http1.post(urls.selectRecord, params).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.isSelectData = res.data.data || [];
          this.rightData.forEach((item: any) => {
            this.isSelectData.forEach((checked: any) => {
              if (item.segmentId === checked.segmentId) {
                item.checked = true;
                item.isDefault = checked.isDefault == '1' ? true : false;
              }
            });
          });
          this.rightData = [...this.rightData];
        }
      }
    );
  }

  selectDefault(bool: any, data: any) {
    this.rightData.filter(x => x.segmentId !== data.segmentId).map(y => y.isDefault = false);
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
    const userList = this.rightData.filter(x => x.checked).map(
      y => ({segmentId: y.segmentId, segmentName: y.segmentName, isDefault: y.isDefault ? '1' : '0'})
    );
    const tUserBusiSegmentList = this.dataChecked.map(x => ({userId: x.userId, userList: userList}));
    this.btnSaveLoading = true;
    this.http1.post(urls.insertRecord, {tUserBusiSegmentList: tUserBusiSegmentList}).subscribe(
      (res: any) => {
        this.btnSaveLoading = false;
        if (res.code === 100) {
          this.getData({page: 1, length: this.sizeNumber});
          this.getRightData(urls.getBusiSegment);
          this.message.success(res.msg);
        }
      }
    );
  }

  // 表头
  userHeaderData: Array<any> = [
    {cName: '用户ID', eName: 'userId'},
    {cName: '用户名称', eName: 'name'},
  ];

  // 面板数据
  panels: Array<any> = [];

  // 面板缓存
  panelsTmp: Array<any> = [];
  searchData = ''; // 搜索触发数据

  selectedPermissionSearch() {
    // console.log(this.data)
    if (this.searchData) {
      let param = {page: 1, length: 30, formId: 'form_app_role'};
      param['name'] = this.searchData;
      this.http.post(urls.getRoleUserByNameNew, param).then(
        (res: any) => {
          if (res.success) {
            this.dataChecked = [];
            this.totalPage = res.data.data.total;
            this.data = res.data.data.data || [];
            this.dataTmp = res.data.data.data || [];
          }
        }
      );
    } else {
      this.getData({page: 1, length: this.sizeNumber});
    }


  }

  // 已选权限
  indeterminate1: boolean = false;
  // 已选权限
  allChecked1: boolean = false;
  // 选择的已选权限数据
  selectData1: Array<any> = [];


  // 全选
  // 已选权限选中逻辑
  checkAll1(value: boolean) {
    console.log(1);
    this.data = this.data ? this.data : [];
    this.data.forEach(data => {
        if (!data.hide) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus1();
  }

  // 选中逻辑
  // 已选权限选中逻辑
  refreshStatus1(data?: any) {
    console.log(2);
    if (this.data.length === 0) {
      this.indeterminate1 = false;
      this.allChecked1 = false;
      return;
    }

    let allChecked: boolean, allUnChecked: boolean, currentChecked: boolean;
    allChecked = this.data.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.data.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked1 = allChecked;
    this.indeterminate1 = (!allChecked) && (!allUnChecked);
    this.selectData1 = []; //每次重置
    this.data.map( //要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData1.push(val);
        }
      }
    );
  }

}
