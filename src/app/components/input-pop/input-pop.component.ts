import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {localUrls} from '@model/localUrls';
import {delay} from 'rxjs/operators';
import {of} from 'rxjs';
import {inpModalUrl} from '@model/inpModalUrl';
import {NzNotificationService, NzMessageService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';

@Component({
  selector: 'app-input-pop',
  templateUrl: './input-pop.component.html',
  styles: ['.search-modal-input{max-width:150px}',
    '.borderRed{border-color:#f5222d}',
    '.borderRed:focus,.borderRed:hover{box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);border-color: #f5222d!important;}',
    '.ant-form-explain{margin-top: 0}',
    '.inputmodal ::ng-deep .ant-table-wrapper div.ant-table-body{min-height:200px !important; height:300px; margin-top:17px;}',
    '.explain{position:absolute;bottom:-18px;left: 0;}', '.modalSearch{margin-bottom:20px;}'
  ]
})
export class InputPopComponent implements OnInit {
  searchStatus: String = 'out';  //标识查询条件取自外部还是内部
  @Input() DISABLED: boolean = false;
  //若需进行验证，传入validate对象  其中validateOpt区分验证name还是value，validateCon为验证不通过的提示，验证不通过时发射属性validatePass
  // @Input() validate: any = {validateOpt:'inpValue',validateCon:'请输入公司名称'};
  @Input() width: number = 1000;//弹窗宽度，自定义，默认1000
  @Input() validate: any = {};
  @Input() isExplain: boolean = true; // 默认警告样式
  @Input() insertType: any; //传入类型，新增显示框 类型
  @Input() borderRed: boolean;
  @Input() findset: any; //接收url，formId的对象
  @Input() inputModalModel: any; //默认显示到输入框的值
  @Output() inputModalModelChange = new EventEmitter<any>();
  @Input() inputSize: string = 'default';//input框大小默认
  @Output() selectedData = new EventEmitter<any>();//传递参数
  @Input() isMutli: any;//是否允许列表多选
  @Output() ngModelChange = new EventEmitter<any>();//ngModelChange
  @Output() tipShow = new EventEmitter<any>();
  @Output() inpEmit = new EventEmitter<any>(); //选择数据触发
  @Input() inputModalHiddenValue: any;//隐藏框值
  @Input() popData: any = {};//接收数据绑定到输入框
  @Input() eName: any;
  @Input() searchParamFiled: any;
  @Input() searchParamFiledNot: boolean;//true格式不传
  @Input() searchValue: any;

  @Input() popIndex: any;//组件在table中的索引
  @Input() popTableData: any = [];//组件存在于table中时接收的数据绑定
  @Input() showExplainFlag: boolean = false; //提示信息显示的判断
  @Input() paramsSend: any; //传入数据
  @Output() blurEmit = new EventEmitter<any>();
  // @Output() showExplainFlagChange = new EventEmitter<any>();
  // @Input() blurStatus:boolean = false; // 失焦触发状态 默认失焦不触发事件
  showAddInfo: boolean = false;
  modalshow: boolean = false;
  visible: boolean = false;
  radioArr: [{ value: '10', cname: '是' }, { value: '00', cname: '否' }];

  allChecked = false;
  indeterminate = false;
  currentpage: any = 1;//默认第一页
  pageSize: number = 30;//每页30条
  tempSearchCondition: any;//临时存储查询条件
  total: number = 0;
  listHeader = [];
  listData = []; //列表数据
  inputModalSearchValue: any; //弹窗内搜索框的值
  customerCode: any;
  customerName: any;
  areaInfo: any = {};//存储省市区
  addressName: any;//地点名称
  addressNameDetail: any;//详细地址
  tableHeight: string;
  @ViewChild('table') modalTable: any;
  private table: HTMLElement;
  isDefault: any;
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [

    {
      name: '省市区乡', eName: 'locationName', type: 'model', require: true, validateCon: '请输入省市区乡',
      disabled: false, span: 16, span1: 3, span2: 21
    },
    {
      name: '详细地址', eName: 'address', type: 'text', require: true, validateCon: '请输入详细地址',
      disabled: false, span: 16, span1: 3, span2: 21
    },
    // {
    //   name: '客户名称', eName: 'customerId', type: 'popTwo', validateCon: '请选择客户', require: true,
    //   findset: {
    //     formId: 'form_bank_tan',
    //     name: '客户名称',
    //     parameter: 'companyName', // 发送请求的参数
    //     parameterSend: 'companyId',
    //     url: 'getCompanyBankThree'
    //   },
    //   validate: {validateOpt: 'inpValue', validateCon: '请选择客户'},
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },

    {
      name: '是否默认地址', eName: 'isDefault', type: 'radio', validateCon: '请选择是否为默认地址', require: true,
      validators: {
        require: true,
        pattern: false,
      },
      radioArr: [{value: '10', name: '是'}, {value: '00', name: '否'}]
    },


  ];

  // private searchData:any;
  constructor(private http: HttpUtilService, private fb: FormBuilder, private info: UserinfoService, private nn: NzNotificationService, private msg: NzMessageService) {
  }

  ngOnInit() {
    this.findset = typeof (this.findset) == 'string' ? this.findset && JSON.parse(this.findset) : this.findset;
    if (this.findset.insertType) {
      this.insertType = this.findset.insertType;
    }

    if (this.eName) {
      if (this.popData) {
        this.inputModalModel = this.popData[this.eName].name;
        this.inputModalHiddenValue = this.popData[this.eName].value;
      }

      if (this.popTableData.length > 0) {
        this.inputModalModel = this.popTableData[this.popIndex][this.eName].name;
        this.inputModalHiddenValue = this.popTableData[this.popIndex][this.eName].value;
      }
    }

    if (this.inputModalHiddenValue) {
      this.inputModalModelChange.emit(this.inputModalModel);
      this.inpEmit.emit({inpName: this.inputModalModel || '', inpValue: this.inputModalHiddenValue || '', inpValidate: 'VALID'});
    }

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: null, disabled: control.disabled}, control.require ? Validators.required : null
      ));
    }
  }

  getListHead() {
    //获取数据弹窗表头
    let urlColumns = localUrls.getColumnsUrl;
    let paramColumns = {formId: this.findset.formId};
    this.http.post(urlColumns, paramColumns).then(
      (res: any) => {
        if (res.success) {
          this.listHeader = res.data.data;
          this.columnsFilter();
        }
      }
    );
  }

  refreshStatus(data?: any): void {
    // console.log(data.checked);
    const allChecked = this.listData.every(value => value.checked === true);
    const allUnChecked = this.listData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    if (!this.isMutli) {
      this.listData.map((list: any) => {
        list.checked = false; //单选情况下设置checked;
      });
      data.checked = !data.checked;
    }

  }

  checkAll(value: boolean): void {
    this.listData.forEach(data => {
        if (!data.disabled) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus();
  }


  handleOk(): void {
    this.inputModalSearchValue = '';
    let sel_Data = [];
    let nameArr = [];
    let valueArr = [];
    // console.log(this.listData);
    for (let item of this.listData) {
      if (item.checked) {
        sel_Data.push(item);
        nameArr.push(item[this.findset.parameter]);
        valueArr.push(item[this.findset.parameterSend]);
      }
    }
    // console.log(nameArr);
    // console.log(valueArr);

    if (nameArr.length != 0) {
      this.inputModalModel = nameArr[0];
      this.inputModalHiddenValue = valueArr[0];
    }
    // this.inputModalModel = nameArr.join[','];
    this.selectedData.emit({data: sel_Data});
    if (this.validate.validateOpt === 'inpName') {
      this.showExplainFlag = !this.inputModalModel || this.inputModalModel == '';
    } else if (this.validate.validateOpt === 'inpValue') {
      this.showExplainFlag = !this.inputModalHiddenValue || this.inputModalHiddenValue == '';
    }
    this.inputModalModelChange.emit(this.inputModalModel);
    this.inpEmit.emit({
      inpName: this.inputModalModel,
      inpValue: this.inputModalHiddenValue || '',
      selData: sel_Data,
      inpValidate: this.showExplainFlag ? 'INVALID' : 'VALID'
    });

    this.ngModelChange.emit(this.inputModalModel); //
    this.visible = false;
    of(this.visible).pipe(delay(500)).subscribe((x) => this.modalshow = x);

  }

  handleCancel(): void {
    this.inputModalSearchValue = '';
    this.visible = false;
    of(this.visible).pipe(delay(500)).subscribe((x) => this.modalshow = x);

  }

  keyUp(e?: any, p?: any, s?: any): void {
    if (s) {
      this.searchStatus = 'in';
    } else {
      this.searchStatus = 'out';
    }
    if (!this.DISABLED) {
      this.currentpage = 1;
      if (e) {
        if (e.keyCode === 13) {
          this.getModalData(p, s);
        }
      } else {
        this.getModalData(p, s);
      }
    }
  }

  add(): void {
    this.addressName = this.addressNameDetail = '';
    this.showAddInfo = !this.showAddInfo;
  }

  areaEmit(data: any) {
    this.areaInfo = data;
  }

  sureAdd(): void {
    if (this.insertType === 'address') {
      let params: any = {
        provinceName: this.areaInfo.provinceValue && this.areaInfo.provinceValue.name || '',//省
        cityName: this.areaInfo.cityValue && this.areaInfo.cityValue.name || '',//市
        districtName: this.areaInfo.areaValue && this.areaInfo.areaValue.name || '',//区
        provinceCode: this.areaInfo.provinceValue && this.areaInfo.provinceValue.code || '',//省
        cityCode: this.areaInfo.cityValue && this.areaInfo.cityValue.code || '',//市
        districtCode: this.areaInfo.areaValue && this.areaInfo.areaValue.code || '',//区
        townName: this.areaInfo.townValue && this.areaInfo.townValue.name || '',//地点名称
        townCode: this.areaInfo.townValue && this.areaInfo.townValue.code || '' //详细地址
      };
      const pointValidate: Array<any> = [
        {ename: 'provinceName', cname: '省名称', required: true},
        {ename: 'provinceCode', cname: '省编码', required: true},
        {ename: 'cityName', cname: '市名称', required: true},
        {ename: 'cityCode', cname: '市编码', required: true},
        {ename: 'districtName', cname: '区名称', required: true},
        {ename: 'districtCode', cname: '区编码', required: true},
        {ename: 'townName', cname: '乡名称'},
        {ename: 'townCode', cname: '乡编码'},
      ];
      const msg = pointValidate.filter(filed => filed.required && !params[filed.ename]).map(item => item.cname).join(',');
      if (!msg) {
        this.modalValidateForm.get('locationName').setValue(params.provinceName + params.cityName + params.districtName + params.townName);
      }

      for (const i in this.modalValidateForm.controls) {
        this.modalValidateForm.controls[i].markAsDirty();
        this.modalValidateForm.controls[i].updateValueAndValidity();
      }
      if ('INVALID' === this.modalValidateForm.status) {
        return;
      }
      let potin = this.modalValidateForm.getRawValue();
      params = {...potin, ...params};
      params[this.findset.paramsSend] = this.paramsSend || null;
      let url = urls.addCommonAddress;
      this.http.post(url, params).then(
        (res: any) => {
          if (res.success) {
            this.nn.create('success', '提示信息', '添加成功', {nzDuration: 3000});
            // const params = res.data.data;
            // params.checked = true;
            // this.listData = [params, ...this.listData];
            this.showAddInfo = false;
            this.modalValidateForm.reset();
            this.getModalData(this.tempSearchCondition);

          }
        }
      );
    }
  }

  pageChange(page: any): void {
    this.currentpage = page;
    this.getModalData(this.tempSearchCondition);
  }

  modelChange(data: any) {

    this.inputModalModelChange.emit(this.inputModalModel = data);
    if (!data || data == '') {
      this.tipShow.emit({tipShow: true});
    } else {
      this.tipShow.emit({tipShow: false});
    }
    this.inputModalHiddenValue = '';
    if (this.validate.validateOpt === 'inpName') {
      this.showExplainFlag = !data || data == '';
    } else if (this.validate.validateOpt === 'inpValue') {
      this.showExplainFlag = !this.inputModalHiddenValue || this.inputModalHiddenValue == '';
    }
    this.inpEmit.emit({inpName: data, inpValue: this.inputModalHiddenValue || '', inpValidate: this.showExplainFlag ? 'INVALID' : 'VALID'});
    this.ngModelChange.emit(data);
  }

  getModalData(p, s?: any): void {
    this.addressName = this.addressNameDetail = '';
    if (this.searchStatus == 'out') {
      this.tempSearchCondition = this.inputModalModel || '';
    } else {
      this.tempSearchCondition = this.inputModalSearchValue || '';
    }
    this.getListHead();
    //获取列表数据
    let url = this.findset.url ? inpModalUrl[this.findset.url] : inpModalUrl['default'];
    let param = {page: this.currentpage, length: this.pageSize};
    this.searchStatus == 'in' && (param[this.findset.parameter] = p);
    param[this.findset.paramsSend] = this.paramsSend || null;
    if (this.findset.parameterSend === 'companyId') {
      param[this.findset.parameterSend] = this.info.APPINFO.USER.companyId;
    }
    if (this.searchParamFiled && this.searchValue) {
      if (!this.searchParamFiledNot) {
        param[this.searchParamFiled] = this.searchValue;
      }
    }

    param['formId'] = this.findset.formId;
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.listData = res.data.data.data;
          // console.log(this.listData);
          this.total = res.data.data.total;
          this.modalshow = true;
          of(this.modalshow).pipe(delay(30)).subscribe(
            (x) => {
              this.visible = x;
              this.allChecked = false;
              this.indeterminate = false;
            }
          );
        }
      }
    );
  }

  heightTable(data: number) {
    this.tableHeight = `${data}px`;
  }

  /**
   * 表头获取数据刷选
   */
  columnsFilter(): void {
    this.listHeader = this.listHeader.filter((x: any) => x.visible == 'XSBJ10');
  }

  /**
   * blur和focus
   */
  blurFocus(value: Boolean): void {
    this.blurEmit.emit(value);
  }


  /**
   * 公司设置值
   * @param data
   */
  inpEmitTwo(data: any) {
    this.customerName = data.inpName || '';
    this.customerCode = data.inpValue || '';
    this.modalValidateForm.get('customerId').setValue(data.inpValue);

  }

}
