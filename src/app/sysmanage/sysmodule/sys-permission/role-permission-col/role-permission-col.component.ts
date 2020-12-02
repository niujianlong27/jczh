import { Component, OnInit } from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-role-permission-col',
  templateUrl: './role-permission-col.component.html',
  styleUrls: ['./role-permission-col.component.css']
})
export class RolePermissionColComponent implements OnInit {

  // 角色表头
  roleHeaderData: Array<any> = [
    {cName: '角色ID', eName: 'roleId'},
    {cName: '角色名称', eName: 'roleName'},
  ];

  // 角色数据
  roleData: Array<any> = [];
  // 当前点击的role数据
  roleSelectData;

  // 列表头
  colHeaderData: Array<any> = [
    { cName: '界面ID', eName: 'formId'},
    { cName: '界面名称', eName: 'formName'}
  ];

  // 列数据
  colData: Array<any> = [];

  // 列选中数据
  colSelectData: any;
  // 列设置对话框状态
  colVisible = false;
  // 列设置表格
  // 表头
  colSettingHeaderData: Array<any> = [
    { cName: '表格ID', eName: 'gridId'},
    { cName: '列名', eName: 'colCname'}
  ];
  // 表格数据
  colSettingData: Array<any> = [];
  // 全选
  allChecked = false;
  // 中间态
  indeterminate = false;
  // 选中数据
  colSettingSelect: Array<any> = [];

  // 公司名称输入框
  inputModalModel:any;

  // 公司数据
  companyData:any;



  companyId:string;
  companyName:string;

  selectedCompany:any;
  roleHeight:string;
  colHeight:string;
  permissions:boolean= this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus ==='PTGS10'; // 权限检测

  constructor(private notification: NzNotificationService, private http: HttpUtilService,private info: UserinfoService,) { }

  ngOnInit() {
    this.companyId = this.selectedCompany?this.selectedCompany:this.info.get('USER').companyId;
    if (!this.permissions) {
      this.getRoleUserByCompanyId();
    }
  }
  heightFun(data:number,type:number){
      if(type === 0){
        this.roleHeight = `${data}px`;
      }else{
        this.colHeight = `${data}px`;
      }
  }
  // 根据companyID查询role信息
  getRoleUserByCompanyId(): void {
    const params = {url: '', data: {agencyCompanyId:''}, method: 'POST'};
    params.url = `${environment.baseUrl}role/getRoleIdAndName`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.roleData = res.data.data;
          if (this.roleData && this.roleData.length !== 0) {
            this.roleSelectData = this.roleData[0];
            this.roleData[0].isClick = true;
            this.getColumnList();
          } else {
            this.colData=[];
          }
        }
      }
    );
  }

  // 根据公司ID和roleID查询列设置列表
  getColumnList(): void {
    const params = {url: '', data: {roleId: this.roleSelectData.roleId, agencyCompanyId:''}, method: 'POST'};
    params.url = `${environment.baseUrl}roleColumn/getRoleColumn`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.colData = res.data.data;
        }
      }
    );
  }

  // 根据界面ID查列信息
  getColByformId(): void {
    const params = {url: '',
      data: {formId: this.colSelectData.formId, roleId: this.roleSelectData.roleId, agencyCompanyId:''},
      method: 'POST'};
    params.url = `${environment.baseUrl}column/getColumnByformId`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.colSettingData = res.data.data;
          this.refreshStatusColSetting();
        }
      }
    );
  }

  // 点击角色触发
  roleClick(data: any): void {
    this.roleData.filter(data=>data.isClick = false);
    data.isClick = true;
    this.roleSelectData = data;
    this.getColumnList();
  }

  // 列管理点击设置
  colSetting(): void {
    if (!this.colSelectData) {
      this.notification.remove();
      this.notification.error('提示消息', '请选择后操作');
      return;
    }
    this.colVisible = true;
    this.getColByformId();
  }

  // 列管理选择逻辑
  refreshStatusCol(data?: any): void {
    let currentChecked: boolean;
    currentChecked = data.checked;
    this.colData.map((res: any) => {
      res.checked = false;
    });
    data.checked = currentChecked;
    this.colSelectData = null;
    if (data.checked) {
      this.colSelectData = data;
    }
  }

  // 列对话框确认
  colHandleOk(): void {
    this.colVisible = false;
  }

  // 列对话框取消
  colHandleCancel(): void {
    this.colSettingData = [];
    this.colVisible = false;
  }

  // 列设置表格全选
  colSettingAllChecked(value: boolean): void {
    this.colSettingData.forEach(
      (data: any) => {
        data.checked = value;
      }
    );
    this.refreshStatusColSetting();
  }

  // 列设置表格选择
  refreshStatusColSetting(): void {
    const allChecked = this.colSettingData.every(value => value.checked === true);
    const allUnChecked = this.colSettingData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.colSettingSelect = [];
    this.colSettingData.map(data => {
        if (data.checked) {
          this.colSettingSelect.push(data);
        }
      }
    );
  }

  // 按钮
  btnClick(data:any):void {
    if (data.buttonId === 'Set') {
      this.colSetting();
    }

  }

  // 列设置重置
  reset(): void {
    this.colSettingAllChecked(false);
  }

  // 保存按钮
  save():void {
    this.colSave();
    this.colVisible = false;
  }

  //列设置保存
  colSave(): void {
    const params = {
      url: '',
      data:
        {
          formId: this.colSelectData.formId, companyId: this.companyId,
          roleId: this.roleSelectData.roleId, tRoleColumnModels: []
        },
      method: 'POST'
    };
    params.url = `${environment.baseUrl}roleColumn/updateRoleColumn`;
    for (const data of this.colSettingSelect) {
      params.data.tRoleColumnModels.push(data);
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.notification.success('提示消息', '保存成功！');
          this.getColumnList();
        } else {
          this.notification.error('提示消息', '保存失败！');
        }
      }
    );
  }

  // input_modal选择数据
  selectedInputData(data:any):void {
    this.companyData = data.data[0];
    this.companyName = this.companyData.companyName;
    this.inputModalModel = this.companyData.companyName;
    this.companyId = this.companyData.companyId;
    this.getRoleUserByCompanyId();
  }

  companyChange():void {
    this.companyId = this.selectedCompany;
    this.getRoleUserByCompanyId();
  }

}
