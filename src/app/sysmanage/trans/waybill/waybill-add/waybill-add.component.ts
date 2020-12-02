import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridBlockComponent } from '../../../../components/simple-page/grid-block/public-api';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { format as dateformat } from 'date-fns';
import { localUrls } from '../../../../common/model/localUrls';
import { environment } from '../../../../../environments/environment';
import { SelectService, SelectComponent, XlsxService } from '../../../../components/simple-page/simple-page-form.module';
import { TRANS_URLS, SYS_URLS } from '../../../../common/model/trans-urls';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

declare var XLSX: any;

@Component({
  selector: 'app-waybill-add',
  templateUrl: './waybill-add.component.html',
  styleUrls: ['./waybill-add.component.css']
})

export class WaybillAddComponent implements OnInit {

  packageString: string = '包车'; // 包车字符串

  formId: string = 'form_waybill_reg';

  waybill: any = { loadDate: new Date(), status: true, isSettle: true };
  driver: any = {};

  initRowData = { checked: true, newRow: true, disabled: false };
  packData: Array<any> = [{ ...this.initRowData }];
  driverData: Array<any> = [];

  isVisible: boolean = false; // 弹框是否显示
  importValidate: FormGroup; // 导入表单验证
  importFile: File;
  importLoading: boolean;

  @ViewChild('grid_driver') driverGrid: GridBlockComponent;
  @ViewChild('grid_wayblii_pack') packGrid: GridBlockComponent;
  @ViewChild('consignor_select') select: SelectComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  companyApi = {
    url: localUrls.dataSelectModalListUrl,
    fieldKey: { text: 'companyName', value: 'companyId' },
  }

  pointApi = {
    url: `${environment.baseUrl}point/getPoint`,
    fieldKey: { text: 'locationName', value: 'locationId' },
  }

  flowApi = {
    url: SYS_URLS.SELECT_COMPANY_FLOW,
    fieldKey: { text: 'flowName', value: 'flowId' },
  }

  driverDataSource: Array<any> = [];
  dirverFieldKey = { text: 'employeeId', value: 'userId' };

