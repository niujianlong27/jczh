import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {portUrl} from '../../../../common/model/portUrl';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

/**
 * Title: ship-plan.component.ts
 * Description: 船舶计划页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-ship-plan',
  templateUrl: './ship-plan.component.html',
  styleUrls: ['./ship-plan.component.css']
})
export class ShipPlanComponent implements OnInit {
  dataSet1: any = [];
  pageSize1: any = 30;
  totalPages1: any = 0;
  listLoading1: boolean = false;

  dataSet2: any = [];
  pageSize2: any = 30;
  totalPages2: any = 0;
  listLoading2: boolean = false;

  tempCondition: any = {};
  updateData: any = [];
  tplModal: NzModalRef;
  buttonId: any;

  validateFormHidden: boolean = true;

  modalFormVisible = false; // 表单弹窗
  modalTitle: string = '船舶计划 > 新增';
  modalValidateForm: FormGroup;
  validateForm: FormGroup;


  modalFormData: Array<any> = [
    {
      name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '船舶公司', eName: 'shipCompany', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '船型', eName: 'shipType', type: 'text', validateCon: '请填写船舶类型', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '配载流向', eName: 'loadingFlow', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '载重量', eName: 'load', type: 'number', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '规格', eName: 'spe', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '船长', eName: 'captain', type: 'number', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '联系电话', eName: 'phoneNumber', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '预计到港时间', eName: 'expectPortTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '预计靠泊时间', eName: 'expectBerthTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '开始作业时间', eName: 'startHomeTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '结束作业时间', eName: 'endHomeTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '实际靠港时间', eName: 'actualPortTime', type: 'time', validateCon: '请填写船舶公司', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    // {
    //   name: '实际靠泊时间', eName: 'actualBerchTime', type: 'time', validateCon: '请填写船舶公司', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '预计离泊时间', eName: 'expectNavigationTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '预计离港时间', eName: 'expectToportTime', type: 'time', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '实际离泊时间', eName: 'actualToberchTime', type: 'time', validateCon: '请填写船舶公司', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    // {
    //   name: '实际离港时间', eName: 'actualToportTime', type: 'time', validateCon: '请填写船舶公司', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '码头合并情况', eName: 'dockMerged', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '停靠泊位', eName: 'dockBerth', type: 'text', validateCon: '请填写船舶公司', require: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '停靠泊位', eName: 'dockBerch', type: 'text', validateCon: '请填写船舶公司', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请填写备注', require: false,
      validators: {
        require: false
      }
    }
  ];

  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private fb: FormBuilder,
              private info: UserinfoService
  ) {
  }

  /***
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});

    this.validateForm = new FormGroup({
      chooseTime: new FormControl('', [Validators.required])
    });

    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });


    // let btnid = new EventEmitter<any> ();
    //
    // setInterval(()=>{
    //   btnid.emit('111');
    // },2000);
    //
    // btnid.subscribe((id)=>{
    //   console.log(id);
    // });

  };

  /**
   * 获取主列表数据
   * @param data
   */
  getList(data: any) {
    this.listLoading1 = true;
    let url = portUrl.shipPlanGetList;
    let param: any = data;
    this.http.post(url, param).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.updateData = [];
      }
    });
  };

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
      case 'Berth':
      case 'navigation':
      case 'Port':
      case 'toport':
        this.validateForm.reset();
        this.validateFormHidden = false;
        break;
      default:
        break;
    }
  };

  /**
   * 确定
   */
  submit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'VALID') {
      let url = portUrl.shipPlanOther;
      let param: any = [];

      let tempObj: any = {
        Berth: {status: '30', sendParam: 'actualBerthTime'},
        navigation: {status: '40', sendParam: 'actualToberthTime'},
        Port: {status: '20', sendParam: 'actualPortTime'},
        toport: {status: '50', sendParam: 'actualToportTime'},
      };

      this.updateData.forEach((item) => {
        let obj: any = {};
        obj.status = tempObj[this.buttonId].status;
        let chooseTime = this.validateForm.get('chooseTime').value;
        obj[tempObj[this.buttonId].sendParam] = chooseTime && chooseTime instanceof Date ? Utils.dateFormat(chooseTime, 'yyyy-MM-dd HH:mm:ss') : chooseTime || '';
        obj.boatBatchNum = item.boatBatchNum;
        obj.boatNum = item.boatNum;
        obj.requestUserId = this.info.APPINFO.USER.userId;
        obj.requestCompanyId = this.info.APPINFO.USER.companyId;
        param.push(obj);
      });

      // switch (this.buttonId) {
      //   case 'Berth':
      //     this.updateData.forEach((item) => {
      //       let obj:any = {};
      //       obj.status = '靠泊';
      //       obj.actualBerthTime = this.validateForm.get('chooseTime').value;
      //       obj.boatBatchNum = item.boatBatchNum;
      //       param.push(obj);
      //     });
      //     break;
      //   case 'navigation':
      //     this.updateData.forEach((item) => {
      //       let obj:any = {};
      //       obj.status = '离泊';
      //       obj.actualToberthTime = this.validateForm.get('chooseTime').value;
      //       obj.boatBatchNum = item.boatBatchNum;
      //       param.push(obj);
      //     });
      //     break;
      //   case 'Port':
      //     this.updateData.forEach((item) => {
      //       let obj:any = {};
      //       obj.status = '到港';
      //       obj.actualPortTime = this.validateForm.get('chooseTime').value;
      //       obj.boatBatchNum = item.boatBatchNum;
      //       param.push(obj);
      //     });
      //     break;
      //   case 'toport':
      //     this.updateData.forEach((item) => {
      //       let obj:any = {};
      //       obj.status = '离港';
      //       obj.expectToportTime = this.validateForm.get('chooseTime').value;
      //       obj.boatBatchNum = item.boatBatchNum;
      //       param.push(obj);
      //     });
      //     break;
      //   default:
      //     break;
      // }

      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          // this.nz.create('success', '提示信息', tempObj[this.buttonId].status, { nzDuration: 3000 });
          this.nz.create('success', '提示信息', '状态更新成功', {nzDuration: 3000});
          this.listSearch(this.tempCondition);
          this.validateFormHidden = true;
        }
      });
    }
  }

  /**
   * 新增
   * @param data
   */
  btnAdd(data: any) {
    this.modalValidateForm.reset();
    console.log(this.modalValidateForm.value);

    this.modalTitle = '船舶计划 > 新增';
    this.modalFormVisible = true;
  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data: any) {
    let url = portUrl.shipPlanDelete;
    let param: any = [];
    this.updateData.forEach(item => param.push({
      boatBatchNum: item.boatBatchNum,
    }));
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempCondition);

      }
    });

  }

  /**
   * 修改
   * @param data
   */
  btnUpdate(data: any) {
    console.log(this.updateData);
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '船舶计划 > 修改';
    this.modalFormVisible = true;
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.getModalList({boatBatchNum: this.updateData[0].boatBatchNum});

  }

  /**
   * 获取弹窗列表数据
   * @param data
   */
  getModalList(data: any) {
    this.listLoading2 = true;
    let url = portUrl.shipPlanGetModalList;
    let param: any = data;
    this.http.post(url, param).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
      }
    });
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

  /**
   * 弹窗列表当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getModalList({page: page, length: this.pageSize2, boatBatchNum: this.updateData[0].boatBatchNum});
  }

  /**
   * 弹窗列表每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getModalList({page: 1, length: this.pageSize2, boatBatchNum: this.updateData[0].boatBatchNum});
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let url = this.buttonId === 'Add' ? portUrl.shipPlanAdd : portUrl.shipPlanUpdate;
    let param = Utils.deepCopy(this.modalValidateForm.value);
    Object.keys(param).forEach(item => {
      param[item] = param[item] && param[item] instanceof Date ? Utils.dateFormat(param[item], 'yyyy-MM-dd HH:mm:ss') : param[item] || '';
    });
    this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', tipInfo, {nzDuration: 3000});
        this.listSearch(this.tempCondition);
        this.modalFormVisible = false;
      }
    });
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
