import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'common-page',
  templateUrl: './common-page.component.html',
  styles: []
})
export class CommonPageComponent implements OnInit {
  private _selectArr: any[] = [];
  @Input() closeBgTr = true;
  @Input() trSelectedShow = false;
  @Input() trSelected: boolean[] = []; // 列表index以作区分
  @Input() selfTableHeight: string|null|undefined; // 自定义高度
  @Input() extraTableHeight: number; // 非正常模式下gird自适应超出的的高度
  @Output() currentTableHeightFun = new EventEmitter<number>(); // 自适应高度抛出

  @Input() listWidth: string; // list宽度
  @Input() columns: any[]; // 自定义表头 [{colCname:'中文名',colEname:'英文名'}]
  @Input() tabArr: any[] = []; // tab头 不要用
  @Input() tabIndex = 0; // 激活的面板,默认第一个 不要用
  @Input() updateHeader = false; // 点击tab是否更新表头 不要用
  @Input() isCheckBox = true; // 是否显示选择框,默认显示
  @Input() isMutli: boolean; // 选择框是否多选
  @Input() pageSize = 100; // 条数
  @Input() dataSet: Array<any> = []; // 列表数据
  @Input() totalPage = 0; // 数据总数
  @Input() listLoading: boolean; // list加载
  @Input() gridId: string; // 一个页面多个列表必填，传gridId以进行区分，
  @Input() nzShowPagination = true; // 是否显示分页器
  @Input() paginationRef: TemplateRef<any>;
  @Input() showCount = true; // 是否显示选择条数
  @Input() colSet = true;
 // @Input() btnshow: boolean = true;//按钮显示
  @Input() pageFun: boolean; // true页码条数自写

  @Input() formId: string;
  @Input() btnDisable: any = {}; // 按钮禁止
  @Input() btnLoading: any = {}; // 按钮loading
  @Input() btnHiden: any = {}; // 按钮隐藏tnHiden:any = {};//按钮隐藏

  @Input() gridOperate: any; // 操作
  // @Output() gridOperateClick = new EventEmitter<any>();//操作

   @Input() searchDataHiden: any = {}; // 查询区域对应隐藏
    @Input() businessModuleNamecheck: boolean =true;
   @Input() triggerSearch = false;
   @Input() caculateEnameArr: any = []; // 汇总需要汇总的字段
   @Output() search = new EventEmitter<object>(); // 查询
    @Output() searchDataReturn = new EventEmitter<any>(); // 数据返回
    @Output() searchComponent = new EventEmitter<any>(); // 查询数据返回
    @Output() reset = new EventEmitter<any>(); // 查询重置

   @Output() btnDataReturn = new EventEmitter<any>(); // 按钮数据返回
   @Output() btnAdd = new EventEmitter<any>(); // 新增
   @Output() btnUpdate = new EventEmitter<any>(); // 修改
   @Output() btnDelete = new EventEmitter<any>(); // 删除
   @Output() btnClick = new EventEmitter<any>(); // 其他点击
   @Output() tabResultFun = new EventEmitter<any>(); // tab点击
   @Output() btnSearch = new EventEmitter<boolean>(); // 查询按钮


   @Output() updateDataResult = new EventEmitter<any>(); // 选中数据的结果
   @Output() listClick = new EventEmitter<any>(); // list点击事件
   @Output() listOver = new EventEmitter<any>(); // list鼠标移入事件
   @Output() listLeave = new EventEmitter<any>(); // list鼠标移出事件
   @Output() inputBlurFun = new EventEmitter<any>(); // input blur
   @Output() modelChange = new EventEmitter<any>(); // input ModelChange
   @Output() pageIndexEmit = new EventEmitter<any>(); // 页码点击事件
   @Output() pageSizeEmit = new EventEmitter<any>(); // 条数点击事件
   @Output() userColumnsEmit = new EventEmitter<any>(); // 表头数据返回

   @Output() inpEmit = new EventEmitter<any>(); // 返回数据弹框inpName,inpValue,index,rowid,colEname
   @Output() currentPageDataChangeEmit = new EventEmitter<any>(); // 当前页面数据更改

  constructor() {

   }

  ngOnInit() {
  }
  btnSearchFun(type: boolean) {
    this.btnSearch.emit(type);
  }
  searchReset(data: any) {
    this.reset.emit(data);
  }
  listSearch(data: any): void { //
    this.search.emit(data);
  }
  buttonClick(type: any) {
    // tslint:disable-next-line: no-unused-expression
    type.buttonId !== 'Find' && this.btnClick.emit({type: type, data: this._selectArr}); //按钮点击事件触发
    // tslint:disable-next-line: no-unused-expression
    type.buttonId === 'Add' && this.btnAdd.emit({data: this._selectArr});
    // tslint:disable-next-line: no-unused-expression
    type.buttonId === 'Update' && this.btnUpdate.emit({data: this._selectArr});
    // tslint:disable-next-line: no-unused-expression
    type.buttonId === 'Delete' && this.btnDelete.emit({data: this._selectArr});
  }
  searchDataFun(data: any) {
     this.searchDataReturn.emit(data);
  }
  searchComponentFun(data: any) {
     this.searchComponent.emit(data);
  }
  tabclick(data: any): void {
    this.tabResultFun.emit(data);
  }
  updataClick(data: any) {
   this._selectArr = data;
   this.updateDataResult.emit(data);
  }
  tdClick(data: any) {
   this.listClick.emit(data);
  }
  listOverFun(data: any) {
     this.listOver.emit(data);
  }
  listLeaveFun(data: any) {
     this.listLeave.emit(data);
  }
  onChange(data: any) {
    this.modelChange.emit(data);
  }
  blurFun(data: any) {
    this.inputBlurFun.emit(data);
  }
  pageIndexFun(data: any) {
     this.pageIndexEmit.emit(data);
  }
  pageSizeFun(data: any) {
    this.pageSizeEmit.emit(data);
  }
  getUserColumns(data: any) {
     this.userColumnsEmit.emit(data);
  }
 /* operateClick(data:any){
    this.gridOperateClick.emit(data);
  }*/
  inpEmitFun(data: any) {
    this.inpEmit.emit(data);
  }
  currentPageDataChange(data: any) {
    this._selectArr = [];
    this.currentPageDataChangeEmit.emit(data);
  }
  btnDataFun(data: any) {
     this.btnDataReturn.emit(data);
  }
  tableHeightOut(data: number) {
     this.currentTableHeightFun.emit(data);
  }
}