  operateType: string = 'add';

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private selectService: SelectService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private xlsx: XlsxService,
    private appInfo: UserinfoService) {

    this.importValidate = this.fb.group({
      file: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
      consignorCompanyId: [null, [Validators.required]],
      businessType: [null, [Validators.required]]
    });
    // console.log( dateformat('11/26/18 0:54:50', 'YYYY-MM-DD HH:mm:ss'));
  }

  ngOnInit() {
    console.dir(this)
    // 如果是修改，根据运单号加载该运单数据
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'update') {
          this.operateType = 'update';
          this.loadData(queryParams.waybillNo);
        }
      }

    });
    // 加载司机工号下拉数据源
    this.selectService.getValue(`${environment.baseUrl}user/selectUserList`, {}).then((res: any) => {
      if (res.success) {
        this.driverDataSource = res.data.data.data;
      }
    });

    this.companyApi['param'] = { companyId: this.appInfo.APPINFO.USER.companyId };
  }

  /**
   * 加载运单主表、捆包表、司机表数据
   * @param waybillNo 
   */
  loadData(waybillNo: string) {
    if (!waybillNo) {
      this.msg.error("系统错误！运单号为空！");
    }
    this.query(waybillNo); // 查询运单信息
    this.queryPack(waybillNo); // 查询运单捆包信息
    this.queryDriver(waybillNo); // 查询运单司机信息
  }

  /**
   * 运单查询
   */
  query(waybillNo: string) {
    this.http.post(TRANS_URLS.GET_WAYBILL, { waybillNo: waybillNo }).then(
      (res: any) => {
        if (res.success) {
          this.waybill = res.data.data;
        }
      }
    );
  }

  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(waybillNo: string) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLPACK_BY_WAYBILL, { waybillNo: waybillNo }).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
          // this.packGrid.setRowSelected(this.packData.map((item, index) => index));
        }
      }
    );
  }

  /**
   * 根据运单查询运单司机信息
   */
  queryDriver(waybillNo: string) {
    this.http.post(TRANS_URLS.SELECT_WAYBILLDRIVER_BY_WAYBILL, { waybillNo: waybillNo }).then(
      (res: any) => {
        if (res.success) {
          this.driverData = res.data.data;
          // this.driverGrid.checkAll(true);
        }
      }
    );
  }

  /**
   * 新增保存
   */
  insert() {
    this.handleData();
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    this.http.post(TRANS_URLS.INSERT_WAYBILL, this.waybill).then((res: any) => {
      if (res.success) {
        this.msg.success('保存成功');
      }
    });
  }

  /**
   * 修改保存
   */
  update() {
    this.handleData();
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    this.http.post(TRANS_URLS.UPDATE_WAYBILL, this.waybill).then((res: any) => {
      if (res.success) {
        // 保存成功将新行标记置为false
        this.packData.forEach(item => item.newRow = false);
        this.driverData.forEach(item => item.newRow = false);
        this.msg.success('修改成功');
      }
    });
  }

  /**
   * 提交后台前处理数据
   */
  handleData() {
    this.waybill.loadDate = dateformat(this.waybill.loadDate, 'YYYY-MM-DD HH:mm:ss');
    this.waybill.waybillPackList = this.packGrid.getSelectedRowData();
    this.waybill.waybillDriverList = this.driverGrid.getSelectedRowData();
    this.waybill.status = this.waybill.status ? 'YDZT30' : null;
    this.waybill.isSettle = this.waybill.isSettle ? 'JSBJ10' : 'JSBJ20';
  }

  /**
   * 运单信息验证
   */
  validateWaybill(): boolean {
    const validateArray = [
      { ename: 'loadDate', cname: '装载时间' },
      { ename: 'consignorCompanyId', cname: '委托单位' },
      { ename: 'consigneeCompanyId', cname: '收货单位' },
      { ename: 'startPoint', cname: '装货地' },
      { ename: 'endPoint', cname: '到货地' },
      { ename: 'flowId', cname: '运输方式' },
      { ename: 'unitPrice', cname: '单价' },
    ];
    const msg = validateArray.filter(item => !this.waybill[item.ename]).map(item => item.cname).join(",")
    if (msg) {
      this.msg.error(`${msg}不能为空！`);
      return false;
    }
    return true;
  }

  /**
   * 司机信息验证
   */
  validateDriver(): boolean {
    const validateArray = [
      { ename: 'userId', cname: '用户ID' },
      { ename: 'employeeId', cname: '工号' },
      { ename: 'driverName', cname: '驾驶员' },
      { ename: 'vehicleNo', cname: '车船号' },
      { ename: 'tripNo', cname: '趟次' },
    ];
    const msg = validateArray.filter(item => !this.driver[item.ename]).map(item => item.cname).join(",")
    if (msg) {
      this.msg.error(`${msg}不能为空！`);
      return false;
    }
    return true;
  }

  /**
   * 捆包信息验证
   */
  validatePack(): boolean {
    const validateArray = [
      { ename: 'packWeight', cname: '重量' },
      { ename: 'packNo', cname: '件数' },
    ];
    for (const pack of this.waybill.waybillPackList) {
      const msg = validateArray.filter(item => !pack[item.ename]).map(item => item.cname).join(",")
      if (msg) {
        this.msg.error(`${msg}不能为空！`);
        return false;
      }
    }
    return true;
  }



  /**
   * 取消（取消修改，并跳转到查询界面）
   */
  cancel() {
    this.router.navigate(['/system/trans/waybill/waybill'], { queryParams: {} });
  }

  /**
   * 按钮区所有按钮响应事件（点击统一处理事件）
   * @param buttonId 
   */
  buttonClick(buttonId: string) {
    switch (buttonId) {
      case 'copyAddPack': this.copyAddPack(); break;
      default: this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 复制新增
   */
  copyAddPack() {
    this.packGrid.getSelectedRowData().forEach(item => this.addPack({ ...item, ...this.initRowData }));
  }

  /**
   * 运单捆包新增行
   */
  addPack(data?: any) {
    if (data) {
      this.packData = [...this.packData, { ...this.initRowData, ...data }];
    } else {
      this.packData = [...this.packData, { ...this.initRowData }];
    }
    this.packGrid.refreshStatus(true);
  }

  /**
   * 删除运单捆包信息
   * @param index packData下标
   */
  deletePack(index: number) {
    if (this.packData.length <= 1) {
      return;
    }
    // 如果是新增行数据，直接在界面删除
    if (this.packData[index].newRow) {
      this.packData.splice(index, 1);
    } else {
      // 调用后台删除方法
      this.http.post(TRANS_URLS.DELETE_WAYBILLPACK, this.packData[index]).then((res: any) => {
        if (res.success) {
          this.packData.splice(index, 1);
          this.msg.success('删除捆包信息成功');
        }
      });
    }
  }

  /**
   * 根据选择工号带回的userId查找用户相关信息，并设置到driver中
   * @param userId 
   */
  setDriverInfo(userId: string) {
    if (userId) {
      const user = this.driverDataSource.filter(item => item.userId === userId)[0];
      this.driver.employeeId = user.employeeId;
      this.driver.driverId = user.userId;
      this.driver.driverName = user.name;
      this.driver.vehicleNo = user.vehicleNo;
    }
  }

  /**
   * 趟次输入框Enter键触发方法，将录入司机信息显示到grid中，并清空司机录入相关输入框
   */
  addDriver() {
    if (!this.validateDriver()) {
      return;
    }
    this.driverData = [{ ...this.initRowData, ...this.driver }, ...this.driverData];
    this.driver = {};
    this.driverGrid.refreshStatus(true);
  }

  /**
   * 删除运单司机信息
   * @param index driverData下标
   */
  deleteDriver(index: number) {
    // 如果是新增行数据，直接在界面删除
    if (this.driverData[index].newRow) {
      this.driverData.splice(index, 1);
    } else {
      // 调用后台删除方法
      this.http.post(TRANS_URLS.DELETE_WAYBILLDRIVER, this.driverData[index]).then((res: any) => {
        if (res.success) {
          this.driverData.splice(index, 1);
          this.msg.success('删除司机信息成功');
        }
      });
    }

  }

  importColumns_del: Array<any> = [
    { ename: 'outstockDate', cname: '出库日期', required: true }, // pack
    { ename: 'outstockTime', cname: '时间', required: true }, // pack
    { ename: 'vehicleNo', cname: '车号', required: true }, // driver
    { ename: 'pickNo', cname: '合同号' }, // pack
    { ename: 'outStock', cname: '发货库房', required: true }, //pack 起点
    { ename: 'consigneeCompanyName', cname: '客户', required: true }, // waybill 
    { ename: 'packShopsign', cname: '牌号' }, // pack
    { ename: 'thickness', cname: '厚' }, // pack
    { ename: 'width', cname: '宽' }, // pack
    { ename: 'lengthSpec', cname: '长' }, // pack
    { ename: 'packNo', cname: '出库数量', required: true, validator: 'number' }, // pack
    { ename: 'packWeight', cname: '出库重量', required: true, validator: 'number' }, // pack
    // {ename: 'packWeight', cname: '实重'}, // pack
    { ename: 'carrierCompanyName', cname: '车队', required: true }, // waybill 
    { ename: 'rcvUnitPrice', cname: '客户价', required: true, validator: 'price' },// waybill
    { ename: 'rcvTransFee', cname: '客户金额', required: true, validator: 'number' },// waybill
    { ename: 'unitPrice', cname: '车队价', required: true, validator: 'price' }, // waybill
    { ename: 'transFee', cname: '车队金额', required: true, validator: 'number' },// waybill
    { ename: 'endPoint', cname: '流向', required: true }, // waybill 终点
    { ename: '业务板块', cname: '业务板块' }, // waybill 业务板块

    // {ename: '', cname: '票制'},
  ];

  importColumns: Array<any> = [
    { ename: 'outstockDate', cname: '出库日期', required: true }, 
    { ename: 'outstockTime', cname: '时间', required: true }, 
    { ename: 'vehicleNo', cname: '车号', required: true }, 
    { ename: 'pickNo', cname: '合同号' }, 
    { ename: 'outStock', cname: '发货库房', required: true }, 
    { ename: 'consigneeCompanyName', cname: '客户', required: true }, 
    { ename: 'thickness', cname: '厚' },
    { ename: 'width', cname: '宽' }, 
    { ename: 'lengthSpec', cname: '长' }, 
    { ename: 'packNo', cname: '出库数量', required: true, validator: 'number' }, 
    { ename: 'packWeight', cname: '出库重量', required: true, validator: 'number' }, 
    { ename: 'carrierCompanyName', cname: '车属单位', required: true }, 
    { ename: 'rcvUnitPrice', cname: '平台价格', required: true, validator: 'price' },
    { ename: 'rcvTransFee', cname: '平台金额', required: true, validator: 'number' },
    { ename: 'unitPrice', cname: '车队价', required: true, validator: 'price' }, 
    { ename: 'transFee', cname: '车队应付款', required: true, validator: 'number' },
    { ename: 'endPoint', cname: '到货地址', required: true }, 
    // { ename: '业务板块', cname: '业务板块' }, // waybill 业务板块

    // {ename: '', cname: '票制'},
  ];

  /**
   * Excel导入弹出框
   */
  showModal() {
    this.isVisible = true;
    this.importLoading = false;
    this.importValidate.reset();
  }

  /**
   * 点击输入框弹出文件选择框
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }
  /**
   * 选择文件后将文件名称回写到输入框中
   * @param e 
   */
  writeFileName(e: any) {
    this.importFile = e.target.files[0];
    this.importValidate.patchValue({ fileName: this.importFile.name });
  }

  /**
   * 导入确定按钮触发事件
   */
  importExcel() {
    for (const i in this.importValidate.controls) {
      this.importValidate.controls[i].markAsDirty();
      this.importValidate.controls[i].updateValueAndValidity();
    }
    if (this.importValidate.invalid) {
      console.error('文件选择框无数据');
      return false;
    }
    this.importLoading = true;
    // 读取Execl数据
    this.xlsx.import(this.importFile).then(res => {
      const keys = Object.keys(res);
      if (!keys || keys.length == 0) {
        this.importLoading = false;
        this.msg.error("未读取到sheet页！");
        return;
      }

      const data = res[keys[0]];
      if (!data || data.length < 2) {
        this.importLoading = false;
        this.msg.error("未读取到Excel数据！");
        return;
      }

      // 模板必要字段验证
      if (this.validateColumn(data[0]) === false) {
        this.importLoading = false;
        return;
      }

      const packArray = this.toPackArray(data);
      // 捆包数据验证
      if (this.validateData(packArray) === false) {
        this.importLoading = false;
        return;
      }

      const waybillList = this.packToWaybill(packArray);
      // 运单数据验证
      if (this.validateWaybillImport(waybillList) === false) {
        this.importLoading = false;
        return;
      }

      const consignorCompanyId = this.importValidate.value.consignorCompanyId;
      const businessType = this.importValidate.value.businessType;
      waybillList.forEach(item => {
        item.consignorCompanyId = consignorCompanyId; // 委托单位
        item.businessType = businessType;
        item.status = 'YDZT30'; // 已返单
        item.isSettle = 'JSBJ10'; // 参与结算

        const pack = item.waybillPackList;
        item.totalWeight = pack.map(item => item.packWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
        item.totalSheet = pack.map(item => item.packNo).reduce((acc, cur) => Number(acc) + Number(cur), 0);
        item.rcvTransFee = pack.map(item => item.rcvTransFee).reduce((acc, cur) => Number(acc) + Number(cur), 0);
        item.transFee = pack.map(item => item.transFee).reduce((acc, cur) => Number(acc) + Number(cur), 0);
      });

      console.dir(waybillList);

      this.http.post(TRANS_URLS.IMPORT_WAYBILL, { tWaybills: waybillList }).then((res: any) => {
        if (res.success) {
          this.isVisible = false;
          this.msg.success(`导入成功!导入统计信息：运单：${waybillList.length}条；捆包：${packArray.length}条；司机：${waybillList.length}条。`);
        }
        this.importLoading = false;
      });
      // this.importLoading = false;
    });
  }

  /**
   * 验证列是否存在
   * @param header 
   */
  validateColumn(header: Array<any>): boolean {
    const columns = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (columns && columns.length > 0) {
      this.msg.error(`导入失败！模板错误："${columns.map(item => item.cname).join('","')}"字段必须存在！`);
      return false;
    }
    return true;
  }

  /**
   * 捆包数据验证
   */
  validateData(data: Array<any>): boolean {
    const invalidColumn = this.importColumns.filter(item => item.required).filter(col => {
      return data.some((item, index) => {
        // 如果没有值或者值去空格后长度为0，返回true
        if (!item[col.ename] || item[col.ename].trim().length == 0) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 2})`;
          return true;
        }
        item[col.ename] = item[col.ename].trim();
        if (col.validator === 'number') {
          item[col.ename] = item[col.ename].replace(/,/g, "");
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
        } else if (col.validator === 'price') {
          // 不是数字并且不是包车
          item[col.ename] = item[col.ename].replace(/,/g, "");
          if (isNaN(item[col.ename]) && item[col.ename] != this.packageString) {
            col.errMsg = `存在"${col.cname}"字段不是数字且不是${this.packageString}(行号：${index + 2})`;
            return true;
          }
        }
        return false;
      });
    });

    if (invalidColumn && invalidColumn.length > 0) {
      this.msg.error(`导入失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(",")}的数据`);
      return false;
    }
    return true;
  }

  /**
   * 捆包信息转为运单信息
   * @param dataArray 
   */
  packToWaybill(dataArray: any) {
    // 将日期和时间拼接，并转为YYYY-MM-DD HH:mm:ss格式
    dataArray.forEach(item => item.outstockDate = dateformat(`${item.outstockDate} ${item.outstockTime}`, 'YYYY-MM-DD HH:mm:ss'));
    // 唯一键组合
    const unique = ['outstockDate', 'vehicleNo', 'pickNo'];
    let hash = {};
    const waybillData = dataArray.reduceRight((item, next) => {
      const key = unique.map(u => next[u]).join("#");
      hash[key] ? '' : hash[key] = true && item.push(next);
      return item
    }, []);

    const waybillList = waybillData.map(item => {
      let waybill = {
        consigneeCompanyName: item.consigneeCompanyName, //货主（收货单位）
        startLocationName: item.outStock, //起点
        endLocationName: item.endPoint, // 终点
        carrierCompanyName: item.carrierCompanyName, // 承运单位
        loadDate: item.outstockDate, // 装车时间
        travelNo: item.vehicleNo, // 车牌号

        rcvUnitPrice: item.rcvUnitPrice, // 应付（客户）单价 客户价
        rcvTransFee: 0, // 运费总价（应付）客金额
        priceType: item.priceType, // 应付计价方式

        unitPrice: item.unitPrice, // 应付（车队）单价
        transFee: 0, //运费总价(应付) 车队金额
        receiveType: item.receiveType, // 应付计价方式

        totalWeight: 0, //返单总重量
        totalSheet: 0, //返单总件数

        outstockDate: item.outstockDate,// 出库时间
        vehicleNo: item.vehicleNo,// 车牌号
        pickNo: item.pickNo, // 合同号

      };

      const driver = {
        vehicleNo: item.vehicleNo,// 车牌号
      };

      const pack = dataArray.filter(item => unique.map(u => item[u]).join("#") == unique.map(u => waybill[u]).join("#"));

      waybill['waybillPackList'] = [...pack];
      waybill['waybillDriverList'] = [driver];

      return waybill;
    });

    return waybillList;
  }

  /**
   * 运单数据验证（捆包信息价格是否全部是数字和包车）
   * @param waybillList 
   */
  validateWaybillImport(waybillList: Array<any>): boolean {
    const invalid = waybillList.filter(waybill => {
      let allNumber = waybill.waybillPackList.every(item => !isNaN(item.rcvUnitPrice));
      let allPackage = waybill.waybillPackList.every(item => item.rcvUnitPrice == this.packageString);
      if (allNumber) {
        waybill.priceType = 'JJFS10';  // 应收单价
      } else if (allPackage) {
        waybill.rcvUnitPrice = 0;
        waybill.priceType = 'JJFS20'; // 应收包干
      } else {
        return true;
      }

      allNumber = waybill.waybillPackList.every(item => !isNaN(item.unitPrice));
      allPackage = waybill.waybillPackList.every(item => item.unitPrice == this.packageString);
      if (allNumber) {
        waybill.receiveType = 'JJFS10';  // 应付单价
      } else if (allPackage) {
        waybill.unitPrice = 0;
        waybill.receiveType = 'JJFS20'; // 应付包干
      } else {
        return true;
      }

      return false;
    });

    if (invalid && invalid.length > 0) {
      const msgArr = invalid.map(item => `出库时间：${item.outstockDate}, 车号：${item.vehicleNo}, </br>`);
      this.msg.error(`导入失败！单价错误：${msgArr.join(";")}的信息单价不全为数字或${this.packageString}！`);
      return false;
    }

    return true;
  }

  /**
   * 将csv数组转为捆包数组
   * @param data 
   */
  toPackArray(data: any): Array<any> {
    const dataArray = [];
    const header = data[0].map(item => this.getEname(item));
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => obj[key] = data[i][index]);
      dataArray.push(obj);
    }
    // 去掉无出库时间的记录
    return dataArray.filter(item => item.outstockDate && item.outstockTime);
  }

  /**
   * 根据列配置的中文名称获取英文名称
   * @param cname 
   */
  getEname(cname: string): string {
    if(!cname){
      return cname;
    }
    const col = this.importColumns.find(item => item.cname && item.cname === cname.trim());
    if (col) {
      return col.ename;
    }
    return cname;
  }

  /**
   * 根据列配置的英文名称获取中文名称
   * @param ename 
   */
  getCname(ename: string): string {
    const col = this.importColumns.find(item => item.ename === ename);
    if (col) {
      return col.cname;
    }
    return ename;
  }


  exportTest() {
    // var wb = XLSX.utils.book_new(); 
    // const data = [[1,2,3,4,5]];
    // var ws = XLSX.utils.aoa_to_sheet(data);
    // XLSX.utils.book_append_sheet(wb, ws);
    // XLSX.writeFile(wb, "车辆任务信息.xlsx");

    var filename = "write.xlsx";
    var data = [[1, 2, 3], [true, false, null, "sheetjs"], ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
    var ws_name = "SheetJS";
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }

}
