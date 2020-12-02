import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WAREHOUSEURL } from '@model/warehouseUrl';
import { HttpUtilService } from '@service/http-util.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../../../../common/services/common.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';



@Component({
  selector: 'app-warehouse-config',
  templateUrl: './warehouse-config.component.html',
  styleUrls: ['./warehouse-config.component.css']
})
export class WarehouseConfigComponent implements OnInit {
  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';

  tplModal: NzModalRef; // 操作成功后弹窗属性
  InsertFormVisible = false; // 新增弹框
  modalValidateForm: FormGroup; // 新增代码集弹窗
  codeArr: Array<any> = [];
  tempSearchData: any = {};
  UpdateArr: Array<any> = [];
  saveFlag = true;
  isOkLoading = false;
  modalTitle: String;
  parkCode: String;
  parkName: String;
  expandKeys = ['100', '1001'];
  warehouseName: string;
  warehouseCode: string;
  remark: string;
  UpdateFormVisible = false;
  // rowId: any;
  deleteVisible = false; // 删除弹框
  deletemodaltitle: string; // 弹框的标题
  finishCon: string; // 弹窗文字内容
  deleteId: string;
  showName: string;
  showCode: string;
  showMark: string;

  showData: Array<any> = [];

  public dataSetClone = [];

  tempSearch: any = {};

  modalFormData: Array<any> = [];
  modalFormData1: Array<any> = [
    {
      name: '仓库名称',
      eName: 'warehouseName',
      type: 'input',
      validateCon: '请输入仓库名称',
      require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '仓库编码',
      eName: 'warehouseCode',
      type: 'input',
      validateCon: '请输入仓库编码',
      require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '备注',
      eName: 'remark',
      type: 'input',
      validateCon: '',
      require: false,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];
  modalFormData2: Array<any> = [
    {
      name: '仓库名称',
      eName: 'warehouseName',
      type: 'input',
      validateCon: '请输入仓库名称',
      value: '',
      require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '仓库编码',
      eName: 'warehouseCode',
      type: 'input',
      validateCon: '请输入仓库编码',
      value: '',
      require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '备注',
      eName: 'remark',
      type: 'input',
      validateCon: '',
      value: '',
      require: false,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];



  constructor(
    private fb: FormBuilder,
    private cm: CommonService,
    private modal: NzModalService,
    private http: HttpUtilService,
    private info: UserinfoService,
    private nm: NzModalService,
    private nz: NzNotificationService,
  ) {
  }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({
      warehouseName: this.warehouseName || '',
      warehouseCode: this.warehouseCode || '',
      remark: this.remark || '',
    });
    for (let i = 0; i < this.modalFormData.length; i++) {
      const validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    this.updateData = [];
    console.log(data);
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.tempSearch = data;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.MANAGERGETWAREHOUSE;
    this.loading = true;
    this.dataSet = [];
    // this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      console.log(data);
      if (res.success) {
        console.log(res);
        this.loading = false;
        this.updateData = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.forEach((x: any)=>{
          this.dataSetClone = [...this.dataSetClone, {...x}];
        });
      }
    });
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
    // this.rowId = data.data  .rowid;
    // console.log(this.rowId);
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    console.log(data.buttonId);
    switch (data.buttonId) {
      case 'Add':
        this.modalFormData = this.modalFormData1;
        this.doAdd();
        break;
      case 'Delete':
        // this.modalFormData = this.modalFormData2;

        this.doDelete(this.updateData[0]);
        break;
      case 'Update':
        // this.update(this.UpdateArr[0]);
        this.doUpdate(this.updateData[0]);
        break;
      case 'Save':
        // this.saveData(this.dataSet.filter(x=>x.editstate==1)[0]);
        break;
    }


  }

  doAdd() {
    this.InsertFormVisible = true;
  }

