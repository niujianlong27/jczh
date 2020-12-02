import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
//import { trigger, transition, animate,style} from '@angular/animations';


import { UserinfoService } from '../../common/services/userinfo-service.service';
import { GlobalService } from '../../common/services/global-service.service';
import { SimpleCacheService } from '../../common/services/simple-cache.service';
import { urls } from '../../common/model/url';
import { HttpUtilService } from '../../common/services/http-util.service';
import { Utils } from '../../common/util/utils';
import { toDemical } from 'src/app/common/validators/validator';
import { Title } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { bufferCount, toArray } from 'rxjs/operators';
declare var XLSX: any;
@Component({
  selector: 'app-table-form2',
  templateUrl: `./table-form2.component.html`,
  styleUrls: ['./table-form2.component.css'],
  /* animations:[
     trigger('gridAnimate',[
       transition(':enter',[
         style({opacity:0,height:0,transform:'translate(30px,0)'}),
         animate('0.3s ease-in',style({opacity:1,height:'auto',transform:'translate(0,0)',background:'#fffeee'}))
       ]),
       transition(':leave',[
         animate('0.3s ease-out',style({opacity:0,height:0,transform:'translate(30px,0)'}))
      ])
     ])
   ]*/
})
export class TableForm2Component implements OnInit {
  // tempfindSet: any = { "parameter": "companyName", "parameterSend": "companyId", "name": "发票抬头", "formId": "company_pop" }; //数据弹框传入参数配置格式

  private gloPageSub: Subscription;
  private gloColSub: Subscription;
  private _columns: any[];

  @Output() inpEmit = new EventEmitter<any>();
  tableWidth: string = '100%';
  allChecked = false;
  indeterminate = false;
  updateData: Array<any> = [];
  dataHeader: Array<any> = [];//表头
  pageIndex: number = 1;//当前页码
  _trSelected: boolean[] = [];
  _gridOperate: any = {}; //操作{show:false,title:'操作',width:'120px',template:''};
  _calTotalFiled: any = {};

  _totalPage: number = 0;
  _pageSizeOptions: number[] = [30, 100, 500, 1000, 5000];
  _dataSet: any[] = []; //列表展示
  headerFilter: any = {};//filter数据
  private filterSearch: any = {};//filter条件
  private dataBig: any[] = [];
  private allData: any[] = [];
  private constData: any[] = [];
  filterFlag = false;
  private currentChange: boolean = false;
  private trSelectHand: boolean = false; //判断是否
  @Input() tabArr: any[] = [];//tab头数据 不要用
  @Input() tabIndex: number = 0;//激活的面板,默认第一个 不要用
  @Input() updateHeader: boolean = false;//点击tab是否更新表头 不要用
  @Output() tabResultFun = new EventEmitter<any>();//tab头点击事件 不要用

  @Input() set columns(val: any[]) {  //自定义表头 [{colCname:'中文名',colEname:'英文名',visible:'XSBJ10'|'XSBJ20'}]
    this._columns = val;
    Array.isArray(this._columns) && this.columnsFilter(this._columns);
  }
  get columns() {
    return this._columns;
  }
  @Input() listWidth: string;//list宽度
  @Input() trSelectedShow: boolean = false;//选中是否显示样式
  @Input() set trSelected(val: boolean[]) { //index以作区分
    Array.isArray(val) && (this._trSelected = val, this.trSelectHand = true);
  }
  get trSelected() {
    return this._trSelected;
  }
  @Input() formId: string;//formId 优先级高
  @Input() gridId: string;//一个页面多个列表必填，传gridId以进行区分，

