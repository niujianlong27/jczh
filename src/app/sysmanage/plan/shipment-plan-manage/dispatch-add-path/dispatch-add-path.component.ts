import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {planUrl} from "../../../../common/model/planUrls";

@Component({
  selector: 'app-dispatch-add-path',
  templateUrl: './dispatch-add-path.component.html',
  styleUrls: ['./dispatch-add-path.component.css']
})
export class DispatchAddPathComponent implements OnInit {

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  formId: any;
  origin: any;
  backUrl: any;
  obj: any;
  pageStatus: any = '';
  consigneeCode: any;
  urls: any;
  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  btnstatus: any;

  constructor(private router: Router,
              private http: HttpUtilService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private routerInfo: ActivatedRoute) {
  }

  /**
   * 初始化
   */
  ngOnInit() {

    this.btnstatus = JSON.parse(sessionStorage.getItem('dispatchPlanTopInfo')).btnstatus;
    this.formId = this.btnstatus == 'add' ? 'form_dispatch_path' : 'form_dispatch_path_b';
    this.obj = JSON.parse(sessionStorage.getItem('dispatchPlan') || '{"dispatchPlanList":[]}');
    let data: any = {page: 1, length: this.pageSize1};
    //页面入口区分
    this.origin = this.routerInfo.snapshot.queryParams['from'] || '';
    switch (this.origin) {
      case 'planAdd':
        this.backUrl = '/system/plan/shipmentPlanManage/dispatchPlanAdd';
        break;
      case 'planAddPack':
        this.backUrl = '/system/plan/shipmentPlanManage/dispatchPlanAdd';
        break;
      default:
        break;
    }
    // this.listSearch(data);

  }

  /**
   * 获取列表数据
   * @param data
   * @param urls
   */
  getList1(data: any): void {
    if (!data.queryParameterList){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请输入查询条件后进行查询！'
      });
      this.destroyTplModal();
      return
    }
    data.isBulkcargo = this.btnstatus == 'add' ? 'ISSH20' : 'ISSH10';
    data.schedulePackStatus = 'KBZT20';
    let url = planUrl.boatStowageList;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data && res.data.data|| [];
          this.obj['dispatchPlanList'] && this.obj['dispatchPlanList'].map(item => {
            //已经导入的数据不展示在信息列表中
            this.dataSet1 = this.dataSet1.filter(list => list.packNo != item.packNo);
          });

        this.totalPages1 = this.dataSet1.length;
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
   * 当前页码改变
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  /**
   * 每页显示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }

  select(data) {
    this.selectedList1 = data;
    this.totalWeight = this.selectedList1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.selectedList1.map(item => item.packCount).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    switch (data.buttonId) {
      case "Add" :
        let list = this.dataSet1.filter((x: any) => x.checked);
        if (list.length < 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择数据后导入！'
          });
          this.destroyTplModal();
          return;
        }
       for (let i = 0;i<list.length;i++){
         if (list[i].boatBatchNum != list[0].boatBatchNum) {
           this.tplModal = this.nm.warning({
             nzTitle: '提示信息',
             nzContent: '选择列表的船批号必须保持一致！'
           });
           return
         }
       }
        this.obj.dispatchPlanList = [...this.obj.dispatchPlanList, ...list];
        sessionStorage.setItem('dispatchPlan', JSON.stringify(this.obj));
        this.router.navigate([this.backUrl]);
        break;
      case "Cancel" :
        this.router.navigate([this.backUrl]);
        break;
      default:
        this.nz.error('提示消息', '按钮未绑定方法！');
    }
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  // 数字NAN修改为0

  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }
}
