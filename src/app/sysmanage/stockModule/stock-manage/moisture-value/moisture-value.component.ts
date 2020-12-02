import {Component, OnInit, ViewChild} from '@angular/core';
import {stockUrl} from '../../../../common/model/stockUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-moisture-value',
  templateUrl: './moisture-value.component.html',
  styleUrls: ['./moisture-value.component.css']
})
export class MoistureValueComponent implements OnInit {

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
  isVisible: boolean = false;  //显示弹框
  isVisible1: boolean = false;
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '合同号', eName: 'contractNo', type: 'text', validateCon: '请填写合同号', require: false, readOnly: false,
      validators: {
        require: false
      }
    },
    {
      name: '测评内开始时间', eName: 'appraisalStartTime', type: 'time', validateCon: '请填写测评内开始时间', require: false,
      validators: {
        require: false
      }
    },


    {
      name: '测评内结束时间',
      eName: 'appraisalEndTime',
      type: 'time',
      validateCon: '请填写测评内结束时间',
      require: false,
      readOnly: false,
      validators: {
        require: false
      }
    },

    {
      name: '水分值', eName: 'moistureValue', type: 'text', validateCon: '请填写水分值', require: false, readOnly: false,
      validators: {
        require: false
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];

  constructor(private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService, private fb: FormBuilder, private info: UserinfoService) {
  }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.modalValidateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.listSearch({page: 1, length: this.pageSize1});
  }

  //查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.tempCondition = data;
    this.getList(data);
  };

  //获取主列表数据
  getList(data: any) {
    this.listLoading1 = true;
    let url = stockUrl.selectMoistureValue;
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

  //选中数据变化
  updateDataResult(data: any) {
    this.updateData = data;
  }

  //按钮点击
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

  // 弹窗确定
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }

    if ('add' === this.status) {
      this.addData();
    }
    if ('update' === this.status) {
      this.updateList();
    }

  }

  /**
   * 新增
   */
  btnAdd(data: any) {
    this.isVisible = true; //弹框
    this.tplTitle = '水分设置 > 新增';
    this.status = 'add'
  }

  addData() {
    let param = Utils.deepCopy(this.modalValidateForm.value);
    param.appraisalStartTime = param.appraisalStartTime && param.appraisalStartTime instanceof Date ? Utils.dateFormat(param.appraisalStartTime, 'yyyy-MM-dd HH:mm:ss') : param.appraisalStartTime || '';
    param.appraisalEndTime = param.appraisalEndTime && param.appraisalEndTime instanceof Date ? Utils.dateFormat(param.appraisalEndTime, 'yyyy-MM-dd HH:mm:ss') : param.appraisalEndTime || '';
    this.status = "";
    this.http.post(stockUrl.insertMoistureValue, param).then(res => {
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

  //删除
  btnDelete(data: any) {
    this.isVisible1 = true;
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
    let url = stockUrl.deleteMoistureValue;
    let param: any = {moistureValues: []};
    this.updateData.forEach(item => param.moistureValues.push({
      rowid: item.rowid
    }));
    param.moistureValues = this.updateData;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.destroyTplModal();
        this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
        this.listSearch(this.tempCondition);

      } else {
        this.nz.error('提示消息', '删除失败！');
        this.status = 'delete';
        this.isVisible1 = false;
      }
    });
  }

  //修改
  btnUpdate(data: any) {
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
    this.tplTitle = '水分设置 > 修改';
    this.modalValidateForm.patchValue(this.updateData[0]);

  }

  updateList() {
    this.status = "";
    const params = {url: '', data: {}, method: 'POST'};
    params.url = stockUrl.updateMoistureValue;
    params.data = Utils.deepCopy(this.modalValidateForm.value);
    params.data['appraisalStartTime'] = params.data['appraisalStartTime'] && params.data['appraisalStartTime'] instanceof Date ? Utils.dateFormat(params.data['appraisalStartTime'], 'yyyy-MM-dd HH:mm:ss') : params.data['appraisalStartTime'] || '';
    params.data['appraisalEndTime'] = params.data['appraisalEndTime'] && params.data['appraisalEndTime'] instanceof Date ? Utils.dateFormat(params.data['appraisalEndTime'], 'yyyy-MM-dd HH:mm:ss') : params.data['appraisalEndTime'] || '';
    params.data['rowid'] = this.updateData[0].rowid;
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

  //主列表当前页码变化
  getPageIndex1(page: any): void {
    this.getList({page: page, length: this.pageSize1});
  }

  //主列表每页展示条数变化
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList({page: 1, length: this.pageSize1});
  }


  //弹窗取消
  nzOnCancel() {
    this.isVisible = false;
    this.modalValidateForm.reset();
  }

  //提示弹窗自动销毁
  destroyTplModal(): void {
    this.tplModal.destroy();
  };


  handleCancel(): void {   //提示框取消
    this.tplModal.destroy();
  };


  closeResult() { //重置
    this.modalValidateForm.reset();
  }


}
