import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {urls} from '@model/url';
import {format} from 'date-fns';
import {HttpUtilService} from '@service/http-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {GlobalService} from '@service/global-service.service';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-pretender-pallet-add',
  templateUrl: './pretender-pallet-add.component.html',
  styleUrls: ['./pretender-pallet-add.component.css'],
  providers: [
    XlsxService
  ]
})
export class PretenderPalletAddComponent implements OnInit {
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('productName') productName: ElementRef;
  @ViewChild('commonSpecifications') commonSpecifications: ElementRef;


  public distanceLoading: boolean;
  public distanceError: boolean;
  public distanceErrorStr = '没有查到相关的路程数据,请您手动录入路程';
  tenderForm: FormGroup;
  data1: any[] = [];
  columns1: any = {};
  data3: any[] = [];
  radioArr: Array<any> = [];
  provinceArr: Array<any> = [];
  provinceArr1: Array<any> = [];
  cityArr: Array<any> = [];
  cityArr1: Array<any> = [];
  areaArr: Array<any> = [];
  areaArr1: Array<any> = [];
  townArr: Array<any> = [];
  provinceName: string = '';
  cityName: string = '';
  districtName: string = '';
  townName: string = '';
  tempData: any;
  control: any = {};
  tabIndex: number = 0;
  consignorCompany: any;
  pierList: any[] = [];
  AddressList: any[] = []; // 地址列表
  selectArr: Array<any> = [];
  palletNo: string = '';// 要修改的货盘号
  isCopyUpdate: boolean = false;
  formId: string = 'form_pretender_pallet';// 默认
  btnsave: boolean = false;
  pid: string = '';
  plateCompanyId: string;
  btndata: any;

  segments: Array<any> = [];

  companyType: string;
  productNameArr: any[] = [];
  Specifications: any[] = [];
  ZcityClickNum: number = 0;
  ZarrClickNum: number = 0;
  loadStandardArr: Array<any> = [];
  wlRelationshipArr: Array<any> = [{code: '10', name: '且'}, {code: '20', name: '或'}];

  constructor(
    private xlsx: XlsxService,
    private nzMess: NzNotificationService,
    private fb: FormBuilder,
    private http: HttpUtilService,
    private route: ActivatedRoute,
    private router: Router,
    private appInfo: UserinfoService,
    private global: GlobalService,
    private anhttp: HttpClient
  ) {
  }

  private getProductName(name = '') {
    this.http.post(urls.getprodKindPrice, {prodKind: 20, prodName: name}).then((res: any) => {
      if (res.success) {
        this.productNameArr = res.data.data;
      }
    });
  }


  // // 获取静态数据
  // getcompanyStatic(data: Array<any>, valueSetCode: string): void {
  //   this.http.post(urls.companyStatic, {valueSetCode: valueSetCode}).then(
  //     (res: any) => {
  //       // console.log(res.data.data.data)
  //       if (res.success) {
  //         res.data.data.data.forEach(item=>{
  //           data.push(item)
  //         })
  //       }
  //     }
  //   );
  // }
  private getSpecifications(name = '') {
    this.http.post(urls.companyStatic, {prodKind: 20, prodName: name}).then((res: any) => {
      if (res.success) {
        this.Specifications = res.data.data;
      }
    });
  }

  companyId: string;

