import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Router, ActivatedRoute} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TRANS_URLS, SYS_URLS} from '../../../../common/model/trans-urls';
import {SelectService} from '../../../../components/simple-page/simple-page-form.module';
import {PlanItemAddServiceComponent} from '../plan-item-add-service/plan-item-add-service.component';
import {PlanItemAddComponent} from '../plan-item-add/plan-item-add.component';

@Component({
  selector: 'app-plan-update',
  templateUrl: './plan-update.component.html',
  styleUrls: ['./plan-update.component.css'],
  providers: [
    {
      provide: PlanItemAddServiceComponent,
      useFactory: (modalService) => new PlanItemAddServiceComponent(modalService),
      deps: [NzModalService]
    }
  ]
})
export class PlanUpdateComponent implements OnInit {

  loading: boolean = false;

  plan: any = {};
  driver: any = {};

  // 调度相关信息
  itemData: Array<any> = [];

  driverDataSource: Array<any> = [];
  dirverFieldKey = {text: 'name', value: 'userId'};

  isVisible: boolean = false;
  @ViewChild(PlanItemAddComponent) planItemAdd: PlanItemAddComponent;

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private selectService: SelectService,
              private route: ActivatedRoute,
              private router: Router,
              private itemAdd: PlanItemAddServiceComponent) {
  }

  ngOnInit() {
    // this.query({});
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.planNo) {
        this.query(queryParams.planNo);
      } else {
        this.msg.error("加载数据失败！调度单号为空。")
      }
    });

    // 加载司机工号下拉数据源
    this.selectService.getValue(SYS_URLS.SELECT_DRIVER, {}).then((res: any) => {
      if (res.success) {
        this.driverDataSource = res.data.data.data;
      }
    });
  }

  /**
   * 根据调度单号查询调度数据
   * @param planNo
   */
  query(planNo: string) {
    // 加载司机工号下拉数据源
    this.http.post(TRANS_URLS.GET_PLAN, {planNo: planNo}).then((res: any) => {
      if (res.success) {

        this.plan = res.data.data;
        this.driver = this.plan.tPlanDriver;
        this.itemData = this.plan.tPlanItems;
        this.itemData.forEach((item, index) => item.rowIndex = (index + 1));
      }
    });
  }

  btnClick(button: any) {
    switch (button.buttonId) {
      case 'Save':
        this.update();
        break;
      case 'return':
        this.cancel();
        break;
      case 'Delete':
        this.deleteItem();
        break;
      case 'Add':
        this.isVisible=true;
        break;
    }
  }

  /**
   * 点击确定按钮，将选中的数据写到当前界面
   */
  checkOk() {
    const addItems = this.planItemAdd.checkOk().filter(item => {
      const index = this.itemData.findIndex(item2 => item.orderPackNo === item2.orderPackNo && item.flowSeqNo === item2.flowSeqNo);
      if (index > -1) {
        this.itemData[index].planWeight = Number(this.itemData[index].planWeight) + Number(item.planWeight);
        this.itemData[index].planQuantity = Number(this.itemData[index].planQuantity) + Number(item.planQuantity);
        return false;
      }
      return true;
    });

    this.itemData = [...this.itemData, ...addItems];


    const planInfo = this.planItemAdd.setPlanInfo(this.itemData);
    Object.assign(this.plan, planInfo);

    this.isVisible = false;
  }

  /**
   * 修改调度信息用后台方法
   */
  update() {
    this.itemData.forEach(item => item.checked = true);
    this.plan.tPlanItems = this.itemData;

    this.plan.tPlanDriver = this.driver;

    if (!this.planItemAdd.validateDriver(this.driver) || !this.planItemAdd.validateItem(this.itemData)) {
      return;
    }
     this.loading = true;
    this.http.post(TRANS_URLS.UPDATE_PLAN, this.plan).then((res: any) => {
      if (res.success) {
        this.msg.success("调度信息修改成功");
        this.query(this.plan.planNo);
      }
      this.loading = false;
    });

  }

  /**
   * 取消/返回  跳转到调度查询界面
   */
  cancel() {
    this.router.navigate(['/system/trans/plan-manage/plan-vehicle'], {queryParams: {}});
  }

  /**
   * 删除调度明细信息
   */
  deleteItem() {
    if (this.itemData.filter(item => item.checked).length == 0) {
      this.msg.warning("请至少选择一条调度明细信息");
      return;
    }

    this.itemData = this.itemData.filter(item => !item.checked);
  }

  /**
   * 根据选择工号带回的userId查找用户相关信息，并设置到driver中
   * @param userId
   */
  setDriverInfo(userId: string) {

    if (userId && this.driverDataSource.length > 0) {
      const user = this.driverDataSource.filter(item => item.userId === userId)[0];
      if (user) {
        this.driver.driverId = userId;
        this.driver.vehicleNo = user.vehicleNo;
        this.driver.mobile = user.mobile;
      }

    }
  }

}


