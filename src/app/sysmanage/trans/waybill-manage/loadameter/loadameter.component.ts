import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {WaybillImportComponent} from '../waybill-import/waybill-import.component';
import {urls} from '../../../../common/model/url';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../../common/util/utils';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {TRANS_PLAN_URLS} from '@model/transPlan-urls';

declare var JSONH: any;

@Component({
  selector: 'app-loadameter',
  templateUrl: './loadameter.component.html',
  styleUrls: ['./loadameter.component.css']
})
export class LoadameterComponent implements OnInit {

// 运单相关信息
  loadameterData: Array<any> = [];
  // loading: boolean = false;
  loading = false;
  pageSize: number = 30;
  total: number = 0;
  selectedLoadameterData: Array<any> = [];
  data: any = {};
  searchData: any;  // 存储查询的数据
  uniIdData: Array<any> = [];
  totalWeight: number = 0;
  totalSheet: number = 0;
  // 捆包相关信息
  GridId = 'grid2';
  childData: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 30;
  childTotal: number = 0;
  tabArr: Array<any> = [
    {name: '捆包明细', gridId: 'grid2'},
    // {name: '运单司机', gridId: 'driver'}
  ];
  childIndex = 0;
  tplModal: NzModalRef;
  // 导入弹框是否显示
  isVisible: boolean = false;
  modalTitle: any = '地磅查询 > 导入';
  columnsArr: any;
  importFile: any;
  implistLoading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  validateForm: FormGroup;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];

  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  // businessModuleArr: Array<any> = [];

  constructor(private http: HttpUtilService,
               public router: Router,
               private route: ActivatedRoute,
               private msg: NzMessageService,
               private anhttp: HttpClient,
               private nz: NzNotificationService,
               private xlsx: XlsxService,
               private fb: FormBuilder,
               private nm: NzModalService,
               private Http: HttpClient,) {
  }

  ngOnInit() {
    console.log(90)
     // this.getList1(this.data);
    this.route.queryParams.subscribe(queryParams => {
      /*console.log(95)
      console.log(queryParams)
      //console.log(queryParams.param)
      this.getList1(this.data);*/

      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'update') {
          // this.operateType = 'update';
          console.log(96)
          this.listSearch({page: 1, length: this.pageSize})
        } else {
          this.listSearch({page: 1, length: this.pageSize})
        }
      }
    });
  }

  /**
   * 页码变化相应事件
   * @param pageIndex*/
  pageIndexChange(pageIndex: number) {
    const parm = {page : pageIndex, length : this.pageSize};
    this.searchData.page = pageIndex;
    this.getList1(this.searchData);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    // console.log(this.pageSize)
    const parm = {page : 1, length : pageSize };
    this.searchData.length = pageSize;
    this.getList1(this.searchData);
  }

  /**
   * 查询运单
   * @param pageParam
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.searchData = data; // 查询的数据存储
    this.getList1(data);
  }
  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    // console.log(data)
    // let url = urls.getListScaleLoadManagement
    const url = urls.getListScaleLoadManagement;
    this.loading = true;
    this.selectedLoadameterData = [];  // 选中的主表数据
    this.loadameterData = []; // 主表
    this.childData = [];   // 子表
    data.page = data.page || 1;
    // data.length = data.length || this.pageSize;
    data.length = this.pageSize;
    this.data = {...data};
    this.http.post(url, {...data}).then((res: any) => {
      if (res.success) {
        console.log(res)
        this.loading = false;
        this.loadameterData = res.data.data && res.data.data.data || [];
        this.total = res.data.data && res.data.data.total || 0;
        this.loadameterData.forEach((item, index) => item.rowIndex = index + 1);
      }
    });
  }

  gridHeight(data: any ) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }
  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'Update':
        this.update();   // 修改
        break;
      case 'Delete':
        this.delete();   // 删除
        break;
      case 'Import':
        this.importWaybill();   // 导入
        break;
      case 'Export':
        this.btnExport();   // 导出
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 选中数据
   * @param data
   */
  updateDataResult(data: any) {
    // console.log(153)
    if (data.length !== 0) {
      this.selectedLoadameterData = data;
      // console.log (this.selectedLoadameterData)
      // this.selectedLoadameterData.forEach(
      //   val => {
      //     val.businessType=val.businessSector;
      //   }
      // );
      // console.log(this.selectedLoadameterData)
      const selectedLoadameter = [];
      this.selectedLoadameterData.forEach(
        res => {
          selectedLoadameter.push({uniId: res.uniId});
        }
      );
      // console.log(data.tScaleLoadManagementModel[0].uniId)
      this.getList2({tScaleLoadManagementModels: selectedLoadameter});
    } else {
      this.childData = [];
      this.selectedLoadameterData = [];
    }
  }
  // data2PageTmp: any = {length: 30}; // 子表页码数据缓存
  getList2(data: any) {
    // console.log(data)
    // data.page = 1; //最好有
    // data.length = data.length || this.childPageSize; //最好有
    this.uniIdData = data;
    // console.log(data)
    console.log(this.uniIdData)
    const url = urls.getListScaleLoadManagementSon;
    this.childLoading = true;
    // console.log(this.data2PageTmp.unild)
    this.http.post(url, this.uniIdData).then((res: any) => {
      this.childLoading = false;
      if (res.success) {
        // console.log(res)
        this.childData = res.data.data && res.data.data.data || [];
        this.childTotal = res.data.data && res.data.data.total || 0;
      }
    });
  }

  /**
   * 修改
   */
  update() {
    // console.log (this.selectedLoadameterData)
    if (!this.selectedLoadameterData || this.selectedLoadameterData.length !== 1) {
      this.msg.error('请选择选择一条记录！');
      return;
    }
    this.router.navigate(['/system/trans/waybill-manage/loadameter-add'], {
      queryParams: {
        'operateType': 'update',
        'uniId': this.selectedLoadameterData[0].uniId,
        'page' : 1,
        'length': this.pageSize,
      }
    });

  }

  /**
   * 作废
   */
  delete() {
    if (!this.selectedLoadameterData || this.selectedLoadameterData.length === 0) {
      this.msg.error('请选择至少选择一条记录！');
    }
    const invalidate = this.selectedLoadameterData.filter((item, index) => {
      item.rowIndex = index + 1;
    });
    // console.log(this.selectedLoadameterData)
    this.http.post(urls.deleteListScaleLoadManagement, {tScaleLoadManagementModels: this.selectedLoadameterData}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`作废成功！作废数据${this.selectedLoadameterData.length}条`);
          this.selectedLoadameterData = [];
          this.listSearch(this.data);
        }
      }
    );
  }

  /**
   * 导入按钮响应事件
   */
  // @ViewChild(WaybillImportComponent) waybillImport: WaybillImportComponent;
  //
  // importWaybill() {
  //   this.isVisible = true;
  //   this.waybillImport.showModal().subscribe(x=>{
  //     if(x === 'success')  this.listSearch(this.data);
  //   });
  // }

  /**
   *导入按钮
   */
  importWaybill() {
    this.validateForm = this.fb.group({
      time: new FormControl()

    });
    this.modalFormData.forEach(item => {
      const validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;
    // this.currentTime = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
    // this.currentTime = new Date();
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,
    });
  }
  /**
   * 根据运单查询运单捆包信息
   */
  // queryPack(tScaleLoadManagementModels: Array<any>) {
  //   this.http.post(urls.getListScaleLoadManagementSon, {tScaleLoadManagementModels: tScaleLoadManagementModels}).then(
  //     (res: any) => {
  //       if (res.success) {
  //         this.childData = res.data.data;
  //       }
  //     }
  //   );
  // }

  /**
   * 选择excel
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }
  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    // console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }
  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
  }

  /**
   * 导入弹窗确定
   */
  importConfirm() {
     for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
     if (this.validateForm.status === 'INVALID') {
         return;
      }
     if (!Utils.isExcel(this.importFile.name)) {
         this.msg.remove();
         this.msg.error('格式不正确！');
         return;
      }
      // let _data;
      const dataList: any = [];
      this.implistLoading = true;
      const headTemplate =
        [ '物流', '运输方式', '城市', '品名', '待产量', '订单号'];
      this.xlsx.import(this.importFile, true).then((data: any) => {
      const keys = Object.keys(data);
      // _data.push( data[keys[i]]);
      const _data = data[keys[2]];
      if (!_data) {
        this.msg.remove();
        this.msg.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      const headArr: any = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        this.msg.remove();
        this.msg.error(`模板不正确，请下载正确模板`);
        return;
      }
      this.excelFilter(dataList);
    });
  }
  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        console.log(item);
        flag = false;
      }
    });
    if (!flag) {
      this.implistLoading = false;
    }
    return flag;
  }
  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data: any) {
    const url = urls.importListScaleLoadManagement;
    const param: any = {scheduleList: []};
    // param.contractList = this.updateData;
    const eNameHeader: any = [];
    for (let j = 0; j < data.length; j++) {
      // console.log(data[j][0]);
      console.log(data[j][0]);

      data[j][0].map((item, index) => {
          if (this.patchEname(item)) {
            eNameHeader.push({field: this.patchEname(item), index: index});
          }
        }
      );
      // console.log(eNameHeader);
      for (let i = 1; i < data[j].length; i++) {
        const temp: any = {};
        eNameHeader.forEach((h) => {
          temp[h.field] = data[j][i][h.index];
        });
        param.scheduleList.push(temp);
      }
      ;
    }
    console.log(data);
    param.scheduleList.forEach((item) => {
      // item.creatDate = item.creatDate ? Utils.dateFormat(new Date(item.creatDate),'yyyy-MM-dd HH:mm:ss'):item.creatDate;
      // item.collectionDate = item.collectionDate ? Utils.dateFormat(new Date(item.collectionDate),'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
      // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      // console.log(res)
      if (res.success) {
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});

        this.listSearch({page: 1, length: this.pageSize});
      }
    });
  }
  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }
  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any) {
    this.columnsArr = data;
  }

  /**
   * 导出按钮
   */
  btnExport(): void {
    console.log(this.searchData)
    // this.http.post(urls.deleteListScaleLoadManagement, {tScaleLoadManagementModels: this.selectedLoadameterData}).then(
    const url = urls.getListScaleLoadManagementExport;
    this.Http.post(url, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        const blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `地磅查询.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }
}
