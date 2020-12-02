import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { isInt } from '@validator/validator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  readonly maxPageSize = 1000000; // 全部显示
  _pageSize = 1000;
  _pageIndex = 1;
  _total: number;
  @Input() set nzTotal(val: number) {
    this._total = isNaN(val) ? 0 : val;
  }
  @Input() paginationRef: TemplateRef<any>;
  @Input() nzPageSizeOptions: number[] = [30, 100, 500, 1000, 5000];
  @Input() nzShowPagination = true;
  @Input() showCount = true;
  @Input() colSet = true;
  @Input() selectCount = 0;
  @Output() nzPageSizeChange = new EventEmitter<number>();
  @Output() nzPageIndexChange = new EventEmitter<number>();
  @Input() set nzPageIndex (val: number) {
     this._pageIndex = val;
  }
  get nzPageIndex () {
    return this._pageIndex;
  }
  @Input() set nzPageSize (val: number) {
    this._pageSize = val;
  }
  get nzPageSize() {
    return this._pageSize;
  }
  @Input() formId: string; // formId 优先级高
  @Input() gridId: string; // 一个页面多个列表必填，传gridId以进行区分，
  @Input() caculateEnameArr: any = []; // 需要汇总显示的字段
  @Input() changedHeaders: any[] = [];
  constructor() { }

  ngOnInit() {
  }
  pageSizeChange() {
    this._pageIndex = 1;
    this.nzPageSizeChange.emit(this._pageSize);
  }
  pageIndexChange(val: any) {
   const i = Math.ceil(this._total / this._pageSize);
     if ( isInt(val.value) && (val.value > 0) && (val.value <= i) && (val.value != this._pageIndex) ) {
       this._pageIndex = val.value;
       this.nzPageIndexChange.emit(this._pageIndex);
     }
      val.value = '';
  }
  pageIndexFun(val: number) {
     this._pageIndex = val;
     this.nzPageIndexChange.emit(this._pageIndex);
  }
}