  ngOnInit() {
    this.getProductName();
    this.getcompanyStatic(this.Specifications, 'CYGGZ');

    const param = {companyId: this.appInfo.APPINFO.USER.companyId};
    this.companyId = this.appInfo.APPINFO.USER.companyId;
    this.companyType = this.appInfo.APPINFO.USER.companyType;
    if (this.companyType === 'GSLX20') {
      this.getCompanyByCompanyId(param);
    }
    this.getAddressData({level: 'DZDJ10'}, true);
    this.getSegments();
    this.getStatic(this.loadStandardArr, 'ZTBZZ');

    this.tenderForm = this.fb.group({
      consignorCompanyId: [null, [Validators.required]],
      plateCompanyName: [{value: null, disabled: true}, [Validators.required]],
      transType: [null, [Validators.required]],
      startPoint: [null, [Validators.required]],
      startAddress: [null, [Validators.required]],
      endPoint: [null, [Validators.required]],
      endAddress: [null, [Validators.required]],
      thresholdsWeight: [null, [Validators.required]],
      originProvinceId: [null, [Validators.required]],
      originCityId: [{value: null, disabled: true}, [Validators.required]],
      originDistrictId: [{value: null, disabled: true}, [Validators.required]],
      destinationProvinceId: [null, [Validators.required]],
      destinationCityUd: [{value: null, disabled: true}, [Validators.required]],
      destinationDistrictId: [{value: null, disabled: true}, [Validators.required]],
      distance: [null, []],
      flowNameStart: [null, [Validators.required]],
      flowNameEnd: [null, [Validators.required]],
      hiredType: ['20', [Validators.required]],
      loadStandard: ['30', [Validators.required]],
      businessType: [null, [Validators.required]]
    });
    this.route.queryParams.subscribe(x => {
      this.btndata = x;
      if (x.palletNo) {
        this.isCopyUpdate = true;
        this.formId = x.type === '1' ? 'form_pretender_pallet' : 'add_pending_resources';
        this.updateCopyInfoGet({palletNo: x.palletNo}, x.btnId);
      } else {
        this.isCopyUpdate = false;
        this.data3 = [];
        this.data1 = [];
      }
    });
    this.getUserBusiSegment();
    this.companyId == 'C000000882' && this.tenderForm.get('businessType').setValue('009');
  }

  flowFocus(){
    this.tenderForm.get('distance').setValue('');
  }
  // 路程焦点事件
  public focus() {
    const startProvince = this.provinceArr.filter((x: any) => x.code === this.tenderForm.get('originProvinceId').value)[0] || {};
    const startCity = this.cityArr.filter((x: any) => x.code === this.tenderForm.get('originCityId').value)[0] || {};
    const startArea = this.areaArr.filter((x: any) => x.code === this.tenderForm.get('originDistrictId').value)[0] || {};
    const endProvince = this.provinceArr1.filter((x: any) => x.code === this.tenderForm.get('destinationProvinceId').value)[0] || {};
    const endCity = this.cityArr1.filter((x: any) => x.code === this.tenderForm.get('destinationCityUd').value)[0] || {};
    const endArea = this.areaArr1.filter((x: any) => x.code === this.tenderForm.get('destinationDistrictId').value)[0] || {};

    const startAddress = (startProvince.name || '') + (startCity.name || '') + (startArea.name || '');
    const endAddress = (endProvince.name || '') + (endCity.name || '') + (endArea.name || '');
    if (!startAddress || !endAddress) {
      return;
    }
    this.distanceLoading = true;
    this.distanceError = false;
    forkJoin([
      this.anhttp.post(
        urls.addPointDistance,
        {
          provinceCode: this.tenderForm.get('originProvinceId').value,
          cityCode: this.tenderForm.get('originCityId').value,
          districtCode: this.tenderForm.get('originDistrictId').value,
          address: this.tenderForm.get('flowNameStart').value,
          $modalShow: true
        }
      ),
      this.anhttp.post(
        urls.addPointDistance,
        {
          provinceCode: this.tenderForm.get('destinationProvinceId').value,
          cityCode: this.tenderForm.get('destinationCityUd').value,
          districtCode: this.tenderForm.get('destinationDistrictId').value,
          address: this.tenderForm.get('flowNameEnd').value,
          $modalShow: true
        }
      )
    ]).subscribe((res: any[]) => {
      if (res[0] && res[0].code === 100 && res[1] && res[1].code === 100) {
        this.anhttp.post(
          urls.selectDistance,
          {
            startLocationId: res[0].data.locationId,
            endLocationId: res[1].data.locationId,
            companyId: this.appInfo.get('USER').companyId,
            $modalShow: true
          }
        ).subscribe((rs: any) => {
          this.distanceLoading = false;
          if (rs.code === 100) {
            this.distanceError = false;
            this.tenderForm.get('distance').setValue(rs.data.distance || null);
          } else {
            this.distanceError = true;
            this.distanceErrorStr = rs.msg;
          }
        });
      } else {
        this.distanceLoading = false;
        this.distanceError = true;
        this.distanceErrorStr = '没有查到相关的路程数据,请您手动录入路程';
      }
    });
  }

