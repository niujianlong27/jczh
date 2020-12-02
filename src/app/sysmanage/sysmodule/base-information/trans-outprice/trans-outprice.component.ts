import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile, UploadFilter} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {format} from 'date-fns';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, retry } from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
@Component({
  selector: 'app-trans-outprice',
  templateUrl: './trans-outprice.component.html',
  styleUrls: ['./trans-outprice.component.css']
})
export class TransOutpriceComponent implements OnInit {
  private tplModal: NzModalRef; // 弹窗相关

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  weightArr: Array<any> = [];
  prodKindPriceArr: Array<any> = [];

  modalFormData: Array<any> = [];

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
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
  private rowid: any;
  findset: any = {
    url: 'getBusiSegment',
    formId: 'form_busi',
    name: '业务板块',
    parameter: 'segmentName',
    parameterSend: 'segmentId'
  };
  inputModalModel: string = ''; // 业务模块 输入

  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  radioArr: Array<any> = [];
  UserBusiSegment: any[] = [];
  data: any;
  importModal:any = {
    format: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    visible: false,
    title: null,
    loading: false,
    fileList: [],
    url: `${urls.transOutpriceImport}?requestCompanyId=${this.info.get('USER').companyId}&requestUserId=${this.info.get('USER').userId}`
  }
  // selectedCompany: any; // 当前公司

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
  private commonModalForm(flag = false){
      this.modalFormData = [
         // {
    //   name: '业务板块名称', eName: 'segmentId', type: 'inputModal', validateCon: '请输入公司ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },

    {
      name: '有效标记 ', eName: 'isActive', type: 'radio', validateCon: '请选择有效标记', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '业务板块',
      eName: 'segmentId',
      type: 'select',
      validateCon: '请选择业务板块',
      require: true,
      disabled: false,
      selectArr: this.UserBusiSegment,
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
      name: '品种',
      eName: 'prodKindPrice',
      type: 'prodKindPrice',
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
      name: '载重标记 ',
      eName: 'weight',
      type: 'select',
      validateCon: '请输入开始长度',
      require: true,
      disabled: false,
      selectArr: this.weightArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '运费价格', eName: 'tranPrice', type: 'number', validateCon: '请输入运费价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '装车价格', eName: 'loadPrice', type: 'number', validateCon: '请输入装车价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '总价', eName: 'totalPrice', type: 'number', validateCon: '请输入结束长度', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开始时间 ', eName: 'startDate', type: 'date', validateCon: '请输入开始时间', require: true, disabled: flag,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '结束时间 ', eName: 'endDate', type: 'date', validateCon: '请输入结束时间', require: true, disabled: flag,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注 ', eName: 'remark', type: 'text', validateCon: '请输入结束时间', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }
    ];
    this.modalValidateFormInit();
  }
  ngOnInit() {
    this.getUserBusiSegment();
    this.getprodKindPrice();
    this.getAddressData({level: 'DZDJ10'});

    this.getStatic(this.radioArr, 'ZT');
    this.getStatic(this.weightArr, 'ZZBJ');
  }

