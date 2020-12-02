import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from "../../../../common/util/utils";
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

@Component({
  selector: 'app-vechile-prod-manage',
  templateUrl: './vechile-prod-manage.component.html',
  styleUrls: ['./vechile-prod-manage.component.css']
})
export class VechileProdManageComponent implements OnInit {


  modalTitle: string; // 弹出框标题
  // deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  prodKindPriceArr: Array<any> = [];
  weightArr: Array<any> = [];
  modalFormVisible: boolean = false;
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;
  borderRed: boolean = false; // 公司名字输入状态
  inputModalModel: string; // 公司名字 输入

  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  addModalFormData: Array<any> = [
    // {
    //   name: '公司Id', eName: 'companyId', type: '', validateCon: '请输入Id', require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '公司名称', eName: 'companyId', type: 'modal', validateCon: '请选择公司', require: true,disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    {
      name: '品种',
      eName: 'prodName',
      type: 'select',
      validateCon: '请输入品种',
      require: true,
      disabled: false,
      selectArr: this.prodKindPriceArr,
      validators: {
        require: true,
        pattern: false,
      }

    },
    {
      name: '车型',
      eName: 'vechileType',
      type: 'select',
      validateCon: '请输入车型',
      require: true,
      disabled: false,
      selectArr: this.weightArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '流向', eName: 'flowAddress', type: 'select1', validateCon: '请输入流向', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '车队', eName: 'consignee', type: 'text', validateCon: '请输入车队', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '载重量', eName: 'vechileWeight', type: 'number', validateCon: '请输入重量标准', require: true, disabled: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[0-9]+([.]{1}[0-9]{1,2})?$',
        patternErr: '整数或保留两位小数'
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    }

  ];
  // formId: string = 'form_vechile_prod';
  confimCon: string;
  implistLoading: boolean = false; //导入确定加载
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  // validateForm: FormGroup;
  // total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  selectData1: any = [];
  private rowid: any;
  buttonId: string;
  getcompanyId: string;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});// 数据弹出框初始化
    this.getcompanyId = this.info.APPINFO.USER.companyId;

    this.getAddressData({level: 'DZDJ20', parentCode: 370000000});
    this.getStatic(this.weightArr, 'ZZBJ');
    this.getStatic(this.prodKindPriceArr, 'JGPZ');

    this.modalValidateForm = this.fb.group({});
    this.addModalFormData = this.addModalFormData ? this.addModalFormData : [];

    for (let i = 0; i < this.addModalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.addModalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }

      if (this.addModalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.addModalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.addModalFormData[i].eName, new FormControl(
        {value: '', disabled: this.addModalFormData[i].disabled}, validatorOrOpts
      ));
    }
    // console.log(this.weightArr)

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
    params.url = urls.getVechileProd;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }

  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {

    switch (button.buttonId) {
      case "Add" :
        this.add();
        break;
      case "Update":
        this.update();
        break;
      case "Delete":
        this.delete();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          // console.log(res);
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  add() {
    this.inputModalModel = "";
    // this.modalValidateForm.get('companyId').setValue('');
    this.modalFormVisible = true;
    this.modalTitle = '品种车型对照 > 新增';
    this.status = 'add';

    // this.inputModalModel = this.info.get('USER').companyName;
    // this.modalValidateForm.get('companyId').setValue( this.getcompanyId);

  }

  addData(data: any) { // 添加数据
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertVechileProd;
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

  update() {  //修改
    if (!this.selectData1 || !this.selectData1[0]) {
      this.tplModal = this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      // this.destroyTplModal();
      return;
    }
    if (!this.selectData1 || this.selectData1.length > 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      return;
    }
    this.inputModalModel = this.selectData1[0].companyName;
    this.modalFormVisible = true;
    this.modalTitle = '品种车型对照 > 修改';
    this.status = 'update';
    this.rowid = this.selectData1[0].rowid;
    this.modalValidateForm.patchValue(this.selectData1[0]);

  }


  updateData(data: any) { // 添加数据
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateVechileProd;
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

  delete() {
    if (this.selectData1.length < 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.confimCon = "确定删除该条记录？";
    this.tplModal = this.nzModal.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    });

    this.modalTitle = '品种车型对照 > 删除';
    this.status = 'delete';
    this.selectedData = this.selectData1;
  }

  deleteData() {   // 删除数据
    this.status = "";
    const params = {url: '', data: {tVechileProdModels: []}, method: 'POST'};
    params.url = urls.deleteVechileProd;
    params.data.tVechileProdModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nzMess.success('提示消息', '删除成功！');
          this.selectData1 = [];
          this.handleCancel();
        } else {
          this.nzMess.error('提示消息', '删除失败！');
        }
      }
    );
  }

  selectData(data: any) {         // 主列表数据多选框选择
    this.selectData1 = data;
  }

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
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
    if ('INVALID' === this.modalValidateForm.status && 'delete' === this.status) {
      this.deleteData();
    }
  }

  closeResult() {
    this.modalValidateForm.reset();
  }

  addhandleCancel() {
    this.modalFormVisible = false;
  }

  inpEmit(data: any) {

    this.modalValidateForm.get('companyId').setValue(data.inpValue);
  }

  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        } else {
          Array.prototype.push.apply(data, []);
        }
      }
    );
  }

}
