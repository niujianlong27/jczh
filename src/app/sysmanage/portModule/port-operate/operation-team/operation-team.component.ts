import {Component, OnInit, ViewChild} from '@angular/core';
import {portUrl} from '../../../../common/model/portUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-operation-team',
  templateUrl: './operation-team.component.html',
  styleUrls: ['./operation-team.component.css']
})
export class OperationTeamComponent implements OnInit {

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  dataSet1: any = [];  //主列表数据
  pageSize1: any = 30;  // 主列表条数
  totalPages1: any = 0;  //主列表页码
  listLoading1: boolean = false;  //加载状态
  status: string;//按钮状态
  rowid: string;
  confimCon: string; //提示框
  tempCondition: any = {};
  updateData: any = [];
  tplModal: NzModalRef;
  buttonId: any;
  //弹框相关
  tplTitle: string; //弹框标题
  modalDataSet: any = [];  //弹框数据
  modalUpdateData: any = []; //勾选弹框数据
  isVisible: boolean = false;  //显示弹框
  modalListLoading: boolean = false; //加载状态
  modalTotalPages: any = 0; //总条数
  modalPageSize: any = 30;
  modalTempSearchParam: any = {};

  newOperatiom : any = {};//新增数据

  modalValidateForm: FormGroup;//弹出层的from表单
  WorkScheduleList: Array<any> = [];
  WorkUserList:Array<any> = [];
  constructor(private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService, private fb: FormBuilder, private info: UserinfoService) {
  }


  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});

    this.modalValidateForm = this.fb.group({});
    
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.tempCondition = data;
    this.getList(data);
  };


  /**
   * 获取主列表数据
   * @param data
   */
  getList(data: any) {
    this.listLoading1 = true;
    let url = portUrl.selectOperationList;
    let param: any = data;
    this.http.post(url, param).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.updateData = [];

      }
    })
  };


  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    if (data.buttonId !== 'Add' && this.updateData.length < 1) {
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
      default:
        break;
    }
  };


  /**
   * 弹窗确定
   */
  handleOk() {
    // for (const i in this.modalValidateForm.controls) {
    //   this.modalValidateForm.controls[ i ].markAsDirty();
    //   this.modalValidateForm.controls[ i ].updateValueAndValidity();
    // }
    // if ('INVALID' === this.modalValidateForm.status) {
    //   return;
    // }

    // let lockoutEndTime = this.modalValidateForm.value.doorEndTime;
    // let lockoutStartTime = this.modalValidateForm.value.doorStartTime;
    // lockoutEndTime =lockoutEndTime instanceof Date ? Utils.dateFormat(lockoutEndTime,'yyyy-MM-dd HH:mm:ss') :lockoutEndTime || null;
    // lockoutStartTime = lockoutStartTime instanceof Date ? Utils.dateFormat(lockoutStartTime,'yyyy-MM-dd HH:mm:ss') : lockoutStartTime || null;
    // this.modalValidateForm.get('doorStartTime').setValue(lockoutStartTime);
    // this.modalValidateForm.get('doorEndTime').setValue(lockoutEndTime);

    if ('add' === this.status) {
      this.newOperatiom.tBoatWorkScheduleModelList = this.modalUpdateData;
      this.addData(this.newOperatiom);
    }
    if ('update' === this.status) {
      this.updateList(this.newOperatiom);
    }
    if ('delete' === this.status) {
      this.deleteData();
    }
  }

  /**
   * 新增
   * @param data
   */
  btnAdd(data: any) {
    this.modalValidateForm.reset();
    this.isVisible = true; //弹框
    this.tplTitle = '操作人员实绩采集 > 新增';
    this.status = 'add'
    this.modalListSearch;
    this.queryBoatWorkSchedule();
    //this.queryWorkUserList();
  }

  addData(data: any) {
    this.status = "";
    this.http.post(portUrl.insertOperation, data).then(res => {
        if (res.success) {
          this.listSearch(this.tempCondition);
          this.isVisible = false;
          this.nz.success('提示消息', '添加成功！');
        } else {
          this.nz.error('提示消息', '添加失败！');
          this.status = 'add';
        }
      }
    );
    

  }

  /**
   * 删除
   * @param data
   */

  btnDelete(data: any) {
    if (this.updateData.length < 1) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.confimCon = "确定删除该条记录？";
    this.tplModal = this.nm.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    });
    this.status = 'delete';
  }

  deleteData() {   // 删除数据
    this.status = "";
    let url = portUrl.deleteOperation;
    let param: any = {tCollectOperationteamModelList: []};
    this.updateData.forEach(item => param.tCollectOperationteamModelList.push({
      rowid:item.rowid
    }));
    
    param.tCollectOperationteamModelList = this.updateData;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempCondition);
        this.isVisible = false;
        this.destroyTplModal();
      }else {
        this.nz.error('提示消息', '修改失败！');
        this.status = 'delete';
      }
    })
  }

  /**
   * 修改
   * @param data
   */
  btnUpdate(data: any) {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    this.queryBoatWorkSchedule();
    this.isVisible = true; //弹框出现
    this.status = 'update';
    this.tplTitle = '操作人员实绩采集 > 修改';
    this.newOperatiom=this.updateData[0];
    this.modalListSearch(this.updateData[0]);
  }

  updateList(data: any) {
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = portUrl.updateCollectPortalcrane;
    data.rowid = this.rowid;
    params.data = data;
    console.log(params.data);
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempCondition);
          this.isVisible = false;
          this.nz.success('提示消息', '修改成功！');
        } else {
          this.nz.error('提示消息', '修改失败！');
          this.status = 'update';
        }
      }
    );
  }

  /**
   * 弹出层查询作业计划
   * @param data
   */
  modalListSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.modalPageSize;
    if(this.status === 'update'){
      data.disNum = this.newOperatiom.disNum;
    }
   
    this.getModalList(data);
  }


  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data: any): void {
    let url = portUrl.selectWorkScheduleforOperation;
    this.modalTempSearchParam = data;
    this.modalDataSet = [];
    this.modalListLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        this.modalDataSet = res.data.data && res.data.data.data || [];
        this.modalTotalPages = res.data.data && res.data.data.total;

      }
    })
  }

  /**
   * 主列表当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList({page: page, length: this.pageSize1});
  }

  /**
   * 主列表每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList({page: 1, length: this.pageSize1});
  }


  //弹窗取消
  nzOnCancel() {
    this.isVisible = false;
    this.modalDataSet = [];
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
   * 弹窗选中数据发生变化
   * @param data
   */
  modalUpdateDatafun(data: any) {
    this.modalUpdateData = data;
  }


  closeResult() { //重置
    this.modalValidateForm.reset();
  }

  handleCancel(): void {   //提示框取消
    this.tplModal.destroy();
  };

  queryBoatWorkSchedule(){
    this.http.post(portUrl.selectTeam, {}).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        console.log(res);
        this.WorkScheduleList = res.data.data.data;
        
      }
    });
    this.queryWorkUserList();
  }

  queryWorkUserList(){
    this.http.post(portUrl.selectTeamUser, {teamId:this.newOperatiom.teamId}).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        this.WorkUserList = res.data.data.data;
      }
    });
  }

}
