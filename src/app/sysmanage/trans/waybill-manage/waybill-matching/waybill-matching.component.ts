import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {ImgViewerService} from '@component/img-viewer/img-viewer';
import {UploadFiles} from '@service/upload-files';
import {NzMessageService, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TRANS_URLS} from '@model/trans-urls';
import {Utils} from '@util/utils';
import {urls} from '@model/url';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '@service/userinfo-service.service';


declare var JSONH: any;


@Component({
  selector: 'app-waybill-matching',
  templateUrl: './waybill-matching.component.html',
  styleUrls: ['./waybill-matching.component.css']
})
export class WaybillMatchingComponent implements OnInit {

  returnValidate: FormGroup;

  // 运单相关信息
  data: any = {};
  isMutli: boolean = true;
  waybillData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedWaybillData: Array<any> = [];

  //过磅相关信息
  childData: Array<any> = [];
  childIsMutli: boolean = true;
  childSelectDate: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 30;
  childTotal: number = 0;

  totalWeight: number = 0; //总重量
  totalSheet: number = 0; // 总件数
  lists: any;

  weitghtType: Array<any> = [
    {name: '大载', code: 'ZZBJ10'},
    {name: '标载', code: 'ZZBJ20'},
    {name: '全部', code: 'ZZBJ30'}];
  returnPicList: any[] = [];
  resData: any = {};
  carrierCompanyName: string;
  isVisible: boolean = false;
  returnLoading: boolean = false;
  businessTypeCode: any;

  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  @ViewChild('urlImg') urlImg: TemplateRef<any>;


  constructor(private http: HttpUtilService,
              public router: Router,
              private msg: NzMessageService,
              private nzMess: NzNotificationService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private imgService: ImgViewerService,
              public info: UserinfoService,
              public upload: UploadFiles,
              private anhttp: HttpClient
  ) {
    upload.setUpload();
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
    // this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1;
    data.length = this.pageSize || data.length;
    this.query(data);
  }

  listSearch2(data: any) { //查询
    data.page = data.page || 1;
    data.length = data.length || this.childPageSize;
    this.childSelectDate = [];
    this.childData = [];
    this.childPageSize = 30;
    this.childTotal = 0;
    this.childQuey(data);
  }


  /**
   * 查询运单
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    this.selectedWaybillData = [];
    this.waybillData = [];
    this.totalWeight = 0;
    this.totalSheet = 0;
    pageParam.formId = 'form_waybill_matching';
    pageParam.isMatchActWeight = 'MBZT20';
    this.data = {...pageParam};
    this.businessTypeCode = '';
    this.data.queryParameterList && this.data.queryParameterList.forEach(item => {
      item.value1 == '成都销售' && (this.businessTypeCode = '001');
      item.value1 == '成都采购' && (this.businessTypeCode = '002');
    });

    this.http.post(TRANS_URLS.SELECT_WAYBILL, this.data).then((res: any) => {
      this.loading = false;
      if (res.success) {
        //console.log(res)
        this.waybillData = (res.data.data && res.data.data.data) || []; // ? JSONH.unpack(JSON.parse(res.data.data.packData)) : [];
        this.total = res.data.data && res.data.data.total;
        this.waybillData.forEach((item, index) => {
          item.rowIndex = index + 1;
          item.editstate = 0;
        });
        this.lists = Utils.deepCopy(this.waybillData);
      }
    });
  }

  childQuey(data: any) { //查询过磅数据
    this.childLoading = true;
    let tWaybills = this.selectedWaybillData.map(item => {
      return {
        travelNo: item.travelNo,
        waybillNo: item.waybillNo
      };
    });
    let params = {...data, tWaybills: tWaybills, businessTypeName: this.businessTypeCode};
    this.http.post(TRANS_URLS.getNoWeightPage, params).then((res: any) => {
      this.childLoading = false;
      if (res.success) {
        this.childData = res.data.data && res.data.data.data || [];
        this.childTotal = res.data.data && res.data.data.total;
      }
    });
  }


  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'Matching':
        this.matching();
        break;
      case 'Return':
        this.waybillReturn();
        break;
      case 'Update':
        this.update();
        break;
      case 'Delete':
        this.delete();
        break;
      case 'Export' :
        this.export();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  matching() { //匹配按钮
    if (!this.selectedWaybillData[0] || !this.childSelectDate[0]) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择运单数据及过磅数据后操作！'
      });
      return;
    }
    if (this.childSelectDate.length > 10) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '选择的过磅数据不能多于10条！'
      });
      return;
    }

    let params = {weightList: [], tWaybillModels: []};
    params.weightList = this.childSelectDate;
    params.tWaybillModels = this.selectedWaybillData;
    this.http.post(TRANS_URLS.waybillMath, params).then((res: any) => {
      this.childLoading = false;
      if (res.success) {
        this.nzMess.success('提示消息', '匹配成功！');
        this.childData = [];
        this.childTotal = 0;
        this.listSearch(this.data);
      }
    });


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
      if (this.childSelectDate.length > 1 && item.rowIndex !== data.rowIndex) {
        item.checked = false;
      }
    });

    this.selectedWaybill(this.waybillData.filter(item => item.checked));
  }

  /**
   * 选中运单数据
   * @param data
   */
  selectedWaybill(data: any) {
    this.selectedWaybillData = data;
    this.childIsMutli = this.selectedWaybillData.length > 1 ? false : true;
    this.childSelectDate = [];
    this.childData = [];
    this.childPageSize = 30;
    this.childTotal = 0;
    this.selectedWaybillData.length > 0 && this.listSearch2({page: 1, length: this.childPageSize});
    this.clickChange();
  }

