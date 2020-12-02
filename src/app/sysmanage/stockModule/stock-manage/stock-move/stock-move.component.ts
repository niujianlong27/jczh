import { Component, OnInit } from '@angular/core';
import { stockUrl } from "../../../../common/model/stockUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";

/**
 * Title: stock-move.component.ts
 * Description: 移库维护页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-move',
  templateUrl: './stock-move.component.html',
  styleUrls: ['./stock-move.component.css']
})
export class StockMoveComponent implements OnInit {

  gridOneHeight: string;
  gridTwoHeight: string;

  // 页面grid 左右分栏
  // leftWidth:string = '49.5%';
  // lineWidth:string = '49.5%';
  // rightWidth:string = '49.5%';
  // display:string = 'block';
  // rightShow:boolean = false;

  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  totalBranchNum: number = 0;   //总支数

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
  moveWsId:any;
  updateData:any = [];
  ArrList:any = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  tempSearchParam:any;
  x:any;
  constructor(private router: Router,private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) { }

  /**
   * 初始化
   */
  ngOnInit() {
    //清除相关session
    sessionStorage.setItem("stockOut","");
    sessionStorage.setItem("stockMoveTopInfo",JSON.stringify({status:'Add'}));
    sessionStorage.setItem("detailList","[]");
    this.getList1({ page: 1, length: this.pageSize1 });

  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockMove;
    this.listLoading1 = true;
    this.dataSet1=[];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
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
    this.getList1(data);
  }


  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,stockMoveDetails:this.ArrList});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,stockMoveDetails:this.ArrList});
  }

  /**
   * 获取明细列表
   * @param data
   */
  getList2(data: any){
    let url = stockUrl.selectStockMoveDetail;
    this.dataSet2 = [];
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  /**
   * 列表选中数据发生变化
   * @param data
   */
  updateDataResult(data:any){
    this.updateData = data;
    this.ArrList = this.updateData.map( item => {
      return {moveWsId: item.moveWsNo}
    });
    this.getList2({ page: 1, length: this.pageSize2,stockMoveDetails:this.ArrList});
    this.totalWeight = this.updateData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data:any):void{
    this.moveWsId = data.moveWsNo;
    this.getList2({ page: 1, length: this.pageSize2,moveWsId:this.moveWsId});

  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    console.log(data);
    if(data.buttonId === 'Add'){
      this.router.navigate(['/system/stock/stockMoveAdd']);
    }

    //修改功能不要
    // if(data.buttonId === 'Update'){
    //
    //   let list = this.dataSet1.filter((x:any)=>x.checked);
    //   if (list.length < 1) {
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '请选择数据后修改！'
    //     });
    //     this.destroyTplModal();
    //     return;
    //   }
    //   if (list.length > 1) {
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '请选择一条数据进行修改！'
    //     });
    //     this.destroyTplModal();
    //     return;
    //   }
    //   console.log(JSON.stringify(list[0]),'');
    //   this.router.navigate(['/system/stock/stockMoveAdd'],{queryParams:{status:'update'}});
    //   sessionStorage.setItem('stockMove',JSON.stringify(list[0]));
    // }

    if(data.buttonId === 'Delete'){

      if(this.updateData.length <1){
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        })
        return;
      }
      this.deleteVisible = true;
      this.modalTitle = '提示信息';
      this.deleteCon = "是否确定删除？";
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

  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let param = {stockMoveModels:[]};
      param.stockMoveModels = [...this.updateData];
      let url = stockUrl.deleteStockMoveAndDetail;
      this.http.post(url,param).then(
        (res: any) => {
          if (res.success) {
            this.nz.success('提示消息', '删除成功！');
            this.getList1({ page: 1, length: this.pageSize1 });
            this.deleteVisible = false;
          }
        }
      )
    }else{
      this.deleteVisible = false;
    }
  }

  // /**
  //  * 右grid控制
  //  * @param data
  //  */
  // gridLineFun(data:number){
  //   const w = data < 1? data : 0.96;
  //
  //   this.leftWidth = `${w*100}%`;
  //   this.lineWidth = `${w*100}%`;
  //   this.rightWidth = `${99 - w*100}%`;
  //   this.display = 'block';
  //
  // }
  // /**
  //  * 右grid
  //  */
  // rightShowFun(){
  //   this.rightShow = !this.rightShow;
  //   if(this.rightShow){
  //     this.leftWidth = '99%';
  //     this.lineWidth = '99%';
  //     this.rightWidth = '0%';
  //     this.display = 'none';
  //   }else{
  //     this.leftWidth = '49.5%';
  //     this.lineWidth = '49.5%';
  //     this.rightWidth = '49.5%';
  //     this.display = 'block';
  //   }
  // }
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

  //左右上下分栏
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

}
