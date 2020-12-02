import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from '../../../../common/model/stockUrl';
import {portUrl} from '../../../../common/model/portUrl';

/**
 * Title: stock-add-detail.component.ts
 * Description: 库存明细信息
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-add-detail',
  templateUrl: './stock-add-detail.component.html',
  styleUrls: ['./stock-add-detail.component.css']
})

export class StockAddDetailComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1:number = 30;
  selectedList1: any = [];
  stockInfoModels:Array<any>=[];
  formId:any = 'form_stock_add_detail';
  origin:any;
  backUrl:any;
  obj:any;
  pageStatus:any = '';
  consigneeCode:any;
  urls:any;

  constructor(private router: Router,private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,private routerInfo:ActivatedRoute) { }

  /**
   * 初始化
   */
  ngOnInit() {


    this.obj = JSON.parse(sessionStorage.getItem('stockOut')||'{"stockOutDetailList":[]}');


    console.log(this.routerInfo.snapshot.queryParams['from']);

    let data:any = {page: 1, length: this.pageSize1};

    //页面入口区分
    this.origin = this.routerInfo.snapshot.queryParams['from'] || '';
    switch (this.origin) {
      case 'stock_out':
        // this.formId = 'form_stock_out_add_info';
        this.backUrl = '/system/stock/stockOutAdd';
        this.pageStatus = '1'; //出库
        break;
      case 'stock_move':
        // this.formId = 'form_stock_move_add_info';
        this.backUrl = '/system/stock/stockMoveAdd';
        this.pageStatus = '2'; //移库
        break;
      case 'transfer_task':
        // this.formId = 'form_stock_move_add_info';
        this.backUrl = '/system/portOperate/transferTaskAdd';
        this.pageStatus = '4'; //调港
        break;
      case 'stock_inventory':
      // this.formId = 'form_stock_inventory_add_info';
      this.backUrl = '/system/stock/stockInventoryAdd';
      this.pageStatus = '3'; //盘库
      break;
      case 'stock_reverse':
        // this.formId = 'form_stock_inventory_add_info';
        this.backUrl = '/system/stock/stockReverseShipmentAdd';
        this.pageStatus = '5'; //倒运
        break;
      case 'stock_transfer':
        // this.formId = 'form_stock_inventory_add_info';
        this.backUrl = '/system/stock/stockTransferAdd';
        let info = JSON.parse(sessionStorage.getItem("stockTransferTopInfo") || "{}");
        this.urls = stockUrl.selectStockTransferDetail1;
        data.consigneeCode = info.customerId || '';
        this.consigneeCode = data.consigneeCode;
        console.log(data);
        break;
      case 'planManage_allocate':
        this.backUrl = '/system/planManage/shipAllocateInfo';
        this.urls = portUrl.shipAllocateImport;
        break;

      default:
        break;
    }

    data.pageStatus = this.pageStatus || '';
    this.getList1(data,this.urls);

  }

  /**
   * 获取列表数据
   * @param data
   * @param urls
   */
  getList1(data: any,urls?:any): void {
    let url = urls ? urls : stockUrl.selectStockInfoForOut;
    data.pageStatus = this.pageStatus || '';
    data.consigneeCode = this.consigneeCode || '';
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.obj.stockOutDetailList.map(item => {
          //已经导入的数据不展示在库存信息列表中
          this.dataSet1 = this.dataSet1.filter(list => list.packNo != item.packNo);
        })
        this.totalPages1 = this.dataSet1.length;
        console.log(this.totalPages1);
      }
    })
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data,this.urls ? this.urls : false);
  }

  /**
   * 当前页码改变
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  /**
   * 每页显示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if(data.buttonId === 'Import'){
      let list = this.dataSet1.filter((x:any)=>x.checked);
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后导入！'
        });
        this.destroyTplModal();
        return;
      }


      this.obj.stockOutDetailList=[...this.obj.stockOutDetailList,...list];
      sessionStorage.setItem('stockOut',JSON.stringify(this.obj));

      console.log(this.origin);
      this.router.navigate([this.backUrl]);


    }else if(data.buttonId === 'Cancel'){
      this.router.navigate([this.backUrl]);
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

}
