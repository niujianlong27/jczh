import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '../../../../common/services/common.service';
import {TRANS_PLAN_URLS} from '../../../../common/model/transPlan-urls';
import {Utils} from '../../../../common/util/utils';
import {urls} from '@model/url';

@Component({
  selector: 'app-allocate-goods',
  templateUrl: './allocate-goods.component.html',
  styleUrls: ['./allocate-goods.component.css']
})
export class AllocateGoodsComponent implements OnInit {
  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;


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
  data2PageTmp: any = {length: 30}; // 子表页码数据缓存
  selectedList1: any = [];
  selectedList2: any = [];
  loadTaskCode: number = 0;
  updateData: any = [];
  selectData1: any;
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  deleteVisible2 = false;//删除弹窗显示控制
  modalTitle2: string;
  deleteCon2: string;
  deleteList = [];//需要删除的数据
  allocateGoods: any;
  tempSearchParam: any;
  x: any;
  status: string;
  private buttonId: any;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
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

  ngOnInit() {
    //清除session相关信息
    // sessionStorage.setItem('stockOut', '');
    // sessionStorage.setItem('stockInAddTopInfo', JSON.stringify({status: 'Add'}));
    sessionStorage.setItem('detailList', '[]');
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.loginID = this.appInfo.APPINFO.USER.userId; //获取当前登录人id
    sessionStorage.setItem('allocateGoods', JSON.stringify({status: 'Add'}));


    //let temp = JSON.parse(sessionStorage.getItem('allocation') || '{}');
   // console.log(temp);
   //  if (temp.source == 'Add') {
   //
   //    let tempStatus = temp.status;
   //    sessionStorage.setItem('allocation', '');
   //    /*如果点击的分货按钮，就先进行分货操作*/
   //    this.allocate({status: tempStatus});
   //
   //  } else {
   //    this.listSearch({page: 1, length: this.pageSize1});
   //  }
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {

    let url = TRANS_PLAN_URLS.getAllocateGoods;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    });
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
    console.log(data)
    console.log(data.length)   //主表勾选几条
    this.selectData1 = data;
    if (this.selectData1.length !== 0) {
      const tloadTaskCodes = [];
      this.selectData1.forEach(
        res => {
          tloadTaskCodes.push({loadTaskCode: res.loadTaskCode});
        }
      );
      this.getList2({tloadTaskCodes: tloadTaskCodes});
      console.log(tloadTaskCodes)
    } else {
      this.dataSet2 = [];
    }
  }

  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page
    this.getList1(this.tempSearchParam);
  }


  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.tempSearchParam.length=pageSize
    this.pageSize1 = pageSize;
    this.getList1(this.tempSearchParam);
  }


  /**
   * 明细列表当前页数改变的方法
   * @param page
   */
  getPageIndex2(page: any): void {
    let tmp = this.data2PageTmp;
    tmp.page = page;
    console.log(tmp.page)
    this.getList2(tmp);
    //this.getList2({page: page, length: this.pageSize2, loadTaskCode: this.loadTaskCode});
  }

  /**
   * 明细列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    let tmp = this.data2PageTmp;
    tmp.length=pageSize;

    console.log(tmp.length)
    this.pageSize2 = pageSize;
    this.selectData1.length !== 0 ? this.getList2(tmp) : null;
    //this.getList2({page: 1, length: this.pageSize2, loadTaskCode: this.loadTaskCode});
  }
  /**
   * 获取明细列表方法
   * @param data
   * @param saveData 是否保存数据到session中
   */
  // getList2(data: any, saveData?: any) {
  //   this.listLoading2 = true;
  //   let url = TRANS_PLAN_URLS.getAllocateGoodsDetail;
  //   let param: any = data;
  //   this.dataSet2 = [];
  //   this.http.post(url, param).then((res: any) => {
  //     this.listLoading2 = false;
  //     if (res.success) {
  //       this.dataSet2 = res.data.data && res.data.data.data || [];
  //       this.totalPages2 = res.data.data && res.data.data.total || 0;
  //       //如果是修改的时候，查询明细带入session
  //       // if(saveData){
  //       //   sessionStorage.setItem('detailList',JSON.stringify(this.dataSet2));
  //       //   this.router.navigate(['/system/stock/stockInAdd']);
  //       //   saveData.status = 'Update';
  //       //   sessionStorage.setItem('stockInAddTopInfo',JSON.stringify(saveData));
  //       // }
  //     }
  //   });
  // };

  getList2(param: any) {
    param.page = 1; //最好有
    param.length = param.length || this.pageSize2; //最好有
    param.cargoDate = this.selectData1[0].canSendDate
    this.data2PageTmp = param;
    console.log(this.data2PageTmp)
    let url = TRANS_PLAN_URLS.getAllocateGoodsDetail;
    this.listLoading2 = true;
      this.http.post(url, param).then((res: any) => {
        this.listLoading2 = false;
        if (res.success) {
          this.dataSet2 = res.data.data && res.data.data.data || [];
          this.totalPages2 = res.data.data && res.data.data.total || 0;
        }
    });
  }


  // allocate(data: any) {
  //   this.tplModal = this.nm.warning({
  //     nzTitle: '提示信息',
  //     nzContent: '正在进行分货，请稍后......'
  //   });
  //   let url = TRANS_PLAN_URLS.allocateGoods;
  //   let param: any = data;
  //   this.http.post(url, param).then((res: any) => {
  //     if (res.success) {
  //       this.listSearch({page: 1, length: this.pageSize1});
  //
  //       /*执行完之后，清除session*/
  //       sessionStorage.setItem('allocation', '');
  //       this.tplModal.destroy();
  //
  //     }
  //   });
  //
  // }


  /**
   * 主列表点击触发的方法
   * @param data
   */
  // listClick(data: any): void {
  //   this.selectedList1 = data;
  //   this.loadTaskCode = data.loadTaskCode;
  //   this.getList2({page: 1, length: this.pageSize2, loadTaskCode: this.loadTaskCode});
  //
  // }

  /**
   * 页面按钮点击触发方法
   * @param data
   */
  btnClick(data: any): void {
    this.buttonId = data.buttonId;
    if (data.buttonId !== 'Add' && data.buttonId !== 'abolish') {
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
        this.router.navigate(['/system/trans/plan-manage/allocateGoodsAdd']);
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
      case 'abolish':
        this.btnAbolish();
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
    if (this.cm.canOperate(this.updateData, 'status', ['10'], '该数据已执行，不能进行修改操作！')) {
      return;
    }

    this.router.navigate(['/system/trans/plan-manage/allocateGoodsAdd']);
    this.updateData[0].status = 'Update';
    sessionStorage.setItem('allocateGoods', JSON.stringify(this.updateData[0]));
  }


  /**
   * 删除
   */
  btnDelete() {
    if (this.cm.canOperate(this.updateData, 'status', ['10'], '存在已执行数据，不能进行删除操作！')) {
      return;
    }
    ;
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = '是否确定删除？';
  }

  /**
   * 作废
   */
  btnAbolish() {
    if (this.cm.canOperate(this.dataSet1, 'status', ['10'], '存在已执行数据，不能进行作废操作！')) {
      return;
    }
    ;

    if(this.dataSet1.length == 0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent:'无可作废数据！'
      });
      this.destroyTplModal();
      return;
    }

    this.tipModalCreat2(); // 创建弹框


  }


  /**
   * 确认
   */
  audit(): void {
    if (this.cm.canOperate(this.updateData, 'status', ['10'], '存在已确认数据，不能进行确认操作！')) {
      return;
    }
    this.status = 'audit';
    //this.tipModalCreat(); // 创建弹框
    let param = {selectDataList: []};
    param.selectDataList = [...this.updateData];
    if (this.status == 'audit') {
      this.http.post(TRANS_PLAN_URLS.confirmAllocateGoods, param).then((res: any) => {
        if (res.success) {
          this.nz.success('提示消息', '状态确认成功！');
          this.listSearch(this.tempSearchParam);
          this.handleCancel();
        }
      });
    }

  }

  /**
   * 取消确认
   */
  cancel(): void {
    if (this.cm.canOperate(this.updateData, 'status', ['00', '20'], '存在未确认数据，不能进行取消确认操作！')) {
      return;
    }
    ;
    this.status = 'cancel';
    this.tipModalCreat(); // 创建弹框


  }


  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {

      let url = TRANS_PLAN_URLS.deleteAllocateGoods;
      let param = {selectDataList: []};
      param.selectDataList = [...this.updateData];
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.nz.success('提示消息', '删除成功！');
            this.listSearch(this.tempSearchParam);
            this.dataSet2 = [];
          }
        }
      );
    } else {
      this.deleteVisible = false;
    }
  }


  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult2(data: any): void {
    if (data.type == 'ok') {
      console.log('hello');
      let url = TRANS_PLAN_URLS.deleteAllocateGoods;
      let param = {selectDataList: []};
      param.selectDataList = [...this.updateData];
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.nz.success('提示消息', '删除成功！');
            this.listSearch(this.tempSearchParam);
          }
        }
      );
    } else {
      this.deleteVisible = false;
    }
  }

  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    this.modalValidateForm.reset();
  }

  /**
   * 弹窗取消
   */
  handleCancel2() {
    this.tplModal.destroy();
    // this.modalValidateForm.reset();
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
    param['selectDataList'] = [...this.updateData];
    if (this.status == 'cancel') {
      this.http.post(TRANS_PLAN_URLS.cancelAllocateGoods, param).then((res: any) => {
        if (res.success) {
          this.nz.success('提示消息', '取消确认成功！');
          this.listSearch(this.tempSearchParam);
          this.handleCancel();
        }
      });
    }


  }

  /**
   * 弹窗确定
   */
  handleOk2() {
    let param: any = {};

    param.canSendDate = this.dataSet1[0].canSendDate || '';
    param.lineName = this.dataSet1[0].lineName || '';
    console.log(param);
    this.http.post(TRANS_PLAN_URLS.abolishAllocateGoods, param).then((res: any) => {
      if (res.success) {
        this.nz.success('提示消息', '操作成功！');
        this.listSearch(this.tempSearchParam);
        this.handleCancel();
      }
    });


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
   * 创建弹窗
   */
  tipModalCreat2(): void {
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
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


  searchDataReturn(data: any) {
    let myData = new Date();
    console.log(1111);
    // let b = data.filter(x => x.parameter === 'canSendDate');
    // console.log(b)
    // b[0].value1 = myData.toLocaleDateString();
  }
}
