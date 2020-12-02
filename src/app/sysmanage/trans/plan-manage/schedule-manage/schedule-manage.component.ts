import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {Utils} from '../../../../common/util/utils';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {HttpClient} from '@angular/common/http';
import {contractUrl} from '../../../../common/model/contractUrl';


/*
 * @Title: 
 * @Description: 排产计划
 * @Created: zhaozeping
 * @Modified: 
 */
@Component({
  selector: 'app-schedule-manage',
  templateUrl: './schedule-manage.component.html',
  styleUrls: ['./schedule-manage.component.css'],
  providers: [
    XlsxService
  ]


})
export class ScheduleManageComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1: Number = 30;
  buttonId: any;
  updateData: any = [];
  tempSearchParam: any;
  columnsArr: any;
  searchFormHidden: any;
  modalTitle: any = '排产计划 > 导入';
  importFile: any;
  implistLoading: boolean = false;
  flag:boolean=false;
  @ViewChild('fileInput') fileInput: ElementRef;
  logistics: any;
  chooseTime: any;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  validateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];

  constructor(
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private xlsx: XlsxService,
    private nzMess: NzMessageService,
    private tplbtnService: TplButtonsService,
    private  angularHttp: HttpClient
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    console.log(11111);
    this.validateForm = new FormGroup({
      chooseTime: new FormControl('', [Validators.required]),
      logistics: new FormControl('', [Validators.required])
    });
    this.listSearch({page: 1, length: this.pageSize1});
    // this.tplbtnService.collaspedSearch.subscribe((data:any)=>{
    //   this.searchFormHidden=data.searchFormHidden;
    // })
    // this.tplbtnService.formReset.subscribe((data:any)=>{
    //   this.validateForm.reset();
    //   this.logistics = undefined;
    // });
  }

  /**
   * 查询
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  /**
   * 调用查询接口
   */
  getList1(data: any): void {
    let url = TRANS_URLS.selectSchedulePlan;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    console.log(data);
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
        this.dataSet1.forEach((item) => {
          item.editstate = 0;
        });
      }
    });
  }

  /**
   * 按钮
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    //修改，保存需要选择数据操作
    if (this.buttonId != 'Add' && this.buttonId != 'Import' && this.buttonId != 'Export') {
      if (this.updateData.length < 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal();
        return;
      }
    }
    switch (this.buttonId) {
      case 'Import':
        this.btnImport();
        break;
      case 'Export':
        this.btnExport();
        break;
      case 'Add':
        this.flag=true;
        this.btnAdd();
        break;
      case 'Update':
        this.flag = true;
        this.btnUpdate();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      default:
        break;
    }
  }

  /**
   * 新增
   */
  btnAdd(): void {
    // this.dataSet1.unshift({EDIT:true,checked:true});
    this.dataSet1.unshift({checked: true});
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
    if(!this.flag){
      this.nzMess.error("请新增或者修改一条记录！");
      return;
    }
    let url = TRANS_URLS.saveSchedulePlanList;
    let scheduleList:any = [];
    for(let i:number=0;i<this.updateData.length;i++){
      if(this.updateData[i].workLine!=undefined){
        if(this.updateData[i].spections!=undefined){
          if(this.updateData[i].prodSign!=undefined){
            if(this.updateData[i].prodName!=undefined){
              continue;
            }
          }
        }
      }
      this.nzMess.error("必填字段产线，规格，牌号，品名为空");
      return;
    }

    scheduleList = this.updateData;

    // param.saledList.forEach((item)=>{
    //   item.flowConfirmationTime = item.flowConfirmationTime &&  item.flowConfirmationTime instanceof Date ? Utils.dateFormat(item.flowConfirmationTime,'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
    //   item.creatDate = item.creatDate &&  item.creatDate instanceof Date ? Utils.dateFormat(item.creatDate,'yyyy-MM-dd HH:mm:ss'):item.creatDate;
    //   item.collectionDate = item.collectionDate &&  item.collectionDate instanceof Date ? Utils.dateFormat(item.collectionDate,'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
    //   // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime || '';
    // });
    this.http.post(url,scheduleList).then((res:any) => {
      console.log(res)
      if(res.success){
        this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
        this.updateData=[];
      }
    })
    this.flag=false;
  }

  /**
   * 删除
   */
  btnDelete():void{

    let url = TRANS_URLS.deleteSchedulePlanList;
    let scheduleList:any = [];
    scheduleList = this.updateData;
    this.http.post(url,scheduleList).then((res:any) => {
      if(res.success){
        this.nz.create('success','提示信息','删除成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
        this.updateData=[];
      }
    })

  }


  /**
   *导入按钮
   */
  btnImport() {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
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
      nzClosable: false,

    });
  }

  /**
   * 选择excel
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    //console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  /**
   * 导入弹窗确定
   */
  importConfirm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    ;
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    let _data;
    let dataList: any = [];
    this.implistLoading = true;
    // let headTemplate =
    //   ['产线', '牌号', '规格', '收货用户', '物流', '运输方式', '城市', '品名', '待产量', '到货码头', '母单号', '发货通知单', '订单号', '过磅类型', '时间段','型码', '合同号', '备注'];
    let headTemplate =
      [ '物流', '运输方式', '城市', '品名', '待产量', '订单号'];
    this.xlsx.import(this.importFile, true).then((data: any) => {

        let keys = Object.keys(data);
        //_data.push( data[keys[i]]);

        let _data = data[keys[2]];
        if (!_data) {
          this.nzMess.remove();
          this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
          this.implistLoading = false;
          return;
        }
        ;
        let headArr: any = _data && _data[0] || [];
        if (!this.validateHead(headTemplate, headArr)) {
          this.nzMess.remove();
          this.nzMess.error(`模板不正确，请下载正确模板`);
          return;
        }

        //this.removeEmpty(_data).then(this.excelFilter(_data));
        //console.log(_data);
        dataList.push(_data);
        _data = [];

      //console.log(dataList);
      this.excelFilter(dataList);
    });


  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    ;
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        console.log(item);
        flag = false;
      }
    });
    if (!flag) {

      this.implistLoading = false;
    }
    return flag;
  }

  /**
   * 数据格式转成json
   * @param data
   */
  excelFilter(data: any) {
    let url = TRANS_URLS.ImportSchedulePlan;
    let param: any = {scheduleList: []};
    // param.contractList = this.updateData;
    let eNameHeader: any = [];
    for (let j = 0; j < data.length; j++) {
      //console.log(data[j][0]);
      console.log(data[j][0]);

      data[j][0].map((item, index) => {
          if (this.patchEname(item)) {
            eNameHeader.push({field: this.patchEname(item), index: index});
          }
        }
      );
      // console.log(eNameHeader);
      for (let i = 1; i < data[j].length; i++) {
        let temp: any = {};
        eNameHeader.forEach((h) => {
          temp[h.field] = data[j][i][h.index];
        });
        param.scheduleList.push(temp);
      }
      ;
    }
    console.log(data);
    param.scheduleList.forEach((item) => {
      // item.creatDate = item.creatDate ? Utils.dateFormat(new Date(item.creatDate),'yyyy-MM-dd HH:mm:ss'):item.creatDate;
      // item.collectionDate = item.collectionDate ? Utils.dateFormat(new Date(item.collectionDate),'yyyy-MM-dd HH:mm:ss'):item.collectionDate;
      // item.flowConfirmationTime = item.flowConfirmationTime ? Utils.dateFormat(new Date(item.flowConfirmationTime),'yyyy-MM-dd HH:mm:ss'):item.flowConfirmationTime;
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });

    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      //console.log(res)
      if (res.success) {
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});

        this.listSearch({page: 1, length: this.pageSize1});
      }
    });

  }

  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }

  removeEmpty(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].length < 1) {
        data.splice(i, 1);
        i = i - 1;

      }
    }
    return data;
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any) {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);

  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any) {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any) {
    this.columnsArr = data;
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.tplModal.destroy();

  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /*
  *   导出
  */
  btnExport() {
    let url: any = TRANS_URLS.exportSchedule;
    // url =`http://192.168.123.101:9034/report/previewTransContract?orderNo=${this.selectedOrderData[0].orderNo}`;
    this.angularHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      // console.log(`requestCompanyId=${this.selectedOrderData[0].companyD}`);
      // console.log(`file size : ${res.size}`);
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `排产计划.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  searchDataReturn(data:any){
    let myData = new Date();
    console.log(1111)
    let b =data.filter(x=>x.parameter==='scheduleDate')
    b[0].value1 = myData.toLocaleDateString();
  }
}
