import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Host } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { urls } from '../../../common/model/url';
import { format as dateformat }  from 'date-fns';
import { GridRowSource } from './grid-row.directive';

@Component({
  selector: 'app-grid-block',
  templateUrl: './grid-block.component.html',
  styleUrls: ['./grid-block.component.css'],
  providers: [
    GridRowSource,
  ],
})
export class GridBlockComponent implements OnInit {
  _data: Array<any>;// 表格数据
  // @Input() data: Array<any>;// 表格数据
  _columns: Array<any>;// 列信息
  _loading: boolean;// 表格数据是否加载中
  // checkbox部分选择标记，mode==='multiple'
  _indeterminate: boolean = false;
  // checkbox全部选择标记，mode==='multiple'
  _allChecked: boolean = false;
  checkboxWidh: number = 40;
  checkboxWidhStr: string = `${this.checkboxWidh}px`;

  tableWidth: string = '100%';

  @Output() paginationChange = new EventEmitter();// 翻页、页面数量变化事件
  @Output() checkboxClick = new EventEmitter();// 选中数据
  @Output() rowClick = new EventEmitter();// 选中数据

  @Input() formId: string;
  @Input() gridId: string;
  @Input() userId: string;
  // checkbox模式 none：不显示；multiple：多选；single：单选； 默认为多选
  @Input() mode: 'none' | 'multiple' | 'single';
  @Input() showPagination: boolean;
  @Input() rowClickTime = 200;
  

  // 数据总条数
  @Input()
  set total(total: number) {
    // 如果数据总数大于0，并且当前页数据数量为0，并且总条数小于等于分页数*页数量，则将页码调整至最后一页
    if (total > 0 && this._data.length == 0
      && total <= (this.paginationInfo.pageIndex - 1) * this.paginationInfo.pageSize) {
      this.paginationInfo.pageIndex = Math.ceil(total / this.paginationInfo.pageSize);
      this.paginationChange.emit(this.getQueryPaginationObj());
    } else {
      this.paginationInfo.total = total;
    }

  }
  get total(): number {
    return this.paginationInfo.total;
  }

  // 每页显示数量
  @Input() 
  set pageSize(pageSize: number){
    this.paginationInfo.pageSize = pageSize || this.paginationInfo.pageSize;
    this.paginationChange.emit(this.getQueryPaginationObj());
  }
  get pageSize(): number{
    return this.paginationInfo.pageSize;
  }

  @Input()
  set data(data: Array<any>){
    this._data = data || [];
  }
  get data(): Array<any>{
    return this._data;
  }

  @Input()
  set columns(columns: Array<any>){
    if(columns){
      this._columns = this.columns;
      this.handleColumn(this._columns);
    }else {
      this.getColumns();
    }
  }
  private getColumns(){
    this.http.post(urls.columns, { formId: this.formId, gridId: this.gridId, userId: this.userId }).then((res: any) => {
      if (res.success) {
        // 只渲染显示列
        this._columns = res.data.data.filter(item => item.visible === 'XSBJ10');
        this.handleColumn(this._columns);
        this._columns.forEach(item => this.restoreRender(item));
      }
    });
  }
  private handleColumn(columns: Array<any>): void {
    // 计算列宽度之和
    this.tableWidth = `${this._columns.map(item => item.width).reduce((acc, item) => acc + item, this.mode === 'none' ? 0 : this.checkboxWidh)}px`;
    // 设置列默认宽度
    this._columns.forEach(item => {
      item.width = !item.width || isNaN(item.width) ? 80 : item.width;
      item.widthStr = `${item.width}px`;
    });
  }
  get columns(): Array<any>{
    return this._columns;
  }  
  
  @Input() 
  set loading(loading: boolean){
    this._loading = loading || false;
  }
  get loading(): boolean{
    return this._loading;
  }  

  constructor(private http: HttpUtilService,
    private appInfo: UserinfoService,
    @Host() private rowSource: GridRowSource,) { }

  ngOnInit() {
    // 界面ID，默认为当前界面ID
    this.formId = this.formId || this.appInfo.APPINFO.formId;
    // 用户ID， 默认为当前用户ID
    this.userId = this.userId || this.appInfo.APPINFO.USER.userId;
    // 是否显示分页器
    this.showPagination = this.showPagination || true;
    // checkbox是选择模式，默认多选
    this.mode = this.mode || 'multiple';
    this.getColumns();
    this._data = this._data || [];
  }

  // 分页信息
  paginationInfo = {
    total: 0,
    pageSize: 10,
    pageIndex: 1,
    pageSizeOptions: [10, 20, 30, 40, 50, 1000],
  }

