import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {contractUrl} from '../../../../common/model/contractUrl';
import {XlsxService} from '../../../../components/simple-page/simple-page-form.module';
import {isSuccess} from '@angular/http/src/http_utils';
import {Utils} from '../../../../common/util/utils';
/**
 * Title: contract-trans.component.ts
 * Description: 运输合同页面
 * Created: pengzitong 2019/1/29
 * Modified:
 */
@Component({
  selector: 'app-contract-trans',
  templateUrl: './contract-trans.component.html',
  styleUrls: ['./contract-trans.component.css'],
  providers: [
    XlsxService
  ]
})
export class ContractTransComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;
  buttonId:any;
  updateData:any = [];
  tempSearchParam:any;
  columnsArr:any;

  modalTitle:any = '运输合同 > 导入';
  importFile:any;
  implistLoading:boolean = false;
  @ViewChild('fileInput') fileInput:ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;


  validateForm:FormGroup;
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true,readOnly:true,
      validators: {
        require: true,
        pattern:false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true,hidden:true,
      validators: {
        require: false,
        pattern:false
      }
    },
  ]
  constructor(
    private http: HttpUtilService,
    private nm:NzModalService,
    private fb:FormBuilder,
    private nz:NzNotificationService,
    private xlsx:XlsxService,
    private nzMess:NzMessageService
  ) {}

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 获取列表
   * @param data
   */
  getList1(data: any): void {
    let url = contractUrl.contractTransList;
    this.listLoading1 = true;
    this.tempSearchParam=data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.dataSet1.forEach((item)=>{
          item.editstate = 0;
        })
      }
    })
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData = data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data:any):void{
    this.columnsArr = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    // console.log(this.buttonId);
    if(this.buttonId != 'Add' && this.buttonId != 'Import'){
      if(this.updateData.length < 1){
        let tplModal:NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal(tplModal);
        return;
      }
    }
    switch (this.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'AuditBill':
        this.btnAuditBill();
        break;
      case 'AuditFlow':
        this.btnAuditFlow();
        break;

      case 'Import':
        this.btnImport();
        break;

      default:
        break;
    }
  }

  /**
   * 新增
   */
  btnAdd():void{
    // this.dataSet1.unshift({EDIT:true,checked:true});
    this.dataSet1.unshift({checked:true});
    this.dataSet1 = [...this.dataSet1];
    this.updateData = this.dataSet1.filter(item => item.checked);
  }

  /**
   * 修改
   */
  btnUpdate():void{
    this.updateData.forEach(item => {
      if(item.editstate == 0){
        item.editstate = 1;
      }
    })
  }

  /**
   * 保存
   */
  btnSave():void{
    let url = contractUrl.contractTransSave;
    let param:any = {};
    param.contractList = this.updateData;
    param.contractList.forEach((item)=>{
      item.flowConfirmationTime = item.flowConfirmationTime &&  item.flowConfirmationTime instanceof Date ? Utils.dateFormat(item.flowConfirmationTime,'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
      item.creatDate = item.creatDate &&  item.creatDate instanceof Date ? Utils.dateFormat(item.creatDate,'yyyy-MM-dd HH:mm:ss'):item.creatDate;
      item.collectionDate = item.collectionDate &&  item.collectionDate instanceof Date ? Utils.dateFormat(item.collectionDate,'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
      // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime || '';
    });
    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  /**
   * 删除
   */
  btnDelete():void{
    let url = contractUrl.contractTransDelete;
    let param:any = {};
    param.contractList = this.updateData;
    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success','提示信息','删除成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    })

  }

  /**
   * 确认回单
   */
  btnAuditBill():void{
    let url = contractUrl.contractTransAuditBill;
    let param:any = {};
    param.contractList = this.updateData;
    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success','提示信息','确认回单成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  /**
   * 确认流向
   */
  btnAuditFlow():void{
    let url = contractUrl.contractTransAuditFlow;
    let param:any = {};
    param.contractList = this.updateData;
    this.http.post(url,param).then((res:any) => {
      if(res.success){
        this.nz.create('success','提示信息','确认流向成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  /**
   * 导入按钮
   */
  btnImport():void{
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach( item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  /**
   * 选择excel
   */
  selectFile():void{
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file:any){
    this.importFile = file.target.files[0];
    console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }

  /**
   * 导入弹窗确定
   */
  importConfirm():void{
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    };
    if(this.validateForm.status === 'INVALID'){
      return;
    }

    this.implistLoading = true;
    this.xlsx.import(this.importFile,true).then((data:any)=>{
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if(!_data){
        this.nzMess.remove();
        this.nzMess.error("未读取到sheet页！读取数据Excel失败！");
        this.implistLoading = false;
        return;
      };
      console.log(this.validateData(_data));
      if(!this.validateData(_data)){
        // this.nzMess.error("合同号不能为空！");
        this.implistLoading = false;
        return;
      }
      this.excelFilter(_data);
    });
  }

  /**
   * 导入数据验证表头及必填字段
   * @param data
   */
  validateData(data:any):boolean{
    // 验证表头合同号必须存在
    let excelHeader:any = data && data[0] || [];
    let opt = ['合同号']
    let tipMess = [];
    for(let j = 0;j < opt.length;j++){
      let op = opt[j];
      if(excelHeader.indexOf(op) < 0){
        tipMess.push(op);
      }else{
        // 验证必填字段不能为空
        for(let i=1;i<data.length;i++){
          let index = excelHeader.indexOf(op);
          // console.log(data[i],data[i][index],index);
          if(!data[i][index] || data[i][index] == ''){
            this.nzMess.remove();
            this.nzMess.error(`必填字段“${op}”在行号为${i+1}处为空！`);
            return false;
          };
        };
        return true;
      }
    };
    if(tipMess.length > 0){
      this.nzMess.remove();
      this.nzMess.error(`字段${tipMess.join('、')}必须存在！`);
      return false;
    };
  }

  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data:any):void{
    console.log(data);
    let url = contractUrl.contractTransAdd;
    let param:any = {contractList:[]};
    // param.contractList = this.updateData;
    let eNameHeader:any = [];
    data[0].map((item,index) => {
        if(this.patchEname(item)){
          eNameHeader.push({field:this.patchEname(item),index:index});
        }
      }
    );
    // console.log(eNameHeader);
    for (let i = 1; i < data.length; i++) {
      let temp:any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.contractList.push(temp);
    };

    param.contractList.forEach((item)=>{
      // item.creatDate = item.creatDate ? Utils.dateFormat(new Date(item.creatDate),'yyyy-MM-dd HH:mm:ss'):item.creatDate;
      // item.collectionDate = item.collectionDate ? Utils.dateFormat(new Date(item.collectionDate),'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
      // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });

    this.http.post(url,param).then((res:any) => {
      this.implistLoading = false;
      if(res.success){
        this.tplModal.destroy();
        this.nz.create('success','提示信息','导入成功',{nzDuration:3000});

        this.listSearch({ page: 1, length: this.pageSize1 });
      }
    })

  }

  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName:any){
    for(let i = 0;i < this.columnsArr.length;i++ ){
      if(this.columnsArr[i].colCname.trim() == cName.trim()){
        return this.columnsArr[i].colEname;
      }
    }
  };

  /**
   * 弹窗取消
   */
  handleCancel():void{
    this.tplModal.destroy();

  }

  /**
   * 弹窗确定
   */
  handleOk():void{

  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(tplModal): void {
    window.setTimeout(() => {
      tplModal.destroy();
    }, 1500);
  };
}
