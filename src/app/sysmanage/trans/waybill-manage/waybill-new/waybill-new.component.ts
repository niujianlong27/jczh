import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, UploadFile} from 'ng-zorro-antd';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';
import {HttpClient} from '@angular/common/http';
import {WaybillImportComponent} from '../waybill-import/waybill-import.component';
import {ImgViewerService} from '@component/img-viewer/img-viewer';
import {UploadFiles} from '@service/upload-files';
import {UserinfoService} from '@service/userinfo-service.service';
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';
import {CommonService} from '@service/common.service';

declare var JSONH: any;

@Component({
  selector: 'app-waybill-new',
  templateUrl: './waybill-new.component.html',
  styleUrls: ['./waybill-new.component.css']
})
export class WaybillNewComponent implements OnInit {
  returnValidate: FormGroup;
  formValidate: FormGroup;
  // 运单相关信息
  waybillData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedWaybillData: Array<any> = [];
  data: any = {};
  resData: any = {};
  carrierCompanyName: string;
  isVisible: boolean = false;
  returnLoading: boolean = false;
  weitghtType: Array<any> = [{name: '大载', code: 'ZZBJ10'}, {name: '标载', code: 'ZZBJ20'}, {name: '全部', code: 'ZZBJ30'}];
  // 运单司机/捆包相关信息
  childGridId = 'waybillPack';
  childData: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 100;
  childTotal: number = 0;
  tabArr: Array<any> = [
    {name: '运单捆包', gridId: 'waybillPack'},
    {name: '运单司机', gridId: 'driver'}
  ];
  childIndex = 0;

  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  tplModal: NzModalRef;
  dataSet2:any=[];
  updateData:any=[];
  totalPage:any;
  implistLoading = false;
  scanCodeData;
  scanCodeTableHeight:any = '600px';
  @ViewChild('urlImg1') urlImg1: TemplateRef<any>;


  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  importVisible: boolean = false;
  //businessModuleArr: Array<any> = [];
  public returnPicList: any[] = [];
  modalObj: any = {
    visible: false,
    loading: false,
    title: null,
    data: []
  };
  @ViewChild('urlImg') urlImg: TemplateRef<any>;

  constructor(private http: HttpUtilService,
              public router: Router,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private imgService: ImgViewerService,
              public upload: UploadFiles,
              public info: UserinfoService,
              private cm:CommonService,
              private anhttp: HttpClient) {
    upload.setUpload();
  }

