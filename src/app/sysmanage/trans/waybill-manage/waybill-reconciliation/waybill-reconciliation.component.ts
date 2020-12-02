import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {ImgViewerService} from '@component/img-viewer/img-viewer.service';
import {UploadFiles} from '@service/upload-files';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import {TRANS_URLS} from '@model/trans-urls';
import {WaybillImportComponent} from '../waybill-import/waybill-import.component';
import {urls} from '@model/url';

declare var JSONH: any;

@Component({
  selector: 'app-waybill-reconciliation',
  templateUrl: './waybill-reconciliation.component.html',
  styleUrls: ['./waybill-reconciliation.component.css']
})
export class WaybillReconciliationComponent implements OnInit {

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
  weitghtType: Array<any> = [{name: '大载', code: 'ZZBJ10'}, {name: '标载', code: 'ZZBJ20'}];
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
              private anhttp: HttpClient) {
    upload.setUpload();
  }

  //图片查看
  handlePreview = (file: UploadFile) => {
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  getView(e: MouseEvent, data: string) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }

  ngOnInit() {
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
    this.selectedWaybillData = [];
    this.waybillData = [];
    this.childData = [];
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    pageParam.formId = 'form_waybill_reconciliation';
    this.data = {...pageParam};
    this.http.post(TRANS_URLS.SELECT_WAYBILL, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData = (res.data.data && res.data.data.data) || []; //? JSONH.unpack(JSON.parse(res.data.data.packData)) : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => item.rowIndex = index + 1);
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
    const tWaybillModels = this.selectedWaybillData.map(x => ({waybillNo: x.waybillNo}));
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
    this.msg.warning('功能待开发');
  }

  /**
   * 修改
   */
  update() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length !== 1) {
      this.msg.error('请选择选择一条运单记录！');
    }

    if (this.selectedWaybillData[0].settleFlag === 'FYDJ20' || this.selectedWaybillData[0].priceFlag === 'HJBJ20') {
      this.msg.error('该运单已登记运费或已核价不能修改');
      return;
    }
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
    let invalidate = this.selectedWaybillData.filter((item, index) => {
      item.rowIndex = index + 1;
      return item.settleFlag === 'FYDJ20';
    });
    if (invalidate.length > 0) {
      this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单已登记运费不能作废`);
      return;
    }

    invalidate = this.selectedWaybillData.filter((item, index) => {
      item.rowIndex = index + 1;
      return item.priceFlag === 'HJBJ20';
    });
    if (invalidate.length > 0) {
      this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join('、')}条运单运费已核价不能作废`);
      return;
    }
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
      formId:'form_waybill_reconciliation',
      tWaybills: this.selectedWaybillData
    };
    // this.selectedWaybillData.forEach(
    //   value => {
    //     value['formId'] = 'form_waybill_reconciliation';
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
    if (this.selectedWaybillData.length < 1) {
      this.msg.error('请选则一条运单数据！');
    }
    if (this.selectedWaybillData.length === 1) {
      this.returnValidate && this.returnValidate.reset();
      this.isVisible = true;
      const waybill = this.selectedWaybillData[0];
      let data = {};
      data['waybillNo'] = waybill.waybillNo;
      this.http.post(urls.confirmationOfContractPrice, {...data, companyId: waybill.companyId}).then((res): any => {
        if (res.success) {
          this.resData = res.data.data;
          this.returnValidate.patchValue(res.data.data || {});
        }
      });

      const pics = waybill.returnPic && waybill.returnPic.split(';') || [];
      this.returnPicList = pics.map((x: string, i: number) => ({url: x, status: 'done', uid: i}));
      this.returnValidate.get('returnPic').setValue(pics.join(','));
      this.returnValidate.get('totalSheet').setValue(waybill.preTotalSheet);
      this.returnValidate.get('totalWeight').setValue(waybill.preTotalWeight);
      this.returnValidate.get('carrierCompanyId').setValue(waybill.carrierCompanyId);
      this.returnValidate.get('groupDriverName').setValue(waybill.groupDriverName);

      this.carrierCompanyName = waybill.carrierCompanyName;
    } else {
      this.nm.confirm(
        {
          nzTitle: '提示消息',
          nzContent: '是否确认批量返单?',
          nzOnOk: () => {
            this.returnLoading = true;
            const tWaybillModels: Array<any> = [];
            this.selectedWaybillData.forEach(
              res => {
                tWaybillModels.push({waybillNo: res.waybillNo, companyId: res.companyId});
              }
            );
            return this.http.post(TRANS_URLS.RETURN_WAYBILL, {tWaybillModels: tWaybillModels}).then(
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

    this.resData && this.resData.returnSheet && this.returnValidate.get('totalSheet').setValue(this.resData.returnSheet);
    this.resData && this.resData.returnTotalWeight && this.returnValidate.get('totalWeight').setValue(this.resData.returnTotalWeight);
    this.returnLoading = true;
    const pics = this.returnPicList.map(x => x.originFileObj && x.originFileObj.url || x.url).join(';');
    this.http.post(TRANS_URLS.RETURN_WAYBILL, {...this.selectedWaybillData[0], ...this.returnValidate.value, returnPic: pics}).then(
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

}
