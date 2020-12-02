import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {UserinfoService} from '@service/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {format as dateformat} from 'date-fns';
import {Utils} from '@util/utils';
import { GlobalService } from '@service/global-service.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  dataSet: [{}];
  userDataSet: Array<any> = []; // 获取user列表存储数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  pageSize: number = 30;//条数
  page : number = 1;
  totalPage: number;//数据总条数
  userPageSize: number = 30;//条数
  userTotalPage: number;//数据总条数
  listLoading: boolean = true;
  userListLoading: boolean = true;
  searchData: any;  //存储查询的数据

  userSearchData: any;

  deleteList: any[];//要删除的数据
  tplModal: NzModalRef;
  selectedCompany: any;
  typeDataArr: Array<any> = [];
  companyData: any = {};
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  isVisible = false; // 控制弹窗
  selectedUser: Array<any> = []; // 选择用户时选择数据

  // 选择用户表格变量
  allChecked = false;
  indeterminate = false;
  datatmp: Array<any> = [];
  data: Array<any> = [];
  dataHeader = [
    {eName: 'userId', cName: '用户ID', type: 'string'},
    {eName: 'name', cName: '用户名', type: 'string'}
  ];
  userSearch: any;

  fileList: File[] = []; // app司机文件
  beforeUpload = (file): boolean => {
    this.fileList = [file];
    return false;
  };

  //导入字段
  importColumns: Array<any> = [
    {ename: 'name', cname: '姓名', required: true}, // 姓名
    {ename: 'mobile', cname: '电话', required: true}, // 电话
  ];

  @ViewChild('appDriverImport') appDriverImport;

  constructor(
    private http: HttpUtilService,
    private router: Router,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private glo: GlobalService,
    private info: UserinfoService,
    private xlsx: XlsxService) {
  }


  ngOnInit(): void {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.glo.searchReload.subscribe(
      (res: any) => {
        if (res.target === 'userlist') {
           this.listSearch(this.searchData);
        }
      }
    )
  }


  listSearch(data: any) { //查询
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.searchData = data;
    if (this.selectedCompany) {
      data.companyId = this.selectedCompany;
    }
    this.getUserList(data);
  }

  getUserList(sendData): void {
    let listUrl = `${environment.baseUrl}user/selectUserList`;
    this.listLoading = true;
    this.http.post(listUrl, sendData).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      } else {
        console.log('失败！');
      }
    });
  }

  updatePasswordInitialization(data): void {
    this.http.post(urls.updatePasswordInitialization, {userId: data.userId}).then(
      (res: any) => {
        if (res.success) {
          this.nn.success('提示消息', '密码重置成功!');
        }
      }
    );
  }

  btnAdd(): void {
    sessionStorage.removeItem('userListData');
    this.router.navigate(['/system/userManage/add']);
  }

  btnUpdate(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    sessionStorage.removeItem('userListData');
    this.router.navigate(['/system/userManage/add']);
    sessionStorage.setItem('userListData', JSON.stringify(data));
  }

  delete(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    console.log(this.info)
    let userid = this.info.APPINFO.USER.userId;
    let istrue = true
    data.data.forEach(item => {
      if(userid == item.userId){
        istrue = false;
        return;
      }
    });
    if (!istrue){
      this.nn.warning('提示消息', `删除用户中不能包含当前登录人，请重新选择!`);
      return
    }
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定删除当前记录?';
    this.deleteList = data.data;

  }

  btnClick(data: any) {

    if (data.type.buttonId === 'import') {
      this.nm.create({
        nzTitle: '用户管理>app司机导入',
        nzContent: this.appDriverImport,
        nzMaskClosable: false,
        nzOnOk: () =>
          this.importRequest()
      }).afterClose.subscribe(
        value => {
          this.fileList = [];
        }
      );
    }

    if (data.type.buttonId === 'SelectedUser') {
      this.isVisible = true;
      this.allChecked = false;
      this.indeterminate = false;
      this.getNoCompanyUsers({});
    }
    if (data.type.buttonId === 'Initial') {

      if (!data.data || data.data.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后进行密码重置！'
        });
        this.destroyTplModal();
        return;
      }

      if (!data.data || data.data.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一个用户后进行密码重置！'
        });
        this.destroyTplModal();
        return;
      }

      this.nm.confirm(
        {
          nzTitle: '<i>提示信息</i>',
          nzContent: '<b>确定要重置当前用户密码么？</b>',
          nzOnOk: () => this.updatePasswordInitialization(data.data[0])
        }
      );

    }
  }

  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let deleteUrl = `${environment.baseUrl}user/deleteList`;
      let deleteParam = {tUserModels: []};
      this.deleteList.forEach(elem => {
        deleteParam.tUserModels.push({rowid: elem['rowid'],userId:elem.userId});
      });
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
            this.nn.warning('提示消息', `删除成功!`);
            this.listSearch(this.searchData);
          }
        }
      );
    }else{
      this.deleteVisible = false;
    }

  }

  //userTmp: any;
  // 获取没有公司用户数据
  getNoCompanyUsers(data): void {
    this.userListLoading = true;
    data.page = data.page || this.page; //最好有
    data.length = data.length || this.userPageSize; //最好有
    this.userSearchData = data;
    this.http.post(`${environment.baseUrl}companyUser/getNoCompanyUser`, data).then(
      (res: any) => {
        if (res.success) {
          //console.log(res)
          this.userDataSet = res.data.data.data || [];
          this.userTotalPage = res.data.data.total;
          this.userListLoading = false;
        }
      }
    );
  }

  getNoCompanyUsers2(data): void {
    console.log(data)
    this.userListLoading = true;
    this.http.post(`${environment.baseUrl}companyUser/getNoCompanyUser`, data).then(
      (res: any) => {
        if (res.success) {
          console.log(res)
          this.userDataSet = res.data.data.data || [];
          this.userTotalPage = res.data.data.total;
          this.userListLoading = false;
        }
      }
    );
  }

  // 添加用户
  addUser(): void {
    let param: any = {tCompanyUserModels: [], agencyCompanyId: ''};
    param.tCompanyUserModels = this.selectedUser;
    if (this.permissions && this.selectedCompany) {
      param.agencyCompanyId = this.selectedCompany;
    } else {
      delete param.agencyCompanyId;
    }
    this.http.post(`${environment.baseUrl}companyUser/addCompanyUser`, param).then(
      (res: any) => {
        if (res.success) {
          this.isVisible = false;
          this.listSearch(this.searchData);
          this.userSearch = '';
          this.selectedUser = [];
        }
      }
    );
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 弹窗相关

  handleOk(): void {
    this.addUser();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.selectedUser = [];
    this.userSearch = '';
  }

  // 选择用户表格相关逻辑
  refreshStatus(): void {
    const allChecked = this.data.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.data.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.selectedUser = this.data.filter(res => res.checked);
  }

  checkAll(value: boolean): void {
    this.data.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  // 查找
  find() {
    //console.log("查找")
    this.userSearchData.name = this.userSearch.trim();
    console.log(this.userSearchData)
    if(this.userSearchData.name){
      this.userSearchData.page = undefined;
      this.userSearchData.length = undefined;
      this.getNoCompanyUsers2(this.userSearchData);
    }else{
      this.getNoCompanyUsers(this.userSearchData);
    }

    // if (this.userSearchData.loginName) {
    //   console.log(364)
    //   this.userDataSet = this.userSearchTmp.filter(
    //     (res: any) => {
    //       if(res.loginName){
    //         //return res.loginName.indexOf(this.userSearchData.loginName) >= 0;
    //         return res.loginName.indexOf(this.userSearchData.loginName);
    //       }
    //       //return res.loginName.indexOf(this.userSearch) >= 0;
    //     }
    //   );
    // } else if(this.userSearchData.name){
    //   console.log(375)
    //   this.userDataSet = this.userSearchTmp.filter(
    //     (res: any) => {
    //       if(res.name){
    //         return res.name.indexOf(this.userSearchData.name) >= 0;
    //       }
    //     }
    //   );
    // } else {
    //   this.userDataSet = Utils.deepCopy(this.userSearchTmp);
    // }
    // if (this.userSearchData.name) {
    //   console.log(358)
    //   console.log(this.userSearchTmp)
    //   this.userDataSet = this.userSearchTmp.filter(
    //     (res: any) => {
    //       if(res.name){
    //         return res.name.indexOf(this.userSearchData.name) >= 0;
    //       }
    //     }
    //   );
    // } else {
    //   this.userDataSet = Utils.deepCopy(this.userSearchTmp);
    // }

  }

  getPageIndex(page: any) {
    this.userSearchData.page = page;
    this.getNoCompanyUsers(this.userSearchData);
    //console.log(this.userSearchData.page);
    this.page=this.userSearchData.page;
  }

  getPageSize(pageSize: any) {
    this.userPageSize = pageSize;
    this.userSearchData.userPageSize = pageSize;
    this.getNoCompanyUsers(this.userSearchData);
  }

  // 选择用户  选择时返回数据
  updateDataResult(data: any) {
    this.selectedUser = data;
  }

  /**
   * 导入请求
   */
  importRequest(): Promise<any> | boolean {
    if (this.fileList.length === 0) {
      this.nn.warning('提示消息', '请选择文件后提交！');
      return false;
    }
    const url = urls.appUserImport;
    let param: any = {};
    return this.xlsx.import(this.fileList[0]).then(
      value => {
        const keys = Object.keys(value);
        if (!keys || keys.length == 0) {
          // this.importLoading = false;
          this.nn.error('提示消息', `上传数据格式不正确，请下载标准模板!`);
          // this.msg.error('上传数据格式不正确，请下载标准模板!');
          return;
        }

        const data = value[keys[0]];
        if (!data || data.length < 2) {
          // this.importLoading = false;
          this.nn.error('提示消息', `上传数据格式不正确，请下载标准模板!`);
          // this.msg.error('上传数据格式不正确，请下载标准模板!');
          return;
        }

        // 模板必要字段验证
        if (this.validateColumns(data[0]) === false) {
          // this.importLoading = false;
          return;
        }
        // 导入数据校验
        param = this.toSettleRec(data);
        if (this.validateData(param) === false) {
          // this.importLoading = false;
          return;
        }
      }
    ).then(
      value => {
        return this.http.post(url, param).then(
          res => {
            if (res.success) {
              this.nn.success('提示消息', '导入成功!');
            } else {
              return false;
            }
          }
        );
      }
    );


  }

  /**
   * 导入数据校验
   * @param data
   */
  validateData(data: Array<any>): boolean {
    const invalidColumn = this.importColumns.filter(item => item.required).filter(col => {
      return data.some((item, index) => {
        // 如果没有值或者值去空格后长度为0，返回true
        if (!item[col.ename] || item[col.ename].trim().length == 0) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 2})`;
          return true;
        }
        item[col.ename] = item[col.ename].trim();
        if (col.validator === 'number') {
          item[col.ename] = item[col.ename].replace(/,/g, '');
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
        }
        return false;
      });
    });

    if (invalidColumn && invalidColumn.length > 0) {
      // this.msg.error(`导入失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(',')}的数据`);
      this.nn.error('提示消息', `导入失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(',')}的数据`);
      return false;
    }
    return true;
  }

  /**
   * 列头验证
   * @param header
   */
  validateColumns(header: Array<any>): boolean {
    const invalid = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (invalid && invalid.length > 0) {
      this.nn.error('提示消息', `上传数据格式不正确，请下载标准模板!`);
      // this.msg.error(`上传数据格式不正确，请下载标准模板!`);
      // this.msg.error(`导入失败！模板错误："${invalid.map(item => item.cname).join('","')}"字段必须存在！`);
      return false;
    }
    return true;
  }

  /**
   * 将csv数组转为收款登记
   * @param data
   */
  toSettleRec(data: any): Array<any> {
    if (!data || data.length < 2) {
      this.nn.error('提示消息', `上传数据格式不正确，请下载标准模板!`);
      // this.msg.error('上传数据格式不正确，请下载标准模板!');
      return;
    }
    let dataArray = [];
    const header = data[0].map(item => this.getEname(item));
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => obj[key] = data[i][index]);
      dataArray.push(obj);
    }
    dataArray = dataArray.filter(item => item.name);

    return dataArray;
  }

  /**
   * 根据列配置的中文名称获取英文名称
   * @param cname
   */
  getEname(cname: string): string {
    if (!cname) {
      return cname;
    }
    const col = this.importColumns.find(item => item.cname === cname.trim());
    if (col) {
      return col.ename;
    }
    return cname;
  }

}
