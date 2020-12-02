import { Component, OnInit } from '@angular/core';
import { stockUrl } from "../../../../common/model/stockUrl";
import { portUrl } from "../../../../common/model/portUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
@Component({
  selector: 'app-transfer-task',
  templateUrl: './transfer-task.component.html',
  styleUrls: ['./transfer-task.component.css']
})
export class TransferTaskComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages1: Number = 1;
  totalPages2: Number = 1;
  pageSize1:Number = 30;
  pageSize2:Number = 30;
  selectedList1: any = [];
  selectedList2: any = [];
  stockMoveDetailModel:any;
  moveWsId:any;
  updateData:any = [];
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
    let url = portUrl.selectLoadscheduleready;
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
   * 主列表当前页码改变
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  /**
   * 主列表每页展示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,moveWsId:this.moveWsId});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,moveWsId:this.moveWsId });
  }

  /**
   * 获取明细列表
   * @param data
   */
  getList2(data: any){
    let url = portUrl.selectLoadschedulereadyDetail;
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
      this.router.navigate(['/system/portOperate/transferTaskAdd']);
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
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let url = portUrl.deleteLoadschedulereadyAndDetail;
      this.http.post(url, this.updateData).then(
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
  

}
