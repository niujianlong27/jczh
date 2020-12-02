import {Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import {UploadFiles} from '@service/upload-files';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-company-settle',
  templateUrl: './company-settle.component.html',
  styleUrls: ['./company-settle.component.css']
})
export class CompanySettleComponent implements OnInit {

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;
  @ViewChild('detail') detail;
  taxDeviceTypeArr:any=[{value:1,name:'金税盘'},{value:2,name:'税控盘'}];
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  settlinvTypeArr :Array<any> = [{value: 'SITP10', name: '结算账户'},{value:'SITP20', name: '开票账户'}];
  typeDataArr: Array<any> = [{value: 1, name: '是'}, {value: 0, name: '否'}];
  UserBusiSegment: Array<any> = [];
  modalFormData: Array<any> = [
    // {
    //   name: '公司ID', eName: 'companyId', type: 'text', validateCon: '请输入公司ID', require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    {
      name: '结算公司名称', eName: 'settleCompanyId', type: 'modal', validateCon: '', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '业务板块', eName: 'segmentId', type: 'select', validateCon: '请选择业务板块', require: false, disabled: false,
      selectArr: this.UserBusiSegment,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '税号', eName: 'taxCode', type: 'text', validateCon: '请输入税号', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开户银行', eName: 'bank', type: 'text', validateCon: '请输入开户银行', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行账户', eName: 'bankAccount', type: 'text', validateCon: '请输入账户', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开户银行地址', eName: 'bankAddress', type: 'text', validateCon: '请输入开户行地址', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '是否默认账户', eName: 'isDef', type: 'radio', validateCon: '请选择是否默认', require: true, radioArr: this.typeDataArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '账户类型', eName: 'settlinvType', type: 'radio', validateCon: '请选择账户类型', require: true, radioArr: this.settlinvTypeArr,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '联系人', eName: 'linkMan', type: 'text', validateCon: '请输入联系人', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '联系人电话', eName: 'telphone', type: 'text', validateCon: '请输入联系人电话', require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '^(0|\\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$',
        patternErr: '手机号格式不正确'
      }
    },
    {
      name: '履约地', eName: 'performancePlace', type: 'text', validateCon: '请输入履约地', require: true,
      validators: {
        require: true,
        pattern: false,
        patternStr: '^(0|\\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$',
        patternErr: '手机号格式不正确'
      }
    },
    {
      name: '联系地址', eName: 'address', type: 'text', validateCon: '请输入联系地址', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款人', eName: 'payee', type: 'text', validateCon: '请输入收款人', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '复核人', eName: 'reviewer', type: 'text', validateCon: '请输入复核人', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '开票人', eName: 'creator', type: 'text', validateCon: '请输入开票人', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '税盘类型', eName: 'taxDeviceType', type: 'select', validateCon: '请选择税盘类型', require: false,selectArr:this.taxDeviceTypeArr,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '税盘号', eName: 'taxMac', type: 'text', validateCon: '请输入税盘号', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '公司图章', eName: 'stampImg', type: 'upload', validateCon: '请选择是否默认', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '发货专用章', eName: 'file', type: 'uploadFile', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

  ];

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  private tplModal: NzModalRef; // 弹窗相关