  doDelete(data) {
    if (this.updateData.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后删除'
      });
      return;
    }
    this.deletemodaltitle = '提示信息';
    this.finishCon = '是否删除此数据';
    this.deleteId = data.rowid;
    this.deleteVisible = true;
    // this.delete(data);
  }


  doUpdate(data) {
    // this.InsertFormVisible = true;
    console.log(this.updateData);
    if (this.updateData.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    this.update(this.updateData[0]);
  }


  handleCancel() {
    this.InsertFormVisible = false;
    this.UpdateFormVisible = false;
  }


  handleOk() {
    const data = this.modalValidateForm.value;
    if (data.warehouseName === null || data.warehouseCode === null){
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请把信息填写完整!'
      });
      return;
    }
    console.log(data);
    data.requectCompanyID = this.info.APPINFO.USER.companyId;
    data.requestCompanyName = this.info.APPINFO.USER.CompanyName;
    data.requestUserId = this.info.APPINFO.USER.userId;
    data.requestCompanyType = this.info.APPINFO.USER.CompanyType;
    data.requestUserSegmentId = this.info.APPINFO.USER.userUserSegmentId;
    const params = { url: WAREHOUSEURL.ADDNEWWAREHOUSE, data: data, method: 'POST' };
    if (this.InsertFormVisible === true) {
      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
            this.listSearch(this.tempSearch);
            this.isOkLoading = false;
            this.InsertFormVisible = false;
            this.tplModal = this.modal.warning({
              nzTitle: '提示信息',
              nzContent: '新增成功!'
            });
            this.destroyTplModal();


          }
          this.isOkLoading = false;
        });
    } else if (this.UpdateFormVisible === true) {
      this.UpdateFormVisible = true;
      const data1 = this.modalValidateForm.value;
      const url = WAREHOUSEURL.UPDATEWAREHOUSEMANAGE;
      const d = this.dataSetClone.filter((x: any) => x.rowid === data1.rowid);

      console.log(data1);
      console.log('-----');
      data1.requectCompanyID = this.info.APPINFO.USER.companyId;
      data1.requestCompanyName = this.info.APPINFO.USER.CompanyName;
      data1.requestUserId = this.info.APPINFO.USER.userId;
      data1.requestCompanyType = this.info.APPINFO.USER.CompanyType;
      data1.requestUserSegmentId = this.info.APPINFO.USER.userUserSegmentId;
      data1.rowId = this.updateData[0].rowId;
      if (data1.warehouseName === null || data1.warehouseCode === null){
        data1.warehouseName = d[0].warehouseName;
        data1.warehouseCode = d[0].warehouseCode;
      }

      const param = { url: WAREHOUSEURL.UPDATEWAREHOUSEMANAGE, data: data1, method: 'POST' };
      this.http.request(param).then(
        (res: any) => {
          if (res.success) {
            this.listSearch(this.tempSearch);
            this.isOkLoading = false;
            this.UpdateFormVisible = false;
            this.tplModal = this.modal.warning({
              nzTitle: '提示信息',
              nzContent: '修改成功!'
            });
            this.destroyTplModal();
          }
          this.isOkLoading = false;
        });
    }
  }

  closeResult() {
    this.modalValidateForm.reset();
  }

  destroyTplModal(): void { // 提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }


  update(data: any) {
    /*     this.InsertFormVisible = true;
         if(this.buttonId === 'OK') {*/
    // console.log(this.updateData[0]);
    // this.showData.push(this.updateData[0].warehouseCode);
    // this.showData.push(this.updateData[0].warehouseName);
    // this.showData.push(this.updateData[0].remark);
    this.UpdateFormVisible = true;
    this.modalValidateForm.patchValue(this.updateData[0]);
    // this.modalFormData2[0].value = this.updateData[0].warehouseName;
    // this.modalFormData2[1].value = this.updateData[0].warehouseCode;
    // this.modalFormData2[2].value = this.updateData[0].remark;
  }
  // }

  deleteData(data) {
    // console.log(data)
    if ('ok' === data.type) {
      console.log(this.updateData[0].rowId);
      this.http.post(WAREHOUSEURL.DELETEWAREHOUSEMANAGE, { rowId: this.updateData[0].rowId }).then(
        (res: any) => {
          console.log(this.updateData[0].rowid);
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.deleteVisible = false;
            this.getList({ page: 1, length: this.pageSize });
            // this.query();
          }
        }
      );
    } else if ('cancel' === data.type) {
      console.log('取消');
      this.deleteVisible = false;
    }
  }

}