  /**
   * 获取分页查询对象
   */
  public getQueryPaginationObj(): any {
    // 如果不显示分页器，则从默认查询前10000条数据
    if(this.showPagination === false){
      return { start: 0, length: 10000 };
    }
    return { start: (this.paginationInfo.pageIndex-1)*this.paginationInfo.pageSize, length: this.paginationInfo.pageSize };
  }

  /**
   * 改变页码
   * @param pageIndex 
   */
  pageChange(pageIndex: number): void {
    this.paginationInfo.pageIndex = pageIndex;
    this.paginationChange.emit(this.getQueryPaginationObj());
  }
  /**
   * 改变页显示条数
   * @param pageSize 
   */
  pageSizeChange(pageSize: number): void {
    this.paginationInfo.pageSize = pageSize;
    this.paginationChange.emit(this.getQueryPaginationObj());
  }

  /**
   * 刷新checkbox
   * @param checked 
   */
  refreshStatus(checked?: boolean, index?: any, emit?: boolean): void {
    if (this.mode === 'multiple') {
      const allChecked = this._data.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this._data.filter(value => !value.disabled).every(value => !value.checked);
      this._allChecked = allChecked;
      this._indeterminate = (!allChecked) && (!allUnChecked);
    } else if (this.mode === 'single') {
      // 已经选中，取消所有选中
      if (checked === true) {
        this._data.filter(item => item.disabled !== true).forEach(item => item.checked = false);
      }
      this._data[index].checked = checked;
    }
    if(!isNaN(index) && emit !== false){
      this.checkboxClick.emit({index: index, item: this._data[index]});
    }
  }

  /**
   * 点击全选触发事件
   * @param checked 
   */
  checkAll(checked: boolean): void {
    if(checked){
      this._data.filter(item => item.disabled !== true).forEach(item => item.checked = true);
    }else{
      this._data.filter(item => item.disabled !== true).forEach(item => item.checked = false);
    }
    this.refreshStatus();
  }

  /**
   * 获取选中行数据
   */
  getSelectedRowData(): Array<any> {
    return this.dataFormat(this._data.filter(item => item.checked === true));
  }

  /**
   * 获取行数据
   */
  getRowData(): Array<any> {
    return this.dataFormat(this._data);
  }

  /**
   * 设置选中
   * @param indexArr 选中行下标数组 从0开始
   */
  setRowSelected(indexArr: Array<number>){
    this._data.forEach((item, index) => item.checked = indexArr.some(i => i === index));
    this.refreshStatus();
  }

  /**
   * 设置checkbox是否选中
   * @param index 行下标数组 从0开始
   * @param checked true选中，false不选中
   */
  setRowChecked(index: number, checked: boolean){
    this.refreshStatus(checked, index, false);
  }



  /**
   * 行点击事件
   * @param e 
   * @param item 行数据
   * @param index 行数据下标
   */
  private rowClickCount = 0;
  _rowClick(e: Event, item: any, index: number) {
    if ((e.target as HTMLElement).nodeName === 'INPUT') return;
    ++this.rowClickCount;
    if (this.rowClickCount !== 1) return;
    setTimeout(() => {
      const data = { e, item, index };
      if (this.rowClickCount === 1) {
        this.rowClick.emit({ type: 'click', gridId: this.gridId, ...data });
      } else {
        this.rowClick.emit({ type: 'dblClick', gridId: this.gridId, ...data });
      }
      this.rowClickCount = 0;
    }, this.rowClickTime);
  }


  // /**
  //  * 新增行数据
  //  * @param rowsData 
  //  */
  // addNewRow(rowsData: Array<any>){
  //   const _data = {checked: true, newRow: true, disabled: false}
  //   rowsData.forEach(item => Object.assign(item, _data));
  //   this._data = [...rowsData, ...this._data];
  // }

  /**
   * 数据格式化
   * @param data 
   */
  dataFormat(data: Array<any>): Array<any>{
    const dateColumns = this._columns.filter(item => item.type==='date' || item.type ==='datetime');
    data.forEach(item => {
      dateColumns.forEach(col => {
        if(col.type === 'date'){
          item[col.colEname] = dateformat(item[col.colEname], 'YYYY-MM-DD');
        }else if(col.type === 'datetime'){
          item[col.colEname] = dateformat(item[col.colEname], 'YYYY-MM-DD HH:mm:ss');
        }
      })
    });
    return data;
  }

  private restoreRender(item: any) {
    if(item.type === 'template'){
      const tplName = `tpl-${item.gridId}-${item.colEname}`;
      item.template = this.rowSource.getRow(tplName);
    }
  }
  
}