  /**
   * 查询公司业务板块
   */
  getSegments() {
    this.http.post(urls.getSegmentInformation, {transType: '20'}).then((res: any) => {
      this.segments = res.data.data || [];
    });
  }

  updateCopyInfoGet(params: any, type: string) {
    this.http.post(urls.getPalletAll, params).then((x: any) => {
      if (x.success) {
        this.data3 = [];
        this.data3.push(x.data.data || {});
        this.btndata.btnId === 'Update' && (this.palletNo = x.data.data.palletNo);
        this.data1 = x.data.data.tPalletItems || [];
        this.tenderForm.patchValue(x.data.data || {});
        this.consignorCompany = x.data.data.consignorCompanyName;
        this.pierList = [{
          pierId: x.data.data.startPoint,
          address: x.data.data.startPointStr
        }, {
          pierId: x.data.data.endPoint,
          address: x.data.data.endPointStr
        }];
        this.AddressList = [{
          pierId: x.data.data.startAddress,
          address: x.data.data.startAddressStr2
        }, {
          pierId: x.data.data.endAddress,
          address: x.data.data.endAddressStr2
        }];
        this.tenderForm.get('startPoint').setValue(this.pierList[0]);
        this.tenderForm.get('endPoint').setValue(this.pierList[1]);
        this.tenderForm.get('startAddress').setValue(this.AddressList[0]);
        this.tenderForm.get('endAddress').setValue(this.AddressList[1]);

        this.packAdd(this.data1);
      }
    });
  }

  getCompanyId(data: any) {
    this.tenderForm.get('consignorCompanyId').setValue(data.inpValue);
  }

  getCompanyByCompanyId(data: {}) { // 根据id查公司
    this.http.post(urls.getCompanyByCompanyId, data).then(res => {
      if (res.success) {
        this.consignorCompany = res.data.data.companyName;
        this.tenderForm.get('consignorCompanyId').setValue(res.data.data.companyId);
      }
    });
  }

  add() {
    this.palletNo = '';
    this.tenderForm.reset();
    this.consignorCompany = '';
    this.data1 = [];
  }

