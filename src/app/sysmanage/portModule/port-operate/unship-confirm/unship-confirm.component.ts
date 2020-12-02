import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { portUrl } from '../../../../common/model/portUrl';
import { VerticalSplit } from '../../../../common/util/vertical-split.model';
import { Utils } from '../../../sea/common/utils';

@Component({
  selector: 'app-unship-confirm',
  templateUrl: './unship-confirm.component.html',
  styleUrls: ['../ship-confirm/ship-confirm.component.css', './unship-confirm.component.css']
})
export class UnshipConfirmComponent implements OnInit {

  loading: boolean = false;
  total: number = 0;
  result: Array<any> = [];

  loadingWork: boolean = false;
  totalWork: number = 0;
  resultWork: Array<any> = [];

  loadingWorkItem: boolean = false;
  totalWorkItem: number = 0;
  resultWorkItem: Array<any> = [];

  tabIndex: number = 0;

  selectedData: Array<any> = [];

  form: FormGroup;
  modalIsVisible: boolean = false;
  confirmLoading: boolean = false;

  vSplit: VerticalSplit = new VerticalSplit();

  constructor(private http: HttpUtilService,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) {

    this.form = this.fb.group({
      actualDepartureTime: [null, [Validators.required]],
      arriveDate: [null, [Validators.required]],
    });
  }

  ngOnInit() {

  }

  initalSearch: any;
  /**
   * 自定义查询区域准备就绪时回调
   * @param search 自定义查询控件ref
   */
  _initalSearch(search) {
    this.initalSearch = function () {
      search.listSearch();
    }
    // 执行初始画面查询
    // this.initalSearch();
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'ConfimAudit': this.confimAudit(); break;
      default: this.msg.error("该按钮未绑定事件，请联系相关技术人员"); break;
    }
  };

  /**
   * tab页切换响应方法
   */
  tabIndexChanged(): void {
    this.initalSearch();
  }

  /**
   * 分页查询
   * @param param 
   */
  query(param: any): void {
    this.loading = true;
    this.http.post(portUrl.unloadBoatPlan, { ...param }).then(
      (res: any) => {
        if (res.success) {
          this.result = res.data.data.data || [];
          this.total = res.data.data.total || 0;

          this.selectedData = [];

          this.resultWork = [];
        }
        this.loading = false;
      }
    );
  }

  /**
   * 作业计划分页查询
   * @param param 
   */
  queryWork(param: any): void {
    this.loadingWork = true;
    this.http.post(portUrl.unloadWorkScheduleMain, { ...param }).then(
      (res: any) => {
        if (res.success) {
          this.resultWork = res.data.data.data || [];
          this.totalWork = res.data.data.total || 0;

          this.resultWorkItem = [];
        }
        this.loadingWork = false;
      }
    );
  }

  /**
   * 作业计划明细分页查询
   * @param param 
   */
  queryWorkItem(param: any): void {
    this.loadingWorkItem = true;
    this.http.post(portUrl.unloadWorkSchedulePack, { ...param }).then(
      (res: any) => {
        if (res.success) {
          this.resultWorkItem = res.data.data.data || [];
          this.totalWorkItem = res.data.data.total || 0;
        }
        this.loadingWorkItem = false;
      }
    );
  }

  /**
   * 卸船确认补充信息弹框显示
   */
  confimAudit() {
    if (!this.selectedData || this.selectedData.length === 0) {
      this.msg.error("请至少选择一条船舶计划进行确认卸船操作");
      return;
    }
    this.form.reset();
    this.form.patchValue({actualDepartureTime: this.selectedData[0].actualDepartureTime});
    this.modalIsVisible = true;
  }

  /**
   * 卸船确认（生成运单）
   */
  createWaybill() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return;
    }
    this.form.value.actualDepartureTime = Utils.format(this.form.value.actualDepartureTime, 's');
    this.form.value.arriveDate = Utils.format(this.form.value.arriveDate, 's');
    this.confirmLoading = true;
    this.http.post(portUrl.unloadCreateWaybill, { ...this.form.value, boatPlans: this.selectedData }).then(
      (res: any) => {
        if (res.success) {
          this.msg.success("卸船确认操作成功！");
          this.modalIsVisible = false;
        }
        this.confirmLoading = false;
      }
    );
  }


  /**
   * checkbox点击触发事件
   * @param data 
   */
  checkboxClick(data: Array<any>, gridId?: string) {
    if (gridId === 'grid1') {
      this.selectedData = data || [];
      if (!data || data.length === 0) {
        this.resultWork = [];
      } else {
        const plans = this.selectedData.map(item => { return { boatBatchNum: item.boatBatchNum } });
        this.queryWork({ tBoatWorkScheduleMainModelList: plans });
      }
    } else if (gridId === 'grid2') {
      if (!data || data.length === 0) {
        this.resultWorkItem = [];
      } else {
        const works = data.map(item => { return { disNum: item.disNum } });
        this.queryWorkItem({ workScheduleItems: works });
      }
    }
  }

}
