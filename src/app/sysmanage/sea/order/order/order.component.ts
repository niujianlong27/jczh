import { Component, OnInit } from '@angular/core';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { CodesetService } from '../../common/codeset.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Utils } from '../../common/utils';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['../../common/sea-common.css', './order.component.css']
})
export class OrderComponent implements OnInit {

  queryLoading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  result: Array<any> = [];
  orderItem: Array<any> = [];
  orderItemEdit: Array<any> = [];

  selectedData: any;  // 选中的数据

  bizScope: Array<any> = [];  //  业务范围
  sourceType: Array<any> = [];  //  来源
  inqu: any = { createDateStart: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) }; // 追加查询条件

  modalIsVisible: boolean; //定单修改弹框是否显示
  saveLoading: boolean;
  form: FormGroup;

  private initalSearch: any;

  btnDisable: any = {      // 禁用按钮
    delete: true  // 删除
  };

  constructor(private http: HttpUtilService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private codeset: CodesetService,
    private appInfo: UserinfoService, 
    private fb: FormBuilder,) {

      this.form = this.fb.group({
        // transCompanyId: [null, [Validators.required]],
        boatName: [null, []],
        loadDateStart: [null, []],
        loadDateEnd: [null, []],
        remark: [null, []],
      });

  }

  ngOnInit() {    
    this.sourceType = this.codeset.get('sourceType');
  }

  /**
   * 自定义查询区域准备就绪时回调
   * @param search 自定义查询控件ref
   */
  _initalSearch(search) {
    this.initalSearch = function () {
      search.listSearch();
    }
    // 执行初始画面查询
    this.initalSearch();
    // this.codeset.reFetchSeaUserInfo().then(() => {
    //   this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
    //   if (this.bizScope && this.bizScope.length > 0) {
    //     this.inqu.transType = this.bizScope[0].value;
    //     // 执行初始画面查询
    //     this.initalSearch();
    //   } else {
    //     this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
    //   }
    // });
  }

  /**
     * 按钮组件点击事件处理
     * @param data 
     */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'delete': this.delete(); break;  // 删除
      case 'update': this.update(); break;  // 修改
      default: this.msg.error("该功能待开发"); break;
    }
  }

  /**
   * 分页查询
   * @param data 
   */
  getList(pageParam: any): void {
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.queryLoading = true;
    this.http.post(SEA_URLS.getOrder, { ...pageParam }).then(
      (res: any) => {
        if (res.success) {
          this.result = res.data.data.data || [];
          this.total = res.data.data.total || 0;
          this.selectedData = null;
        }
        setTimeout(() => this.queryLoading = false, 100);
      }
    );
  }


  /**
   * 修改
   */
  update(): void{
    if (!this.selectedData) {
      this.msg.error("请至少选中一条订单数据进行修改操作");
      return;
    }
    this.modalIsVisible = true;
    this.orderItemEdit = JSON.parse(JSON.stringify(this.orderItem));
    this.form.patchValue(this.selectedData);
  }

  /**
   * 删除
   */
  delete() {
    if (!this.selectedData) {
      this.msg.error("请至少选中一条订单数据删除");
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定删除选中订单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  /**
   * 批量删除订单信息
   */
  deleteList() {
    this.http.post(SEA_URLS.deleteOrder, { orderModels: [this.selectedData] }).then((res: any) => {
      if (res.success) {
        this.initalSearch();
        this.notification.create('success', '提示信息', '删除成功！');
      }
    });
  }

  /**
   * 订单修改弹框保存按钮
   */
  save(): void{
    this.orderValid();
    const stats = this.handleOrderData();
    this.saveLoading = true;
    this.http.post(SEA_URLS.updateOrder, { ...this.selectedData, ...this.form.value,  ...stats, orderItemModels: this.orderItemEdit }).then((res: any) => {
      if (res.success) {
        this.notification.success('提示信息', '修改成功！');
        this.selectedData = Object.assign(this.selectedData, {...this.form.value, ...stats});
        this.orderItem = res.data.data.orderItemModels;
        this.modalIsVisible = false;
      }
      this.saveLoading = false;
    });
    
  }

  /**
   * 订单修改数据验证
   */
  orderValid(): boolean{
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return false;

    if (!this.orderItemEdit || this.orderItemEdit.length === 0) {
      this.notification.error("提示信息", "货盘明细不能为空");
      return false;
    }
    if (this.orderItemEdit.some(item => !item.productName)) {
      this.notification.error("提示信息", "货盘明细的品名不能为空");
      return false;
    }
    if (this.orderItemEdit.some(item => item.containerType && item.containerNo && isNaN(item.containerNo))) {
      this.notification.error("提示信息", "货盘明细的集装箱数量必须为数字");
      return false;
    }

    return true;
  }

  /**
   * 订单数据处理
   */
  handleOrderData(): any {
    // 日期格式化
    this.form.value.loadDateEnd = Utils.format(this.form.value.loadDateEnd);
    this.form.value.loadDateStart = Utils.format(this.form.value.loadDateStart);
    // 明细数据汇总数据到订单表
    return {
      actTotWeight: Utils.sumByKey(this.orderItemEdit, 'goodsWeight'),
      actTotSheet: Utils.sumByKey(this.orderItemEdit, 'goodsNo'),
      productName: Utils.distinct(this.orderItemEdit.map(item => item.productName)).join(","),
      containerDesc: Utils.getContainerDesc(this.orderItemEdit),
    }
  }

  /**
   * 订单明细列配置信息
   * @param cloumns 
   */
  orderItemColums(cloumns: any) {
    const orderItemColums = Array.isArray(cloumns) ? cloumns : [];
    orderItemColums.forEach(item => item.colEname === 'productName' && (item.required = true));
  }

  /**
   * 添加订单明细
   */
  addOrderItem() {
    this.orderItemEdit = [{}, ...this.orderItemEdit];
  }

  /**
   * 删除订单明细
   */
  deleteOrderItem() {
    this.orderItemEdit = this.orderItemEdit.filter(item => !item.checked);
  }

  /**
   * checkbox点击触发事件
   * @param data 
   */
  checkboxClick(data: Array<any>) {
    this.selectedData = data && data[0] ? data[0] : null;
    this.getOrderItem(this.selectedData);

    // 删除（初始状态）
    this.btnDisable.delete = !this.selectedData || this.selectedData.status !== '10' || this.appInfo.APPINFO.USER.seaCompanyType === '30';
    this.btnDisable.update = !this.selectedData || this.selectedData.status !== '10';
  }

  /**
   * 竞价单列表点击，查询订单关联订单明细信息
   * @param data 
   */
  rowClick(data: any) {
    this.result.forEach(item => {
      if (item.rowid === data.rowid) {
        item.checked = !item.checked;
      } else if (item.checked) {
        item.checked = false;
      }
    });

    this.checkboxClick(this.result.filter(item => item.checked));
  }

  /**
   * 查询订单关联订单明细信息
   * @param data 
   */
  getOrderItem(data: any){
    if(!data){
      this.orderItem = [];
      return;
    }
    this.http.post(SEA_URLS.getOrderItem, { orderNo: data.orderNo }).then(
      (res: any) => {
        if (res.success) {
          this.orderItem = res.data.data || [];
        }
      }
    );
  }


  /**
   * 船期开始大于等于当前日期并且小于等于结束日期
   */
  disabledStartDate = (startValue: Date): boolean => {
    // return Utils.beforeNowDate(startValue, this.form.value.loadDateEnd);
    return Utils.beforeDate(startValue, this.selectedData.createDate);
  };

  /**
   * 船期结束选择框限制
   */
  disabledEndDate = (endValue: Date): boolean => {
    return Utils.beforeNowDate(endValue) || Utils.beforeDate(endValue, this.form.value.loadDateStart);
  }

  // edit(){
  //   this.notification.create('success', '提示信息', '测试成功');
  // }

}
