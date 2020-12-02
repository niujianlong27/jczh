import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
import {HttpClient} from '@angular/common/http';
// import ArrayContaining = jasmine.ArrayContaining;


declare var JSONH: any;


@Component({
  selector: 'app-waybill-return',
  templateUrl: './waybill-return.component.html',
  styleUrls: ['./waybill-return.component.css']
})
export class WaybillReturnComponent implements OnInit {

  // 运单相关信息
  waybillData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedWaybillData: Array<any> = [];
  selectedData: Array<any> = [];
  resData: any = {};
  driverData: Array<any> = [];
  packData: Array<any> = [];
  data: any = {}; //查询条件存储
  weitghtType: Array<any> = [{name: '大载', code: 'ZZBJ10'}, {name: '标载', code: 'ZZBJ20'}];


  isVisible: boolean = false;
  returnValidate: FormGroup;
  returnLoading: boolean = false;
  carrierCompanyName: string;

  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  packNum: number = 0;
  packWeight: number = 0;
  driverNum: number = 0;
  driverWeight: number = 0;

  businessModuleArr: Array<any> = [];

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private anhttp: HttpClient,
              private nm: NzModalService) {
    this.returnValidate = this.fb.group({
      totalSheet: [null, [Validators.required]],
      carrierCompanyId: [null, [Validators.required]],
      totalWeight: [null, [Validators.required]],
      returnBillRemark: [null, []],
      groupDriverName: [null, []],
      returnSheet: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      returnTotalWeight: [null, [Validators.required]],

    });
  }

  setPopSelectedValueId(data: any, fieldName: string) {
    // this.returnValidate[fieldName] = data.inpValue;
    this.returnValidate.get(fieldName).setValue(data.inpValue);
  }

  ngOnInit() {
  }

  /**
   * 查询运单
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    pageParam.status = '\'YDZT10\',\'YDZT20\'';
    this.data = {...pageParam};
    this.http.post(TRANS_URLS.SELECT_WAYBILL, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData = (res.data.data && res.data.data.data) || []; //? JSONH.unpack(JSON.parse(res.data.data.packData)) : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => item.rowIndex = index + 1);
        this.packData = [];
        this.driverData = [];
      }
      this.loading = false;
    });
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
      case 'Export':
        this.out({});
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 返单
   */
  waybillReturn() {
    if (this.selectedWaybillData.length < 1) {
      this.msg.error('请选则一条运单数据！');
    }
    if (this.selectedWaybillData.length === 1) {
      this.isVisible = true;
      const waybill = this.selectedWaybillData[0];
      let data = {};
      data['waybillNo'] = waybill.waybillNo;
      this.http.post(urls.confirmationOfContractPrice, data).then((res): any => {
        if (res.success) {
          this.resData = res.data.data;
          this.returnValidate.patchValue(res.data.data || {});
          // this.returnValidate.get('returnSheet').setValue(res.data.data.returnSheet);
          // this.returnValidate.get('returnTotalWeight').setValue(res.data.data.returnTotalWeight);
        }
      });
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
                tWaybillModels.push({waybillNo: res.waybillNo});
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

  //导出

  out(pageParam: any) {
    let url: any = urls.waybillExport;
    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单返单.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });

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
    console.log(this.returnValidate.value);
    console.log({...this.selectedWaybillData[0], ...this.returnValidate.value});
    this.http.post(TRANS_URLS.RETURN_WAYBILL, {...this.selectedWaybillData[0], ...this.returnValidate.value}).then(
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
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);

    if (data.length === 0) {
      this.packData = [];
      this.driverData = [];
    } else {
      const tWaybills = [];
      for (let i = 0, len = this.selectedWaybillData.length; i < len; i++) {
        tWaybills.push(
          {
            companyId: this.selectedWaybillData[i].companyId,
            waybillNo: this.selectedWaybillData[i].waybillNo
          }
        );
      }
      this.queryPack(tWaybills);
      this.queryDriver(tWaybills);
    }
  }

  selected(data: any) {
    // this.totalWeight = 0;
    this.selectedData = data;
    // this.totalSheet = this.selectedData.length;
    // this.selectedData.forEach(item => {
    //    this.totalWeight += Number(item.packWeight);
    //  })
    //统计
    this.packWeight = data.map((x: any) => x.prePackWeight).reduce((x: string, y: string) => Number(x) + Number(y), 0);
    this.packNum = data.map((x: any) => x.prePackSheet).reduce((x: string, y: string) => Number(x) + Number(y), 0);
  }

  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(tWaybills:Array<any>) {

    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据运单查询运单司机信息
   */
  queryDriver(tWaybills:Array<any>) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, {tWaybills: tWaybills}).then(
      (res: any) => {
        if (res.success) {
          this.driverData = res.data.data;
        }
      }
    );
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 60}px`;
  }
}

