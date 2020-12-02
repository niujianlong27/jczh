import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {Utils} from '@util/utils.ts';
import { UserinfoService } from '@service/userinfo-service.service';
import {TRANS_URLS} from '@model/trans-urls';

@Component({
  selector: 'app-approval-config',
  templateUrl: './approval-config.component.html',
  styleUrls: ['./approval-config.component.css']
})
export class ApprovalConfigComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false; // 弹框显示
  modalTitle: string; // 弹框标题
  listLoading: boolean = false;
  dataSet: any = [];
  itemData: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  searchData: any; // 查询条件缓存
  selectItem: Array<any> = [];
  selectList: Array<any> = []; // 勾选数据
  buttonId: string;
  documentsType: Array<any> = [];
  initRowData = {newRow: true, checked: true};
  aproUserNameArr: Array<any> = [];
  status:string;
  modalFormData: Array<any> = [
    {
      name: '单据类型', eName: 'documentsTypeId', type: 'select', require: true, validateCon: '请选择单据类型',
      disabled: false,
      required: true,

    },
    {
      name: '审批流程配置', eName: 'approvalModels', type: '', require: true, validateCon: '请输入审批流程配置',
      disabled: false,
      required: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpUtilService,
    private nzMess: NzNotificationService,
    private nm: NzModalService,
    private msg: NzMessageService,
    private info: UserinfoService,) {

  }

  ngOnInit() {
    this.getStatic(this.documentsType, 'DJLX');

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: null, disabled: control.disabled}, control.required ? Validators.required : null
      ));
    }
    this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data) { // 查询
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data) { // 查询
    this.searchData = {...data};
    let url = urls.getApproConfigList;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data.total ? res.data.data.total : 0;

      }
    });
  }

  btnClick(data) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      default:
        break;
    }
  }
  selectData(data) { // 选择数据
    this.selectList = data;
  }

  btnAdd() { // 新增
    this.status = 'add';
    this.modalTitle = '审批配置 > 新增';
    this.modalFormVisible = true;
  }

  btnUpdate(){
    if (!this.selectList || this.selectList.length != 1) {
      this.nzMess.warning('提示消息', '请选择一条数据进行操作！');
      return;
    }
    this.status = 'update';
    this.getUpdate();
    this.modalTitle = '审批配置 > 修改';
    this.modalFormVisible = true;
  }

  btnDelete(){ // 删除
    if (!this.selectList || this.selectList.length < 1) {
      this.nzMess.warning('提示消息', '请选择数据进行操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '删除确认',
      nzContent: '<p class="m-re">是否要将选中的数据进行删除?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        let url = urls.deleteApproConfig;
        let params = {approvalModels:[]};
        this.selectList.forEach( item => {
          params.approvalModels.push({documentsTypeId:item.documentsTypeId})
        });
        this.http.post(url, params).then((res: any) => {
          // this.listLoading = false;
          if (res.success) {
            resolve();
            this.nzMess.success('提示消息', res.data.data);
            this.listSearch(this.searchData);
          }else {
            reject();
          }
        });
      })
    });


  }

  getUpdate(){ // 查询详情
    let url = urls.getApproConfigDetail;
    let params = {};
    params['documentsTypeId'] = this.selectList[0].documentsTypeId;
    this.http.post(url, params).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.itemData =res.data && res.data.data || [];
        this.itemData.forEach(item => {
          item.aproUserName = item.aproUserName.split(",");
          item.copyUserName = item.copyUserName.split(",");
          !item.aproUserName[0] && (item.aproUserName[0] = []);
          !item.copyUserName[0] && (item.copyUserName[0] = []);
        });
        this.modalValidateForm.get('documentsTypeId').setValue(res.data.data[0].documentsTypeId);
      }
    });
  }

  selectitem(data) { // 查询子表
    this.selectItem = data;
  }

  addItem() { // 新增
    const level = this.itemData.length == 0 ? 1 : Number(this.itemData[this.itemData.length - 1].level) + 1;
    this.itemData = [...this.itemData, {level: level, checked: false}];
  }

  insert() { // 插入
    if (!this.selectItem || this.selectItem.length != 1) {
      this.nzMess.warning('提示消息', '请选择一条数据进行操作！');
      return;
    }
    let num: any;
    this.itemData.forEach((item, index) => {
      if (Number(item.level) > Number(this.selectItem[0].level)) {
        item.level = Number(item.level) + 1;
      }
      if (Number(item.level) == Number(this.selectItem[0].level)) {
        num = index + 1;
        this.itemData = [...this.itemData];
        this.itemData.splice(num, 0, {level: Number(item.level) + 1, checked: false});
      }
    });

  }

  delete() {  // 删除审核配置信息
    if (!this.selectItem || this.selectItem.length < 1) {
      this.nzMess.warning('提示消息', '请选择数据后操作！');
      return;
    }
    this.itemData = this.itemData.filter(item => !item.checked);
    this.itemData.forEach((item, index) => {
        item.level = index + 1;
    });
    this.selectItem = [];
  }

  nzOnOk() { // 确定弹框
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    if (this.itemData.length == 0) {
      this.msg.error(`明细不能为空！`);
      return;
    }
    if (!this.validatePack()) {
      return;
    }
    let Arr = [];
    let param =  this.modalValidateForm.getRawValue();
    this.itemData.forEach((item,index) => {
      let strApro = item.aproUserName.join(",");
      let strCopy = item.copyUserName.join(",");
      Arr.push(
        {
          "companyId":this.info.APPINFO.USER.companyId,
          "documentsTypeId":param.documentsTypeId,
          "level":item.level,
          "levelName":item.levelName,
          "userId":strApro,
          "userType":"0",
          "relation":item.relation,
          "createId":item.createId,
          "createDate":item.createDate,
          "updateId":item.updateId,
          "updateDate":item.updateDate
        }, {
          "companyId":this.info.APPINFO.USER.companyId,
          "documentsTypeId":param.documentsTypeId,
          "level":item.level,
          "levelName":item.levelName,
          "userId":strCopy,
          "userType":"1",
          "relation":item.relation,
        })
    });
   this.status == 'add' &&  this.insertApproval(Arr);  // 新增确认
   this.status == 'update' &&  this.updataApproval(Arr); // 修改确认
  }

  insertApproval(Arr) {
    let url = urls.insertApprovalConfig;
    this.listLoading = true;
    let param =  this.modalValidateForm.getRawValue();
    param['approvalModels'] = Arr;
    this.http.post(url, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.nzMess.success('提示消息', res.data.data);
        this.listSearch({page: 1, length: this.pageSize});
        this.modalFormVisible = false;
      }
    });
  };

  updataApproval(Arr){
    let url = urls.updateApproConfig;
    this.listLoading = true;
    let param =  this.modalValidateForm.getRawValue();
    param['approvalModels'] = Arr;
    param.createId = this.itemData[0].createId || '';
    param.createDate = this.itemData[0].createDate || '';
    this.http.post(url, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.nzMess.success('提示消息', res.data.data);
        this.listSearch({page: 1, length: this.pageSize});
        this.modalFormVisible = false;
      }
    });
  }

  /**
   * 捆包信息验证
   */
  validatePack(): boolean {
    const validateArray = [
      {ename: 'aproUserName', cname: '审核人'},
      {ename: 'copyUserName', cname: '抄送人'},
      {ename: 'levelName', cname: '审核级别名称'},
    ];
    let errArr = validateArray.filter(f => this.itemData.some(item => !item[f.ename] || item[f.ename].length < 1 ));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(',')}"不能为空！`);
      return false;
    }
    let istrue = true;
    this.itemData.forEach((item,index) => {
      istrue &&  item.aproUserName.forEach(data => {
        istrue &&  item.copyUserName.forEach(param => {
          if (data == param) {
            istrue = false;
            this.nzMess.warning('提示消息', '审核人和抄送人不能选择同一用户！');
          }
        })
      });
    });
    if (!istrue) {
      return false
    }

    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].aproUserName.length > 1 && !this.itemData[i].relation) {
        this.msg.error(`请选择同级别审核人关系`);
        return false;
      }
    }
    return true;
  }

  handleCancel() { // 取消弹框
    this.modalFormVisible = false;
  }

  nzAfterClose() { // 弹框关闭触发
    this.itemData = [];
    this.selectItem = [];
    this.modalValidateForm.reset();
    this.status = '';
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.companyStatic, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

  userColumnsEmit(data) {  // 列表选择框数据查询
    data.forEach(item => {
      item.colEname === 'aproUserName' && (item.apiParameter = {optionList: []});
      item.colEname === 'copyUserName' && (item.apiParameter = {optionList: []});
    });
    let url = urls.getUsers;
    if (!this.aproUserNameArr[0]) {
      this.http.post(url, {}).then((res: any) => {
        if (res.success) {
          this.aproUserNameArr = res.data.data && res.data.data || [];
          this.aproUserNameArr.forEach(
            res => {
              res.name = res.userName;
              res.value = res.userId;
            }
          );
          data.forEach(
            res => {
              if ((res.colEname === 'aproUserName' || res.colEname === 'copyUserName') && res.type === 'moreSelect') {
                Array.prototype.push.apply(res.apiParameter.optionList, this.aproUserNameArr);
              }
            }
          );

        }
      });
    } else {
      data.forEach(
        res => {
          if ((res.colEname === 'aproUserName' || res.colEname === 'copyUserName') && res.type === 'moreSelect') {
            Array.prototype.push.apply(res.apiParameter.optionList, this.aproUserNameArr);
          }
        }
      );
    }

  }
}
