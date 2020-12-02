import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '@env/environment';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-company-permission-add',
  templateUrl: './company-permission-add.component.html',
  styleUrls: ['./company-permission-add.component.css']
})
export class CompanyPermissionAddComponent implements OnInit {

  // 表头
  userHeaderData: Array<any> = [
    {cName: '界面ID', eName: 'formId'},
    {cName: '界面名称', eName: 'formName'},
    {cName: 'url', eName: 'formUrl'},
    {cName: '备注', eName: 'remark'},
  ];


  // 已选权限数据
  selectedPermissionData: Array<any> = [];
  selectedPermissionDataTmp: Array<any> = [];

  // 未选权限数据
  unselectedPermissionData: Array<any> = [];
  unselectedPermissionDataTmp: Array<any> = [];

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

  // 查询输入框
  // 公司ID
  companyId: string;

  // 公司名字
  companyName: string = 'test';


  validateForm: FormGroup;
  private rowid: number;
  statusName: string;
  height1: string = '300px';
  height2: string = '300px';
  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService, private notification: NzNotificationService) {
  }

  ngOnInit() {

    let data = sessionStorage.getItem('companyPermission');
    let tempData;
    if (!data) {
      this.router.navigate(['/system/systemSet/companyPermission']);
    } else {
      tempData = JSON.parse(data);
      this.companyId = tempData.plateCompanyId;
      this.companyName = tempData.companyName;
      sessionStorage.removeItem('companyPermission');
      this.rowid = tempData.rowid;
      if (tempData.status === 'PTGS10') {
        this.statusName = '停用';
      } else {
        this.statusName = '启用';
      }
      this.getData();
    }

  }
  //table 高度
  tableHeight(data:number,flag: number){
     if(flag){
       this.height2 = `${data}px`;
     }else{
       this.height1 =  `${data}px`;
     }
  }
  // 选中逻辑
  // 已选权限选中逻辑
  refreshStatus1(data?: any) {

    if (this.selectedPermissionData.length === 0) {
      this.indeterminate1 = false;
      this.allChecked1 = false;
      return;
    }

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
  }

  // 未选权限选中逻辑
  refreshStatus2(data?: any) {

    if (this.unselectedPermissionData.length === 0) {
      this.allChecked2 = false;
      this.indeterminate2 = false;
      return;
    }

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
        if (!data.hide) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus1();
  }

  // 未选权限选中逻辑
  checkAll2(value: boolean) {
    this.unselectedPermissionData = this.unselectedPermissionData ? this.unselectedPermissionData : [];
    this.unselectedPermissionData.forEach(data => {
        if (!data.hide) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus2();
  }

  // 添加
  add(): void {
    console.log(this.selectData2)
    this.unselectedPermissionData = this.unselectedPermissionData.filter(data => !data.checked);
    console.log(this.unselectedPermissionData)
    for (let data of this.selectData2) {
      delete data.checked;
    }
    this.selectedPermissionData = this.selectedPermissionData.concat(this.selectData2);
    console.log(this.selectedPermissionData)
    // this.selectedPermissionDataTmp = Utils.deepCopy(this.selectedPermissionData);
    // this.unselectedPermissionDataTmp = Utils.deepCopy(this.unselectedPermissionData);
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
    // this.selectedPermissionDataTmp = Utils.deepCopy(this.selectedPermissionData);
    // this.unselectedPermissionDataTmp = Utils.deepCopy(this.unselectedPermissionData);
    this.refreshStatus1();
    this.refreshStatus2();
  }

  // 提交
  submitForm(): void {
    this.sendData();
  }

  // 取消
  cancel(): void {
    sessionStorage.removeItem('companyPermission');
    this.router.navigate(['/system/systemSet/companyPermission']);
  }

  // 重置
  reset() {
    this.checkAll1(false);
    this.checkAll2(false);
  }

  // 数据获取
  getData() {
    const params = {url: '', data: {companyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}form/getFormByCompanyId`;
    params.data.companyId = this.companyId;
    this.http.request(params).then(
      (res: any) => {
        this.selectedPermissionData = res.data.data.haveCompanyId;
        // this.selectedPermissionDataTmp = res.data.data.haveCompanyId;
        this.unselectedPermissionData = res.data.data.withoutCompanyId;
        // this.unselectedPermissionDataTmp = res.data.data.withoutCompanyId;
      }
    );
  }

  // 发送数据
  sendData() {
    const params = {url: '', data: {companyId: '', newHaveCompanyId: [], newWithoutCompanyId: []}, method: 'POST'};
    params.url = `${environment.baseUrl}companyForm/updateCompanyForm`;
    params.data.newHaveCompanyId = this.selectedPermissionData;
    params.data.newWithoutCompanyId = this.unselectedPermissionData;
    params.data.companyId = this.companyId;
    this.http.request(params).then(
      (res: any) => {
        this.getData();
        this.notification.remove();
        this.notification.success('提示消息', '保存成功');
      }
    );
  }

  statusChange(): void {
    let status;
    if (this.statusName === '启用') {
      status = 'PTGS10';
    }
    if (this.statusName === '停用') {
      status = 'PTGS20';
    }

    this.http.post(`${environment.baseUrl}plateCompany/setPlateCompnay`, {rowid: this.rowid, status: status}).then(
      (res: any) => {
        if (res.success) {
          this.statusName = this.statusName === '启用' ? '停用' : '启用';
        }
      }
    );

  }

  selectedPermissionSearch(data) {
    // console.log(data.value);
    if (data.value) {
      // this.selectedPermissionData = this.selectedPermissionDataTmp.filter(
      //   (res: any) => {
      //     return res.formName.indexOf(data.value) >= 0;
      //   }
      // );

      this.selectedPermissionData.forEach(
        (res: any) => {
          res.hide = false;
        }
      );

      this.selectedPermissionData.forEach(
        (res: any) => {
          if (res.formName.indexOf(data.value) === -1) {
            res.hide = true;
          }
        }
      );

    } else {
      // this.selectedPermissionData = Utils.deepCopy(this.selectedPermissionDataTmp);
      this.selectedPermissionData.forEach(
        (res: any) => {
          res.hide = false;
        }
      );

    }
  }

  unselectedPermissionSearch(data) {
    if (data.value) {
      // this.unselectedPermissionData = this.unselectedPermissionDataTmp.filter(
      //   (res: any) => {
      //     return res.formName.indexOf(data.value) >= 0;
      //   }
      // );
      this.unselectedPermissionData.forEach(
        (res: any) => {
          res.hide = false;
        }
      );
      this.unselectedPermissionData.forEach(
        (res: any) => {
          if (res.formName.indexOf(data.value) === -1) {
            res.hide = true;
          }
        }
      );

    } else {
      // this.unselectedPermissionData = Utils.deepCopy(this.unselectedPermissionDataTmp);

      this.unselectedPermissionData.forEach(
        (res: any) => {
          res.hide = false;
        }
      );

    }
  }
}
