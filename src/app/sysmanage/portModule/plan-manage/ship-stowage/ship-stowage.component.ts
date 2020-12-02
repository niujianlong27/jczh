import { Component, OnInit } from '@angular/core';
import {portUrl} from '../../../../common/model/portUrl';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';

/**
 * Title: ship-stowage.component.ts
 * Description: 船舶配载页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-ship-stowage',
  templateUrl: './ship-stowage.component.html',
  styleUrls: ['./ship-stowage.component.css']
})
export class ShipStowageComponent implements OnInit {
  dataSet1:any = [];
  pageSize1:any = 30;
  totalPages1:any = 0;
  listLoading1:boolean = false;

  tempCondition:any = {};
  updateData:any = [];
  tplModal:NzModalRef;
  buttonId:any;

  boatBatchNum:any;
  boatNum:any;
  showExplainFlag:boolean = false;
  boatInfo:any = {};
  status:any = '';

  validateForm: FormGroup;
  formData:any = [
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
    }
  ]

  constructor(private http:HttpUtilService,private nz:NzNotificationService,private nm:NzModalService,private fb:FormBuilder,private info:UserinfoService) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({page:1,length:this.pageSize1});


    this.validateForm = this.fb.group({});
    this.formData.forEach( item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList(data:any){
    this.listLoading1 = true;
    let url = portUrl.shipStowageList;
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
    console.log(data,111);
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
    // if(data.buttonId !== 'Add' && this.updateData.length < 1){
    //   this.tplModal = this.nm.warning({
    //     nzTitle: '提示信息',
    //     nzContent: '请选择数据后操作'
    //   });
    //   this.destroyTplModal();
    //   return;
    // }
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Save':
        this.btnSave();
        break;
      // case 'Delete':
      //   this.btnDelete(data);
      //   break;


      default:
        break;
    }
  };

  /**
   * 保存
   */
  btnSave(){
    if(this.status != 'VALID'){
      this.showExplainFlag = true;
      return;
    }
    if(this.updateData.length < 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作'
      });
      this.destroyTplModal();
      return;
    }

    let url = portUrl.shipStowageSave;
    let param:any = Utils.deepCopy(this.dataSet1);
    param.forEach((item) => {
      item.boatBatchNum = this.boatBatchNum;
      item.boatNum = this.validateForm.get('boatNum').value;
    });

    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success', '提示信息', '保存成功', { nzDuration: 3000 });
        this.listSearch(this.tempCondition);
      }
    })


  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data:any){
    console.log(data);
    this.boatInfo = data.selData ? data.selData[0] : {};
    this.boatBatchNum = data.inpName || '';
    this.boatInfo.boatNum = this.boatInfo.boatNum || '';
    this.validateForm.patchValue(this.boatInfo);
    this.status = data.inpValidate;
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
