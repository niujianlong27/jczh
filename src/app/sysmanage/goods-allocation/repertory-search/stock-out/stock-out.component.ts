import {Component, OnInit, ViewChild} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {CommonService} from '../../../../common/services/common.service';
import {Utils} from "../../../../common/util/utils";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Title: stock-out.component.ts
 * Description: 出库维护页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-out',
  templateUrl: './stock-out.component.html',
  styleUrls: ['./stock-out.component.css']
})
export class StockOutComponent implements OnInit {

  gridOneHeight: string;
  gridTwoHeight: string;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  totalBranchNum: number = 0;   //总支数

  loginID: string; // 登录人id
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages1: number;
  totalPages2: number;
  pageSize1: number = 30;
  pageSize2: number = 30;
  deleteVisible = false;//删除弹窗显示控制
  selectedList1: any = [];
  selectedList2: any = [];
  outWsNo: any;
  selectData1: any;
  modalTitle: string;
  deleteCon: string;
  deleteList = [];//需要删除的数据
  outWsId: number = 0;
  stockOut: any;
  tempSearchParam: any;
  x: any;
  status: string;
  msg: string;
  ArrList: any = [];
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
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });

    sessionStorage.setItem("stockOut", "");
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("stockOutTopInfo", JSON.stringify({status: 'Add'}));
    sessionStorage.setItem("detailList", "[]");

    this.loginID = this.appInfo.APPINFO.USER.userId; //获取当前登录人id
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockOut;
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
   * 明细列表当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2, stockOutDetails: this.ArrList});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, stockOutDetails: this.ArrList});
  }

  /**
   * 获取明细数据
   */
  getList2(data: any, saveData?: any): void {
    let url = stockUrl.selectStockOutDetail;
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
        if (saveData) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          this.router.navigate(['/system/stock/stockOutAdd']);
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          sessionStorage.setItem('stockOutTopInfo', JSON.stringify(saveData)); //选中的数据带入顶部维护信息显示
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
      return {outWsId: item.outWsNo}
    });
    this.getList2({page: 1, length: this.pageSize2, stockOutDetails: this.ArrList});
    this.totalWeight = this.selectData1.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.selectData1.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.selectData1.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalWeight = this.totalWeight/1000;
  }

  /**
   *
   * @param data
   */
  listClick(data: any): void {
    this.dataSet2 = [];
    this.outWsNo = data.outWsNo;
    // this.getList2({page: 1, length: this.pageSize2,stockOutDetails: this.ArrList});

  }

  /**
   * 确认
   */
  audit(): void {
    this.msg = '出库管理 > 确认';
    if (this.cm.canOperate(this.selectData1, "status", ["CKZT10"], "存在已出库数据，不能进行确认操作！")) {
      return
    }
    this.status = 'audit';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确认";
  }

  /**
   * 取消确认
   */
  cancel(): void {
    this.msg = '出库管理 > 取消确认';
    if (this.cm.canOperate(this.selectData1, "status", ["KCZT20", "CKZT20"], "存在未出库数据，不能进行取消确认操作！")) {
      return
    }
    this.status = 'cancel';
    // this.tipModalCreat(); // 创建弹框


  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId !== 'Add') {
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
    if (data.buttonId === 'Add') {
      this.router.navigate(['/system/stock/stockOutAdd']);
    }
    else if (data.buttonId === 'Audit') {
      this.audit();
    } else if (data.buttonId === 'Cancel') {
      this.cancel();
    }
    if (data.buttonId === 'Update') {
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
      this.getList2({page: 1, length: this.pageSize2, stockOutDetails: [this.ArrList[0]]}, list[0]);
    }
    if (data.buttonId === 'Delete') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (this.cm.canOperate(list, "status", ["CKZT10"], "存在已出库数据，不能进行删除操作！")) {
        return
      }
      this.status = 'delete';
      this.deleteVisible = true;
      this.modalTitle = '提示信息';
      this.deleteCon = "是否确定删除？";
      this.deleteList = list;
    }
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
      let deleteUrl = stockUrl.deleteStockOutAndDetail;
      let deleteParam = {stockOutModels: []};
      deleteParam.stockOutModels = [...this.selectData1];
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
            this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.getList1(this.tempSearchParam);
          }
        }
      )
    } else if (data.type == 'ok' && this.status == 'audit') {
      let param = Utils.deepCopy(this.modalValidateForm.value);
      param['auditOper'] = this.loginID;
      param['stockOutModels'] = [...this.selectData1];
      this.http.post(stockUrl.auditOutStatus, param).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.nz.create('success', '提示信息', '状态确认成功', {nzDuration: 3000});
          this.listSearch(this.tempSearchParam);
          this.handleCancel();
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
      nzWidth: '400px',
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
    param['auditOper'] = this.loginID;
    param['stockOutModels'] = [...this.selectData1];
    if (this.status == 'cancel') {
      this.http.post(stockUrl.cancelOutStatus, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '取消状态确认成功', {nzDuration: 3000});
          this.listSearch(this.tempSearchParam);
          this.handleCancel();
        }
      })
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

  //左右上下分栏
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

}
