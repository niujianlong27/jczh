/*
 * @Title: price-line.component.ts
 * @Description: 线路运价玉面
 * @Created: zhaozeping 2019/1/31
 * @Modified: 
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {contractUrl} from '../../../../common/model/contractUrl';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '../../../../components/simple-page/simple-page-form.module';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-price-line',
  templateUrl: './price-line.component.html',
  styleUrls: ['./price-line.component.css'],
  providers: [
    XlsxService
  ]
})
export class PriceLineComponent implements OnInit {
  dataSet1:any = [];
  pageSize1:any = 30;
  totalPages1:any = 0;
  listLoading1:boolean = false;

  updateData:any=[];
  buttonId:any;
  
  tempSearchParam:any;
  
  tplModal:any;
  columnsArr:any;

  modalTitle:any = '线路运价 > 导入';
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
        require: true,
        pattern:false
      }
    },
  ]


  constructor(
    private http:HttpUtilService,
    private nm:NzModalService,
    private nz: NzNotificationService,
    private fb:FormBuilder,
    private xlsx:XlsxService,
    private nzMess:NzMessageService
  ){}

  /**
   * 初始化 
   */
  ngOnInit() {
    this.listSearch({page:1,length:this.pageSize1});
  }
  /**
   * 查询
   */
  listSearch(data:any){
    this.getList(data);
  }

  /**
   * 调用查询接口
   */
  getList(data){
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.tempSearchParam=data;
    let url=contractUrl.selectPriceLine;//查询接口
    let param:any = data;
    this.http.post(url,param).then((res:any) => {
      this.listLoading1 = false;
      if(res.success){
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.updateData = [];
      }
    })
    

  }
  /**
   * 获取
   */
  userColumnsEmit(data:any):void{
    this.columnsArr = data;
  }
  
  /**
   * 按钮触发事件 
   */
  btnClick(data:any){
    this.buttonId=data.buttonId;
    switch(this.buttonId){
      case'Add':
        this.btnAdd(data);
        break;
      case'Save':
        this.btnSave(data);
        break;
      case'Import':
        this.btnImport();
        break;
      case'Update':
        this.btnUpdate(data);
        break;
      default:
        break;
    }
  }
  /**
   * 新增按钮
   */
  btnAdd(data:any){
    this.dataSet1.unshift({EDIT:true,checked:true});
    this.dataSet1 = [...this.dataSet1];
    this.updateData = this.dataSet1.filter(item => item.checked);
  }
  /**
   * 保存 按钮
   */
  btnSave(data:any){
    let url =contractUrl.updatePriceLine;
    let param:any=this.updateData;
    
    if(param.length<1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    this.http.post(url,param).then((res: any) => {
      if (res.success) {
        this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    });
    
  }
  /**
   * 导入 按钮
   */
  btnImport(){
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
      nzMaskClosable: true,
      nzClosable: true
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
    this.xlsx.import(this.importFile).then((data:any)=>{
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if(!_data){
        this.nzMess.remove();
        this.nzMess.error("未读取到sheet页！读取数据Excel失败！");
        this.implistLoading = false;
        return;
      };
      if(!this.validateData(_data)){
        this.implistLoading = false;
        return;
      }
      this.excelFilter(_data);
    });
  }

  /**
   * 导入数据验证
   * @param data
   */
  validateData(data:any):boolean{
    // 验证表头码头，品种必须存在
    let excelHeader:any = data && data[0] || [];
    let opt = ['码头','品种']
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
   *  数据转换成json格式
   * @param data
   */
  excelFilter(data:any):void{
    console.log(data);
    let url = contractUrl.addPriceLine;
    let param:any = {contractPriceList:[]};
    let eNameHeader:any = [];
    data[0].map((item,index) => {
        if(this.patchEname(item)){
          eNameHeader.push({field:this.patchEname(item),index:index});
        }
      }
    );
    for (let i = 1; i < data.length; i++) {
      let temp:any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.contractPriceList.push(temp);
    };

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
   *  修改按钮
   */
  btnUpdate(data:any){
    this.updateData.forEach(item => {
      if(!item.EDIT){
        item.EDIT = true;
      }
    })

  }

  /**
   * 列表当前页码变化
   * @param data
   */
  getPageIndex1(data:any){
    this.getList({ page: data, length: this.pageSize1 });
  }

  /**
   * 列表每页展示条数变化
   * @param data
   */
  getPageSize1(data:any){
    this.pageSize1 = data;
    this.getList({ page: 1, length: this.pageSize1 });
  }
  /**
   * 获取勾选数据
   */
  updateDataResult(data:any){
    this.updateData=data;
    console.log(this.updateData);
  }
  /**
   * 销毁弹框
   */
  destroyTplModal(){
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  /**
   * 弹窗取消
   */
  handleCancel():void{
    this.tplModal.destroy();

  }

}
