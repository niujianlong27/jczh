import {Component, OnInit, ViewChild} from '@angular/core';
import {portUrl} from '../../../../common/model/portUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-portal-crane-collect',
  templateUrl: './portal-crane-collect.component.html',
  styleUrls: ['./portal-crane-collect.component.css']
})
export class PortalCraneCollectComponent implements OnInit {

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


  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '港口名称', eName: 'portName', type: 'text', validateCon: '请输入港口名称', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '门机编号', eName: 'portalCraneId', type: 'text', validateCon: '请输入门机编号', require: true, disabled: false,readOnly: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '门机启动时间', eName: 'doorStartTime', type: 'time', validateCon: '请输入门机启动时间', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '门机停止时间', eName: 'doorEndTime', type: 'time', validateCon: '请输入门机停止时间', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];

  constructor(private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService, private fb: FormBuilder, private info: UserinfoService) {
  }


  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});

    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
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
    let url = portUrl.selectCollectPortalLockout;
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
        this.btnAdd();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      default:
        break;
    }
  };


  /**
   * 弹窗确定
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].markAsDirty();
      this.modalValidateForm.controls[ i ].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }

    let lockoutEndTime = this.modalValidateForm.value.doorEndTime;
    let lockoutStartTime = this.modalValidateForm.value.doorStartTime;
    lockoutEndTime =lockoutEndTime instanceof Date ? Utils.dateFormat(lockoutEndTime,'yyyy-MM-dd HH:mm:ss') :lockoutEndTime || null;
    lockoutStartTime = lockoutStartTime instanceof Date ? Utils.dateFormat(lockoutStartTime,'yyyy-MM-dd HH:mm:ss') : lockoutStartTime || null;
    this.modalValidateForm.get('doorStartTime').setValue(lockoutStartTime);
    this.modalValidateForm.get('doorEndTime').setValue(lockoutEndTime);

    if ('add' === this.status) {
      this.addData(this.modalValidateForm.value);
    }
    if ('update' === this.status) {
      this.updateList(this.modalValidateForm.value);
    }

  }
  DhandleOk(){
    if ('delete' === this.status) {
      this.deleteData();
    }
  }

  /**
   * 新增
   * @param data
   */
  btnAdd() {
    this.modalValidateForm.reset();
    this.isVisible = true; //弹框
    this.tplTitle = '门机实绩采集 > 新增';
    this.modalListSearch({page: 1, length: this.modalPageSize});
    this.status = 'add'

  }

  addData(data: any) {
    this.status = "";
    let arr = this.modalUpdateData.map(item => {
      return {
           disNum : item.disNum
      }
    })
    data['boatWorkScheduleModelsList'] = [...arr];
    this.http.post(portUrl.insertCollectPortalcrane, data).then(res => {
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

  btnDelete() {
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
    let url = portUrl.deleteCollectPortalcrane;
    let param: any = {tCollectPortalcraneModelList: []};
    this.updateData.forEach(item => param.tCollectPortalcraneModelList.push({
      portalCraneId:item.portalCraneId
    }));
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempCondition);
        this.handleCancel();
      }else {
        this.nz.error('提示消息', '删除失败！');
        this.status = 'delete';
      }
    })
  }

  /**
   * 修改
   * @param data
   */
  btnUpdate() {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.isVisible = true; //弹框出现
    this.status = 'update';
    this.tplTitle = '门机实绩采集 > 修改';
    this.modalListSearch({page: 1, length: this.modalPageSize});
    this.modalValidateForm.patchValue(this.updateData[0]);

  }

  updateList(data: any) {
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = portUrl.updateCollectPortalcrane;
    data.rowid = this.rowid;
    params.data = data;
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
   * 查询
   * @param data
   */
  modalListSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.modalPageSize;
    this.getModalList(data);
  }


  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data: any): void {
    let url = portUrl.selectTBoatWorkScheduleModel;
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

}
