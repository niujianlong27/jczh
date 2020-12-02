
import { Component, OnInit, ViewChild } from '@angular/core';
import { portUrl } from '../../../../common/model/portUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { Utils } from '../../../../common/util/utils';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-ship-collect',
  templateUrl: './ship-collect.component.html',
  styleUrls: ['./ship-collect.component.css']
})
export class ShipCollectComponent implements OnInit {
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

  boatBatchNum: any;
  boatNum: any;
  showExplainFlag: boolean = false;
  boatInfo: any = {};

  //作业计划
  selectWorkSchedule: Array<any> = [];


  // 捆包相关信息
  childGridId = 'grid1';
  childData: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 100;
  childTotal: number = 0;
  tabArr: Array<any> = [
    { name: '作业计划捆包', gridId: 'grid1' },
    { name: 'PDA采集信息', gridId: 'grid2' }
  ];
  childIndex = 0;

  childDataTabOne: Array<any> = [];
  childDataTabTwo: Array<any> = [];

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '作业计划号', eName: 'disNum', type: 'text', validateCon: '请填写作业计划号', require: false, placeholder: '自动生成', readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '作业时间', eName: 'disDate', type: 'time', validateCon: '请填写作业时间', require: false,
      validators: {
        require: false
      }
    },
    // {
    //   name: '计划人', eName: 'dissUser', type: 'text', validateCon: '请填写计划人', require: false,
    //   validators: {
    //     require: false
    //   }
    // },
    {
      name: '船批', eName: 'boatBatchNum', type: 'inputModal', validateCon: '请选择船批', require: true,
      findset: { formId: 'boat_pop', name: '船批', parameter: 'boatBatchNum', parameterSend: 'boatNum', url: 'boat' },
      validate: { validateOpt: 'inpValue', validateCon: '请选择船批' },
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '计划到港时间', eName: 'expectPortTime', type: 'text', validateCon: '请填写计划到港时间', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '计划靠泊时间', eName: 'expectBerthTime', type: 'number', validateCon: '请填写计划靠泊时间', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '码头合并情况', eName: 'dockMerged', type: 'text', validateCon: '请填写码头合并情况', require: false, readOnly: true,
      validators: {
        require: false
      }
    },
    {
      name: '备注', eName: 'remark1', type: 'text', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];

  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private info: UserinfoService
  ) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });

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
    let url = portUrl.shipWorkPackList;
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
    debugger;
    switch (data.buttonId) {
      case 'ColletAudit':
        this.btnColletAudit(data);
        break;
      case 'ColletCancel':
        this.btnDelete(data);
        break;
      case 'Matching':
        this.btnUpdate(data);
        break;
      default:
        break;
    }
  };

  /**
   * 采集确认
   * @param data
   */
  btnColletAudit(data: any) {
    this.modalValidateForm.reset();

    this.tplTitle = '装船确认 > 新增';
    this.tipModalCreat();
    this.boatBatchNum = '';
    this.boatNum = '';

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data: any) {
    let url = portUrl.shipMentDelete;
    let param: any = { tBoatUpBillModelList: [] };
    this.updateData.forEach(item => param.tBoatUpBillModelList.push({ billNum: item.billNum, boatBatchNum: item.boatBatchNum }));
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '删除成功', { nzDuration: 3000 });
        this.listSearch(this.tempCondition);

      }
    })

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

    this.tplTitle = '装船确认 > 修改';
    this.tipModalCreat();
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.boatBatchNum = this.updateData[0].boatBatchNum;
    // this.boatNum = this.updateData[0].boatNum;
    this.getModalList({ page: 1, length: this.pageSize2, boatBatchNum: this.updateData[0].boatBatchNum });

  }
  /**
   * 获取弹窗列表数据
   * @param data
   */
  getModalList(data: any) {
    this.listLoading2 = true;
    let url = portUrl.shipMentModalList;
    let param: any = data;
    this.http.post(url, param).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
      }
    })
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
   * 弹窗列表当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getModalList({ page: page, length: this.pageSize2, boatBatchNum: this.boatInfo.boatBatchNum });
  }

  /**
   * 弹窗列表每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getModalList({ page: 1, length: this.pageSize2, boatBatchNum: this.boatInfo.boatBatchNum });
  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data: any) {
    console.log(data);
    this.boatInfo = data.selData ? data.selData[0] : {};

    console.log(new Date(this.boatInfo.expectPortTime), this.boatInfo.expectPortTime instanceof Date);

    // this.boatInfo.expectPortTime =  this.boatInfo.expectPortTime ? Utils.dateFormat(new Date(this.boatInfo.expectPortTime),'yyyy-MM-dd HH:mm:ss') : '';
    // this.boatInfo.expectBerthTime =  this.boatInfo.expectBerthTime ? Utils.dateFormat(new Date(this.boatInfo.expectBerthTime),'yyyy-MM-dd HH:mm:ss') : '';
    this.boatBatchNum = data.inpName || '';
    this.boatInfo.boatNum = this.boatInfo.boatNum || '';
    this.boatInfo.dockMerged = this.boatInfo.dockMerged || '';
    this.boatInfo.expectPortTime = this.boatInfo.expectPortTime || '';
    this.boatInfo.expectBerthTime = this.boatInfo.expectBerthTime || '';

    console.log(this.boatInfo)
    // this.boatInfo.expectBerthTime = this.boatInfo.expectBerthTime instanceof Date ? Utils.dateFormat(this.boatInfo.expectBerthTime) : '';
    this.modalValidateForm.patchValue(this.boatInfo);
    //船号存在时获取下方列表信息
    if (this.boatInfo.boatNum) {
      this.getModalList({ page: 1, length: this.pageSize2, boatBatchNum: this.boatInfo.boatBatchNum });
    } else {
      this.dataSet2 = [];
    }

  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();
    // this.boatBatchNum = this.boatNum = '';
  }

  /**
   * 弹窗确定
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let url = this.buttonId === 'Add' ? portUrl.shipMentAdd : portUrl.shipDispatchUpdate;
    let param = Utils.deepCopy(this.modalValidateForm.value);
    // param.expectPortTime = param.expectPortTime ? new Date(param.expectPortTime) : '';
    // param.expectBerthTime = param.expectBerthTime ? new Date(param.expectBerthTime) : '';
    param.disDate = param.disDate instanceof Date ? Utils.dateFormat(param.disDate, 'yyyy-MM-dd HH:mm:ss') : param.disDate || '';
    param.tBoatUpList = this.dataSet2 || [];
    param.boatBatchNum = this.boatBatchNum || '';
    param.remark = this.modalValidateForm.get('remark1').value || '';


    this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', tipInfo, { nzDuration: 3000 });
        this.listSearch(this.tempCondition);
        this.tplModal.destroy();
      }
    })
  }

  /**
   * 创建弹窗
   */
  tipModalCreat(): void {
    this.dataSet2 = [];
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '1250px',
      nzMaskClosable: true,
      nzClosable: true
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



  /**
   * // 运单司机/捆包tab页切换
   * @param tabInfo
   */
  tabChange(tabInfo: any) {
    setTimeout(() => {

      const tWaybills = [];
      for (let i = 0, len = this.selectWorkSchedule.length; i < len; i++) {
        tWaybills.push(
          {
            companyId: this.selectWorkSchedule[i].companyId,
            waybillNo: this.selectWorkSchedule[i].waybillNo
          }
        );
      }

      if (tabInfo.gridId === 'grid1') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryWorkSchedule(tWaybills);
        } else {
          this.childData = [];
        }
      } else if (tabInfo.gridId === 'grid2') {
        this.childGridId = tabInfo.gridId;
        if (tWaybills[0]) {
          this.queryTabTwo(tWaybills);
        } else {
          this.childData = [];
        }
      } else {
        this.msg.error(`未知Tab页信息！${JSON.stringify(tabInfo)}`);
      }
    }, 0);
  }


  //初始化查询两张表对比数据
  init() {
    this.queryTabTwo;
    this.queryWorkSchedule;


  }



  //查询作业计划
  queryWorkSchedule(tWaybills: Array<any>) {
    this.http.post(portUrl.insertCollectPortalcrane, {}).then(res => {
      if (res.success) {
        this.childDataTabOne = res.data.data;
      }
    }
    );
  }
  /**
 * 根据查询条件查询第二个tab
 */
  queryTabTwo(tWaybills: Array<any>) {
    this.http.post(portUrl.insertCollectPortalcrane, {}).then(res => {
      if (res.success) {
        this.childDataTabTwo = res.data.data;
      }
    }
    );
  }
}
