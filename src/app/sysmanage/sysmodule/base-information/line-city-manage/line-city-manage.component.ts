import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';

@Component({
  selector: 'app-line-city-manage',
  templateUrl: './line-city-manage.component.html',
  styleUrls: ['./line-city-manage.component.css']
})

export class LineCityManageComponent implements OnInit {

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  typeDataArr: Array<any> = [{value: 1, name: '是'}, {value: 0, name: '否'}];
  inputModalModel: string;
  borderRed: boolean = false;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  cityArr: Array<any> = [];
  lineArr: Array<any> = [];
  modalFormData: Array<any> = [
    // {
    //   name: '公司名称', eName: 'companyName', type: 'modal', validateCon: '请输入公司名称', require: true,disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '线路名称', eName: 'lineName', type: 'selectL', validateCon: '请输入线路名', require: false,disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    {
      name: '线路名称', eName: 'lineName', type: 'text', validateCon: '请输入线路名', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '城市名称', eName: 'cityName', type: 'selectC', validateCon: '请输入城市名', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '标载重量', eName: 'loadWeight', type: 'number', validateCon: '标载重量', require: true, disabled: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[0-9]+$',
        patternErr: '请输入正整数'
      }
    },
    {
      name: '大载重量', eName: 'bigLoadWeight', type: 'number', validateCon: '请输入大载重量', require: true, disabled: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[0-9]+$',
        patternErr: '请输入正整数'
      }
    },

    {
      name: '理论到货小时数', eName: 'arrivalHour', type: 'number', validateCon: '请输入理论到货小时数', require: false, disabled: false,
      validators: {
        require: false,
        pattern: true,
        patternStr: '^[0-9]+([.]{1}[0-9]{1,2})?$',
        patternErr: '正整数或保留两位小数'
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }
  ];

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  private tplModal: NzModalRef; // 弹窗相关

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  private rowid: any;
  buttonId: string;
  getcompanyId: string;

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getAddressData({level: 'DZDJ20', parentCode: 370000000});

    // let url = TRANS_URLS.cargoTraceLine;
    //         // this.http.post(url,{}).then((res:any)=>{
    //         //   if(res.success){
    //         //     this.lineArr = res.data.data && res.data.data.data || [];
    //         //   }
    //         // })
    this.getcompanyId = this.info.APPINFO.USER.companyId;
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }


  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getLineCity;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          console.log(res);
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.data.length;
          console.log(this.totalPage);
        }
      }
    );
  }

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            // case 'DZDJ10': {
            // this.provinceArr = res.data.data;
            // }
            //   break;
            case 'DZDJ20': {
              this.cityArr = res.data.data || [];
            }
              break;
          }
        }
      }
    );
  }

  // 添加
  btnAdd() {
    this.inputModalModel = '';
    // this.modalValidateForm.get('companyName').setValue('');
    this.modalFormVisible = true;
    this.modalTitle = '线路和城市对照 > 新增';
    this.status = 'add';
    // this.inputModalModel = this.info.get('USER').companyName;
    // this.modalValidateForm.get('companyId').setValue( this.getcompanyId);
  }

  // 修改
  btnUpdate(data: any) {

    if (!data || data.data.length < 1) {
      this.tplModal = this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      // this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      // this.destroyTplModal();
      return;
    }
    this.inputModalModel = data.data[0].companyName;
    this.modalFormVisible = true;
    this.modalTitle = '线路和城市对照 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
  }

  btnDelete(data: any) {  // 删除
    if (data.data.length < 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;
  }

  addData(data: any) { // 添加数据
    this.status = '';
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertLineCity;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '添加成功！');
        } else {
          this.nzMess.error('提示消息', '添加失败！');
        }
      }
    );
  }

  deleteData() {   // 删除数据
    this.status = '';
    const params = {url: '', data: {tLineCityModels: []}, method: 'POST'};
    params.url = urls.deleteLineCity;
    params.data.tLineCityModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nzMess.success('提示消息', '删除成功！');
        } else {
          this.nzMess.error('提示消息', '删除失败！');
        }
      }
    );
  }


  handleOk() {  // 弹出框相关
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.value);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.value);
    }
  }

  updateData(data: any) {   // 修改数据
    this.status = '';
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateLineCity;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {

        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
        } else {
          this.nzMess.error('提示消息', '修改失败！');
        }
      }
    );
  }


  handleCancel() {
    this.modalFormVisible = false;
  }

  closeResult() {
    this.modalValidateForm.reset();
  }

  modalConfirmResult(data: any) {     // 确认框结果
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  inpEmit(data: any) {
    this.modalValidateForm.get('companyName').setValue(data.inpValue);
  }
}
