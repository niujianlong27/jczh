import {Component, OnInit, ViewChild} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {CommonService} from '../../../../common/services/common.service';
import {Utils} from "../../../../common/util/utils";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-bulkcargo-out',
  templateUrl: './bulkcargo-out.component.html',
  styleUrls: ['./bulkcargo-out.component.css']
})
export class BulkcargoOutComponent implements OnInit {


  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数

  loginID: string; // 登录人id
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages1: number = 0;
  totalPages2: number = 0;
  pageSize1: number = 30;
  pageSize2: number = 30;
  deleteVisible = false;//删除弹窗显示控制
  outWsNo: any;
  selectData1: any;
  modalTitle: string;
  deleteCon: string;
  shStockOuts = [];//需要删除的数据
  outWsId: number = 0;
  stockOut: any;
  tempSearchParam: any;
  x: any;
  status: string;
  ArrList: any = [];
  msg: string;
  modelList: Array<any> = [];
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '审核原因', eName: 'auditRemark', type: 'text', validateCon: '请输入审核原因', require: true,
      validators: {
        require: true,
        pattern: false
      }
    }
  ];
  reModalFormData: Array<any> = [

    {
      name: '计量ID', eName: 'meterId', type: 'text', validateCon: '请输入计量ID', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '计量站点', eName: 'meterSite', type: 'text', validateCon: '请输入计量站点', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '毛重', eName: 'grossWeight', type: 'text', validateCon: '请输入毛重', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '皮重', eName: 'tareWeight', type: 'text', validateCon: '请输入皮重', require: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '净重', eName: 'netWeight', type: 'text', validateCon: '请输入净重', require: true,
      validators: {
        require: true,
        pattern: false
      }
    }
  ];

  constructor(private router: Router, private fb: FormBuilder,
              private appInfo: UserinfoService, private http: HttpUtilService,
              private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  /***
   * 初始化
   */
  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    sessionStorage.setItem("stockOut", ""); //新增或修改的明细重置
    sessionStorage.setItem("stockBulkOutTopInfo", ""); //修改时的缓存数据重置
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("detailList", "[]");  //明细缓存

    this.loginID = this.appInfo.APPINFO.USER.userId; //获取当前登录人id
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockBulkOut;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.dataSet2 = [];
    this.totalPages2 = 0;
    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 主列表当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.getList1({page: page, length: this.pageSize1, queryParameterList});
  }

  /**
   * 主列表每页展示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1, queryParameterList});
  }


  /**
   * 获取明细数据
   */
  getList2(data: any, saveData?: any): void {
    data.outWsNo = data.outWsId;
    let url = stockUrl.selectStockBulkInDetailOut;
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
        if (saveData) {
          this.router.navigate(['/system/shStock/bulkcargoOutAdd'], {queryParams: {status: 'update'}});
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          sessionStorage.setItem('stockBulkOutTopInfo', JSON.stringify(saveData)); //选中的数据带入顶部维护信息显示
        }
      }
    })
  }

  /**
   * 选中数据变化
   * @param data
   */
  selectData(data: any) {
    this.selectData1 = data;
    this.ArrList = this.selectData1.map(item => {
      return {outWsNo: item.outWsNo}
    });
    this.totalWeight = this.selectData1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.selectData1.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   *
   * @param data
   */
  listClick(data: any): void {
    this.dataSet2 = [];
    this.outWsNo = data.outWsNo;
  }

  /**
   * 确认
   */
  audit(): void {
    this.msg = '散货出库管理 > 确认';
    if (this.cm.canOperate(this.selectData1, "status", ["CKZT10"], "存在已出库数据，不能进行确认操作！")) {
      return
    }
    this.status = 'audit';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确认?";
    // this.tipModalCreat(); // 创建弹框
  }

  /**
   * 取消确认
   */
  cancel(): void {
    this.modelList = Utils.deepCopy(this.modalFormData);
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.msg = '散货出库管理 > 取消确认';
    if (this.cm.canOperate(this.selectData1, "status", ["CKZT00", "CKZT20"], "存在未出库数据，不能进行取消确认操作！")) {
      return
    }
    this.status = 'cancel';
    this.tipModalCreat(); // 创建弹框


  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId !== 'Add' && data.buttonId !== 'Record') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal();
        return;
      }
    }
    this.modelList = [];
    switch (data.buttonId) {
      case 'Add':
        sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
        this.router.navigate(['/system/shStock/bulkcargoOutAdd']);
        break;
      case 'audit':
        this.audit();
        break;
      case 'Record':
        this.router.navigate(['/system/shStock/bulkcargoOutAdd'], {queryParams: {state: 'Record'}});
        break;
      case 'cancel':
        this.cancel();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Return':
        this.Return();
        break;
      default:
        break;

    }
  }

  Return() {
    if (this.selectData1.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行返单！'
      });
      this.destroyTplModal();
      return;
    }
    this.modelList = Utils.deepCopy(this.reModalFormData);
    this.reModalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.modalValidateForm.patchValue(this.selectData1[0]);

    this.msg = '散货出库管理 > 返单';
    this.status = 'return';
    this.tipModalCreat(); // 创建弹框
  }

  btnUpdate() {
    let list = this.dataSet1.filter((x: any) => x.checked);
    if (list.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (this.cm.canOperate(list, "status", ["CKZT10"], "该数据已出库，不能进行修改操作！")) {
      return
    }
    // 修改时获取列表明细信息存入session后带入修改页
    list[0].status = 'Update';
    this.router.navigate(['/system/shStock/bulkcargoOutAdd'], {queryParams: {status: 'update'}});
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
    sessionStorage.setItem('stockBulkOutTopInfo', JSON.stringify(list[0])); //选中的数据带入顶部维护信息显示
  }

  btnDelete() {
    if (this.cm.canOperate(this.selectData1, "status", ["CKZT10"], "存在已出库数据，不能进行删除操作！")) {
      return
    }
    this.status = 'delete';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定删除？";
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  /**
   * 提示框关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok' && this.status == 'delete') {
      let deleteUrl = stockUrl.deleteStockBulkOut;
      let deleteParam = {shStockOuts: []};
      this.selectData1.forEach(elem => {
        deleteParam.shStockOuts.push({rowid: elem['rowid'], outWsNo: elem['outWsNo']})
      });
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
            this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.dataSet2 = [];
            this.totalPages2 = 0;
            this.getList1(this.tempSearchParam);
          }
        }
      )
    } else if (data.type == 'ok' && this.status == 'audit') {
      let param = Utils.deepCopy(this.modalValidateForm.value);
      param['auditOper'] = this.loginID;
      param['shStockOuts'] = [...this.selectData1];
      this.http.post(stockUrl.auditStockBulkOut, param).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.nz.create('success', '提示信息', '状态确认成功', {nzDuration: 3000});
          this.listSearch(this.tempSearchParam);
        }
      })

    } else {
      this.deleteVisible = false;
    }
  }

  /**
   * 确认，未确认 创建弹窗
   */
  tipModalCreat(): void {
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '34%',
      nzMaskClosable: true,
      nzClosable: true
    });
  }

  /**
   * 确认，未确认 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    this.modalValidateForm.reset();
  }

  /**
   * 确认，未确认 弹窗确定
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let param = Utils.deepCopy(this.modalValidateForm.value);
    if (this.status == 'cancel') {
      param['auditOper'] = this.loginID;
      param['shStockOuts'] = [...this.selectData1];
      this.http.post(stockUrl.cancelStockBulkOut, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '取消状态确认成功', {nzDuration: 3000});
          this.listSearch(this.tempSearchParam);
          this.handleCancel();
        }
      })
    } else if (this.status == 'return') {
      let url = stockUrl.returnOrder;
      param.rowid = this.selectData1[0].rowid;
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '返单成功', {nzDuration: 3000});
            this.listSearch(this.tempSearchParam);
            this.handleCancel();
          }
        }
      )
    }
  }


  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
  }

  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }
}