  //选中磅单数据
  selectedChild(data) {
    this.childSelectDate = data;
    this.isMutli = this.childSelectDate.length > 1 ? false : true;
    this.clickChange();

  }

  clickChange() { // 勾选数据变化时，控制重量可编辑 和 重量显示变化
    this.waybillData.forEach((item, ins) => {
      item.editstate = 0;
      item.preTotalWeight = this.lists[ins].preTotalWeight; //重量等于初始查询重量
      this.selectedWaybillData.forEach((data, index) => {
        if (this.selectedWaybillData[index] &&
          item.rowIndex == this.selectedWaybillData[index].rowIndex
          && this.childSelectDate.length) {
          this.selectedWaybillData.length > 1 && (item.editstate = 1); //当条数据可编辑
        }
      });
    });
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);

  }

  //导出
  export() {
    let url: any = urls.waybillExport;

    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单实际匹配.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

  /**
   * 作废
   */
  delete() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length === 0) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请至少选择一条运单记录',
        });
      return;
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
            } else {
              reject();
            }
          }
        );
      })
    });
  }

  waybillReturn() {
    if (this.selectedWaybillData.length < 1) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择一条运单数据！',
        });
      return;
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
   * 返单图片
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
    //计算总件数，总重量
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
   * 修改
   */
  update() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length !== 1) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择一条运单记录！',
        });
      return;
    }

    if (this.selectedWaybillData[0].settleFlag === 'FYDJ20' || this.selectedWaybillData[0].priceFlag === 'HJBJ20') {
      // this.msg.error('');
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '该运单已登记运费或已核价不能修改！',
        });
      return;
    }
    this.router.navigate(['/system/trans/waybill-manage/waybillFiling'], {
      queryParams: {
        'operateType': 'update',
        'source': 'matching',
        'waybillNo': this.selectedWaybillData[0].waybillNo
      }
    });
  }

  //图片查看
  handlePreview = (file: UploadFile) => {
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  setPopSelectedValueId(data: any, fieldName: string) {
    this.returnValidate.get(fieldName).setValue(data.inpValue);
  }


  columns(data: any) {
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg;
  }


  //上下、左右布局
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  //预览图片
  getView(e: MouseEvent, data: string) {
    e.preventDefault();
    e.stopPropagation();
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }


}
