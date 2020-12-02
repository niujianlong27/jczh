import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';


@Component({
  selector: 'app-query-condition',
  templateUrl: './query-condition.component.html',
  styleUrls: ['./query-condition.component.css']
})
export class QueryConditionComponent implements OnInit {
  formIdTipShow: boolean = true;
  formIdTipShows: boolean;
  modalFormData: Array<any> = [
    {
      name: '界面ID',
      eName: 'formId',
      type: 'text',
      validateCon: '请输入界面ID',
      require: true,
      require2: false,
      disabled: false,
      modal: false,
      disabled2: true
    },
    {
      name: '界面名称',
      eName: 'formName',
      type: 'text',
      validateCon: 'ssss',
      require: true,
      require2: false,
      disabled: false,
      modal: true,
      disabled2: false
    },
    {
      name: '表格名称',
      eName: 'gridId',
      type: 'text',
      validateCon: '请输入表格ID',
      require: true,
      require2: true,
      disabled: false,
      modal: false,
      disabled2: false
    },
    // {
    //   name: '表格名称',
    //   eName: 'gridName',
    //   type: 'text',
    //   validateCon: '表格名称',
    //   require: true,
    //   require2: true,
    //   disabled: false,
    //   modal: false,
    //   disabled2: false
    // },
    {name: '查询名称', eName: 'findName', type: 'text', require: false, require2: false, disabled: false, modal: false, disabled2: false},
    {name: '查询属性', eName: 'findSet', type: 'text', require: false, require2: false, disabled: true, modal: false, disabled2: false},
    {name: '备注', eName: 'remark', type: 'text', require: false, require2: false, disabled: false, modal: false, disabled2: false}
  ];

  modalFormVisible = false; // 表单弹窗
  deleteVisible = false; // 确认弹窗
  modalTitle: string; // 弹出框标题
  deleteCon: string; // 确认框的文本信息
  dataSet: Array<any> = []; // 表单数据
  private status: string; // 判断弹出框来源
  // 表单
  modalValidateForm: FormGroup;
  private rowid: number;
  private selectedData: Array<any> = []; // 表格选中的数据

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  // 查询属性弹出框
  validateForm: FormGroup;
  nzVisible: boolean = false; // 弹出框控制
  controlArray: Array<any> = []; // 查询输入框

  colNameArray: Array<any> = []; // 查询表名查列名所得值
  queryPropertyData: Array<any> = [];// 从findset获取初始值
  headData: Array<any> = [
    {cName: '列名', eName: 'eName'},
    {cName: '关系', eName: 'relation'},
    {cName: '逻辑', eName: 'logic'},
    {cName: '默认值1', eName: 'value1'},
    {cName: '开始时间', eName: 'compute1'},
    {cName: '结束时间', eName: 'compute2'},
    {cName: '是否默认选中', eName: 'checkBox'},
  ];

  searchData: any;  //存储查询的数据
  formIdFindset: any = {url: 'getFormIDAndName', name: '界面', formId: 'form_getIdAndName', parameter: 'formName', parameterSend: 'formId',};// formId设置
  formIdData: any;// formId数据
  formNameData: any;// formName数据

  allChecked = false;
  indeterminate = false;
  private tplModal: NzModalRef;
  showExplainFlag: boolean = false;

