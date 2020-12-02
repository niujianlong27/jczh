import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {urls} from '../../../../common/model/url';
import {NzModalRef, NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from "@util/utils";
import {XlsxService} from "@component/simple-page/xlsx/xlsx.service";
import { GlobalService } from '../../../../common/services/global-service.service';

@Component({
  selector: 'app-driver-manage',
  templateUrl: './driver-manage.component.html',
  styleUrls: ['./driver-manage.component.css']
})
export class DriverManageComponent implements OnInit {
  userSearch: any;
  userDataSet: any;
  userListLoading: any;
  userPageSize: number = 30;//条数
  page: number = 1;//条数
  userTotalPage: any;
  userSearchData: any;
  selectedUser: any = [];
  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  // 数据弹出框
  modalFormVisible = false; // 数据弹窗
  modalValidateForm: FormGroup;
  private status: string;// add添加，update更新
  private rowid: number;//记录rowid;

  searchData: any;  //存储查询的数据
  isVisible: boolean;
  selectedCompany: any;
  typeDataArr: Array<any> = [];
  private tplModal: NzModalRef; // 弹窗相关
  allChecked: boolean;
  indeterminate: boolean;
  columnsArr: any;
  importFile: any;
  implistLoading: boolean = false; //导入确定加载

  modalFormData: Array<any> = [

    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请选择导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请选择导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    }
  ];
  validateForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';

  constructor(private router: Router,
              private xlsx: XlsxService,
              private httpUtilService: HttpUtilService,
              private fb: FormBuilder, private nm: NzModalService,
              private info: UserinfoService,
              private mess: NzMessageService,
              private global: GlobalService,
              private nn: NzNotificationService) {
  }

  ngOnInit(): void {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.global.searchReload.subscribe((x: any) => {
      if (x.target === 'DirverManage') {
        this.listSearch({...this.searchData});
      }
    })
    this.getStatic(this.typeDataArr, 'YHLX');
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.selectedCompany && this.permissions) {
      data.companyId = this.selectedCompany;
    }
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}user/selectDriver`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  //添加
  btnAdd(): void {
    sessionStorage.removeItem('driverData');
    sessionStorage.removeItem('status');
    this.router.navigate(['/system/baseInformation/DirverAdd']);
    sessionStorage.setItem('status', 'add');
  }

  // 更新
  btnUpdate(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后审核！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行审核！'
      });
      this.destroyTplModal();
      return;
    }

    sessionStorage.removeItem('driverData');
    sessionStorage.removeItem('status');
    this.router.navigate(['/system/baseInformation/DirverAdd']);
    sessionStorage.setItem('driverData', JSON.stringify(data));
    sessionStorage.setItem('status', 'updata');
  }


  //删除
  btnDelete(data: any): void {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.selectedData = data.data;
    this.status = 'delete';
  }

// 删除数据
  deleteData() {
    const params = {url: '', data: {companyId: '', tUserModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}user/deleteDriver`;
    for (const selectedDatum of this.selectedData) {
      params.data.tUserModels.push({userId: selectedDatum.userId});
    }
    if (this.selectedCompany) {
      params.data.companyId = this.selectedCompany;
    } else {
      delete params.data.companyId;
    }

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示消息', '删除成功');
          this.selectedData = [];
          this.listSearch(this.searchData);
        } else {
          this.nn.error('提示消息', '删除失败');
        }
      }
    );
  }


  //删除框确认
  modalConfirmResult(data: any): void {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
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

  btnClick(data: any) {
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
    if (data.type.buttonId === 'Import') {
      this.import()
    }
  }

  updatePasswordInitialization(data): void {
    console.log(data.userId);
    this.httpUtilService.post(urls.updatePasswordInitialization, {userId: data.userId}).then(
      (res: any) => {
        if (res.success) {
          this.nn.success('提示消息', '密码重置成功!');
        }
      }
    );
  }

  getPageIndex(page: any) {
    this.userSearchData.page = page;
    this.getNoCompanyUsers(this.userSearchData);
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

  handleCancel(): void {
    this.isVisible = false;
    this.selectedUser = [];
    this.userSearch = '';
  }

  handleOk(): void {
    this.addUser();
  }

  // 获取没有公司用户数据
  getNoCompanyUsers(data): void {
    this.userListLoading = true;
    data.userCompanyType = 'YHLX20';
    //data.page = data.page || 1; //最好有
    data.page = data.page || this.page; //最好有
    data.length = data.length || this.userPageSize; //最好有
    this.userSearchData = data;
    this.httpUtilService.post(`${environment.baseUrl}companyUser/getNoCompanyUser`, data).then(
      (res: any) => {
        if (res.success) {
          this.userDataSet = res.data.data.data || [];
          this.userTotalPage = res.data.data.total;
          console.log(this.userTotalPage)
          this.userListLoading = false;
        }
      }
    );
  }

  getNoCompanyUsers2(data): void {
    //console.log("查询")
    console.log(data)
    this.userListLoading = true;
    data.userCompanyType = 'YHLX20';
    this.httpUtilService.post(`${environment.baseUrl}companyUser/getNoCompanyUser`, data).then(
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
    if (this.selectedUser.length == 0) {
      this.nn.error('提示信息', '请勾选一个司机!')
      return;
    }
    let param: any = {tCompanyUserModels: [], agencyCompanyId: ''};
    param.tCompanyUserModels = this.selectedUser;
    if (this.permissions && this.selectedCompany) {
      param.agencyCompanyId = this.selectedCompany;
    } else {
      delete param.agencyCompanyId;
    }
    this.httpUtilService.post(`${environment.baseUrl}companyUser/addCompanyUser`, param).then(
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

  find() {
    this.userSearchData.name = this.userSearch.trim();
    //this.getNoCompanyUsers(this.userSearchData);
    if(this.userSearchData.name){
      this.userSearchData.page = undefined;
      this.userSearchData.length = undefined;
      this.getNoCompanyUsers2(this.userSearchData);
    }else{
      this.getNoCompanyUsers(this.userSearchData);
    }
  }

  import() {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: '驾驶员管理 > 导入',
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: true
    });
  }

  /**
   * 选择excel
   */
  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }

  handleCancelmodel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  importConfirm() {   //导入确定按钮
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nn.remove();
      this.nn.error("提示信息", '格式不正确！');
      return;
    }

    let _data = [];
    this.implistLoading = true;
    let headTemplate = ['姓名', '手机号', '身份证号', '驾驶证号','车牌号'];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if (!_data) {
        this.nn.remove();
        this.nn.error("提示信息", '未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      let headArr: any = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        return;
      }
     /* if(!this.validateImportData(_data,headTemplate)){
        return;
      }*/
      //修复空数据
      const result = _data.filter(x => x.length);
      this.excelFilter(result);
    });

  }
  private validateImportData(data:any[],header:string[]):boolean{
    /** 
     *  ['姓名', '手机号', '身份证号', '驾驶证号','车牌号']
     * 手机号，车牌号必填
     * 手机号 ^(0|\\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$
     * 身份证号 ^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$
     * 驾驶证号 ^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$
     * 车牌号 /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
    */
     const p = new RegExp('^(0|\\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$');
     const s = new RegExp('^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$');
     const c = new RegExp('^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$');
      var str = [],bool = false;
      for(let i = 1; i< data.length; i++){
          if(i+1 === data.length && !data[i].length) break;
          str[i]=[];
          for(let j=0;j<header.length;j++){
              if(j === 1 && !data[i][1]){
               str[i].push({type: 0,name:'手机号'})
               bool = true;
              }
              if(j===4 && !data[i][4]){
                str[i].push({type: 0,name: '身份证'})
                bool = true;
              }
             if(j=== 1 && data[i][1] && !p.test(data[i][1])){
               str[i].push({type: 1,name:'手机号'})
               bool = true;
             }
             if(j === 2 && data[i][2] && !s.test(data[i][2])){
               console.log(s.test(data[i][2]),data[i][2]);
              str[i].push({type: 1,name: '身份证号'})
              bool = true;
            }
            if(j=== 3 && data[i][3] && !s.test(data[i][3])){
              str[i].push({type: 1,name:'驾驶证号'})
              bool = true;
            }
            if(j === 4 && data[i][4] && !c.test(data[i][4])){
              str[i].push({type: 1, name: '车牌号'})
              bool = true;
            }
          }
      }
      if(bool){
        let message = [];
        str.forEach((d,index)=> {
          let arr1 = [];
          let arr2 = [];
           d.forEach(e => {
             if(e.type){
               arr2.push(e.name)
             }else{
               arr1.push(e.name)
             }
           })
           if(arr1.length || arr2.length){
            message.push(`第${index}行中${arr1.length ? arr1.join(',')+'不能为空;' : ''}${arr2.length ? arr2.join(',')+'格式不正确':''}`)
           }
        })
        this.mess.error(`表格中有错误:${message.join("; ")}`,{
          nzDuration: 5000
        });
        return false
      }else{
        return true
      }
     
  }
  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let count: string = '';
    let flag = true;
    // if(head.length != receiptHead.length){
    //   flag = false;
    // }
    head.forEach(item => {
      if (typeof item != "string") {
        flag = false;
        count = item;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        count = item;
        return;
      }

    });
    if (!flag) {
      this.nn.remove();
      this.nn.error("提示信息", "文件表头-" + count + "-与模板不匹配，请选择正确模板！");
      this.implistLoading = false;
    }
    return flag;
  }

  excelFilter(data: any) {
    let param: any = {tUserModels: []};
    let eNameHeader: any = [];
    data[0].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 1; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index] ? data[i][h.index].toString() : '';
      });
      param.tUserModels.push(temp);
    }
    this.httpUtilService.post(urls.importDriver, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        //冲突保留
        this.nn.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.listSearch({page: 1, length: this.pageSize});
      }
    });

  }

  patchEname(cName: any) {
    let columArr = [{cname:'姓名',ename:"name"},
                    {cname:'手机号',ename:"mobile"},
                    {cname:'身份证号',ename:"cardId"},
                    {cname:'驾驶证号',ename:"driverId"},
                    {cname:'车牌号',ename:"vehicleNo"}];
    for (let i = 0; i < columArr.length; i++) {
      if (columArr[i].cname.trim() == cName.trim()) {
        return columArr[i].ename;
      }
    }
  }

}
