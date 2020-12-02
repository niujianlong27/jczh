import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {HttpUtilService} from '../../../common/services/http-util.service';
import { messageUrl } from '../../../common/model/messageUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';



@Component({
  selector: 'app-message-no-read',
  templateUrl: './message-no-read.component.html',
  styleUrls: ['./message-no-read.component.css']
})
export class MessageNoReadComponent implements OnInit {
  modalFormData: Array<any> = [
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr: '[a-zA-Z0-9_]*',
        patternErr: '界面ID格式不正确，只能填数字、字母或下划线'
      }
    },
    {
      name: '界面名称', eName: 'formName', type: 'text', validateCon: '请输入界面名称', require: true,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[\u4e00-\u9fa5]+[0-9]*',
        patternErr: '界面名称格式不正确，只能填中文汉字或汉字加数字'
      }
    },
    {
      name: '界面地址', eName: 'formUrl', type: 'text', validateCon: '请输入界面地址', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '界面地址2', eName: 'cformUrl', type: 'text', validateCon: '请输入界面地址2', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '界面说明', eName: 'formDesc', type: 'text', require: true, validateCon: '请输入界面说明',
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '界面备注', eName: 'remark', type: 'text', require: false,
      validators: {
        require: false,
        pattern: false
      }
    },
  ];
  // modalFormVisible = false; // 表单弹窗
  // modalValidateForm: FormGroup;
  deleteVisible = false; // 确认弹窗
  modalTitle: string; // 删除弹窗标题
  deleteCon: string; // 删除弹窗文字内容
  dataSet: Array<any>;
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数
  listLoading = true; // 表格是否在加载中
  selectedData: Array<any> = [];
  searchData: any;  // 存储查询的数据
  private status: string; // add添加，update更新
  private rowid: number;
  private tplModal: NzModalRef;

  // 记录rowid;

  constructor(
    private httpUtilService: HttpUtilService,
    private fb: FormBuilder,
    private nm: NzModalService,
    private nn: NzNotificationService
    ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    // this.modalValidateForm = this.fb.group({});
    // this.modalFormData = this.modalFormData ? this.modalFormData : [];
    // for (let i = 0; i < this.modalFormData.length; i++) {
    //   const validatorOrOpts: Array<any> = [];
    //   if (this.modalFormData[i].validators.require) {
    //     validatorOrOpts.push(Validators.required);
    //   }
    //   if (this.modalFormData[i].validators.pattern) {
    //     validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
    //   }
    //   this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
    //     '', validatorOrOpts
    //   ));
    // }
  }

  listSearch(param: any) { // 列表查询
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param; // 查询的数据存储
    this.listLoading = true;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = messageUrl.messageListGet;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 全部已读/标记已读
  readBtn(event: any): void {
    const btnId = event.type.buttonId;
    if (event.data.length < 1 && (btnId === 'Read')) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后标记已读！'
      });
      this.destroyTplModal();
      return;
    }
    // 生成新的存储空间，防止影响searchData的存储空间
    const params = JSON.parse(JSON.stringify(this.searchData));
    switch (btnId) {
      case 'Read':
        params.tMessageUserModels = [];
        event.data.forEach(element => {
          params.tMessageUserModels.push({'messageContentId': element.messageContentId});
        });
        this.messageBeReaded(params);
        break;
      case 'AllRead':
        params.isAll = 'All';
        this.messageBeReaded(params);
    }
  }

  messageBeReaded(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = messageUrl.messageRead;
    params.data = data;

    this.httpUtilService.request(params).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '消息标记已读成功！');
        } else {
          this.nn.error('提示消息', '消息标记已读失败！');
        }
      }
    );
  }


  btnDelete(data: any): void { // 删除
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.selectedData = data.data;
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.status = 'delete';
  }



  // 删除数据
  // deleteData() {
  //   const params = {url: '', data: {tMessageUserModels: []}, method: 'POST'};
  //   params.url = messageUrl.messageDel;
  //   this.selectedData.forEach(element => {
  //     params.data.tMessageUserModels.push({'messageContentId': element.messageContentId});
  //   });
  //   this.httpUtilService.request(params).then(
  //     (res: any) => {
  //       if (res.success) {
  //         this.selectedData = [];
  //         this.listSearch({});
  //         this.nn.success('提示消息', '删除成功！');
  //       } else {
  //         this.nn.error('提示消息', '删除失败！');
  //       }

  //     }
  //   );
  // }

  // 删除框确认
  // modalConfirmResult(data: any) {
  //   if ('ok' === data.type) {
  //     if ('delete' === this.status) {
  //       this.deleteData();
  //       this.status = '';
  //     }
  //   }
  //   this.deleteVisible = false;
  // }

  // handleOk(): void {
  //   for (const i in this.modalValidateForm.controls) {
  //     this.modalValidateForm.controls[i].markAsDirty();
  //     this.modalValidateForm.controls[i].updateValueAndValidity();
  //   }
  //   if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
  //     this.addData(this.modalValidateForm.value);
  //   }
  //   if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
  //     this.updateData(this.modalValidateForm.value);
  //   }

  // }

  // handleCancel(): void {
  //   this.modalFormVisible = false;
  // }

  // closeResult(): void {
  //   this.modalValidateForm.reset();
  // }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

}
