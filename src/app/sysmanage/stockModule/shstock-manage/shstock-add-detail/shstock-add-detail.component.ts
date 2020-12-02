import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from '../../../../common/model/stockUrl';

@Component({
  selector: 'app-shstock-add-detail',
  templateUrl: './shstock-add-detail.component.html',
  styleUrls: ['./shstock-add-detail.component.css']
})
export class ShstockAddDetailComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1: number = 30;
  formId: any = 'form_shstock_add_detail';
  origin: any;
  backUrl: any;
  obj: any;
  pageStatus: any = '';
  consigneeCode: any;
  urls: any;
  selectData:any = [];

  constructor(private router: Router, private http: HttpUtilService,
              private nm: NzModalService, private nz: NzNotificationService,
              private routerInfo: ActivatedRoute) {
  }
  /**
   * 初始化
   */
  ngOnInit() {
    this.obj = JSON.parse(sessionStorage.getItem('stockOut') || '{"stockOutDetailList":[]}');
    let data: any = {page: 1, length: this.pageSize1};

    //页面入口区分
    this.origin = this.routerInfo.snapshot.queryParams['from'] || '';
    switch (this.origin) {
      case 'stockOut':
        this.backUrl = '/system/shStock/bulkcargoOutAdd';//散货出库
        break;
      default:
        break;
    }
    this.getList1(data, this.urls);

  }

  /**
   * 获取列表数据
   * @param data
   * @param urls
   */
  getList1(data: any, urls?: any): void {
    let url = urls ? urls : stockUrl.selectShStockInfo;
    data.pageStatus = this.pageStatus || '';
    data.consigneeCode = this.consigneeCode || '';
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.obj.stockOutDetailList.map(item => {
          //已经导入的数据不展示在库存信息列表中  //根据捆包判断散货不可用
          this.dataSet1 = this.dataSet1.filter(list => list.packNo != item.packNo);
        })
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
    this.getList1(data, this.urls ? this.urls : false);
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

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    console.log(data.buttonId);
    if (data.buttonId === 'Import') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后导入！'
        });
        this.destroyTplModal();
        return;
      }
      this.obj.stockOutDetailList = [...this.obj.stockOutDetailList, ...list];
      //存储当前的明细，包含现在勾选和已有的
      sessionStorage.setItem('stockOut', JSON.stringify(this.obj));
      this.router.navigate([this.backUrl]);
    } else if (data.buttonId === 'Cancel') {
      this.router.navigate([this.backUrl]);
    }
  }
  updateDataResult(data){
    this.selectData = data;
  }
  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };
}