  @Input() isCheckBox: boolean = true;//是否显示选择框,默认显示
  @Input() isMutli: boolean;//选择框是否多选
  @Input() nzShowPagination: boolean = true;//列表是否显示分页器 ,默认显示
  @Input() showCount: boolean = true;//是否显示选择条数
  @Input() pageSize: number = 100;//条数 默认100
  @Input() paginationRef: TemplateRef<any>;
  @Input() set pageSizeOptions(val: number[]) { //页码自定义
    this._pageSizeOptions = val;
  }
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  @Input() colSet: boolean = true;//列表设置是否显示
  //@Input() dataSet:Array<any> = [];//列表数据
  @Input() set dataSet(val: any[]) { //只接收外部传进的值
    this.filterSearch = {};//filter重置
    this.currentChange = false;
    this.allData = Array.isArray(val) ? val : [];  //数量可变
    this.constData = Array.isArray(val) ? val : []; //数量不可变
    this.showDataFun(val);
    //filter数据,$~$
    window.setTimeout(() => {
      let colHad = {}, tempStr: string;
      this.dataHeader.map((y: any) => {
        this.headerFilter[y.colEname] = [];
        // colHad[y.colEname] = {};
      })
      this.allData.map((x: any) => {
        this.dataHeader.map((y: any) => {
          let yname = (x[y.colEname] == '' || x[y.colEname] == null || x[y.colEname] == undefined) ? '' : x[y.colEname];
          tempStr = y.colEname + yname;
          if (!colHad[tempStr]) {
            let xName = yname.toString().trim() || '';
            this.headerFilter[y.colEname].push({ "text": xName, "value": xName });
            colHad[tempStr] = true;
          }

        })
      })
      colHad = undefined;//清空
    })

  }
  /* get dataSet(){
     return this._dataSet;
   }*/
  //渲染设置
  private showDataFun(val: any[]) {
    if (!val || Array.isArray(val) && !val[0]) {
      this._dataSet = [];
      return;
    }
    of(...val).pipe( //显示30条
      bufferCount(30),
      toArray()
    ).subscribe(x => {
      this.dataBig = x.slice(1);
      this._dataSet = x[0];
    })
  }
  scrollBottom() {
    if (!this.dataBig[0]) {
      return;
    }
    this.currentChange = true;
    of(this.dataBig[0]).subscribe(x => {
      this.dataBig = this.dataBig.slice(1);
      this._dataSet = [...this._dataSet, ...x];
    })

  }
  //数据总数
  @Input() set totalPage(val: number) {
    this._totalPage = val;
    this._pageSizeOptions = [30, 100, 500, 1000, 5000];
    val && (this._pageSizeOptions = [...this._pageSizeOptions, val]);
  };//数据总数
  get totalPage() {
    return this._totalPage;
  }
  @Input() listLoading: boolean;//list加载

  @Input() pageFun: boolean;//true页码条数自写

  @Input() set gridOperate(val: any) {
    if (Utils.isObject(val)) {
      this._gridOperate.show = val.show;
      this._gridOperate.title = val.title || '操作';
      this._gridOperate.width = val.width || '120px';
      this._gridOperate.template = val.template;
    }

  };//操作{show:false,title:'操作',width:'120px',template:''};
  @Input() caculateEnameArr: any = [

  ];
  @Input() popData: any;
  @Input() popTableData: any = [];
  @Input() searchParamFiled: any; //pop弹框调接口要传的参数名
  @Input() searchListFiled: any;  //pop弹窗取当前数据哪个字段的值


  @Output() updateDataResult = new EventEmitter<any>();//选中数据的结果以及点击列表选择框事件
  @Output() inputBlurFun = new EventEmitter<any>();//input Blur失焦
  @Output() modelChange = new EventEmitter<any>();//input值改变事件
  @Output() listClick = new EventEmitter<any>();//list点击事件
  @Output() pageIndexEmit = new EventEmitter<any>();//页码点击事件
  @Output() pageSizeEmit = new EventEmitter<any>();//条数点击事件
  @Output() userColumnsEmit = new EventEmitter<any>();//表头数据返回
  @Output() currentPageDataChangeEmit = new EventEmitter<any>();//当前页面数据更新

  @Output() checkboxClicked = new EventEmitter<any>();//选中数据的结果以及点击列表选择框事件

