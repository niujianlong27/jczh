import {Component, OnInit, ViewChild} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {CommonService} from '../../../../common/services/common.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../../common/util/utils";
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
@Component({
  selector: 'app-shstock-in',
  templateUrl: './shstock-in.component.html',
  styleUrls: ['./shstock-in.component.css']
})
export class ShstockInComponent implements OnInit {
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
  totalPages1: Number = 0;
  totalPages2: Number = 0;
  pageSize1: Number = 30;
  pageSize2: Number = 30;
  selectedList1: any = [];
  selectedList2: any = [];
  stockInDetailModel: any;
  inWsNo: number = 0;
  updateData: any = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  deleteList = [];//需要删除的数据
  stockIn: any;
  tempSearchParam: any;
  x: any;
  ArrList:any = [];
  msg: string;
  status: string;
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
    // sessionStorage.setItem("stockOut","");
    // sessionStorage.setItem("stockInAddTopInfo",JSON.stringify({status:'Add'}));
    // sessionStorage.setItem("detailList","[]");
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.loginID = this.appInfo.APPINFO.USER.userId; //获取当前登录人id
    sessionStorage.setItem('stockBulkIn', JSON.stringify({status: 'Add'}));
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockBulkIn;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.dataSet2 = [];
    this.totalPages2 = 0;
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
    this.totalWeight = 0;
    this.totalPackageNum = 0;
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
      return {inWsNo: item.inWsNo}
    });
    // this.getList2({page: 1, length: this.pageSize2, shStockIns: this.ArrList});
    this.totalWeight = this.updateData.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    // this.totalPackageNum = this.updateData.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.getList1({page: page, length: this.pageSize1,queryParameterList});
  }


  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1,queryParameterList});
  }


  /**
   * 明细列表当前页数改变的方法
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2,shStockIns: this.ArrList});
  }


  /**
   * 明细列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, shStockIns: this.ArrList});
  }

  /**
   * 获取明细列表方法
   * @param data
   * @param saveData 是否保存数据到session中
   */
  getList2(data: any, saveData?: any) {
    this.listLoading2 = true;
    let url = stockUrl.selectStockBulkInDetail;
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
    this.inWsNo = data.inWsNo;
    // this.getList2({page: 1, length: this.pageSize2, shStockIns: this.ArrList});

  }

  /**
   * 页面按钮点击触发方法
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId !== 'Add' && data.buttonId !== 'Record' ) {
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
        sessionStorage.setItem('stockBulkIn', JSON.stringify({status: 'Add'}));
        this.router.navigate(['/system/shStock/shstockInAdd']);
        break;
      case 'audit':
        this.audit();
        break;
      case 'Record':
        this.router.navigate(['/system/shStock/shstockInAdd'],{queryParams:{state:'Record'}});
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
      this.destroyTplModal();
      return;
    }
    if (this.cm.canOperate(this.updateData, "status", ["RKZT10"], "该数据已入库，不能进行修改操作！")) {
      return
    }
    this.updateData[0].status = 'Update';
    sessionStorage.setItem('stockBulkIn', JSON.stringify(this.updateData[0]));
    this.router.navigate(['/system/shStock/shstockInAdd']);

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
    this.msg = '散货入库管理 > 确认';
    if (this.cm.canOperate(this.updateData, "status", ["RKZT10"], "存在已入库数据，不能进行确认操作！")) {
      return
    }
    this.status = 'audit';
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确认?";

  }

  /**
   * 取消确认
   */
  cancel(): void {
    this.msg = '散货入库管理 > 取消确认';
    if (this.cm.canOperate(this.updateData, "status", ["RKZT00", "RKZT20"], "存在不是确认的数据，不能进行取消确认操作！")) {
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

      let url = stockUrl.deleteStockBulkIn;
      this.http.post(url, {shStockIns: this.updateData}).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.nz.success('提示消息', '删除成功！');
            this.listSearch(this.tempSearchParam);
          }
        }
      )
    } else if (data.type == 'ok' && this.status == 'audit') {
      let param = Utils.deepCopy(this.modalValidateForm.value);
      param['auditOper'] = this.loginID;
      param['shStockIns'] = [...this.updateData];
      this.http.post(stockUrl.auditStockBulkIn, param).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.nz.success('提示消息', '状态确认成功！');
          this.listSearch(this.tempSearchParam);
        }
      });

    }
    else {
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
    param['shStockIns'] = [...this.updateData];
    if (this.status == 'cancel') {
      this.http.post(stockUrl.cancelStockBulkIn, param).then((res: any) => {
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
