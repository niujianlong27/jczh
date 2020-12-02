import {Component, OnInit, ViewChild} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {CommonService} from '../../../../common/services/common.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../../common/util/utils";
import {portUrl} from "../../../../common/model/portUrl";
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

/**
 * Title: stock-in.component.ts
 * Description: 入库维护页面
 * Created: zzp 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.css']
})
export class StockInComponent implements OnInit {

  gridOneHeight: string;
  gridTwoHeight: string;

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
  selectedList1: any = [];
  selectedList2: any = [];
  inWsId: number = 0;
  updateData: any = [];
  selectData1: any;
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  deleteList = [];//需要删除的数据
  stockIn: any;
  tempSearchParam: any;
  x: any;
  status: string;
  msg: string;
  ArrList:any = [];
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
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


  constructor(private router: Router, private appInfo: UserinfoService, private fb: FormBuilder, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {
    //清除session相关信息
    sessionStorage.setItem("stockOut", "");
    sessionStorage.setItem("stockInAddTopInfo", JSON.stringify({status: 'Add'}));
    sessionStorage.setItem("detailList", "[]");
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.loginID = this.appInfo.APPINFO.USER.userId; //获取当前登录人id
    sessionStorage.setItem('stockIn', JSON.stringify({status: 'Add'}));
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    this.totalWeight = 0;
    this.totalBranchNum = 0;
    this.totalPackageNum = 0;
    let url = stockUrl.selectStockIn;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {

    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
    this.ArrList = this.updateData.map( item => {
      return {inWsId: item.inWsNo}
    });
    this.getList2({page: 1, length: this.pageSize2, stockInDetails: this.ArrList});
    this.totalWeight = this.updateData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);

    this.totalWeight = this.totalWeight/1000;

  }

  /**
   * 明细列表当前页数改变的方法
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2,stockInDetails: this.ArrList});
  }


  /**
   * 明细列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,stockInDetails: this.ArrList});
  }

  /**
   * 获取明细列表方法
   * @param data
   * @param saveData 是否保存数据到session中
   */
  getList2(data: any, saveData?: any) {
    this.listLoading2 = true;
    let url = stockUrl.selectStockInDetail;
    let param: any = data;
    this.dataSet2 = [];
    this.http.post(url, param).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        //如果是修改的时候，查询明细带入session
        // if(saveData){
        //   sessionStorage.setItem('detailList',JSON.stringify(this.dataSet2));
        //   this.router.navigate(['/system/stock/stockInAdd']);
        //   saveData.status = 'Update';
        //   sessionStorage.setItem('stockInAddTopInfo',JSON.stringify(saveData));
        // }
      }
    })
  };


  /**
   * 主列表点击触发的方法
   * @param data
   */
  listClick(data: any): void {
    this.selectedList1 = data;
    this.inWsId = data.inWsNo;
    // this.getList2({page: 1, length: this.pageSize2, inWsId: this.inWsId});
  }

  /**
   * 页面按钮点击触发方法
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

    switch (data.buttonId) {
      case 'Add':
        this.router.navigate(['/system/stock/stockInAdd']);
        break;
      case 'audit':
        this.audit();
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

      default:
        break;
    }
  }


  /**
   * 修改
   */
  btnUpdate() {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      return;
    }
    if (this.cm.canOperate(this.updateData, "status", ["RKZT10"], "该数据已入库，不能进行修改操作！")) {
      return
    }
    this.router.navigate(['/system/stock/stockInAdd']);
    this.updateData[0].status = 'Update';
    sessionStorage.setItem('stockIn', JSON.stringify(this.updateData[0]));
  }


  /**
   * 删除
   */
  btnDelete() {
    if (this.cm.canOperate(this.updateData, "status", ["RKZT10"], "存在已入库数据，不能进行删除操作！")) {
      return
    }
    this.status = 'delete';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定删除？";
  }


  /**
   * 确认
   */
  audit(): void {
    this.msg = '入库管理 > 确认';
    if (this.cm.canOperate(this.updateData, "status", ["RKZT10"], "存在已入库数据，不能进行确认操作！")) {
      return
    }
    this.status = 'audit';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确认";
    // this.tipModalCreat(); // 创建弹框

  }

  cancel(): void {  //取消确认
    this.msg = '入库管理 > 取消确认';
    if (this.cm.canOperate(this.updateData, "status", ["RKZT00", "RKZT20"], "存在未入库数据，不能进行取消确认操作！")) {
      return
    }
    this.status = 'cancel';
    this.tipModalCreat(); // 创建弹框
  }


  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok' && this.status == 'delete') {
      let url = stockUrl.deleteStockInAndDetail;
      let param = {stockInModels: []};
      param.stockInModels = [...this.updateData];
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.nz.success('提示消息', '删除成功！');
            this.listSearch(this.tempSearchParam);
          }
        })
    } else if (data.type == 'ok' && this.status == 'audit') {
      let param = Utils.deepCopy(this.modalValidateForm.value);
      param['auditOper'] = this.loginID;
      param['stockInModels'] = [...this.updateData];
      this.http.post(stockUrl.auditInStatus, param).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.nz.success('提示消息', '状态确认成功！');
          this.listSearch(this.tempSearchParam);
        }
      });
    } else {
      this.deleteVisible = false;
    }
  }

  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    this.modalValidateForm.reset();
  }

  /**
   * 弹窗确定
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
    param['stockInModels'] = [...this.updateData];
    if (this.status == 'cancel') {
      this.http.post(stockUrl.cancelInStatus, param).then((res: any) => {
        if (res.success) {
          this.nz.success('提示消息', '取消确认成功！');
          this.listSearch(this.tempSearchParam);
          this.handleCancel()
        }
      })
    }
  }

  /**
   * 创建弹窗
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

  //左右上下分栏
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
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