  constructor(private http: HttpUtilService, private info: UserinfoService, private globalSer: GlobalService,
    private titleServe: Title, private simpleCache: SimpleCacheService) {

  }
  ngOnInit() {

    !this._columns && this.getUserColumns({ formId: this.formId || this.info.APPINFO.formId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId });

    this.gloPageSub = this.globalSer.pageNumEmitter.subscribe((x: any) => { this.pageIndex = x.page });
    this.gloColSub = this.globalSer.colChangeEmitter.subscribe((res: any) => this.getUserColumns({ formId: this.formId || this.info.APPINFO.formId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId }));
    for (let c of this.caculateEnameArr) {
      this._calTotalFiled[c.field] = toDemical(0, c.demLength);
      c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
    }
    // 用户是否显示过滤和排序localstorage缓存
    this.filterFlag = this.simpleCache.getLocal(this.getFilterFlagBufferName()) || false;
  }
  // 用户是否显示过滤和排序buffer命名
  getFilterFlagBufferName() {
    return 'FILTER_FLAG_' + this.info.APPINFO.USER.userId + '_' + (this.formId || this.info.APPINFO.formId);
  }
  //选择逻辑
  refreshStatus(data?: any): void {
    let currentChecked: boolean;
    if (data && !this.isMutli) {
      currentChecked = data.checked;
    }
    this.allData.map((list: any) => {
      if (!this.isMutli) {
        list.checked = false; //单选情况下设置checked;
      }
    });
    if (data && !this.isMutli) {
      data.checked = currentChecked; //单选情况下设置checked;
    }
    this.allCheckBoxStyle();
    this.updateData = this.constData.filter((x: any) => x.checked);
    this.updateDataResult.emit(this.updateData);//选中的结果数据

    this.checkboxClicked.emit({checkedData: this.updateData, checked: data.checked});

    //统计需要统计的字段
    for (let c of this.caculateEnameArr) {
      console.log(this._calTotalFiled);
      this._calTotalFiled[c.field] = toDemical(0, c.demLength);
      // for (let elem of this.updateData) {
      //   //  this._calTotalFiled[c.field] += Number(elem[c.field]);
      //   this._calTotalFiled[c.field] = toDemical(Utils.add(this._calTotalFiled[c.field], elem[c.field]),c.demLength);
      //  }
      // 2019-1-14郑鑫修改， 将每次求和都四舍五入改为将最后结果四舍五入
      this._calTotalFiled[c.field] = toDemical(this.updateData.map(item => Number(item[c.field])).reduce((acc, cur) => acc + cur, 0), c.demLength);
      c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
    }
  }
  private allCheckBoxStyle() {
    const allChecked = this.allData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.allData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  checkAll(value: boolean): void {
    this.allData = this.allData ? this.allData : [];
    this.allData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  getUserColumns(param: any): void { //获取表头
    var _key = 'FORM_' + param['formId'] + '_' + param['userId'] + '_' + param['gridId'];
    if (this.simpleCache.has(_key)) {
      // 如果有缓存，则直接处理
      this._processUserColumns(this.simpleCache.get(_key));
    } else {
      this.http.post(urls.columns, param).then((res: any) => {
        //获取表头
        if (res.success) {
          this.simpleCache.set(_key, res);
        }
        this._processUserColumns(res);
      });
    }
  }

  _processUserColumns(res: any) {
    if (res.success) {
      let dataHeader: any;
      dataHeader = res.data.data;
      dataHeader.map((item: any) => {
        if (typeof item.apiParameter === "string") {
          item.apiParameter = (item.apiParameter && JSON.parse(item.apiParameter)) || {};
        }
      })
      this.columnsFilter(dataHeader, 'http');
      this.dataHeader.forEach(
        res => {
          if (res.type === 'select' && res.apiParameter.optionList instanceof Array) {
            this.getSelectData(res.apiParameter.optionList, res.apiParameter.valueSetCode);
          }
        }
      )
    }
  }

  columnsFilter(dataHeader: any[], type?: string) {
    let len = 0, width = 0;
    this.dataHeader = dataHeader.filter((x: any) => x.visible == 'XSBJ10');
    this.dataHeader.map((item: any) => {
      width = item.width ? item.width : 120;
      len = Utils.add(len, width);
      item.width = width;
    })
    let checkBoxWidth = this.isCheckBox ? 70 : 0;
    let gridOperateWidth = this._gridOperate.show ? parseFloat(this._gridOperate.width) : 0;
    this.tableWidth = `${Utils.add(Utils.add(len, checkBoxWidth), gridOperateWidth)}px`;//默认加上选择框的
    type === 'http' && this.userColumnsEmit.emit(this.dataHeader);//返回表头数据
  }
  //改变页码
  pageChange(n: number): void {
    this.pageIndex = n;
    !this.pageFun ? this.globalSer.pageNumEmitter.emit({ page: n, length: this.pageSize }) : null;
    this.pageIndexEmit.emit(n);

  }
  //改变条数
  pageSizeFun(n: number): void {
    this.pageIndex = 1;
    !this.pageFun ? this.globalSer.pageNumEmitter.emit({ page: 1, length: n }) : null;
    this.pageSizeEmit.emit(n);
  }
  //当前展示数据改变要做的处理
  currentPageDataChange(data: any): void {
    this.allCheckBoxStyle();
    if (this.currentChange) {
      return;
    }
    this.allChecked = false;
    this.indeterminate = false;
    this.updateData = [];
    /* window.setTimeout(() => {
       this.updateDataResult.emit(this.updateData);//选中的结果数据
     });*/
    !this.trSelectHand && (this._trSelected = []);//如果传trSelected属性，则刷新列表手动清除选中样式
    this.currentPageDataChangeEmit.emit(data);

    for (let c of this.caculateEnameArr) {
      this._calTotalFiled[c.field] = toDemical(0, c.demLength);
      c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
    }

  }
  //tab头
  tabClick(data: any): void {  //不要用
    this.tabResultFun.emit(data);
    setTimeout(() => {
      if (this.updateHeader) {
        !this._columns && this.getUserColumns({ formId: this.formId || this.info.APPINFO.formId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId });//参数待定
      }
    }, 100)
  }
  //inputBlur
  inputBlur(data: any, dex: number) {
    this.inputBlurFun.emit({ data: data, index: dex });
  }
  onChange(val: string, data: any, n: any, h: any) {
    this.modelChange.emit({ val: val, data: data, input: n, header: h });
  }
  tdClick(data: any, index: number, bol: boolean) {
    if (!bol) {
      return;
    }
    this._trSelected = [];
    this._trSelected[index] = true;
    this.listClick.emit(data);
  }
  //操作
  inpEmitFun(data: any, dex: any, rowid: any, n: any) {
    // console.log(data,dex);
    this.inpEmit.emit({ inpName: data.inpName || '', inpValue: data.inpValue || '', selData: data.selData || {}, index: dex, rowid: rowid, eName: n.colEname });
  }
  //sort
  sort(type: any, index: any) {

    this.allData = this.allData.sort((x: any, y: any) => {
      let a = x[index.colEname], b = y[index.colEname];
      if (index.type === 'number') {
        a = Number(a || 0);
        b = Number(b || 0);
      } else {
        a = JSON.stringify(a || null);
        b = JSON.stringify(b || null);
      }
      return (type === 'ascend') ? (a > b ? 1 : -1) : (b > a ? 1 : -1);
    });
    this.currentChange = true;
    this.showDataFun(this.allData);
  }
  //filter
  filterData(data: any[] | any, name: string) {

    this.filterSearch[name] = [...(Array.isArray(data) && data || [])];

    if (!Array.isArray(data) || (data.length < 1)) { //每列重置
      this.filterSearch[name] = [];
      this.allData = [...this.constData];
    } else {  //确定
      this.allData = this.constData.filter((x: any) => {
        let xName = x[name] !== null && x[name] !== undefined && x[name].toString().trim() || '';
        return this.filterSearch[name].indexOf(xName) !== -1;
      })
    }

    //对别的已选做刷选
    let arr = [...this.allData];
    this.allData.map((x: any, index: number) => {
      Object.keys(this.filterSearch).map((y: string) => {
        if (y !== name.trim()) {
          let xName = x[y] !== null && x[y] !== undefined && x[y].toString().trim() || '';
          if ((this.filterSearch[y].length > 0) && (this.filterSearch[y].indexOf(xName) === -1)) {
            arr[index] = undefined;
          }
        }
      })
    })

    this.allData = arr.filter((x: any) => x !== undefined);
    this.currentChange = true;
    this.showDataFun(this.allData);
  }
  //colDrag
  coldrag(data: any) {
    //   this.dataHeader[data.index - 1].width = `${data.pre}px`;
    const canMoveX = data.canMoveX;
    let index = data.index;
    if (this.isCheckBox && index === 0 ){
      index = this.dataHeader.length;
    }
    if(index===0){
      return;
    }
    const originWidth = parseInt(this.dataHeader[index - 1].width.replace('px',''));
    const newWidth = originWidth + canMoveX;
    this.dataHeader[index - 1].width = `${newWidth}px`;
    // this.dataHeader[data.index].width = `${data.nex}px`;

  }

  ngOnDestroy() {
    this.gloColSub && this.gloColSub.unsubscribe();
    this.gloPageSub && this.gloPageSub.unsubscribe();
  }

  getSelectData(data: Array<any>, valueSetCode: string) {
    this.http.post(urls.static, { valueSetCode: valueSetCode }).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  /**
   * 设置表头是否显示筛选和排序
   */
  setFilterFlag(){
    this.filterFlag = !this.filterFlag;
    if (!this.filterFlag){
      this.filterSearch = {};
      this.allData = [...this.constData];
      this.currentChange = true;
      this.showDataFun(this.allData);
    }
    this.simpleCache.setLocal(this.getFilterFlagBufferName(), this.filterFlag);
  }

  /**
   * 导出
   */
  export(){
    // 文件名：画面中文名称+日期.xlsx
    const filename = this.titleServe.getTitle().substring(5) + Utils.dateFormat(new Date(), 'yyyy-MM-dd') + '.xlsx';
    const arrCname = [], arrEname = [];
    const data = [];
    this.dataHeader.forEach(item => {
      arrCname.push(item.colCname);
      arrEname.push(item.colEname);
    });
    data.push(arrCname);
    this.constData.forEach(rowData =>{
      let row =[];
      arrEname.forEach(colEname=>{
        row.push(rowData[colEname]);
      })
      data.push(row);
    });
    var ws_name = "SheetJS";
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    //执行导出
    XLSX.writeFile(wb, filename);
  }
  
}
