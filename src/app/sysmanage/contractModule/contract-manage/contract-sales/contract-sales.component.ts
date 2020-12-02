import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {contractUrl} from '../../../../common/model/contractUrl';
import {Utils} from '../../../../common/util/utils';
import {CommonService} from '../../../../common/services/common.service';
import {HttpClient} from '@angular/common/http';


/*
 * @Title: contract-sales.component
 * @Description: 销售订单
 * @Created: zhaozeping 2019/2/15
 * @Modified:
 */
@Component({
  selector: 'app-contract-sales',
  templateUrl: './contract-sales.component.html',
  styleUrls: ['./contract-sales.component.css'],
  providers: [
    XlsxService
  ]
})
export class ContractSalesComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1: Number = 30;
  buttonId: any;
  updateData: any = [];
  tempSearchParam: any = {};
  columnsArr: any;
  flag: boolean = false;
  modal: any = {
    formdata: [],
  };
  modalTitle: any = '合同草约 > 导入';
  importFile: any;
  implistLoading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;


  validateForm: FormGroup;
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
        require: false,
        pattern: false
      }
    },
  ];

  constructor(
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private xlsx: XlsxService,
    private nzMess: NzMessageService,
    private cm: CommonService,
    private  angularHttp: HttpClient
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    //  this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 获取列表
   * @param data
   */
  getList1(data: any): void {
    let url = contractUrl.selectSales;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    // console.log(this.tempSearchParam, data);
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.dataSet1.forEach((item) => {
          item.editstate = 0;
        });
      }
    });
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data: any): void {
    this.updateData = data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    // console.log(this.buttonId);
    if (this.buttonId != 'Add' && this.buttonId != 'Import' && this.buttonId != 'Export' && this.buttonId != 'Supplemental') {
      if (this.updateData.length < 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal(tplModal);
        return;
      }
    }
    switch (this.buttonId) {
      case 'Add':
        this.flag = true;
        this.btnAdd();
        break;
      case 'Update':
        this.flag = true;
        this.btnUpdate();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Match':
        this.btnMatch();
        break;
      case 'Import':
        this.btnImport();
        break;
      case 'Use':
        this.btnUse();
        break;
      case 'Export':
        this.btnExport();
        break;
      case 'Supplemental':
        this.supplemental(data);
        break;
      default:
        break;
    }
  }

  /**
   * 补充合同
   */
  private supplemental(data: any) {
    this.modal.title = data.buttonName;
    this.modal.visible = true;
    this.modal.form = this.fb.group({});
    this.modal.formdata = [
      {
        name: '合同号', eName: 'contractNo', type: 'text', validateCon: '请填写合同号', require: true,
        validators: {
          require: true,
          pattern: false
        }
      }
    ];
    this.modal.formdata.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modal.form.addControl(item.eName, new FormControl('', validatorOpt));
    });
  }

  modalOk() {
    for (const i in  this.modal.form.controls) {
      this.modal.form.controls[i].markAsDirty();
      this.modal.form.controls[i].updateValueAndValidity();
    }
    if (this.modal.form.status === 'INVALID') return;
    this.modal.visible = false;
  }

  /*
  *    导出
  */

  btnExport() {
    let url: any = contractUrl.exportSalse;
    this.angularHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同草约.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /*
  *    使用
  */
  btnUse() {
    if (this.cm.canOperate(this.updateData, 'isUse', ['20'], '存在已使用数据，不能进行确认操作！')) {
      return;
    }
    ;

    let url = contractUrl.useSales;
    let param: any = {};
    param.saledList = this.updateData;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '修改成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.updateData = [];
      }
    });
  }

  /**
   * 新增
   */
  btnAdd(): void {
    // this.dataSet1.unshift({EDIT:true,checked:true});
    this.dataSet1.unshift({checked: true});
    this.dataSet1 = [...this.dataSet1];
    this.updateData = this.dataSet1.filter(item => item.checked);
  }

  /**
   * 修改
   */
  btnUpdate(): void {
    this.updateData.forEach(item => {
      if (item.editstate == 0) {
        item.editstate = 1;
      }
    });
  }

  /**
   * 保存
   */
  btnSave(): void {
    if (!this.flag) {
      this.nzMess.error('请新增或者修改一条记录！');
      return;
    }
    let url = contractUrl.updateSales;
    let param: any = {};
    for (let i: number = 0; i < this.updateData.length; i++) {
      if (this.updateData[i].salesContractNo != undefined) {
        if (this.updateData[i].salesContractItem != undefined) {
          if (this.updateData[i].contractWeight != undefined) {
            if (this.updateData[i].consigneeAddress != undefined) {
              continue;
            }
          }
        }
      }
      this.nzMess.error('必填字段合同号，合同项次，重量，地址为空');
      return;
    }
    param.saledList = this.updateData;
    // param.saledList.forEach((item)=>{
    //   item.flowConfirmationTime = item.flowConfirmationTime &&  item.flowConfirmationTime instanceof Date ? Utils.dateFormat(item.flowConfirmationTime,'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
    //   item.creatDate = item.creatDate &&  item.creatDate instanceof Date ? Utils.dateFormat(item.creatDate,'yyyy-MM-dd HH:mm:ss'):item.creatDate;
    //   item.collectionDate = item.collectionDate &&  item.collectionDate instanceof Date ? Utils.dateFormat(item.collectionDate,'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
    //   // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime || '';
    // });
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.updateData = [];
      }
    });
    this.flag = false;
  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.cm.canOperate(this.updateData, 'isUse', ['HTSYBJ20'], '存在已使用数据，不能进行确认操作！')) {
      return;
    }
    let url = contractUrl.deleteSales;
    let param: any = {};
    param.saledList = this.updateData;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.updateData = [];
      }
    });

  }

  /**
   * 价格匹配按钮
   */

  btnMatch() {
    let url = contractUrl.matchSales;
    let param: any = {};
    param.transportPriceList = this.updateData;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.updateData = [];
      }
    });
  }


  /**
   * 导入按钮
   */
  btnImport(): void {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
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

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }

  /**
   * 导入弹窗确定
   */
  importConfirm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    this.implistLoading = true;
    let headTemplate = ['创建日期', '创建时间', '合同类型', '合同编号', '合同项次',
      '关联合同号', '客户名称', '客户等级', '库存组织', '省份', '城市', '运输方式', '产品形态',
      '订货方式', '牌号', '产品规格', '合同数量', '合同重量', '合同单价', '销售部门', '销售人员',
      '销售人员联系方式', '收货地址', '到货码头', '合同备注', '已开订单重量', '已开发货通知单量',
      '结算方式', '客户期望交期', '订单交期', '回传日期', '回传时间', '合同状态', '合同生效日期',
      '生效时间', '结案时间', '结案原因', '销售方式', '流向确认日期', '海运流向确认日期'];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      let headArr: any = _data && _data[1] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        return;
      }
      // console.log(this.validateData(_data));
      // if (!this.validateData(_data)) {
      //   // this.nzMess.error("合同号不能为空！");
      //   this.implistLoading = false;
      //   return;
      // }
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
    if (head.length != receiptHead.length) {
      flag = false;
    }
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        count = item;
        // console.log(count);
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        count = item;
        return;
      }
    });
    if (!flag) {
      this.nzMess.remove();
      this.nzMess.error('表头' + count + '与模板不匹配，请选择正确模板！');
      this.implistLoading = false;
    }
    return flag;
  }

  /**
   * 导入数据验证表头及必填字段
   * @param data
   */
  // validateData(data: any): boolean {
  //   // 验证表头合同号必须存在
  //   let excelHeader: any = data && data[0] || [];
  //   let opt = ['合同'];
  //   let tipMess = [];
  //   for (let j = 0; j < opt.length; j++) {
  //     let op = opt[j];
  //     if (excelHeader.indexOf(op) < 0) {
  //       tipMess.push(op);
  //     } else {
  //       // 验证必填字段不能为空
  //       for (let i = 1; i < data.length; i++) {
  //         let index = excelHeader.indexOf(op);
  //         // console.log(data[i],data[i][index],index);
  //         if (!data[i][index] || data[i][index] == '') {
  //           this.nzMess.remove();
  //           this.nzMess.error(`必填字段“${op}”在行号为${i + 1}处为空！`);
  //           return false;
  //         }
  //       }
  //       return true;
  //     }
  //   }
  //   if (tipMess.length > 0) {
  //     this.nzMess.remove();
  //     this.nzMess.error(`字段${tipMess.join('、')}必须存在！`);
  //     return false;
  //   }
  // }

  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data: any): void {
    let url = contractUrl.importSales;
    let param: any = {saledList: []};
    // param.contractList = this.updateData;
    let eNameHeader: any = [];
    data[1].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 2; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.saledList.push(temp);
    }
    param.saledList.forEach((item) => {
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });

    this.http.post(url,param).then((res:any) => {
      this.implistLoading = false;
    if(res.success){
      this.tplModal.destroy();
      this.nz.create('success','提示信息',res.data.msg,{nzDuration:3000});

      this.listSearch({ page: 1, length: this.pageSize1 });
    }
    })

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
  };

  /**
   * 弹窗取消
   */
  handleCancel(): void {
    this.tplModal.destroy();

  }

  /**
   * 弹窗确定
   */
  handleOk(): void {

  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(tplModal): void {
    window.setTimeout(() => {
      tplModal.destroy();
    }, 1500);
  };

}
