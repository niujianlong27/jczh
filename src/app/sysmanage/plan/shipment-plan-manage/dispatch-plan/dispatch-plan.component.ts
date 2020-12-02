import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {format} from 'date-fns';
import {planUrl} from "../../../../common/model/planUrls";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dispatch-plan',
  templateUrl: './dispatch-plan.component.html',
  styleUrls: ['./dispatch-plan.component.css']
})
export class DispatchPlanComponent implements OnInit {

  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

  deleteVisible: boolean = false;
  modalTitle: string;
  deleteCon: string;
  searchData: any;//查询条件缓存
  pageSize: number = 30;//条数
  pageSize2: number = 30;//条数
  totalPage: number;//数据总条数
  totalPages2: number;
  listLoading: boolean = false;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;
  dataSet2:Array<any> = [];
  listLoading2:boolean = false;

  constructor(private http: HttpUtilService,
              private fb: FormBuilder,
              private nzMess: NzNotificationService,
              private router: Router,
              private nz: NzModalService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    sessionStorage.setItem("dispatchPlan", ""); //新增或修改的明细重置
    sessionStorage.setItem("dispatchPlanTopInfo", ""); //修改时的缓存数据重置
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("detailList", "[]");  //明细缓存
  }

  /**
   * 查询
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询
   * @param param
   */
  private getListSearch(param: any) {
    this.listLoading = true;
    const url = planUrl.vehiclegetPage;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.selectedData = [];
          this.dataSet = res.data.data.data;
          this.total = res.data.data.total;
        }
      }
    );

  }

  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case "Add" :
        this.router.navigate(['/system/plan/shipmentPlanManage/dispatchPlanAdd']);
        break;
      case "Update":
        this.update();
        break;
      case  "Delete":
        this.delete();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }

  update() {
    if ( this.selectedData.length ==0 ||this.selectedData.length > 1) {
      this.tplModal = this.nz.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }
    // 修改时获取列表明细信息存入session后带入修改页
    // this.selectedData[0]['status'] = 'Update';
    this.getList2({page: 1, length: this.pageSize2},true);
  }

  /**
   * 获取明细数据
   * @param data
   * @param saveData
   */
  getList2(data: any, saveData?: any): void {
    let url = planUrl.vehiclePackgetPage;
    data.vehicleScheduleMains = [];
    this.selectedData.map(item =>{
      data.vehicleScheduleMains.push({scheduleNum:item.scheduleNum})
    })
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
        if (saveData) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          this.router.navigate(['/system/plan/shipmentPlanManage/dispatchPlanAdd'],{queryParams:{status:'update'}});
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          sessionStorage.setItem('dispatchPlanTopInfo', JSON.stringify(this.selectedData[0])); //选中的数据带入顶部维护信息显示
        }
      }
    })
  }

  delete() {
    if ( this.selectedData.length == 0 ) {
      this.tplModal = this.nz.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后进行操作！'
      });
      return;
    }
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定删除？";
  }


  selectData(data: any) { // 主列表数据多选框选择
    this.selectedData = data;
    this.getList2({page: 1, length: this.pageSize2})
  }

  inpEmit(data: any) {
    this.modalValidateForm.get('boatBatchNum').setValue(data.inpValue);
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2});
  }


  /**
   * 提示框关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let deleteUrl = planUrl.vehicledelete;
      let deleteParam = {vehicleScheduleMains:[]};
      this.selectedData.forEach(item => {
        deleteParam.vehicleScheduleMains.push({rowid:item.rowid})
      });
      this.http.post(deleteUrl, deleteParam).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
            this.nzMess.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.getListSearch(this.searchData);
            this.getList2({page: 1, length: this.pageSize2});
          }
        }
      )
    } else {
      this.deleteVisible = false;
    }
  }

  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
  }
}
