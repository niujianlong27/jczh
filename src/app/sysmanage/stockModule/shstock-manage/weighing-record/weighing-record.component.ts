import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {stockUrl} from "../../../../common/model/stockUrl";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../../common/util/utils";
import {XlsxService} from "../../../../components/simple-page/xlsx/xlsx.service";
import {urls} from "../../../../common/model/url";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-weighing-record',
  templateUrl: './weighing-record.component.html',
  styleUrls: ['./weighing-record.component.css']
})
export class WeighingRecordComponent implements OnInit {

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  columnsArr: any;
  validateForm: FormGroup;
  importFile: any;
  modalTitle: string;//弹窗标题
  implistLoading: boolean = false; //导入确定加载
  importLoading: boolean;
  isInArr: any = [];
  searchData:any;
  modelchangeList:any;

  modalFormData: Array<any> = [
    {
      name: '入库或出库', eName: 'status', type: 'radio', validateCon: '请选择入库或出库状态', require: true, hidden: false,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请选择文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请选择文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    }
  ];
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private fb: FormBuilder,
              private nn: NzNotificationService,
              private xlsx: XlsxService,
              private ngHttp: HttpClient,

  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
    this.getStatic(this.isInArr, 'GBLX');

  }

  modelchange(data:any){ //查询条件输入值变化
    this.modelchangeList = {...data};
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList(data);
  }

  getList(data: any): void {
    this.searchData = {...data};
    let url = stockUrl.weighinggetPage;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Import':
        this.import();
        break;
      case 'Export':
        this.export();
        break;
      default:
        break;
    }
  }

  import() {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: '过磅记录 > 导入',
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  /**
   * 选择excel
   */
  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  export(){  //导出
    let url: any = stockUrl.weighingexport;
    this.ngHttp.post(url, this.modelchangeList, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `过磅记录.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  importConfirm() {   //导入确定按钮
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nn.remove();
      this.nn.error("提示信息", '格式不正确！');
      return;
    }

    let _data = [];
    this.implistLoading = true;
    let headTemplate = ['检斤号', '首检时间', '货物名称', '司磅员', '供应单位',
      '收货方', '规格', '站点号', '末检时间', '车牌号', '备注', '毛重', '皮重',
      '净重', '单位'];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if (!_data) {
        this.nn.remove();
        this.nn.error("提示信息", '未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      let headArr: any = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
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
  validateHead(head, receiptHead): boolean {
    let count: string = '';
    let flag = true;
    // if(head.length != receiptHead.length){
    //   flag = false;
    // }
    head.forEach(item => {
      if (typeof item != "string") {
        flag = false;
        count = item;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        count = item;
        return;
      }
    });
    if (!flag) {
      this.nn.remove();
      this.nn.error("提示信息", "文件表头" + count + "与模板不匹配，请选择正确模板！");
      this.implistLoading = false;
    }
    return flag;
  }

  excelFilter(data: any) {
    let url = stockUrl.weighinginsert;
    let param: any = {weighingRecords: []};
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
      param.weighingRecords.push(temp);
    }
    let arr = param.weighingRecords.filter(item => {  //滤除品名、末检时间、车牌号为空的数据
      return (item.endInspectionDate && item.productName && item.vehicleNo)
    });

    arr.forEach((item) => {
      item.inOrOut = this.validateForm.value.status;
    });
    param.weighingRecords = arr;
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nn.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.listSearch({page: 1, length: this.pageSize1});
      }
    })

  }

  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  };

  getPageIndex1(page: any): void {
    let queryParameterList;
    queryParameterList = this.searchData.queryParameterList;
    this.getList({page: page, length: this.pageSize1,queryParameterList});
  }

  getPageSize1(pageSize: any): void {
    let queryParameterList;
    queryParameterList = this.searchData.queryParameterList;
    this.pageSize1 = pageSize;
    this.getList({page: 1, length: this.pageSize1,queryParameterList});
  }

  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }


}
