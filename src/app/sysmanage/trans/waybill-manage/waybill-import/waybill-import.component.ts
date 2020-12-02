import {Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, Output} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {format as dateformat} from 'date-fns';
import {addDays} from 'date-fns';
import {XlsxService} from '../../../../components/simple-page/simple-page-form.module';
import {TRANS_URLS, SYS_URLS} from '../../../../common/model/trans-urls';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from "../../../../common/util/utils";
import {urls} from "../../../../common/model/url";
import { Subject } from 'rxjs';
declare var XLSX: any;

@Component({
  selector: 'app-waybill-import',
  templateUrl: './waybill-import.component.html',
  styleUrls: ['./waybill-import.component.css'],
  providers: [
    XlsxService
  ]
})

export class WaybillImportComponent implements OnInit {

  @Input() mode: string = 'none' || 'button';

  @Input()
  set isVisible(isVisible: boolean) {
    if (isVisible === true) {
      this.showModal();
    } else {
      this._isVisible = false;
    }
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  packageString: Array<string> = ['包车', '拼车', '-']; // 包车字符串
  zeroString: Array<string> = ['-']; // 代表0的字符串数组

  _isVisible: boolean = false; // 弹框是否显示
  importValidate: FormGroup; // 导入表单验证
  importFile: File;
  importLoading: boolean;

  waybillList: any; // 读取到的运单数据
  importStats: any; // 读取到数据统计信息
  fileErrMsg: string;
  readLoading: boolean = false;
  readSuccess: boolean = false; // Excel读取成功

  consignorCompanyName: string;
  observable = new Subject<any>();
  @ViewChild('fileInput') fileInput: ElementRef;

  businessTypeApi = {
    url: SYS_URLS.SELECT_BUSI_SEGMENT,
    fieldKey: {text: 'segmentName', value: 'segmentId'},
  }

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private xlsx: XlsxService,
              private appInfo: UserinfoService,
              private nzModal: NzModalService,
              private nzMess: NzNotificationService) {

    this.importValidate = this.fb.group({
      file: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
      // consignorCompanyName: [null, [Validators.required]],
      consignorCompanyId: [null, [Validators.required]],
      businessType: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.mode = this.mode || 'none';
    this.businessTypeApi['param'] = {companyId: this.appInfo.APPINFO.USER.companyId};
  }

  /**
   * 公司弹框设置公司ID
   * @param data
   * @param fieldName
   */
  setCompanyId(data: any) {
    this.importValidate.patchValue({consignorCompanyId: data.inpValue});
    this.consignorCompanyName = data.inpName;
  }

  importColumns: Array<any> = [

    {ename: 'outdoorNo', cname: '出库单号', required: true},
    {ename: 'mainProductListNo', cname: '装车清单号'},
    {ename: 'noticeNum', cname: '发货通知单号', required: true},
    {ename: 'contractNum', cname: '合同号'},
    {ename: 'oritemNum', cname: '订单号', required: true},
    {ename: 'thickness', cname: '出库时间'},
    {ename: 'contactName', cname: '联系人'},
    {ename: 'province', cname: '省份', required: true,},
    {ename: 'city', cname: '城市', required: true},
    {ename: 'transGroupName', cname: '车队', required: true},
    {ename: 'driverTel', cname: '司机电话', required: true},
    {ename: 'consigUserName', cname: '收货用户', required: true,},
    {ename: 'commodityName', cname: '产品名称', required: true,},
    {ename: 'carmark', cname: '车船号', required: true},
    {ename: 'standard', cname: '规格', required: true,},
    {ename: 'status', cname: '状态', required: true},
    {ename: 'prodLevelCode', cname: '品级', required: true},
    {ename: 'pack', cname: '包装', required: true,},
    {ename: 'weight', cname: '出库重量', required: true,},
    {ename: 'count', cname: '出库件数', required: true,},
    {ename: 'outstockCode', cname: '出库仓库', required: true,},
    {ename: 'instockCode', cname: '入库仓库', required: true},
    {ename: 'transway', cname: '运输方式', required: true,},
    {ename: 'carrierCompanyName', cname: '库存组织', required: true},
    {ename: 'saleDept', cname: '销售部门', required: true},
    {ename: 'detailAddress', cname: '卸货地点', required: true},
    // {ename: 'material', cname: '牌号', required: true},
    {ename: 'sgsign', cname: '牌号', required: true},
    {ename: 'endCustmer', cname: '收货用户', required: true},
    {ename: 'createDate', cname: '出厂确认时间', required: true},

  ];
  /**
   * Excel导入弹出框
   */
  showModal() {
    this._isVisible = true;
    this.importLoading = false;
    this.importValidate.reset();
    this.consignorCompanyName = '';
    return this.observable;
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
    this.importValidate.patchValue({fileName: this.importFile.name});
    // this.readExcel();
  }

  /**
   * 读取Excel文件
   */
  readExcel() {

    this.readLoading = true;
    this.readSuccess = false;
    this.fileErrMsg = "Excel数据读取中......";
    // 读取Execl数据
    this.xlsx.import(this.importFile, true).then(res => {
      const keys = Object.keys(res);
      if (!keys || keys.length == 0) {
        // this.msg.error("读取Excel数据失败！未读取到sheet页！");
        this.readLoading = false;
        this.importLoading = true;
        this.fileErrMsg = "读取Excel数据失败！未读取到sheet页！";
        return;
      }

      const data = res[keys[0]];
      if (!data || data.length < 2) {
        // this.msg.error("读取Excel数据失败！未读取到Excel数据！");
        this.readLoading = false;
        this.importLoading = true;
        this.fileErrMsg = "读取Excel数据失败！未读取到Excel数据！";
        return;
      }

    });
  }

  importExcel() {   //导入确定按钮
    for (const i in this.importValidate.controls) {
      this.importValidate.controls[i].markAsDirty();
      this.importValidate.controls[i].updateValueAndValidity();
    }
    // if (this.importValidate.status === 'INVALID') {
    //   return;
    // }
    let _data = [];
    this.importLoading = true;
    let headTemplate = ['出库单号','装车清单号','发货通知单号','合同号','订单号',
      '出厂确认时间','出库时间','车船号','联系人','卸货地点','省份','城市','司机电话',
      '车队','物流公司','收货用户','产品名称',   '牌号','规格','状态','品级',
      '包装','出库重量','出库件数','出库仓库','入库仓库','运输方式',
      '专用线','库存组织','销售部门','内外销标记','终点','最新可发时间','备注',
      '选船','开单时的可发重量','开单时的待分重量','是否到港定价','到货码头'];

    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      // _data.push(data[keys[i]]);
      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error("提示信息", '未读取到sheet页！读取数据Excel失败！');
        this.importLoading = false;
        return;
      }
      let headArr:any= _data&&_data[0]||[];
      if(!this.validateHead(headTemplate,headArr)){
        return;
      }
      this.excelFilter(_data);
    });

  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head,receiptHead):boolean{
    let flag = true;
    if(head.length != receiptHead.length){
      flag = false;
    };
    head.forEach(item=>{
      if(typeof item !="string"){
        flag = false;
        return;
      }
      if(receiptHead.indexOf(item.trim()) < 0){
        flag = false;
        return;
      }
    });
    if(!flag){
      this.nzMess.remove();
      this.nzMess.error("提示信息","模板不匹配，请选择正确模板！");
      this.importLoading = false;
    }
    return flag;
  }



  excelFilter(data: any) {
    let url = urls.importBclpStackingInfoDetail;
    let param: any = {bclpStackingInfoMainModels: []};
    let eNameHeader: any = [];

    data[0].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 1; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.bclpStackingInfoMainModels.push(temp);
    }
    this.http.post(url, param).then((res: any) => {
      this.importLoading = false;
      if (res.success) {
        this._isVisible = false;
        this.nzMess.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.observable.next('success');
      }else{
        this.observable.next('fail');
      }
    })
  }

  patchEname(cName: any) {
    for (let i = 0; i < this.importColumns.length; i++) {
      if (this.importColumns[i].cname.trim() == cName.trim()) {
        return this.importColumns[i].ename;
      }
    }
  };

  /**
   * 验证列是否存在
   * @param header
   */
  validateColumn(header: Array<any>): boolean {
    const columns = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (columns && columns.length > 0) {
      this.fileErrMsg = `读取Excel数据失败！模板错误："${columns.map(item => item.cname).join('","')}"字段必须存在！`;
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
        // 如果不是数字，并且没有值或者值去空格后长度为0，返回true
        if (isNaN(item[col.ename]) && (!item[col.ename] || item[col.ename].trim().length == 0)) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 2})`;
          return true;
        }
        item[col.ename] = isNaN(item[col.ename]) ? item[col.ename].trim() : item[col.ename];
        if (col.validator === 'number') {
          item[col.ename] = isNaN(item[col.ename]) ? item[col.ename].replace(/,/g, "") : item[col.ename];
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
          item[col.ename] = Number(item[col.ename]);
        } else if (col.validator === 'price') {
          // 不是数字并且不是包车
          item[col.ename] = isNaN(item[col.ename]) ? item[col.ename].replace(/,/g, "") : item[col.ename];
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
          item[col.ename] = Number(item[col.ename]);
        }
        return false;
      });
    });

    if (invalidColumn && invalidColumn.length > 0) {
      this.fileErrMsg = `读取Excel数据失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(",")}的数据`;
      return false;
    }
    return true;
  }

  /**
   * 格式化日期
   * @param date
   * @param time
   */
  format(date: number, time: number): string {
    const dateStr = dateformat(addDays(new Date(1900, 0, date), -1), 'YYYY-MM-DD');
    if (!time) {
      return `${dateStr} 00:00:00`;
    }
    let temp;
    const hour = Math.floor(temp = time * 24);
    const minute = Math.floor(temp = (temp - hour) * 60);
    const second = Math.ceil(temp = (temp - minute) * 60);

    return `${dateStr} ${hour}:${minute}:${second === 60 ? 59 : second}`;
  }

  /**
   * 捆包信息转为运单信息
   * @param dataArray
   */
  packToWaybill(dataArray: any) {
    // 将日期和时间拼接，并转为YYYY-MM-DD HH:mm:ss格式
    dataArray.forEach(item => item.outstockDate = dateformat(new Date(this.format(item.outstockDate, item.outstockTime)), 'YYYY-MM-DD HH:mm:ss'));
    // dataArray.forEach(item => item.outstockDate = dateformat(`${item.loadDate} ${item.outstockTime}`, 'YYYY-MM-DD HH:mm:ss'));

    // 唯一键组合(出库时间（出库日期+时间）、车号、合同号、车队价（应付）、平台价（应收）)
    const unique = ['outstockDate', 'vehicleNo', 'pickNo', 'unitPrice', 'rcvUnitPrice'];
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
        settleCompanyName: item.settleCompanyName, // 结算单位
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
    let invalid = waybillList.filter(waybill => waybill.waybillPackList.some(item => isNaN(item.rcvUnitPrice)));
    if (invalid.length > 0) {
      const msg = invalid.map(item => `出库时间：${item.outstockDate}, 车号：${item.vehicleNo}`).join(";");
      this.fileErrMsg = `读取Excel数据失败！单价（平台价格）错误：${msg}的信息单价不全为数字！`;
      return false;
    }
    invalid = waybillList.filter(waybill => waybill.waybillPackList.some(item => isNaN(item.unitPrice)));
    if (invalid.length > 0) {
      const msg = invalid.map(item => `出库时间：${item.outstockDate}, 车号：${item.vehicleNo}`).join(";");
      this.fileErrMsg = `读取Excel数据失败！单价（车队价格）错误：${msg}的信息单价不全为数字！`;
      return false;
    }
    return true;
  }

  /**
   * 将csv数组转为捆包数组，并去掉无出库日期的数据
   * @param data
   */
  toPackArray(data: any): Array<any> {
    const dataArray = [];
    const header = data[0].map(item => this.getEname(item));
    const price = this.importColumns.filter(item => item.validator === 'price').map(item => item.ename);
    const number = this.importColumns.filter(item => item.validator === 'number').map(item => item.ename);
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => {
        obj[key] = data[i][index];
        // 如果是价格，并且字符串是包车、拼车或-，则将值设置为0
        if (price.some(item => item == key) && this.packageString.some(item => item == obj[key])) {
          obj[key] = 0;
        }
        if (number.some(item => item == key) && this.zeroString.some(item => item == obj[key])) {
          obj[key] = 0;
        }
      });
      dataArray.push(obj);
    }
    // 去掉无出库日期的记录
    return dataArray.filter(item => item.outstockDate);
  }

  /**
   * 根据列配置的中文名称获取英文名称
   * @param cname
   */
  getEname(cname: string): string {
    if (!cname) {
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