  // 弹窗相关

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit() {

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled2}, this.modalFormData[i].require2 ? Validators.required : null
      ));
    }

    // this.listSearch({page: 1, length: this.pageSize});

    this.validateForm = this.fb.group({});

  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}FormFind/getFormFind`;
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

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 添加数据
  addData(data: any) {
    let params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}FormFind/insertFormFind`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );

  }

  // 删除数据
  deleteData(data: any) {
    const params = {url: '', data: {tFormFinds: []}, method: 'POST'};
    params.url = `${environment.baseUrl}FormFind/deleteFormFind`;
    params.data.tFormFinds = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );

  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}FormFind/updateFormFind`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '查询条件 > 新增';
    this.status = 'add';
  }

  // 修改
  btnUpdate(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '查询条件 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
    this.formNameData = data.data[0].formName;
  }

  // 删除
  btnDelete(data: any): void {

    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;

  }


  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 异常确认弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 确认框确认后执行
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData(this.selectedData);
        this.status = '';
      }
    }
    this.deleteVisible = false;

  }

  // formID 输入框更改触发
  formIdChange(f: any): void {
    this.formIdData = f;
  }

  // formID弹框确认返回数据
  selectedInputData(data: any) {
    this.formIdData = data.data[0].companyId;
  }

  // 判断输入内容是否为空
  tipShow(data: any) {
    this.formIdTipShow = data.tipShow;
  }

  // 数据弹出框确定后操作
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
      this.showExplainFlag = !this.modalValidateForm.get('formId').value;
    }
    // debugger;
    if (this.showExplainFlag) {
      return;
    }
    this.formIdTipShows = this.formIdTipShow;
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.getRawValue());

    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.getRawValue());

    }

  }

  // 数据弹出框取消后操作
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框关闭后处理
  closeResult(): void {
    this.modalValidateForm.reset();
    this.formIdData = '';
    this.formIdTipShow = true;
    this.formNameData = '';
    this.showExplainFlag = false;
  }

  // 查询属性
  // 查询属性设置按钮点击
  queryPropertySettings(queryProperty: any): void {
    this.getColumnByformId(queryProperty);
  }

  // 查询属性弹出框确认
  nzOnOk() {
    let arr: Array<any> = [];// 存值
    for (const queryPropertyDatum of this.queryPropertyData) {
      const queryAttributeTemplate = {
        parameter: '',
        query: '',
        formId: '',
        value1: queryPropertyDatum.value1 || '',
        value2: '',
        postQuery: '',
        checkBox:null,
        compute1:null,
        compute2:null,
      };
      const formId: string = queryPropertyDatum.eName;
      let find = this.colNameArray.find(
        function (res) {
          return res.colEname === formId;
        }
      );
      queryAttributeTemplate.parameter = formId;
      queryAttributeTemplate.query = queryPropertyDatum.relation;
      queryAttributeTemplate.postQuery = queryPropertyDatum.logic;
      queryAttributeTemplate.checkBox = queryPropertyDatum.checkBox;
      queryAttributeTemplate.compute1 = queryPropertyDatum.compute1;
      queryAttributeTemplate.compute2 = queryPropertyDatum.compute2;
      arr.push(queryAttributeTemplate);
    }
    this.modalValidateForm.get('findSet').setValue(JSON.stringify(arr));
    this.nzVisible = false;
    this.controlArray = [];

  }

  // 查询属性弹出框取消
  nzOnCancel() {
    this.nzVisible = false;
  }

  // 查询属性框弹出关闭后处理
  nzAfterClose() {
    this.controlArray = [];
    this.queryPropertyData = [];
  }

  // 动态添加
  addField(): void {
    this.queryPropertyData.push({checkBox:false});
    this.queryPropertyData = [...this.queryPropertyData];
  }

  // 动态移除
  removeField(): void {
    this.queryPropertyData = this.queryPropertyData.filter(data => !data.checked);
  }

  // 遍历添加
  throughAdding(data: any): void {
    const convertingObjects = {eName: '', relation: '', logic: '', value1: null,compute1:'',type:'',compute2:'',checkBox:''};
    convertingObjects.eName = data.parameter;
    convertingObjects.relation = data.query;
    convertingObjects.logic = data.postQuery;
    convertingObjects.value1 = data.value1;
    convertingObjects.compute1 = data.compute1;
    convertingObjects.compute2 = data.compute2;
    convertingObjects.checkBox = data.checkBox;

    this.colNameArray.some(
        value => {
            if (value.colEname===convertingObjects.eName){
                convertingObjects.type = value.type;
                return true
            }
        }
    )
    this.queryPropertyData.push(convertingObjects);
    this.queryPropertyData = [...this.queryPropertyData];
  }

  // 通过表名查列名
  getColumnByformId(data: any) {
    const params = {url: '', data: {'formId': '', gridId: this.modalValidateForm.get('gridId').value}, method: 'POST'};
    params.url = `${environment.baseUrl}column/getColumnByformId`;
    params.data.formId = this.modalValidateForm.get('formId').value;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {

          this.colNameArray = res.data.data;
          if (!data) {
            this.queryPropertyData.push({});
            this.queryPropertyData = [...this.queryPropertyData];
          } else {
            const test = JSON.parse(data);
            if (test.length !== 0) {
              for (const queryPropertyElement of test) {
                this.throughAdding(queryPropertyElement);
              }
            }
          }

          this.nzVisible = true;
        }
      }
    );
  }

  // 全选
  checkAll(value: boolean): void {
    this.queryPropertyData.forEach(data => {
        if (!data.disabled) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus();
  }

  // 选择逻辑
  refreshStatus(data?: any): void {
    const allChecked = this.queryPropertyData.every(value => value.checked === true);
    const allUnChecked = this.queryPropertyData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);

  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 弹窗抛出事件
   * @param data
   */
  inpEmit(data: any) {
    this.modalValidateForm.get('formId').setValue(data.inpValue);
  }

  /**
   * 列名修改触发
   * @param params
   * @param data
   */
  colNameChange(params,data):void{
      if (!params){
          data.type =null;
          data.compute1 =null;
          data.compute2 =null;
          return;
      }
      this.colNameArray.some(
          value => {
              if (value.colEname===params){
                 data.type = value.type;
                 return true;
             }
          }
      )
  }

  /**
   * compute失焦触发
   * @param data
   */
  computeChange(data):void{
    data.compute1 = data.compute1&& data.compute1.match(/^[MDHms][+\-]\d*/g)&&data.compute1.match(/^[MDHms][+\-]\d*/g)[0];
    data.compute2 = data.compute2&&data.compute2.match(/^[MDHms][+\-]\d*/g)&&data.compute2.match(/^[MDHms][+\-]\d*/g)[0];
    console.log(data)
  }

  /**
   * 列下拉选项过滤
   * @param params
   */
  isNotSelected(params: string): boolean {

    return  this.queryPropertyData.some(
          value => value.eName === params
      );
  }
}
