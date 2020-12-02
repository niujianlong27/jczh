import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';

@Component({
  selector: 'app-platforma-permisson-add',
  templateUrl: './platforma-permisson-add.component.html',
  styleUrls: ['./platforma-permisson-add.component.css']
})
export class PlatformaPermissonAddComponent implements OnInit {

  // 用户表头
  userHeaderData: Array<any> = [
    {cName: '界面ID', eName: 'companyName'},
    {cName: '界面名称', eName: 'loginName'},
    {cName: 'url', eName: 'name'},
    {cName: '备注', eName: 'userType'},
  ];


  // 已选权限数据
  selectedPermissionData: Array<any> = [
    {
      userId: '1',
      loginName: '1',
      name: '1',
      userType: '1'
    },
    {
      userId: '2',
      loginName: '2',
      name: '2',
      userType: '2'
    },
    {
      userId: '3',
      loginName: '3',
      name: '3',
      userType: '3'
    },
    {
      userId: '4',
      loginName: '4',
      name: '4',
      userType: '4'
    },
    {
      userId: '5',
      loginName: '5',
      name: '5',
      userType: '5'
    }
  ];

  // 未选权限数据
  unselectedPermissionData: Array<any> = [
    {
      userId: '11',
      loginName: '11',
      name: '11',
      userType: '11'
    },
    {
      userId: '22',
      loginName: '22',
      name: '22',
      userType: '22'
    },
    {
      userId: '33',
      loginName: '33',
      name: '33',
      userType: '33'
    },
    {
      userId: '44',
      loginName: '44',
      name: '44',
      userType: '44'
    },
    {
      userId: '55',
      loginName: '55',
      name: '55',
      userType: '55'
    }
  ];

  // 选中数据
  // 选择的已选权限数据
  selectData1: Array<any> = [];
  // 选择的未选权限数据
  selectData2: Array<any> = [];

  // 是否全选
  // 已选权限
  allChecked1: boolean = false;
  // 未选选权限
  allChecked2: boolean = false;

  // checked不定状态
  // 已选权限
  indeterminate1: boolean = false;
  // 未选选权限
  indeterminate2: boolean = false;

  // 查询框数据
  // 平台管理公司ID
  platformManagementCompanyID: string = 'test';

  // 平台公司名字
  platformManagementCompanyName: string = 'test';


  validateForm: FormGroup;
  private dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  private rowid: number;


  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService) {
  }

  ngOnInit() {
    let data = sessionStorage.getItem('bizformPermissonData');
    let tempData;
    if (!data) {

    } else {
      tempData = JSON.parse(data);
      this.platformManagementCompanyID = tempData.bizCompanyId;
      this.platformManagementCompanyName = tempData.bizCompanyName;
    }

  }

  // 选中逻辑
  // 已选权限选中逻辑
  refreshStatus1(data?: any) {

    let allChecked: boolean, allUnChecked: boolean, currentChecked: boolean;
    allChecked = this.selectedPermissionData.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.selectedPermissionData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked1 = allChecked;
    this.indeterminate1 = (!allChecked) && (!allUnChecked);
    this.selectData1 = []; //每次重置
    this.selectedPermissionData.map( //要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData1.push(val);
        }
      }
    );
    console.log(this.selectData1);
  }

  // 未选权限选中逻辑
  refreshStatus2(data?: any) {

    let allChecked: boolean, allUnChecked: boolean, currentChecked: boolean;
    allChecked = this.unselectedPermissionData.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.unselectedPermissionData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked2 = allChecked;
    this.indeterminate2 = (!allChecked) && (!allUnChecked);
    this.selectData2 = []; //每次重置
    this.unselectedPermissionData.map( //要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData2.push(val);
        }
      }
    );
  }

  // 全选
  // 已选权限选中逻辑
  checkAll1(value: boolean) {
    this.selectedPermissionData = this.selectedPermissionData ? this.selectedPermissionData : [];
    this.selectedPermissionData.forEach(data => {
        data.checked = value;
      }
    );
    this.refreshStatus1();
  }

  // 未选权限选中逻辑
  checkAll2(value: boolean) {
    this.unselectedPermissionData = this.unselectedPermissionData ? this.unselectedPermissionData : [];
    this.unselectedPermissionData.forEach(data => {
        data.checked = value;
      }
    );
    this.refreshStatus2();
  }

  // 添加
  add(): void {
    this.unselectedPermissionData = this.unselectedPermissionData.filter(data => !data.checked);
    for (let data of this.selectData2) {
      delete data.checked;
    }
    this.selectedPermissionData = this.selectedPermissionData.concat(this.selectData2);
    this.selectData2 = [];
    this.refreshStatus1();
    this.refreshStatus2();
  }

  // 移除
  remove(): void {

    this.selectedPermissionData = this.selectedPermissionData.filter(data => !data.checked);
    for (let data of this.selectData1) {
      delete data.checked;
    }
    this.unselectedPermissionData = this.unselectedPermissionData.concat(this.selectData1);
    this.selectData1 = [];
    this.refreshStatus1();
    this.refreshStatus2();
  }

  // 提交
  submitForm(): void {
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrl} add`;
    } else {
      //update
      let updateUrl = `${environment.baseUrl} update`;
    }
  }

  // 取消
  cancel(): void {
    sessionStorage.removeItem('bizformPermissonData');
    this.router.navigate(['/system/systemSet/bizformPermisson']);
  }

  // 重置
  reset() {
    this.checkAll1(false);
    this.checkAll2(false);
  }

}
