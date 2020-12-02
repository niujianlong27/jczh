import { Component, OnInit } from '@angular/core';
import {urls} from '../../../../common/model/url';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, retry} from 'rxjs/operators';
import {of} from 'rxjs';
import {format} from 'date-fns';
import {TRANS_URLS} from '../../../../common/model/trans-urls';

@Component({
  selector: 'app-kilometre-manage',
  templateUrl: './kilometre-manage.component.html',
  styleUrls: ['./kilometre-manage.component.css']
})
export class KilometreManageComponent implements OnInit {
  private tplModal: NzModalRef; // 弹窗相关

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  weightArr: Array<any> = [];
  prodNameArr: Array<any> = [];

  modalFormData: Array<any> = [];

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  //rowid :string;
  defaultFormat = (val: string | number) => val;
  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;
   rowid: any;
  findset: any = {
    url: 'getBusiSegment',
    formId: 'form_busi',
    name: '业务板块',
    parameter: 'segmentName',
    parameterSend: 'segmentId'
  };
  //inputModalModel: string = ''; // 业务模块 输入

  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  radioArr: Array<any> = [];
  data: any;

  selectedCompany: any; // 当前公司

  constructor(private http: HttpUtilService,
              private anhttp: HttpClient,
              private fb: FormBuilder,
              private nm: NzModalService,
              private info: UserinfoService,
              private nn: NzNotificationService) {
  }
  private modalValidateFormInit(){
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
        {value: null, disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }
  private commonModalForm(){
    this.modalFormData = [
      {
        name: '有效标记 ', eName: 'isActive', type: 'radio', validateCon: '请选择有效标记', require: true, disabled: false,
        validators: {
          require: true,
          pattern: false,
        }
      },
      {
        name: '省', eName: 'province', type: 'province', validateCon: '请选省', require: true, disabled: false,
        validators: {
          require: true,
          pattern: false,
        }
      },
      {
        name: '市', eName: 'city', type: 'city', validateCon: '请选市', require: false, disabled: true,
        validators: {
          require: false,
          pattern: false,
        }
      },
      {
        name: '区', eName: 'area', type: 'area', validateCon: '请选区', require: false, disabled: true,
        validators: {
          require: false,
          pattern: false,
          patternStr: '[a-zA-Z0-9]*',
          patternErr: '界面名称格式不正确，只能填数字或字母'
        }
      },
      {
        name: '乡', eName: 'town', type: 'town', validateCon: '请选乡', require: false, disabled: true,
        validators: {
          require: false,
          pattern: false,
        }
      },
      {
        name: '价格品种',
        eName: 'prodName',
        type: 'prodName',
        validateCon: '请输入价格品种',
        require: true,
        disabled: false,
        selectArr: this.prodNameArr,
        validators: {
          require: true,
          pattern: false,
        }
      },
      {
        name: '单价', eName: 'unitPrice', type: 'number', validateCon: '请输入单价', require: true, disabled: false,
        validators: {
          require: true,
          pattern: false,
        }
      },
      {
        name: '备注 ', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
        validators: {
          require: false,
          pattern: false,
        }
      }
    ];
    this.modalValidateFormInit();
  }
  ngOnInit() {
   // this.listSearch({page:1,length:100});
    this.getprodKindPrice();
    this.getAddressData({level: 'DZDJ10'});

    this.getStatic(this.radioArr, 'ZT');
    this.getStatic(this.weightArr, 'ZZBJ');

  }

  btnClick(data) {
    switch (data.type.buttonId) {
      // case 'Export': {
      //   this.export()
      // }
      //   break;
      // case 'Import': {
      //   this.importModal.title = `应付价格管理 > ${data.type.buttonName}`;
      //   this.importModal.visible = true;
      //   this.importModal.fileList = [];
      // }
        //break;
    //   case 'RaisePrice':
    //     this.status = data.type.buttonId;
    //     this.raisePriceModal(data);
    //     break;
     }
  }

  private confrimRaisePrice(data:any){
    data.townList = data.town.map(x => ({town: x}));
    data.town = null;
    let params = {...data};
    params.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    params.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    this.anhttp.post(urls.ModifyPrice,params).subscribe(
      (res:any) => {
        if(res.code === 100){
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', res.msg);
        }
      }
    )
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectKilo;
    data.isAll = false;
    params.data = data;
    this.data = {...data};
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
          console.log(this.dataSet);
        }
      }
    );
  }

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertKiloList;
    //data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
   // data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    //data.provinceCode = data.provinceCode;
  //  data.cityCode = this.data.cityCode;
  //  data.areaCode = this.data.areaCode;
  //  data.townCode = this.data.townCode;
    params.data = {...data};
    params.data['prodName'] =data.prodName;
    params.data['isActive'] =data.isActive;
    params.data['provinceCode'] = data.province;
    params.data['cityCode'] = data.city;
    params.data['areaCode'] = data.area;
    params.data['townCode'] = data.town;
    params.data['province'] = undefined;
    params.data['city'] = undefined;
    params.data['area'] = undefined;
    params.data['town'] = undefined;
    //params.data = data;
    console.log(params)
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        } else {
          this.nn.error('提示消息', '添加失败！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateKiloList;
    data.rowid = this.rowid;
    console.log(data.rowid)
    //data.town = data.town?data.town:'';
    //data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    //data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    //params.data = data;
    console.log(data);
    params.data = {...data};
    params.data['provinceCode'] = data.province;
    params.data['cityCode'] = data.city;
    params.data['areaCode'] = data.area;
    params.data['townCode'] = data.town;
    console.log(params.data);
    // params.data['province'] = undefined;
    // params.data['city'] = undefined;
    // params.data['area'] = undefined;
    // params.data['town'] = undefined;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        } else {
          this.nn.error('提示消息', '修改失败！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tLineKilepriceModelList: []}, method: 'POST'};
    params.url = urls.deleteKiloList;
    params.data.tLineKilepriceModelList = this.selectedData;
    //data.rowid = this.rowid;
    //params.data= this.selectedData[0];
    console.log(params);
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          //console.log(this.selectedData);
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        } else {
          this.nn.error('提示消息', '删除失败！');
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
    //console.log(1111);
  }

  // 添加
  btnAdd() {
    this.commonModalForm();
    this.modalFormVisible = true;
    this.modalTitle = '吨公里单价管理 > 新增';
    this.status = 'add';
    this.modalValidateForm.get('isActive').setValue('10');
  }

  // 修改
  btnUpdate(data: any) {
    console.log(data)
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
    this.commonModalForm();
    this.modalTitle = '吨公里单价管理 > 修改';
    this.status = 'update';
    this.modalFormVisible = true;
    this.rowid = data.data[0].rowid;
    console.log(this.rowid);
    //this.modalValidateForm.patchValue(data.data[0]);
    // let url=urls.selectKilo;
    // let param:any;
    // param=data.data[0];
    // console.log(param);
    // this.http.post(url,param).then(res=>{
    //   if(res.success){
    //     console.log(res);
    //     this.modalValidateForm.get('province').setValue(res.data.data.data[0].provinceCode);
    //     this.modalValidateForm.get('city').setValue(res.data.data.data[0].cityCode);
    //     this.modalValidateForm.get('area').setValue(res.data.data.data[0].areaCode);
    //     this.modalValidateForm.get('town').setValue(res.data.data.data[0].townCode);
    //     this.modalValidateForm.get('prodKindPrice').setValue(res.data.data.data[0].prodKindPrice);
    //     this.modalValidateForm.get('unitPrice').setValue(res.data.data.data[0].unitPrice);
    //     this.modalValidateForm.get('remark').setValue(res.data.data.data[0].remark);
    //     console.log(this.modalValidateForm.getRawValue())
    //   }
    // })

    // const this_ = this;
    // setTimeout(function () {
    //   this_.modalValidateForm.get('province').setValue(data.data[0].provinceCode);
    //   this_.modalValidateForm.get('city').setValue(data.data[0].cityCode);
    //   this_.modalValidateForm.get('area').setValue(data.data[0].areaCode);
    //   this_.modalValidateForm.get('town').setValue(data.data[0].townCode);
    //   this_.modalValidateForm.get('prodName').setValue(data.data[0].prodName);
    //   this_.modalValidateForm.get('unitPrice').setValue(data.data[0].unitPrice);
    //   this_.modalValidateForm.get('remark').setValue(data.data[0].remark);
    // }, 300)
    // console.log(this.modalValidateForm.getRawValue())
    console.log(data.data[0])
    const this_ = this;
    window.setTimeout(()=>{
      this_.modalValidateForm.get('isActive').setValue(data.data[0].isActive);
      this_.modalValidateForm.get('province').setValue(data.data[0].provinceCode);
      this_.modalValidateForm.get('city').setValue(data.data[0].cityCode);
      this_.modalValidateForm.get('area').setValue(data.data[0].areaCode);
      this_.modalValidateForm.get('town').setValue(data.data[0].townCode);
      this_.modalValidateForm.get('prodName').setValue(data.data[0].prodName);
      this_.modalValidateForm.get('unitPrice').setValue(data.data[0].unitPrice);
      this_.modalValidateForm.get('remark').setValue(data.data[0].remark);
    })

  }

  updateDataResult(data: any){
    console.log(data);
  }
  // 删除
  btnDelete(data: any) {
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
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;
  }

  // 弹出框相关
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.getRawValue());
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.getRawValue());
    }
    if ('VALID' === this.modalValidateForm.status && 'RaisePrice' === this.status) {
      this.confrimRaisePrice(this.modalValidateForm.getRawValue());
    }

  }

  handleCancel() {
    this.modalFormVisible = false;
  }

  closeResult() {
    if(!this.modalValidateForm) return;
    this.modalValidateForm.reset();
    this.modalValidateForm.get('city').reset({value: null, disabled: true});
    this.modalValidateForm.get('area').reset({value: null, disabled: true});
    this.modalValidateForm.get('town').reset({value: null, disabled: true});
    this.cityArr = [];
    this.areaArr = [];
    this.townArr = [];
    //this.inputModalModel = '';
  }

  // 确认框结果
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;

  }

  // 公司更改触发
  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit(data: any) {
    this.modalValidateForm.get('segmentId').setValue(data.inpValue);
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

  addressChange(value, name): void {
    //console.log('address-set')
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('city').reset({value: null, disabled: false},);
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('area').reset({value: null, disabled: false},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.modalValidateForm.get('town').reset({value: null, disabled: false},);
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }

  getAddressData(data): void {
    let param:any = {level: data.level, parentCode: data.parentCode || ''};
    let url:string;
    if(data.level === 'DZDJ40' && 'RaisePrice' === this.status){
      url = urls.selectByArea;
      param.area = data.parentCode || ''
    } else {
      url = urls.selectProvices;
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              console.log(2222);
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
            }
              break;
            case 'DZDJ40': {
              this.townArr = res.data.data;
              if('RaisePrice' === this.status){
                let obj = {};
                this.townArr = this.townArr.filter(x => obj.hasOwnProperty(x.townName) ? false : obj[x.townName] = true);
              }
            }
              break;
          }
        }
      }
    );
  }

  /**
   * 价格品种应付获取
   */
  getprodKindPrice(): void {
    const observable = fromPromise(this.http.post(urls.getprodKindPrice, {prodKind: '20'})).pipe(
      retry(3),
      map(res => {
        if (res.success) {
          return res.data.data;
        } else {
          throw new Error('服务器出错');
        }
      }),
      catchError(() => of([]))
    );
    observable.subscribe(
      value => {
        this.prodNameArr = value;
      }
    );
  }

}
