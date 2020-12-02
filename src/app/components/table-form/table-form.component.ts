import {Component, OnInit, Input, Output, EventEmitter, TemplateRef, OnDestroy, ViewChild, Host} from '@angular/core';
// import { trigger, transition, animate,style} from '@angular/animations';
import {NzTabChangeEvent, NzTableComponent} from 'ng-zorro-antd';
import { UserinfoService } from '@service/userinfo-service.service';
import { GlobalService } from '@service/global-service.service';
import { urls } from '@model/url';
import { HttpUtilService } from '@service/http-util.service';
import { Utils } from '@util/utils';
import { toDemical } from '@validator/validator';
import { GridRowSource } from '../simple-page/grid-block/grid-row.directive';

import {Subscription, Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-table-form',
  templateUrl: `./table-form.component.html`,
  styleUrls: ['./table-form.component.css'],
  providers: [
    GridRowSource,
  ],
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
export class TableFormComponent implements OnInit,OnDestroy {
  // tempfindSet: any = { "parameter": "companyName", "parameterSend": "companyId", "name": "发票抬头", "formId": "company_pop" };
  // 数据弹框传入参数配置格式
  @ViewChild('nzTable') nzTableComponent: NzTableComponent;
  private gloPageSub: Subscription;
  private gloColSub: Subscription;
  private gloSelectedSub: Subscription;
  private _columns: any[];
  tableHeight = '500px';
  tableWidth = '100%';
  allChecked = false;
  indeterminate = false;
  updateData: Array<any> = [];
  dataHeader: Array<any> = []; // 表头
  dataHeaderRefresh = false; // 判断表头是否刷新
  pageIndex = 1; // 当前页码
  _trSelected: boolean[] = [];
  _gridOperate: any = {}; // 操作{show:false,title:'操作',width:'120px',template:''};
  _calTotalFiled: any = {};

  _totalPage = 0;
  _pageSizeOptions: number[] = [30, 100, 500, 1000, 5000, 1000000]; // 1000000 显示全部
  headerFilter: any = {}; // filter数据
  filterSearch: any = {}; // filter条件
  allData: any[] = [];
  curFormId: string;
  virtualMinBuffer: number;
  virtualMaxBuffer: number;
  private constData: any[] = [];

  private currentChange = false;
  private trSelectHand = false; // 判断是否
  @Input() noGetStaticData: boolean; // 不用获取静态数据 设置True
  @Input() closeBgTr = true; // tr换行背景色是否显示
  @Input() selfTableHeight: string | null | undefined; // 表格高度自适应，如果不需要自适应可设置该参数 自定义table高度
  @Input() extraTableHeight: number; // 正常模式页面额外的高度
  @Output() currentTableHeightFun = new EventEmitter<number>(); // 如果表格高度是自适应的，抛出表格高度

  @Output() inpEmit = new EventEmitter<any>();

  @Input() tabArr: any[] = []; // tab头数据 不要用
  @Input() tabIndex = 0; // 激活的面板,默认第一个
  @Output() tabIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() updateHeader = false; // 点击tab是否更新表头
  @Output() tabResultFun = new EventEmitter<any>(); // tab头点击事件

  @Input() set columns(val: any[]) {  // 自定义表头 [{colCname:'中文名',colEname:'英文名',visible:'XSBJ10'|'XSBJ20'}]
       this._columns = val;
       if (Array.isArray(this._columns)) { this.columnsFilter(this._columns); }
  }
  get columns() {
    return this._columns;
  }

  @Input() checkBoxWidth: string;
  @Input() listWidth: string; // list宽度
  @Input() trSelectedShow = false; // 选中是否显示样式
  @Input() set trSelected(val: boolean[]) { // index以作区分
       if (Array.isArray(val)) {
        this._trSelected = val;
        this.trSelectHand = true;
       }
  }
  get trSelected() {
    return this._trSelected;
  }
  @Input() formId: string; // formId 优先级高
  @Input() gridId: string; // 一个页面多个列表必填，传gridId以进行区分，

  @Input() isCheckBox = true; // 是否显示选择框,默认显示
  @Input() disabledAllCheckBox:boolean = false;//是否禁止全选，默认允许
  @Input() isMutli: boolean; // 选择框是否多选
  @Input() nzShowPagination = true; // 列表是否显示分页器 ,默认显示
  @Input() showCount = true; // 是否显示选择条数
  @Input() pageSize = 100; // 条数 默认100
  @Input() paginationRef: TemplateRef<any>;
  @Input() tdTemplate:TemplateRef<any>;
  @Input() set pageSizeOptions(val: number[]) { // 页码自定义
      this._pageSizeOptions = val;
  }
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  @Input() colSet = true; // 列表设置是否显示
  @Input() isResetFilter: boolean; // 是否对filte进行重置
  // 列表数据
  @Input() set dataSet(val: any[]) { // 只接收外部传进的值
    if (this.isResetFilter) {
      this.filterSearch = {}; // filter重置 已筛选的存储
    }
    this.currentChange = false;
    this.allData = [];
    this.constData = Array.isArray(val) ? val : []; // 数量不可变
    window.setTimeout(() => {
      this.allData = [...this.constData];
      this.dataFilterResult();
      this.headerFilterData(this.allData);
    },300);
}

  // 数据总数
  @Input() set totalPage(val: number) {
     this._totalPage = val;
  } // 数据总数
  get totalPage() {
    return this._totalPage;
  }
  @Input() listLoading: boolean; // list加载

  @Input() pageFun: boolean; // true页码条数自写

  @Input() set gridOperate(val: any) { // 表格操作自定义
     if (Utils.isObject(val)) {
      this._gridOperate.show = val.show;
      this._gridOperate.title = val.title || '操作';
      this._gridOperate.width = val.width || '120px';
      this._gridOperate.template = val.template;
     }

  } // 操作{show:false,title:'操作',width:'120px',template:''};
  @Input() caculateEnameArr: any = [

  ];

  @Input() set refresh(val:any){  //用于初始化表格中存在已选数据，选中条数的变化,想触发必须更改成不同值
    this.refreshStatus();
  }
  @Input() popData: any;
  @Input() popTableData: any = [];
  @Input() searchParamFiled: any; // pop弹框调接口要传的参数名
  @Input() searchParamFiledNot: any; // pop弹框调接口要传的参数名不必传 {eName:ttrue}，格式
  @Input() tableTitle: string|TemplateRef<void>; // 表格标题
  @Input() tableFooter: string|TemplateRef<void>; // 表格尾部
  @Input() selectedChange = false;  // 全选事件订阅
  @Input() searchListFiled: any;  // pop弹窗取当前数据哪个字段的值
  @Input() staticCode: (data: string, item?: any) => Observable<any[]>; // 组件内静态数据自定义  [{name: null, value: null}]
  @Input() needStaticCode: boolean; // 当没有apiParam时需要获取静态数据时设为true

  @Output() updateDataResult = new EventEmitter<any>(); // 选中数据的结果以及点击列表选择框事件
  @Output() inputBlurFun = new EventEmitter<any>(); // input Blur失焦
  @Output() modelChange = new EventEmitter<any>(); // input值改变事件
  @Output() listClick = new EventEmitter<any>(); // list点击事件
  @Output() listOver = new EventEmitter<any>(); // list鼠标移入事件
  @Output() listLeave = new EventEmitter<any>(); // list鼠标移出事件
  @Output() pageIndexEmit = new EventEmitter<any>(); // 页码点击事件
  @Output() pageSizeEmit = new EventEmitter<any>(); // 条数点击事件
  @Output() userColumnsEmit = new EventEmitter<any>(); // 表头数据返回
  @Output() currentPageDataChangeEmit = new EventEmitter<any>(); // 当前页面数据更新
  @Output() selectedChangeEmit = new EventEmitter<any>(); // 勾选事件，抛出数据
  @Output() keyboardEmit =  new EventEmitter<any>()
  constructor(private http: HttpUtilService, private info: UserinfoService, private globalSer: GlobalService,
    @Host() private rowSource: GridRowSource) {
  }

  private restoreRender(item: any) {
    if (item.type === 'template') {
      const tplName = `tpl-${item.gridId}-${item.colEname}`;
      item.template = this.rowSource.getRow(tplName);
      if (!item.template) {
        console.error(`template类型列配置错误！templateId:${tplName}`);
      }
    }
  }

  ngOnInit() {
    this.virtualMinBuffer = parseInt(this.selfTableHeight || this.tableHeight, 0);
    this.virtualMaxBuffer = this.virtualMinBuffer + 100;

     this.curFormId = this.formId || this.info.APPINFO.formId;
     if (!this._columns) {
       this.getUserColumns({formId: this.curFormId, userId: this.info.APPINFO.USER.userId,gridId: this.gridId});
     }
     this.gloPageSub = this.globalSer.pageNumEmitter.subscribe( (x: any) => {
       if (this.curFormId === x.formId) {
        this.pageIndex = x.page;
       }
      });
     this.gloColSub = this.globalSer.colChangeEmitter.subscribe(
       (res: any) => this.getUserColumns({formId: this.curFormId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId})
       );
      for (const c of this.caculateEnameArr) {
        this._calTotalFiled[c.field] = toDemical(0, c.demLength);
        c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
      }
      if (this.selectedChange) {
        this.gloSelectedSub = this.globalSer.tableSelectedChangeEmitter.subscribe(
          res => {
              if (res.gridId === this.gridId) {
                this.checkAll(res.checked)
              }
            }
        );
      }
      this.globalSer.tableGridIdToSearchForm.emit({'gridId': this.gridId, 'formId': this.curFormId}); // 向查询区域传递gridId;
      this.globalSer.routerEvent.subscribe((x: any) => {
        if (x.isSys) {
            this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(0);
        }
      });

      this.globalSer.pageNumEmitter.emit(
        {formId: this.curFormId, gridId: this.gridId, page: 1, length: this.pageSize, search: true}
        ); // 初始化的条数
  }

  tableHeightFun(data: number) { // 表格自适应抛出数据
    this.tableHeight = `${data}px`;
    this.currentTableHeightFun.emit(data);
    this.virtualMinBuffer = data;
    this.virtualMaxBuffer = this.virtualMinBuffer + 100;
  }
  // 选择逻辑
  refreshStatus(data?: any): void {
     let currentChecked: boolean;
    if (data && !this.isMutli) {
      currentChecked = data.checked;
    }

      this.allData.map((y: any) => !this.isMutli && (y.checked = false));
      if (data && !this.isMutli) {
        data.checked = currentChecked; // 单选情况下设置checked;
      }
     this.allCheckBoxStyle();
     this.updateData =  this.constData.filter((x: any) => x.checked);
     this.updateDataResult.emit(this.updateData); // 选中的结果数据

    // 统计需要统计的字段
     for (const c of this.caculateEnameArr){
       this._calTotalFiled[c.field] = toDemical(0, c.demLength);
      // for (let elem of this.updateData) {
      //   //  this._calTotalFiled[c.field] += Number(elem[c.field]);
      //   this._calTotalFiled[c.field] = toDemical(Utils.add(this._calTotalFiled[c.field], elem[c.field]),c.demLength);
      //  }
      // 2019-1-14郑鑫修改， 将每次求和都四舍五入改为将最后结果四舍五入
       this._calTotalFiled[c.field] = toDemical(
         this.updateData.map(item => Number(item[c.field]) || 0).reduce((acc, cur) => acc + cur, 0), c.demLength
         );
       c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
     }
     if (data) {
       this.selectedChangeEmit.emit([data]);
     } else {
       this.selectedChangeEmit.emit(this.allData);
     }
  }
  private allCheckBoxStyle() {
    const dataArr = this.allData.filter(value => !value.disabled);
    const allChecked = dataArr[0] ? dataArr.every(value => value.checked === true) : false;
    const allUnChecked = dataArr.every(value => !value.checked);
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
   // 表头获取
    getUserColumns(param: any): void { // 获取表头

        this.http.post(urls.columns, param).then( (res: any) => { // 获取表头

          if (res.success) {
            let dataHeader: any;
            dataHeader = res.data.data;
            dataHeader.map((item: any) => {
              item.apiParameter = item.apiParameter && JSON.parse(item.apiParameter) || {};
            });
            this.columnsFilter(dataHeader, 'http');
            this.dataHeader.forEach(
              item => {
                if (item.type === 'select' && item.visible === 'XSBJ10' ) { // 新增可见调用
                  item.apiParameter.optionList =item.apiParameter.optionList || [];
                  // 添加noSetCode 属性为true 可以关闭组件内静态数据 的获取
                  // tslint:disable-next-line: max-line-length  当没有设置valueSetCode时需要staticCode时添加edit条件，需要设置needStaticCode为true
                  if ((item.apiParameter.valueSetCode || (item.edit === 'BJBJ10' && this.needStaticCode)) && !item.noSetCode && !this.noGetStaticData) {
                    this.getSelectData(item.apiParameter.optionList,item.apiParameter.valueSetCode, item);
                  }
                }
                this.restoreRender(item);
              }
            );
          }
      });
    }
    // 表头获取数据刷选
    columnsFilter(dataHeader: any[], type?: string) {
      let len = 0, width = 0;
      this.dataHeader = dataHeader.filter((x: any) => x.visible === 'XSBJ10');
      this.dataHeader.map((item: any) => {
          width = parseFloat(item.width) ? parseFloat(item.width) : 120;
          len = Utils.add(len, width);
          item.width = `${width}px`;
      });
      const checkBoxWidth = this.isCheckBox ? 50 : 0;
      const gridOperateWidth = this._gridOperate.show ? parseFloat(this._gridOperate.width) : 0;
      this.tableWidth = `${ Utils.add(Utils.add(len, checkBoxWidth), gridOperateWidth)}px`; // 默认加上选择框的
       // 返回表头数据
      if (type === 'http') { this.userColumnsEmit.emit(this.dataHeader); }

      this.dataHeaderRefresh = true; // 表头是否刷新
      window.setTimeout(() => {
        this.dataHeaderRefresh = false;
      });

    }
    // 改变页码
    pageChange(n: number): void {
      this.pageIndex = n;
      !this.pageFun ? this.globalSer.pageNumEmitter.emit({formId: this.curFormId, gridId: this.gridId, page: n,
         // tslint:disable-next-line:no-unused-expression
         length: this.pageSize}) : null;
       this.pageIndexEmit.emit(n);
    }
    // 改变条数
    pageSizeFun(n: number): void {
      this.pageIndex = 1;
      // tslint:disable-next-line:no-unused-expression
      !this.pageFun ? this.globalSer.pageNumEmitter.emit({formId: this.curFormId, gridId: this.gridId, page: 1, length: n}) : null;
      this.pageSizeEmit.emit(n);
    }
    // 当前展示数据改变要做的处理
    currentPageDataChange(data: any): void {
      if (this.currentChange) {
        return;
      }
      this.allChecked =  false;
      this.indeterminate = false;
      this.allCheckBoxStyle();
      this.updateData = [];
      if (this.constData && this.constData[0]) {
        this.updateData =  this.constData.filter((x: any) => x.checked);
      }
      if (!this.trSelectHand) { this._trSelected = []; } // 如果传trSelected属性，则刷新列表手动清除选中样式
      this.currentPageDataChangeEmit.emit(data);

      for (const c of this.caculateEnameArr) {
        this._calTotalFiled[c.field] = toDemical(0, c.demLength);
        c.revStr = `${c.tipInfo} ${this._calTotalFiled[c.field]} ${c.tipInfoType}`;
      }

    }
    // tab头点击
    tabClick(data: any): void {  // 不要用
      this.tabResultFun.emit(data);
      setTimeout( () => {
        if (this.updateHeader) {
          if (!this._columns) {
            this.getUserColumns({formId: this.curFormId, userId: this.info.APPINFO.USER.userId, gridId: this.gridId}); // 参数待定
          }
        }
      }, 100);
    }
    // input失焦事件
    inputBlur(data: any, dex: number){
       this.inputBlurFun.emit({data: data, index: dex});
    }
    // input实时改变事件
    onChange(val: string, data: any, n: any, h: any, ind: any){
      this.modelChange.emit({val: val, data: data, input: n, header: h, index: ind});
    }
    // list鼠标移入事件
    listOverFun(data: any, index: number){
       this.listOver.emit({'data': data, 'index': index});
    }
    // list鼠标移出事件
    listLeaveFun(data: any, index: number){
      this.listLeave.emit({'data': data, 'index': index});
    }
    // 表格列表点击事件
    tdClick(data: any, index: number, bol: boolean){
      if (!bol) {
         return;
      }
      this._trSelected = [];
      this._trSelected[index] = true;
      this.listClick.emit(data);
      this.allCheckBoxStyle();
      this.updateData = [];
      if (this.constData && this.constData[0]) {
        this.updateData =  this.constData.filter((x: any) => x.checked);
      }
    }
    // 操作
    inpEmitFun(data: any, dex: any, rowid: any, n: any) {
      this.inpEmit.emit(
        { inpName: data.inpName || '', inpValue: data.inpValue || '',
        selData: data.selData || {}, index: dex, rowid: rowid, eName: n.colEname}
        );
    }
    //
    filterChange(bool: Boolean, viewer: any, header: any){
      if (!bool) {
        viewer.scrollToIndex(0);
        const name = header.colEname;
        header._checked = [];
        this.headerFilter[name].forEach(x => x.checked && header._checked.push(x.text));
        this.filterData(header._checked, name);
      }
    }
    // sort 排序
    sort(flag: any, index: any) {
     // flag 排序类型 null descend ascend
      const type = !flag ? 'descend' : flag === 'descend' ? 'ascend' : null;
      index._sortType = type;
      // if (!type){
      //   this.allData = [...this.constData];
      //   return;
      // }
      this.allData = this.allData.sort((x: any, y: any) => {
        let a = x[index.colEname], b = y[index.colEname];
        if (index.type === 'number') {
            a = Number(a || 0);
            b = Number(b || 0);
        } else {
          a = JSON.stringify(a || null);
          b = JSON.stringify(b || null);
          if (index.type === 'string') {
            return (type === 'ascend') ? a.localeCompare(b, 'zh') : b.localeCompare(a, 'zh');
          }
        }
        return (type === 'ascend') ? ( a > b ? 1 : -1) : (b > a ? 1 : -1);
      } );
      this.currentChange = true;
      this.allData = [...this.allData];
    }
    // filter 关闭
    filterClose(flag: string, header: any){
         const name = header.colEname;
         header._checked = [];
         if (flag === 'confirm') {
           this.headerFilter[name].forEach(x => x.checked && header._checked.push(x.text));
         } else if (flag === 'reset') {
           this.headerFilter[name].forEach(x => x.checked = false);
           header._filterVal = null;
         }
         header._filterVisible = false;
         this.filterData( header._checked, name);
    }
    // filter 刷选
    filterData(data: any[]|any, name: string){
     this.filterSearch[name] = [...( Array.isArray(data) && data || [])];

      if (!Array.isArray(data) || (data.length < 1) ) { // 每列重置
        this.updateData.forEach((item: any) => item.checked = false); // 选中重置
        this.updateData = [];
        this.allChecked = false;
        this.indeterminate = false;
        this.filterSearch[name] = [];
        this.allData = [...this.constData];
      } else {  // 确定
        this.allData = this.constData.filter((x: any) => {
          const xName = x[name] !== null && x[name] !== undefined && x[name].toString().trim() || '';
             return this.filterSearch[name].indexOf(xName) !== -1;
          })
      }

      // 对别的已选做刷选
      const arr =  [...this.allData];
         this.allData.map((x: any, index: number) => {
            Object.keys(this.filterSearch).map((y: string) => {
               if (y !== name.trim()) {
                const xName = x[y] !== null && x[y] !== undefined && x[y].toString().trim() || '';
                    if ( (this.filterSearch[y].length > 0) && (this.filterSearch[y].indexOf(xName) === -1) ) {
                         arr[index] = undefined;
                    }
               }
            });
        });

      this.allData = arr.filter((x: any) => x !== undefined);
      this.currentChange = true;
      this.headerFilterData(this.allData);
    }
    // colDrag 列拖拽
    coldrag(data: any) {
     let tableWidth = parseFloat(this.tableWidth);
     const currentWidth = parseFloat(this.dataHeader[data.index].width);
     tableWidth = tableWidth - currentWidth;
     this.tableWidth = `${tableWidth + data.nex}px`;
     this.dataHeader[data.index].width = `${data.nex}px`;
    }

    ngOnDestroy() {
      if (this.gloColSub) { this.gloColSub.unsubscribe(); }
      if (this.gloPageSub) { this.gloPageSub.unsubscribe(); }
      if (this.gloSelectedSub) { this.gloSelectedSub.unsubscribe(); }
    }
   // static 静态数据获取
    getSelectData(data: Array<any>, valueSetCode: string, item: any) {
      if (this.staticCode) {
        this.staticCode(valueSetCode, item).subscribe( x => {
          Array.prototype.push.apply(data, x);
        })
        return;
      }
      this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
        (res: any) => {
          if (res.success) {
            Array.prototype.push.apply(data, res.data.data.data);
          }
        }
      );
    }
    private headerFilterData(data: any) {
       // filter数据,$~$
      const hadFilter = Object.keys(this.filterSearch).map((x: string) => (this.filterSearch[x].length > 0) && x);
      window.setTimeout(() => {
        let colHad = {}, tempStr: string;
        this.dataHeader.map((y: any) => {
          if (!hadFilter.includes(y.colEname)) { this.headerFilter[y.colEname] = []; }
        });
       data.map((x: any) => {
          this.dataHeader.map((y: any) => {
            const yname = (x[y.colEname] === '' || x[y.colEname] == null || x[y.colEname] === undefined) ? '' : x[y.colEname];
            tempStr = y.colEname + yname;
            if (!colHad[tempStr] && !hadFilter.includes(y.colEname)) {
              const xName =  yname.toString().trim() || '';
              this.headerFilter[y.colEname].push({'text': xName, 'value': xName});
              colHad[tempStr] = true;
            }
          });
        });
        colHad = undefined; // 清空
      });
    }
    private dataFilterResult() {
       let u: any[] = [...this.allData];
       let enterBool = false;
       for (const i in this.filterSearch) {
         if(this.filterSearch[i].length > 0) {
          enterBool = true;
          u = u.filter((m: any) => this.filterSearch[i].includes(m[i] || ''));
         }
       }
       if (enterBool) { this.allData = [...u]; }
    }

  /**
   * tab change事件
   * @param param
   */
  tabIndexChangeEvent(param: number) {
    this.tabIndexChange.emit(param);
  }

  keyUp(data:any,tableData:any){
    this.keyboardEmit.emit({keyboardData:data,tableData:tableData});
  }

  isNotSelected(data: any,colEname:string): boolean {
    return !this.allData.some(value1 => value1[colEname] === data.value);
  }

}
