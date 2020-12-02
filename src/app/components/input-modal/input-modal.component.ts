import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {localUrls} from '@model/localUrls';
import {delay} from 'rxjs/operators';
import {of} from 'rxjs';
import {inpModalUrl} from '@model/inpModalUrl';
import {NzNotificationService, NzMessageService} from 'ng-zorro-antd';

// @ts-ignore
@Component({
  selector: 'input-modal',
  templateUrl: './input-modal.component.html',
  styles: ['.search-modal-input{max-width:150px}',
    '.borderRed{border-color:#f5222d}',
    '.borderRed:focus,.borderRed:hover{box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);border-color: #f5222d!important;}',
    '.ant-form-explain{margin-top: 0}',
    '.inputmodal ::ng-deep .ant-table-wrapper div.ant-table-body{min-height:200px !important; height:300px; margin-top:17px;}',
    '.explain{position:absolute;bottom:-18px;left: 0;}','.modalSearch{margin-bottom:20px;}'
  ]
})
export class InputModalComponent implements OnInit {
  searchStatus: String = 'out';  //标识查询条件取自外部还是内部
  @Input() placeholder: string = '';
  @Input() DISABLED: boolean = false;
  //若需进行验证，传入validate对象  其中validateOpt区分验证name还是value，validateCon为验证不通过的提示，验证不通过时发射属性validatePass
  // @Input() validate: any = {validateOpt:'inpValue',validateCon:'请输入公司名称'};
  @Input() width: number = 1000;//弹窗宽度，自定义，默认1000
  @Input() validate: any = {};
  @Input() isExplain:boolean = true; // 默认警告样式
  @Input() insertType:any;
  @Input() borderRed: boolean;
  @Input() findset: any;
  @Input() inputModalModel: any='';
  @Output() inputModalModelChange = new EventEmitter<any>();
  @Input() inputSize: string = 'default';//input框大小默认
  @Output() selectedData = new EventEmitter<any>();//传递参数
  @Input() isMutli: any;//是否允许列表多选
  @Output() ngModelChange = new EventEmitter<any>();//ngModelChange
  @Output() tipShow = new EventEmitter<any>();
  @Output() inpEmit = new EventEmitter<any>();
  @Input() inputModalHiddenValue: any;//隐藏框值
  @Input() popData: any = {};//接收数据绑定到输入框
  @Input() eName: any;
  @Input() refresh:boolean = false;//是否显示刷新按钮
  @Input() refreshUrl:any //刷新数据的接口地址

  @Input() searchParamFiled:any;
  @Input() searchParamFiledNot:boolean;//true格式不传
  @Input() searchValue:any;

  @Input() extraParam:any = {}; // 额外查询条件
  @Input() showPagination:boolean = true;
  @Input() popIndex:any;//组件在table中的索引
  @Input() popTableData:any = [];//组件存在于table中时接收的数据绑定
  @Input() showExplainFlag:boolean = false;
  @Output() blurEmit = new EventEmitter<any>();
  @Input() refreshParam : any
  @Input() listClick :boolean = false;
  @Input() display:string ='default';  //展示方式，default是正常input输入框弹窗，link则是链接方式
  @Input() linkContent:any; // display为link时展示内容
  // @Output() showExplainFlagChange = new EventEmitter<any>();
  // @Input() blurStatus:boolean = false; // 失焦触发状态 默认失焦不触发事件
  showAddInfo: boolean = false;
  modalshow: boolean = false;
  visible: boolean = false;
  allChecked = false;
  indeterminate = false;
  currentpage: any = 1;//默认第一页
  pageSize: number = 30;//每页30条
  tempSearchCondition: any;//临时存储查询条件
  total: number = 0;
  listHeader = [];
  listData = [];
  inputModalSearchValue: any; //弹窗内搜索框的值
  refreshs:boolean = false;
  areaInfo:any = {};//存储省市区
  addressName:any;//地点名称
  addressNameDetail:any;//详细地址
  tableHeight:string;
  //悬浮窗相关
  tableData:any=[];//气泡框表格数据
  tableHeader:any=[];//气泡框表头
  MouseEnterDelay:number = 2;
  popTableLoading:boolean = false;
  @Input() PopFindSet:any
  @ViewChild('table') modalTable: any;
  private table:HTMLElement;
  // private searchData:any;
  constructor(private http: HttpUtilService, private info: UserinfoService,private nn: NzNotificationService, private msg: NzMessageService) {
  }

