import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import {Utils} from '@util/utils';
import {format} from 'date-fns';

@Component({
  selector: 'app-stay-management-item',
  templateUrl: './stay-management-item.component.html',
  styleUrls: ['./stay-management-item.component.css']
})
export class StayManagementItemComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('productName') productName: ElementRef;
  tenderForm: FormGroup;
  data1: any[] = [];
  columns1: any = {};
  data2: any[] = [];
  data3: any[] = [];
  columns2: any = {};
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
  // params:any = {}; //保存的的参数
  pierList: any[] = [];
  AddressList: any[] = []; //码头列表
  pierPage: number = 1;
  pierText: string = '';
  AddressText: string = '';
  pierLoading: boolean = false;
  addressLoading: boolean = false;
  palletNo: string = '';//要修改的货盘号
  isCopyUpdate: boolean = false;
  formId: string = 'form_pretender_pallet';//默认
  btnsave: boolean = false;
  pid: string = '';
  startPid: string = '';
  endPid: string = '';
  plateCompanyId: string;
  btndata: any;
  flowLoading: boolean = false;
  exportLoading: boolean = false;

  segments: Array<any> = [];

  companyType: string;
  productNameArr: any[] = [];

  constructor(private xlsx: XlsxService, private nzMess: NzNotificationService, private fb: FormBuilder, private http: HttpUtilService, private route: ActivatedRoute, private router: Router, private appInfo: UserinfoService) {
  }

  private getProductName(name = '') {
    this.http.post(urls.getprodKindPrice, {prodKind: 20, prodName: name}).then((res: any) => {
      if (res.success) {
        this.productNameArr = res.data.data;
      }
    });
  }

  ngOnInit() {
    this.getProductName();
    const param = {companyId: this.appInfo.APPINFO.USER.companyId};
    this.companyType = this.appInfo.APPINFO.USER.companyType;
    if (this.companyType === 'GSLX20') {
      this.getCompanyByCompanyId(param);
    }
    this.getAddressData({level: 'DZDJ10'});

    this.getSegments();

    this.tenderForm = this.fb.group({
      palletNo: [{value: null, disabled: true}, []],
      consignorCompanyId: [null, [Validators.required]],
      plateCompanyName: [{value: null, disabled: true}, [Validators.required]],
      transType: [null, [Validators.required]],
      startPoint: [null, [Validators.required]],
      startAddress: [null, [Validators.required]],
      endPoint: [null, [Validators.required]],
      endAddress: [null, [Validators.required]],
      executionTimeStart: [null, [Validators.required]],
      executionTimeEnd: [null, [Validators.required]],
      shipSociety: [null, [Validators.required]],
      targetDate: [null, [Validators.required]],
      settleNode: [null, [Validators.required]],
      thresholdsWeight: [null, [Validators.required]],
      shipAge: [null, [Validators.required]],
      shipmentTerm: [null, [Validators.required]],
      demurrageFee: [null, [Validators.required]],
      demurrageFeeType: [null, [Validators.required]],
      demurrageFeePoing: [null, [Validators.required]],
      originProvinceId: [null, [Validators.required]],
      originCityId: [{value: null, disabled: true}, [Validators.required]],
      originDistrictId: [{value: null, disabled: true}, [Validators.required]],
      destinationProvinceId: [null, [Validators.required]],
      destinationCityUd: [{value: null, disabled: true}, [Validators.required]],
      destinationDistrictId: [{value: null, disabled: true}, [Validators.required]],
      flowNameStart: [null, [Validators.required]],
      flowNameEnd: [null, [Validators.required]],
      hiredType: ['20', [Validators.required]],
      loadStandard: ['10', [Validators.required]],
      businessType: [null, [Validators.required]],
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
        this.data2 = [];
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
      console.log(x);
      if (x.success) {
        this.data3 = [];
        this.data3.push(x.data.data || {});
        this.btndata.btnId === 'Update' && (this.palletNo = x.data.data.palletNo);
        this.data1 = x.data.data.tPalletItems || [];
        this.tenderForm.patchValue(x.data.data || {});
        this.endPid = x.data.data.endPoint;
        this.startPid = x.data.data.startPoint;
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

  getCompanyByCompanyId(data: {}) {   //根据id查公司
    this.http.post(urls.getCompanyByCompanyId, data).then(res => {
      console.log(res);
      if (res.success) {
        this.consignorCompany = res.data.data.companyName;
        this.tenderForm.get('consignorCompanyId').setValue(res.data.data.companyId);

      }
    });
  }

  save() {
    let boolone: boolean = true;
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
      let data = Utils.deepCopy(this.data1);
      if (data.length == 0) {
        this.nzMess.remove();
        return this.nzMess.create('error', '提示信息', '请添加货盘明细');
      }
      console.log(data);
      data.forEach((item: any) => {
        if (booltwo) {
          for (let ins in item) {
            if (!item['refCapacity']) {
              this.nzMess.remove();
              this.nzMess.create('error', '提示信息', '参考运量不能为空');
              booltwo = false;
              break;
            }
            if (!item['productName']) {
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
        let params = Utils.deepCopy(this.tenderForm.value);
        params.plateCompanyId = this.plateCompanyId;
        params.startPoint = this.tenderForm.value.startPoint && this.tenderForm.value.startPoint.pierId;
        params.startAddress = this.tenderForm.value.startAddress && this.tenderForm.value.startAddress.pierId;
        params.executionTimeEnd = format(this.tenderForm.value.executionTimeEnd, 'YYYY-MM-DD');
        params.executionTimeStart = format(this.tenderForm.value.executionTimeStart, 'YYYY-MM-DD');
        params.tPalletItems = data;
        if (this.palletNo) { //如果有货盘号就是要修改的
          params.palletNo = this.palletNo;
          url = urls.updatePalletAndItem;
        }
        this.btnsave = true;
        console.log(params);
        this.http.post(url, params).then((res: any) => {
          this.btnsave = false;
          if (res.success) {
            this.nzMess.remove();
            let palletNo = res.data.data && res.data.data.palletNo;
            this.palletNo ? this.nzMess.create('success', '提示信息', '修改成功！') : this.nzMess.create('success', '提示信息', '保存成功！');
            let data3 = this.data3.filter((x: any) => x.palletNo != palletNo);
            res.data.data && data3.unshift(res.data.data);
            this.data3 = data3;
            this.palletNo = palletNo;//要修改的货盘号
            this.data1 = [];
            this.data1 = Utils.deepCopy(res.data.data && res.data.data.palletItemModelList || []);
            this.packAdd(this.data1);
            this.router.navigate(['system/pretender/pretenderPublish']);
          }
        });
      }
    }
  }

  //获取省市区
  addressChange(value, name, flag): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          if (flag == 'zhuang') {
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

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              this.provinceArr1 = res.data.data;
              //this.provinceArr = res.data.data;
              if (this.tempData) {
                this.tenderForm.patchValue(this.tempData);
                this.provinceName = this.tempData.provinceName;
                this.cityName = this.tempData.cityName;
                this.districtName = this.tempData.districtName;
                this.tempData = {};
              }
            }
              break;
            case 'DZDJ20': {
              if (data.flag == 'zhuang') {
                this.cityArr = res.data.data;
              } else {
                this.cityArr1 = res.data.data;
              }
            }
              break;
            case 'DZDJ30': {
              if (data.flag == 'zhuang') {
                this.areaArr = res.data.data;
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

  data3Click(data: any) { //3列表点击
    this.data1 = data.palletItemModelList;
    this.tenderForm.patchValue(data);
    this.consignorCompany = data.companyName;
    this.palletNo = data.palletNo;//要修改的货盘号
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

    let col = Array.isArray(data) ? data : [];
    if (type == 1) {
      this.columns1 = {};
      col.map((x: any) => {
        this.columns1[x.colEname] = null;
        x.colEname === 'productName' && (x.required = true); //品名必填
        x.colEname === 'refCapacity' && (x.required = true); //品名必填
        x.colEname === 'productName' && (x.tdTemplate = this.productName);
      });
    } else {
      this.columns2 = {};
      col.map((x: any) => {
        this.columns2[x.colEname] = null;
      });
    }
  }

  addData(type: number) {
    type == 1 ? this.data1.unshift(Object.assign({}, this.columns1)) : this.data2.unshift(Object.assign({}, this.columns2));
    type == 1 ? this.data1 = [...this.data1] : this.data2 = [...this.data2];
  }

  deleteData(type: number) {
    if (type == 1) {
      let checkData = this.data1.filter((x: any) => x.checked);
      this.data1 = this.data1.filter((x: any) => !x.checked);
      this.data2 = this.data2.filter((x: any) => {
        return checkData.every((y: any) => (x.productName !== y.productName) && (x.specDesc !== y.specDesc));
      });
    }
  }

  openFile() {
    this.inputFile.nativeElement.click();
  };

  importExcel(file: any) {
    /**
     * 导入表格字段顺序不变，按照下列顺序
     * 品名 productName ，外径 outerDiameter，壁厚 thickness，米重density，长度lengthSpec，捆数bundleNo，支数/捆bundleCount，总支数bundleTotal，重量goodsWeight，打包方式packType，备注remark
     */
    let xls = file.target.files[0];
    this.exportLoading = true;
    this.xlsx.import(xls).then((x: any) => {
      let key = Object.keys(x);
      let data = x[key[0]];
      if (!data) {
        this.nzMess.remove();
        this.nzMess.create('error', '提示信息', '读取Excel数据失败！未读取到sheet页!');
        this.inputFile.nativeElement.value = '';
        this.exportLoading = false;
        return;
      }
      if (!this.validateData(data)) {
        this.nzMess.remove();
        this.nzMess.create('error', '提示信息', '品名不能为空');
        this.inputFile.nativeElement.value = '';
        this.exportLoading = false;
        return;
      }
      this.excelFilter(data);
      this.inputFile.nativeElement.value = '';
    });
  }

  validateData(data: string[]) {
    data.some((x) => {
      if (!x[0]) { //品名不能为空 ，默认第一个就是品名
        return false;
      }
    });
    return true;
  }

  excelFilter(x: string[]) {
    for (let i = 1; i < x.length; i++) {
      let temp: any = Utils.deepCopy(this.columns2);
      temp.productName = x[i][0];
      temp.outerDiameter = x[i][1];
      temp.thickness = x[i][2];
      temp.density = x[i][3];
      temp.lengthSpec = x[i][4];
      temp.bundleNo = x[i][5];
      temp.bundleCount = x[i][6];
      temp.bundleTotal = x[i][7];
      temp.goodsWeight = x[i][8];
      temp.packType = x[i][9];
      temp.remark = x[i][10];
      this.data2.unshift(temp);
    }
    this.data2 = [...this.data2];
    this.exportLoading = false;
  }

  flowData1() { //汇成
    this.flowLoading = true;
    let arr = Utils.deepCopy(this.data2);
    let obj: any = {}, store: any = {}, result = [];
    arr.map((x: any) => {
      let id = (x.productName || '').trim() + (x.specDesc || '').trim();
      let copy = Utils.deepCopy(x);
      if (!obj[id]) {
        store[id] = [];
        store[id].push(copy);
        obj[id] = true;
      } else {
        store[id].push(copy);
      }
    });

    for (let i in store) {
      let col1: any = Utils.deepCopy(this.columns1);
      col1.productName = store[i][0].productName;
      col1.specDesc = store[i][0].specDesc;
      let remark = [], productType = [], containerType = [], containerNo = [];
      store[i].map((s: any) => {
        remark.push(s.remark);
        productType.push(s.productType);
        containerType.push(s.containerType);
        containerNo.push(s.containerNo);
        col1.goodsWeight = Utils.add(col1.goodsWeight || 0, s.goodsWeight || 0);
        col1.goodsNo = Utils.add(col1.goodsNo || 0, s.goodsNo || 0);
      });
      col1.orderTenderPacks = store[i];
      col1.packFlag = 1;//1表示汇总形成的
      col1.inputDisabled = { //货盘不可更改
        'productName': true,
        'specDesc': true,
        'productType': true,
        'containerType': true,
        'containerNo': true,
        'goodsWeight': true,
        'goodsNo': true
      };
      result.push(col1);
    }

    //加入data1
    this.data1 = this.data1.filter(x => x.packFlag != 1);//清除之前汇总的
    this.data1 = [...result, ...this.data1];
    this.tabIndex = 0;
    window.setTimeout(() => {
      this.flowLoading = false;
    });
  }

  openPier(open: boolean, type: number) {
    this.pierText = '';
    this.pierPage = 0;
    type == 1 ? this.tenderForm.get('startAddress').setValue('') :
      this.tenderForm.get('endAddress').setValue('');
    open ? this.getPier() : this.pierList = [];
  }

  getPier() {
    this.pierPage++;
    this.pierLoading = true;
    //  this.pierList = [];
    this.http.post(urls.getPierBy, {address: this.pierText, page: this.pierPage, length: 30}).then((res: any) => {
      if (res.success) {
        this.pierLoading = false;
        let list = Utils.deepCopy(res.data.data && res.data.data.data || []);
        this.pierList = [...this.pierList, ...list];
      }
    });
  }

  searchPier(address: string) {
    this.pierText = address;
    this.pierPage = 0;
    this.getPier();
  }

  getAddress(data: any, type: number) {
    if (data) {
      type == 1 ? this.startPid = data.pierId : this.endPid = data.pierId;
    }
  }

  openAddress(open: boolean, type: number) { //获取码头
    this.pid = type == 1 ? this.startPid : this.endPid;
    this.AddressText = '';
    this.pierPage = 0;
    open && this.getMoreAddress();
  }

  searchAddress(address: string) {   // 输入框查找码头
    this.AddressText = address;
    this.pierPage = 0;
    this.getMoreAddress();
  }

  getMoreAddress() {                     // 码头加载更多
    this.pierPage++;
    this.AddressList = [];
    if (this.pid) {
      this.addressLoading = true;
      this.http.post(urls.getPierBytwo, {
        address: this.AddressText,
        pId: this.pid,
        page: this.pierPage,
        length: 30
      }).then((res: any) => {
        if (res.success) {
          this.addressLoading = false;
          let list = Utils.deepCopy(res.data.data && res.data.data.data || []);
          this.AddressList = [...this.AddressList, ...list];
        }
      });
    }
  }

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.tenderForm.value.executionTimeEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.tenderForm.value.executionTimeEnd === 'string') {
      let data = new Date(Date.parse(this.tenderForm.value.executionTimeEnd));
      this.tenderForm.value.executionTimeEnd = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > this.tenderForm.value.executionTimeEnd.getTime());

  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tenderForm.value.executionTimeStart) {
      return false;
    }
    if (typeof this.tenderForm.value.executionTimeStart === 'string') {
      let data = new Date(Date.parse(this.tenderForm.value.executionTimeStart));
      this.tenderForm.value.executionTimeStart = data;
    }
    return endValue.getTime() <= this.tenderForm.value.executionTimeStart.getTime();
  };

  private packAdd(data: any) {
    data.map((y: any) => {
      y.palletPackModelList ? y.orderTenderPacks = y.palletPackModelList : null;//捆包明细
      if (y.packFlag == 1) { //货盘不可更改
        y.inputDisabled = {
          'productName': true,
          'specDesc': true,
          'productType': true,
          'containerType': true,
          'containerNo': true,
          'goodsWeight': true,
          'goodsNo': true
        };
      }
    });
  }

}
