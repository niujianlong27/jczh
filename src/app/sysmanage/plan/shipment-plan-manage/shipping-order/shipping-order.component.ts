import { Component, OnInit } from '@angular/core';
import {portUrl} from '../../../../common/model/portUrl';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {stockUrl} from '../../../../common/model/stockUrl';

@Component({
  selector: 'app-shipping-order',
  templateUrl: './shipping-order.component.html',
  styleUrls: ['./shipping-order.component.css']
})
export class ShippingOrderComponent implements OnInit {

  dataSet1:any = [];
  pageSize1:any = 30;
  totalPages1:any = 0;
  listLoading1:boolean = false;

  dataSet2: any = [];
  pageSize2:Number = 30;
  totalPages2: Number = 0;
  listLoading2: boolean = false;

  scheduleNum:any;
  tempCondition:any = {};
  updateData:any = [];
  tplModal:NzModalRef;
  buttonId:any;

  constructor(private http:HttpUtilService,private nz:NzNotificationService,private nm:NzModalService,private fb:FormBuilder,private router:Router) { }

  /**
   * 初始化
   */
  ngOnInit() {
    sessionStorage.setItem("stockOut","");
    sessionStorage.setItem("shipAllocateTopInfo",JSON.stringify({status:'Add'}));
    sessionStorage.setItem("detailList","[]");
    this.listSearch({page:1,length:this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data:any){
    this.listLoading1 = true;
    let url = portUrl.shipAllocateGetList;
    this.dataSet1 = [];
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading1 = false;
      if(res.success){
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    })
  };

  /**
   * 获取明细列表数据
   * @param data
   * @param saveData
   */
  getList2(data:any,saveData?:any){
    this.listLoading2 = true;
    let url = portUrl.shipAllocateGetList2;
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading2 = false;
      if(res.success){
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        //如果是修改的时候，查询明细带入session
        if(saveData){
          sessionStorage.setItem('detailList',JSON.stringify(this.dataSet2));
          this.router.navigate(['/system/planManage/shipAllocateInfo']);
          saveData.status = 'Update';
          sessionStorage.setItem('shipAllocateTopInfo',JSON.stringify(saveData));
        }
      }
    })
  };

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.tempCondition = data;
    this.getList1(data);
  };

  /**
   * 选中数据发生变化
   * @param data
   */
  updateDataResult(data:any){
    this.updateData = data;
  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data:any){
    this.scheduleNum = data.scheduleNum;
    this.getList2({ page: 1, length: this.pageSize2,scheduleNum:this.scheduleNum});
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data:any){
    if(data.buttonId !== 'Add' && this.updateData.length < 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd(data);
        break;
      case 'Delete':
        this.btnDelete(data);
        break;
      case 'Update':
        this.btnUpdate(data);
        break;
      case 'Deliver':
        this.btnDeliver(data);
        break;
      default:
        break;
    }
  };

  /**
   * 新增
   * @param data
   */
  btnAdd(data:any) {
    this.router.navigate(['/system/planManage/shipAllocateInfo']);
  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data:any) {
    let url = portUrl.shipAllocateDelete;
    let param = [];
    this.updateData.forEach(elem => {
      param.push({ scheduleNum: elem.scheduleNum})
    });
    this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success','提示信息','删除成功',{nzDuration:3000});
          this.getList1(this.tempCondition);
        }
      }
    )
  }

  /**
   * 修改
   * @param data
   */
  btnUpdate(data:any) {
    if(this.updateData.length > 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    };

    // 修改时获取列表明细信息存入session后带入修改页
    this.getList2({ page: 1, length: this.pageSize2,scheduleNum:this.updateData[0].scheduleNum},this.updateData[0]);
    // this.router.navigate(['/system/planManage/shipAllocateInfo'],{queryParams:{status:'update'}});
  }

  /**
   * 下发作业
   * @param data
   */
  btnDeliver(data:any) {
    //下发
    let url = portUrl.shipAllocateDeliver;
    // let param = [];
    // this.updateData.forEach(elem => {
    //   param.push({ scheduleNum: elem.scheduleNum})
    // });
    this.http.post(url, this.updateData).then((res: any) => {
        if (res.success) {
          this.nz.create('success','提示信息','下发成功',{nzDuration:3000});
          this.getList1(this.tempCondition);
        }
      }
    )
  };


  userColumnsEmit(data:any){
    console.log(data);
  }

  /**
   * 主列表当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  /**
   *主列表每页展示条数改变
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

  /**
   * 明细列表当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,scheduleNum:this.scheduleNum});
  }

  /**
   * 明细列表每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,scheduleNum:this.scheduleNum});
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };
}

