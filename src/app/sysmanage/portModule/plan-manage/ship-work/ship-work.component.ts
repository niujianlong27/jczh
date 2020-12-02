import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {portUrl} from '../../../../common/model/portUrl';
import {Utils} from '../../../../common/util/utils';

/**
 * Title: ship-work.component.ts
 * Description: 作业计划页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-ship-work',
  templateUrl: './ship-work.component.html',
  styleUrls: ['./ship-work.component.css']
})
export class ShipWorkComponent implements OnInit {
  dataSet1:any = [];
  pageSize1:any = 30;
  totalPages1:any = 0;
  listLoading1:boolean = false;

  dataSet2:any = [];
  pageSize2:any = 30;
  totalPages2:any = 0;
  listLoading2:boolean = false;

  tempCondition:any = {};
  updateData:any = [];
  tplModal:NzModalRef;
  buttonId:any;

  boatBatchNum:any;
  boatNum:any;
  showExplainFlag:boolean = false;
  boatInfo:any = {};

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '作业计划号', eName: 'disNum', type: 'text', validateCon: '请填写作业计划号', require: false,placeholder:'自动生成',readOnly:true,
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
      findset:{ formId: 'boat_pop', name: '船批', parameter: 'boatBatchNum',parameterSend:'boatNum',url:'boat' },
      validate:{validateOpt:'inpValue',validateCon:'请选择船批'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '船号', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false,readOnly:true,
      validators: {
        require: false
      }
    },
    {
      name: '计划到港时间', eName: 'expectPortTime', type: 'text', validateCon: '请填写计划到港时间', require: false,readOnly:true,
      validators: {
        require: false
      }
    },
    {
      name: '计划靠泊时间', eName: 'expectBerthTime', type: 'text', validateCon: '请填写计划靠泊时间', require: false,readOnly:true,
      validators: {
        require: false
      }
    },
    {
      name: '码头合并情况', eName: 'dockMerged', type: 'text', validateCon: '请填写码头合并情况', require: false,readOnly:true,
      validators: {
        require: false
      }
    },
    {
      name: '备注', eName: 'remark1', type: 'text', validateCon: '', require: false,
      validators: {
        require: false,
        pattern:false
      }
    }
  ];

  constructor(private http:HttpUtilService,private nz:NzNotificationService,private nm:NzModalService,private fb:FormBuilder,private info:UserinfoService) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page:1,length:this.pageSize1});

    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach( item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList(data:any){
    this.listLoading1 = true;
    let url = portUrl.shipWorkList;
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading1 = false;
      if(res.success){
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.updateData = [];
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
    this.getList(data);
  };

  /**
   * 选中数据变化
   * @param data
   */
  updateDataResult(data:any){
    this.updateData = data;
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
    this.modalValidateForm.reset();

    this.tplTitle = '作业计划 > 新增';
    this.tipModalCreat();
    this.boatBatchNum = '';
    this.boatNum = '';

  }

  /**
   * 删除
   * @param data
   */
  btnDelete(data:any){
    let url = portUrl.shipWorkDelete;
    let param:any = [];
    let status = false;
    this.updateData.forEach(elem => {
      if(elem.isSubmit == '20'){
        status = true;
      }
      param.push({ disNum:elem.disNum,boatBatchNum: elem.boatBatchNum});
    });
    if(status){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '存在已提交数据，不能删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.updateData.forEach(item => param.push({disNum:item.disNum}));
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
    console.log(this.updateData);
    if(this.updateData.length > 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.tplTitle = '作业计划 > 修改';
    this.tipModalCreat();
    this.modalValidateForm.patchValue(this.updateData[0]);
    this.boatBatchNum = this.updateData[0].boatBatchNum;
    // this.boatNum = this.updateData[0].boatNum;
    this.getModalList({ page:1,length:this.pageSize2,boatBatchNum:this.updateData[0].boatBatchNum });

  }

  /**
   * 提交作业
   * @param data
   */
  btnDeliver(data:any){
    //提交
    let url = portUrl.shipMentDeliver;
    let param = {boatWorkScheduleModelsList:[]};
    let status = false;
    this.updateData.forEach(elem => {
      if(elem.isSubmit == '20'){
        status = true;
      }
      param.boatWorkScheduleModelsList.push({ disNum:elem.disNum,boatBatchNum: elem.boatBatchNum});
    });
    if(status){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '存在已提交数据，不能重复提交'
      });
      this.destroyTplModal();
      return;
    }

    this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success','提示信息','提交成功',{nzDuration:3000});
          this.getList(this.tempCondition);
        }
      }
    )
  }

  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data:any){
    this.listLoading2 = true;
    let url = portUrl.shipWorkModalList;
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading2 = false;
      if(res.success){
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
   * 主列表当前展示条数变化
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
    this.getModalList({ page: page, length: this.pageSize2,boatBatchNum:this.boatInfo.boatBatchNum});
  }

  /**
   * 明细列表每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getModalList({ page: 1, length: this.pageSize2,boatBatchNum:this.boatInfo.boatBatchNum});
  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data:any){
    console.log(data);
    this.boatInfo = data.selData ? data.selData[0] : {};

    console.log(new Date(this.boatInfo.expectPortTime),this.boatInfo.expectPortTime instanceof Date);

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
    if(this.boatInfo.boatNum){
      this.getModalList({ page: 1, length: this.pageSize2,boatBatchNum:this.boatInfo.boatBatchNum});
    }else{
      this.dataSet2 = [];
    }

  }

  /**
   * 弹窗取消
   */
  handleCancel(){
    this.tplModal.destroy();
    // this.boatBatchNum = this.boatNum = '';
  }

  /**
   * 弹窗确定
   */
  handleOk(){
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].markAsDirty();
      this.modalValidateForm.controls[ i ].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let url = this.buttonId === 'Add' ? portUrl.shipWorkAdd : portUrl.shipWorkUpdate;
    let param = Utils.deepCopy(this.modalValidateForm.value);
    // param.expectPortTime = param.expectPortTime ? new Date(param.expectPortTime) : '';
    // param.expectBerthTime = param.expectBerthTime ? new Date(param.expectBerthTime) : '';
    param.disDate = param.disDate instanceof Date ? Utils.dateFormat(param.disDate,'yyyy-MM-dd HH:mm:ss') : param.disDate || '';
    param.boatStowageList = this.dataSet2 || [];
    param.boatBatchNum = this.boatBatchNum || '';
    param.remark = this.modalValidateForm.get('remark1').value || '';

    this.buttonId === 'Update' && (param.rowid = this.updateData[0].rowid || '');
    let tipInfo = this.buttonId === 'Add' ? '新增成功' : '修改成功';
    this.http.post(url,param).then((res:any) => {
      if(res.success){
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

}