  // 表格
  // 页数控制
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数
  listLoading = true; // 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  total: number; // 总数据条数
  tempSearchParam: any;  // 列表数据缓存
  private rowid: any;
  buttonId: string;
  inputModalModel: any;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};
  borderRed: any;
  settleCompanyId = '';
  stampImgArray: Array<any> = [];
  deliverImg: any[] = [];
  previewImage = '';
  previewVisible = false;

  showExplainFlag = false;


  // 详情值
  detailData: any = {};

  // formId设置;

  constructor(
    private http: HttpUtilService,
    private fb: FormBuilder,
    private nzModal: NzModalService,
    private nzMess: NzNotificationService,
    public upload: UploadFiles,
    private info: UserinfoService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      const validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.getUserBusiSegment();
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
    params.url = urls.getCompanySettle;
    params.data = data;
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

  // 添加
  btnAdd() {
    this.modalFormVisible = true;
    this.modalTitle = '公司结算账户维护 > 新增';
    this.status = 'add';
    this.deliverImg = [];
    this.modalValidateForm.get('settlinvType').setValue('SITP10');
    this.modalValidateForm.get('taxDeviceType').setValue(1);
  }
  //
  public domImg(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  // base64 转图片
  private base64ToImg(data: string) {
     let arr = data.split(','),
         type = data.match(/:(.*?);/)[1],
         str = atob(arr[1]),
         len = str.length,
         u8arr = new Uint8Array(len);
         while(len--) {
           u8arr[len] = str.charCodeAt(len);
         }
         const blob: any = new Blob([u8arr], {type: type});
         blob.lastModifiedDate = new Date();
         blob.name = '发货专用章';
         return blob;
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
    this.modalFormVisible = true;
    this.modalTitle = '公司结算账户维护 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.inputModalModel = data.data[0].settleCompanyName;
    this.settleCompanyId = data.data[0].settleCompanyId;
    this.modalValidateForm.patchValue(data.data[0]);
     if (data.data[0].deliverImg) { // 一张限制
        this.deliverImg = [
          {
            uid: 1,
            name: '发货专用章',
            status: 'done',
            url: data.data[0].deliverImg,
            originFileObj: this.base64ToImg(data.data[0].deliverImg)
          }
        ]
     }
    if (data.data[0]['stampImg']) {
      this.stampImgArray = data.data[0]['stampImg'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `印章${index + 1}.png`,
          status: 'done',
          url: url
        };
      });
    }
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
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.addCompanySettle;
    data.settleCompanyId = this.settleCompanyId;
   // params.data = data;
   Object.keys(data).forEach(x => {
     params.data[x] = data[x] || '';
   });
 //  params.data.append('requestCompanyId', this.info.get('USER').companyId);
 //  params.data.append('requestUserId', this.info.get('USER').userId);
 //  params.data.append('file', this.deliverImg[0] && this.deliverImg[0].originFileObj || '');
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '添加成功！');
        }
      }
    );
  }

  deleteData() {   // 删除数据
    const params = {url: '', data: {list: []}, method: 'POST'};
    params.url = urls.deleteCompanySettle;
    params.data.list = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nzMess.success('提示消息', '删除成功！');
        }
      }
    );
  }


  handleOk() {  // 弹出框相关
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
      this.showExplainFlag = !this.settleCompanyId;
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }

    if ('add' === this.status) {
      this.addData(this.modalValidateForm.value);
    }
    if ('update' === this.status) {
      this.updateData(this.modalValidateForm.value);
    }
  }

  updateData(data: any) {   // 修改数据
    console.log(this.deliverImg);
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateCompanySettle;
    // data.rowid = this.rowid;
    // data.settleCompanyId = this.settleCompanyId;
    // console.log(data);
    // params.data = data;
    Object.keys(data).forEach(x => {
      params.data[x] = data[x] || '';
    });
    params.data['rowid'] = this.rowid;
    params.data['settleCompanyId'] = this.settleCompanyId;
   // params.data.append('requestCompanyId', this.info.get('USER').companyId);
   // params.data.append('requestUserId', this.info.get('USER').userId);
   // params.data.append('file', this.deliverImg[0] && this.deliverImg[0].originFileObj || '');
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
        }
      }
    );
  }


  handleCancel() {
    this.modalFormVisible = false;
  }

  closeResult() {
    this.modalValidateForm.reset();
    this.settleCompanyId = '';
    this.inputModalModel = '';
    this.stampImgArray = [];
    this.showExplainFlag = false;
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
    this.inputModalModel = data.inpName;
    this.settleCompanyId = data.inpValue;
    data.inpValidate == 'VALID' && (this.showExplainFlag = false);
    this.modalValidateForm.get('settleCompanyId').setValue(this.settleCompanyId);

  }

  /**
   * 图片上传
   * @param {UploadFile} file
   */
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  /**
   * 图片更改
   * @param info
   * @param name
   */
  handleChange(info, name) {

    if (info.file.status === 'done') {
      if (name === 'stampImg') {
        // 单图片
        this.stampImgArray = [info.file.originFileObj];
        this.modalValidateForm.patchValue({stampImg: this.stampImgArray[0].url});

        // // 多图片
        // this.stampImg = this.stampImg.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({cardPhoto: this.stampImg.map(item => item.url).join(';')});
      }

    }
    if (info.file.status === 'removed') {
      if (name === 'stampImg') {
        // 单图片
        this.modalValidateForm.patchValue({stampImg: ''});

        // 多图片
        // this.validateForm.patchValue({cardPhoto: this.stampImg.map(item => item.url).join(';')});
      }

    }
  }

  /**
   * 按钮点击事件
   * @param data
   */
  btnClick(data: any) {
    if (data.type.buttonId === 'Detail') {
      // console.log(data);
      if (data.data.length < 1) {
        this.nzMess.warning('提示消息', '请选择数据后操作！');
        return;
      }
      if (data.data.length > 1) {
        this.nzMess.warning('提示消息', '请选择一条记录进行详情查看！');
        return;
      }

      this.detailData = data.data[0];
      this.nzModal.create(
        {
          nzTitle: '公司结算账户>详情',
          nzContent: this.detail,
          nzMaskClosable: false,
        }
      );

    }
  }

  /**
   * 获取业务板块
   */
  private getUserBusiSegment() {
    this.http.post(urls.userBusiSegment, {}).then(
      res => {
        console.log(res);
        const data = (res.data.data || []).map(x => ({name: x.segmentName, value: x.segmentId}));
        Array.prototype.push.apply(this.UserBusiSegment, data);
      }
    );
  }
}
