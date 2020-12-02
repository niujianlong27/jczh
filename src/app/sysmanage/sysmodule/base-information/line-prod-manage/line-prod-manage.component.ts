import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-line-prod-manage',
  templateUrl: './line-prod-manage.component.html',
  styleUrls: ['./line-prod-manage.component.css']
})
export class LineProdManageComponent implements OnInit {

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  inputModalModel: string;
  modalFormVisible: boolean = false;
  borderRed: boolean = false;
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;

  prodKindPriceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  typeArr:Array<any> = [];

  addModalFormData: Array<any> = [
    {
      name: '城市', eName: 'flowAddress', type: 'city', validateCon: '请输入流向', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '卸货地', eName: 'loadPlace', type: 'area', validateCon: '请输入卸货地', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '产品',
      eName: 'prodKind',
      type: 'select',
      validateCon: '请输入产品',
      require: false,
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '载重类型', eName: 'weight', type: 'type', validateCon: '请选择载重类型', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
        name: '吨位', eName: 'loadWeight', type: 'number', validateCon: '请输入吨位', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    }

  ];

  confirmRef: NzModalRef;
  formId: string = 'form_Fleet_ratio';
  columnsArr: any;
  implistLoading: boolean = false; //导入确定加载
  importFile: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  selectData1: any = [];
  private rowid: any;
  buttonId: string;
  getcompanyId: string;
  confimCon: string;
  importLoading: boolean;
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private xlsx: XlsxService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getcompanyId = this.info.APPINFO.USER.companyId;
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.addModalFormData = this.addModalFormData ? this.addModalFormData : [];
    for (let i = 0; i < this.addModalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.addModalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.addModalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.addModalFormData[i].validators.patternStr));

      this.modalValidateForm.addControl(this.addModalFormData[i].eName, new FormControl(
        {value: '', disabled: this.addModalFormData[i].disabled}, validatorOrOpts
      ));
    }
    this.getAddressData({level: 'DZDJ20', parentCode: 370000000});
    this.getStatic();
    this.getStatic1(this.typeArr,'ZZBJ')
    console.log(this.typeArr)
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
    params.url = urls.selectlineProd;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          console.log(res);
          this.dataSet = res.data.data .data|| [];
          this.totalPage = res.data.data.total;

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
      case "Updata":
        this.update();
        break;
      case "Delete":
        this.delete();
        break;

      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }

  add() {
    this.inputModalModel = "";
    // this.modalValidateForm.get('companyName').setValue('');
    this.modalFormVisible = true;
    this.modalTitle = '线路品种载重 > 新增';
    this.status = 'add';
    // this.inputModalModel = this.info.get('USER').companyName;
    // this.modalValidateForm.get('companyId').setValue( this.getcompanyId);
  }

  addData(data: any) { // 添加数据
    this.status = "";
    if(data.loadPlace==null){
      data.loadPlace='';
    }
    console.log(data)
    this.http.post(urls.addlineProd, data).then(res => {
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

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
            }
              break;
          }
        }

      })
  }

  update() {  //修改

    if (!this.selectData1 || !this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if (!this.selectData1 || this.selectData1.length > 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }
    // this.inputModalModel = this.selectData1[0].companyName;
    this.modalFormVisible = true;
    this.modalTitle = '线路品种载重 > 修改';
    this.status = 'update';
    this.rowid = this.selectData1[0].rowid;
    console.log(this.selectData1)
    this.modalValidateForm.patchValue(this.selectData1[0]);

  }


  updateData(data: any) { // 添加数据
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updatelineProd;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {

          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
          this.selectData1 = [];
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
    })

    this.modalTitle = '线路品种载重 > 删除';
    this.status = 'delete';
    this.selectedData = this.selectData1;
  }

  deleteData() {   // 删除数据
    this.status = "";
    const params = {url: '', data: {tProdLoadModels: []}, method: 'POST'};
    params.url = urls.deletelineProd;
    params.data.tProdLoadModels = this.selectedData;

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
    )
  }

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  handleOk() {  // 弹出框相关
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    let param :any = {}
    param=this.modalValidateForm.value
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(param);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(param);
    }
    if ('INVALID' === this.modalValidateForm.status && 'delete' === this.status) {
      this.deleteData();
    }
    // this.modalValidateForm.reset();
  }



  selectData(data: any) { // 主列表数据多选框选择
    this.selectData1 = data;
    console.log(this.selectData1);
  }

  closeResult() {
    this.modalValidateForm.reset();
  }

  addhandleCancel() {
    this.modalFormVisible = false;
  }



  inpEmit(data: any) {
    this.modalValidateForm.get('companyName').setValue(data.inpValue);
  }

  getStatic(): void {

    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        console.log(res)
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPrice,value:item.prodKindPrice})
          });
          this.prodKindPriceArr = [...arr];
        }
      }
    );
  }

  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('loadPlace').reset({value: null, disabled: false},);
        }
      }
        break;
    }
  }
  getStatic1(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          if(valueSetCode=='ZZBJ'){
            for( let i=0;i<res.data.data.data.length;i++){
              if(res.data.data.data[i].value=='ZZBJ30'){
                res.data.data.data.splice(i,1)
              }
            }
          }
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }
}