  ngOnInit() {
    this.findset = typeof (this.findset) == 'string' ? this.findset && JSON.parse(this.findset) : this.findset;
    if(this.PopFindSet){
      this.PopFindSet = typeof (this.PopFindSet) == 'string' ? this.PopFindSet && JSON.parse(this.PopFindSet) : this.PopFindSet
      this.MouseEnterDelay = 1
    }else{
      this.MouseEnterDelay = 100000
    }
    if(this.findset.insertType){
      this.insertType = this.findset.insertType;
    }

    if (this.eName) {
      // console.log(this.eName,this.popData);

      if(this.popData){
        this.inputModalModel = this.popData[this.eName].name;
        this.inputModalHiddenValue = this.popData[this.eName].value;
      }

      // console.log(this.popTableData,this.popIndex)
      if(this.popTableData.length>0){
        this.inputModalModel = this.popTableData[this.popIndex][this.eName].name;
        this.inputModalHiddenValue = this.popTableData[this.popIndex][this.eName].value;
      }
    }

    if (this.inputModalHiddenValue) {
      this.inputModalModelChange.emit(this.inputModalModel);
      this.inpEmit.emit({inpName: this.inputModalModel || '', inpValue: this.inputModalHiddenValue || '',inpValidate:'VALID'});
    }
  }

  getListHead() {
    //获取数据弹窗表头
    let urlColumns = localUrls.getColumnsUrl;
    let paramColumns:any = {formId: this.findset.formId};
    // 若存在gridId，表头传参添加gridId
    if ( this.findset.gridId){
      paramColumns.gridId=this.findset.gridId;
    }
    this.http.post(urlColumns, paramColumns).then(
      (res: any) => {
        if (res.success) {
          this.listHeader = res.data.data;
          this.columnsFilter();
          // console.log(this.listHeader);
        }
      }
    );
  }

  getPopHeader(){
    let urlColumns = localUrls.getColumnsUrl;
    let paramColumns:any = {formId: this.PopFindSet.formId};
    // 若存在gridId，表头传参添加gridId
    if ( this.PopFindSet.gridId){
      paramColumns.gridId=this.PopFindSet.gridId;
    }
    this.http.post(urlColumns, paramColumns).then(
      (res: any) => {
        if (res.success) {
          this.tableHeader = res.data.data;
          this.columnsFilter();
          // console.log(this.listHeader);
        }
      }
    );
  }

  refreshStatus(data?: any): void {
    console.log(data)

    const allChecked = this.listData.every(value => value.checked === true);
    const allUnChecked = this.listData.every(value => value.checked===false);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    if (!this.isMutli) {
      this.listData.map((list: any) => {
        list.checked = false; //单选情况下设置checked;
      });
      data.checked = !data.checked;
    }
  }