  btnClick(data) {
    switch (data.type.buttonId) {
      case 'Export': {
        this.export()
      }
        break;
      case 'Import': {
         this.importModal.title = `应付价格管理 > ${data.type.buttonName}`;
         this.importModal.visible = true;
         this.importModal.fileList = [];
      }
        break;
      case 'RaisePrice':
        this.status = data.type.buttonId;
        this.raisePriceModal(data);
        break;
    }
  }
//调价
selectData(val: any) {
  if ('RaisePrice' === this.status) {
    const data = this.modalFormData.filter(x => x.eName === 'rate' );
    if (val === '百分比') {
      data[0].nzFormatter = (value: number) => value===null || value === undefined ? null : `${value}%`;
      data[0].nzParser = (value: string) => value.replace('%', '');
    } else {
      data[0].nzFormatter = null;
      data[0].nzParser = null;
    }
  }
}
private raisePriceModal(data:any){
  this.modalTitle = `应付价格管理 > ${data.type.buttonName}`;
        this.modalFormData = [
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
            name: '乡', eName: 'town', type: 'town', validateCon: '请选乡', require: false, disabled: true, mode:'multiple',
            validators: {
              require: false,
              pattern: false,
            }
          },
          {
            name: '品种',
            eName: 'prodKindPrice',
            type: 'prodKindPrice',
            validateCon: '请输入品种',
            require: false,
            disabled: false,
            selectArr: this.prodKindPriceArr,
            validators: {
              require: false,
              pattern: false,
            }
          },
          {
            name: '载重标记 ',
            eName: 'weight',
            type: 'select',
            validateCon: '请输入开始长度',
            require: false,
            disabled: false,
            selectArr: this.weightArr,
            validators: {
              require: false,
              pattern: false,
            }
          },
          {
            name: '调价模式',
            eName: 'type',
            type: 'select',
            validateCon: '请选择调价模式',
            require: true,
            disabled: false,
            selectArr: [
              {name: '百分比', value: '百分比'},
              {name: '固定数字', value: '固定数字'}
            ],
            validators: {
              require: true,
              pattern: false,
            }
          },
          {
            name: '调价', eName: 'rate', type: 'number', validateCon: '请输入调价', require: true, disabled: false, min: -Infinity,
            validators: {
              require: true,
              pattern: false,
            }
          },
          {
            name: '开始时间 ', eName: 'startDate', type: 'date', validateCon: '请输入开始时间', require: true, disabled: false, format: 'yyyy-MM-dd',
            noShowTime: true,
            validators: {
              require: true,
              pattern: false,
            }
          },
          {
            name: '结束时间 ', eName: 'endDate', type: 'date', validateCon: '请输入结束时间', require: true, disabled: false, format: 'yyyy-MM-dd',
            noShowTime: true,
            validators: {
              require: true,
              pattern: false,
            }
          }
        ];
        this.modalValidateFormInit();
        this.modalFormVisible = true;
}
private confrimRaisePrice(data:any){
  data.townList = (data.town || []).map(x => ({town: x}));
  data.town = undefined;
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
  //导入
  beforeUpload = (file:UploadFile):boolean => {
    this.importModal.fileList = this.importModal.fileList.concat(file);
    return false;
  }
   import(){
    this.importModal.loading = true;
    const formData = new FormData();
    this.importModal.fileList.forEach((file:any)=> {
      formData.append('file',file)
    });
    this.anhttp.post(this.importModal.url,formData).subscribe(
      (x:any) => {
        this.importModal.loading = false;
        if(x.code === 100){
          this.nn.success('提示消息', x.msg);
          this.listSearch(this.tempSearchParam);
          this.importModal.visible = false;
        }
      }
    )
  }
  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectProd;
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
        }
      }
    );
  }

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertProdList;
    data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    params.data = data;
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
    params.url = urls.updateProdList;
    data.rowid = this.rowid;
    data.town = data.town?data.town:'';
    data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    params.data = data;
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
    const params = {url: '', data: {tTransOutpriceModelList: []}, method: 'POST'};
    params.url = urls.deleteProdList;
    params.data.tTransOutpriceModelList = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
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
  }

  // 添加
  btnAdd() {
    this.commonModalForm();
    this.modalTitle = '线路价格管理(应付) > 新增';
    this.status = 'add';
    this.modalValidateForm.get('isActive').setValue('10');
    setTimeout(() => this.modalFormVisible = true,50)
  }

  // 修改
  btnUpdate(data: any) {
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
    this.commonModalForm(true);
    this.modalTitle = '线路价格管理(应付) > 修改';
    this.status = 'update';
    this.modalFormVisible = true;
     window.setTimeout(() => {
       this.rowid = data.data[0].rowid;
       this.modalValidateForm.patchValue(data.data[0]);
       this.inputModalModel = data.data[0].segmentName;
     },500)
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
    this.inputModalModel = '';
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
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('city').reset({value: null, disabled: false},);
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }else{
          this.modalValidateForm.get('city').reset({value: null, disabled: true},);
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
        }else{
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.modalValidateForm.get('town').reset({value: null, disabled: false},);
        }else{
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
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

  numberChange(data: any, eName: any) {
    switch (eName) {
      case 'tranPrice': {
        this.modalValidateForm.get('totalPrice') && this.modalValidateForm.get('totalPrice').setValue(Number(this.modalValidateForm.get('tranPrice').value) + Number(this.modalValidateForm.get('loadPrice').value));
      }
        break;
      case 'loadPrice': {
        this.modalValidateForm.get('totalPrice') && this.modalValidateForm.get('totalPrice').setValue(Number(this.modalValidateForm.get('tranPrice').value) + Number(this.modalValidateForm.get('loadPrice').value));
      }
        break;
    }
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
        this.prodKindPriceArr = value;
      }
    );
  }
  /**
   * 获取业务板块
   */
  private getUserBusiSegment(){
    this.anhttp.post(urls.userBusiSegment,{}).subscribe(
      (res:any) => {
          const data = (res.data || []).map(x => ({name: x.segmentName,value: x.segmentId}));
          this.UserBusiSegment = data;
      }
    )
  }

  export(): void {  //导出
    let url: any = urls.outexportExcel;
    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `应付价格管理导出.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });


  }

}