  //图片查看
  handlePreview = (file: UploadFile) => {
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  getView(e: MouseEvent, data: string, item: any) {
    e.preventDefault();
    e.stopPropagation();
    // this.waybillData.forEach((x: any) => x._bgColor = '');
    // item._bgColor = '#a8b6ba';
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }
  ngOnInit() {
    if(this.info.APPINFO.USER.companyId==='C000000882'){
      this.returnValidate = this.fb.group({
        totalSheet: [null, [Validators.required]],
        carrierCompanyId: [null, [Validators.required]],
        totalWeight: [null, [Validators.required]],
        returnBillRemark: [null, []],
        groupDriverName: [null, []],
        returnSheet: [null, [Validators.required]],
        weight: [null, [Validators.required]],
        returnTotalWeight: [null, [Validators.required]],
        returnPic: [null, this.info.APPINFO.USER.companyType === 'GSLX30' ? [Validators.required] : []],
      });
    }else{
      this.returnValidate = this.fb.group({
        totalSheet: [null, [Validators.required]],
        carrierCompanyId: [null, [Validators.required]],
        totalWeight: [null, [Validators.required]],
        returnBillRemark: [null, []],
        returnSheet: [null, [Validators.required]],
        returnTotalWeight: [null, [Validators.required]],
        returnPic: [null, this.info.APPINFO.USER.companyType === 'GSLX30' ? [Validators.required] : []],
      });
    }
  }

  setPopSelectedValueId(data: any, fieldName: string) {
    this.returnValidate.get(fieldName).setValue(data.inpValue);
  }

  /**
   * 查询运单
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    this.totalWeight = 0;
    this.totalSheet = 0;
    this.selectedWaybillData = [];
    this.waybillData = [];
    this.childData = [];
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    pageParam.formId = 'form_waybill_new';
    this.data = {...pageParam};
    this.http.post(TRANS_URLS.SELECT_WAYBILL, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData =  (res.data.data && res.data.data.data) || []; // ? JSONH.unpack(JSON.parse(res.data.data.packData)) : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => {
          item.rowIndex = index + 1;
          switch (item.status) {
            case 'YDZT30':{ //已返单
              item._bgColor = '#61cd77';
              item.font_color = 'multi';
            }
              break;
            case 'YDZT12':{ //待审核
              item._bgColor = 'red';
              item.font_color = 'multi';
            }
              break
          }
        });
      }
      this.loading = false;
    });
  }

  columns(data: any) {
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg;
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    console.log(button.buttonId);
    switch (button.buttonId) {
      case 'waybillReturn':
        this.waybillReturn();
        break;
      case 'print':
        this.print();
        break;
      case 'update':
        this.update();
        break;
      case 'delete':
        this.delete();
        break;
      case 'importWaybill':
        this.importWaybill();
        break;
      case 'Export' :
        this.export();
        break;
      case 'DetailExport':
        this.detailExport();
        break;
      case 'UpdateAll':
        this.updateAll(button);
        break;
      case 'copy':
        this.waybillCopy();
        break;
      case 'reject':
        this.reject(); // 驳回返单
        break;
      case 'auditReturn': // 审核返单
        this.auditReturn();
        break;
      case 'scanCodeAudit':
        this.scanCodeAudit();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 批量修改
   */
  modalInputModal(model: any, data: any) {
    data.model = model.selData;
    this.formValidate.get(data.parameter).setValue(model.selData[0] && model.selData[0][data.idStr] || null);
  }

  private updateAll(flag: any) {
    this.modalObj.data = [
      {
        type: 'inputModal',
        parameter: 'carrierCompanyId',
        name: '运输车队',
        formId: 'company_pop',
        nameStr: 'companyName',
        idStr: 'companyId',
        required: true,
        value: null,
        model: null,
      },
      {
        type: 'radio',
        parameter: 'weight',
        name: '载重标记',
        required: false,
        data: this.weitghtType.map(x => ({name: x.name, value: x.code})),
        model: null
      }
    ];
    this.modalObj.title = `运单查询(新) > ${flag.buttonName}`;
    this.nm.confirm({
      nzTitle: `运单查询(新) > ${flag.buttonName}`,
      nzContent: `是否对选中的数据进行${flag.buttonName}?`,
      nzOnOk: () => {
        this.formValidate = this.fb.group({
          carrierCompanyId: [null, Validators.required],
          weight: [null]
        });
        this.modalObj.visible = true;
      }
    });
  }

  modalOk() {
    for (const i in this.formValidate.controls) {
      this.formValidate.controls[i].markAsDirty();
      this.formValidate.controls[i].updateValueAndValidity();
    }
    if (this.formValidate.status === 'INVALID') {
      return;
    }
    this.modalObj.loading = true;
    const tWaybillModels = this.selectedWaybillData.map(x => ({waybillNo: x.waybillNo,companyId:x.companyId}));
    const shortName = this.modalObj.data.filter(x => x.parameter === 'carrierCompanyId');
    const params = {
      tWaybillModels: tWaybillModels, ...this.formValidate.getRawValue(),
      groupDriverName: shortName[0].model[0] && shortName[0].model[0].shortName
    };
    this.anhttp.post(TRANS_URLS.updateWaybillList, params).subscribe(
      (res: any) => {
        this.modalObj.loading = false;
        this.modalObj.visible = false;
        if (res.code === 100) {
          this.msg.success(res.msg);
          this.query(this.data);
        }
      }
    );
  }

  /**
   * 打印
   */
  print() {

    if (!this.selectedWaybillData || this.selectedWaybillData.length !== 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    let url: any = TRANS_URLS.DispatchPdf + `?waybillNo=${this.selectedWaybillData[0].waybillNo}&requestCompanyId=${this.selectedWaybillData[0].companyId}`;
    this.anhttp.get(url, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/pdf'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }

  /**
   * 修改
   */
  update() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length !== 1) {
      this.msg.error('请选择选择一条运单记录！');
    }

    // if (this.selectedWaybillData[0].settleFlag === 'FYDJ20' || this.selectedWaybillData[0].priceFlag === 'HJBJ20') {
    //   this.msg.error('该运单已登记运费或已核价不能修改');
    //   return;
    // }
    this.router.navigate(['/system/trans/waybill-manage/waybill-add'], {
      queryParams: {
        'operateType': 'update',
        'source': 'new',
        'waybillNo': this.selectedWaybillData[0].waybillNo
      }
    });
  }

  /**
   * 作废
   */
  delete() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length === 0) {
      this.msg.error('请选择至少选择一条运单记录！');
    }
    // let invalidate = this.selectedWaybillData.filter((item, index) => {
    //   item.rowIndex = index + 1;
    //   return item.settleFlag === 'FYDJ20';
    // });
    // if (invalidate.length > 0) {
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单已登记运费不能作废`);
    //   return;
    // }
    //
    // invalidate = this.selectedWaybillData.filter((item, index) => {
    //   item.rowIndex = index + 1;
    //   return item.priceFlag === 'HJBJ20';
    // });
    // if (invalidate.length > 0) {
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单运费已核价不能作废`);
    //   return;
    // }
    this.nm.confirm({
      nzTitle: '作废确认',
      nzContent: '<p class="m-re">是否要将选中的数据进行作废处理?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.http.post(TRANS_URLS.DELETE_WAYBILL, {tWaybills: this.selectedWaybillData}).then(
          (res: any) => {
            if (res.success) {
              resolve();
              this.msg.success(`作废成功！作废运单${this.selectedWaybillData.length}条`);
              this.selectedWaybillData = [];
              this.query(this.data);
              // this.driverData = res.data.data;
            } else {
              reject();
            }
          }
        );
      })
    });
  }

  /**
   * 导入按钮响应事件
   */
  @ViewChild(WaybillImportComponent) waybillImport: WaybillImportComponent;

  importWaybill() {
    this.importVisible = true;
    this.waybillImport.showModal().subscribe(x => {
      if (x === 'success') {
        this.query(this.data);
      }
    });
  }

  //导出
  export() {
    let url: any = urls.waybillExport;

    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单查询.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

  /**
   * 明细导出
   */
  detailExport(): void {
    if (!this.selectedWaybillData || this.selectedWaybillData.length === 0) {
      this.msg.error('请选择至少选择一条运单记录！');
      return;
    }
    const url: any = urls.waybillDetailExport;
    const param = {
      formId:'form_waybill_new',
      tWaybills: this.selectedWaybillData
    };
    // this.selectedWaybillData.forEach(
    //   value => {
    //     value['formId'] = 'form_waybill_new';
    //     param.tWaybills.push(value);
    //   }
    // );
    this.anhttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单明细.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });

  }

  /**
   * 返单
   */
  handleChange(data: any) {
    const pics = this.returnPicList.map(x => {
      if (x.status === 'done') {
        return x.originFileObj && x.originFileObj.url || x.url;
      }
    }).join(';');
    this.returnValidate.get('returnPic').setValue(pics || '');
    this.returnValidate.get('returnPic').markAsDirty();
    this.returnValidate.get('returnPic').updateValueAndValidity();
  }

  waybillReturn() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请选择运单数据！');
    }
    if (this.selectedWaybillData.length === 1) {
      this.returnValidate && this.returnValidate.reset();
      this.isVisible = true;
      const waybill = this.selectedWaybillData[0];
      let data = {};
      data['waybillNo'] = waybill.waybillNo;
      if(this.info.APPINFO.USER.companyId==='C000000882'){
        this.http.post(urls.confirmationOfContractPrice, {...data, companyId: waybill.companyId}).then((res): any => {
          if (res.success) {
            this.resData = res.data.data;
            this.returnValidate.patchValue(res.data.data || {});
          }
        });
      }



      if(this.info.APPINFO.USER.companyId==='C000000882'){
        const pics = waybill.returnPic && waybill.returnPic.split(';') || [];
        this.returnPicList = pics.map((x: string, i: number) => ({url: x, status: 'done', uid: i}));
        this.returnValidate.get('returnPic').setValue(pics.join(','));
        this.returnValidate.get('totalSheet').setValue(waybill.preTotalSheet);
        this.returnValidate.get('totalWeight').setValue(waybill.preTotalWeight);
        this.returnValidate.get('carrierCompanyId').setValue(waybill.carrierCompanyId);
        this.returnValidate.get('groupDriverName').setValue(waybill.groupDriverName);
        this.carrierCompanyName = waybill.carrierCompanyName;
      }else{
        const pics = waybill.returnPic && waybill.returnPic.split(';') || [];
        this.returnPicList = pics.map((x: string, i: number) => ({url: x, status: 'done', uid: i}));
        this.returnValidate.get('returnPic').setValue(pics.join(','));
        this.returnValidate.get('totalSheet').setValue(waybill.totalSheet);
        this.returnValidate.get('totalWeight').setValue(waybill.totalWeight);
        this.returnValidate.get('returnTotalWeight').setValue(Number(waybill.preTotalWeight));
        this.returnValidate.get('returnSheet').setValue(Number(waybill.preTotalSheet));
        this.returnValidate.get('carrierCompanyId').setValue(waybill.carrierCompanyId);
        this.carrierCompanyName = waybill.carrierCompanyName;
      }

    } else {
      this.nm.confirm(
        {
          nzTitle: '提示消息',
          nzContent: '是否确认批量返单?',
          nzOnOk: () => {
            this.returnLoading = true;
            const tWaybillModels: Array<any> = [];
            let url :any;
            if(this.info.APPINFO.USER.companyId==='C000000882'){
              url = TRANS_URLS.RETURN_WAYBILL;
            }else{
              url = TRANS_URLS.RETURN_WAYBILL_NRG_MORE;
            }
            this.selectedWaybillData.forEach(
              res => {
                tWaybillModels.push({waybillNo: res.waybillNo, companyId: res.companyId});
              }
            );
            return this.http.post(url, {tWaybillModels: tWaybillModels}).then(
              (res: any) => {
                if (res.success) {
                  this.msg.success(res.data.data);
                  this.query(this.data);
                }
                this.returnLoading = false;
              }
            );

          }
        }
      );

    }
  }

  /**
   * 调用后台返单接口
   */
  waybillReturnSubmit() {
    for (const i in this.returnValidate.controls) {
      this.returnValidate.controls[i].markAsDirty();
      this.returnValidate.controls[i].updateValueAndValidity();
    }
    if (this.returnValidate.invalid) {
      return;
    }
    let url:any;
    let param:any;
    if(this.info.APPINFO.USER.companyId==='C000000882'){
      url = TRANS_URLS.RETURN_WAYBILL;
    }else{
      url = TRANS_URLS.RETURN_WAYBILL_NRG;
    }
    if(this.info.APPINFO.USER.companyId==='C000000882'){
      this.resData && this.resData.returnSheet && this.returnValidate.get('totalSheet').setValue(this.resData.returnSheet);
      this.resData && this.resData.returnTotalWeight && this.returnValidate.get('totalWeight').setValue(this.resData.returnTotalWeight);
      this.returnLoading = true;
      const pics = this.returnPicList.map(x => x.originFileObj && x.originFileObj.url || x.url).join(';');

      param ={...this.selectedWaybillData[0], ...this.returnValidate.value, returnPic: pics};
    }else{
      let param1:any={}
      const pics = this.returnPicList.map(x => x.originFileObj && x.originFileObj.url || x.url).join(';');
      param1 .preTotalWeight = this.returnValidate.get('returnTotalWeight').value;
      param1 .preTotalSheet = this.returnValidate.get('returnSheet').value;
      param ={...this.selectedWaybillData[0], ...this.returnValidate.value, returnPic: pics,...param1};
    }

    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.msg.success('返单操作成功！');
          this.query(this.data);
          this.isVisible = false;
        }
        this.returnLoading = false;
      }
    );
  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.waybillData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        item.checked = !item.checked;
      }
    });
    this.selectedWaybill(this.waybillData.filter(item => item.checked));
  }

  totalWeight: number = 0;
  totalSheet: number = 0;

  /**
   * 选中数据
   * @param data
   */
  selectedWaybill(data: any) {
    this.selectedWaybillData = data;
    this.tabChange({gridId: this.childGridId});
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);
  }


  /**
   * // 运单司机/捆包tab页切换
   * @param tabInfo
   */
  tabChange(tabInfo: any) {
    setTimeout(() => {

      const tWaybills = [];
      for (let i = 0, len = this.selectedWaybillData.length; i < len; i++) {
        tWaybills.push(
          {
            companyId: this.selectedWaybillData[i].companyId,
            waybillNo: this.selectedWaybillData[i].waybillNo
          }
        );
      }

      if (tabInfo.gridId === 'waybillPack') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryPack(tWaybills);
        } else {
          this.childData = [];
        }
      } else if (tabInfo.gridId === 'driver') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryDriver(tWaybills);
        } else {
          this.childData = [];
        }
      } else {
        this.msg.error(`未知Tab页信息！${JSON.stringify(tabInfo)}`);
      }
    }, 0);
  }

  waybillCopy() { //复制运单
    if (!this.selectedWaybillData || this.selectedWaybillData.length != 1) {
      this.msg.error('请选择一条运单记录操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认复制运单?',
      nzOnOk: () => {
        let params = {};
        params['waybillNo'] = this.selectedWaybillData[0].waybillNo;
        params['companyId'] = this.selectedWaybillData[0].companyId;
        this.http.post(TRANS_URLS.copyByWaybillNo, params).then(
          (res: any) => {
            if (res.success) {
              this.msg.success('运单复制成功！');
              this.query(this.data);

            }
            });
      }

  })
}

  reject(){
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请至少选择一条运单记录操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认驳回返单?',
      nzOnOk: () => {
        let data = this.selectedWaybillData.map(item => {
          return {waybillNo:item.waybillNo}
        });
        this.http.post(TRANS_URLS.rejectWaybill, {tWaybillModels:data}).then(
          (res: any) => {
            if (res.success) {
              this.msg.success(res.data.data);
              this.query(this.data);
            }
          });
      }

    })
  }


  auditReturn(){
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请至少选择一条运单记录操作！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认审核返单?',
      nzOnOk: () => {
        let data = this.selectedWaybillData.map(item => {
          return {waybillNo:item.waybillNo}
        });
        this.http.post(TRANS_URLS.auditReturn, {tWaybillModels:data}).then(
          (res: any) => {
            if (res.success) {
              this.msg.success(res.data.data);
              this.query(this.data);
            }
          });
      }

    })
  }


  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(tWaybills: Array<any>) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据运单查询运单司机信息
   */
  queryDriver(tWaybills: Array<any>) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.childData = res.data.data;
        }
      }
    );
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  scanCodeAudit(){
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
      nzWidth: '50%',
      nzMaskClosable: false,
      nzClosable: false,
    });
  }

  updateDataResult(data:any){
    this.updateData = data
  }

  scanCodeSuccess(){
    console.log("success")
    console.log(this.scanCodeData)
    this.http.post(TRANS_URLS.getScanCodeData,{mainProductListNo:this.scanCodeData}).then(res=>{
      if(res.success) {
        console.log(res)
        res.data.data.forEach(item => {
          if (item.businessNatureFlag === 'noneWaybill') {
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; // 字体颜色
            this.speak('未获取运单信息')
            this.dataSet2.unshift(item)
          }else if (item.businessNatureFlag === 'noneOrder') {
            this.speak('未获取合同信息')
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; // 字体颜色
            this.dataSet2.unshift(item)
          }else if (item.businessNatureFlag === 'normal') {
            item.checked = true;
            this.speak(`正常,${item.preTotalWeight}吨`)

            this.dataSet2.unshift(item)
          }else if (item.businessNatureFlag === 'ticket') {
            item.checked = true;
            this.speak(`一票制,${item.preTotalWeight}吨`)
            this.dataSet2.unshift(item)
          }else if (item.businessNatureFlag === 'notAudited') {
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; // 字体颜色
            this.speak('该运单不是未审核状态')
            this.dataSet2.unshift(item)
          }
        })
        this.scanCodeData = undefined
        this.dataSet2 = [...this.dataSet2]
        this.updateData = this.dataSet2.filter(x=>x.checked);
      }
    })
  }

  handleCancel(){
    this.tplModal.destroy();
    this.dataSet2 =[];
    this.updateData=[];
  }

  importConfirm(){
    if(this.updateData.length<=0){
      this.msg.warning('请勾选一条数据')
      return
    }
    if(this.cm.canOperate(this.updateData,'businessNatureFlag',['noneWaybill','noneOrder'],'请勾选有运单且有合同的数据!')){
      return;
    }

    let param :any ={tWaybillModels:[]}
    param.tWaybillModels = this.updateData

    this.http.post(TRANS_URLS.auditScanCodeData,param).then(res=>{
      if(res.success){
         this.msg.success('操作成功')
        this.dataSet2 = [];
         this.updateData = []
      }
    })
  }


  speak(data:any){
    // @ts-ignore
    let utterThis = new window.SpeechSynthesisUtterance(data)
    window.speechSynthesis.speak(utterThis);
  }

  tableHeigthChange(){
    this.scanCodeTableHeight = `${this.dataSet2.length}*41px`
  }
  columns1(data: any) {
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg1;
  }

  getView2(e: MouseEvent, data: string, item: any) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }
}