  checkAll(value: boolean): void {
    this.listData.forEach(data => {
        if (!data.disabled) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus();
  }


  handleOk(): void {
    this.inputModalSearchValue = '';
    // console.log(this.listData);
    let sel_Data = [];
    let nameArr = [];
    let valueArr = [];
    for (let item of this.listData) {
      if (item.checked) {
        sel_Data.push(item);
        nameArr.push(item[this.findset.parameter]);
        valueArr.push(item[this.findset.parameterSend]);
      }
    }
    if(sel_Data.length<=0){
      this.msg.error('请勾选一条数据！');
      return;
    }
    // console.log(nameArr,valueArr);
    if (nameArr.length != 0) {
      this.inputModalModel = nameArr[0];
      this.inputModalHiddenValue = valueArr[0];
    }
    // this.inputModalModel = nameArr.join[','];
    this.selectedData.emit({data: sel_Data});
    if(this.validate.validateOpt === 'inpName'){
      this.showExplainFlag = !this.inputModalModel || this.inputModalModel =='';
      // this.showExplainFlagChange.emit(this.showExplainFlag);
    }else if(this.validate.validateOpt === 'inpValue'){
      this.showExplainFlag = !this.inputModalHiddenValue || this.inputModalHiddenValue == '';
      // this.showExplainFlagChange.emit(this.showExplainFlag);
    }
    this.inputModalModelChange.emit(this.inputModalModel);
    this.inpEmit.emit({inpName: this.inputModalModel, inpValue: this.inputModalHiddenValue || '', selData: sel_Data,inpValidate:this.showExplainFlag?'INVALID':'VALID'});

    this.ngModelChange.emit(this.inputModalModel); //
    this.visible = false;
    of(this.visible).pipe(delay(500)).subscribe((x) => this.modalshow = x);

  }

  handleCancel(): void {
    this.inputModalSearchValue = '';
    this.visible = false;
    of(this.visible).pipe(delay(500)).subscribe((x) => this.modalshow = x);

  }

  keyUp(e?: any, p?: any, s?: any): void {
    this.refreshs = false
    if (s) {
      this.searchStatus = 'in';
    } else {
      this.searchStatus = 'out';
    }
    if (!this.DISABLED) {
      this.currentpage = 1;
      if (e) {
        if (e.keyCode === 13) {
          this.getModalData(p, s);
        }
      } else {
        this.getModalData(p, s);
      }
    }
  }

  add(): void {
    this.addressName = this.addressNameDetail = '';
    this.showAddInfo = !this.showAddInfo;
  }

  areaEmit(data:any){
    this.areaInfo = data;
  }

  sureAdd(): void {
    if(this.insertType === 'address'){
      let url = localUrls.addPoint;
      let point:any = {
        provinceName:this.areaInfo.provinceValue && this.areaInfo.provinceValue.name || '',//省
        cityName:this.areaInfo.cityValue && this.areaInfo.cityValue.name || '',//市
        districtName:this.areaInfo.areaValue && this.areaInfo.areaValue.name || '',//区
        provinceCode:this.areaInfo.provinceValue && this.areaInfo.provinceValue.code || '',//省
        cityCode:this.areaInfo.cityValue && this.areaInfo.cityValue.code || '',//市
        districtCode:this.areaInfo.areaValue && this.areaInfo.areaValue.code || '',//区
        locationName:(this.areaInfo.provinceValue && this.areaInfo.provinceValue.name || '')+(this.areaInfo.cityValue && this.areaInfo.cityValue.name || '')+(this.areaInfo.areaValue && this.areaInfo.areaValue.name || '')+(this.areaInfo.townValue && this.areaInfo.townValue.name || '')+(this.addressNameDetail || ''),//地点名称
        address:this.addressNameDetail || '', //详细地址
        townName:this.areaInfo.townValue && this.areaInfo.townValue.name || '',//地点名称
        townCode:this.areaInfo.townValue && this.areaInfo.townValue.code || '' //详细地址
      };
      const pointValidate: Array<any> = [
        { ename: 'provinceName', cname: '省名称', required:true },
        { ename: 'provinceCode', cname: '省编码', required:true },
        { ename: 'cityName', cname: '市名称', required:true },
        { ename: 'cityCode', cname: '市编码', required:true },
        { ename: 'districtName', cname: '区名称', required:true },
        { ename: 'districtCode', cname: '区编码', required:true },
        { ename: 'townName', cname: '乡名称' },
        { ename: 'townCode', cname: '乡编码' },
      //  { ename: 'locationName', cname: '地点名称' },
        { ename: 'address', cname: '详细地址', required:true },
      ];
      const msg = pointValidate.filter(filed => filed.required && !point[filed.ename]  ).map(item => item.cname).join(",");
      if(msg){
        this.msg.error(`地点数据${msg}字段不能为空！`);
        return;
      }
      this.http.post(url, point).then(
        (res: any) => {
          if (res.success) {
            this.nn.create('success','提示信息','添加成功',{nzDuration:3000});
            // this.getModalData(this.tempSearchCondition);
            // 郑鑫2019-1-11修改：不调用查询，将插入的地点信息添加到当前列表第一条，并选中
            const point = res.data.data;
            point.checked = true;
            this.listData = [point, ...this.listData];
            this.showAddInfo = false;
          }
        }
      )
    }
  }

  pageChange(page: any): void {
    console.log(this.tempSearchCondition);
    this.currentpage = page;
    this.getModalData(this.tempSearchCondition);
    // console.log(this.currentpage,this.pageSize);
  }

  modelChange(data: any) {
    this.inputModalModel=data;
    this.inputModalModelChange.emit(this.inputModalModel);

    // this.borderRed = this.borderRed || this.showExplainFlag && ((this.validate.validateOpt === 'inpName' && !this.inputModalModel || this.inputModalModel == '') || (this.validate.validateOpt === 'inpValue' && !this.inputModalHiddenValue || this.inputModalHiddenValue == ''));
    if (!data || data == '') {
      this.tipShow.emit({tipShow: true});
    } else {
      this.tipShow.emit({tipShow: false});
    }
    // console.log(data,111);
    this.inputModalHiddenValue = '';
    if(this.validate.validateOpt === 'inpName'){
      this.showExplainFlag = !data || data == '';
    }else if(this.validate.validateOpt === 'inpValue'){
      this.showExplainFlag = !this.inputModalHiddenValue || this.inputModalHiddenValue == '';
    }
    this.inpEmit.emit({inpName: data, inpValue: this.inputModalHiddenValue || '',inpValidate:this.showExplainFlag?'INVALID':'VALID'});

    // console.log(data,this.inputModalHiddenValue)
    this.ngModelChange.emit(data);
  }

  getModalData(p, s?: any): void {
    this.addressName = this.addressNameDetail = '';
    if (this.searchStatus == 'out') {
      this.tempSearchCondition = this.inputModalModel || '';
    } else {
      this.tempSearchCondition = this.inputModalSearchValue || '';
    }
    // console.log(this.searchStatus);
    this.getListHead();
    //获取列表数据
    let url = this.findset.url ? inpModalUrl[this.findset.url] : inpModalUrl['default'];
    let param = {page: this.currentpage, length: this.pageSize,...this.extraParam};
    param[this.findset.parameter] = p;
    if(this.findset.parameterSend === 'companyId'){
      param[this.findset.parameterSend] = this.info.APPINFO.USER.companyId;
    }
    if(this.searchParamFiled && this.searchValue){
      if(!this.searchParamFiledNot){
        param[this.searchParamFiled] = this.searchValue;
      }
    }

    param['formId'] = this.findset.formId;

    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.listData = res.data.data.data;
          this.listData.forEach((x)=>{
            x.checked = false;
          })
          this.total = res.data.data.total;
          if (this.total == 0) {
            this.msg.create('warning','暂无数据',{nzDuration:3000});
          } else if (this.total == 1) {
            // console.log(this.listData);
            if (!s) {  //如果是外部搜索。搜索结果只有一条自动带入
              this.inputModalModel = this.listData[0] && this.listData[0][this.findset.parameter] || '';
              this.inputModalHiddenValue = this.listData[0] && this.listData[0][this.findset.parameterSend] || '';
            }
            this.selectedData.emit({data: this.listData});
            if(this.validate.validateOpt === 'inpName'){
              this.showExplainFlag = !this.inputModalModel || this.inputModalModel =='';
            }else if(this.validate.validateOpt === 'inpValue'){
              this.showExplainFlag = !this.inputModalHiddenValue || this.inputModalHiddenValue == '';
            }
            this.inputModalModelChange.emit(this.inputModalModel);
            this.inpEmit.emit({inpName: this.inputModalModel, inpValue: this.inputModalHiddenValue || '', selData: this.listData,inpValidate:this.showExplainFlag?'INVALID':'VALID'});


          } else {
            this.modalshow = true;
            of(this.modalshow).pipe(delay(30)).subscribe(
              (x) => {
                this.visible = x;
                this.allChecked = false;
                this.indeterminate = false;
              }
            );
          }
        }
      }
    );
  }
  heightTable(data:number){
    this.tableHeight = `${data}px`;
  }

  /**
   * 表头获取数据刷选
   */
  columnsFilter(): void {
    this.listHeader = this.listHeader.filter((x:any)=> x.visible == 'XSBJ10');
    this.tableHeader = this.tableHeader.filter((x:any)=>x.visible=='XSBJ10')
    console.log(this.tableHeader)

  }

  /**
   * blur和focus
   */
  blurFocus(value: Boolean): void {
    this.blurEmit.emit(value);
  }


  refreshData(){
    if(this.refreshs){
      return;
    }
    this.refreshs = true
    this.http.post(this.refreshUrl,this.refreshParam).then(res=>{
      if(res.success){
        this.msg.success('刷新成功');

        this.getModalData(null);
      }
      this.refreshs = false
    })
  }

  tdClick(data:any) {
    console.log(data)
    if(!this.listClick){
      return;
    }
    data.checked = !data.checked
    this.refreshStatus(data)
    // const allChecked = this.listData.every(value => value.checked === true);
    // const allUnChecked = this.listData.every(value => !value.checked);
    // this.allChecked = allChecked;
    // this.indeterminate = (!allChecked) && (!allUnChecked);
    // if (!this.isMutli) {
    //   this.listData.map((list: any) => {
    //     list.checked = false; //单选情况下设置checked;
    //   });
    //   data.checked = !data.checked;
    // }
  }

  tooltipVisibleChange(data:any,data2:any,data3:any){
    if(data){
      if(this.PopFindSet){
        this.popTableLoading = true
        this.getPopHeader();
        let url = this.PopFindSet.findUrl ? inpModalUrl[this.PopFindSet.findUrl] : inpModalUrl['default'];
        let param:any={};
        this.PopFindSet.param.forEach(item=>{
          console.log(data2[item[1]])
          param[item[0]] = data2[item[1]]
        })
        this.http.post(url,param).then(res=>{
          this.popTableLoading = false;
          if(res.success){
            console.log(res)
            this.tableData = res.data&&res.data.data||[]
          }
        })
      }

    }
  }
}
