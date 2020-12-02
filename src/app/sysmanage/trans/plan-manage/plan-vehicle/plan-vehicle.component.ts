import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TRANS_URLS } from '../../../../common/model/trans-urls';

@Component({
  selector: 'app-plan-vehicle',
  templateUrl: './plan-vehicle.component.html',
  styleUrls: ['./plan-vehicle.component.css']
})
export class PlanVehicleComponent implements OnInit {

  // 调度相关信息
  planData: Array<any> = [];
  itemData: Array<any> = [];

  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedPlanData: Array<any> = [];
  
  constructor(private http: HttpUtilService,
    public router: Router,
    private msg: NzMessageService,) { }

  ngOnInit() {
    console.dir(this);
    this.query({});
  }

  /**
   * 查询调度
   * @param pageParam 
   */
  query(pageParam?: any){
    this.loading = true;
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.http.post(TRANS_URLS.SELECT_PLAN, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.planData = res.data.data && res.data.data.data;
        this.total = res.data.data && res.data.data.total;
        this.planData.forEach((item, index) => item.rowIndex = index+1);
      } 
      this.loading = false;
    })
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button 
   */
  btnClick(button: any){
    switch(button.buttonId){
      case "print": this.print(); break;
      case "update": this.update(); break;
      case "delete": this.delete(); break;
      default: this.msg.error("按钮未绑定方法");
    }
  }

  /**
   * 打印
   */
  print(){
    this.msg.warning("功能待开发");
  }

  /**
   * 修改
   */
  update(){
    if(!this.selectedPlanData || this.selectedPlanData.length !== 1){
      this.msg.error("请选择选择一条调度记录！");
    }
    
    // if(this.selectedPlanData[0].settleFlag === 'FYDJ20' || this.selectedPlanData[0].priceFlag === 'HJBJ20'){
    //   this.msg.error("该调度已登记运费或已核价不能修改");
    //   return;
    // }
    this.router.navigate(['/system/trans/plan-manage/plan-update'], {queryParams: {'planNo': this.selectedPlanData [0].planNo}});
  }

  /**
   * 作废
   */
  delete(){
    if(!this.selectedPlanData || this.selectedPlanData.length === 0){
      this.msg.error("请选择至少选择一条调度记录！");
    }
    // let invalidate = this.selectedPlanData.filter((item, index) => {
    //   item.rowIndex = index+1;
    //   return item.settleFlag === 'FYDJ20';
    // });
    // if(invalidate.length > 0){
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join("、")}条调度已登记运费不能作废`);
    //   return;
    // }

    // invalidate = this.selectedPlanData.filter((item, index) => {
    //   item.rowIndex = index+1;
    //   return item.priceFlag === 'HJBJ20';
    // });
    // if(invalidate.length > 0){
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join("、")}条调度运费已核价不能作废`);
    //   return;
    // }

    this.http.post(TRANS_URLS.DELETE_PLAN, {tPlans: this.selectedPlanData}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`作废成功！作废调度${this.selectedPlanData.length}条`);
          this.selectedPlanData = [];
          this.query({});
          this.itemData = [];
          // this.driverData = res.data.data;
        }
      }
    );

  }


  /**
   * 行点击事件
   * @param data 
   */
  rowCilcked(data: any){
    this.planData.forEach(item => {
      if(item.rowIndex === data.rowIndex){
        item.checked = !item.checked;
      }
    });
    this.selectedPlan(this.planData.filter(item => item.checked));
  }

  totalWeight: number = 0;
  totalSheet: number = 0;

  /**
   * 选中数据
   * @param data 
   */
  selectedPlan(data: any){
    this.selectedPlanData = data;
    this.totalWeight = this.selectedPlanData.map(item => item.totalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedPlanData.map(item => item.totalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);

    if(this.selectedPlanData.length > 0){
      this.queryItem();
    }else{
      this.itemData = [];
    }
  }


  /**
   * 根据调度查询调度明细信息
   */
  queryItem() {
    this.http.post(TRANS_URLS.SELECT_PLANITEM_BY_PLAN, { tPlans: this.selectedPlanData }).then(
      (res: any) => {
        if (res.success) {
          this.itemData = res.data.data;
        }
      }
    );
  }

}