  save() {
    const boolone: boolean = true;
    let booltwo: boolean = true;
    if (!this.tenderForm.value.originProvinceId) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请填写装点省！');
    }
    if (!this.tenderForm.value.originCityId) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请填写装点市！');
    }
    if (!this.tenderForm.value.destinationProvinceId) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请填写卸点省！');
    }
    if (!this.tenderForm.value.destinationCityUd) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请填写卸点市！');
    }
    if (!this.tenderForm.value.hiredType) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请选择是否包车！');
    }
    if (!this.tenderForm.value.loadStandard) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '请选择载重方式！');
    }

    if (this.tenderForm.value.flowNameStart && this.tenderForm.value.flowNameStart.length > 50) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '装点最多可输入50个字符！');
    }
    if (this.tenderForm.value.flowNameEnd && this.tenderForm.value.flowNameEnd.length > 50) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '卸点最多可输入50个字符！');
    }

    if (this.tenderForm.value.thresholdsWeight && this.tenderForm.value.thresholdsWeight.toString().length > 18) {
      this.nzMess.remove();
      return this.nzMess.create('error', '提示信息', '临界吨位最多可输入18个字符！');
    }

    if (boolone) {
      const data = Utils.deepCopy(this.data1);
      if (data.length == 0) {
        this.nzMess.remove();
        return this.nzMess.create('error', '提示信息', '请添加货盘明细');
      }
      data.forEach((item: any) => {
        if (booltwo) {
          for (const ins in item) {
            if (!item.refCapacity) {
              this.nzMess.remove();
              this.nzMess.create('error', '提示信息', '参考运量不能为空');
              booltwo = false;
              break;
            }
            if (!item.productName) {
              this.nzMess.remove();
              this.nzMess.create('error', '提示信息', '品名不能为空');
              booltwo = false;
              break;
            }
          }
          if (item.contractNo && item.contractNo.length > 30) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '合同号最多可输入30个字符！');
            booltwo = false;
          }
          if (item.ownerId && item.ownerId.length > 30) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '货主最多可输入10个字符！');
            booltwo = false;
          }
          if (item.refCapacity && item.refCapacity.length > 18) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '参考运量最多可输入18个字符！');
            booltwo = false;
          }
          if (item.minLength && item.minLength.length > 18) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '最小长度最多可输入18个字符！');
            booltwo = false;
          }
          if (item.maxLength && item.maxLength.length > 18) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '最大长度最多可输入18个字符！');
            booltwo = false;
          }
          if (item.remark && item.remark.length > 200) {
            this.nzMess.remove();
            this.nzMess.create('error', '提示信息', '备注最多可输入200个字符！');
            booltwo = false;
          }
        }
      });
      if (booltwo) {
        data.map((x: any) => {
          x.palletPackModelList = x.orderTenderPacks;
        });
        let url = urls.insertPalletAndItem;
        const params = Utils.deepCopy(this.tenderForm.value);

        params.endPoint = this.tenderForm.value.endPoint && this.tenderForm.value.endPoint.pierId;
        params.plateCompanyId = this.plateCompanyId;
        params.startPoint = this.tenderForm.value.startPoint && this.tenderForm.value.startPoint.pierId;
        params.endAddress = this.tenderForm.value.endAddress && this.tenderForm.value.endAddress.pierId;
        params.startAddress = this.tenderForm.value.startAddress && this.tenderForm.value.startAddress.pierId;

        params.tPalletItems = data;
        if (this.palletNo) { // 如果有货盘号就是要修改的
          params.palletNo = this.palletNo;
          url = urls.updatePalletAndItem;
        }
        this.btnsave = true;
        this.http.post(url, params).then((res: any) => {
          this.btnsave = false;
          if (res.success) {
            this.nzMess.remove();
            const palletNo = res.data.data && res.data.data.palletNo;
            this.palletNo ? this.nzMess.create('success', '提示信息', '修改成功！') : this.nzMess.create('success', '提示信息', '保存成功！');
            const data3 = this.data3.filter((x: any) => x.palletNo != palletNo);
            res.data.data && data3.unshift(res.data.data);
            this.data3 = data3;
            this.palletNo = palletNo;// 要修改的货盘号
            this.data1 = [];
            this.data1 = Utils.deepCopy(res.data.data && res.data.data.palletItemModelList || []);
            this.packAdd(this.data1);
            this.router.navigate(['system/pretender/pretenderPublish']).then(
              () => {
                this.global.searchReload.emit({target: 'pretenderPalletAdd'});
              }
            );
          }
        });
      }
    }
  }

  // 省市区变化
  addressChange(value, name, flag): void {
    this.tenderForm.get('distance').setValue('');
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          if (flag == 'zhuang') {
            this.ZcityClickNum += 1;
            this.getAddressData({level: 'DZDJ20', parentCode: value, flag: flag});
            this.tenderForm.get('originCityId').reset({value: null, disabled: false});
            this.tenderForm.get('originDistrictId').reset({value: null, disabled: true});
          } else {
            this.getAddressData({level: 'DZDJ20', parentCode: value, flag: flag});
            this.tenderForm.get('destinationCityUd').reset({value: null, disabled: false});
            this.tenderForm.get('destinationDistrictId').reset({value: null, disabled: true});
          }
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
          if (flag == 'zhuang') {
            this.ZarrClickNum += 1;
            this.getAddressData({level: 'DZDJ30', parentCode: value, flag: flag});
            this.tenderForm.get('originDistrictId').reset({value: null, disabled: false});
          } else {
            this.getAddressData({level: 'DZDJ30', parentCode: value, flag: flag});
            this.tenderForm.get('destinationDistrictId').reset({value: null, disabled: false});
          }
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value, flag: flag});
        }
      }
        break;
    }
  }

  getAddressData(data, isTrue ?: boolean): void { // 获取省市区
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              this.provinceArr1 = res.data.data;
              if (this.tempData) {
                this.tenderForm.patchValue(this.tempData);
                this.provinceName = this.tempData.provinceName;
                this.cityName = this.tempData.cityName;
                this.districtName = this.tempData.districtName;
                this.tempData = {};
              }
              if (isTrue) {
                this.companyId == 'C000000882' && this.tenderForm.get('originProvinceId').setValue('370000000');
                this.companyId == 'C000000882' && this.tenderForm.get('destinationProvinceId').setValue('370000000');
              }
            }
              break;
            case 'DZDJ20': {
              if (data.flag == 'zhuang') {
                this.cityArr = res.data.data;
                this.companyId == 'C000000882' && this.ZcityClickNum <= 1 && this.tenderForm.get('originCityId').setValue('371100000');
              } else {
                this.cityArr1 = res.data.data;
              }
            }
              break;
            case 'DZDJ30': {
              if (data.flag == 'zhuang') {
                this.areaArr = res.data.data;
                this.companyId == 'C000000882' && this.ZarrClickNum <= 1 && this.tenderForm.get('originDistrictId').setValue('371103000');
              } else {
                this.areaArr1 = res.data.data;
              }
            }
              break;
          }
        }
      }
    );
  }

  data3Click(data: any) { // 3列表点击
    this.data1 = data.palletItemModelList;
    this.tenderForm.patchValue(data);
    this.consignorCompany = data.companyName;
    this.palletNo = data.palletNo;// 要修改的货盘号
    this.packAdd(this.data1);
    this.pierList = [{
      pierId: data.startPoint,
      address: data.startPointStr
    }, {
      pierId: data.endPoint,
      address: data.endPointStr
    }];
    this.AddressList = [{
      pierId: data.startAddress,
      address: data.startAddressStr2
    }, {
      pierId: data.endAddress,
      address: data.endAddressStr2
    }];
    this.tenderForm.get('startPoint').setValue(this.pierList[0]);
    this.tenderForm.get('endPoint').setValue(this.pierList[1]);
    this.tenderForm.get('startAddress').setValue(this.AddressList[0]);
    this.tenderForm.get('endAddress').setValue(this.AddressList[1]);

  }

  getColums(data: any, type: number) {
    const col = Array.isArray(data) ? data : [];
    if (type == 1) {
      this.columns1 = {};
      col.map((x: any) => {
        this.columns1[x.colEname] = null;
        x.colEname === 'productName' && (x.required = true); // 品名必填
        x.colEname === 'refCapacity' && (x.required = true); // 品名必填
        x.colEname === 'productName' && (x.tdTemplate = this.productName);
        x.colEname === 'commonSpecifications' && (x.tdTemplate = this.commonSpecifications);

      });
    }
  }

  addData(type: number) {
    this.columns1.wlRelationship = 'CKGX10';
    this.data1.unshift(Object.assign({}, this.columns1));
    this.data1 = [...this.data1];

  }

  deleteData(type: number) {
    if (type == 1) {
      const checkData = this.data1.filter((x: any) => x.checked);
      this.data1 = this.data1.filter((x: any) => !x.checked);
    }
  }

  private packAdd(data: any) {
    data.map((y: any) => {
      y.palletPackModelList ? y.orderTenderPacks = y.palletPackModelList : null;// 捆包明细
      if (y.packFlag == 1) { // 货盘不可更改
        y.inputDisabled = {
          productName: true,
          specDesc: true,
          productType: true,
          containerType: true,
          containerNo: true,
          goodsWeight: true,
          goodsNo: true
        };
      }
    });
  }

  /**
   * 获取业务板块
   */
  private getUserBusiSegment() {
    this.anhttp.post(urls.userBusiSegment, {}).subscribe(
      (res: any) => {
        const data = (res.data || []).map(x => ({name: x.segmentName, value: x.segmentId}));
        this.selectArr = data;
      }
    );
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

  // 获取静态数据
  getcompanyStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.companyStatic, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

  change(data, listData) {
    if (data){
      let arr = data && data.split(',');
      listData.minWidth = arr[0];
      listData.maxWidth = arr[1];
      listData.minLength = arr[2];
      listData.maxLength = arr[3];
      listData.wlRelationship = arr[4];
    } else{
      listData.minWidth = null;
      listData.maxWidth = null;
      listData.minLength = null;
      listData.maxLength = null;
      listData.wlRelationship = 'CKGX10';
    }
  }

}
