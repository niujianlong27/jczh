import {Component, ElementRef, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {portUrl} from '../../../../common/model/portUrl';
import {Utils} from '../../../../common/util/utils';

import {Router} from '@angular/router'

/**
 * Title: ship-demand.component.ts
 * Description: 船舶需求页面
 * Created: pengzitong 2019/1/24
 * Modified:  赵泽平 2019/1/25
 */
@Component({
  selector: 'app-ship-demand',
  templateUrl: './ship-demand.component.html',
  styleUrls: ['./ship-demand.component.css']
})
export class ShipDemandComponent implements OnInit {
  dataSet1:any = [];
  pageSize1:any = 30;
  totalPages1:any = 0;
  listLoading1:boolean = false;

  dataSet2:any = [];
  pageSize2:any = 30;
  totalPages2:any = 0;
  listLoading2:boolean = false;

  demandNo:any;//列表点击时保存的当前点击数据的需求编号
  tempCondition:any = {};
  updateData:any = [];
  tplModal:NzModalRef;
  buttonId:any;

  // modalFormVisible = false; // 表单弹窗
  // modalTitle: string = '船舶需求 > 新增';
  // modalValidateForm: FormGroup;

  // modalFormData: Array<any> = [
  //   {
  //     name: '目的港', eName: 'arrivalProt', type: 'text', validateCon: '请填写目的港', require: true,
  //     validators: {
  //       require: true
  //     }
  //   },
  //   {
  //     name: '品种', eName: 'goodKind', type: 'text', validateCon: '请填写品种', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '规格', eName: 'spe', type: 'text', validateCon: '请填写规格', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '重量', eName: 'weight', type: 'number', validateCon: '请填写重量', require: false,
  //     validators: {
  //       require: false
  //     }
  //   },
  //   {
  //     name: '备注', eName: 'remark', type: 'text', validateCon: '请填写备注', require: false,
  //     validators: {
  //       require: false
  //     }
  //   }
  // ];

  constructor(private router:Router,private http:HttpUtilService,private nz:NzNotificationService,private nm:NzModalService,private fb:FormBuilder) { }

  /**
   * 初始化
   */
  ngOnInit() {
    
    // this.modalValidateForm = this.fb.group({});
    // this.modalFormData.forEach( item => {
      //   let validatorOpt = [];
      //   item.validators.require && validatorOpt.push(Validators.required);
      //   item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      //   this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
      // });
      sessionStorage.setItem('shipDemand',JSON.stringify({status:'Add'}));
      this.listSearch({page:1,length:this.pageSize1});
      
    };

  /**
   * 获取列表数据
    * @param data
   */
  getList(data:any){
    this.listLoading1 = true;
    let url = portUrl.shipDemandGetList;
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading1 = false;
      if(res.success){
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  };

  /**
   * 获取明细列表
   * @param data
   */
  getList2(data: any){
    // let url = stockUrl.selectStockMoveDetail;
    // this.dataSet2 = [];
    // this.listLoading2 = true;
    // this.http.post(url, data).then((res: any) => {
    //   this.listLoading2 = false;
    //   if (res.success) {
    //
    //     this.dataSet2 = res.data.data && res.data.data.data || [];
    //     this.totalPages2 = res.data.data && res.data.data.total || 0;
    //   }
    // })
    this.listLoading2 = true;
    let url = portUrl.shipDemandDetailGetList;
    let param:any = data;
    this.dataSet2 = [];
    this.http.post(url,param).then((res:any) => {
      this.listLoading2 = false;
      if(res.success){
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
      
  }})}

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.tempCondition = data;
    this.getList(data);
  };

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'ADD':
        this.btnAdd(data);
        break;
      case 'Delete':
        this.btnDelete(data);
        break;
      case 'Update':
        this.btnUpdate(data);
        break;
      default:
        break;
    }
  };

  /**
   * 选中数据变化
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
    this.demandNo = data.demandNo;
    this.getList2({ page: 1, length: this.pageSize2,demandId:this.demandNo});
    console.log(this.demandNo);
  }

  /**
   * 新增
   * @param data
   */
  btnAdd(data:any) {
    // this.modalValidateForm.reset();
    // console.log(this.modalValidateForm.value);

    // this.modalTitle = '船舶需求 > 新增';
    // this.modalFormVisible = true;
    this.router.navigate(['/system/planManage/shipDemandAdd']);

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data:any){
    if(this.updateData.length < 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    let url = portUrl.shipDemandDelete;
    let param:any = [];
    this.updateData.forEach(item => param.push({rowid:item.rowid}));
    this.updateData.forEach(item => param.push({demandNo:item.demandNo}));
    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success', '提示信息', '删除成功', { nzDuration: 3000 });
        this.listSearch(this.tempCondition);

      }
    })

  }

  /**
   * 修改
   * @param data
   */
  btnUpdate(data:any){
    // console.log(this.updateData);
    if(this.updateData.length != 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    this.router.navigate(['/system/planManage/shipDemandAdd']);
    this.updateData[0].status = 'Update';
    sessionStorage.setItem('shipDemand',JSON.stringify(this.updateData[0],this.demandNo));
    console.log(this.updateData[0]);

    // this.modalTitle = '船舶需求 > 修改';
    // this.modalFormVisible = true;
    // this.modalValidateForm.patchValue(this.updateData[0]);

  }


  /**
   * 主列表当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList({ page: page, length: this.pageSize1 });
  }

  /**
   * 主列表每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList({ page: 1, length: this.pageSize1 });
  }

  /**
   * 明细列表当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,demandId:this.demandNo});
  }

  /**
   * 明细列表每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,demandId:this.demandNo});
  }


  // /**
  //  * 弹窗取消
  //  */
  // handleCancel(){
  //   this.modalFormVisible = false;
  // }

  // /**
  //  * 弹窗确认
  //  */
  // handleOk(){
  //   for (const i in this.modalValidateForm.controls) {
  //     this.modalValidateForm.controls[ i ].markAsDirty();
  //     this.modalValidateForm.controls[ i ].updateValueAndValidity();
  //   }
  //   if ('INVALID' === this.modalValidateForm.status) {
  //     return;
  //   }
  //   let url = this.buttonId === 'ADD' ? portUrl.shipDemandAdd : portUrl.shipDemandUpdate;
  //   let param = Utils.deepCopy(this.modalValidateForm.value);
  //   this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
  //   let tipInfo = this.buttonId === 'ADD' ? '新增成功' : '修改成功';
  //   this.http.post(url,param).then((res:any) => {
  //     if(res.success){
  //       this.nz.create('success', '提示信息', tipInfo, { nzDuration: 3000 });
  //       this.listSearch(this.tempCondition);
  //       this.modalFormVisible = false;
  //     }
  //   })
  // }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

}
